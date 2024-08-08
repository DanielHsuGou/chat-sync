import React from "react";
import { useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { Player } from "@lottiefiles/react-lottie-player";

const PopupModalConfirm = ({ message, onClose, onConfirm }) => {
  const modalRef = useRef(null);

  const handleModalClick = (event) => {
    // Prevent the click event from propagating to the overlay
    event.stopPropagation();
    onClose();
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the modal
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div
        ref={modalRef}
        onClick={handleModalClick}
        className="bg-blue-50 rounded-lg px-6 py-10 w-80 shadow-lg relative"
      >
        <IoIosClose
          className="absolute top-4 right-4 text-black cursor-pointer hover:text-red-600"
          size={24}
          onClick={onClose}
        />
        <Player
          autoplay
          loop
          src="/message_robot.json"
          style={{ height: "300px", width: "300px" }}
        />
        <p className="text-center text-lg font-semibold">{message}</p>
        <div className="flex justify-center pt-5">
          <button
            className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-lg"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModalConfirm;
