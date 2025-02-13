"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserTab({
  memes,
  nfts,
}: {
  memes: React.ReactNode;
  nfts: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(search || "memes");

  useEffect(() => {
    if (search && search !== activeTab) {
      setActiveTab(search);
    }
  }, [search, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`?tab=${value}`);
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="max-w-[1060px] mx-10 lg:mx-auto my-6"
      >
        <TabsList className="m-0 rounded-[0] bg-[transparent] p-0 h-auto">
          <TabsTrigger
            className="text-lg px-6 data-[state=active]:bg-card data-[state=active]:text-primary rounded-[0px] py-[1rem] rounded-t-xl"
            value="memes"
          >
            My Memes
          </TabsTrigger>
          <TabsTrigger
            className="text-lg px-8 data-[state=active]:bg-card data-[state=active]:text-primary rounded-[0px] py-[1rem] rounded-t-xl"
            value="nfts"
          >
            NFTs
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="bg-card rounded-xl rounded-tl-none text-card-foreground shadow mt-0"
          value="memes"
        >
          <div className="p-6">{memes}</div>
        </TabsContent>
        <TabsContent
          className="bg-card rounded-xl text-card-foreground shadow mt-0"
          value="nfts"
        >
          {" "}
          <div className="p-6">{nfts}</div>
        </TabsContent>
      </Tabs>
    </>
  );
}
