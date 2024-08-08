"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ subsets: ["latin"], weight: ["400"] });

export function Footer() {
  return (
    <footer className="flex h-24 items-center justify-center w-full border-t bg-blue-500 text-white">
      <div className="w-full max-w-[1500px] md:px-16 px-6 flex place-content-center">
        <div className="gap-x-11 md:flex flex-1">
          <Link href="/" className="pointer flex items-center">
            <img src="/robo_icon.png" className="mr-3 w-16 h-16" />
            <Typography
              className={`!text-xl font-medium ${pacifico.className}`}
            >
              Sync
            </Typography>
          </Link>
        </div>
        <div className="flex max-w-fit items-center gap-x-4">
          <Link href="/chat" target="_blank">
            <Button size="lg" variant="outline">
              <Typography variant="p" className="text-blue-600">
                Open Sync
              </Typography>
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
