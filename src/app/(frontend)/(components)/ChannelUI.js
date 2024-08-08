"use client";
import { useState, useEffect, useContext } from "react";
// import io from "socket.io-client";
import ChannelHeader from "./(channelui)/ChannelHeader";
import InputMessage from "./InputMessage";
import MessageList from "./(channelui)/MessageList";
import { Josefin_Sans } from "next/font/google";
import { getServerChannelMsgs } from "../../../api/getServerChannelMsgs";
import { addServerChannelMsg } from "../../../api/addServerChannelMsg";
import { Player } from "@lottiefiles/react-lottie-player";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library
import ServerContext from "../(context)/ServerContext";
import { deleteServerChannel } from "../../../api/deleteServerChannel";
import deleteServerChannelfromServer from "../../../api/deleteServerChannelfromServer";
import { pusherclient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

const font = Josefin_Sans({
  weight: "400",
  subsets: ["latin"],
});

const NUMBER_OF_MSG_TO_FETCH = 20;
// const socket = io();

export default function ChannelUI({
  channelId,
  name,
  serverChannels,
  setServerChannels,
  msg,
  setMsg,
}) {
  const { servers, setServers, selectedServer, currentUser } =
    useContext(ServerContext);
  const [offset, setOffset] = useState(NUMBER_OF_MSG_TO_FETCH);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [addMsg, setAddMsg] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const [isDragOver, setIsDragOver] = useState(false);
  const [serverMembersExceptCurrentUser, setServerMembersExceptCurrentUser] =
    useState([]);

  //messsage pusher
  useEffect(() => {
    pusherclient.subscribe(
      toPusherKey(`channel:${channelId}:incoming_channel_msgs`)
    );

    const sendMsg = (addedMessage) => {
      // console.log("addedMessage:", addedMessage);
      setMsg((prevMsgs) => {
        const messageIndex = prevMsgs.findIndex(
          (msg) => msg.uid === addedMessage.uid
        );
        if (messageIndex !== -1) {
          // Update existing message
          const updatedMsgs = [...prevMsgs];
          updatedMsgs[messageIndex] = addedMessage;
          return updatedMsgs;
        } else {
          // Add new message
          return [addedMessage, ...prevMsgs];
        }
      });
      setOffset((prevOffset) => prevOffset + 1);
      setAddMsg((prevCounter) => prevCounter + 1);
    };

    pusherclient.bind("incoming_channel_msgs", sendMsg);

    return () => {
      pusherclient.unsubscribe(
        toPusherKey(`channel:${channelId}:incoming_channel_msgs`)
      );
      pusherclient.unbind("incoming_channel_msgs", sendMsg);
    };
  }, [channelId]);

  // Badge Pusher
  useEffect(() => {
    pusherclient.subscribe(
      toPusherKey(`server:${selectedServer?._id}:incoming_channel_badges`)
    );

    const handleBadgeUpdate = (message) => {
      // console.log("Received badge update:", message.message);
      // console.log("channelId:", message.channelId);
      setServerChannels((prevChannels) => {
        return prevChannels.map((channel) => {
          if (channel._id === message.channelId) {
            // console.log(`Updating channel: ${channel._id}`);
            return {
              ...channel,
              channelMsgs: [...channel.channelMsgs, message.message],
            };
          }
          return channel;
        });
      });
    };

    pusherclient.bind("incoming_channel_badges", handleBadgeUpdate);

    return () => {
      pusherclient.unsubscribe(
        toPusherKey(`server:${selectedServer?._id}:incoming_channel_badges`)
      );
      pusherclient.unbind("incoming_channel_badges", handleBadgeUpdate);
    };
  }, [channelId, selectedServer, setServerChannels]);

  useEffect(() => {
    if (selectedServer && currentUser?._id) {
      const serverMembersExceptCurrentUser = selectedServer.members.filter(
        (member) => member !== currentUser._id
      );
      setServerMembersExceptCurrentUser(serverMembersExceptCurrentUser);
    }
  }, [selectedServer]);

  // Drag and Drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    const newAttachments = files.filter(
      (file) => !attachments.some((attach) => attach.name === file.name)
    );
    setAttachments((prevFiles) => [...prevFiles, ...newAttachments]);
  };

  const handleDeleteChannel = async () => {
    try {
      await deleteServerChannelfromServer(selectedServer?._id, channelId);
      await deleteServerChannel(channelId);
      console.log("channel deleted", channelId);

      const server = servers.find(
        (server) => server?._id === selectedServer?._id
      );
      const updatedServer = {
        ...server,
        serverChannels: server.serverChannels.filter(
          (channel) => channel !== channelId
        ),
      };
      // Update the server's channels
      setServers(
        servers.map((server) =>
          server?._id === selectedServer?._id ? updatedServer : server
        )
      );
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  useEffect(() => {
    const fetchServerChannelMsgData = async () => {
      setLoading(true);
      try {
        const response = await getServerChannelMsgs(channelId);
        const { msgs } = response;
        setMsg(msgs);
      } catch (error) {
        console.error("Error fetching server channel messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServerChannelMsgData();
  }, [channelId, selectedServer, setServerChannels]);

  const sendMessage = async () => {
    if (currentUser && (input.trim() || attachments.length > 0)) {
      const currentTime = new Date();
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formattedTime = `${currentTime.getDate()} ${
        months[currentTime.getMonth()]
      } ${currentTime.getFullYear()}, ${currentTime.getHours()}:${String(
        currentTime.getMinutes()
      ).padStart(2, "0")}`;

      const newMsgLocal = {
        msgFrom: currentUser.displayName,
        msgIcon: currentUser.icon || "/chat_bot.png",
        msgTime: formattedTime,
        msgText: input,
        msgAttach: attachments.length > 0 ? ["loadImg"] : ["noImg"],
        msgUnread: serverMembersExceptCurrentUser,
        userId: currentUser && currentUser._id,
        uid: uuidv4(),
      };

      // Trigger Pusher event by calling the new server-side endpoint
      await fetch("/api/triggerPusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId: channelId,
          selectedServerId: selectedServer && selectedServer._id,
          message: newMsgLocal,
          triggerType: "channel",
        }),
      });

      // Clear the input field and make scroll to bottom
      setInput("");

      if (attachments.length > 0) {
        try {
          setAttachments([]);
          const uploadedUrls = await Promise.all(
            attachments.map(async (attach) => {
              const formData = new FormData();
              formData.set("file", attach);
              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });
              if (!res.ok) throw new Error(await res.text());
              const data = await res.json();
              return data.url; // Get the URL from the response
            })
          );
          const updatedMsg = { ...newMsgLocal, msgAttach: uploadedUrls };

          await fetch("/api/triggerPusher", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channelId: channelId,
              selectedServerId: selectedServer && selectedServer._id,
              message: updatedMsg,
              triggerType: "server",
            }),
          });

          setAddMsg((prevCounter) => prevCounter + 1);
          return await addServerChannelMsg(channelId, updatedMsg);
        } catch (error) {
          console.log(error);
        }
      }

      const updatedMsg = { ...newMsgLocal, msgAttach: [] };
      await fetch("/api/triggerPusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId: channelId,
          selectedServerId: selectedServer && selectedServer._id,
          message: updatedMsg,
          triggerType: "server",
        }),
      });
      return await addServerChannelMsg(channelId, updatedMsg);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${font.className} ${
        isDragOver ? "border-2 border-dashed border-blue-500" : "border-none"
      } min-w-[400px] h-full bg-white rounded-2xl flex flex-col shadow-md shadow-sky-400/40`}
    >
      <ChannelHeader name={name} handleDeleteChannel={handleDeleteChannel} />
      {loading && (
        <div className={`flex flex-col justify-center items-center h-full`}>
          <Player
            autoplay
            loop
            speed="3"
            src="/loader_robot.json"
            style={{ height: "300px", width: "300px" }}
          />
        </div>
      )}
      {!loading && (
        <MessageList
          id={channelId}
          msg={msg}
          setMsg={setMsg}
          addMsg={addMsg}
          offset={offset}
          setOffset={setOffset}
          NUMBER_OF_MSG_TO_FETCH={NUMBER_OF_MSG_TO_FETCH}
          currentUserId={currentUser && currentUser._id}
        />
      )}
      <InputMessage
        input={input}
        setInput={setInput}
        attachments={attachments}
        setAttachments={setAttachments}
        sendMessage={sendMessage}
      />
    </div>
  );
}
