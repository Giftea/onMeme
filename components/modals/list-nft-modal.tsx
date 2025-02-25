"use client";
import { NFT } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useMemo } from "react";
import { ListingSchema, ListingSchemaType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import IsLoading from "../composed/loader";

export default function ListNFTModal({ nft }: { nft: NFT }) {
  const router = useRouter();
  const { toast } = useToast();
  const trpcUtils = trpc.useUtils();
  const [open, setOpen] = useState(false);

  const { data: listedNFT } = trpc.listing.getListingByNFTId.useQuery({
    id: nft?.id,
  });

  const defaultValues = useMemo(() => ({ price: undefined }), []);
  const form = useForm<ListingSchemaType>({
    resolver: zodResolver(ListingSchema),
    defaultValues,
  });

  const handleMutationSuccess = useCallback(
    (message: string) => {
      trpcUtils.nft.getNFTsByOwner.invalidate();
      trpcUtils.listing.getMarketplaceListings.invalidate();
      trpcUtils.listing.getListingByNFTId.invalidate();
      toast({
        variant: "success",
        title: message,
      });
      setOpen(false);
    },
    [toast, trpcUtils]
  );

  const { mutateAsync: handleListing, isPending } =
    trpc.listing.handleListing.useMutation({
      onSuccess: (data, variables) => {
        if (variables.action === "create") {
          handleMutationSuccess("NFT Successfully Listed! 😎");
          router.push("/marketplace");
        } else if (variables.action === "update") {
          handleMutationSuccess("NFT Status Updated! 😎");
        } else if (variables.action === "cancel") {
          handleMutationSuccess("NFT Status Updated! 😎");
        }
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: error.message,
        });
      },
    });

  const handleCancelStatus = useCallback(async () => {
    if (!listedNFT) return;
    await handleListing({
      action: "cancel",
      id: listedNFT.listingId,
      status: "cancelled",
    });
  }, [handleListing, listedNFT]);

  const handleOnSubmit = useCallback(
    async (data: ListingSchemaType) => {
      const { price } = data;
      if (listedNFT) {
        await handleListing({
          action: "update",
          listingId: listedNFT.listingId,
          newPrice: Number(price),
        });
      } else {
        await handleListing({
          action: "create",
          nftId: Number(nft?.id),
          seller: String(nft?.owner),
          price: Number(price),
        });
      }
      form.reset();
    },
    [handleListing, listedNFT, nft, form]
  );

  const renderListingStatus = useMemo(() => {
    if (!listedNFT) return null;

    switch (listedNFT.status) {
      case "sold":
      case "cancelled":
        return (
          <div className="flex justify-between items-center">
            <p className="text-gray-300: font-semibold">
              Price{" "}
              <span className="text-secondary text-lg">
                {listedNFT.price} OMC
              </span>
            </p>
            <Button onClick={() => setOpen(true)}>Re-List</Button>
          </div>
        );
      case "listed":
        return (
          <div className="flex justify-between items-center">
            <p className="text-gray-300: font-semibold">
              Price{" "}
              <span className="text-secondary text-lg">
                {listedNFT.price} OMC
              </span>
            </p>
            <Button onClick={handleCancelStatus} variant={"destructive"}>
              {isPending ? <IsLoading /> : "Cancel List"}
            </Button>
          </div>
        );
      default:
        return null;
    }
  }, [listedNFT, handleCancelStatus, isPending]);

  return (
    <>
      {renderListingStatus}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {!listedNFT && (
            <Button className="font-semibold float-right text-lg px-8 py-5">
              List NFT
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="lg:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              List Your NFT for Sale
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {nft?.metadata?.image && (
              <Image
                src={nft?.metadata?.image}
                alt="meme"
                className="rounded-lg"
                width={400}
                height={400}
              />
            )}
            <Form {...form}>
              <form
                className="space-y-3"
                onSubmit={form.handleSubmit(handleOnSubmit)}
              >
                <FormField
                  control={form.control}
                  name={"price"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="price" className="text-base">
                        Price:
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="price"
                          type="number"
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    disabled={isPending}
                    className="font-semibold text-lg w-full py-5 mt-5"
                    type="submit"
                  >
                    {isPending ? <IsLoading /> : "List Now"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
