"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/utils/trpc.utils";
import { Meme } from "@/lib/types";
import { Brain, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import MemeSelection from "../composed/meme-selection";
import { useRouter, useSearchParams } from "next/navigation";
import MemeGeneratedModal from "./meme-generated-modal";

export default function AiMemeGenerator({ address }: { address: string }) {
  const trpcUtils = trpc.useUtils();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const [open, setOpen] = useState(false);
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [openMemeGeneratedModal, setOpenMemeGeneratedModal] = useState(false);

  const { data: memeData, isLoading } = trpc.meme.fetchAiMemes.useQuery();

  const {
    mutateAsync: handleGenerateAiMeme,
    isPending,
    data,
  } = trpc.meme.generateAiMeme.useMutation({
    onSuccess: () => {},
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { mutateAsync: createMeme, data: createdMemeData } = trpc.meme.createMeme.useMutation({
    onSuccess: () => {
      trpcUtils.meme.getMemesByOwner.invalidate();
      setOpenMemeGeneratedModal(true);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create meme! 😞",
      });
    },
  });

  const selectedMemeId = searchParams.get("ai-meme");
  const selectedMeme =
    memeData?.find((meme) => {
      return meme.id === selectedMemeId;
    }) || null;

  const handleMemeClick = (meme: Meme) => {
    push(`?ai-meme=${meme.id}`, { scroll: false });
  };

  async function handleMeme() {
    await createMeme({
      ownerAddress: address,
      imageUrl: data!,
      templateId: String(selectedMemeId),
    });
  }

  useEffect(() => {
    if (!!data && address) {
      const img = new Image();
      img.src = data;

      img.onload = () => {
        setMemeImage(data);
      };
      setOpen(false);

      handleMeme();
    }
  }, [data, address]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-sm md:text-base md:w-[50%] lg:w-[65%] flex space-x-">
          <Brain />
          <span>Generate with AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 md:w-11/12 max-w-[1024px] gap-0 h-[calc(100%-2rem)] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI Meme Generation</DialogTitle>
          <DialogDescription>Use AI to generate a Meme</DialogDescription>
        </DialogHeader>
        <>
          {memeData && (
            <MemeSelection
              loading={isLoading}
              memes={memeData}
              selectedMeme={selectedMeme}
              selectedMemeId={selectedMemeId}
              handleMemeClick={handleMemeClick}
            />
          )}
          <Button
            disabled={isPending}
            className="mt-4"
            onClick={() =>
              handleGenerateAiMeme({
                template_id: selectedMemeId ?? "6235864",
              })
            }
          >
            {isPending ? <Loader /> : "Generate"}{" "}
          </Button>
        </>
      </DialogContent>
      <MemeGeneratedModal
        memeImage={memeImage}
        open={openMemeGeneratedModal}
        setOpen={setOpenMemeGeneratedModal}
        memeId={createdMemeData && createdMemeData[0].id}
      />
    </Dialog>
  );
}
