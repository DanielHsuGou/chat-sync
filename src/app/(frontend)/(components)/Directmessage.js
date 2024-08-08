import { VscCheckAll } from "react-icons/vsc";
import { BsFill1CircleFill } from "react-icons/bs";
import { getUsers } from "../../../api/getUsers";
import { useState, useEffect } from "react";

export default function DirectMessages({
  onclickDmUser,
  selectedMiddleComponent,
  currentUser,
  userMessages,
}) {
  // console.log("currentUser", currentUser);
  // console.log("userMessages", userMessages);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user library
  useEffect(() => {
    async function fetchUserLibrary() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users`, {
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

        const userLibData = await response.json();
        // console.log("userLibData", userLibData);
        if (Array.isArray(userLibData)) {
          // Check if userLibData is an array
          setUsers(userLibData);
        } else {
          console.error("User library data is not an array:", userLibData);
          setUsers([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching user library:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserLibrary();
  }, []);

  return (
    <div className="bg-white p-2 rounded-3xl shadow-md shadow-sky-400/40 overflow-y-scroll custom-scrollbar flex-1">
      <div className="font-bold text-md p-3 text-black">Direct Messages</div>
      <hr />
      <div className="overflow-y-auto h-full custom-scrollbar">
        {loading && (
          <div className="flex justify-center items-center h-[50%]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!loading &&
          userMessages.map((message) => {
            const lastMsg = message.msgs[message.msgs.length - 1];
            const unreadCount = message.msgs.filter((msg) =>
              msg.msgUnread.includes(currentUser._id)
            ).length;
            const otherUserId = message.userIds.filter(
              (id) => id !== currentUser._id
            )[0];
            // console.log("otherUserId", otherUserId);
            // console.log("users", users);
            const icon =
              users.find((user) => user._id === otherUserId)?.icon ||
              "/chat_bot.png";
            const name = users.find(
              (user) => user._id === otherUserId
            )?.displayName;

            return (
              <div
                key={message._id}
                className={`cursor-pointer rounded-lg message-item flex items-center py-2 px-3 hover:bg-blue-200 transition-colors ${
                  selectedMiddleComponent === message._id ? "bg-blue-200" : ""
                }`}
                onClick={() => onclickDmUser(message._id, name, icon)}
              >
                <div className="avatar w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img src={icon} alt="avatar" />
                </div>
                <div className="details flex-grow pt-2">
                  <div className="font-bold text-black">{name}</div>
                  <div className="text-sm text-gray-400 text-ellipsis h-5 w-36 overflow-hidden">
                    {lastMsg?.msgText || "No messages"}
                  </div>
                </div>
                <div className="flex items-end flex-col justify-center">
                  <div className="time text-gray-400 text-sm">
                    {lastMsg?.msgTime || "Start conversation"}
                  </div>
                  <div
                    style={{
                      color: unreadCount !== 0 ? "red" : "blue",
                    }}
                  >
                    {unreadCount !== 0 && (
                      <div className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center pt-2 pb-2 text-sm">
                        {unreadCount}
                      </div>
                    )}
                    {unreadCount === 0 && <VscCheckAll />}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <hr />
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: none;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: none;
          border-radius: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: none;
        }
      `}</style>
    </div>
  );
}
