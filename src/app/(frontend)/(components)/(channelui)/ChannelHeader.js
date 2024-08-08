"use client";
import { useState } from "react";
import { EllipsisVertical, Hash } from "lucide-react";
import PopupModalConfirm from "../PopupModelConfirm";

export default function ChannelHeader({ name, handleDeleteChannel }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmDelete = () => {
    handleDeleteChannel();
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 lg:py-5 md:py-4 py-3">
        <div className="flex items-center">
          <Hash className="mr-3 md:w-6 md:h-6 w-5 h-5 text-black" />
          <div className="flex flex-col md:text-lg text:md font-bold text-black mt-1">
            {name}
          </div>
        </div>
        <button onClick={() => setShowConfirmation(true)}>
          <EllipsisVertical className="text-blue-500" />
        </button>
      </div>
      <div className="flex justify-center items-center">
        <hr className="w-[90%]" />
      </div>
      {showConfirmation && (
        <PopupModalConfirm
          message="Are you sure you want to delete this channel?"
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
