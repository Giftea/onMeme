"use client";
import { trpc } from "@/lib/utils/trpc.utils";
import { useEffect, useState } from "react";
import HeartIcon from "../SVG/icons/heart";

export default function LikeNFT({
  nftId,
  userId,
}: {
  nftId: number;
  userId: string | undefined;
}) {
  const [nftLiked, setNftLiked] = useState(false);

  const { data: likeCount } = trpc.listing.getLikesForNft.useQuery({
    nftId,
  });

  const trpcUtils = trpc.useUtils();

  const { mutateAsync: handleLike } = trpc.listing.likeNft.useMutation({
    onSuccess: () => {
      trpcUtils.listing.getLikesForNft.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function handleOnclick() {
    if (!userId) return;
    await handleLike({ listingId: nftId, userId });
    setNftLiked(!nftLiked);
  }

  useEffect(() => {
    if (!userId) return;

    const userHasLiked = likeCount?.some((item) => item.userId === userId);
    if (userHasLiked) setNftLiked(true);
  }, [likeCount, userId]);

  return (
    <div className="flex justify-between items-center space-x-2 w-fit">
      <span className="text-lg">{likeCount?.length}</span>
      <button onClick={handleOnclick}>
        <HeartIcon liked={nftLiked} />
      </button>
    </div>
  );
}
