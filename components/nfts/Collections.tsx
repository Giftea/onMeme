"use client";
import NFTCard, { NFTCardLoading } from "@/components/profile/MemeCard";
import { trpc } from "@/lib/trpc.utils";
import { useEffect, useState } from "react";
import { NFT } from "@/lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Collections({ address }: { address: string }) {
  const [nfts, setNFTs] = useState<NFT[]>();
  const { data, isLoading } = trpc.nft.getNFTsByOwner.useQuery({
    owner: String(address),
  });

  useEffect(() => {
    if (data) {
      setNFTs(data as NFT[]);
    }
  }, [isLoading, data]);
  return (
    <Card className="mt-6 ">
      <CardHeader className="text-lg font-semibold p-4 border-b">
        More From This Creator
      </CardHeader>
      <CardContent className="mt-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full "
        >
          <CarouselContent>
            {nfts && address && nfts?.length > 0 && (
              <>
                {nfts.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <NFTCard nft={item} />
                  </CarouselItem>
                ))}
              </>
            )}

            {isLoading && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <NFTCardLoading key={i} />
                  </CarouselItem>
                ))}
              </>
            )}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}
