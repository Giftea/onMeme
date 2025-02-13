"use client";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import UserNFTs from "@/components/profile/UserNFTs";
import { NFT } from "@/lib/types";

export default function Page() {
  const [nfts, setNFTs] = useState<NFT[]>();

  const { data: nftsData, isLoading: isNFTsLoading } =
    trpc.nft.getAllNFTs.useQuery();

  useEffect(() => {
    if (nftsData) {
      setNFTs(nftsData as NFT[]);
    }
  }, [isNFTsLoading, nftsData]);
  return (
    <>
      <p className="text-4xl border-b pb-2 font-semibold text-gray-400 mb-6">
        NFT Memes
      </p>
      <UserNFTs isLoading={isNFTsLoading} nfts={nfts} />
    </>
  );
}
