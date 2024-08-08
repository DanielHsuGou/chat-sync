"use client";

import { useState, useEffect } from "react";
import { TiMessages } from "react-icons/ti";
import { IoCloseCircle } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import DirectMessageAddNew from "./DirectMessageAddNew";

const DirectMessageAdd = ({ onClose, handleDm }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY, // Include the API key in the headers
          },
          credentials: "include", // Ensure cookies are included in the request
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const userData = await response.json();
        if (userData) {
          // Check if userData is not null
          console.log("Fetched User Data:", userData); // Log fetched user data
          setCurrentUser(userData);
          console.log("Current User in DirectMessageAdd:", userData);
        } else {
          console.error("User data is null or undefined");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []); // Remove currentUser from dependency array

  // Fetch all friends
  useEffect(() => {
    async function fetchAllFriends() {
      try {
        const response = await fetch(`/api/allFriends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const allFriendData = await response.json();
        console.log("All Friends in DirectMessageAdd:", allFriendData);
        // Ensure pendingFriendData is an array
        if (Array.isArray(allFriendData)) {
          setFriends(allFriendData);
        } else {
          console.error("All friends data is not an array:", allFriendData);
          setFriends([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching all friends:", error);
      }
    }
    fetchAllFriends();
  }, []);

  return isLoading ? (
    <div className="absolute top-52 left-36 w-40 mx-auto mt-8 rounded-lg border border-gray-300 shadow-lg bg-white p-6">
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-red-500 font-bold ml-2"
        >
          <IoCloseCircle size={28} />
        </button>
      </div>
    </div>
  ) : (
    <div className="absolute top-52 left-36 w-xl mx-auto mt-8 rounded-lg border border-gray-300 shadow-lg bg-white p-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Select Friends</h2>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-black hover:text-red-500 font-bold ml-2"
      >
        <IoCloseCircle size={28} />
      </button>

      {Array.isArray(friends) && friends.length > 0 ? (
        <DirectMessageAddNew messages={friends} handleDm={handleDm} />
      ) : (
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-40 h-16 mb-8 mt-7">
            <img
              src="https://static.vecteezy.com/system/resources/previews/004/328/935/original/chatbot-with-speech-bubbles-color-icon-modern-robot-talkbot-typing-answer-online-support-virtual-assistant-chat-bot-contour-symbol-isolated-illustration-vector.jpg"
              alt="Chatbot Icon"
              className="w-auto h-auto object-contain"
            />
          </div>
          <p className="text-gray-500 mb-4 text-center">
            You don't have any friends to add!
          </p>
          <button className="bg-green-500 text-white py-2 px-4 rounded-lg w-full">
            Add Friend
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectMessageAdd;
