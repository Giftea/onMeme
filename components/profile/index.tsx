"use client";
import UserMemesTemplate from "@/components/profile/UserTabsTemplate";
import UserMemes from "@/components/profile/UserMemes";
import { trpc } from "@/lib/trpc.utils";
import UserNFTs from "./UserNFTs";
import React from "react";
import LoadSkeleton from "../skeleton";
import ProfileMemeSkeleton from "../skeleton/profile.skeleton";
import { useAddress } from "@chopinframework/react";

export default function Page() {
  const { address } = useAddress();
  const { data, isLoading } = trpc.nft.getNFTsByOwner.useQuery({
    owner: String(address),
  });

  return (
    <LoadSkeleton skeleton={ProfileMemeSkeleton} enabled={isLoading}>
      <UserMemesTemplate
        nfts={<UserNFTs isLoading={isLoading} nfts={data} />}
        memes={<UserMemes address={address} />}
      />
    </LoadSkeleton>
  );
}
