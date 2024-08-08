"use client";
import Image from "next/image";

export default function AddFriend() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Image
        width={300}
        height={300}
        alt="Sync.dev friend image"
        src="/friend_robot.png"
      />
      <div className="text-gray-400">
        It&apos;s a bit barren over here. Find some friends!
      </div>
    </div>
  );
}
