// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white shadow flex justify-between items-center h-16 px-4">
      {/* Left: Home (logo or text) */}
      <Link href="/" className="flex items-center">
        <Image src="/next.svg" alt="Home" width={100} height={40} />
      </Link>

      {/* Right: Sign Up / Login */}
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
