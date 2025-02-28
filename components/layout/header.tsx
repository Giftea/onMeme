"use client";
import { trpc } from "@/lib/utils/trpc.utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useAddress } from "@chopinframework/react";
import Avatar from "../composed/avatar";
import { shortenAddress } from "@/lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "../composed/logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import CopyAddress from "../composed/copy-icon";
import LoadSkeleton from "../skeleton";

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
    <header className="bg-card p-4 md:px-10 h-20 flex items-center justify-between">
      <div className="flex-1 flex items-center justify-between mx-auto max-w-[1060px]">
        <Logo />
        <div className="hidden space-x-3 md:flex">
          {navLinks.map((item, index) => (
            <NavLinks
              theme={theme}
              key={index}
              link={item.link}
              name={item.name}
            />
          ))}
        </div>
        <div className="max-md:hidden w-20">
          {isLoading ? (
            <Skeleton className="w-20 h-10 bg-muted" />
          ) : address ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="rounded-full h-14 p-2">
                    {" "}
                    <Avatar
                      userAddress={address}
                      size={38}
                      url={userProfile?.avatar}
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-52">
                    <div className="flex flex-col">
                      <div className="grid grid-cols-3 p-4 border-b">
                        {" "}
                        <Avatar
                          userAddress={address}
                          size={34}
                          url={userProfile?.avatar}
                        />
                        <div className="col-span-2">
                          <p className="text-slate-400 capitalize">
                            {userProfile?.username}
                          </p>
                          <div className="text-sm text-primary flex items-center space-x-2">
                            <span>{shortenAddress(address)}</span>
                            <CopyAddress userAddress={address} />
                          </div>
                        </div>
                      </div>
                      <NavigationMenuLink
                        href="/profile"
                        className="p-4 border-b text-primary"
                      >
                        View Profile
                      </NavigationMenuLink>
                      <NavigationMenuLink className="p-4 border-b">
                        Balance: {balance} OMC
                      </NavigationMenuLink>
                      <div className="p-4 border-b">
                        {" "}
                        <div className="flex items-center justify-between w-full bg-card text-card-foreground rounded-full p-2">
                          <button
                            onClick={() => setTheme("dark")}
                            className={`${
                              theme === "dark" && "bg-gray-400"
                            } rounded-full hover:bg-gray-500 py-1 px-2`}
                          >
                            <Moon />
                          </button>
                          <button
                            onClick={() => setTheme("dark")}
                            className={`${
                              theme === "system" && "bg-gray-400"
                            } rounded-full hover:bg-gray-500 py-1 px-2`}
                          >
                            auto
                          </button>
                          <button
                            onClick={() => setTheme("light")}
                            className={`${
                              theme === "light" && "bg-gray-400"
                            } rounded-full hover:bg-gray-500 py-1 px-2`}
                          >
                            <Sun />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <Button
                          className="w-full text-red-500 text-lg bg-red-100 hover:bg-red-200 text-center space-x-2"
                          onClick={handleLogout}
                        >
                          <LogOut /> <span>Logout</span>{" "}
                        </Button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
      } ${theme === "dark" ? "hover:text-cyan-200/70" : "hover:text-blue-300"}`}
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
