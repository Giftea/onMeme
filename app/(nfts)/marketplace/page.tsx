"use client";
import { trpc } from "@/lib/trpc.utils";
import UserNFTs from "@/components/profile/UserNFTs";
import { ListedNFT } from "@/lib/types";
import LoadSkeleton from "@/components/skeleton";
import { MarketplaceViewNFTSkeleton } from "@/components/skeleton/nft.skeleton";

export default function Page() {
  const { data, isLoading: isNFTsLoading } =
    trpc.listing.getMarketplaceListings.useQuery();

  const nftData = data ? data : [];

  const listedNFTs = nftData as ListedNFT[];

  return (
    <LoadSkeleton enabled={isNFTsLoading} skeleton={MarketplaceViewNFTSkeleton}>
      <p className="text-4xl border-b pb-2 font-semibold text-gray-400 mb-6">
        NFT Memes
      </p>
      <UserNFTs isLoading={isNFTsLoading} listedNFTs={listedNFTs} />
    </LoadSkeleton>
  );
}
