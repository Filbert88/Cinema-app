"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { Session } from "inspector";
import { signOut, useSession } from "next-auth/react";

const paths = [
    {
        name: "Home",
        url: "/"
    },
    {
        name: "My Tickets",
        url: "/myTicket"
    },
    {
        name: "Balance",
        url: "/balance"
    },
    {
        name: "Profile",
        url: "/profile"
    },

]

function Navbar() {
  const router = useRouter();
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  const { data: session } = useSession();
  // Check session on component mount

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/signin')
  }; 
  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <div className="w-full h-20 flex items-center justify-between px-20 fixed z-[9999] bg-black">
      <button className="text-2xl font-bold" onClick={() => handleNavigation("/")}>Cinemaxx</button>
      <button
        className="flex absolute right-0 top-0 aspect-square h-full items-center justify-center bg-[#A01B14] xl:hidden"
        aria-label="Open Menu"
        onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
      >
        <Image src="/menu.png" alt="menu bar" width={50} height={50}></Image>
      </button>
      <div
        className={`fixed right-0 top-0 z-10 flex h-full w-[272px] flex-col items-center justify-center bg-red gap-6 duration-300 ease-in-out xl:static xl:bg-transparent xl:flex xl:h-auto xl:w-auto xl:justify-center xl:translate-x-0 xl:flex-row xl:items-center xl:gap-16 xl:bg-none ${
          isNavbarExpanded ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute right-0 top-0 aspect-square xl:hidden"
          aria-label="Open Menu"
          onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
        >
          <Image src="/arrow.png" alt="menu bar" width={50} height={50}></Image>
        </button>
        <div className="flex flex-col items-center gap-6 justify-center xl:flex-row">
          {paths.map((path) => (
            <Link key={path.name} className="text-xl font-bold" href={path.url}>
              {path.name}
            </Link>
          ))}
        </div>

        {session && session.user ? (
          <button
            className="px-5 py-3 rounded-xl bg-black xl:bg-red font-bold text-xl"
            onClick={handleLogout}
          >
            Log Out
          </button>
        ) : (
          <div className="flex flex-col xl:flex-row gap-6 justify-center items-center">
            <button
              className="px-5 py-3 rounded-xl bg-black xl:bg-red font-bold text-xl"
              onClick={() => router.push("/signin")}
            >
              Log In
            </button>
            <button
              className="px-5 py-3 rounded-xl bg-black xl:bg-red font-bold text-xl"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
