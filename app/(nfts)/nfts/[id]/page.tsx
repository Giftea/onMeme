"use client";
import Collections from "@/components/nfts/collections";
import LikeNFT from "@/components/nfts/like-nft";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc.utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import LoadSkeleton from "@/components/skeleton";
import { MarketplaceViewNFTSkeleton } from "@/components/skeleton/nft.skeleton";
import { useAddress } from "@chopinframework/react";
import NFTDescription from "@/components/nfts/nft-description";

export default function Page() {
  const { address } = useAddress();
  const pathName = usePathname();
  const router = useRouter();
  const nftId = pathName.split("/nfts/")[1];

  const {
    data: nftData,
    isLoading,
    isSuccess,
  } = trpc.listing.getListingByID.useQuery({
    id: Number(nftId),
  });

  const { data: user } = trpc.user.fetchUser.useQuery({
    address: String(address),
  });

  return (
    <div>
      {nftData != undefined && nftData?.nftMetadata ? (
        <React.Fragment>
          <Button
            onClick={() => router.back()}
            className="mb-3"
            variant={"outline"}
          >
            Go Back
          </Button>
          <LoadSkeleton
            enabled={isLoading}
            skeleton={MarketplaceViewNFTSkeleton}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg flex flex-col space-y-2 items-center h-fit w-fit p-4">
                <div className="flex justify-end w-full">
                  {" "}
                  <LikeNFT nftId={nftData.listingId} userId={user?.address} />
                </div>
                <Image
                  src={nftData?.nftMetadata.image}
                  className="rounded-lg"
                  alt={nftData?.nftMetadata.name}
                  width={500}
                  height={500}
                />
              </div>
              <div>
                <NFTDescription
                  address={address}
                  owner={nftData.sellerAddress}
                  nft={nftData}
                  isLoadingList={isLoading}
                />
              </div>
            </div>
          </LoadSkeleton>
          {!isSuccess && !isLoading && <div>Failed to load NFT owner</div>}
          <Collections address={nftData.sellerAddress} />
        </React.Fragment>
      ) : null}
    </div>
  );
}
