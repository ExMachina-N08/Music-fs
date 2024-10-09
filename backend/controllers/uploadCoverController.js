const Album = require("../models/album");
const User = require("../models/user");
const CoverImage = require("../models/coverImage");
const cloudinary = require("../config/cloudinaryConfig");

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = (fileBuffer, albumTitle) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "album_covers", // Folder for album covers in Cloudinary
          public_id: `${albumTitle}-${Date.now()}`, // Unique file name
        },
        (error, result) => {
          if (error) {
            console.error(`Cloudinary upload error: ${error.message}`);
            return reject(
              new Error(`Failed to upload image: ${error.message}`)
            );
          }
          console.log("Cloudinary result: ", result);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

// Upload the album cover image
const uploadCoverImage = async (req, res) => {
  try {
    const file = req.file; // Only expect one image
    const { albumId, artistId } = req.body; // Expect albumId and artistId in the request

    // Verify the album and artist
    const album = await Album.findById(albumId);
    const artist = await User.findById(artistId);

    if (!album) {
      return res.status(400).json({ message: "Invalid album ID." });
    }
    if (!artist) {
      return res.status(400).json({ message: "Invalid artist ID." });
    }

    if (!file) {
      return res.status(400).json({ message: "No cover image uploaded." });
    }

    console.log("Uploading cover image to Cloudinary...");
    const result = await uploadToCloudinary(file.buffer, album.title);
    console.log("Cover image uploaded to Cloudinary: ", result.secure_url);

    // Now save the cover image in the CoverImage collection (optional)
    const newCoverImage = new CoverImage({
      albumId: album._id, // Reference the album's ID
      artistId: artist._id, // Reference the artist's ID
      coverImageUrl: result.secure_url, // Store the Cloudinary URL
    });

    await newCoverImage.save();
    console.log("Cover image saved in the CoverImage collection");

    // Update the album in MongoDB with the cover image URL
    album.coverImageUrl = result.secure_url;
    await album.save();
    console.log("Album updated with the cover image URL");

    return res.status(201).json({
      message: "Cover image uploaded and album updated successfully",
      coverImageUrl: result.secure_url, // Return the Cloudinary URL
      album: album, // Return the updated album details
    });
  } catch (error) {
    console.error("Error uploading cover image:", error.message);
    res
      .status(500)
      .json({ message: `Error uploading cover image: ${error.message}` });
  }
};

module.exports = { uploadCoverImage };
