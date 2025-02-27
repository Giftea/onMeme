"use client";
import { trpc } from "@/lib/utils/trpc.utils";
import { CopyIcon } from "lucide-react";
import useCopy from "@/hooks/use-copy";
import { toast } from "@/hooks/use-toast";

export default function CopyAddress({
  userAddress,
  size,
}: {
  userAddress: string;
  size: number;
}) {
  const { data: userProfile } = trpc.user.fetchUser.useQuery({
    address: String(userAddress),
    initAccount: true,
  });
  const { copyToClipboard } = useCopy();

  const handleCopyToClipboard = () => {
    if (!userProfile?.address) {
      toast({
        title: "Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    } else {
      copyToClipboard(userProfile.address, "Wallet address copied!");
    }
  };

  return (
    <div onClick={handleCopyToClipboard} className="cursor-pointer">
      <CopyIcon className={`size-${size} hover:stroke-blue-400`} />
    </div>
  );
}
