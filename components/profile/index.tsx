"use client";
import UserMemesTemplate from "@/components/profile/user-tabs-template";
import UserMemes from "@/components/profile/user-memes";
import { trpc } from "@/utils/trpc.utils";
import UserNFTs from "./user-nfts";
import React from "react";
import LoadSkeleton from "../skeleton";
import ProfileMemeSkeleton from "../skeleton/profile.skeleton";

export default function Page({ address }: { address: string | null }) {
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
