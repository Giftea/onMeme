"use client";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";
import Image from "next/image";
import { shortenAddress } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import EditUsernameModal from "./EditUsernameModal";
import { trpc } from "@/lib/trpc.utils";

interface ProfileCardProps {
  initialAddress: string | null;
  isProfilePage?: boolean;
}
interface UserType {
  username: string;
  address: string;
  id: string;
  createdAt: string | null;
}

export default function ProfileCard({
  initialAddress,
  isProfilePage,
}: ProfileCardProps) {
  const [user, setUser] = useState<undefined | UserType>(undefined);
  const router = useRouter();

  const {
    data: userProfile,
    isLoading,
    isSuccess,
    isStale,
  } = trpc.user.fetchUser.useQuery({ address: String(initialAddress) });

  const { mutateAsync: handleCreateUser } = trpc.user.createUser.useMutation({
    onSuccess: () => {},
    onError: (error) => {
      console.error(error);
    },
  });

  async function createUser() {
    if (!initialAddress) return;
    await handleCreateUser({ address: initialAddress });
  }

  useEffect(() => {
    if (
      initialAddress &&
      (userProfile === undefined || null) &&
      !isLoading &&
      !isSuccess
    ) {
      createUser();
    }
  }, [initialAddress, isLoading, isSuccess, userProfile, createUser]);

  useEffect(() => {
    setUser(userProfile);
  }, [initialAddress, isLoading, isSuccess, userProfile, isStale]);

  const avatar = useMemo(() => {
    return createAvatar(croodles, {
      size: 128,
      seed: initialAddress || "default",
    }).toDataUri();
  }, [initialAddress]);

  return (
    <Card className="max-w-[1060px] mx-10 lg:mx-auto p-6 my-6 flex justify-between items-center">
      <div className="flex space-x-4 items-center">
        <Image
          width={100}
          height={100}
          src={avatar}
          alt="Avatar"
          className="border-4 bg-muted-foreground p-2 rounded-full"
        />
        <div>
          {user && <p className="text-lg font-semibold">{user.username} </p>}
          {initialAddress && (
            <p className="text-lg">{shortenAddress(String(initialAddress))}</p>
          )}
        </div>
      </div>
      {isProfilePage ? (
        user && <EditUsernameModal userName={user?.username} />
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
