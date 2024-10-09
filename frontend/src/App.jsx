import React, { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import MusicPlayer from "./Components/MusicPlayer/Player/MusicPlayer";
import Home from "./Components/MusicPlayer/Modals/SubModals/Home";
import AlbumItem from "./Components/MusicPlayer/Modals/SubModals/AlbumItem";
import Song from "./Components/MusicPlayer/Modals/SubModals/Song";
import Genre from "./Components/MusicPlayer/Modals/SubModals/Genre";
import Playlist from "./Components/MusicPlayer/Modals/SubModals/Playlist";
import New from "./Components/MusicPlayer/Modals/SubModals/New";
import PlayerContextProvider from "./Components/Context/PlayerContext";

function App() {
  return <MusicPlayer />;
}

export default App;
