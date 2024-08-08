"use client";
import { useState, useEffect, useRef } from "react";
import Switch from "./switch";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Typewriter from "typewriter-effect";
import SlideProvider, {
  useSlide,
} from "../(pages)/(auth)/(slide)/slideProvider";
import Required from "./required";
import { signIn, useSession } from "next-auth/react";
import Cookies from "js-cookie";
import Loading from "@/app/(frontend)/(components)/Loading";

export function Login() {
  const { data: session, status } = useSession();
  const router = useRouter(); // URL changing function

  // various useStates
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [emailRequired, setEmailRequired] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [emailValidate, setEmailValidate] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);
  const [accountIsNotVerified, setAccountIsNotVerified] = useState(false);
  const {
    slideLeftState,
    slideRightState,
    slideLeftDispatch,
    slideRightDispatch,
  } = useSlide();
  const [isLoading, setIsLoading] = useState(false);

  // Event value change of email field
  function emailOnChange(e) {
    setEmail(e.target.value);
  }

  // Event value change of password field
  function passwordOnChange(e) {
    setPassword(e.target.value);
  }

  // Submitting the login form
  async function loginSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    // Check if the email is verified

    const resUserCheck = await fetch("/api/accountExists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const { user } = await resUserCheck.json();

    if (user && !user.isVerified) {
      setIsNotVerified(true);
      setIsLoading(false);
      return;
    } else {
      setIsNotVerified(false);
    }

    if (
      !emailRequired &&
      !passwordRequired &&
      !emailValidate &&
      !isNotVerified &&
      !accountIsNotVerified
    ) {
      setAccountIsNotVerified(false);

      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (res.error) {
          console.log(res.error);
          // Handle the error appropriately
          setAccountIsNotVerified(true); // Show invalid credentials warning
          setIsLoading(false);
          return;
        }
        if (res.ok) {
          console.log("Login successful");
          console.log("isOn:", isOn);
          setTimeout(() => {
            if (isOn) {
              Cookies.set("rememberMe", "on", {
                expires: 14,
                sameSite: "None",
                secure: true,
              }); // Set cookie with SameSite attribute
            } else {
              Cookies.set("rememberMe", "on", {
                expires: 7,
                sameSite: "None",
                secure: true,
              });
            }
            router.push("/chat");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  }

  // Functions to check if the input fields are empty
  useEffect(() => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const signInButton = document.getElementById("signInButton");

    function emailEmptyCheck(e) {
      if (!e.target.value) {
        setEmailRequired(true);
        setEmailValidate(false);
      } else {
        setEmailRequired(false);
      }
    }

    function passwordEmptyCheck(e) {
      if (!e.target.value) {
        setPasswordRequired(true);
      } else {
        setPasswordRequired(false);
      }
    }

    function handleSubmit(e) {
      emailEmptyCheck({ target: emailInput });
      passwordEmptyCheck({ target: passwordInput });
    }

    emailInput.addEventListener("blur", emailEmptyCheck);
    passwordInput.addEventListener("blur", passwordEmptyCheck);
    signInButton.addEventListener("click", handleSubmit);

    return () => {
      // Clean up the event listener when the component unmounts
      emailInput.removeEventListener("blur", emailEmptyCheck);
      passwordInput.removeEventListener("blur", passwordEmptyCheck);
      signInButton.removeEventListener("click", handleSubmit);
    };
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  // Validating email before submission
  const ref = useRef(null);
  useEffect(() => {
    const re =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const handleValidation = (e) => {
      if (ref.current.value) {
        if (!ref.current || !re.test(ref.current.value)) {
          setEmailValidate(true);
          // setAccountIsNotVerified(false);
        } else {
          setEmailValidate(false);
        }
      }
    };

    const handleFocus = () => {
      setEmailValidate(false);
    };

    const handleBlur = () => {
      handleValidation();
    };

    if (ref.current) {
      ref.current.addEventListener("focus", handleFocus);
      ref.current.addEventListener("blur", handleBlur);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("focus", handleFocus);
        ref.current.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  // Function for login page sliding to the left to make room for register page
  function handleRegister() {
    slideLeftDispatch({ type: "SLIDETOLEFT" });
    setTimeout(() => {
      router.push("/register");
    }, 400);
    if (window !== "undefined") {
      window.localStorage.setItem("registerButtonClicked", "true");
    }
  }

  // Function for login page sliding to the left to make room for forget_credentials page
  const handleForget = () => {
    slideLeftDispatch({ type: "SLIDETOLEFT" });
    setTimeout(() => {
      router.push("/forget_credentials");
    }, 400);
    if (window !== "undefined") {
      window.localStorage.setItem("forgetButtonClicked", "true");
    }
  };

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const res = await signIn("google", { redirect: false });
      if (res.ok) {
        if (isOn) {
          Cookies.set("rememberMe", "on", {
            expires: 14,
            sameSite: "None",
            secure: true,
          });
        } else {
          Cookies.set("rememberMe", "on", {
            expires: 7,
            sameSite: "None",
            secure: true,
          });
        }
        router.push("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle Facebook sign-in
  const handleFacebookSignIn = async () => {
    try {
      const res = await signIn("facebook", { redirect: false });
      if (res.ok) {
        if (isOn) {
          Cookies.set("rememberMe", "on", {
            expires: 14,
            sameSite: "None",
            secure: true,
          });
        } else {
          Cookies.set("rememberMe", "on", {
            expires: 7,
            sameSite: "None",
            secure: true,
          });
        }
        router.push("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle Github sign-in
  const handleGithubSignIn = async () => {
    try {
      const res = await signIn("github", { redirect: false });
      if (res.ok) {
        if (isOn) {
          Cookies.set("rememberMe", "on", {
            expires: 14,
            sameSite: "None",
            secure: true,
          });
        } else {
          Cookies.set("rememberMe", "on", {
            expires: 7,
            sameSite: "None",
            secure: true,
          });
        }
        router.push("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#F6F6F6] md:mt-[5%] md:mr-6 pt-[24px] rounded-lg h-auto">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
          <Loading />
        </div>
      ) : (
        <form method="POST" noValidate onSubmit={loginSubmit}>
          <div className="flex flex-col justify-start items-start mx-[24px] my-[24px]">
            <label
              htmlFor="email"
              className="text-[12px] md:text-[16px] pb-1 text-[#1E1E1E]"
            >
              Email
              {emailRequired ? <Required error={`Required`} /> : ""}
              {emailValidate ? (
                <Required error={`Invalid email format!`} />
              ) : (
                ""
              )}
              {isNotVerified && (
                <Required
                  error={`You have not verified your email address yet. Please check your inbox again.`}
                />
              )}
              {accountIsNotVerified && (
                <Required>Invalid credentials!</Required>
              )}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="text-[12px] md:text-[16px] pl-2 text-gray-950 rounded-md md:h-[40px] h-[25px] w-full border-2 border-[#B3B3B3]"
              value={email}
              onChange={emailOnChange}
              ref={ref}
            ></input>
          </div>
          <div className="flex flex-col justify-start items-start mx-[24px] my-[24px]">
            <label
              htmlFor="password"
              className="text-[12px] md:text-[16px] pb-1 text-[#1E1E1E]"
            >
              Password
              {passwordRequired ? <Required error={`Required`} /> : ""}
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="text-[12px] md:text-[16px] pl-2 text-gray-950 rounded-md h-[25px] md:h-[40px] w-full border-2 border-[#B3B3B3]"
              value={password}
              onChange={passwordOnChange}
            ></input>
          </div>
          <div className="flex flex-col justify-start items-start mx-[24px] my-[24px]">
            <Button
              id="signInButton"
              size="default"
              variant="default"
              className="text-[12px] md:text-[16px] bg-[#1D33A8] text-[#F5F5F5] rounded-md h-[25px] md:h-[40px] w-full"
            >
              Sign In
            </Button>
            <div className="flex justify-start items-center mt-[24px]">
              <Switch
                isOn={isOn}
                handleToggle={() => setIsOn(!isOn)}
                onColor="rgb(59, 130, 246)"
              />
              <div className="text-[#1E1E1E] mx-3 md:pt-1 text-[13px] md:text-[20px]">
                Remember Me
              </div>
            </div>
          </div>
        </form>
      )}
      <div className="mx-[24px] flex justify-between items-center">
        <div className="h-0 w-16 md:w-44 border border-gray-300"></div>
        <span className="min-w-[100px] text-[13px] md:text-[13px] text-[#aeb5bf] font-semibold">
          or log in with
        </span>
        <div className="h-0 w-16 md:w-44 border border-gray-300"></div>
      </div>
      <div className="mx-[80px] mt-[10px] flex md:justify-between justify-center items-center">
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
            alt="GitHub login"
            className="mx-4 md:mx-0"
          />
        </button>
      </div>
      <div className="mx-[24px] my-[15px] md:my-[20px] text-[10px] md:text-[13px] flex justify-between items-center">
        <button
          onClick={handleForget}
          className="text-[#1E1E1E] underline underline-offset-4"
        >
          Forgot password?
        </button>
        <button
          onClick={handleRegister}
          className="text-[#1E1E1E] underline underline-offset-4"
        >
          Need an account?
        </button>
      </div>
    </div>
  );
}

export default function LoginPageComponent() {
  const {
    slideLeftState,
    slideRightState,
    slideLeftDispatch,
    slideRightDispatch,
  } = useSlide();
  let className = `flex flex-col md:flex-row md:justify-around items-center ml-[2%]`;
  if (typeof window !== "undefined") {
    const backButtonClicked = window.localStorage.getItem("backButtonClicked");

    if (!!backButtonClicked) {
      className += " slide-from-left";
      setTimeout(
        () => window.localStorage.removeItem("backButtonClicked"),
        300
      );
    }
  }

  if (slideLeftState.slideLeft) {
    className += " slide-to-left";
  }
  return (
    <div>
      <div className={className}>
        <h1 className="mt-[10%] text-md md:text-6xl text-[#A8A8FF] font-bold md:mt-[4%] md:w-[700px] md:h-[130px] text-md w-[300px] min-h-[55px]">
          <Typewriter
            options={{ loop: true }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Start Your Chat Journey Here!")
                .pauseFor(1000)
                .deleteChars(18)
                .typeString("Social Life Here!")
                .pauseFor(1000)
                .deleteChars(17)
                .typeString("Gaming Experience Here!")
                .pauseFor(1000)
                .deleteChars(23)
                .typeString("Work Life Here!")
                .pauseFor(1000)
                .deleteAll()
                .start();
            }}
          />
        </h1>
        <Login />
      </div>
    </div>
  );
}
