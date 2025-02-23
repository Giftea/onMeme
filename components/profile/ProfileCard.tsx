"use client";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";
import Image from "next/image";
import { shortenAddress } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import EditUsernameModal from "./EditUsernameModal";
import { trpc } from "@/lib/trpc.utils";
import { useAddress } from "@/hooks";

interface ProfileCardProps {
  initialAddress: string | null;
  isProfilePage?: boolean;
}

export default function ProfileCard({
  initialAddress,
  isProfilePage,
}: ProfileCardProps) {
  const router = useRouter();
  const { data: userAddress } = useAddress(initialAddress)

  const { data: userProfile } = trpc.user.fetchUser.useQuery({
    address: String(userAddress),
    initAccount: true,
  });

  const avatar = useMemo(() => {
    return createAvatar(croodles, {
      size: 128,
      seed: userAddress || "default",
    }).toDataUri();
  }, [userAddress]);

  return (
    <Card className="  p-6 my-6 flex justify-between items-center">
      <div className="flex space-x-4 items-center">
        <Image
          width={100}
          height={100}
          src={avatar}
          alt="Avatar"
          className="border-4 border-secondary bg-muted-foreground p-2 rounded-full"
        />
        <div>
          {userProfile && (
            <p className="text-lg font-semibold">{userProfile?.username} </p>
          )}
          {userAddress && (
            <p className="text-lg">{shortenAddress(String(userAddress))}</p>
          )}
        </div>
      </div>
      {isProfilePage ? (
        userProfile && <EditUsernameModal userName={userProfile.username} />
      ) : (
        <Button
          onClick={() => router.push("/profile")}
          className="text-lg"
          variant={"link"}
        >
          View Profile
        </Button>
      )}
    </Card>
  );
}