"use client";
import { MdOutlineJoinLeft } from "react-icons/md";
import addServerMember from "../../../../api/addServerMember";
import addJoinedServer from "../../../../api/addJoinedServers";
import { getServerById } from "../../../../api/getServerbyId";
import { useState, useEffect, useRef, useContext } from "react";
import PopupModal from "../PopupModal";
import ServerContext from "../../(context)/ServerContext";
import { FaRobot } from "react-icons/fa";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export default function ServerCard({
  icon,
  name,
  online,
  members,
  serverCategory,
  serverId,
}) {
  const { setServers, currentUser, setCurrentUser } = useContext(ServerContext);
  const [popupMessage, setPopupMessage] = useState("");
  const [serverMembers, setServerMembers] = useState(members);
  const [userExist, setUserExist] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const checkUserExist = async () => {
        const userExist = await handleCheckUserExist(serverId, currentUser._id);
        setUserExist(userExist);
      };
      checkUserExist();
    }
  }, [serverId, currentUser]);

  const handleJoinServer = async () => {
    if (!currentUser._id) {
      setPopupMessage("Please login first!");
      return;
    }
    try {
      console.log("currentUser: ", currentUser);
      const userExist = await handleCheckUserExist(serverId, currentUser._id);

      if (!userExist) {
        // add userid to server members
        const response = await addServerMember(serverId, currentUser._id);
        console.log("Server join response:", response);

        if (response) {
          setPopupMessage("Joined successfully!");

          setServerMembers((prev) => +prev + 1);
          setServers((prevServers) => {
            const updatedServers = prevServers.map((server) => {
              if (server._id === serverId) {
                return {
                  ...server,
                  members: [...server.members, currentUser._id],
                };
              }
              return server;
            });
            return updatedServers;
          });

          setCurrentUser((prevUser) => {
            const updatedUser = {
              ...prevUser,
              joinedServerList: [...prevUser.joinedServerList, serverId],
            };
            return updatedUser;
          });

          // Call addJoinedServer to update the user's joined server list
          const joinedResponse = await addJoinedServer(
            currentUser._id,
            serverId
          );
          console.log("User join response:", joinedResponse);

          if (!joinedResponse.success) {
            console.error("Failed to update user's joined server list");
          }
        } else {
          setPopupMessage("Failed to join server!");
        }
      } else {
        setPopupMessage("Already joined the server!");
      }
    } catch (error) {
      setPopupMessage("Failed to join server!");
    }
  };

  const handleCheckUserExist = async (serverId, userId) => {
    try {
      const serverData = await getServerById(serverId);

      if (!serverData) {
        console.log("Server not found");
        return false;
      }

      const userExists = serverData.server.members.includes(userId);
      return userExists;
    } catch (error) {
      console.log("Error checking user existence: ", error);
      return false;
    }
  };

  const handleClosePopup = () => {
    setPopupMessage("");
  };

  return (
    <div className="w-full h-28 bg-white rounded-2xl flex flex-col gap-3 justify-between py-8 px-5 shadow-sm shadow-sky-300/50 relative">
      <div className="bg-white rounded-full w-16 h-16 bg-cover absolute -top-8 left-5 flex items-center justify-center">
        <img
          width={64}
          height={64}
          alt="Sync.dev server image"
          src={isValidUrl(icon) ? icon : "/chat_bot.png"}
          className="w-[90%] h-auto rounded-full object-cover"
        />
      </div>
      <div className="flex justify-between">
        <div className="font-bold text-lg pt-1">{name}</div>
        {!userExist && (
          <div
            className="cursor-pointer flex items-center gap-2 hover:text-blue-500"
            onClick={() => currentUser && handleJoinServer()}
          >
            <MdOutlineJoinLeft className="w-5 h-5" />
            Join
          </div>
        )}
        {userExist && (
          <div className="flex items-center gap-2 text-blue-500">
            <FaRobot className="w-5 h-5" />
            Joined
          </div>
        )}
      </div>
      <div className="flex gap-5">
        <div className="flex items-center gap-2 xl:text-sm text-xs">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          {serverCategory} Server
        </div>
        <div className="flex items-center gap-2 xl:text-sm text-xs text-gray-400">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          {serverMembers} Members
        </div>
      </div>
      <PopupModal message={popupMessage} onClose={handleClosePopup} />
    </div>
  );
}
