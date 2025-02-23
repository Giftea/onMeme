"use client";
import { NFT } from "@/lib/types";
import { Button } from "../ui/button";
import { trpc } from "@/lib/trpc.utils";
import { useToast } from "@/hooks/use-toast";
import IsLoading from "../composed/loader";

export default function UnListNFT({ nft }: { nft: NFT }) {
  const trpcUtils = trpc.useUtils();
  const { toast } = useToast();
  const { data: listedNFT } = trpc.listing.getListingByNFTId.useQuery({
    id: nft?.id,
  });

  const { isPending, mutateAsync: updateListingStatus } =
    trpc.listing.updateListingStatus.useMutation({
      onSuccess: () => {
        trpcUtils.nft.getNFTsByOwner.invalidate();
        trpcUtils.listing.getMarketplaceListings.invalidate();
        trpcUtils.listing.getListingByNFTId.invalidate();
        toast({
          variant: "success",
          title: "NFT Status Updated! 😎",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: error.message,
        });
      },
    });

  async function handleOnclick(status: "listed" | "cancelled") {
    if (!listedNFT) return;
    if (status === "listed") {
      await updateListingStatus({
        id: listedNFT.listingId,
        status: "cancelled",
      });
    }
    if (status === "cancelled") {
      await updateListingStatus({
        id: listedNFT.listingId,
        status: "listed",
      });
    }
  }
  return (
    <>
      {listedNFT?.status === "sold" ? (
        <p className="px-6 py-2 float-right border border-dotted border-secondary text-secondary w-fit rounded-lg font-semibold">
          {" "}
          Sold{" "}
        </p>
      ) : listedNFT?.status === "listed" ? (
        <div className="flex justify-between items-center">
          <p className=" md:text-xl text-secondary w-fit rounded-lg font-semibold">
            Listed
          </p>

          <Button
            onClick={() => handleOnclick("listed")}
            variant={"destructive"}
          >
            {isPending ? <IsLoading /> : "Cancel List"}
          </Button>
        </div>
      ) : listedNFT?.status === "cancelled" ? (
        <>
          {" "}
          <div className="flex justify-between items-center">
            <p className=" md:text-xl text-red-400 w-fit rounded-lg font-semibold">
              Cancelled
            </p>

            <Button
              onClick={() => handleOnclick("cancelled")}
              className="font-semibold"
            >
              {isPending ? <IsLoading /> : "Re-List"}
            </Button>
          </div>{" "}
        </>
      ) : null}
    </>
  );
}
