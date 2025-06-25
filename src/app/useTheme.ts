"use client";
import { useEffect, useState } from "react";

export default function useTheme() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
    if (saved === "light") setDark(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (dark) {
      document.body.classList.add("darkMode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("darkMode");
      localStorage.setItem("theme", "light");
    }
  }, [dark, mounted]);

  return { dark, setDark, mounted };
}