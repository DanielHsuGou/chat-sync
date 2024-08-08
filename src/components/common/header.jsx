"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Typography from "@/components/ui/typography";
import { Pacifico } from "next/font/google";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const pacifico = Pacifico({ subsets: ["latin"], weight: ["400"] });

export function Header({ className }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState(null);
  const [rememberMe, setRememberMe] = useState(null);
  const pathname = usePathname();
  const items = [
    // {
    //   href: "https://map.sistilli.dev/public/coding/SaaS+Boilerplate",
    //   title: "Book a demo",
    //   openInNewTab: true,
    // },
    // { href: '#pricing', title: 'Features' },
    // {
    //   href: 'mailto:myemail@.com',
    //   title: 'Contact Us'
    // }
  ];

  useEffect(() => {
    const fetchTokenAndCookie = async () => {
      const session = await getSession();
      setSession(session);
      setIsLoggedIn(!!session); // Update isLoggedIn based on token presence

      const rememberMeCookie = document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("rememberMe="));
      setRememberMe(rememberMeCookie ? rememberMeCookie : null);
      if (session && rememberMe) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchTokenAndCookie();
  }, [rememberMe]);

  async function logoutHandle(e) {
    e.preventDefault();
    await signOut({ redirect: false });
    router.push("/login");
  }

  const getLogo = () => (
    <Link href="/" className="pointer flex items-center">
      <img src="/robo_icon.png" className="mr-3 w-16 h-16" />
      <Typography className="!text-black !text-xl font-medium">Sync</Typography>
    </Link>
  );

  const getAuthButtons = () => (
    <div className="flex gap-3 items-center">
      {isLoggedIn ? (
        <div className="flex gap-3 items-center">
          <Link href="/chat">
            <Image
              src="/chat_bot.png"
              alt="avatar"
              className="rounded-[50%] w-[50px] h-[50px]"
              width={120}
              height={120}
            />
          </Link>
          <Link href="/" target="_blank" onClick={(e) => logoutHandle(e)}>
            <Button
              size="lg"
              variant="outline"
              className="border-teal-800 hover:border-teal-850 hover:shadow-md hover:shadow-teal-900"
            >
              <Typography variant="p" className="text-black-500">
                Logout
              </Typography>
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {" "}
          <Link href="/login" target="_blank">
            <Button size="lg" variant="outline">
              <Typography variant="p" className="text-blue-600">
                Login
              </Typography>
            </Button>
          </Link>
          <Link href="/register" target="_blank">
            <Button size="lg" variant="default">
              <Typography variant="p">Sign Up</Typography>
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  const getHeaderItems = () => {
    return (
      <>
        {items.map((item) => {
          const selected =
            pathname === item.href || pathname.includes(item.href);
          return (
            <Link
              href={item.href}
              className="pointer block w-fit"
              target={item.openInNewTab ? "_blank" : ""}
              key={item.title}
            >
              <Typography
                variant="p"
                className={cn(selected && "text-primary")}
              >
                {item.title}
              </Typography>
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={cn(
        `flex md:h-23 h-20 items-center justify-center w-full
          border-b bg-white`,
        className
      )}
    >
      <div className="w-full md:px-16 px-6 max-w-[1500px]">
        {/* Desktop */}
        <div className="flex items-center gap-x-8 w-full">
          <div className={`md:flex-0 min-w-fit flex-1 ${pacifico.className}`}>
            {getLogo()}
          </div>
          <div className="md:flex flex items-center w-full">
            <div className="flex items-center gap-x-8 flex-1">
              {getHeaderItems()}
            </div>
            {getAuthButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}
