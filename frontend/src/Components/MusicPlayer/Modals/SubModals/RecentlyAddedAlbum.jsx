import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PlayerContext } from "../../../Context/PlayerContext";
import { assets } from "../../../../assets/assets";

const RecentlyAddedAlbum = () => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { audioRef, playStatus, setPlayStatus, setTrack } =
    useContext(PlayerContext);

  // Function to play song by file URL and update the track state
  const playSongWithFileUrl = async (song) => {
    try {
      // Set the audio source to the song's file URL
      audioRef.current.src = song.fileUrl;
      await audioRef.current.play();
      setPlayStatus(true); // Update play status to true

      // Update the track state with the current song's details for the Playbar
      setTrack({
        id: song._id,
        name: song.title,
        image: song.coverImageUrl || albumData.coverImageUrl || assets.img1,
        desc: albumData.title, // Use album title as description
        fileUrl: song.fileUrl,
      });
    } catch (error) {
      console.error("Error playing the song:", error);
    }
  };

  // Fetch album details by ID
  const fetchAlbumDetails = (albumId) => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/get/album/${albumId}`)
      .then((res) => {
        setAlbumData(res.data.album);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching album:", err);
        setError("Failed to load album.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      fetchAlbumDetails(id);
    } else {
      setError("No album ID provided.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {albumData && (
        <>
          <div className="flex gap-8 flex-col mt-3 items-center md:flex-row md:items-end sm:items-center xl:p-5">
            <img
              className="w-48 rounded"
              src={albumData.coverImageUrl || assets.img1}
              alt={albumData.title}
            />
            <div className="flex flex-col">
              <p>Album</p>
              <h2 className="text-5xl font-bold mb-4 md:text-7xl">
                {albumData.title}
              </h2>
              <h4>{albumData.description}</h4>
              <p className="mt-1">
                <img
                  className="inline-block w-5"
                  src={assets.spotify_logo}
                  alt="Spotify Logo"
                />
                <b> Spotify</b> • 1,323,154 likes •{" "}
                <b>{albumData.songs.length} songs</b>
              </p>
            </div>
          </div>

          {/* Songs list section */}
          <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
            <p>
              <b className="mr-4">#</b>
              <b>Title</b>
            </p>
            <p>Album</p>
            <p className="hidden sm:block">Date Added</p>
            <img
              className="m-auto w-4"
              src={assets.clock_icon}
              alt="Clock Icon"
            />
          </div>
          <hr />

          {/* Render each song */}
          {albumData.songs.map((song, index) => (
            <div
              key={song._id}
              onClick={() => playSongWithFileUrl(song)} // Pass the song object to the function
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 mt-1 mb-1 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
            >
              <p className="text-white ml-10 flex items-start">
                <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                <span className="text-white">{song.title}</span>
              </p>
              <p className="text-[15px]">{albumData.title}</p>
              <p className="text-[15px] hidden sm:block">5 days ago</p>
              <p className="text-[15px] text-center">{song.duration}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default RecentlyAddedAlbum;
