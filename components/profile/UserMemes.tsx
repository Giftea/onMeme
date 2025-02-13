"use client";
import NFTCard, { NFTCardLoading } from "./MemeCard";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import { Memes } from "@/lib/types";

export default function UserMemes({
  userId,
  address,
}: {
  userId: string | null;
  address: string | null;
}) {
  const [memes, setMemes] = useState<Memes[]>();

  const { data, isLoading } = trpc.meme.getMemesByOwner.useQuery({
    ownerId: String(userId),
  });

  useEffect(() => {
    if (data) {
      setMemes(data);
    }
  }, [isLoading, data]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(isLoading || userId === null || undefined) &&
          Array.from({ length: 3 }).map((_, i) => <NFTCardLoading key={i} />)}

        {memes && (
          <>
            {memes.map((item) => (
              <div key={item.id}>
                <NFTCard meme={item} address={address} />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
