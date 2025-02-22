"use client";
import { trpc } from "@/lib/trpc.utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "../composed/sidebar";

export default function Header({ address }: { address: string | null }) {
  const [balance, setBalance] = useState(0);

  const { data } = trpc.token.getBalance.useQuery({
    address: String(address),
    tokenId: 1,
  });

  useEffect(() => {
    if (data) {
      setBalance(data);
    }
  }, [data]);

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

        <div className="hidden md:flex">Balance: <span className="text-cyan-200/70">{balance}</span> OMC </div>

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
      className={`${
        pathName === link.split("?")[0]
          ? "bg-secondary text-black px-4 py-2 rounded"
          : ""
      } hover:bg-cyan-200/70 hover:text-black px-4 py-2 rounded`}
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
    name: "My NFTs",
    link: "/profile?tab=nfts",
  },
];
