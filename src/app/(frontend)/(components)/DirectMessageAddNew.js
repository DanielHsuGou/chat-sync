"use client";
import React from "react";
import { IoCloseCircle } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { PiChatsFill } from "react-icons/pi";

const DirectMessageAddNew = ({ messages, handleDm }) => {
  const handleButtonClick = (message) => {
    console.log("Clicked on:", message.text);
  };

  return (
    <div>
      <div className="bg-white py-2 px-3 w-60 max-h-60 overflow-y-auto custom-scrollbar">
        {messages &&
          messages.map((message, index) => (
            <button
              key={index}
              className="flex items-center border-b border-gray-200 py-2 w-full text-left hover:bg-gray-100 "
              onClick={() => handleButtonClick(message)}
            >
              <img
                src={message.icon ? message.icon : "/chat_bot.png"}
                alt="Profile"
                className="w-10 h-10 object-cover rounded-full mr-2"
              />
              <div className="flex-1">
                <span className="font-semibold block">
                  {message.displayName}
                </span>
              </div>
              <PiChatsFill
                onClick={handleDm}
                className="text-blue-500 hover:text-blue-700 cursor-pointer w-6 h-6 md:w-7 md:h-7"
              />
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
