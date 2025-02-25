"use client";
import { Card } from "@/components/ui/card";
import { shortenAddress } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import EditUsernameModal from "./edit-username-modal";
import { trpc } from "@/lib/trpc.utils";
import Avatar from "../composed/avatar";
import { SquareUserRound } from "lucide-react";

interface ProfileCardProps {
  isProfilePage?: boolean;
  isUserPublicPage?: boolean;
  userAddress: string;
}

export default function ProfileCard({
  isProfilePage,
  isUserPublicPage, userAddress
}: ProfileCardProps) {
  const router = useRouter();

  const { data: userProfile } = trpc.user.fetchUser.useQuery({
    address: String(userAddress),
    initAccount: true,
  });

  return (
    <Card className="  p-6 my-6 flex justify-between items-center">
      <div className="flex space-x-4 items-center">
        <Avatar userAddress={String(userAddress)} />
        <div>
          {userProfile && (
            <p className="text-lg font-semibold capitalize">{userProfile?.username} </p>
          )}
          {userAddress && (
            <p className="text-lg">{shortenAddress(String(userAddress))}</p>
          )}
        </div>
      </div>
      {!isUserPublicPage &&
        (isProfilePage ? (
          userProfile && <EditUsernameModal userName={userProfile.username} />
        ) : (
          <div>
            <SquareUserRound className="text-sky-500 flex md:hidden" />
            <Button
              onClick={() => router.push("/profile")}
              className="text-lg hidden md:flex"
              variant={"link"}
            >
              View Profile
            </Button>
          </div>
        ))}
    </Card>
  );
}
