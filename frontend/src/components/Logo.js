import React from "react";
import houseLogo from "../assets/logo_house.png";

export default function Logo(props) {
  return (
    <div {...props}>
      <div className="flex flex-row items-center">
        <text className="font-title text-2xl font-semibold text-black mr-3">
          my<text className="text-primary-600">HouseKeeper</text>
        </text>
        <img className="w-10" src={houseLogo} />
      </div>
    </div>
  );
}
