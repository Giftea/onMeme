"use client";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";
import Image from "next/image";
import { useAddress } from "@/hooks";
import { shortenAddress } from "@/lib/utils";

interface ProfileCardProps {
  initialAddress: string | null;
}

export default function ProfileCard({ initialAddress }: ProfileCardProps) {
  //   const { data: userId } = useAddress(initialAddress);

  const avatar = useMemo(() => {
    return createAvatar(croodles, {
      size: 128,
      seed: initialAddress || "default",
    }).toDataUri();
  }, []);

  return (
    <Card className="max-w-[1060px] mx-10 lg:mx-auto p-6 my-6 flex space-x-4 items-center">
      <Image
        width={100}
        height={100}
        src={avatar}
        alt="Avatar"
        className="border-4 bg-muted-foreground p-2 rounded-full"
      />
      <p className="text-lg">{shortenAddress(String(initialAddress))}</p>
    </Card>
  );
}
