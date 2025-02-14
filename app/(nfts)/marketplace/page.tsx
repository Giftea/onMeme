"use client";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import UserNFTs from "@/components/profile/UserNFTs";
import { ListedNFT, NFT } from "@/lib/types";

export default function Page() {
  const [nfts, setNFTs] = useState<ListedNFT[]>();

  const { data: nftsData, isLoading: isNFTsLoading } =
    trpc.listing.getAllListings.useQuery();

  useEffect(() => {
    if (nftsData) {
      setNFTs(nftsData as ListedNFT[]);
    }
  }, [isNFTsLoading, nftsData]);
  console.log(nftsData);
  return (
    <>
      <p className="text-4xl border-b pb-2 font-semibold text-gray-400 mb-6">
        NFT Memes
      </p>
      <UserNFTs isListed={true} isLoading={isNFTsLoading} nfts={nfts} />
    </>
  );
}
