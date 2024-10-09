import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const New = () => {
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchRecentAlbums = (page) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    axios
      .get(`${API_BASE_URL}/api/get/recent-albums?page=${page}&limit=8`)
      .then((res) => {
        // Append new albums to the existing list
        setRecentAlbums((prevAlbums) => [...prevAlbums, ...res.data.albums]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recent albums", err);
        setError("Failed to fetch recent albums.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecentAlbums(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="p-5 text-white">
      <h1 className="text-2xl font-bold text-left pl-4">
        Recently Added Albums
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {recentAlbums.map((album) => (
          <div key={album._id} className="bg-transparent p-4 rounded-lg">
            <div className="mt-2">
              <Link
                to={`/new-album/${album._id}`} // Link to album details page
                className="mt-2 inline-block hover:text-green-600"
              >
                <img
                  className="w-full h-48 object-cover rounded-lg"
                  src={album.coverImageUrl}
                  alt={album.title}
                />
                <h3 className="text-lg font-bold text-left mt-2">
                  {album.title}
                </h3>
                <p className="text-left">{album.artist.name}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Show a message if there is an error */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default New;
