"use client";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import XIcon from "../SVG/icons/x-icon";
import FacebookIcon from "../SVG/icons/facebook";
import Reddit from "../SVG/icons/reddit";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useAddress } from "@chopinframework/react";
import useCopy from "@/hooks/use-copy";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memeImage: string | null;
};

export default function MemeGeneratedModal({
  open,
  setOpen,
  memeImage,
}: Props) {
  const { address } = useAddress();
  const shareText = encodeURIComponent(
    "Check out this meme I created on onMeme! 🔥"
  );
  const encodedUrl = encodeURIComponent(String(memeImage));

  const { copyToClipboard } = useCopy();

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyToClipboard = () => {
    copyToClipboard(String(memeImage), "copied");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            🎉 Meme Generated!
          </DialogTitle>
        </DialogHeader>
        {memeImage ? (
          <Image
            src={memeImage}
            width={400}
            height={300}
            className="rounded-lg"
            alt="onMeme generated meme"
          />
        ) : (
          <Skeleton className="w-full rounded-lg h-[400px] bg-muted" />
        )}

        <div className="mt-4 flex justify-center gap-4">
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="bg-slate-100">
              <XIcon />
            </Button>
          </a>
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="bg-[#316FF6]">
              <FacebookIcon />
            </Button>
          </a>
          <a
            href={socialLinks.reddit}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="bg-[#FF4500]">
              <Reddit />
            </Button>
          </a>
          <Button variant={"outline"} onClick={handleCopyToClipboard}>
            <Copy />
          </Button>
        </div>
        {address && (
          <div className="mt-4">
            <Link
              className="text-primary underline text-center flex items-center justify-self-center"
              href="/profile"
            >
              View on Dashboard <ExternalLink size={16} className="ml-[2px]" />
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
