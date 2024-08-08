"use client";
import React from "react";
import { MdInbox, MdBrowserUpdated } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import NotificationButton from "./NotificationButton";

const Notification = ({ onClose }) => {
  const messages = [
    {
      id: 1,
      text: "Add your first friend on Discord!",
      time: "1mo",
      type: "TODO",
    },
    {
      id: 2,
      text: "Update your profile by adding an avatar.",
      time: "1mo",
      type: "TODO",
    },
  ];

  const notificationCount = messages.length;

  return (
    <div className="absolute z-30 bottom-20 left-20 rounded-lg border border-gray-300 shadow-lg bg-blue-100 text-black">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <MdInbox className="mr-2" />
          <h2 className="text-xl font-semibold">Inbox</h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="text-black hover:text-red-500 font-bold ml-2"
          >
            <IoCloseCircle size={28} />
          </button>
        </div>
      </div>
      <div className="flex mb-2 ml-2">
        <button className="px-1 py-1 text-sm font-medium text-black bg-blue-300 rounded hover:bg-blue-200">
          For You
        </button>
        <button className="px-1 py-1 text-sm font-medium text-black bg-blue-300 rounded hover:bg-blue-200 mx-2">
          Unread
        </button>
        <button className="px-1 py-1 text-sm font-medium text-black bg-blue-300 rounded hover:bg-blue-200">
          Mentions
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg max-h-40 overflow-y-hidden">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center border-b border-gray-200 py-2"
          >
            <MdBrowserUpdated className="mr-2" />
            <div className="flex-1">
              <span className="font-semibold block">{message.type}</span>
              <span>{message.text}</span>
              <span className="text-gray-500 text-sm ml-2">{message.time}</span>
            </div>
            <button className="text-gray-500 hover:text-gray-600">...</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;

{
  /*import React from 'react';
import { MdInbox, MdBrowserUpdated } from 'react-icons/md';
import NotificationButton from './NotificationButton';

const Inbox = ({ isOpen, onClose }) => {
  const messages = [
    { id: 1, text: "Add your first friend on Discord!", time: "1mo", type: "TODO" },
    { id: 2, text: "Update your profile by adding an avatar.", time: "1mo", type: "TODO" },
  ];

  if (!isOpen) return null;

  return (
    <div className="max-w-md mx-auto mt-8 rounded-lg border border-gray-300 shadow-lg bg-blue-100 text-black">
      <header className='flex items-center justify-between p-4'>
        <div className='flex items-center'>
          <MdInbox className="mr-2" />
          <h2 className="text-xl font-semibold">Inbox</h2>
        </div>
        <div className='flex items-center'>
          <NotificationButton count={messages.length} />
          <button onClick={onClose} className="text-black font-bold ml-2">X</button>
        </div>
      </header>
      <div className='bg-white p-4 rounded-lg'>
        {messages.map(({ id, text, time, type }) => (
          <div key={id} className="flex items-center border-b border-gray-200 py-2">
            <MdBrowserUpdated className='mr-2' />
            <div className="flex-1">
              <span className="font-semibold block">{type}</span>
              <span>{text}</span>
              <span className="text-gray-500 text-sm ml-2">{time}</span>
            </div>
            <button className="text-gray-500 hover:text-gray-600">...</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
*/
}
