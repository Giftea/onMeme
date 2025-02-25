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

export default function Header() {
  const [balance, setBalance] = useState(0);
  const { address, isLoading, login, logout } = useAddress();
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
        <Link href={"/"}>
          <Image
            src="/images/logo.svg"
            alt="Logo"
            className="w-28 md:w-36"
            width={140}
            height={140}
          />
        </Link>

        <div className="space-x-3 hidden md:flex">
          {navLinks.map((item, index) => (
            <NavLinks key={index} link={item.link} name={item.name} />
          ))}
        </div>
        <div className="max-md:hidden">
          {isLoading ? (
            <Skeleton className="w-20 h-10 bg-slate-700" />
          ) : address ? (
            <Menubar className="bg-transparent border-0">
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

export function NavLinks({ link, name }: { name: string; link: string }) {
  const pathName = usePathname();

  return (
    <Link
      className={`lg:px-4 ${
        pathName === link.split("?")[0] ? "text-secondary" : ""
      } hover:text-cyan-200/70`}
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
