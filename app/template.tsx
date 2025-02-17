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
      <div className="mt-[2rem] max-w-[1060px] mx-10 lg:mx-auto pb-8">{children}</div>
    </div>
  );
}
