"use client";
import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import AddFriend from "./(friendui)/AddFriend";
import OnlineFriends from "./(friendui)/OnlineFriends";
import AllFriends from "./(friendui)/AllFriends";
import PendingFriends from "./(friendui)/PendingFriends";
import BlockedUsers from "./(friendui)/BlockedUsers";
import Discover from "./(serverui)/Discover";
import { Categories } from "./(serverui)/Categories";
import Search from "./Search";
import FriendListItem from "./(friendui)/FriendListItem";
import { FaLess } from "react-icons/fa";
import { AllFriendsContext } from "./(friendui)/AllFriends";
import { PendingFriendsContext } from "./(friendui)/PendingFriends";
import { BlockedUsersContext } from "./(friendui)/BlockedUsers";

export default function TemplateUI({
  icon,
  name,
  category,
  onclickAddServer,
  handleDmFriendClick,
}) {
  const [currentCategory, setCurrentCategory] = useState("");
  const [submitValue, setSubmitValue] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [userLib, setUserLib] = useState([]); // Initialize with an empty array
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [userStatuses, setUserStatuses] = useState({}); // State to hold statuses for each user
  const [serverTrigger, setServerTrigger] = useState(0);
  const isInitialMount = useRef(true);
  const inputRef = useRef(null);

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

  // Fetch user library
  useEffect(() => {
    async function fetchUserLibrary() {
      try {
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
        console.log("userLibData", userLibData);
        if (Array.isArray(userLibData)) {
          // Check if userLibData is an array
          setUserLib(userLibData);
        } else {
          console.error("User library data is not an array:", userLibData);
          setUserLib([]); // Set to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching user library:", error);
      }
    }
    fetchUserLibrary();
  }, []);

  const inputIntermediate = (e) => {
    const searchValue = e.target.value.toLowerCase();
    console.log("Search value:", searchValue); // Log the search value

    if (searchValue && userLib.length > 0) {
      const filtered = userLib.filter(
        (user) =>
          user.email.toLowerCase().includes(searchValue) ||
          user.displayName.toLowerCase().includes(searchValue)
      );
      console.log("Filtered users:", filtered); // Log the filtered users
      setFilteredUsers(filtered);
      console.log("filtered", filtered);
    } else if (submitValue === "") {
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    // Reset the input value when the component mounts
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    // Reset the input value when the category changes
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFilteredUsers([]); // Clear the filtered users
  }, [currentCategory]);

  const statuses = useMemo(() => {
    const tempStatuses = {}; // Temporary object to hold statuses for each user
    if (filteredUsers && currentUser) {
      console.log("Current User:", currentUser); // Log currentUser to ensure it has the correct data
      filteredUsers.forEach((user) => {
        const isFriend = currentUser.allFriends?.includes(user._id);
        const isPending = user.pendingFriends?.includes(currentUser._id);
        const isBlocked = currentUser.blockedUsers?.includes(user._id);

        console.log(
          `User: ${user._id}, isFriend: ${isFriend}, isPending: ${isPending}, isBlocked: ${isBlocked}`
        );

        if (isFriend) {
          tempStatuses[user._id] = {
            removeFriend: true,
            add: false,
            removeRequest: false,
            accept: false,
            dm: true,
            block: true,
          };
        } else if (isPending) {
          tempStatuses[user._id] = {
            removeFriend: false,
            removeRequest: true,
            add: false,
            dm: true,
          };
        } else if (isBlocked) {
          tempStatuses[user._id] = {
            unblock: true,
          };
        } else {
          tempStatuses[user._id] = {
            removeFriend: false,
            removeRequest: false,
            add: true,
            dm: true,
            block: true,
          };
        }
      });
    }
    return tempStatuses;
  }, [filteredUsers, currentUser]);

  useEffect(() => {
    setUserStatuses(statuses);
  }, [statuses]); // Update state with the new statuses

  // Now it's safe to access currentUser properties
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    } else {
      // Fetch pending friends
      async function fetchPendingFriends() {
        try {
          const response = await fetch(`/api/pendingFriends`, {
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

          const pendingFriendData = await response.json();
          // Ensure pendingFriendData is an array
          if (Array.isArray(pendingFriendData)) {
            setPendingFriends(pendingFriendData);
          } else {
            console.error(
              "Pending friends data is not an array:",
              pendingFriendData
            );
            setPendingFriends([]); // Set to empty array if not an array
          }
        } catch (error) {
          console.error("Error fetching pending friends:", error);
        }
      }

      // Fetch all friends
      async function fetchAllFriends() {
        try {
          const response = await fetch(`/api/allFriends`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
            },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const allFriendData = await response.json();
          // Ensure pendingFriendData is an array
          if (Array.isArray(allFriendData)) {
            setAllFriends(allFriendData);
          } else {
            console.error("All friends data is not an array:", allFriendData);
            setAllFriends([]); // Set to empty array if not an array
          }
        } catch (error) {
          console.error("Error fetching all friends:", error);
        }
      }

      // Fetch blocked users
      async function fetchBlockedUsers() {
        try {
          const response = await fetch(`/api/blockedUsers`, {
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

          const blockedFriendData = await response.json();
          // Ensure pendingFriendData is an array
          if (Array.isArray(blockedFriendData)) {
            setBlockedUsers(blockedFriendData);
          } else {
            console.error(
              "Blocked users data is not an array:",
              blockedFriendData
            );
            setBlockedUsers([]); // Set to empty array if not an array
          }
        } catch (error) {
          console.error("Error fetching blocked users:", error);
        }
      }

      fetchBlockedUsers();
      fetchAllFriends();
      fetchPendingFriends();
    }
  }, []);

  // useEffect(() => console.log(pendingFriends), [pendingFriends]);

  useEffect(() => {
    if (name === "Friends") {
      setCurrentCategory("Add Friend");
    } else {
      setCurrentCategory("Discover");
    }
  }, [name]);

  const handleAcceptFriend = async (userId) => {
    try {
      const response = await fetch(`/api/acceptFriend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ friendId: userId }), // Send userId as friendId
        credentials: "include", // Include credentials if needed
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error accepting friend: ${errorMessage}`);
      }

      // Remove the accepted friend from pendingFriends
      setPendingFriends((prev) => {
        const updatedPendingFriends = prev.filter((user) => user !== userId);
        console.log(
          "Updated pendingFriends after acceptance:",
          updatedPendingFriends
        );
        return updatedPendingFriends;
      });
      setAllFriends((prev) => {
        const updatedAllFriends = [...prev, userId];
        console.log("Updated allFriends after acceptance:", updatedAllFriends);
        return updatedAllFriends;
      });

      // Update the status immediately
      handleStatusChange(userId, {
        removeFriend: true,
        removeRequest: false,
        accept: false,
        dm: true,
      });

      const result = await response.text(); // Get the response text
      console.log(result); // Log success message
    } catch (error) {
      console.error("Error accepting friend:", error);
    }
  };

  const handleRejectFriend = async (userId) => {
    console.log("Rejecting friend request for user ID:", userId); // Log the userId

    try {
      const response = await fetch(`/api/rejectRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ friendId: userId }), // Send userId as friendId
        credentials: "include", // Include credentials if needed
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error rejecting friend: ${errorMessage}`);
      }

      // Remove the rejected friend from pendingFriends
      setPendingFriends((prev) => {
        const updatedPendingFriends = prev.filter((user) => user !== userId);
        console.log(
          "Updated pendingFriends after rejection:",
          updatedPendingFriends
        );
        return updatedPendingFriends;
      });

      // Update the status immediately
      handleStatusChange(userId, {
        removeRequest: false,
        accept: false,
        add: true,
        dm: true,
      });

      console.log("Friend request rejected successfully."); // Log success message
    } catch (error) {
      console.error("Error rejecting friend:", error);
    }
  };

  const handleAddFriend = async (userId) => {
    console.log("Adding friend with ID:", userId); // Log the userId

    try {
      const response = await fetch(`/api/addfriend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ friendId: userId }), // Send userId as friendId
        credentials: "include", // Include credentials if needed
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error adding friend: ${errorMessage}`);
      }

      // Update userStatuses immediately
      handleStatusChange(userId, {
        removeFriend: false,
        removeRequest: true,
        add: false,
        dm: true,
      });

      const result = await response.text(); // Get the response text
      console.log(result); // Log success message
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveRequest = async (userId) => {
    console.log("Removing request for user ID:", userId); // Log the userId

    try {
      const response = await fetch(`/api/removeRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ friendId: userId }), // Send userId as friendId
        credentials: "include", // Include credentials if needed
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error removing friend request: ${errorMessage}`);
      }

      // Remove the request from pendingFriends
      setPendingFriends((prev) => {
        const updatedPendingFriends = prev.filter((user) => user !== userId);
        console.log(
          "Updated pendingFriends after rejection:",
          updatedPendingFriends
        );
        return updatedPendingFriends;
      });

      // Update the status immediately
      handleStatusChange(userId, {
        removeFriend: false,
        removeRequest: false,
        add: true,
        dm: true,
        block: true,
      });

      const result = await response.text(); // Get the response text
      console.log(result); // Log success message
    } catch (error) {
      console.error("Error removing friend request:", error);
    }
  };

  const handleRemoveFriend = async (userId) => {
    console.log("Removing friend with ID:", userId); // Log the userId

    try {
      const response = await fetch(`/api/removeFriend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ friendId: userId }), // Ensure friendId is included
        credentials: "include",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error removing friend: ${errorMessage}`);
      }

      // Assuming the response contains the removed friend data
      const removedFriend = await response.json(); // Get the removed friend data from the response

      setAllFriends((prev) => {
        const updatedAllFriends = prev.filter((user) => user !== userId);
        console.log("Updated allFriends after removal:", updatedAllFriends);
        return updatedAllFriends;
      });

      // Update userStatuses immediately
      handleStatusChange(userId, {
        removeFriend: false,
        removeRequest: false,
        add: true,
        dm: true,
        block: true,
      });

      const result = await response.text(); // Get the response text
      console.log(result); // Log success message
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleBlock = async (userId) => {
    console.log("Blocking user with ID:", userId); // Log the userId
    try {
      const response = await fetch(`/api/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ friendId: userId }), // Send userId as friendId
        credentials: "include", // Include credentials if needed
      });
    } catch (error) {
      console.error("Error blocking user:", error);
    }
    setBlockedUsers((prev) => {
      const updatedBlockedUsers = [...prev, userId];
      console.log("Updated blockedUsers after blocking:", updatedBlockedUsers);
      return updatedBlockedUsers;
    });
    handleStatusChange(userId, {
      block: false,
      unblock: true,
    });
  };

  const handleUnblock = async (userId) => {
    console.log("Unblocking user with ID:", userId); // Log the userId
    try {
      const response = await fetch(`/api/unblock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ friendId: userId }), // Send userId as friendId
        credentials: "include", // Include credentials if needed
      });
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
    setBlockedUsers((prev) => {
      const updatedBlockedUsers = prev.filter((user) => user !== userId);
      console.log(
        "Updated blockedUsers after unblocking:",
        updatedBlockedUsers
      );
      return updatedBlockedUsers;
    });
  };

  const handleButtonClick = (category) => {
    if (category !== "Categories" && category !== "Create Server")
      setCurrentCategory(category);
  };

  // Category
  const [position, setPosition] = useState("home");

  const handleStatusChange = (userId, newStatus) => {
    setUserStatuses((prevStatuses) => ({
      ...prevStatuses,
      [userId]: newStatus,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingFriendsRes, allFriendsRes, blockedUsersRes] =
          await Promise.all([
            fetch(`/api/pendingFriends`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
              credentials: "include",
            }),
            fetch(`/api/allFriends`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
            }),
            fetch(`/api/blockedUsers`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
              credentials: "include",
            }),
          ]);

        if (!pendingFriendsRes.ok || !allFriendsRes.ok || !blockedUsersRes.ok) {
          throw new Error("Error fetching data");
        }

        const pendingFriendData = await pendingFriendsRes.json();
        const allFriendData = await allFriendsRes.json();
        const blockedFriendData = await blockedUsersRes.json();

        setPendingFriends(
          Array.isArray(pendingFriendData) ? pendingFriendData : []
        );
        setAllFriends(Array.isArray(allFriendData) ? allFriendData : []);
        setBlockedUsers(
          Array.isArray(blockedFriendData) ? blockedFriendData : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Poll every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <BlockedUsersContext.Provider value={blockedUsers}>
      <PendingFriendsContext.Provider value={pendingFriends}>
        <AllFriendsContext.Provider value={allFriends}>
          <div className="h-full flex flex-col justify-start">
            <div className="flex justify-between items-center gap-2">
              <div className="flex lg:gap-4 gap-3 font-bold lg:text-lg text-base items-center">
                {icon}
                {name}
              </div>
              {/* TopBar buttons */}
              <div className="flex items-center lg:gap-1 gap-0">
                {category.map((e, i) =>
                  e === "Categories" ? (
                    <Categories
                      key={i}
                      category="Categories"
                      position={position}
                      setPosition={setPosition}
                    />
                  ) : e === "Create Server" ? (
                    <Button
                      key={i}
                      size="friend"
                      variant="unset"
                      onClick={onclickAddServer}
                    >
                      {e}
                    </Button>
                  ) : (
                    <Button
                      key={i}
                      size="friend"
                      variant={currentCategory === e ? "active" : "unset"}
                      onClick={() => handleButtonClick(e)}
                    >
                      {e}
                    </Button>
                  )
                )}
              </div>
            </div>
            {currentCategory === "Discover" && (
              <div className="flex flex-col gap-4 p-5 mt-5">
                <div className="font-bold text-xl">Discover Servers</div>
                <div className="text-gray-400 text-sm">
                  You can find servers with server name.
                </div>
                <Search
                  buttonName="Search Server"
                  placeholder="You can join servers with server name."
                  submitValue={submitValue}
                  setSubmitValue={setSubmitValue}
                />
              </div>
            )}
            {currentCategory === "Add Friend" && (
              <div className="flex flex-col gap-4 p-5 mt-5">
                <div className="font-bold text-xl">Add Friend</div>
                <div className="text-gray-400 text-sm">
                  Add friends with either their display name or email!
                </div>
                <Search
                  buttonName="Send Friend Request"
                  placeholder="Search your friends here!"
                  submitValue={submitValue}
                  setSubmitValue={setSubmitValue}
                  inputIntermediate={(e) => inputIntermediate(e)}
                />
              </div>
            )}
            {/* {submitValue && <p>{submitValue}</p>} */}

            {currentCategory === "Online" && <OnlineFriends />}
            {currentCategory === "All" && allFriends.length === 0 ? (
              <AllFriends />
            ) : (
              ""
            )}
            {currentCategory === "All" && allFriends.length > 0 ? (
              <AllFriends
                userStatus={{ removeFriend: true, dm: true, block: true }}
                handleOnStatusChange={handleStatusChange}
                handleRemoveFriend={(userId) => handleRemoveFriend(userId)}
                handleDm={handleDmFriendClick}
                handleBlock={(userId) => handleBlock(userId)}
              />
            ) : (
              ""
            )}

            {currentCategory === "Pending" && pendingFriends ? (
              <PendingFriends
                userStatus={{
                  accept: true,
                  reject: true,
                  dm: true,
                  block: true,
                }}
                handleOnStatusChange={handleStatusChange}
                handleRemoveFriend={(userId) => handleRemoveFriend(userId)}
                handleAcceptFriend={(userId) => handleAcceptFriend(userId)}
                handleRejectFriend={(userId) => handleRejectFriend(userId)}
                handleRemoveRequest={(userId) => handleRemoveRequest(userId)}
                handleBlock={(userId) => handleBlock(userId)}
                handleUnblock={(userId) => handleUnblock(userId)}
              />
            ) : (
              ""
            )}
            {currentCategory === "Blocked" && (
              <BlockedUsers
                userStatus={{ unblock: true }}
                handleOnStatusChange={handleStatusChange}
                handleUnblock={(userId) => handleUnblock(userId)}
              />
            )}
            {currentCategory === "Add Friend" && filteredUsers.length === 0 ? (
              <AddFriend />
            ) : (
              ""
            )}
            {currentCategory === "Add Friend" && filteredUsers ? (
              <div className="flex flex-col gap-4 p-5 mt-5 overflow-scroll custom-scrollbar">
                {filteredUsers.map((user) => {
                  return (
                    <FriendListItem
                      key={user._id} // Ensure to add a unique key
                      icon={user.icon}
                      name={user.displayName}
                      status={user.onlineStatus === "" ? "" : "online"}
                      email={user.email}
                      userId={user._id}
                      userStatus={userStatuses[user._id] || {}} // Use filteredStatuses for filtered users
                      handleAddFriend={() => {
                        handleAddFriend(user._id);
                        setServerTrigger((prev) => prev + 1);
                      }}
                      handleRemoveFriend={() => handleRemoveFriend(user._id)}
                      handleRemoveRequest={() => handleRemoveRequest(user._id)}
                      onStatusChange={handleStatusChange}
                      handleBlock={() => handleBlock(user._id)}
                      handleUnblock={() => handleUnblock(user._id)}
                      handleDm={() => handleDmFriendClick(user._id)}
                    />
                  );
                })}
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    display: none; /* Hide scrollbar for WebKit-based browsers */
                  }
                  .custom-scrollbar {
                    -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
                    scrollbar-width: none; /* Hide scrollbar for Firefox */
                  }
                `}</style>
              </div>
            ) : (
              ""
            )}

            {currentCategory === "Discover" && (
              <Discover
                position={position}
                submitValue={submitValue}
                setSubmitValue={setSubmitValue}
              />
            )}
          </div>
        </AllFriendsContext.Provider>
      </PendingFriendsContext.Provider>
    </BlockedUsersContext.Provider>
  );
}
