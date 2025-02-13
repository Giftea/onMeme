"use client";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";
import Image from "next/image";
import { shortenAddress } from "@/lib/utils";
import { users } from "@/lib/db/schema";
import { Button } from "../ui/button";
import { getUserByAddress } from "@/lib/queries/dbQueries";
import { useRouter } from "next/navigation";
import EditUsernameModal from "./EditUsernameModal";

interface ProfileCardProps {
  initialAddress: string | null;
  isProfilePage?: boolean;
}

export default function ProfileCard({
  initialAddress,
  isProfilePage,
}: ProfileCardProps) {
  //   const { data: userId } = useAddress(initialAddress);
  const [user, setUser] = useState<null | typeof users.$inferSelect>(null);
  const router = useRouter();

  async function fetchUser() {
    const _user = await getUserByAddress(String(initialAddress));
    setUser(_user);
  }

  useEffect(() => {
    fetchUser();
  }, [initialAddress]);

  const avatar = useMemo(() => {
    return createAvatar(croodles, {
      size: 128,
      seed: initialAddress || "default",
    }).toDataUri();
  }, []);

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
        <EditUsernameModal initialAddress={initialAddress} user={user} />
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
