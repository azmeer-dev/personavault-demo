// lib/useTheme.ts
import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  // start with undefined so server & first client render match
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  // on mount: read stored / system preference and initialize
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const isDark =
      stored === "dark"
        ? true
        : stored === "light"
        ? false
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
  }, []);

  // whenever theme changes (and is defined), toggle <html>.dark and persist
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  return { theme, toggleTheme };
}
