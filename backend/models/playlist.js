const { default: mongoose } = require("mongoose");

const playlistSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timeStamp: { type: Date, default: Date.now },
});
const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;
