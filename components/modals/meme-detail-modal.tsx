import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAddress } from "@chopinframework/react";
import Image from "next/image";
import MintNFTModal from "./mint-nft-modal";
import { Memes } from "@/lib/types";

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
    <DialogContent className="max-w-2xl h-[65vh] p-6 flex flex-col items-center">
      {/* Meme Image */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full md:w-3/4 h-full">
          <Image
            src={imageUrl}
            alt="nft"
            className="rounded-lg min-[object-contain] min-w-full"
            fill
          />
        </div>
      </div>
  
      {/* Mint NFT Button (only for the owner) */}
      {address === userAddress && (
        <div className="mt-4">
          <MintNFTModal meme={meme} address={address} />
        </div>
      )}
    </DialogContent>
  </Dialog>
  
  );
}
