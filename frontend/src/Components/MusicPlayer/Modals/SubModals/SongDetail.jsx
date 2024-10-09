import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlayerContext } from "../../../Context/PlayerContext";

const SongDetail = () => {
  const { songId } = useParams();
  const { songs, playWithId } = useContext(PlayerContext);

  useEffect(() => {
    if (songId) {
      playWithId(songId);
    }
  }, [songId, playWithId]);

  const song = songs.find((song) => song.id.toString() === songId);

  return (
    <div className="song-detail">
      {song ? (
        <div>
          <h1>{song.name}</h1>
          <p>{song.desc}</p>
          {/* Optionally display the player controls and song image etc. */}
        </div>
      ) : (
        <p>Song not found</p>
      )}
    </div>
  );
};

export default SongDetail;
