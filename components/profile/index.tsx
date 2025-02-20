"use client";
import UserMemesTemplate from "@/components/profile/UserTabsTemplate";
import UserMemes from "@/components/profile/UserMemes";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import UserNFTs from "./UserNFTs";
import { NFT } from "@/lib/types";

export default function Page({ address }: { address: string | null }) {
  const [nfts, setNFTs] = useState<NFT[]>();

  const { data: nftsData, isLoading: isNFTsLoading } =
    trpc.nft.getNFTsByOwner.useQuery({
      owner: String(address),
    });

  useEffect(() => {
    if (nftsData) {
      setNFTs(nftsData as NFT[]);
    }
  }, [isNFTsLoading, nftsData]);

  return (
    <>
      <UserMemesTemplate
        nfts={<UserNFTs isLoading={isNFTsLoading} nfts={nfts} />}
        memes={<UserMemes address={address} />}
      />
    </>
  );
}
