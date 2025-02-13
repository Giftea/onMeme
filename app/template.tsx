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
      <div className=" max-w-[1060px] mx-10 lg:mx-auto">{children}</div>
    </div>
  );
}
