"use client";
import TemplateUI from "./TemplateUI";
import { FaUserFriends } from "react-icons/fa";

export default function FriendUI({
  handleDmFriendClick,
  currentCategory,
  setCurrentCategory,
}) {
  const name = "Friends";
  const category = ["All", "Pending", "Blocked", "Add Friend"];

  return (
    <div className="h-full pt-3 lg:min-w-[480px] lg:w-full md:w-[88%] sm:w-[85%] w-[90%]">
      <TemplateUI
        handleDmFriendClick={handleDmFriendClick}
        icon={<FaUserFriends className="lg:w-8 lg:h-8 w-6 h-6" />}
        name={name}
        category={category}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />
    </div>
  );
}
