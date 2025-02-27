"use client";

import { NFT } from "@/lib/types";
import ListNFTModal from "../modals/list-nft-modal";
import Image from "next/image";
import { shortenText } from "@/lib/utils";
import { trpc } from "@/lib/utils/trpc.utils";
import { useAddress } from "@chopinframework/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function NFTCard({ nft }: { nft: NFT }) {
  const { data: listedNFT } = trpc.listing.getListingByNFTId.useQuery({
    id: nft?.id,
  });
  const { address: userAddress } = useAddress();
  const [isProfilePage, setIsProfilePage] = useState(false);
  const pathName = usePathname();
  const addressPathname = pathName.split("/user/")[1];
  const { theme } = useTheme();
  const { data: isNFTListed } = trpc.listing.checkNFTListed.useQuery({
    nftId: nft?.id,
  });

  useEffect(() => {
    if (pathName === "/profile") {
      setIsProfilePage(true);
    }
  }, [addressPathname, isProfilePage, pathName]);
  return (
    <div className="space-y-3 w-full">
      <div className="space-y-3">
        {nft?.metadata && (
          <Image
            src={nft?.metadata?.image}
            alt="meme"
            className="rounded-lg h-[300px] w-full object-cover"
            width={300}
            height={300}
          />
        )}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">{nft?.metadata?.name}</p>
          {isNFTListed && (
            <>
              {listedNFT?.status === "listed" ? (
                <p className="text-green-500 w-fit rounded-lg">Listed </p>
              ) : listedNFT?.status === "sold" ? (
                <p className="text-gray-500 w-fit rounded-lg">Purchased </p>
              ) : listedNFT?.status === "cancelled" ? (
                <p className="text-red-500 w-fit rounded-lg">Cancelled </p>
              ) : null}
            </>
          )}
        </div>
        <p className="text-gray-500 !mt-0 ">
          {nft?.metadata && shortenText(nft?.metadata?.description)}
        </p>
      </div>
      {isProfilePage && <ListNFTModal nft={nft as NFT} />}
      {!isProfilePage &&
        (addressPathname === userAddress ? (
          <ListNFTModal nft={nft as NFT} />
        ) : (
          <p className="text-gray-300: font-semibold">
            Price:{" "}
            <span
              className={`${
                theme === "dark" ? "text-secondary" : "text-primary"
              }  text-lg`}
            >
              {listedNFT?.price} OMC
            </span>
          </p>
        ))}
    </div>
  );
}
