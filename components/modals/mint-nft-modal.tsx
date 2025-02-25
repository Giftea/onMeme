"use client";
import { Memes } from "@/lib/types";
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
import { Textarea } from "../ui/textarea";
import { MintNFTSchema, MintNFTSchemaType } from "@/lib/zod-schemas/nft";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import IsLoading from "../composed/loader";

export default function MintNFTModal({
  meme,
  address,
}: {
  meme: Memes;
  address: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const trpcUtils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const defaultValues = { name: "", description: "", price: undefined };
  const form = useForm<MintNFTSchemaType>({
    resolver: zodResolver(MintNFTSchema),
    defaultValues,
  });

  const { data: isMemeListed } = trpc.nft.checkMemeMinted.useQuery({
    memeId: meme?.id,
  });

  const { mutateAsync: mintNFT, isPending } = trpc.nft.mintNFT.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        title: "NFT Successfully Minted! 😎",
      });
      trpcUtils.nft.getNFTsByOwner.invalidate();
      trpcUtils.nft.getAllNFTs.invalidate();
      setOpen(false);
      router.push("profile?tab=nfts");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error?.message,
        description: "You cannot mint an NFT twice!",
      });
    },
  });

  const handleOnSubmit = async (data: MintNFTSchemaType) => {
    if (!meme) return;
    const { name, description } = data;

    await mintNFT({
      owner: address,
      metadata: {
        name,
        description,
        image: meme.imageUrl,
      },
      memeId: meme.id,
    });
  };

  return (
    <>
      {isMemeListed ? (
        <p className="px-6 py-2 float-right border border-dotted border-secondary text-secondary w-fit rounded-lg font-semibold">
          Minted
        </p>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold float-right text-lg px-8 py-5">
              Mint
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Mint Meme as NFT</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Image
                src={meme ? meme?.imageUrl : ""}
                alt="meme"
                className="rounded-lg"
                width={400}
                height={400}
              />

              <Form {...form}>
                <form
                  className="space-y-3"
                  onSubmit={form.handleSubmit(handleOnSubmit)}
                >
                  <FormField
                    control={form.control}
                    name={"name"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name" className="text-base">
                          Name:
                        </FormLabel>
                        <FormControl>
                          <Input id="name" className="" {...field} />
                        </FormControl>
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="description" className="text-base">
                          Description:
                        </FormLabel>
                        <FormControl>
                          <Textarea className="" {...field} />
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
                      {isPending ? <IsLoading /> : "Mint"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
