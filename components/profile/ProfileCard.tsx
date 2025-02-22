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
  } = trpc.user.fetchUser.useQuery({ address: String(initialAddress) });

  const { mutateAsync: handleCreateUser } = trpc.user.createUser.useMutation({
    onSuccess: () => {},
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (
      initialAddress &&
      (userProfile === undefined || null) &&
      !isLoading &&
      !isSuccess
    ) {
      const createUser = async () => {
        await handleCreateUser({ address: initialAddress });
      };

      createUser();
    }
  }, [initialAddress, isLoading, isSuccess, userProfile, handleCreateUser]);

  useEffect(() => {
    setUser(userProfile);
  }, [initialAddress, isLoading, isSuccess, userProfile]);

  const avatar = useMemo(() => {
    return createAvatar(croodles, {
      size: 128,
      seed: initialAddress || "default",
    }).toDataUri();
  }, [initialAddress]);

  return (
    <Card className="p-4 md:p-6 my-6 flex justify-between items-center">
      <div className="flex space-x-3 md:space-x-2 items-center w-full">
        <Image
          width={100}
          height={100}
          src={avatar}
          alt="Avatar"
          className="border-4 border-secondary bg-muted-foreground p-2 rounded-full"
        />
        <div className="w-full">
        {user && <p className="text-lg font-semibold">{user.username} </p>}
        <div className="flex flex-col md:flex-row md:items-center justify-between flex-1">
          {initialAddress && (
            <p className="text-lg">{shortenAddress(String(initialAddress))}</p>
          )}
          <div className="">
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
          </div>
        </div>
        </div>
      </div>
    </Card>
  );
}
