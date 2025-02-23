import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, NavLinks } from "../layout/Header";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import { AlignRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Sidebar({ address }: { address: string | null }) {
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
    <Sheet>
      <SheetTrigger asChild>
        <AlignRight />
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
          <SheetDescription>
          </SheetDescription>
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
          <div>
            {" "}
            <span className="text-2xl ml-4 text-cyan-200/70">
              {" "}
              {balance}
            </span>{" "}
            OMC{" "}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
