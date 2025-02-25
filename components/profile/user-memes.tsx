"use client";
import NFTCard from "./meme-card";
import { trpc } from "@/lib/trpc.utils";
import { FolderClosed } from "lucide-react";
import React from "react";

export default function UserMemes({ address }: { address: string | null }) {
  const { data: memes, isLoading } = trpc.meme.getMemesByOwner.useQuery({
    ownerAddress: String(address),
  });

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memes && memes?.length > 0 && (
          <>
            {memes.toReversed().map((item) => (
              <div key={item.id}>
                <NFTCard meme={item} address={address} />
              </div>
            ))}
          </>
        )}

        {((!isLoading && memes === undefined) || memes?.length === 0) && (
          <div className="w-full col-span-3 py-[5rem] flex flex-col items-center justify-center text-gray-400">
            <FolderClosed size={40} />
            No Memes found
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
