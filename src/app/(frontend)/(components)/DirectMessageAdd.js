"use client";

import React from "react";
import { TiMessages } from "react-icons/ti";
import { IoCloseCircle } from "react-icons/io5";

const DirectMessageAdd = ({ onClose }) => {
  return (
    <div className="absolute top-52 left-36 max-w-md mx-auto mt-8 rounded-lg border border-gray-300 shadow-lg bg-white p-6 ">
      <h2 className="text-lg font-semibold mb-4 text-black">Select Friends</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-center w-40 h-16 rounded-lg  mb-2 mt-7">
          <img
            src="https://static.vecteezy.com/system/resources/previews/004/328/935/original/chatbot-with-speech-bubbles-color-icon-modern-robot-talkbot-typing-answer-online-support-virtual-assistant-chat-bot-contour-symbol-isolated-illustration-vector.jpg"
            alt="Chatbot Icon"
            className="w-auto h-auto object-contain"
          />
        </div>
      </div>
      <p className="text-gray-500 mb-4 text-center">
        You don't have any friends to add!
      </p>
      <button className="bg-green-500 text-white py-2 px-4 rounded-lg w-full">
        Add Friend
      </button>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-black hover:text-red-500 font-bold ml-2"
      >
        <IoCloseCircle size={28} />
      </button>
    </div>
  );
};

export default DirectMessageAdd;
