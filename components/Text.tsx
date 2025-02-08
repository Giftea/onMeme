"use client";
import { useAddress } from "@/hooks";
import React from "react";

export default function Text({
  initialAddress,
}: {
  initialAddress: string | null;
}) {
  const { data: userId } = useAddress(initialAddress);

  return <div>{userId} </div>;
}
