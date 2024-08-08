import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="w-full p-4 border-none rounded-full shadow-blue-300 outline-none text-base text-gray-800 bg-white"
      />
      <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-blue-400 hover:bg-blue-500 rounded-full text-white font-bold">
        <AiOutlineSearch />
      </button>
    </div>
  );
}
