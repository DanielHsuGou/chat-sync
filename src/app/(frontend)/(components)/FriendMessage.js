import { FaUserFriends } from "react-icons/fa";

const FriendMessage = () => {
    return (
        <div
            className="w-80 mx-auto rounded-lg bg-blue-100 shadow-lg text-black text-center py-2 px-4 font-bold flex items-center justify-center space-x-3 transition-all"
            style={{ transition: 'all 1800ms ease' }}
        >
            <div className="bg-blue-200 p-2 rounded-full text-blue-500 transition-all" style={{ transition: 'all 1800ms ease' }}>
                <FaUserFriends size={20} />
            </div>
            <p className="m-0 text-blue-700 text-sm">Friend request sent successfully!</p>
        </div>
    );
};

export default FriendMessage;