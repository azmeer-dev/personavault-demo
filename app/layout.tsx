import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import "./globals.css"
import Navbar from "@/components/Navbar/Navbar"
import { Providers } from "./providers"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PersonaVault",
  description: "A vault for all of your digital identities.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get("theme")?.value
  const themeClass = themeCookie === "dark" ? "dark" : "light"

  return (
    <html
      lang="en"
      className={`${themeClass} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head />
      <body className="antialiased bg-[var(--color-background)] text-[var(--color-on-background)]">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
