import React, { useContext, useEffect, useRef } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { PlayerContext } from "../../Context/PlayerContext";

const Contents = () => {
  const { filteredSongs, searchQuery, playWithId } = useContext(PlayerContext);
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");

  // You can add logic here for changing background if needed
  useEffect(() => {
    displayRef.current.style.background = isAlbum
      ? `linear-gradient(#1e293b, #121212)`
      : `#000000`;
  }, [isAlbum]);

  return (
    <div ref={displayRef} className="w-[100%] m-1 px-4 pt-4 rounded ">
      {searchQuery && filteredSongs.length > 0 ? (
        filteredSongs.map((song) => (
          <div
            key={song.id}
            className="p-2 m-2 bg-gray-800 rounded-lg"
            onClick={() => playWithId(song.id)}
          >
            <h3>{song.name}</h3>
            <p>{song.desc}</p>
          </div>
        ))
      ) : (
        // Use Outlet for nested routes like /home, /album/:id, etc.
        <Outlet />
      )}
    </div>
  );
};

export default Contents;
