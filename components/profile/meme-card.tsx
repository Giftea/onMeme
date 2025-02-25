import { ListedNFT, Memes, NFT } from "@/lib/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import MintNFTModal from "../modals/mint-nft-modal";
import Link from "next/link";
import { shortenText } from "@/lib/utils";
import NFTCard from "./nft-card";
import { useAddress } from "@chopinframework/react";

export default function Card({
  meme,
  nft,
  address,
  listedNFT,
}: {
  meme?: Memes;
  nft?: NFT;
  listedNFT?: ListedNFT;
  address?: string | null;
}) {
  const { address: userAddress } = useAddress();
  return (
    <div className="border flex justify-center items-center border-gray-400 rounded-lg p-4">
      {meme && address && (
        <div className="space-y-3 w-full">
          <Image
            src={meme?.imageUrl}
            alt="meme"
            className="rounded-lg h-[300px] w-full object-cover"
            width={300}
            height={300}
          />
          {address === userAddress && (
            <MintNFTModal meme={meme} address={address} />
          )}
        </div>
      )}
      {nft && nft?.metadata && <NFTCard nft={nft} />}

      {listedNFT && listedNFT?.nftMetadata && (
        <div className="space-y-3 w-full">
          <Link href={`/nfts/${listedNFT?.listingId}`} className="space-y-3">
            <Image
              src={listedNFT?.nftMetadata?.image}
              alt="meme"
              className="rounded-lg h-[300px] w-full object-cover"
              width={300}
              height={300}
            />
            <p className="font-semibold text-lg">
              {listedNFT?.nftMetadata?.name}
            </p>
            <p className="text-gray-500 !mt-0 ">
              {shortenText(listedNFT?.nftMetadata?.description)}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

export function NFTCardLoading() {
  return (
    <div className="border flex justify-center items-center border-gray-400 rounded-lg p-4">
      <Skeleton className="w-[300px] h-[300px] rounded-lg bg-slate-600 " />
    </div>
  );
}
