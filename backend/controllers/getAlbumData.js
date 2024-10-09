const Album = require("../models/album");
const Song = require("../models/song");
const User = require("../models/user");

// Get a specific album by ID
const getAlbumData = async (req, res) => {
  try {
    const { albumId } = req.params;

    // Find the album by ID and populate its songs and artist's name
    const album = await Album.findById(albumId)
      .populate({
        path: "songs",
        select: "title fileUrl coverImageUrl", // Include song data
      })
      .populate({
        path: "artist",
        select: "name", // Include artist's name
      });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Remove file extension from song titles
    album.songs.forEach((song) => {
      song.title = song.title.replace(/\.[^/.]+$/, "");
    });

    // Add the albumUrl
    const albumWithUrl = {
      ...album.toObject(),
      albumUrl: `/api/get/album/${album._id}`,
    };

    res
      .status(200)
      .json({ message: "Album fetched successfully", album: albumWithUrl });
  } catch (err) {
    console.error("Error fetching album:", err.message);
    res.status(500).json({ message: "Error fetching album" });
  }
};

// Fetch recent albums with pagination
const getRecentAlbums = async (req, res) => {
  const { page = 1, limit = 8 } = req.query; // Pagination params

  try {
    const recentAlbums = await Album.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(limit * 1) // Limit to `limit` results
      .skip((page - 1) * limit) // Skip according to the page number
      .populate({
        path: "artist",
        select: "name", // Include artist's name
      });

    // Add albumUrl to each album
    const albumsWithUrl = recentAlbums.map((album) => ({
      ...album.toObject(),
      albumUrl: `/api/get/album/${album._id}`,
    }));

    res.status(200).json({
      message: "Recent albums fetched successfully",
      albums: albumsWithUrl,
    });
  } catch (err) {
    console.error("Error fetching recent albums:", err.message);
    res.status(500).json({ message: "Error fetching recent albums" });
  }
};

// Fetch albums by artist's name
const getAlbumsByArtist = async (req, res) => {
  try {
    console.log("Request received for artist albums");
    const { artistId } = req.params;

    // Find albums by artistId
    const albums = await Album.find({ artist: artistId })
      .select("title coverImageUrl") // Select fields to include coverImageUrl
      .populate({
        path: "artist",
        select: "name", // Only include the artist's name
      });

    if (!albums.length) {
      return res
        .status(404)
        .json({ message: "No albums found for this artist" });
    }

    // Add albumUrl for each album
    const albumsWithUrl = albums.map((album) => ({
      ...album.toObject(),
      albumUrl: `/api/album/${album._id}`,
    }));

    res.status(200).json({
      message: "Albums fetched successfully",
      albums: albumsWithUrl,
    });
  } catch (error) {
    console.error("Error fetching albums by artist:", error.message);
    res.status(500).json({ message: "Error fetching albums by artist" });
  }
};

// Search for albums by name
const searchAlbumsByName = async (req, res) => {
  try {
    const albumName = req.query.query; // Change to req.query.query to look for the query parameter

    if (!albumName) {
      return res.status(400).json({ message: "Album name is required" });
    }

    // Perform the search using the query parameter
    const albums = await Album.find({
      title: { $regex: albumName, $options: "i" }, // Case-insensitive search for album titles
    }).populate({
      path: "songs", // Populate songs for each album
      select: "title fileUrl", // Only select title and fileUrl of each song
    });

    if (albums.length === 0) {
      return res.status(404).json({ message: "No albums found" });
    }

    // Add albumUrl to each album
    const albumsWithUrl = albums.map((album) => ({
      ...album.toObject(),
      albumUrl: `/api/get/album/${album._id}`,
    }));

    res.status(200).json({
      message: "Albums fetched successfully",
      albums: albumsWithUrl,
    });
  } catch (error) {
    console.error("Error searching albums:", error.message);
    res.status(500).json({ message: "Error searching albums" });
  }
};

// Search for songs by name
const searchSongsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Song name is required" });
    }

    const songs = await Song.find({ title: { $regex: name, $options: "i" } }) // Case-insensitive search
      .populate({
        path: "album",
        select: "title", // Include album title
      })
      .populate({
        path: "artist",
        select: "name", // Include artist's name
      });

    if (songs.length === 0) {
      return res.status(404).json({ message: "No songs found with that name" });
    }

    // Remove file extension from song titles
    songs.forEach((song) => {
      song.title = song.title.replace(/\.[^/.]+$/, "");
    });

    // Add albumUrl and artistUrl to each song
    const songsWithUrl = songs.map((song) => ({
      ...song.toObject(),
      album: {
        ...song.album.toObject(),
        albumUrl: `/api/get/album/${song.album._id}`,
      },
      artist: {
        ...song.artist.toObject(),
        artistUrl: `/api/get/artist-albums/${song.artist._id}`,
      },
    }));

    res.status(200).json({
      message: "Songs found successfully",
      songs: songsWithUrl,
    });
  } catch (err) {
    console.error("Error searching songs by name:", err.message);
    res.status(500).json({ message: "Error searching songs by name" });
  }
};

module.exports = {
  getAlbumData,
  getRecentAlbums,
  getAlbumsByArtist,
  searchAlbumsByName,
  searchSongsByName,
};
