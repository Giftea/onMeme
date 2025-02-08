"use client";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Header() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-card p-4 px-10">
      <div className="flex items-center justify-between mx-auto max-w-[1500px]">
        {theme === "dark" ? (
          <Image src="/images/logo.svg" alt="Logo" width={140} height={140} />
        ) : (
          <Image
            src="/images/logo-dark.svg"
            alt="Logo"
            width={140}
            height={140}
          />
        )}{" "}
        <div className="flex items-center space-x-2">
          <Switch id="theme" onCheckedChange={() => toggleTheme()} />
          <label htmlFor="theme">Theme</label>
        </div>
      </div>
    </header>
  );
}
