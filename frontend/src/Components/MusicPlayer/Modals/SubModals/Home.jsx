import React from "react";
import AlbumItem from "./AlbumItem";
import { albumsData } from "../../../../assets/assets";
import { songsData } from "../../../../assets/assets";
import SongItems from "./SongItems";
import { Routes, Route, Link, Outlet } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="flex items-center gap-2 m-3">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
          All
        </p>
        <p className="bg-black text-white px-4 py-1 rounded-2xl cursor-pointer">
          Music
        </p>
      </div>
      <div className="overflow-auto m-3">
        <div className="my-5 font-bold text-2xl">
          <h1 className="my-5 font-bold text-2xl">Feature Charts</h1>
          <div className="flex overflow-auto">
            {albumsData.map((item) => (
              <Link
                to={`/album/${item.id}`}
                key={item.id}
                className="min-w-[180px] pt-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] hover:text-green-500"
              >
                <img className="rounded" src={item.image} alt={item.name} />
                <p className="font-bold mt-2 mb-1">{item.name}</p>
                <p className="text-slate-200 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="my-5 font-bold text-2xl">
          <h1 className="my-5 font-bold text-2xl">Today's biggest hit</h1>
          <div className="flex overflow-auto ">
            {songsData.map((item, index) => (
              <SongItems
                key={index}
                name={item.name}
                desc={item.desc}
                id={item.id}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
