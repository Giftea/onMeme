"use client";
import { FolderClosed } from "lucide-react";
import NFTCard, { NFTCardLoading } from "./MemeCard";
import { ListedNFT, NFT } from "@/lib/types";

export default function UserNFTs({
  isLoading,
  nfts, isListed
}: {
  isLoading: boolean;
  isListed?: boolean;
  nfts: NFT[] | ListedNFT[] | undefined;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <NFTCardLoading key={i} />)}

        {nfts && nfts?.length > 0 && (
          <>
            {nfts.map((item) => (
              <div key={item.id}>
                <NFTCard nft={item} isListed={isListed} />
              </div>
            ))}
          </>
        )}

        {((!isLoading && nfts === undefined) || nfts?.length === 0) && (
          <div className="w-full col-span-3 py-[5rem] flex flex-col items-center justify-center text-gray-400">
            <FolderClosed size={40} />
            No NFTs found
          </div>
        )}
      </div>
    </>
  );
}
