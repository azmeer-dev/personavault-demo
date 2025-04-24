// lib/useTheme.ts
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const router = useRouter()

  // on mount: pick up the SSR-rendered class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  // when theme state changes: write cookie + refresh layout
  useEffect(() => {
    document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365}`
    router.refresh()
  }, [theme, router])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme }
}
