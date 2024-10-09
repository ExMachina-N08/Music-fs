const mongoose = require("mongoose");
const { Schema } = mongoose;

const songSchema = new Schema({
  title: { type: String, required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true }, // Reference to the album
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the artist
  duration: { type: Number }, // Duration in seconds
  fileUrl: { type: String, required: true }, // URL of the song file
  genre: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
});

// Create the Song model from the schema
const Song = mongoose.model("Song", songSchema);

module.exports = Song;
