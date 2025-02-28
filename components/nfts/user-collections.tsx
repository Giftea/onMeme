"use client";
import NFTCard, { NFTCardLoading } from "@/components/profile/meme-card";
import { trpc } from "@/lib/utils/trpc.utils";
import { ListedNFT } from "@/lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Collections({ address }: { address: string }) {
  const { data, isLoading } = trpc.listing.getListingsBySeller.useQuery({
    seller: String(address),
  });

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
            {data && address && data?.length > 0 && (
              <>
                {data.map((item) => (
                  <CarouselItem
                    key={item.listingId}
                    className="sm:basis-1/2 lg:basis-1/3"
                  >
                    <NFTCard listedNFT={item as ListedNFT} />
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
