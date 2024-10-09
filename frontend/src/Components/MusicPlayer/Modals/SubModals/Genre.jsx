import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";

const Genre = () => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumsByArtist = async () => {
      const userDataString = localStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const artistId = userData ? userData.id : null;

      if (artistId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/get/artist-albums/${artistId}`
          );
          setAlbums(response.data.albums);
        } catch (error) {
          console.error("Error fetching albums by artist:", error);
          setError("Error fetching albums. Please try again later.");
        }
      } else {
        console.error("Artist ID not found in localStorage.");
        setError("Artist ID not found.");
      }
    };

    fetchAlbumsByArtist();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Your Uploaded Albums</h1>
      {error && <p className="text-red-500">{error}</p>}
      {albums.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <li
              key={album._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              {/* Display the cover image */}
              {album.coverImageUrl && (
                <img
                  src={album.coverImageUrl}
                  alt={`${album.title} cover`}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <h2 className="text-xl font-semibold text-white">
                {album.title}
              </h2>
              <p className="text-gray-400">Artist: {album.artist.name}</p>
              {/* Use Link instead of <a> to navigate to RecentlyAddedAlbum */}
              <Link
                to={`/new-album/${album._id}`} // Dynamic route based on album ID
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Album
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No albums found for this artist.</p>
      )}
    </div>
  );
};

export default Genre;
