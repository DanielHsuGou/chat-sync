"use client";
import { EllipsisVertical, Hash } from "lucide-react";

export default function ChatHeader({ icon, name, status }) {
  return (
    <>
      <div className="flex justify-between items-center px-4 lg:py-3 md:py-2 py-1">
        <div className="flex items-center">
          <img
            src={icon}
            className="mr-3 lg:w-12 lg:h-12 md:w-11 md:h-11 w-10 h-10 rounded-full"
          />
          <div className="flex flex-col md:text-lg text-md font-bold text-black mt-1">
            {name}

            {/* <div
              className={`flex items-center gap-3 font-normal text-xs text-gray-400`}
            >
              <div
                className={`flex items-center gap-1 ${
                  status.toLowerCase() === "online"
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mb-1 ${
                    status.toLowerCase() === "online"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                {status}
              </div>
            </div> */}
          </div>
        </div>
        <EllipsisVertical className="text-blue-500" />
      </div>
      <div className="flex justify-center items-center">
        <hr className="w-[90%]" />
      </div>
    </>
  );
}
