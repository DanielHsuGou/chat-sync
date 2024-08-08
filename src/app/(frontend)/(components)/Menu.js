import { FaInbox, FaRegStar } from "react-icons/fa";
import { BiMessageRoundedDots } from "react-icons/bi";

export default function Menu({
  onclickDirectMessageAdd,
  onclickFriend,
  onclickServer,
  selectedMiddleComponent,
}) {
  return (
    <>
      <div className="w-full rounded-3xl bg-white text-black">
        <button
          className={`flex items-center w-full py-2 px-4 gap-2 rounded-t-3xl hover:bg-blue-200 transition-colors ${
            selectedMiddleComponent === "server" ? "bg-blue-200" : ""
          }`}
          onClick={onclickServer}
        >
          <FaInbox style={{ width: "1.5em", height: "1.5em" }} />
          <span className=" p-1 ml-2 font-bold text-md">Servers</span>
        </button>

        <button
          className={`flex items-center w-full py-2 px-4 gap-2 rounded-b-3xl hover:bg-blue-200 transition-colors ${
            selectedMiddleComponent === "friend" ? "bg-blue-200" : ""
          }`}
          onClick={onclickFriend}
        >
          <FaRegStar style={{ width: "1.5em", height: "1.5em" }} />
          <span className="p-1 ml-2 font-bold text-md">Friends</span>
        </button>
      </div>

      <div className="bg-white text-black rounded-full">
        <button
          className="flex items-center w-full h-14 py-2 px-4 gap-2 rounded-full hover:bg-blue-200 transition-colors"
          onClick={onclickDirectMessageAdd}
        >
          <BiMessageRoundedDots style={{ width: "1.5em", height: "1.5em" }} />
          <span className="ml-2 font-bold text-md ">Direct Messages</span>
          <span className="ml-auto font-bold">+</span>
        </button>
      </div>
    </>
  );
}
