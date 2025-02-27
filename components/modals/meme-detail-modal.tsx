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
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* Meme Image */}
        <Image
          src={imageUrl}
          alt="nft"
          width={300}
          height={300}
          className="rounded-lg w-[auto] h-[auto]"
        />

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
