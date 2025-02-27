"use client";
import { trpc } from "@/lib/utils/trpc.utils";
import { CopyIcon } from "lucide-react";
import useCopy from "@/hooks/use-copy";
import { toast } from "@/hooks/use-toast";

export default function CopyAddress({
  userAddress,
}: {
  userAddress: string;
}) {
  const { data: userProfile } = trpc.user.fetchUser.useQuery({
    address: String(userAddress),
    initAccount: true,
  });
  const { copyToClipboard } = useCopy();

  const URL = `${process.env.NEXT_PUBLIC_APP_URL}/user/${userProfile?.address}`;

  const handleCopyToClipboard = () => {
    if (!userProfile?.address) {
      toast({
        title: "Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    } else {
      copyToClipboard(URL, "User profile copied!");
    }
  };

  return (
    <div onClick={handleCopyToClipboard} className="cursor-pointer">
      <CopyIcon className={`size-4 hover:stroke-blue-400`} />
    </div>
  );
}
