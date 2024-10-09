import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login.jsx";
import Nomatch from "./Components/Nomatch.jsx";
import Home from "./Components/MusicPlayer/Modals/SubModals/Home.jsx";
import Song from "./Components/MusicPlayer/Modals/SubModals/Song.jsx";
import Playlist from "./Components/MusicPlayer/Modals/SubModals/Playlist.jsx";
import Genre from "./Components/MusicPlayer/Modals/SubModals/Genre.jsx";
import New from "./Components/MusicPlayer/Modals/SubModals/New.jsx";
import AlbumItem from "./Components/MusicPlayer/Modals/SubModals/AlbumItem.jsx";
import Album from "./Components/MusicPlayer/Modals/SubModals/Album.jsx";
import PlayerContextProvider from "./Components/Context/PlayerContext.jsx";
import SongItems from "./Components/MusicPlayer/Modals/SubModals/SongItems.jsx";
import SongDetail from "./Components/MusicPlayer/Modals/SubModals/SongDetail.jsx";
import Profile from "./Components/MusicPlayer/Modals/SubModals/Profile.jsx";
import Signup from "./Components/Signup/Signup.jsx";
import { AuthProvider } from "./Components/Context/AuthContext.jsx";
import Upload from "./Components/MusicPlayer/Modals/SubModals/Upload.jsx";
import RecentlyAddedAlbum from "./Components/MusicPlayer/Modals/SubModals/RecentlyAddedAlbum.jsx";
import ImageUpload from "./Components/MusicPlayer/Modals/SubModals/imageUpload.jsx";
import Success from "./Components/MusicPlayer/Modals/SubModals/Success.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <PlayerContextProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="auth" element={<Outlet />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="artist/signup" element={<Signup />} />
          </Route>

          {/* Main Routes with nested routing */}
          <Route path="/" element={<App />}>
            {/* Default index route */}
            <Route index element={<Home />} />

            {/* Nested routes */}
            <Route path="home" element={<Home />} />
            <Route path="new-album/:id" element={<RecentlyAddedAlbum />} />
            <Route path="album/:id" element={<Album />} />
            <Route path="song" element={<Song />} />
            <Route path="song/:songId" element={<SongItems />} />
            <Route path="genre" element={<Genre />} />
            <Route path="playlist" element={<Playlist />} />
            <Route path="new" element={<New />} />
            <Route path="upload" element={<Upload />} />
            <Route path="image" element={<ImageUpload />} />
            <Route path="success" element={<Success />} />
          </Route>

          {/* Fallback Route for no match */}
          <Route path="*" element={<Nomatch />} />
        </Routes>
      </PlayerContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
