"use client";
import NFTCard, { NFTCardLoading } from "./MemeCard";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import { NFT } from "@/lib/types";

export default function UserNFTs({ address }: { address: string | null }) {
  const [nfts, setNFTs] = useState<NFT[]>();

  const { data, isLoading } = trpc.nft.getNFTsByOwner.useQuery({
    owner: String(address),
  });

  useEffect(() => {
    if (data) {
      setNFTs(data as NFT[]);
    }
  }, [isLoading, data]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(isLoading || address === null || undefined) &&
          Array.from({ length: 3 }).map((_, i) => <NFTCardLoading key={i} />)}

        {nfts && address && nfts?.length > 0 && (
          <>
            {nfts.map((item) => (
              <div key={item.id}>
                <NFTCard nft={item} />
              </div>
            ))}
          </>
        )}

        {((!isLoading && data === undefined) || nfts?.length === 0) && (
          <div>No NFTs found</div>
        )}
      </div>
    </>
  );
}
