import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddress } from "@chopinframework/react";
import MintNFTModal from "./mint-nft-modal";
import { Memes } from "@/lib/types";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

interface MemeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  meme: Memes;
  address: string | null;
}

export function MemeDetailModal({
  isOpen,
  onClose,
  imageUrl,
  meme,
  address,
}: MemeDetailModalProps) {
  const { address: userAddress } = useAddress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit w-fit p-3 md:p-6 flex flex-col items-center">
        <DialogHeader className="hidden">
          <DialogTitle hidden />
          <DialogDescription hidden />
        </DialogHeader>
        {/* Meme Image */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="nft"
            width={300}
            height={300}
            className="rounded-lg w-[auto] h-[auto]"
          />
        ) : (
          <Skeleton className="w-full rounded-lg h-[400px] bg-muted" />
        )}

        {address === userAddress && (
          <div className="flex justify-end w-full">
            {" "}
            <MintNFTModal meme={meme} address={address} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
