import React, {
  createContext,
  useState,
  useRef,
  useContext,
  useEffect,
} from "react";
import addJoinedServer from "../../../api/addJoinedServers";
import { addServer } from "../../../api/addServer";
import { getServers } from "../../../api/getServers";
import { addServerChannel } from "../../../api/addServerChannel";
import getCurrentUser from "../../../api/getCurrentUser";

const ServerContext = createContext();

export const ServerProvider = ({ children }) => {
  const [serverIcon, setServerIcon] = useState(null);
  const [serverIconCloud, setServerIconCloud] = useState(null);
  const [serverCategory, setServerCategory] = useState("Work");
  const [serverName, setServerName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverLoading, setServerLoading] = useState(false);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [serverTrigger, setServerTrigger] = useState(0);

  // useEffect(() => {
  //   async function getUser() {
  //     const user = await getCurrentUser();
  //     setCurrentUser(user);
  //   }
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
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const { servers } = await getServers();
        setServers(servers); // Update servers state in context
        // console.log("servers: ", servers);
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      }
    };

    fetchServerData();
  }, [serverTrigger]);

  const gamingServerChannels = [
    "General",
    "Announcements",
    "Rules",
    "Screenshots/Clips",
    "Off-Topic",
    "Game-Specific Channels",
    "Event Planning",
  ];

  const workServerChannels = [
    "General",
    "Announcements",
    "Rules",
    "Projects",
    "Team Discussions",
    "HR and Policies",
    "Calendar",
    "Feedback",
  ];

  // Function to create a channel and return its ID
  const createChannel = async (channelName) => {
    try {
      const channel = await addServerChannel(channelName);
      // console.log("New channel added:", channel);
      return channel._id;
    } catch (error) {
      console.error(`Error creating channel ${channelName}:`, error);
      return null; // Return null or handle it as needed
    }
  };

  // Function to create multiple channels and get their IDs
  const createMultipleChannels = async (channelNames) => {
    const ids = [];

    for (const name of channelNames) {
      const id = await createChannel(name);
      if (id) {
        ids.push(id);
      }
    }

    return ids;
  };

  const createServer = async (userId) => {
    // console.log("servers", servers);
    if (serverCategory && serverName && serverName.length <= 20) {
      setLoading(true);
      setMessage("");
      let newServer;

      if (serverCategory === "Work") {
        const workChannelIds = await createMultipleChannels(workServerChannels);
        if (workChannelIds.length > 0) {
          newServer = {
            serverName: serverName,
            serverCategory: serverCategory,
            serverIcon: "/chat_bot.png",
            serverChannels: workChannelIds,
            members: [userId],
          };
        }
      } else if (serverCategory === "Gaming") {
        const gamingChannelIds = await createMultipleChannels(
          gamingServerChannels
        );
        if (gamingChannelIds.length > 0) {
          newServer = {
            serverName: serverName,
            serverCategory: serverCategory,
            serverIcon: "/chat_bot.png",
            serverChannels: gamingChannelIds,
            members: [userId],
          };
        }
      }

      // console.log("newServer", newServer);

      try {
        if (serverIconCloud) {
          const formData = new FormData();
          formData.set("file", serverIconCloud);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error(await res.text());

          const data = await res.json();
          const uploadedUrl = data.url; // Get the URL from the response
          console.log("uploadedUrl", uploadedUrl);
          // Add the uploaded URL to the new server object
          if (uploadedUrl) {
            newServer.serverIcon = uploadedUrl;
          }
        }

        // Debug logs before state update
        console.log("Before setting servers:", newServer);

        const server = await addServer(newServer);
        await addJoinedServer(userId, server._id);
        setServers((prevServers) => {
          const updatedServers = [...prevServers, server];
          // console.log("Updated servers:", updatedServers);
          return updatedServers;
        });

        setCurrentUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            joinedServerList: [...prevUser.joinedServerList, server._id],
          };
          return updatedUser;
        });
        setServerName("");
        setServerCategory("Work");
        setServerIcon(null);
        setServerIconCloud(null);

        setMessage("serverCreated");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setMessage("");
          // console.log("Servers state updated:", servers);
        }, 5000);
      }
    } else if (serverName.length > 20) {
      setMessage("long");
    } else {
      setMessage("blank");
    }
  };

  return (
    <ServerContext.Provider
      value={{
        serverIcon,
        serverIconCloud,
        serverCategory,
        serverName,
        setServerName, // Add setters to the context
        setServerIcon,
        setServerIconCloud,
        setServerCategory,
        setMessage,
        setLoading,
        message,
        loading,
        gamingServerChannels,
        workServerChannels,
        createServer,
        servers,
        setServers,
        selectedServer,
        setSelectedServer,
        currentUser,
        setCurrentUser,
        serverTrigger,
        setServerTrigger,
        serverLoading,
        setServerLoading,
      }}
    >
      {/* {" "}
      {console.log("ServerContext value:", {
        serverIcon,
        serverIconCloud,
        serverCategory,
        serverName,
        message,
        loading,
        servers,
      })} */}
      {children}
    </ServerContext.Provider>
  );
};

export default ServerContext;
