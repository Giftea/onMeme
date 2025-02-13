"use client";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";

export default function LikeNFT({
  nftId,
  userId,
}: {
  nftId: number;
  userId: string;
}) {
  const [nftLiked, setNftLiked] = useState(false);

  const { data: likeCount } = trpc.nft.getLikesForNft.useQuery({
    nftId,
  });

  const trpcUtils = trpc.useUtils();

  const { mutateAsync: handleLike } = trpc.nft.likeNft.useMutation({
    onSuccess: () => {
      trpcUtils.nft.getLikesForNft.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function handleOnclick() {
    await handleLike({ nftId, userId });
    setNftLiked(!nftLiked);
  }

  function checkUserId() {
    return likeCount?.some((item) => item.userId === userId);
  }

  useEffect(() => {
    checkUserId() && setNftLiked(true);
  }, [likeCount]);

  return (
    <div className="flex justify-between items-center space-x-2 w-fit">
      <span className="text-lg">{likeCount?.length}</span>
      <button onClick={handleOnclick}>
        <Heart liked={nftLiked} />
      </button>
    </div>
  );
}

const Heart = ({ liked }: { liked: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={liked ? "#ff788f" : "none"}
      stroke={liked ? "#ff788f" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-heart"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
};
