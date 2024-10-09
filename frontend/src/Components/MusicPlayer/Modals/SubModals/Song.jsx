import React, { useContext } from "react";
import { PlayerContext } from "../../../Context/PlayerContext";
import { useNavigate } from "react-router-dom";

const Songs = () => {
  const navigate = useNavigate;
  const { songs, playWithId } = useContext(PlayerContext);

  return (
    <div className="grid grid-cols-1 p-7 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {songs.map((song, index) => (
        <div
          onClick={() => playWithId(song.id)}
          key={index}
          className="bg-gray-800 p-4 rounded-lg  flex flex-col items-center"
        >
          <img
            src={song.image}
            alt={song.name}
            className="w-full h-auto rounded"
          />
          <h3 className="text-white text-lg mt-2">{song.name}</h3>
          <p className="text-gray-400">{song.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Songs;
