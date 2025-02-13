"use client";
import NFTCard, { NFTCardLoading } from "./MemeCard";
import { NFT } from "@/lib/types";

export default function UserNFTs({
  isLoading,
  nfts,
}: {
  isLoading: boolean;
  nfts: NFT[] | undefined;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(isLoading) &&
          Array.from({ length: 3 }).map((_, i) => <NFTCardLoading key={i} />)}

        {nfts && nfts?.length > 0 && (
          <>
            {nfts.map((item) => (
              <div key={item.id}>
                <NFTCard nft={item} />
              </div>
            ))}
          </>
        )}

        {((!isLoading && nfts === undefined) || nfts?.length === 0) && (
          <div>No NFTs found</div>
        )}
      </div>
    </>
  );
}
