"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import { convertImageToBase64 } from "@/lib/utils";
import { fabric } from "fabric";
import { trpc } from "@/lib/trpc.utils";
import { useToast } from "@/hooks/use-toast";

type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

type Caption = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export default function MemeGenerator({ address }: { address: string | null }) {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [captions, setCaptions] = useState<Caption[]>([
    { id: "1", text: "", x: 50, y: 50 },
  ]);
  const { toast } = useToast();
  const [captionInputValues, setCaptionInputValues] = useState<{
    [key: string]: string;
  }>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const nodeRef = useRef(null);
  const trpcUtils = trpc.useUtils();

  const selectedMemeId = searchParams.get("meme");
  const selectedMeme =
    memes.find((meme) => {
      return meme.id === selectedMemeId;
    }) || null;
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const initializeCanvas = (imageUrl: string) => {
    const canvas = new fabric.Canvas("memeCanvas", {
      width: 500,
      height: selectedMeme?.height || 500,
      selection: true,
    });

    fabric.Image.fromURL(imageUrl, (img) => {
      img.scaleToWidth(500);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
    setFabricCanvas(canvas);
    canvasRef.current = canvas;
  };

  useEffect(() => {
    if (!selectedMeme) return;
    convertImageToBase64(selectedMeme.url, function (base64) {
      setImageUrl("data:image/jpeg;base64," + base64);
      return "data:image/jpeg;base64," + base64;
    });
  }, [selectedMeme]);

  useEffect(() => {
    if (!imageUrl) return;
    initializeCanvas(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch("/api/memes");
        const data = await response.json();
        setMemes(data);
      } catch (error) {
        console.error("Error fetching memes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  const handleMemeClick = (meme: Meme) => {
    router.push(`?meme=${meme.id}`, { scroll: false });
  };

  const handleAddCaption = () => {
    const newCaptionId = (captions.length + 1).toString();
    setCaptions((prev) => [
      ...prev,
      { id: newCaptionId, text: "", x: 50, y: -3 },
    ]);
  };

  const handleCaptionChange = (id: string, text: string) => {
    setCaptionInputValues((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const { mutateAsync: createMeme } = trpc.meme.createMeme.useMutation({
    onSuccess: () => {
      trpcUtils.meme.getMemesByOwner.invalidate();
      toast({
        variant: "success",
        title: "Meme Successfully Generated! 😎",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDownloadMeme = async () => {
    if (!fabricCanvas) return;

    const canvasElement = document.getElementById("memeContainer");
    if (!canvasElement) return;

    try {
      const canvasImage = await html2canvas(canvasElement);
      const dataUrl = canvasImage.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "meme.png";
      link.click();

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "meme.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const ipfsUrl = await uploadResponse.json();

      if (ipfsUrl && address) {
        await createMeme({
          ownerAddress: address,
          imageUrl: ipfsUrl,
          templateId: String(selectedMemeId),
        });
      }
    } catch (error) {
      console.error("Error generating/uploading meme:", error);
    }
  };

  return (
    <Card className="p-6 my-6">
      <CardTitle className="text-2xl">Meme Generator</CardTitle>

      <CardContent className="grid grid-cols-2 gap-x-4 p-0 mt-5">
        <div id="memeContainer" className="relative mt-6">
          <canvas id="memeCanvas" className="border shadow-lg" />
          {captions.map((caption) => (
            <Draggable
              nodeRef={nodeRef}
              key={caption.id}
              defaultPosition={{ x: caption.x, y: caption.y }}
              onStop={(e, data) => {
                const updatedCaptions = captions.map((cap) =>
                  cap.id === caption.id ? { ...cap, x: data.x, y: data.y } : cap
                );
                setCaptions(updatedCaptions);
              }}
            >
              <div ref={nodeRef} className="absolute cursor-pointer">
                <span className="bg-white text-black text-3xl p-2">
                  {captionInputValues[caption.id] || caption.text}
                </span>
              </div>
            </Draggable>
          ))}
        </div>

        <div>
          <Button variant="outline">Upload new template</Button>
          <p className="text-lg font-semibold border-b my-4">
            {selectedMeme ? selectedMeme.name : "Select a meme template"}
          </p>

          {/* Meme selection area */}
          <ScrollArea className="w-120 whitespace-nowrap rounded-md border">
            {loading ? (
              <p>Loading memes...</p>
            ) : (
              <div className="flex w-max space-x-4 p-4">
                {memes.map((meme) => (
                  <figure
                    key={meme.id}
                    className={`border cursor-pointer rounded-lg p-2 transition-all ${
                      selectedMemeId === meme.id && "border-primary"
                    }`}
                    onClick={() => handleMemeClick(meme)}
                  >
                    <div className="overflow-hidden">
                      <Image
                        className="aspect-[3/4] h-fit w-fit object-cover"
                        width={50}
                        height={150}
                        src={meme.url}
                        alt={meme.name}
                      />
                    </div>
                  </figure>
                ))}
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Meme caption input */}
          <div className="border rounded-lg p-4 my-3 space-y-2">
            <p>Add Meme Captions</p>
            {captions.map((caption) => (
              <Input
                key={caption.id}
                value={captionInputValues[caption.id] || caption.text}
                onChange={(e) =>
                  handleCaptionChange(caption.id, e.target.value)
                }
                placeholder="Enter Caption Text"
              />
            ))}
            <div className="flex justify-end">
              <Button variant={"outline"} onClick={handleAddCaption}>
                Add Caption
              </Button>
            </div>
          </div>

          <Button onClick={handleDownloadMeme} className="w-full font-semibold">
            Generate Meme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
