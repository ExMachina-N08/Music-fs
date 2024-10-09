import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const Genre = () => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumsByArtist = async () => {
      const userDataString = localStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const artistId = userData ? userData.id : null;

      if (artistId) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/get/artist-albums/${artistId}`
          );
          setAlbums(response.data.albums);
        } catch (error) {
          console.error("Error fetching albums by artist:", error);
          setError("Error fetching albums. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Artist ID not found in localStorage.");
        setError("Artist ID not found.");
        setLoading(false);
      }
    };

    fetchAlbumsByArtist();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Your Uploaded Albums
      </h1>

      {/* Display Loading Message */}
      {loading && <p className="text-gray-400">Loading albums...</p>}

      {/* Display Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Albums */}
      {!loading && albums.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <li
              key={album._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              {/* Display Cover Image */}
              {album.coverImageUrl ? (
                <img
                  src={album.coverImageUrl}
                  alt={`${album.title} cover`}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 rounded-md flex items-center justify-center mb-3">
                  <span className="text-gray-400">No Cover Image</span>
                </div>
              )}

              <h2 className="text-xl font-semibold text-white mb-1">
                {album.title}
              </h2>
              <p className="text-gray-400">
                Artist: {album.artist?.name || "Unknown"}
              </p>

              {/* Link to Album */}
              <Link
                to={`/new-album/${album._id}`}
                className="text-blue-400 hover:text-blue-500 hover:underline mt-3 inline-block"
              >
                View Album
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <p className="text-gray-400">No albums found for this artist.</p>
        )
      )}
    </div>
  );
};

export default Genre;
