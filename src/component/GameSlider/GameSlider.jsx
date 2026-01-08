

import React, { useEffect, useState } from "react";

const GameSlider = ({data}) => {

  const imagesMethod = [
    {
      image: "/dashbaord/new/17627625602470028.gif",
      orderBy: 4,
         name: "Aviator",
      gameId: "201206",
    
    },
    {
      image: "/dashbaord/new/17627625664266101.gif",
      orderBy: 3,
      name: "mines",
      gameId: "201208",
    },
    {
      image: "/dashbaord/new/17627625734204431.gif",
      orderBy: 2,
        name: "Chicken Preduction",
      gameId: "151102",
    },
    {
      image: "/dashbaord/new/17650463849494368.gif",
      orderBy: 1,
      name: "mines",
      gameId: "151099",
    },
  ];

  const handleImageClick = (img) => {
    let productParam = img?.product == "all" ? img?.product : img?.category
    let catParam = img?.product == "all" ? img?.category : "all"
    window.location.href = `/casino?name=${productParam}&gameName=${catParam}`;

  };
  return (
    <div className="w-full py-2 overflow-hidden relative md:grid-cols-4 grid grid-cols-2 gap-1">
      {data?.sort((a, b) => a.position - b.position)?.map((img, index) => (
        <div
          key={index}
          className="flex-shrink-0 rounded overflow-hidden"
        >
          <img
            onClick={() => handleImageClick(img)}
           src={`https://speedcdn.io/${img?.url_thumb}`}
            alt={`slide-${index}`}
            className="w-full md:h-[90px] h-[60px] rounded cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default GameSlider;
