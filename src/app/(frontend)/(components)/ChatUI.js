"use client";
import { useState, useEffect, useContext } from "react";
// import io from "socket.io-client";
import ChatHeader from "./(chatui)/ChatHeader";
import InputMessage from "./InputMessage";
import MessageList from "./(chatui)/MessageList";
import { Josefin_Sans } from "next/font/google";
import { getMessagesMsgs } from "../../../api/getMessagesMsgs";
import { addMessagesMsg } from "../../../api/addMessagesMsg";
import { Player } from "@lottiefiles/react-lottie-player";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library
import ServerContext from "../(context)/ServerContext";
import { deleteMessages } from "../../../api/deleteMessages";
import deleteMessagesfmUser from "../../../api/deleteMessagesfmUser";
import { pusherclient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

const font = Josefin_Sans({
  weight: "400",
  subsets: ["latin"],
});

const NUMBER_OF_MSG_TO_FETCH = 20;
// const socket = io();

// messageid, otherUser id, otherUser icon,
export default function ChatUI({
  messagesId,
  icon,
  name,
  userMessages,
  setUserMessages,
}) {
  const { servers, setServers, selectedServer, currentUser } =
    useContext(ServerContext);
  const [msg, setMsg] = useState([]);
  const [offset, setOffset] = useState(NUMBER_OF_MSG_TO_FETCH);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [addMsg, setAddMsg] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const [isDragOver, setIsDragOver] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState(null);

  // get message obj
  useEffect(() => {
    userMessages?.forEach((message) => {
      if (message._id === messagesId) {
        setMessages(message);
      }
    });
  }, [messagesId, userMessages]);

  // get other user id
  useEffect(() => {
    if (messages) {
      // console.log("currentUser: ", currentUser._id);
      messages?.userIds?.forEach((userId) => {
        if (userId !== currentUser._id) {
          // console.log("userId: ", userId);
          setOtherUser(userId);
        }
      });
    }
  }, [messages]);

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

  // fetch messages.msgs data
  useEffect(() => {
    const fetchMessagesMsgData = async () => {
      setLoading(true);
      try {
        const response = await getMessagesMsgs(messagesId);
        if (response && response.msgs) {
          setMsg(response.msgs);
        } else {
          console.error('Response does not have the "msgs" property');
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
      // setTimeout(() => {
      setLoading(false);
      // }, 200);
    };
    fetchMessagesMsgData();
  }, [messagesId, setUserMessages]);

  useEffect(() => {
    pusherclient.subscribe(toPusherKey(`dm:${messagesId}:incoming_dm_msgs`));

    const sendMsg = (newMessage) => {
      setMsg((prevMsgs) => {
        const messageIndex = prevMsgs.findIndex(
          (msg) => msg.uid === newMessage.uid
        );
        if (messageIndex !== -1) {
          // Update existing message
          const updatedMsgs = [...prevMsgs];
          updatedMsgs[messageIndex] = newMessage;
          return updatedMsgs;
        } else {
          // Add new message
          return [newMessage, ...prevMsgs];
        }
      });
      setOffset((prevOffset) => prevOffset + 1);
      setAddMsg((prevCounter) => prevCounter + 1);
    };

    pusherclient.bind("incoming_dm_msgs", sendMsg);

    return () => {
      pusherclient.unsubscribe(
        toPusherKey(`dm:${messagesId}:incoming_dm_msgs`)
      );
      pusherclient.unbind("incoming_dm_msgs", sendMsg);
    };
  }, [messagesId, setUserMessages]);

  // handle badge update
  useEffect(() => {
    const serverId =
      selectedServer && selectedServer._id ? selectedServer._id : "chat";
    const subscriptionKey = toPusherKey(
      `server:${serverId}:incoming_channel_badges`
    );
    // console.log("Subscribing to:", subscriptionKey);

    pusherclient.subscribe(subscriptionKey);

    const handleBadgeUpdate = (message) => {
      // console.log("Received badge update:", message.message);
      // console.log("messageId: ", userMessages);
      setUserMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (msg._id === message.messageId) {
            // console.log(`Updating msg: ${msg._id}`);
            return {
              ...msg,
              msgs: [...msg.msgs, message.message],
            };
          }
          return msg;
        });
      });
    };

    pusherclient.bind("incoming_channel_badges", handleBadgeUpdate);

    return () => {
      // console.log("Cleaning up subscription:", subscriptionKey);
      pusherclient.unsubscribe(subscriptionKey);
      pusherclient.unbind("incoming_channel_badges", handleBadgeUpdate);
    };
  }, [messagesId, selectedServer, setMessages, msg]);

  const sendMessage = async () => {
    if (currentUser && messagesId && (input.trim() || attachments.length > 0)) {
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
        msgUnread: [otherUser],
        uid: uuidv4(),
        userId: currentUser._id,
      };

      // Trigger Pusher event by calling the new server-side endpoint
      await fetch("/api/triggerPusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMsgLocal,
          triggerType: "dm",
          messageId: messagesId,
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
          // console.log(uploadedUrls);
          // Add msgAttach urls after getting url
          const updatedMsg = { ...newMsgLocal, msgAttach: uploadedUrls };

          // Trigger Pusher event by calling the new server-side endpoint
          await fetch("/api/triggerPusher", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messageId: messagesId,
              selectedServerId: "chat",
              message: updatedMsg,
              triggerType: "server",
            }),
          });

          setAddMsg((prevCounter) => prevCounter + 1);
          return await addMessagesMsg(messagesId, updatedMsg);
        } catch (error) {
          console.log(error);
        }
      }

      // Create newMsg without the uid
      const updatedMsg = { ...newMsgLocal, msgAttach: [] };
      await fetch("/api/triggerPusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: messagesId,
          selectedServerId: "chat",
          message: updatedMsg,
          triggerType: "server",
        }),
      });
      return await addMessagesMsg(messagesId, updatedMsg);
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
      <ChatHeader icon={icon} name={name} />
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
          id={messagesId}
          msg={msg}
          setMsg={setMsg}
          addMsg={addMsg}
          offset={offset}
          setOffset={setOffset}
          NUMBER_OF_MSG_TO_FETCH={NUMBER_OF_MSG_TO_FETCH}
          currentUserId={currentUser._id}
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
