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
import { Player } from "@lottiefiles/react-lottie-player";
import { motion, AnimatePresence } from "framer-motion";
// ❌ 删除了: import Head from "next/head";

const font = Josefin_Sans({
  weight: "400",
  subsets: ["latin"],
});

// ✏️ 函数名从 Page 改成 ChatPageClient
export default function ChatPageClient() {
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
  const [dmFriendIcon, setDmFriendIcon] = useState("/chat_bot.png");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [toggleRightComponent, setToggleRightComponent] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const userData = await response.json();
        if (userData) {
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
    setToggleRightComponent("");
    setChannelId(null);
  };

  const handleServerClick = (index) => {
    setMsg([]);
    setSelectedLeftComponent(index);
    setSelectedMiddleComponent("");
    setMiddleComponent("channel");
    setRightComponent("");
    setToggleRightComponent("");
  };

  const handleChannelClick = async (name, id) => {
    setChannelName(name);
    setChannelId(id);
    setSelectedMiddleComponent(name);
    setRightComponent("channel");
    setToggleRightComponent("channel");

    const currentUser = await getCurrentUser();
    if (currentUser) {
      await deleteMsgUnread(id, currentUser._id);
    }

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
    setToggleRightComponent("friend");
  };

  const handleServerMenu = () => {
    setSelectedMiddleComponent("server");
    setRightComponent("server");
    setToggleRightComponent("server");
  };

  const handleDmClick = async (id, name, icon) => {
    setMessagesId(id);
    setDmFriendName(name);
    setDmFriendIcon(icon);
    setSelectedMiddleComponent(id);
    setRightComponent("chat");
    setToggleRightComponent("chat");

    if (currentUser) {
      await deleteMsgUnreadDm(id, currentUser._id);
    }

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

  const handleDmFriendClick = async (id) => {
    setRightComponent("chat");
    setToggleRightComponent("chat");

    const friend = await getUserById(id);

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
      const newMessages = await addMessages(currentUser._id, id);
      console.log("newMessages", newMessages);

      await addMessagesId(currentUser._id, newMessages._id);
      await addMessagesId(id, newMessages._id);

      setUserMessages((prevUserMessages) => [...prevUserMessages, newMessages]);
      setSelectedMiddleComponent(newMessages._id);
      setMessagesId(newMessages._id);
    } else {
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

    friend.icon
      ? setDmFriendIcon(friend.icon)
      : setDmFriendIcon("/chat_bot.png");
    setDmFriendName(friend.displayName);
  };

  const togglePopupComponent = (component) => {
    setPopupComponent((prevComponent) =>
      prevComponent === component ? "" : component
    );
  };

  return (
    // ❌ 删除了整个 <Head>...</Head> 区块
    <ServerProvider>
      {isLoading && <Loading />}
      {!isLoading && (
        <div
          className={`${font.className} flex h-screen items-center justify-between sm:p-3 pr-2 py-2 bg-blue-100 overflow-hidden`}
        >
          <LoggedOutSessionCheck />
          <Sidebar
            onclickChat={handleChatClick}
            onclickServer={handleServerClick}
            onclickAddServer={() => togglePopupComponent("addServer")}
            onclickNotification={() => togglePopupComponent("notification")}
            onclickProfile={() => togglePopupComponent("profile")}
            selectedLeftComponent={selectedLeftComponent}
            setSelectedMiddleComponent={setSelectedMiddleComponent}
            setRightComponent={setRightComponent}
            toggleRightComponent={toggleRightComponent}
            setToggleRightComponent={setToggleRightComponent}
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
                  handleDm={handleDmFriendClick}
                  onclickFriend={handleFriendMenu}
                  setCurrentCategory={setCurrentCategory}
                />
              )}
            </div>
          )}

          {middleComponent === "menu" && (
            <div
              className={`flex lg:w-[40%] w-full lg:min-w-[360px] min-w-[280px] h-full overflow-hidden lg:mx-3 ml-3 rounded-2xl flex-col gap-3 justify-between`}
            >
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
            <div
              className={`lg:w-[40%] w-full lg:min-w-[360px] min-w-[280px] h-full overflow-hidden lg:mx-3 ml-3 rounded-2xl shadow-md shadow-sky-400/40`}
            >
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
          {rightComponent === "" && (
            <div className="h-full w-full lg:ml-0 md:ml-3 ml-2 lg:flex lg:flex-col lg:justify-center lg:items-center hidden">
              <Player
                autoplay
                loop
                src="/channel_robot.json"
                style={{ height: "540px", width: "540px" }}
              />
              <p className="text-gray-400 text-xl">Please Select a Channel</p>
            </div>
          )}
          {rightComponent === "chat" && (
            <div className="h-full w-full lg:ml-0 md:ml-3 ml-2 lg:block hidden">
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
            <div className="h-full w-full lg:ml-0 md:ml-3 ml-2 lg:block hidden">
              <ChannelUI
                channelId={channelId}
                name={channelName}
                serverChannels={serverChannels}
                setServerChannels={setServerChannels}
                msg={msg}
                setMsg={setMsg}
                setRightComponent={setRightComponent}
              />
            </div>
          )}
          <AnimatePresence>
            {rightComponent === "chat" && (
              <motion.div
                initial={{ x: "100vw" }}
                animate={{ x: 0 }}
                exit={{ x: "100vw" }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="h-full p-2 pr-4 w-[91.5%] lg:hidden block fixed lg:left-28 md:left-24 md:p-3 md:pr-4 md:w-[89.5%] sm:left-24 sm:p-3 sm:pr-4 sm:w-[87%] left-12 bg-blue-100"
              >
                <ChatUI
                  messagesId={messagesId}
                  icon={dmFriendIcon}
                  name={dmFriendName}
                  userMessages={userMessages}
                  setUserMessages={setUserMessages}
                />
              </motion.div>
            )}
            {rightComponent === "channel" && (
              <motion.div
                initial={{ x: "100vw" }}
                animate={{ x: 0 }}
                exit={{ x: "100vw" }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="h-full p-2 pr-4 w-[91.5%] lg:hidden block fixed lg:left-28 md:left-24 md:p-3 md:pr-4 md:w-[89.5%] sm:left-24 sm:p-3 sm:pr-4 sm:w-[87%] left-12 bg-blue-100"
              >
                <ChannelUI
                  channelId={channelId}
                  name={channelName}
                  serverChannels={serverChannels}
                  setServerChannels={setServerChannels}
                  msg={msg}
                  setMsg={setMsg}
                  setRightComponent={setRightComponent}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {rightComponent === "friend" && (
            <div className="h-full w-full lg:block hidden">
              <FriendUI
                handleDmFriendClick={handleDmFriendClick}
                currentCategory={currentCategory}
                setCurrentCategory={setCurrentCategory}
              />
            </div>
          )}
          {rightComponent === "server" && (
            <div className="w-full h-full lg:block hidden">
              <ServerUI
                onclickAddServer={() => togglePopupComponent("addServer")}
                currentCategory={currentCategory}
                setCurrentCategory={setCurrentCategory}
              />
            </div>
          )}
          <AnimatePresence>
            {toggleRightComponent === "server" && (
              <motion.div
                initial={{ x: "100vw" }}
                animate={{ x: 0 }}
                exit={{ x: "100vw" }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="w-full h-full lg:hidden fixed sm:left-24 left-12 z-100 bg-blue-100"
              >
                <ServerUI
                  onclickAddServer={() => togglePopupComponent("addServer")}
                  currentCategory={currentCategory}
                  setCurrentCategory={setCurrentCategory}
                />
              </motion.div>
            )}
            {toggleRightComponent === "friend" && (
              <motion.div
                initial={{ x: "100vw" }}
                animate={{ x: 0 }}
                exit={{ x: "100vw" }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="h-full w-full lg:hidden fixed sm:left-24 left-12 z-100 bg-blue-100"
              >
                <FriendUI
                  handleDmFriendClick={handleDmFriendClick}
                  currentCategory={currentCategory}
                  setCurrentCategory={setCurrentCategory}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </ServerProvider>
  );
}