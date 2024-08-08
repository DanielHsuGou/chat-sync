"use client";
import React from "react";
import { IoCloseCircle } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const DirectMessageAddNew = () => {
  const messages = [
    {
      id: 1,
      text: "USER1",
      profileImage: "https://c.pxhere.com/photos/08/7a/male_portrait_profile_social_media_cv_young_elegant_suit-459413.jpg",
    },
    {
      id: 2,
      text: "USER2",
      profileImage: "https://c.pxhere.com/photos/08/7a/male_portrait_profile_social_media_cv_young_elegant_suit-459413.jpg",
    },
    {
      id: 3,
      text: "USER3",
      profileImage: "https://c.pxhere.com/photos/08/7a/male_portrait_profile_social_media_cv_young_elegant_suit-459413.jpg",
    },
  ];

  const handleButtonClick = (message) => {
    console.log("Clicked on:", message.text);
  };

  return (
    <div className="absolute z-30 left-20 rounded-lg border border-gray-300 shadow-lg bg-blue-100 text-black w-80 mt-2 ">
      <div className="flex items-center justify-between py-4 px-2">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Select Friends</h2>
        </div>
        <button className="text-black hover:text-red-500 font-bold ml-2">
          <IoCloseCircle size={28} />
        </button>
      </div>
      <div className="bg-white py-2 px-3  max-h-60 overflow-y-auto custom-scrollbar">
        {messages.map((message) => (
          <button
            key={message.id}
            className="flex items-center border-b border-gray-200 py-2 w-full text-left hover:bg-gray-100 "
            onClick={() => handleButtonClick(message)}
          >
            <img
              src={message.profileImage}
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full mr-2"
            />
            <div className="flex-1">
              <span className="font-semibold block">{message.text}</span>
            </div>
            <span>+</span>
          </button>
        ))}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: white;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: white;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cce6ff;
        }
      `}</style>
    </div>
  );
};

export default DirectMessageAddNew;