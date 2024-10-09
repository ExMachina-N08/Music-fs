const mongoose = require("mongoose"); // Correctly import mongoose
const { Schema } = mongoose; // Destructure and get Schema from mongoose

// Define the album schema
const albumSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the artist who uploaded the album
  description: { type: String },
  releaseDate: { type: Date, default: Date.now },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Array of song references
  coverImageUrl: { type: String }, // URL for the album cover image
  genre: { type: String },
});

// Create the Album model from the schema
const Album = mongoose.model("Album", albumSchema);

// Export the Album model
module.exports = Album;
