"use client";
import { IoCloseCircle } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { VscSaveAs } from "react-icons/vsc";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

const ProfileCard = ({ onClose, username, onSave, onLogout }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [newDisplayName, setNewDisplayName] = useState();

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
          setNewDisplayName(userData.displayName); // Set the default value for newDisplayName
        } else {
          console.error("User data is null or undefined");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    // Delete the rememberMe cookie
    document.cookie =
      "rememberMe=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Sign out the user
    await signOut();
    redirect("/");
  }

  const handleImageUploadClick = async (e) => {
    e.preventDefault();
    document.getElementById("fileInput").click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.set("file", file);

      try {
        console.log("Attempting to upload file...");
        const response = await fetch(`/api/avatar`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Upload failed: ${response.status} ${response.statusText}\nError details: ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Upload successful:", data);

        // Update user avatar using the new API
        const updateResponse = await fetch(`/api/modifyUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ icon: data.url }), // Changed 'avatar' to 'icon'
        });

        if (!updateResponse.ok) {
          const updateErrorText = await updateResponse.text();
          throw new Error(
            `Update failed: ${updateResponse.status} ${updateResponse.statusText}\nError details: ${updateErrorText}`
          );
        }

        const updatedUser = await updateResponse.json();
        console.log("User updated successfully:", updatedUser);
        setCurrentUser(updatedUser.user);
        setAvatar(data.url); // Update the avatar state with the new URL

        return data;
      } catch (error) {
        console.error("Error uploading file:", error.message);
        throw error;
      }
    }
  };

  const handleChangeDisplayName = async (newDisplayName) => {
    try {
      const response = await fetch(`/api/modifyUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName: newDisplayName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Update failed: ${response.status} ${response.statusText}\nError details: ${errorText}`
        );
      }

      const updatedUser = await response.json();
      console.log("User updated successfully:", updatedUser);
      setCurrentUser(updatedUser.user);
    } catch (error) {
      console.error("Error updating display name:", error.message);
      throw error;
    }
  };

  return (
    <div className="w-80 mx-auto rounded-lg overflow-hidden shadow-lg absolute z-20 bottom-10 left-20 border-1 border-gray-500">
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white hover:text-red-600  rounded-full text-xs"
      >
        <IoCloseCircle size={25} />
      </button>
      <div className="bg-blue-400 h-16 flex items-center pl-3">
        <button
          onClick={handleImageUploadClick}
          type="button"
          className="relative opacity-0 left-2 top-[40%] rounded-[50%] w-16 h-16 hover:opacity-100 hover:bg-[#134B70]/[0.65] text-center flex flex-col items-center justify-center"
        >
          <p className="text-xs text-[#E1EBE6]">Change</p>
          <p className="text-xs text-[#E1EBE6]">Profile</p>
          <p className="text-xs text-[#E1EBE6]">Pic</p>
        </button>
        <div
          className="w-16 h-16 rounded-full overflow-hidden border-4 -ml-14 border-white"
          style={{ marginTop: "50px" }}
        >
          <img
            src={avatar || currentUser?.icon || "/chat_bot.png"} // Use avatar state if available
            alt="Profile Photo"
            className="w-full h-full object-cover"
            width={100}
            height={100}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop if fallback image also fails
              e.target.src = "/chat_bot.png"; // Fallback image URL
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-start gap-2 h-20 p-4 pl-6 bg-white">
        {isEditing ? (
          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newDisplayName.trim() !== "") {
                handleChangeDisplayName(newDisplayName);
                setIsEditing(false);
              }
            }}
            className="text-lg w-32 font-semibold text-black text-ls mt-2"
          />
        ) : (
          <h2 className="text-lg font-semibold text-black text-ls mt-2">
            {currentUser && currentUser.displayName}
          </h2>
        )}
        <button
          onClick={() => {
            if (isEditing && newDisplayName.trim() !== "") {
              handleChangeDisplayName(newDisplayName);
            }
            setIsEditing(!isEditing);
          }}
          className="text-blue-500 hover:text-blue-700 px-2 rounded-full text-xs mt-2 font-bold"
        >
          <VscSaveAs size={22} />
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="absolute bottom-3 right-3 text-red-500 hover:text-red-700 ml-2"
      >
        <TbLogout size={25} />
      </button>
    </div>
  );
};

export default ProfileCard;
