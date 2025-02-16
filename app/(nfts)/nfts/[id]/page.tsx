"use client";
import Collections from "@/components/nfts/Collections";
import LikeNFT from "@/components/nfts/LikeNFT";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc.utils";
import { ListedNFT } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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
            <NFTDescription owner={nft.sellerAddress} nft={nft} />
          </div>
        </div>
        <Collections address={nft.sellerAddress} />
      </div>
    );
  }
}

function NFTDescription({ owner, nft }: { owner: string; nft: ListedNFT }) {
  const [nftOwner, setNftOwner] = useState<{
    address: string;
    username: string;
    id: string;
    createdAt: string | null;
  }>();
  const { data, isLoading, isSuccess } = trpc.user.fetchUser.useQuery({
    address: owner,
  });

  useEffect(() => {
    if (data !== undefined) {
      setNftOwner(data);
    }
  }, [isLoading, isSuccess, data]);

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
          Owned by <span className="text-primary">@{nftOwner?.username}</span>
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
                <span className="text-xl text-primary">{nft.price} MEME</span>
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
    );
  }
}
