"use client";

import React from "react";
import Collections from "@/components/nfts/Collections";
import LikeNFT from "@/components/nfts/LikeNFT";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc.utils";
import { ListedNFT } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoadSkeleton from "@/components/skeleton";
import {
  MarketplaceViewNFTSkeleton,
  NFTDescriptionSkeleton,
} from "@/components/skeleton/nft.skeleton";

export default function Page() {
  const address = Cookies.get("dev-address");
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
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg flex flex-col space-y-2 justify-center items-end p-4">
                <LikeNFT nftId={nftData.listingId} userId={user?.address} />
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

function NFTDescription({
  owner,
  nft,
  isLoadingList,
}: {
  owner: string;
  nft: ListedNFT;
  isLoadingList: boolean;
}) {
  const {
    data: nftOwner,
    isLoading,
    isSuccess,
  } = trpc.user.fetchUser.useQuery({
    address: owner,
  });

  const { short } = formatDate(String(nft?.listedAt));

  return (
    <LoadSkeleton
      enabled={isLoading || isLoadingList}
      skeleton={NFTDescriptionSkeleton}
    >
      <React.Fragment>
        {!nftOwner !== undefined && (
          <div>
            <p className="text-5xl font-bold mt-4">{nft?.nftMetadata?.name} </p>
            <p className="mt-2 text-sm text-gray-400">
              Owned by{" "}
              <span className="text-primary">@{nftOwner?.username}</span>
            </p>
            <div>
              <div className="border rounded-lg p-4 mt-4">
                <div>
                  <p className="text-xl font-semibold">Description</p>
                  <p className="text-gray-400 tracking-wide font-thin my-2">
                    {nft.nftMetadata?.description}
                  </p>
                </div>
                <div className="flex justify-between mt-6 items-center">
                  <p>
                    Price:{" "}
                    <span className="text-xl text-primary">
                      {nft.price} MEME
                    </span>
                  </p>
                  <Button className="px-8 text-lg py-6">Purchase</Button>
                </div>
              </div>
              <div className="border rounded-lg p-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <p>Token ID</p> <p>{nft?.listingId}</p>
                </div>{" "}
                <div className="flex justify-between">
                  <p>Offers</p> <p>0</p>
                </div>{" "}
                <div className="flex justify-between">
                  <p>Minted</p> <p>{short}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isSuccess && !isLoading && <div>Failed to load NFT owner</div>}
      </React.Fragment>
    </LoadSkeleton>
  );
}
