import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, NavLinks } from "./header";
import { trpc } from "@/lib/utils/trpc.utils";
import { useEffect, useState } from "react";
import { AlignRight } from "lucide-react";
import { useAddress } from "@chopinframework/react";
import { Button } from "../ui/button";
import Logo from "../composed/logo";

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
          <Logo />

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
