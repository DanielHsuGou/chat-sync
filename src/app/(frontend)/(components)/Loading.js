import React from 'react';

const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-blue-50 w-full">
            <img src="/robot.png" alt="Loading..." className="w-24 mb-0 animate-bounce" />
            <div className="text-black text-sm font-bold mb-2">您知道嗎</div>
            <div className="text-black text-sm font-normal"><button className="bg-gray-500 text-white font-bold py-1 px-1 rounded shadow hover:bg-gray-700 text-sm">
                SHIFT
            </button> <button className="bg-gray-500 text-white font-bold py-1 px-2 rounded shadow hover:bg-gray-700 text-sm">
                ESC
            </button> 以標示整個伺服器為已讀。</div>
        </div>
    );
};

export default Loading;