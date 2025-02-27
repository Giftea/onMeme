import Header from "@/components/layout/header";
import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
      <main className="mt-[2rem] max-w-[1060px] mx-4 md:mx-10 lg:px-4 lg:mx-auto pb-8">
        {children}
      </main>
    </HydrationBoundary>
  );
}
