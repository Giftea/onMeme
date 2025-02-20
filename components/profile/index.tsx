"use client";
import UserMemesTemplate from "@/components/profile/UserTabsTemplate";
import UserMemes from "@/components/profile/UserMemes";
import { trpc } from "@/lib/trpc.utils";
import UserNFTs from "./UserNFTs";
import React from "react";

export default function Page({ address }: { address: string | null }) {
  const { data, isLoading } = trpc.nft.getNFTsByOwner.useQuery({
    owner: String(address),
  });

  return (
    <React.Fragment>
      <UserMemesTemplate
        nfts={<UserNFTs isLoading={isLoading} nfts={data} />}
        memes={<UserMemes address={address} />}
      />
    </React.Fragment>
  );
}
