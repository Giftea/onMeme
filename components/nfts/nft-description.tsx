"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/utils/trpc.utils";
import { ListedNFT } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import LoadSkeleton from "@/components/skeleton";
import { NFTDescriptionSkeleton } from "@/components/skeleton/nft.skeleton";
import { useToast } from "@/hooks/use-toast";
import IsLoading from "@/components/composed/loader";
import Link from "next/link";

export default function NFTDescription({
  owner,
  nft,
  address,
  isLoadingList,
}: {
  owner: string;
  nft: ListedNFT;
  address: string | undefined;
  isLoadingList: boolean;
}) {
  const {
    data: nftOwner,
    isLoading,
    isSuccess,
  } = trpc.user.fetchUser.useQuery({
    address: owner,
  });
  const { toast } = useToast();
  const trpcUtils = trpc.useUtils();
  const router = useRouter();
  const { short } = formatDate(String(nft?.listedAt));

  const { mutateAsync: purchaseNFT, isPending } =
    trpc.marketplace.purchaseNFT.useMutation({
      onSuccess: () => {
        toast({
          variant: "success",
          title: "NFT Successfully Purchased! 😎",
        });
        trpcUtils.token.getBalance.invalidate();
        trpcUtils.listing.getListingByID.invalidate();
        trpcUtils.listing.getMarketplaceListings.invalidate();
        trpcUtils.nft.getNFTsByOwner.invalidate();
        trpcUtils.nft.getNFTByID.invalidate();
        router.push("/profile?tab=nfts");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: error.message,
        });
      },
    });

  async function handlePurchaseNFT() {
    if (!address) return;
    try {
      await purchaseNFT({ listingId: nft.listingId, buyerAddress: address });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <LoadSkeleton
      enabled={isLoading || isLoadingList}
      skeleton={NFTDescriptionSkeleton}
    >
      <React.Fragment>
        {nftOwner !== undefined && (
          <div>
            <p className="text-3xl md:text-5xl font-bold mt-4">
              {nft?.nftMetadata?.name}{" "}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Owned by{" "}
              <Link
                href={`/user/${nftOwner?.address}`}
                className="text-primary"
              >
                @
                {nftOwner?.username?.length <= 0
                  ? shortenAddress(nftOwner?.address)
                  : nftOwner?.username}
              </Link>
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
                      {nft.price} OMC
                    </span>
                  </p>
                  <Button
                    onClick={handlePurchaseNFT}
                    disabled={isPending}
                    className="text-lg py-6"
                  >
                    {isPending ? <IsLoading /> : "Purchase"}
                  </Button>
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
