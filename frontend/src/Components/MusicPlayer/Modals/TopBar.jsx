import React, { useContext, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { assets } from "../../../assets/assets";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../Context/PlayerContext";
import axios from "axios";

const TopBar = () => {
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState(false); // State to manage input visibility
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [searchResults, setSearchResults] = useState({
    albums: [],
    songs: [],
    artists: [],
  }); // Store search results
  const [userRole, setUserRole] = useState(null); // State for user role

  const {
    playWithId, // Use playWithId from context
    setSearchQuery: setContextSearchQuery,
    isActive,
    toggleActiveState,
  } = useContext(PlayerContext); // Access context

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserRole(userData.role); // Set the role from local storage
    }
  }, []);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible); // Toggle visibility of search input
  };

  const upload = () => navigate("/upload"); // Navigate to upload page

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query); // Update search query state
    setContextSearchQuery(query); // Update the global search query state
    performSearch(query); // Call search function
  };

  // Perform search by sending the query to the backend
  const performSearch = async (query) => {
    if (!query) return; // If the search query is empty, don't make a request

    try {
      const backendResponse = await axios.get(
        `http://localhost:8080/api/get/search?query=${query}`
      );

      console.log("Search Results:", backendResponse.data);
      setSearchResults(backendResponse.data); // Store results from the backend in state
    } catch (error) {
      console.error("Error while searching:", error);
    }
  };

  // Function to play a song when a search result is clicked
  const handlePlaySong = (song, isBackend = true) => {
    playWithId(song._id, isBackend, song);
  };

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate(-1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_left}
            alt="Go back"
          />
          <img
            onClick={() => navigate(1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_right}
            alt="Go forward"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-black flex flex-row items-center gap-4 rounded-2xl">
            {searchVisible && (
              <input
                type="text"
                placeholder="Search albums, songs, artists..."
                value={searchQuery}
                onChange={handleSearch}
                className={`transition-all duration-500 bg-transparent rounded px-4 py-1 outline-none ${
                  searchVisible ? "w-[200px]" : "w-0"
                }`}
              />
            )}
            <p
              onClick={toggleSearch}
              className="text-white text-[15px] px-3 py-1 cursor-pointer"
            >
              <SearchOutlined />
            </p>
          </div>
          {/* Conditionally render the upload button based on user role */}
          {userRole !== "user" && (
            <img
              onClick={() => {
                toggleActiveState("/upload");
                upload();
              }}
              className={`w-8 bg-black hover:bg-green-500 p-2 rounded-2xl cursor-pointer ${
                isActive("/upload") ? "bg-green-500" : ""
              }`}
              src={assets.plus_icon}
              alt="Upload"
            />
          )}
        </div>
      </div>

      {/* Render search results */}
      {searchResults.albums.length > 0 ||
      searchResults.songs.length > 0 ||
      searchResults.artists.length > 0 ? (
        <div className="search-results-container p-4">
          <h3 className="text-xl font-bold mb-4">Search Results</h3>

          {/* Albums Section */}
          {searchResults.albums.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold">Albums</h4>
              <ul>
                {searchResults.albums.map((album) => (
                  <li
                    key={album._id}
                    onClick={() => navigate(`/album/${album._id}`)}
                    className="cursor-pointer hover:text-blue-400"
                  >
                    {album.title} by {album.artist.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Songs Section */}
          {searchResults.songs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold">Songs</h4>
              <ul>
                {searchResults.songs.map((song) => (
                  <li
                    key={song._id}
                    onClick={() => handlePlaySong(song, true)} // Play backend song
                    className="cursor-pointer hover:text-blue-400"
                  >
                    {song.title} by {song.artist.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Artists Section */}
          {searchResults.artists.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold">Artists</h4>
              <ul>
                {searchResults.artists.map((artist) => (
                  <li
                    key={artist._id}
                    onClick={() => navigate(`/artist-albums/${artist._id}`)}
                    className="cursor-pointer hover:text-blue-400"
                  >
                    {artist.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        searchQuery && (
          <p className="text-center text-gray-500 p-4">No results found.</p>
        )
      )}
    </>
  );
};

export default TopBar;
