import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function toPusherKey(key) {
  return key.replace(/:/g, "__");
}
