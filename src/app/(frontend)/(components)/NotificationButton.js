"use client";

import React from "react";
import { MdPerson } from "react-icons/md";
import { BiBell } from "react-icons/bi";

const NotificationButton = ({ count }) => {
  return (
    <button className="flex items-center rounded-full p-1 shadow-md hover:shadow-inner hover:bg-blue-700 bg-blue-500 relative">
      {/* <MdPerson className="text-gray-700" size={18} /> */}
      <BiBell className="text-white" size={28} />
      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
        {count}
      </span>
    </button>
  );
};

export default NotificationButton;
