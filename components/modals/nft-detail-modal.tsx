import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog";
  import { useAddress } from "@chopinframework/react";
  import Image from "next/image";
import MintNFTModal from "./mint-nft-modal";
import { Memes } from "@/lib/types"
  
  interface NFTDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    meme: Memes;
    address: string | null;
  }
  
  export function NFTDetailModal({ isOpen, onClose, imageUrl, meme, address }: NFTDetailModalProps) {
    const { address: userAddress } = useAddress();
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose} >
        <DialogContent className="max-w-sm">
          <div className="space-y-6">
            {/* Meme Image */}
            <Image
              src={imageUrl}
              alt="meme"
              className="rounded-lg h-[300px] w-full object-cover"
              width={300}
              height={300}
            />
  
            {/* Mint NFT Button (only for the owner) */}
            {address === userAddress && (
              <MintNFTModal meme={meme} address={address} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }