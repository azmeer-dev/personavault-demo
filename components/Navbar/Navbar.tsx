import Link from "next/link";
import { Teko } from "next/font/google";

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-teko",
});

export default function Navbar() {
  return (
    <nav className={`sticky top-0 z-40 bg-white shadow flex justify-between items-center h-16 px-4 ${teko.variable}`}>
      {/* Left: Logo Text */}
      <Link href="/" className="flex items-center h-full">
        <span className="text-2xl font-semibold tracking-wide text-neutral-800" style={{ fontFamily: "var(--font-teko)" }}>
          PersonaVault
        </span>
      </Link>

      {/* Right: Links */}
      <div className="flex items-center space-x-4">
        <Link href="/signup" className="hover:underline">
          Sign Up
        </Link>
        <Link href="/login" className="hover:underline">
          Login
        </Link>
      </div>
    </nav>
  );
}
