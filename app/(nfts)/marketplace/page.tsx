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
  return <UserNFTs isLoading={isNFTsLoading} nfts={nfts} />;
}
