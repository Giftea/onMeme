"use client";
// import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc.utils";
// import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import {
  // useParams,
  usePathname,
  //  useSearchParams
} from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ address }: { address: string | null }) {
  // const { setTheme, theme, systemTheme } = useTheme();
  const [balance, setBalance] = useState(0);

  // const toggleTheme = () => {
  //   setTheme(theme === "light" ? "dark" : "light");
  // };

  // useEffect(() => {
  //   if (theme === "system") {
  //     setTheme(systemTheme === "dark" ? "dark" : "light");
  //   }
  // }, [theme, systemTheme]);

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
    <header className="bg-card p-4 px-10">
      <div className="flex items-center justify-between mx-auto max-w-[1060px]">
        {/* {theme === "dark" && (
          <Link href={"/"}>
            <Image src="/images/logo.svg" alt="Logo" width={140} height={140} />
          </Link>
        )}
        {theme === "light" && (
          <Image
            src="/images/logo-dark.svg"
            alt="Logo"
            width={140}
            height={140}
          />
        )} */}
        <Link href={"/"}>
          <Image src="/images/logo.svg" alt="Logo" width={140} height={140} />
        </Link>
        <div className="space-x-3">
          {navLinks.map((item, index) => (
            <NavLinks key={index} link={item.link} name={item.name} />
          ))}
        </div>
        {/* <div className="flex items-center space-x-2">
          <Switch id="theme" onCheckedChange={() => toggleTheme()} />
          <label htmlFor="theme">Theme</label>
        </div> */}
        <div>Balance: {balance} MEME </div>
      </div>
    </header>
  );
}

function NavLinks({ link, name }: { name: string; link: string }) {
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

const navLinks = [
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
