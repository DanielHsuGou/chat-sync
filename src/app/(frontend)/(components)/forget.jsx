"use client";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import SlideProvider, {
  useSlide,
} from "../(pages)/(auth)/(slide)/slideProvider";
import { useRouter } from "next/navigation";
import "./slide.css";
import Required from "./required";

export function Forget({ handleBack }) {
  function forgetSubmit(e) {
    e.preventDefault();
  }

  const [email, setEmail] = useState("");
  const [emailRequired, setEmailRequired] = useState(false);
  const [emailValidate, setEmailValidate] = useState(false);

  function emailOnChange(e) {
    setEmail(e.target.value);
  }

  // Functions to check if the input fields are empty
  useEffect(() => {
    const emailInput = document.getElementById("recovery_email");
    const forgetSubmitButton = document.getElementById("forgetSubmitButton");

    function emailEmptyCheck(e) {
      if (!e.target.value) {
        setEmailRequired(true);
        setEmailValidate(false);
      } else {
        setEmailRequired(false);
      }
    }

    function handleSubmit() {
      emailEmptyCheck({ target: emailInput });
    }

    emailInput.addEventListener("blur", emailEmptyCheck);
    forgetSubmitButton.addEventListener("click", handleSubmit);

    return () => {
      // Clean up the event listener when the component unmounts
      emailInput.removeEventListener("blur", emailEmptyCheck);
      forgetSubmitButton.removeEventListener("click", handleSubmit);
    };
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  // Validating email before submission
  const refEmail = useRef(null);
  useEffect(() => {
    const reEmail =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const handleValidation = (e) => {
      if (refEmail.current.value) {
        if (!refEmail.current || !reEmail.test(refEmail.current.value)) {
          setEmailValidate(true);
        } else {
          setEmailValidate(false);
        }
      }
    };

    const handleBlur = () => {
      handleValidation();
    };

    if (refEmail.current) {
      refEmail.current.addEventListener("blur", handleBlur);
    }

    return () => {
      if (refEmail.current) {
        refEmail.current.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  return (
    <div
      className={`bg-[#F6F6F6] mt-[10%] md:mr-6 w-[300px] md:w-[550px] py-[20px] rounded-lg`}
    >
      <button onClick={handleBack} className="mb-[1px] md:mb-0 md:mt-[4px]">
        <svg
          class="w-[24px] md:w-[36px] md:h-[36px] text-gray-800 dark:text-white inline"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m14 8-4 4 4 4"
          />
        </svg>

        <span className="text-[12px] md:text-[16px]">Back</span>
      </button>
      <form onSubmit={forgetSubmit}>
        <p className="mx-[24px] -mt-[22px] md:-mt-[30px] text-[12px] md:text-[16px] text-[#1E1E1E] text-center">
          Recover Your Account
        </p>

        <div className="flex flex-col justify-start items-start mx-[24px] my-[24px]">
          <label
            for="recovery_email"
            className="text-[12px] md:text-[16px] pb-1 text-[#1E1E1E]"
          >
            Recovery Email
            {emailRequired ? <Required error="Required" /> : ""}
            {emailValidate ? <Required error="Invalid Email Format!" /> : ""}
          </label>
          <input
            id="recovery_email"
            name="recovery_email"
            type="email"
            placeholder="Recovery Email"
            className="text-[12px] md:text-[16px] pl-2 text-gray-950 rounded-md md:h-[40px] h-[25px] w-full border-2 border-[#B3B3B3]"
            value={email}
            onChange={emailOnChange}
            ref={refEmail}
          ></input>
        </div>
        <div className="flex flex-col justify-start items-start mx-[24px] my-[20px]">
          <Button
            id="forgetSubmitButton"
            size="default"
            variant="default"
            className="text-[12px] md:text-[16px] bg-[#1D33A8] text-[#F5F5F5] rounded-md h-[25px] md:h-[40px] w-full"
          >
            Recover Your Password
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ForgetPageComponent() {
  const router = useRouter();
  const {
    slideLeftState,
    slideRightState,
    slideLeftDispatch,
    slideRightDispatch,
  } = useSlide();
  let className = `flex justify-center items-center`;
  if (typeof window !== "undefined") {
    const forgetButtonClicked = localStorage.getItem("forgetButtonClicked");

    if (forgetButtonClicked) {
      className += " slide-from-right";
      setTimeout(() => {
        localStorage.removeItem("forgetButtonClicked");
      }, 100);
    }
  }

  const slidetoRight = () => {
    slideRightDispatch({ type: "SLIDETORIGHT" });
    setTimeout(() => {
      router.push("/login");
    }, 400);
    if (typeof window !== "undefined") {
      localStorage.setItem("backButtonClicked", "true");
    }
  };

  if (slideRightState.slideRight) {
    className += " slide-to-right";
  }

  return (
    <div className={className}>
      <Forget handleBack={slidetoRight} />
    </div>
  );
}
