const mongoose = require("mongoose");
const { Schema } = mongoose;

const coverImageSchema = new Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
    required: true,
  }, // Reference to the album
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the artist
  // songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true }, // Reference to the artist
  coverImageUrl: { type: String, required: true }, // Cloudinary URL of the cover image
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the cover image was uploaded
});

const CoverImage = mongoose.model("CoverImage", coverImageSchema);

module.exports = CoverImage;
