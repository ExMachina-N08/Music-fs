import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Flex, Layout } from "antd";
import Playbar from "../Modals/Playbar";
import TopBar from "../Modals/TopBar";
import SideBar from "../Modals/SideBar";
import Contents from "../Modals/Content";
import "./musicplayer.css";
import { useDrag } from "@use-gesture/react";
import { Outlet, useLocation, Route, Routes } from "react-router-dom";
import Home from "../Modals/SubModals/Home";
import Song from "../Modals/SubModals/Song";
import Profile from "../Modals/SubModals/Profile";
import PlayerContextProvider, {
  PlayerContext,
} from "../../Context/PlayerContext";
import { useAuth } from "../../Context/AuthContext";

const { Header, Footer, Sider, Content } = Layout;

const layoutStyle = {
  borderRadius: 15,
  width: "98vw",
  minHeight: "95vh",
  overflow: "hidden",
  position: "relative",
};

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 60, // Header height
  paddingInline: 20,
  lineHeight: "25px",
  zIndex: 1, // Ensure the header is above the content
  width: "84%", // Make the header take full width to the right
  position: "fixed",
  top: 10,
};

const contentStyle = {
  textAlign: "center",
  lineHeight: "25px",
  marginTop: 65, // Space below the header, equals header height
  height: "calc(98vh - 65px)", // Adjust the height to account for the header
  color: "#fff",
  overflow: "auto",
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "50px",
  color: "#fff",
  zIndex: 1,
  position: "sticky",
  top: 10, // Ensure the Sider sticks to the top
  height: "95vh",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  position: "fixed",
  width: "98vw",

  bottom: 5,
  zIndex: 2,
};

const MusicPlayer = () => {
  const {
    audioRef,
    track,
    backgroundGradient,
    toggleActive,
    isActive,
    isProfileModalOpen,
    closeProfileModal,
  } = useContext(PlayerContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const activeStyle = {
    color: isActive ? "text-green-500" : "white", // Dynamic styling based on isActive state
  };
  const overlayBackground = `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), ${backgroundGradient}`;
  return (
    <div>
      <Layout style={layoutStyle}>
        <Sider
          width="15%"
          style={siderStyle}
          className="sider"
          activeclassname="text-green-500"
          onClick={toggleActive}
        >
          {<SideBar />}
        </Sider>
        <Layout>
          <Flex
            justify="end"
            align="center"
            vertical={false}
            style={headerStyle}
            className=" topbar"
          >
            <TopBar />
          </Flex>

          <Content style={contentStyle} className="content">
            {<Contents />}
          </Content>
        </Layout>
        <motion.footer
          initial={{
            opacity: 0,
            borderRadius: 15,
          }}
          animate={{ opacity: 1, background: overlayBackground }}
          transition={{
            opacity: { delay: 0.5, duration: 0.5 },
            background: { type: "ease-in", delay: 0.5, duration: 1 },
          }}
          style={{ ...footerStyle, background: overlayBackground }}
          className="player"
          data-isOpen={isOpen}
        >
          <Playbar
            onClick={() => setIsOpen(!isOpen)}
            onAlbumClick={toggleOpen}
          />
        </motion.footer>
      </Layout>
      {isProfileModalOpen && <Profile onClose={closeProfileModal} />}
      <audio ref={audioRef} src={track.file} preload="auto"></audio>
    </div>
  );
};

export default MusicPlayer;
