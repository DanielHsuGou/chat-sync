"use client";

import * as React from "react";
import { Josefin_Sans } from "next/font/google";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const font = Josefin_Sans({
  weight: "400",
  subsets: ["latin"],
});

export function Categories({ category, position, setPosition }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="friend" variant="unset">
          {category}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-36"
      >
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="home" className={font.className}>
            Home
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="work" className={font.className}>
            Work
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gaming" className={font.className}>
            Gaming
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
