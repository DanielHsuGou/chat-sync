import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function RegisterSocial() {
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
    <div className="flex mt-0 max-w-[45%] md:mt-[2.67%] flex-1">
      <div className="flex flex-row h-[100%]">
        <div className="flex flex-col justify-center items-center bg-[#F6F6F6] py-[29.3%] w-[55%] flex-1">
          <div className="border border-l-1 h-[180px] border-[#aeb5bf]"></div>
          <p className="my-2 text-[12px] md:text-[16px] text-[#aeb5bf] font-extrabold">
            OR
          </p>
          <div className="border border-l-1 h-[180px] border-[#aeb5bf]"></div>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#F6F6F6] rounded-r-lg px-[10%]">
          <Button
            size="default"
            variant="grey"
            className="py-2 md:py-6 my-[24px] text-[12px] md:text-[16px] bg-[#F5F5F5] text-[#1E1E1E] drop-shadow-lg hover:bg-[#60595e]/60 hover:text-[#F5F5F5] hover:shadow-md rounded-md h-[25px] md:h-[40px] w-full px-6"
            onClick={handleGoogleSignIn}
          >
            Sign Up with Google
            <Image
              className="mx-[5px] w-[18px] h-[18px] md:w-[30px] md:h-[30px]"
              src="/googleicon.png"
              height={30}
              width={30}
              alt="Google_register"
            />
          </Button>
          <Button
            size="default"
            variant="grey"
            className="py-2 md:py-6 my-[24px] text-[12px] md:text-[16px] bg-[#F5F5F5] text-[#1E1E1E] drop-shadow-md hover:bg-[#60595e]/60 hover:text-[#F5F5F5] hover:shadow-md rounded-md h-[25px] md:h-[40px] w-full px-6"
            onClick={handleFacebookSignIn}
          >
            Sign Up with Facebook
            <Image
              className="mx-[5px] w-[18px] h-[18px] md:w-[30px] md:h-[30px]"
              src="/facebookicon.png"
              height={30}
              width={30}
              alt="facebookregister"
            />
          </Button>
          <Button
            size="default"
            variant="grey"
            className="py-2 md:py-6 my-[24px] text-[12px] md:text-[16px] bg-[#F5F5F5] text-[#1E1E1E] drop-shadow-md hover:bg-[#60595e]/60 hover:shadow-md hover:text-[#F5F5F5] rounded-md h-[25px] md:h-[40px] w-full px-6"
            onClick={handleGithubSignIn}
          >
            Sign Up with Github
            <Image
              className="mx-[5px] w-[18px] h-[18px] md:w-[30px] md:h-[30px]"
              src="/githubicon.png"
              height={30}
              width={30}
              alt="githubregister"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}