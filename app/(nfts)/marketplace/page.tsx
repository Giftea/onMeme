"use client";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import UserNFTs from "@/components/profile/UserNFTs";
import { ListedNFT } from "@/lib/types";

export default function Page() {
  const [listedNFTs, setListedNFTs] = useState<ListedNFT[]>();

  const { data: nftsData, isLoading: isNFTsLoading } =
    trpc.listing.getMarketplaceListings.useQuery();

  useEffect(() => {
    if (nftsData) {
      setListedNFTs(nftsData as ListedNFT[]);
    }
  }, [isNFTsLoading, nftsData]);

  return (
    <>
      <p className="text-4xl border-b pb-2 font-semibold text-gray-400 mb-6">
        NFT Memes
      </p>
      <UserNFTs isLoading={isNFTsLoading} listedNFTs={listedNFTs} />
    </>
  );
}
