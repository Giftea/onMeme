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
  }, [userAddress, size]);

  return (
    <Image
      width={size ||100}
      height={size || 100}
      src={avatar}
      alt="Avatar"
      className="border border-secondary bg-muted-foreground p-1 rounded-full"
    />
  );
}
