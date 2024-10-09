const express = require("express");
const {
  getAlbumData,
  getRecentAlbums,
  getAlbumsByArtist,
  searchAlbumsByName,
  searchSongsByName,
} = require("../controllers/getAlbumData");
const { unifiedSearch } = require("../controllers/searchController");

const router = express.Router();

// Route to get album with songs
router.get("/album/:albumId", getAlbumData);

// Route to get the most recent albums with pagination
router.get("/recent-albums", getRecentAlbums);

//Route to get albums by artist name:
router.get("/artist-albums/:artistId", getAlbumsByArtist);

// Route to search albums by name
router.get("/search-albums", searchAlbumsByName);

// Route to search songs by name
router.get("/search-songs", searchSongsByName);

// Route for unified search (albums, songs, artists)
router.get("/search", unifiedSearch);

module.exports = router;
