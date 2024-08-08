"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function RegisterSocialMobile() {
  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle Facebook sign-in
  const handleFacebookSignIn = async () => {
    try {
      await signIn("facebook");
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle Github sign-in
  const handleGithubSignIn = async () => {
    try {
      await signIn("github");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#F6F6F6] rounded-b-lg flex-1 w-[80%] pb-[4%]">
      <div className="px-[15%] pb-[4%] flex justify-between items-center">
        <div className="h-0 w-16 border border-gray-300"></div>
        <span className="text-[10px] text-[#aeb5bf] font-semibold">
          or sign up with
        </span>
        <div className="h-0 w-16 border border-gray-300"></div>
      </div>
      <div className="flex justify-center items-center">
        <button onClick={handleGoogleSignIn}>
          <Image
            src="/googleicon.png"
            width={50}
            height={50}
            alt="Google login"
            className="mx-4 md:mx-0"
          />
        </button>
        <button onClick={handleFacebookSignIn}>
          <Image
            src="/facebookicon.png"
            width={50}
            height={50}
            alt="Facebook login"
            className="mx-4 md:mx-0"
          />
        </button>
        <button onClick={handleGithubSignIn}>
          <Image
            src="/githubicon.png"
            width={50}
            height={50}
            alt="Github login"
            className="mx-4 md:mx-0"
          />
        </button>
      </div>
    </div>
  );
}
