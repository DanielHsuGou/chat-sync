"use client";

import { AiFillMessage } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import ServerContext from "../(context)/ServerContext";

import Image from "next/image";
import NotificationButton from "./NotificationButton";

function Sidebar({
  onclickChat,
  onclickServer,
  onclickAddServer,
  onclickNotification,
  onclickProfile,
  selectedLeftComponent,
}) {
  const {
    servers,
    currentUser,
    serverTrigger,
    setServerTrigger,
    setSelectedServer,
  } = useContext(ServerContext);
  const [filteredServers, setFilteredServers] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // console.log(currentUser);
      const joinedServerList = currentUser.joinedServerList;
      const filteredServers = servers.filter((server) =>
        joinedServerList.includes(server._id)
      );
      // console.log("filteredServers: ", filteredServers);
      setFilteredServers(filteredServers);
    }
  }, [currentUser, servers]);

  return (
    <div className="h-full w-24 min-w-[65px] min-h-[550px] bg-blue-600 flex flex-col gap-5 items-center justify-between py-5 rounded-xl shadow-lg z-10">
      <div
        className={`cursor-pointer hover:bg-blue-700 hover:border-l-4 hover:border-orange-600 w-full flex justify-center py-2 ${
          selectedLeftComponent === "chat"
            ? "bg-blue-700 border-l-4 border-orange-600"
            : ""
        }`}
        onClick={() => {
          onclickChat();
          setSelectedServer(null); // Set selected server to null
        }}
      >
        <AiFillMessage size={36} className="text-white" />
      </div>

      <div className="flex flex-col items-center h-[60%] flex-1 w-full">
        <style>
          {`
          .serverIconScrollbar::-webkit-scrollbar {
            display: none;
          }
          .serverIconScrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
        </style>
        <div className="flex flex-col items-center -mt-2 cursor-pointer overflow-scroll w-full serverIconScrollbar">
          {filteredServers.map((server, index) => (
            <div
              onClick={() => {
                onclickServer(server._id);
                setServerTrigger((prev) => prev + 1);
              }}
              key={index}
              className={`w-full flex justify-center py-2 hover:bg-blue-700 hover:border-l-4 hover:border-orange-600 ${
                selectedLeftComponent === server._id
                  ? "bg-blue-700 border-l-4 border-orange-600"
                  : ""
              }`}
            >
              <img
                src={server.serverIcon}
                alt={server.serverName}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          ))}
        </div>

        <div className="text-white -mt-3">
          <IoMdArrowDropdown size={26} />
        </div>

        <div
          className="text-white hover:text-blue-100 mt-3 cursor-pointer"
          onClick={onclickAddServer}
        >
          <FaPlusCircle size={28} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="cursor-pointer" onClick={onclickNotification}>
          <NotificationButton count={1} />
        </div>
        <div className="cursor-pointer" onClick={onclickProfile}>
          <div className="relative top-3 left-7 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          <Image
            src={
              currentUser && currentUser.icon
                ? currentUser.icon
                : "/chat_bot.png"
            }
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
