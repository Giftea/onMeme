import { Memes, NFT } from "@/lib/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import MintNFTModal from "./MintNFTModal";
import Link from "next/link";
import { shortenText } from "@/lib/utils";

export default function NFTCard({
  meme,
  nft,
  address,
}: {
  meme?: Memes;
  nft?: NFT;
  address?: string | null;
}) {
  return (
    <div className="border flex cursor-pointer justify-center items-center border-gray-400 rounded-lg p-4">
      {meme && address && (
        <div className="space-y-3">
          <Image
            src={meme?.imageUrl}
            alt="meme"
            className="rounded-lg"
            width={300}
            height={300}
          />
          <MintNFTModal meme={meme} address={address} />
        </div>
      )}
      {nft && nft?.metadata && (
        <div className="space-y-3">
          <Link href={`/nfts/${nft?.id}`} className="space-y-3">
            <Image
              src={nft?.metadata?.image}
              alt="meme"
              className="rounded-lg"
              width={300}
              height={300}
            />
            <p className="font-semibold text-lg">{nft?.metadata?.name}</p>
            <p className="text-gray-500 !mt-0 ">
              {shortenText(nft?.metadata?.description)}
            </p>
          </Link>
          <div className="flex justify-between items-center">
            <p className="">Price: {nft?.metadata?.price} MEME</p>
            <Button className="font-semibold text-lg px-8 py-5 float-right">
              Buy
            </Button>
          </div>
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
