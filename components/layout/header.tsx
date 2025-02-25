"use client";
import { trpc } from "@/lib/utils/trpc.utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useAddress } from "@chopinframework/react";
import Avatar from "../composed/avatar";
import { shortenAddress } from "@/lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "../composed/logo";

export default function Header() {
  const [balance, setBalance] = useState(0);
  const { address, isLoading, login, logout } = useAddress();
  const { setTheme, theme } = useTheme();
  const { data } = trpc.token.getBalance.useQuery({
    address: String(address),
    tokenId: 1,
  });
  const { data: userProfile } = trpc.user.fetchUser.useQuery({
    address: String(address),
  });

  useEffect(() => {
    if (data) {
      setBalance(data);
    }
  }, [data]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleLogin = async () => {
    login();
  };

  return (
    <header className="bg-card p-4 md:px-10">
      <div className="flex items-center justify-between mx-auto max-w-[1060px]">
        <Logo />
        <div className="space-x-3 hidden md:flex">
          {navLinks.map((item, index) => (
            <NavLinks
              theme={theme}
              key={index}
              link={item.link}
              name={item.name}
            />
          ))}
        </div>
        <div className="max-md:hidden">
          {isLoading ? (
            <Skeleton className="w-20 h-10 bg-muted" />
          ) : address ? (
            <Menubar className="bg-transparent shadow-none border-0">
              <MenubarMenu>
                <MenubarTrigger className="focus:bg-transparent data-[state=open]:bg-transparent">
                  {" "}
                  <div className="flex space-x-2 items-center cursor-pointer">
                    <Avatar userAddress={address} size={50} />
                    <div>
                      <p className="text-sm text-slate-400 capitalize">
                        {userProfile?.username}
                      </p>
                      <p className="text-sm text-primary">
                        {shortenAddress(address)}
                      </p>
                    </div>
                  </div>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Link href="/profile">View Profile</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <span>Balance: {balance} OMC</span>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="focus:text-foreground">
                    <div className="flex items-center justify-between w-full bg-card text-card-foreground rounded-full p-2">
                      <button
                        onClick={() => setTheme("dark")}
                        className={`${
                          theme === "dark" && "bg-gray-400 rounded-full"
                        } py-1 px-2`}
                      >
                        <Moon />
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`${
                          theme === "system" && "bg-gray-400 rounded-full"
                        } py-1 px-2`}
                      >
                        auto
                      </button>
                      <button
                        onClick={() => setTheme("light")}
                        className={`${
                          theme === "light" && "bg-gray-400 rounded-full"
                        } py-1 px-2`}
                      >
                        <Sun />
                      </button>
                    </div>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          ) : (
            <Button className="font-semibold px-8" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>

        <div className="flex md:hidden">
          <Sidebar address={address} />
        </div>
      </div>
    </header>
  );
}

export function NavLinks({
  link,
  name,
  theme,
}: {
  name: string;
  link: string;
  theme?: string;
}) {
  const pathName = usePathname();

  return (
    <Link
      className={`lg:px-4 ${
        pathName === link.split("?")[0] && theme === "dark" && "text-secondary"
      } ${
        pathName === link.split("?")[0] && theme === "light" && "text-primary"
      } ${
        theme === "dark" ? "hover:text-cyan-200/70" : "hover:text-blue-300"
      }`}
      href={link}
    >
      {name}
    </Link>
  );
}

export const navLinks = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Marketplace",
    link: "/marketplace",
  },
  {
    name: "Leaderboard",
    link: "/leaderboard",
  },
  {
    name: "My NFTs",
    link: "/profile?tab=nfts",
  },
];
