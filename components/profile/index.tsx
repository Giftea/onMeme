"use client";
import UserMemesTemplate from "@/components/profile/UserTabsTemplate";
import UserMemes from "@/components/profile/UserMemes";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import UserNFTs from "./UserNFTs";

export default function Page({ address }: { address: string | null }) {
  const [userId, setUserId] = useState<string | null>(null);
  const { data: userProfile, isLoading } = trpc.user.fetchUser.useQuery({
    address: String(address),
  });

  useEffect(() => {
    if (userProfile) {
      setUserId(userProfile?.id);
    }
  }, [isLoading, userProfile]);

  return (
    <>
      <UserMemesTemplate
        nfts={<UserNFTs address={address} />}
        memes={<UserMemes address={address} userId={userId} />}
      />
    </>
  );
}
