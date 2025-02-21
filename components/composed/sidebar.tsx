import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks, NavLinks } from "../layout/Header"
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import { AlignRight } from 'lucide-react';

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
        <div className="flex flex-col items-center gap-10 py-4">
        <div className="flex flex-col items-center gap-5 ">
          {navLinks.map((item, index) => (
            <NavLinks key={index} link={item.link} name={item.name} />
          ))}
        </div>
        <div>Balance: <span className="text-3xl ml-2 text-cyan-200/70"> {balance}</span> OMC </div>
        </div>
       
      </SheetContent>
    </Sheet>
  )
}
