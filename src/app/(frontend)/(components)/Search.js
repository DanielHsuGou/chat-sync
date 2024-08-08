"use client";
import { useState, useContext, useRef, useEffect } from "react"; // Hook
import { Button } from "@/components/ui/button";
// import { createContext, useContext } from "react";

// import style from "./Form.module.css";
import ServerContext from "../(context)/ServerContext";

export default function Search({
  placeholder,
  buttonName,
  submitValue,
  setSubmitValue,
  inputIntermediate,
}) {
  const { servers } = useContext(ServerContext);

  const [value, setValue] = useState("");

  const [serverSuggestions, setServerSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // inputIntermediate = useContext(FriendContext);

  function handleChange(event) {
    handleServerSearchChange(event.target.value);
    setIsDropdownVisible(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitValue(value);
    setValue("");
    setIsDropdownVisible(false);
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleServerSearchChange = (val) => {
    setValue(val);
    if (val.length > 0) {
      // Filter server suggestions based on the input value
      const filteredServers = servers.filter((server) =>
        server.serverName.toLowerCase().includes(val.toLowerCase())
      );
      setServerSuggestions(filteredServers);
    } else {
      setServerSuggestions([]);
    }
  };

  const handleSuggestionClick = (serverName) => {
    setValue(serverName);
    setServerSuggestions([]);
    setIsDropdownVisible(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full relative"
      >
        <input
          id="input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyUp={inputIntermediate}
          className="w-full lg:text-sm text-xs rounded-2xl shadow-5 p-5 border-2 h-13 shadow-md shadow-sky-300/50 focus:outline-none"
        />
        <Button
          variant="default"
          size="sm"
          className="absolute right-3 rounded-xl h-10 lg:text-sm text-xs text-white lg:w-44 w-24 text-wrap"
        >
          {buttonName}
        </Button>
        {isDropdownVisible && serverSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="bg-white border border-gray-300 rounded-2xl lg:top-16 top-14 w-full z-40 absolute shadow-md shadow-sky-300/50"
          >
            {serverSuggestions.map((server) => (
              <div
                key={server._id}
                className="p-2 cursor-pointer hover:bg-blue-100 rounded-2xl"
                onClick={() => handleSuggestionClick(server.serverName)}
              >
                {server.serverName}
              </div>
            ))}
          </div>
        )}
      </form>
    </>
  );
}
