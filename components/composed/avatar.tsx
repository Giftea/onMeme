"use client";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";
import Image from "next/image";
export default function Avatar({
  size,
  userAddress,
}: {
  size?: number;
  userAddress: string;
}) {
  const avatar = useMemo(() => {
    return createAvatar(croodles, {
      size: size || 128,
      seed: userAddress || "default",
    }).toDataUri();
  }, [userAddress]);

  return (
    <Image
      width={100}
      height={100}
      src={avatar}
      alt="Avatar"
      className="border-4 border-secondary bg-muted-foreground p-2 rounded-full"
    />
  );
}
