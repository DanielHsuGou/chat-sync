"use client";
import { useReducer, useContext } from "react";
import { slideReducer } from "./slide";
import { SlideContext } from "./slideContext";

export default function SlideProvider({ children }) {
  const [slideLeftState, slideLeftDispatch] = useReducer(slideReducer, {
    slideLeft: false,
  });
  const [slideRightState, slideRightDispatch] = useReducer(slideReducer, {
    slideRight: false,
  });
  return (
    <SlideContext.Provider
      value={{
        slideLeftState,
        slideRightState,
        slideLeftDispatch,
        slideRightDispatch,
      }}
    >
      {children}
    </SlideContext.Provider>
  );
}

export const useSlide = () => {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlide must be used within a SlideProvider");
  }
  return context;
};
