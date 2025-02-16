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
import { trpc } from "@/lib/trpc.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ListingSchema, ListingSchemaType } from "@/lib/zod-schemas/nft";
import { useToast } from "@/hooks/use-toast";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/navigation";

export default function ListNFTModal({ nft }: { nft?: NFT }) {
  const router = useRouter();
  const { toast } = useToast();
  const trpcUtils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const defaultValues = { price: undefined };
  const form = useForm<ListingSchemaType>({
    resolver: zodResolver(ListingSchema),
    defaultValues,
  });

  const { mutateAsync: listNFT, isPending } =
    trpc.listing.createListing.useMutation({
      onSuccess: () => {
        toast({
          variant: "success",
          title: "NFT Successfully Listed! 😎",
        });
        trpcUtils.nft.getNFTsByOwner.invalidate();
        trpcUtils.listing.getAllListings.invalidate();
        setOpen(false);
        router.push("/marketplace");
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const handleOnSubmit = async (data: ListingSchemaType) => {
    const { price } = data;
    await listNFT({
      nftId: Number(nft?.id),
      seller: String(nft?.owner),
      price: Number(price),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold float-right text-lg px-8 py-5">
          List NFT
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">List Your NFT for Sale</DialogTitle>
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
                      <Input id="price" type="number" className="" {...field} />
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
                  {isPending ? (
                    <Oval
                      visible={true}
                      height="120"
                      width="120"
                      color="#ffffff"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      strokeWidth={4}
                      secondaryColor="#ffffff70"
                    />
                  ) : (
                    "List Now"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
