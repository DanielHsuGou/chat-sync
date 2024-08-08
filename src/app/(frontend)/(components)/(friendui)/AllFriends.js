"use client";
import FriendListItem from "./FriendListItem";
import Image from "next/image";
import { createContext, useContext } from "react";

export const AllFriendsContext = createContext();

export default function AllFriends({
  userStatus,
  handleOnStatusChange,
  handleAcceptFriend,
  handleRejectFriend,
  handleAddFriend,
  handleRemoveFriend,
  handleRemoveRequest,
  handleBlock,
  handleUnblock,
  handleDm,
}) {
  const allFriends = useContext(AllFriendsContext);
  return (
    <div className="flex flex-col gap-5 px-5 -mb-2 mt-10 h-full overflow-scroll custom-scrollbar">
      <div className="font-bold text-xl">All Friends</div>
      <div className="flex flex-col gap-3 h-full overflow-scroll custom-scrollbar">
        {allFriends.length > 0 &&
          allFriends.map((friend, index) => (
            <FriendListItem
              key={index}
              icon={friend.icon}
              name={friend.displayName}
              status={friend.onlineStatus || "online"}
              userId={friend._id}
              email={friend.email}
              userStatus={userStatus}
              onStatusChange={handleOnStatusChange}
              handleAcceptFriend={() => handleAcceptFriend(friend._id)}
              handleRejectFriend={() => handleRejectFriend(friend._id)}
              handleAddFriend={() => handleAddFriend(friend._id)}
              handleRemoveFriend={() => handleRemoveFriend(friend._id)}
              handleRemoveRequest={() => handleRemoveRequest(friend._id)}
              handleBlock={() => handleBlock(friend._id)}
              handleUnblock={() => handleUnblock(friend._id)}
              handleDm={() => handleDm(friend._id)}
            />
          ))}
        {allFriends.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image
              width={300}
              height={300}
              alt="Sync.dev friend image"
              src="/no_friend.png"
            />
            <div className="text-gray-400 text-center w-60">
              You have no friends yet.
            </div>
          </div>
        )}
      </div>
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
  );
}
