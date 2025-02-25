import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, NavLinks } from "./header-component";
import { trpc } from "@/lib/utils/trpc.utils";
import { useEffect, useState } from "react";
import { AlignRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAddress } from "@chopinframework/react";
import { Button } from "../ui/button";

export function Sidebar({ address }: { address: string | null }) {
  const [balance, setBalance] = useState(0);
  const { login, logout } = useAddress();

  const { data } = trpc.token.getBalance.useQuery({
    address: String(address),
    tokenId: 1,
  });
  const handleLogin = async () => {
    const response = await login();
    console.log(response);
  };

  const handleLogout = () => {
    logout();
  };
  useEffect(() => {
    if (data) {
      setBalance(data);
    }
  }, [data]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <AlignRight />
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-start gap-7 py-4">
          <Link href={"/"}>
            <Image
              src="/images/logo.svg"
              alt="Logo"
              className="w-28"
              width={140}
              height={140}
            />
          </Link>

          <div className="flex flex-col gap-3 ">
            {navLinks.map((item, index) => (
              <NavLinks key={index} link={item.link} name={item.name} />
            ))}
          </div>
          <span>Balance: {balance} OMC</span>
          <div>
            {address ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Button className="px-8 font-semibold" onClick={handleLogin}>
                Login
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
