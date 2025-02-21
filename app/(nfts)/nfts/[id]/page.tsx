"use client";
import Collections from "@/components/nfts/Collections";
import LikeNFT from "@/components/nfts/LikeNFT";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc.utils";
import { ListedNFT } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import IsLoading from "@/components/composed/loader";

export default function Page() {
  const address = Cookies.get("dev-address");
  const pathName = usePathname();
  const router = useRouter();
  const nftId = pathName.split("/nfts/")[1];
  const [nft, setNft] = useState<ListedNFT>();

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

  useEffect(() => {
    if (nftData !== undefined) {
      setNft(nftData as ListedNFT);
    }
  }, [isLoading, isSuccess, nft, nftData]);

  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border flex justify-center items-center border-gray-400 rounded-lg p-4">
          <Skeleton className="w-full h-[500px] rounded-lg bg-slate-600 " />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-[140px] h-10 rounded-full bg-slate-600 " />
          <Skeleton className="w-[200px] h-10 rounded-full bg-slate-600 " />
          <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
          <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
        </div>
      </div>
    );
  if (!isSuccess) return <div>Failed to load NFT</div>;
  if (nft !== undefined && nft?.nftMetadata) {
    return (
      <div>
        <Button
          onClick={() => router.back()}
          className="mb-3"
          variant={"outline"}
        >
          Go Back
        </Button>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg flex flex-col space-y-2 justify-center items-end p-4">
            <LikeNFT nftId={nft.listingId} userId={user?.address} />
            <Image
              src={nft?.nftMetadata.image}
              className="rounded-lg"
              alt={nft?.nftMetadata.name}
              width={500}
              height={500}
            />
          </div>
          <div>
            <NFTDescription
              address={address}
              owner={nft.sellerAddress}
              nft={nft}
            />
          </div>
        </div>
        <Collections address={nft.sellerAddress} />
      </div>
    );
  }
}

function NFTDescription({
  owner,
  nft,
  address,
}: {
  owner: string;
  nft: ListedNFT;
  address: string | undefined;
}) {
  const [nftOwner, setNftOwner] = useState<{
    address: string;
    username: string;
    id: string;
    createdAt: string | null;
  }>();
  const { data, isLoading, isSuccess } = trpc.user.fetchUser.useQuery({
    address: owner,
  });
  const { toast } = useToast();
  const trpcUtils = trpc.useUtils();
  const router = useRouter();

  useEffect(() => {
    if (data !== undefined) {
      setNftOwner(data);
    }
  }, [isLoading, isSuccess, data]);

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

  if (isLoading)
    return (
      <div className="space-y-2">
        <Skeleton className="w-[140px] h-10 rounded-full bg-slate-600 " />
        <Skeleton className="w-[200px] h-10 rounded-full bg-slate-600 " />
        <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
        <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
      </div>
    );
  if (!isSuccess) return <div>Failed to load NFT owner</div>;
  if (nftOwner !== undefined) {
    const { short } = formatDate(String(nft?.listedAt));
    return (
      <div>
        <p className="text-5xl font-bold mt-4">{nft?.nftMetadata?.name} </p>
        <p className="mt-2 text-sm text-gray-400">
          Owned by{" "}
          <span className="text-primary">
            @
            {nftOwner?.username.length <= 0
              ? shortenAddress(nftOwner?.address)
              : nftOwner?.username}
          </span>
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
                <span className="text-xl text-primary">{nft.price} OMC</span>
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
    );
  }
}
