"use client";
import { Card } from "@/components/ui/card";
import { shortenAddress } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import EditUsernameModal from "../modals/edit-username-modal";
import { trpc } from "@/lib/utils/trpc.utils";
import Avatar from "../composed/avatar";
import { CopyIcon, SquareUserRound } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import useCopy from "@/hooks/use-copy";

interface ProfileCardProps {
  isProfilePage?: boolean;
  isUserPublicPage?: boolean;
  userAddress: string;
}

export default function ProfileCard({
  isProfilePage,
  isUserPublicPage,
  userAddress,
}: ProfileCardProps) {
  const router = useRouter();

  const { data: userProfile } = trpc.user.fetchUser.useQuery({
    address: String(userAddress),
    initAccount: true,
  });

  const { handleCopy } = useCopy();

  const handleCopyLink = () => {
    if (!userProfile?.address) {
      toast({
        title: "Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    } else {
      handleCopy(userProfile.address, "Wallet address copied!");
    }
  };

  return (
    <Card className="  p-6 my-6 flex justify-between items-center">
      <div className="flex space-x-4 items-center">
        <Avatar userAddress={String(userProfile?.address)} />
        <div>
          {userProfile && (
            <p className="text-lg font-semibold capitalize">
              {userProfile?.username}{" "}
            </p>
          )}
          {userProfile?.address && (
            <div className="flex justify-center items-center gap-2">
              <p className="text-lg">
                {shortenAddress(String(userProfile?.address))}
              </p>
              <div onClick={handleCopyLink} className="cursor-pointer">
                <CopyIcon className="size-4 hover:stroke-blue-400" />
              </div>
            </div>
          )}
        </div>
      </div>
      {!isUserPublicPage &&
        (isProfilePage ? (
          userProfile && <EditUsernameModal userName={userProfile.username} />
        ) : (
          <Link href="/profile">
            <SquareUserRound className="text-sky-500 flex md:hidden" />
            <Button
              onClick={() => router.push("/profile")}
              className="text-lg hidden md:flex"
              variant={"link"}
            >
              View Profile
            </Button>
          </Link>
        ))}
    </Card>
  );
}
