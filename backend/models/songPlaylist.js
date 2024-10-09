const { default: mongoose } = require("mongoose");

const songPlaylistSchema = new Schema({
  songID: { type: Schema.Types.ObjectId, ref: "Song", required: true }, // references the song
  playlistID: { type: Schema.Types.ObjectId, ref: "Playlist", required: true }, // references the playlist
  timeStamp: { type: Date, default: Date.now },
});

const SongPlaylist = mongoose.model("SongPlaylist", songPlaylistSchema);
module.exports = SongPlaylist;
