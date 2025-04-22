"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { HiMoon, HiSun } from "react-icons/hi";
import { useTheme } from "@/lib/useTheme";
import { Teko } from "next/font/google";

const teko = Teko({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-teko",
});

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  // wait until we know light vs dark
  if (!theme) return null;

  return (
    <nav className="sticky top-0 z-50 w-full shadow-md/10 dark:shadow-gray-50">
      <div
        className="
          w-full flex items-center h-14 px-2 md:px-4
          bg-[var(--color-surface)] text-[var(--color-on-surface)]
        "
      >
        {/* Logo (uses primary color) */}
        <Link href="/" className="flex items-center">
          <span className="{teko.variable} font-bold text-xl">PersonaVault</span>
        </Link>
        <div className="ml-auto mr-0 hover:underline">
          {session?.user ? (
            <Link href="/dashboard">
              <span>Dashboard</span>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
        {/* Pushes buttons to the right */}
        <div className="flex items-center ml-auto space-x-2 md:space-x-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              p-1.5 rounded border border-current
              hover:bg-current/10 dark:hover:bg-current/20
              transition-colors duration-200
            "
          >
            {theme === "dark" ? (
              <HiSun className="w-5 h-5" />
            ) : (
              <HiMoon className="w-5 h-5" />
            )}
          </button>

          {session?.user ? (
            <>
              <span className="text-sm font-medium">
                Hello,&nbsp;
                <Link href="/settings">
                  <span className="underline font-bold">
                    {session.user.name?.split(" ")[0] ?? "User"}
                  </span>
                </Link>
              </span>
              <button
                onClick={() => signOut()}
                className=" cursor-pointer text-sm hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="text-sm hover:text-[var(--color-primary)] transition-colors duration-200"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="text-sm hover:text-[var(--color-primary)] transition-colors duration-200"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
