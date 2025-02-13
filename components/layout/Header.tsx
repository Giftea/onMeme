"use client";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
  const { setTheme, theme, systemTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "system") {
      setTheme(systemTheme === "dark" ? "dark" : "light");
    }
  }, [theme, systemTheme]);
  return (
    <header className="bg-card p-4 px-10">
      <div className="flex items-center justify-between mx-auto max-w-[1060px]">
        {theme === "dark" && (
          <Link href={'/'}><Image src="/images/logo.svg" alt="Logo" width={140} height={140} /></Link>
        )}
        {theme === "light" && (
          <Image
            src="/images/logo-dark.svg"
            alt="Logo"
            width={140}
            height={140}
          />
        )}
        <div className="flex items-center space-x-2">
          <Switch id="theme" onCheckedChange={() => toggleTheme()} />
          <label htmlFor="theme">Theme</label>
        </div>
      </div>
    </header>
  );
}
