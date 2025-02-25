import Header from "@/components/layout/header-component";
import React from "react";

export default async function template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="mt-[2rem] max-w-[1060px] mx-4 md:mx-10 lg:mx-auto pb-8">
        {children}
      </div>
    </div>
  );
}
