// components/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="text-xl font-bold">
          PersonaVault
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/auth/signin" className="hover:underline">
            Sign In
          </Link>
          <Link href="/auth/signup" className="hover:underline">
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}
