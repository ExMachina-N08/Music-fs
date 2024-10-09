const Album = require("../models/album");
const Song = require("../models/song");
const User = require("../models/user"); // Artist stored in User model

// Unified search for albums, songs, and artists
const unifiedSearch = async (req, res) => {
  try {
    const searchQuery = req.query.query; // Get the query from the URL

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search for albums by title
    const albumResults = await Album.find({
      title: { $regex: searchQuery, $options: "i" },
    })
      .populate({
        path: "artist",
        select: "name", // Include the artist's name
      })
      .populate({
        path: "songs", // Populate songs for each album
        select: "title fileUrl", // Select title and fileUrl for songs
      });

    // Add `albumUrl` and `artistUrl` to each album
    const albumsWithUrls = albumResults.map((album) => ({
      ...album.toObject(),
      albumUrl: `/api/get/album/${album._id}`,
      artist: {
        _id: album.artist._id,
        name: album.artist.name,
        artistUrl: `/api/get/artist-albums/${album.artist._id}`,
      },
    }));

    // Search for songs by title
    const songResults = await Song.find({
      title: { $regex: searchQuery, $options: "i" },
    })
      .populate({
        path: "album",
        select: "title", // Include album title
      })
      .populate({
        path: "artist",
        select: "name", // Include artist's name
      });

    // Add `albumUrl` and `artistUrl` to each song
    const songsWithUrls = songResults.map((song) => ({
      ...song.toObject(),
      album: {
        _id: song.album._id,
        title: song.album.title,
        albumUrl: `/api/get/album/${song.album._id}`,
      },
      artist: {
        _id: song.artist._id,
        name: song.artist.name,
        artistUrl: `/api/get/artist-albums/${song.artist._id}`,
      },
    }));

    // Search for artists by name (from User model where role is 'artist')
    const artistResults = await User.find({
      name: { $regex: searchQuery, $options: "i" },
      role: "artist",
    }).select("name"); // Only return the artist's name

    // Add `artistUrl` to each artist
    const artistsWithUrls = artistResults.map((artist) => ({
      ...artist.toObject(),
      artistUrl: `/api/get/artist-albums/${artist._id}`,
    }));

    // Return all the results in a combined response
    res.status(200).json({
      message: "Search results",
      albums: albumsWithUrls,
      songs: songsWithUrls,
      artists: artistsWithUrls,
    });
  } catch (error) {
    console.error("Error performing search:", error.message);
    res.status(500).json({ message: "Error performing search" });
  }
};

module.exports = { unifiedSearch };
