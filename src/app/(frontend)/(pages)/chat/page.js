"use client";
import { useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import ChannelUI from "../../(components)/ChannelUI";
import ChatUI from "../../(components)/ChatUI";
import Sidebar from "../../(components)/sidebar";
import SearchBar from "../../(components)/Searchbar";
import Menu from "../../(components)/Menu";
import DirectMessages from "../../(components)/Directmessage";
import ChannelBar from "../../(components)/ChannelBar";
import ServerModal from "../../(components)/ServerModal";
import Notification from "../../(components)/Notification";
import ProfileCard from "../../(components)/ProfileCard";
import DirectMessageAdd from "../../(components)/DirectMessageAdd";
import FriendUI from "../../(components)/FriendUI";
import ServerUI from "../../(components)/ServerUI";
import LoggedOutSessionCheck from "../../(components)/LoggedOutSessionCheck";
import getCurrentUser from "../../../../api/getCurrentUser";
import { ServerProvider } from "../../(context)/ServerContext";
import deleteMsgUnread from "../../../../api/deleteMsgUnread";
import { addMessages } from "../../../../api/addMessages";
import addMessagesId from "../../../../api/addMessagesId";
import { getMessages } from "../../../../api/getMessages";
import deleteMsgUnreadDm from "../../../../api/deleteMsgUnreadDm";
import { getUserById } from "../../../../api/getUserById";
import Loading from "../../(components)/Loading";

const font = Josefin_Sans({
  weight: "400",
  subsets: ["latin"],
});

export default function Page() {
  // const friendidDemo = "66b02530f5db302c900f1aab";

  const [middleComponent, setMiddleComponent] = useState("menu");
  const [rightComponent, setRightComponent] = useState("server");
  const [popupComponent, setPopupComponent] = useState("");
  const [selectedLeftComponent, setSelectedLeftComponent] = useState("chat");
  const [selectedMiddleComponent, setSelectedMiddleComponent] =
    useState("server");
  const [channelName, setChannelName] = useState([]);
  const [channelId, setChannelId] = useState([]);
  const [serverChannels, setServerChannels] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [messagesId, setMessagesId] = useState(null);
  const [msg, setMsg] = useState([]);

  const [dmFriendName, setDmFriendName] = useState("");
  const [dmFriendIcon, setDmFriendIcon] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const user = await getCurrentUser();
  //     setCurrentUser(user);
  //   };
  //   getUser();
  // }, []);

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
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const { messages } = await getMessages();
      const newMessages = messages.filter((message) =>
        message.userIds.includes(currentUser?._id)
      );
      setUserMessages(newMessages);
    };
    fetchMessages();
  }, [currentUser, selectedLeftComponent]);

  const handleChatClick = () => {
    setSelectedLeftComponent("chat");
    setSelectedMiddleComponent("server");
    setMiddleComponent("menu");
    setRightComponent("server");
    setChannelId(null);
  };

  const handleServerClick = (index) => {
    setMsg([]);
    setSelectedLeftComponent(index);
    setMiddleComponent("channel");
  };

  const handleChannelClick = async (name, id) => {
    setChannelName(name);
    setChannelId(id);
    setSelectedMiddleComponent(name);
    setRightComponent("channel");

    // Call deleteMsgUnread to remove unread messages for the current user
    const currentUser = await getCurrentUser();
    if (currentUser) {
      await deleteMsgUnread(id, currentUser._id);
    }

    // Update the serverChannels state to remove msgUnread for the current user
    setServerChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel._id === id
          ? {
              ...channel,
              channelMsgs: channel.channelMsgs.map((msg) => ({
                ...msg,
                msgUnread: msg.msgUnread.filter(
                  (userId) => userId !== currentUser._id
                ),
              })),
            }
          : channel
      )
    );
  };

  const handleFriendMenu = () => {
    setSelectedMiddleComponent("friend");
    setRightComponent("friend");
  };

  const handleServerMenu = () => {
    setSelectedMiddleComponent("server");
    setRightComponent("server");
  };

  const handleDmClick = async (id, name, icon) => {
    setMessagesId(id);
    setDmFriendName(name);
    setDmFriendIcon(icon);
    setSelectedMiddleComponent(id);
    setRightComponent("chat");

    if (currentUser) {
      await deleteMsgUnreadDm(id, currentUser._id);
    }

    // Update the userMessages state to remove msgUnread for the current user
    setUserMessages((prevUserMessages) =>
      prevUserMessages.map((message) =>
        message._id === id
          ? {
              ...message,
              msgs: message.msgs.map((msg) => ({
                ...msg,
                msgUnread: msg.msgUnread.filter(
                  (userId) => userId !== currentUser._id
                ),
              })),
            }
          : message
      )
    );
  };

  // in friend list, click on friend dm to open chat
  const handleDmFriendClick = async (id) => {
    setRightComponent("chat");
    console.log("currentUser", currentUser);
    console.log("userMessages", userMessages);

    // get selected friend id
    console.log(id);
    const friend = await getUserById(id);

    // find if messages already exist
    const isMessagesExist =
      Array.isArray(userMessages) &&
      userMessages.some(
        (message) =>
          message.userIds.includes(currentUser._id) &&
          message.userIds.includes(id)
      );
    console.log("isMessagesExist", isMessagesExist);
    console.log("messages", userMessages.length);

    if (!isMessagesExist || userMessages.length === 0) {
      // create one messages in database, return new messages obj
      const newMessages = await addMessages(currentUser._id, id);
      console.log("newMessages", newMessages);

      // add created messages id to currentUser, return updated currentUser obj
      await addMessagesId(currentUser._id, newMessages._id);

      // add created messages id to selected friend
      await addMessagesId(id, newMessages._id);

      setUserMessages((prevUserMessages) => [...prevUserMessages, newMessages]);
      setSelectedMiddleComponent(newMessages._id);
      setMessagesId(newMessages._id);
    } else {
      // if messages exist, set messagesId
      const existingMessage =
        Array.isArray(userMessages) &&
        userMessages.find(
          (message) =>
            message.userIds.includes(currentUser._id) &&
            message.userIds.includes(id)
        );
      const messageId = existingMessage._id;
      setMessagesId(messageId);
      setSelectedMiddleComponent(messageId);
    }
    // set icon, name
    (friend.icon && setDmFriendIcon(friend.icon)) ||
      setDmFriendIcon("/robot_bot.png");
    setDmFriendName(friend.displayName);
    console.log("friend", friend);
  };

  const togglePopupComponent = (component) => {
    setPopupComponent((prevComponent) =>
      prevComponent === component ? "" : component
    );
  };

  return (
    <ServerProvider>
      {isLoading && <Loading />}
      <div
        className={`${font.className} flex h-screen items-center justify-between p-3 bg-blue-100`}
      >
        <LoggedOutSessionCheck />
        <Sidebar
          onclickChat={handleChatClick}
          onclickServer={handleServerClick}
          onclickAddServer={() => togglePopupComponent("addServer")}
          onclickNotification={() => togglePopupComponent("notification")}
          onclickProfile={() => togglePopupComponent("profile")}
          selectedLeftComponent={selectedLeftComponent}
        />
        {popupComponent && (
          <div>
            {popupComponent === "addServer" && (
              <ServerModal onClose={() => setPopupComponent("")} />
            )}
            {popupComponent === "notification" && (
              <Notification onClose={() => setPopupComponent("")} />
            )}
            {popupComponent === "profile" && (
              <ProfileCard
                onClose={() => setPopupComponent("")}
                username="Chuuthiya"
              />
            )}
            {popupComponent === "directMessageAdd" && (
              <DirectMessageAdd
                onClose={() => setPopupComponent("")}
                handleDm={handleDmClick}
              />
            )}
          </div>
        )}

        {middleComponent === "menu" && (
          <div className="w-[40%] min-w-[360px] min-h-[550px] h-full overflow-hidden mx-3 rounded-2xl flex flex-col gap-3 justify-between">
            <SearchBar />
            <Menu
              onclickDirectMessageAdd={() =>
                togglePopupComponent("directMessageAdd")
              }
              onclickFriend={handleFriendMenu}
              onclickServer={handleServerMenu}
              selectedMiddleComponent={selectedMiddleComponent}
            />
            <DirectMessages
              onclickDmUser={handleDmClick}
              selectedMiddleComponent={selectedMiddleComponent}
              currentUser={currentUser}
              userMessages={userMessages}
            />
          </div>
        )}
        {middleComponent === "channel" && (
          <div className="w-[40%] min-w-[320px] h-full overflow-hidden mx-3 rounded-2xl shadow-md shadow-sky-400/40">
            <ChannelBar
              selectedMiddleComponent={selectedMiddleComponent}
              selectedLeftComponent={selectedLeftComponent}
              handleChatClick={handleChatClick}
              handleChannelClick={handleChannelClick}
              serverChannels={serverChannels}
              setServerChannels={setServerChannels}
            />
          </div>
        )}

        {rightComponent === "chat" && (
          <div className="h-full w-full">
            <ChatUI
              messagesId={messagesId}
              icon={dmFriendIcon}
              name={dmFriendName}
              userMessages={userMessages}
              setUserMessages={setUserMessages}
            />
          </div>
        )}
        {rightComponent === "channel" && (
          <div className="h-full w-full">
            <ChannelUI
              channelId={channelId}
              name={channelName}
              serverChannels={serverChannels}
              setServerChannels={setServerChannels}
              msg={msg}
              setMsg={setMsg}
            />
          </div>
        )}
        {rightComponent === "friend" && (
          <div className="h-full w-full">
            <FriendUI handleDmFriendClick={handleDmFriendClick} />
          </div>
        )}
        {rightComponent === "server" && (
          <div className="w-full h-full">
            <ServerUI
              onclickAddServer={() => togglePopupComponent("addServer")}
            />
          </div>
        )}
        {/* <div
          onClick={() => handleDmFriendClick(friendidDemo)}
          className="fixed bottom-0 right-0"
        >
          <button>DM friend</button>
        </div> */}
      </div>
    </ServerProvider>
  );
}
