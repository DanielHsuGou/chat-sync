import React, { useRef, useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Player } from "@lottiefiles/react-lottie-player";
import ServerContext from "../(context)/ServerContext";

const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/webp",
  "image/jxr",
  "image/vnd.ms-photo",
  "image/vnd.adobe.photoshop",
  "image/svg+xml",
];

const ServerModal = ({ onClose }) => {
  const {
    serverIcon,
    serverIconCloud,
    serverCategory,
    serverName,
    setServerName, // Add setters to the context
    setServerIcon,
    setServerIconCloud,
    setServerCategory,
    setMessage,
    setLoading,
    message,
    loading,
    createServer,
    currentUser,
  } = useContext(ServerContext);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && imageTypes.includes(file.type)) {
      const iconURL = URL.createObjectURL(file);
      setServerIcon(iconURL);
      setServerIconCloud(file);
      console.log(file);
    }
    event.target.value = null;
  };

  const handleDeleteIcon = () => {
    setServerIcon(null);
    setServerIconCloud(null);
  };

  const handleCategoryChange = (event) => {
    setServerCategory(event.target.value);
  };

  const handleNameChange = (event) => {
    setServerName(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black z-30">
      <div className="bg-blue-50 rounded-lg p-6 w-96 min-h-96 shadow-lg relative">
        {loading && (
          <div>
            <Player
              autoplay
              loop
              speed="3"
              src="/loader_plane.json"
              style={{ height: "300px", width: "300px" }}
            />
          </div>
        )}
        {!loading && (
          <div>
            <IoIosClose
              className="absolute top-4 right-4 text-black cursor-pointer hover:text-red-600"
              size={24}
              onClick={onClose}
            />
            <h2 className="text-lg font-semibold text-center">
              Customize Your Server
            </h2>
            <p className="mt-2 text-gray-600 text-xs">
              Give your new server a personality with a name and an icon. You
              can always change it later.
            </p>
            <div className="flex justify-center items-center">
              {serverIcon && (
                <div
                  onClick={handleDeleteIcon}
                  className="hover:bg-red-700 absolute top-28 left-52 cursor-pointer rounded-full bg-red-500 flex items-center justify-center w-6 h-6"
                >
                  <RiDeleteBin6Line className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer flex flex-col items-center justify-center my-4 border-dashed border-2 border-gray-400 p-4 rounded-full w-24 h-24"
                style={{
                  backgroundImage: serverIcon ? `url(${serverIcon})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!serverIcon && (
                  <>
                    <div className="text-4xl">+</div>
                    <span className="text-gray-500">UPLOAD</span>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <p className="text-xs">Server Name</p>
            <input
              type="text"
              placeholder="SERVER NAME"
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              onChange={handleNameChange}
            />
            <p className="text-[10px] mb-2">
              By creating a server, you agree to Sync's{" "}
              <a href="#" className="text-blue-500">
                Community Guidelines.
              </a>
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <select
                className="border border-gray-300 rounded-md p-2 w-24"
                onChange={handleCategoryChange}
              >
                <option value="Work">Work</option>
                <option value="Gaming">Gaming</option>
              </select>
              <button
                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 w-full"
                onClick={() => createServer(currentUser._id)}
              >
                Create
              </button>
            </div>

            {message === "blank" && (
              <div className="text-center text-red-500">
                Please input Server Name!
              </div>
            )}
            {message === "long" && (
              <div className="text-center text-red-500">
                Please enter less than 20 characters!
              </div>
            )}
            {message === "serverCreated" && (
              <div className="text-center text-green-500">Server Created!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerModal;
