"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { shortenText } from "@/lib/utils";
import { NFT } from "@/lib/types";
import ListNFTModal from "./list-nft-modal";

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
      <DialogContent className="max-w-4xl h-[65vh] md:h-[90vh] p-6 flex flex-col">
        <div className="flex flex-col md:flex-row gap-6 w-full h-full">
          {/* Left Side: NFT Image */}
          <div className="w-full md:w-1/2 h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={nft.metadata.image}
                alt="nft"
                className="rounded-lg object-cover border"
                fill
              />
            </div>
          </div>

          {/* Right Side: NFT Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3">
            <p className="font-semibold text-lg">{nft.metadata.name}</p>
            <p className="text-gray-500">
              {shortenText(nft.metadata.description)}
            </p>
            {nft.status && (
              <p className="text-gray-300 font-semibold">
                Status:{" "}
                <span className={`${statusMap[nft.status].className} text-lg`}>
                  {statusMap[nft.status].text}
                </span>
              </p>
            )}
            <div className="">{isProfilePage && <ListNFTModal nft={nftData} />}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
