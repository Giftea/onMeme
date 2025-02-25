"use client";
import { trpc } from "@/utils/trpc.utils";
import UserNFTs from "@/components/profile/user-nfts";
import { ListedNFT } from "@/lib/types";
import LoadSkeleton from "@/components/skeleton";
import ProfileMemeSkeleton from "@/components/skeleton/profile.skeleton";
import React from "react";

export default function Page() {
  const { data, isLoading: isNFTsLoading } =
    trpc.listing.getMarketplaceListings.useQuery();

  const nftData = data ? data : [];

  const listedNFTs = nftData as ListedNFT[];

  return (
    <React.Fragment>
      <p className="text-2xl md:text-4xl border-b pb-2 font-semibold text-gray-400 mb-6">
        NFT Memes
      </p>
      <LoadSkeleton enabled={isNFTsLoading} skeleton={ProfileMemeSkeleton}>
        <UserNFTs isLoading={isNFTsLoading} listedNFTs={listedNFTs} />
      </LoadSkeleton>
    </React.Fragment>
  );
}
