"use client";
import { useEffect, useState } from "react";

export const useScreenDetector = (initialValue) => {
  const [width, setWidth] = useState(initialValue);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      window.addEventListener("resize", handleWindowSizeChange);

      return () => {
        window.removeEventListener("resize", handleWindowSizeChange);
      };
    }
  }, []);

  const isMobile = width <= 768;
  const isDesktop = width > 768;

  return { isMobile, isDesktop };
};
