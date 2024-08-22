"use client";
import TemplateUI from "./TemplateUI";
import { GiThreeFriends } from "react-icons/gi";

export default function ServerUI({
  onclickAddServer,
  currentCategory,
  setCurrentCategory,
}) {
  const name = "Servers";
  const category = ["Discover", "Categories", "Create Server"];

  return (
    <div className="h-full pt-3 lg:min-w-[480px] lg:w-full md:w-[88%] sm:w-[85%] w-[90%]">
      <TemplateUI
        icon={<GiThreeFriends className="lg:w-8 lg:h-8 w-6 h-6" />}
        name={name}
        category={category}
        onclickAddServer={onclickAddServer}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />
    </div>
  );
}
