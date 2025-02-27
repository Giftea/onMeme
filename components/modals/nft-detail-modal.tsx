"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { NFT } from "@/lib/types";
import ListNFTModal from "./list-nft-modal";
import Image from "next/image";

interface NFTDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    metadata: {
      image: string;
      name: string;
      description: string;
    };
    price?: string;
    status?: "listed" | "sold" | "cancelled";
  };
  isProfilePage: boolean;
  addressPathname: string;
  userAddress: string | null;
  nftData: NFT;
}

export function NFTDetailModal({
  isOpen,
  onClose,
  nft,
  isProfilePage,
  nftData,
}: NFTDetailModalProps) {
  const statusMap = {
    listed: {
      text: "Listed",
      className: "text-green-500",
    },
    sold: {
      text: "Sold",
      className: "text-gray-500",
    },
    cancelled: {
      text: "Cancelled",
      className: "text-red-500",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit w-fit p-3 md:p-6">
        <DialogHeader className="text-left">
          <DialogTitle>{nft.metadata.name}</DialogTitle>
          <DialogDescription className="max-sm:text-xs">{nft.metadata.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          <Image
            src={nft.metadata.image}
            alt="nft"
            width={300}
            height={300}
            className="rounded-lg w-[auto] h-[auto]"
          />

          <div className="flex justify-between items-center">
            {nft.status && (
              <p className="font-semibold max-sm:text-sm">
                Status:{" "}
                <span
                  className={`${statusMap[nft.status].className} font-normal`}
                >
                  {statusMap[nft.status].text}
                </span>
              </p>
            )}
            <div className="hidden md:block">
              {isProfilePage && <ListNFTModal nft={nftData} />}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
