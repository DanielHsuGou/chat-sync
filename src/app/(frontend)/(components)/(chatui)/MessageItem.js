"use client";
import { useState, useRef, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileCode,
} from "react-icons/fa"; // Import file icons

const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "ico",
  "webp",
  "jxr",
  "psd",
  "svg",
];

const videoExtensions = [
  "mp4",
  "webm",
  "ogv",
  "flv",
  "mov",
  "avi",
  "wmv",
  "mpeg",
  "mpg",
  "3gp",
];

const fileIcons = {
  pdf: FaFilePdf,
  doc: FaFileWord,
  docx: FaFileWord,
  xls: FaFileExcel,
  xlsx: FaFileExcel,
  ppt: FaFilePowerpoint,
  pptx: FaFilePowerpoint,
  zip: FaFileArchive,
  "7z": FaFileArchive,
  rar: FaFileArchive,
  tar: FaFileArchive,
  html: FaFileCode,
  css: FaFileCode,
  js: FaFileCode,
  json: FaFileCode,
  xml: FaFileCode,
  txt: FaFileAlt,
};

export default function MessageItem({
  icon,
  userName,
  text,
  time,
  file,
  userId,
  currentUserId,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFileType, setVideoFileType] = useState(null);
  const videoRef = useRef(null);

  const currentTime = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const todayDate = `${currentTime.getDate()} ${
    months[currentTime.getMonth()]
  } ${currentTime.getFullYear()}`;
  const displayDate = time.replace(`${todayDate},`, "Today,");

  const openModal = (fileUrl, isImage, videoFiletype) => {
    if (isImage) {
      setSelectedImage(fileUrl);
    } else {
      setSelectedVideo(fileUrl);
      setVideoFileType(videoFiletype);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  useEffect(() => {
    if (isModalOpen && selectedVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [isModalOpen, selectedVideo]);

  const getFileNameFromUrl = (url) => {
    return decodeURIComponent(url.split("/").pop().split("?")[0]);
  };

  return (
    <div className={`flex justify-start items-start mt-5`}>
      {currentUserId !== userId && (
        <img
          src={icon || "/chat_bot.png"}
          className="mr-3 mt-3 md:w-12 md:h-12 w-10 h-10 rounded-full"
        />
      )}
      <div className={`flex flex-col items-start`}>
        <div
          className={`flex w-full justify-between items-center gap-3 text-xs mt-1 px-2 ${
            currentUserId === userId ? "flex-row-reverse" : ""
          }`}
        >
          <div className="font-bold text-gray-500">{userName}</div>
          <div className="font-thin text-gray-400/80">{displayDate}</div>
        </div>
        <div
          style={{
            minWidth: `${(userName?.length + displayDate.length) * 6 + 30}px`,
          }}
          className={`flex flex-col gap-2 p-2 rounded-xl text-wrap ${
            userId === currentUserId
              ? "bg-blue-400 text-white"
              : "bg-blue-100 text-black"
          }`}
        >
          {file &&
            Array.isArray(file) &&
            file.map((fileUrl, index) => {
              const fileType = fileUrl.split(".").pop().toLowerCase();
              const isImage = imageExtensions.includes(fileType);
              const isVideo = videoExtensions.includes(fileType);

              const Icon = fileIcons[fileType] || FaFileAlt;
              const fileName = getFileNameFromUrl(fileUrl);

              if (isImage && fileUrl !== "loadImg" && fileUrl !== "noImg") {
                return (
                  <div key={fileUrl}>
                    <img
                      className="rounded-lg cursor-pointer xl:max-w-96 lg:max-w-72 max-w-60"
                      src={fileUrl}
                      alt={`attachment-${index}`}
                      onClick={() => openModal(fileUrl, isImage)}
                    />
                  </div>
                );
              }
              if (isVideo && fileUrl !== "loadImg" && fileUrl !== "noImg") {
                return (
                  <div key={fileUrl}>
                    <video
                      controls
                      className="rounded-lg max-w-full cursor-pointer"
                      onClick={() => openModal(fileUrl, isImage, fileType)}
                    >
                      <source src={fileUrl} type={`video/${fileType}`} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                );
              }

              if (fileUrl === "loadImg") {
                return (
                  <div
                    key={fileUrl}
                    className={`flex flex-col justify-center items-center h-full`}
                  >
                    <Player
                      autoplay
                      loop
                      speed="1"
                      src="/loader_image.json"
                      style={{ height: "200px", width: "200px" }}
                    />
                  </div>
                );
              }
              if (!isImage && fileUrl !== "loadImg" && fileUrl !== "noImg") {
                return (
                  <div key={fileUrl}>
                    <a
                      href={fileUrl}
                      className="flex flex-col items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon
                        className={`w-12 h-12 ${
                          currentUserId === userId
                            ? "text-white"
                            : "text-indigo-500"
                        }`}
                      />
                      <p
                        className={`w-36 text-xs mt-2 text-center break-words ${
                          currentUserId === userId
                            ? "text-white"
                            : "text-indigo-500"
                        }`}
                      >
                        {fileName}
                      </p>
                    </a>
                  </div>
                );
              }
              return null;
            })}

          {text && <div className="mx-2 mt-1">{text}</div>}
        </div>
      </div>

      {userId === currentUserId && (
        <img
          src={icon || "/chat_bot.png"}
          className="ml-3 mt-3 md:w-12 md:h-12 w-10 h-10 rounded-full"
        />
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-screen w-auto h-auto"
              />
            )}
            {selectedVideo && (
              <video
                ref={videoRef}
                controls
                className="max-w-full max-h-screen w-auto h-auto"
              >
                <source src={selectedVideo} type={`video/${videoFileType}`} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
