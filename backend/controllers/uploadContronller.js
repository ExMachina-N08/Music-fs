const Album = require("../models/album");
const Song = require("../models/song");
const User = require("../models/user");
const cloudinary = require("../config/cloudinaryConfig");

// Helper function to upload a song to Cloudinary as an audio file
const uploadSongToCloudinary = (fileBuffer, albumTitle) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto", // Use "video" for audio files in Cloudinary
          folder: "songs", // Folder for songs in Cloudinary
          public_id: `${albumTitle}-${Date.now()}`, // Unique file name
        },
        (error, result) => {
          if (error) {
            console.error(`Cloudinary upload error: ${error.message}`);
            return reject(new Error(`Failed to upload song: ${error.message}`));
          }
          console.log("Cloudinary result: ", result); // Log result from Cloudinary
          resolve(result); // Return Cloudinary result (e.g., secure_url)
        }
      )
      .end(fileBuffer);
  });
};

// Upload an album with multiple songs
const uploadAlbum = async (req, res) => {
  try {
    console.log("Files received in upload:", req.files); // Log all files received
    const songs = req.files.songs || [];

    // If no songs are uploaded, send a response with error
    if (songs.length === 0) {
      return res.status(400).json({ message: "No songs uploaded." });
    }

    // Process album metadata from the request body
    const { title, description, genre, releaseDate, artistId } = req.body;

    // Verify artist exists
    const artist = await User.findById(artistId);
    if (!artist) {
      return res.status(400).json({ message: "Invalid artist" });
    }

    // Create the album entry in the database
    const newAlbum = new Album({
      title,
      artist: artistId,
      description,
      genre,
      releaseDate: releaseDate || Date.now(),
    });

    // Save the album entry before uploading songs
    await newAlbum.save();

    // Fetch the album again to ensure it has the coverImageUrl after potential upload later
    const updatedAlbum = await Album.findById(newAlbum._id);

    // Upload each song to Cloudinary and save it in MongoDB
    const songPromises = songs.map(async (file) => {
      console.log(`Uploading song ${file.originalname} to Cloudinary...`);
      const result = await uploadSongToCloudinary(file.buffer, title); // Upload song as audio
      console.log("Song uploaded to Cloudinary: ", result.secure_url);

      // Create a new song entry in MongoDB
      const newSong = new Song({
        title: file.originalname,
        album: updatedAlbum._id,
        artist: artistId,
        fileUrl: result.secure_url,
        coverImageUrl: updatedAlbum.coverImageUrl || null, // Assign album's cover image to the song
      });

      // Save the song in MongoDB
      await newSong.save();

      // Add the song to the album's song list
      updatedAlbum.songs.push(newSong._id);
      return newSong;
    });

    // Wait for all songs to be uploaded and saved
    await Promise.all(songPromises);

    // Save the updated album with the list of songs
    await updatedAlbum.save();

    // Respond with success and the album with songs
    res.status(201).json({
      message: "Album and songs uploaded successfully",
      album: updatedAlbum,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Separate API for uploading a cover image and assigning it to the album and songs
const uploadCoverImage = async (req, res) => {
  try {
    const { albumId, artistId } = req.body;
    const file = req.file; // Expect only one image file

    // Verify the album exists
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(400).json({ message: "Album not found" });
    }

    // Verify artist
    const artist = await User.findById(artistId);
    if (!artist) {
      return res.status(400).json({ message: "Invalid artist." });
    }

    if (!file) {
      return res.status(400).json({ message: "No cover image uploaded." });
    }

    console.log("Uploading cover image to Cloudinary...");
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image", // Only image uploads here
        folder: "album_covers",
        public_id: `${album.title}-${Date.now()}`,
      },
      async (error, result) => {
        if (error) {
          console.error(`Cloudinary upload error: ${error.message}`);
          return res
            .status(500)
            .json({ message: `Error uploading cover image: ${error.message}` });
        }

        const coverImageUrl = result.secure_url;

        // Update album with cover image URL
        album.coverImageUrl = coverImageUrl;
        await album.save();
        console.log("Album updated with coverImageUrl:", album.coverImageUrl);

        // Update each song in the album to include the cover image URL
        const updateResult = await Song.updateMany(
          { album: album._id },
          { $set: { coverImageUrl: coverImageUrl } }
        );

        if (updateResult.nModified === 0) {
          console.error("No songs were updated with the cover image URL");
          return res
            .status(500)
            .json({ message: "Songs coverImageUrl not updated." });
        }

        console.log("Song update result:", updateResult);

        res.status(201).json({
          message: "Cover image uploaded and album updated successfully",
          album, // Only return the album object (which includes the coverImageUrl)
        });
      }
    );

    uploadStream.end(file.buffer); // End the stream with the image buffer
  } catch (err) {
    console.error("Error uploading cover image:", err.message);
    res
      .status(500)
      .json({ message: `Error uploading cover image: ${err.message}` });
  }
};

module.exports = { uploadAlbum, uploadCoverImage };
