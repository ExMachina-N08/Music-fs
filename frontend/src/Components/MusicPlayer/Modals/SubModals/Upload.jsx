import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const UploadAlbum = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch artistId from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const artistId = userData?.id;

  const handleFileChange = (e) => {
    setSongs([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("releaseDate", releaseDate);
    formData.append("artistId", artistId); // Add artistId from localStorage

    // Append each song to the formData
    songs.forEach((song) => {
      formData.append("songs", song);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/upload/album", // Ensure this matches your backend route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Album uploaded successfully:", response.data);
      localStorage.setItem(
        "albumData",
        JSON.stringify({
          albumId: response.data.album._id, // Album ID from the backend
          artistId: artistId, // Artist ID already from localStorage
        })
      );

      // Navigate to the image upload page (or another component)
      navigate("/image"); // Adjust this path to your route for ImageUpload
    } catch (error) {
      console.error("Error uploading album:", error);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Upload Album</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Album Title
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-slate-800"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter album title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            className="border rounded w-full py-2 px-3  text-slate-800"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter album description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Genre
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-slate-800"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            placeholder="Enter album genre"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Release Date
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-slate-800"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Songs
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="file"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default UploadAlbum;
