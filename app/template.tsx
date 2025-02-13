import Header from "@/components/layout/Header";
import React from "react";
import { getAddress } from "@/lib/chopin-server";

export default async function template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const address = await getAddress();

  return (
    <div>
      <Header address={address} />
      {children}
    </div>
  );
}
