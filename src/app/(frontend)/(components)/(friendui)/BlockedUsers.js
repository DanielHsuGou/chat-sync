"use client";
import FriendListItem from "./FriendListItem";
import Image from "next/image";
import { createContext, useContext } from "react";

export const BlockedUsersContext = createContext();

export default function BlockedUsers(
  userStatus,
  handleOnStatusChange,
  handleAcceptFriend,
  handleRejectFriend,
  handleAddFriend,
  handleRemoveFriend,
  handleRemoveRequest,
  handleBlock,
  handleUnblock,
  handleDm
) {
  const blockedUsers = useContext(BlockedUsersContext);
  return (
    <div className="flex flex-col sm:gap-5 gap-3 -mb-2 h-full overflow-scroll custom-scrollbar p-5 lg:mt-5 sm:mt-2 mt-1">
      <div className="font-bold text-xl">Blocked Users</div>
      <div className="flex flex-col gap-3 h-full overflow-scroll custom-scrollbar">
        {blockedUsers.length > 0 &&
          blockedUsers.map((block, index) => (
            <FriendListItem
              key={index}
              icon={block.icon}
              name={block.displayName}
              email={block.email}
              status={block.onlineStatus || "Online"}
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
        {blockedUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image
              width={300}
              height={300}
              alt="Sync.dev friend image"
              src="/no_blocked.png"
              className="sm:w-72 sm:h-72 w-60 h-60"
            />
            <div className="text-gray-400 text-wrap text-center sm:w-full w-48 sm:text-base text-sm">
              Seems like you haven&apos;t blocked anyone yet.
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
