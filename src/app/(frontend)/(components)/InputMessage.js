"use client";
import { useState, useRef, useEffect } from "react";
import { Paperclip, Laugh, SendHorizontal, XCircle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileCode,
  FaFileVideo,
} from "react-icons/fa"; // Import file icons

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

const videoTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/flv",
  "video/mov",
  "video/avi",
  "video/wmv",
  "video/mpeg",
  "video/mpg",
  "video/3gp",
];

const fileIcons = {
  "application/pdf": FaFilePdf,
  "application/msword": FaFileWord,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FaFileWord,
  "application/vnd.ms-excel": FaFileExcel,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    FaFileExcel,
  "application/vnd.ms-powerpoint": FaFilePowerpoint,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    FaFilePowerpoint,
  "application/zip": FaFileArchive,
  "application/x-7z-compressed": FaFileArchive,
  "application/x-rar-compressed": FaFileArchive,
  "application/x-tar": FaFileArchive,
  "application/x-zip-compressed": FaFileArchive,
  "text/html": FaFileCode,
  "text/css": FaFileCode,
  "application/javascript": FaFileCode,
  "application/json": FaFileCode,
  "application/xml": FaFileCode,
  "video/mp4": FaFileVideo,
  "video/webm": FaFileVideo,
  "video/ogg": FaFileVideo,
  "video/flv": FaFileVideo,
  "video/mov": FaFileVideo,
  "video/avi": FaFileVideo,
  "video/wmv": FaFileVideo,
  "video/mpeg": FaFileVideo,
  "video/mpg": FaFileVideo,
  "video/3gp": FaFileVideo,
};

export default function InputMessage({
  input,
  setInput,
  attachments,
  setAttachments,
  sendMessage,
}) {
  const [isEmoji, setIsEmoji] = useState(false);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiIconRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleEmoji = () => {
    setIsEmoji(!isEmoji);
  };

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target) &&
      !emojiIconRef.current.contains(event.target)
    ) {
      setIsEmoji(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.filter(
      (file) => !attachments.some((attach) => attach.name === file.name)
    );
    setAttachments((prevFiles) => [...prevFiles, ...newAttachments]);
    console.log(files);
    event.target.value = null;
  };

  const handleRemoveImage = (img) => {
    setAttachments((prevFiles) => prevFiles.filter((e) => e !== img));
  };

  useEffect(() => {
    if (isEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmoji]);

  return (
    <div className="flex flex-col">
      {attachments.length !== 0 && (
        <div className="w-full border-gray-100 border-t-2 grid grid-cols-2 grid-flow-row rounded-xl">
          {attachments.map((file, index) => {
            const Icon = imageTypes.includes(file.type)
              ? null
              : fileIcons[file.type] || FaFileAlt;
            return (
              <div
                key={index}
                className="flex justify-between items-center w-full px-2 pt-1 gap-2"
              >
                {imageTypes.includes(file.type) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded-md mr-2"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-white rounded-md mr-2">
                    <Icon className="w-16 h-16 text-indigo-500" />
                  </div>
                )}
                <span className="text-gray-700 break-all text-xs w-full">
                  {file.name}
                </span>
                <XCircle
                  className="text-red-500 cursor-pointer hover:text-red-700 w-7"
                  onClick={() => handleRemoveImage(file)}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="lg:p-4 md:p-3 p-2 flex lg:gap-4 md:gap-3 gap-2 justify-center items-center relative">
        <div className="relative w-full">
          <Laugh
            className="text-blue-500 absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-blue-600"
            onClick={() => toggleEmoji()}
            ref={emojiIconRef}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full px-12 lg:pt-3 lg:pb-2 pt-2 pb-1 border rounded-2xl focus:outline-none bg-blue-50 text-black"
            placeholder="Type your message here..."
            ref={inputRef}
          />
          <Paperclip
            className="text-blue-500 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-blue-600"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />
        </div>
        <div
          className="text-white bg-blue-500 lg:rounded-xl rounded-full h-full w-14 flex items-center justify-center relative cursor-pointer hover:bg-blue-600"
          onClick={() => sendMessage()}
        >
          <SendHorizontal />
        </div>

        {isEmoji && (
          <div
            ref={emojiPickerRef}
            className="absolute lg:bottom-16 bottom-12 left-44 transform -translate-x-1/2 z-10 shadow-md shadow-blue-400/50"
          >
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setInput((prevInput) => `${prevInput}${emoji.emoji}`);
                setIsEmoji(false);
                inputRef.current.focus();
              }}
              searchDisabled={true} // Hide the search bar
              autoFocusSearch={false} // Prevent auto-focus on the search bar
              emojiStyle="twitter"
              height={400}
              width={300}
            />
          </div>
        )}
      </div>
    </div>
  );
}
