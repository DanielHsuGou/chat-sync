import React, { useContext, useState, useEffect } from "react";
import ServerContext from "../(context)/ServerContext";
import { getServerChannelById } from "../../../api/getServerChannelById";
import { deleteServer } from "../../../api/deleteServer";
import { getUserById } from "../../../api/getUserById";
import deleteJoinedServer from "../../../api/deleteJoinedServers";
import { deleteServerChannel } from "../../../api/deleteServerChannel";
import PopupModalConfirm from "./PopupModelConfirm";
import { addServerChannel } from "../../../api/addServerChannel";
import addServerChanneltoServer from "../../../api/addServerChanneltoServer";
import PopupModalInput from "./PopupModalInput";
import { LuCopyPlus } from "react-icons/lu";
import style from "./ChannelUI.module.css";
import deleteServerMember from "../../../api/deleteServerMember";

const serverIcon = "/chat_bot.png";

const ChannelBar = ({
  selectedMiddleComponent,
  selectedLeftComponent,
  handleChatClick,
  handleChannelClick,
  serverChannels,
  setServerChannels,
}) => {
  const {
    servers,
    setServers,
    selectedServer,
    setSelectedServer,
    currentUser,
    setCurrentUser,
  } = useContext(ServerContext);
  const [showConfirmation, setShowConfirmation] = useState("");
  const [showInputModal, setShowInputModal] = useState(false); // State to manage input modal visibility
  const [newChannelName, setNewChannelName] = useState(""); // State to store new channel name
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [channelMsgUnreads, setChannelMsgUnreads] = useState([]);

  useEffect(() => {
    // Fetch channel data whenever servers or selectedLeftComponent changes
    const fetchChannelData = () => {
      setSelectedServer(null);
      if (servers.length > 0 && selectedLeftComponent !== "chat") {
        const selectserver = servers?.find(
          (server) => server._id === selectedLeftComponent
        );

        setSelectedServer(selectserver);
      }
    };

    fetchChannelData();
  }, [servers, selectedLeftComponent]);

  useEffect(() => {
    if (selectedServer) {
      console.log("selectedServer: ", selectedServer);
      setIsChannelLoading(true);

      setServerChannels([]);
      const fetchChannelData = async () => {
        const serverChannelIds = selectedServer.serverChannels || [];
        try {
          const channelDataPromises = serverChannelIds.map((channelId) =>
            getServerChannelById(channelId)
          );

          // Wait for all promises to resolve
          const channelData = await Promise.all(channelDataPromises);

          if (channelData && channelData.length > 0) {
            setServerChannels(channelData);

            handleChannelClick(channelData[0].channelName, channelData[0]._id);
            setIsChannelLoading(false);
          }
        } catch (error) {
          console.error("Error fetching channel data:", error);
        }
      };

      fetchChannelData();
    }
  }, [selectedServer]);

  useEffect(() => {
    // console.log("serverChannels: ", serverChannels);
    setChannelMsgUnreads(
      serverChannels.map(
        (channel) =>
          channel &&
          channel?.channelMsgs.filter((msg) =>
            msg.msgUnread?.includes(currentUser._id)
          ).length
      )
    );
  }, [serverChannels]);

  async function handleDeleteServer() {
    try {
      const serverMembers = selectedServer.members;
      const channels = selectedServer.serverChannels;
      // console.log("serverMembers: ", serverMembers);
      // console.log("channels: ", channels);

      // Delete server from server list
      await deleteServer(selectedServer._id);
      console.log("Server deleted successfully");
      setServers(servers.filter((server) => server._id !== selectedServer._id));
      handleChatClick();

      // Delete joined server from each user in parallel
      await Promise.all(
        serverMembers.length > 0 &&
          serverMembers.map(async (member) => {
            return deleteJoinedServer(member, selectedServer._id);
          })
      );
      console.log(
        "Deleted server from all member's joined server list successfully"
      );

      // Delete all channels of the selected server
      await Promise.all(
        channels.length > 0 &&
          channels.map(async (channel) => {
            return deleteServerChannel(channel);
          })
      );

      console.log("Deleted all channels of the selected server successfully");

      setSelectedServer(null);
    } catch (error) {
      console.error("Error deleting server or updating users:", error);
    }
  }

  // Function to create a channel and return its ID
  const createChannel = async (channelName) => {
    try {
      const channel = await addServerChannel(channelName);
      // console.log("New channel added:", channel);
      return channel;
    } catch (error) {
      console.error(`Error creating channel ${channelName}:`, error);
      return null; // Return null or handle it as needed
    }
  };

  async function handleAddChannel() {
    try {
      const newChannel = await createChannel(newChannelName);
      console.log("newChannel: ", newChannel);

      if (newChannel) {
        await addServerChanneltoServer(selectedServer._id, newChannel._id);
        console.log("newChannel added to server");

        setServerChannels([...serverChannels, newChannel]);
        setServers(
          servers.map((server) => {
            if (server._id === selectedServer._id) {
              return {
                ...server,
                serverChannels: [...server.serverChannels, newChannel._id],
              };
            }
            return server;
          })
        );
        setShowInputModal(false);
        setNewChannelName("");
      } else {
        console.error("Error adding new channel:", newChannel.message);
      }
    } catch (error) {
      console.error("Error adding new channel:", error);
    }
  }

  async function handleLeaveServer() {
    try {
      await deleteServerMember(selectedServer._id, currentUser._id);
      await deleteJoinedServer(currentUser._id, selectedServer._id);
      console.log(
        "Deleted server from Member's joined server list successfully"
      );
      console.log("Deleted member from server's member list successfully");

      // Update the currentUser's joinedServerList
      const updatedUser = {
        ...currentUser,
        joinedServerList: currentUser.joinedServerList.filter(
          (server) => server !== selectedServer._id
        ),
      };

      setCurrentUser(updatedUser);
      setServers(servers.filter((server) => server._id !== selectedServer._id));
      handleChatClick();
      setSelectedServer(null);
    } catch (error) {
      console.error("Error leaving server:", error);
    }
  }

  return (
    <div className="bg-white h-full flex flex-col gap-3 justify-between p-5">
      <div className="flex items-center mb-4 rounded-full">
        <img
          src={selectedServer?.serverIcon}
          alt="serverIcon"
          className="w-10 h-10 mr-2 rounded-full"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          {selectedServer?.serverName}
        </h1>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Channel List</h2>
        <button
          className="text-xl text-gray-600"
          onClick={() => setShowInputModal(true)}
        >
          <LuCopyPlus className="w-6 h-6 hover:text-blue-500" />
        </button>
      </div>
      <div className={`mt-2 flex-1 overflow-y-auto ${style.scrollableContent}`}>
        {isChannelLoading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!isChannelLoading &&
          serverChannels[0] &&
          serverChannels.length > 0 &&
          serverChannels.map((channel) => (
            <div
              key={channel?.channelName}
              className={`flex justify-between items-center py-2 px-2 cursor-pointer hover:bg-blue-100 rounded-xl ${
                channel && selectedMiddleComponent === channel._id
                  ? "bg-blue-100"
                  : "bg-white"
              }`}
              onClick={() =>
                handleChannelClick(channel.channelName, channel._id)
              }
            >
              <span className="text-gray-600">{`# ${
                channel && channel.channelName
              }`}</span>
              {channel &&
                channel.channelMsgs.filter((msg) =>
                  msg.msgUnread?.includes(currentUser._id)
                ).length > 0 && (
                  <span className="bg-orange-500 text-white rounded-full px-2 text-xs">
                    {
                      channel.channelMsgs.filter((msg) =>
                        msg.msgUnread?.includes(currentUser._id)
                      ).length
                    }
                  </span>
                )}
            </div>
          ))}
      </div>
      <div className="mt-4 flex justify-between gap-2">
        <button
          onClick={() => setShowConfirmation("delete")}
          className="bg-gray-600 text-white py-2 rounded-xl w-full hover:bg-gray-800"
        >
          Delete Server
        </button>
        <button
          onClick={() => setShowConfirmation("leave")}
          className="bg-red-500 text-white py-2 rounded-xl w-full hover:bg-red-700"
        >
          Leave Server
        </button>
      </div>
      {showConfirmation === "delete" && (
        <PopupModalConfirm
          message="Are you sure you want to delete this server?"
          onClose={() => setShowConfirmation("")}
          onConfirm={handleDeleteServer}
        />
      )}
      {showConfirmation === "leave" && (
        <PopupModalConfirm
          message="Are you sure you want to leave this server?"
          onClose={() => setShowConfirmation("")}
          onConfirm={handleLeaveServer}
        />
      )}
      {showInputModal && (
        <PopupModalInput
          message="Enter the new channel name:"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          onClose={() => setShowInputModal(false)}
          onConfirm={handleAddChannel}
        />
      )}
    </div>
  );
};

export default ChannelBar;
