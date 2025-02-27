"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { preventDefaults } from "@/lib/utils/canvas/prevent-default.utils";
import { convertImageToBase64 } from "@/lib/utils";
import UploadTemplate from "../composed/upload-template";
import Canvas from "../composed/canvas";
import MemeSelection from "../composed/meme-selection";
import MemeCaptionInput from "../composed/meme-caption-input";
import Status from "../composed/status";
import { handleTextDragMove } from "@/lib/utils/canvas/text.utils";
import {
  generateCanvas,
  updatePreviewCanvas,
} from "@/lib/utils/canvas/generate-canvas.utils.";
import { config } from "@/config/font.config";
import { Meme, StatusMessage, TextElement } from "@/lib/types/index";
import { trpc } from "@/lib/utils/trpc.utils";
import { toast } from "@/hooks/use-toast";
import LoadSkeleton from "../skeleton";
import MemeGeneratorSkeleton from "../skeleton/meme-generator.skeleton";
import IsLoading from "../composed/loader";
import MemeGeneratedModal from "../modals/meme-generated-modal";
import { useAddress } from "@chopinframework/react";
import AiMemeGenerator from "../modals/ai-meme-generator";
import { uploadToIpfs } from "@/lib/utils/ipfs.utils";

export default function MemeGeneratorX() {
  const { address } = useAddress();
  const trpcUtils = trpc.useUtils();
  const { data: memeData, isLoading: loading } =
    trpc.meme.fetchMemes.useQuery();
  const { mutateAsync: createMeme, isPending } =
    trpc.meme.createMeme.useMutation({
      onSuccess: () => {
        trpcUtils.meme.getMemesByOwner.invalidate();
        toast({
          variant: "success",
          title: "Success",
          description: "Meme Successfully Generated! 😎",
        });
        setOpenMemeGeneratedModal(true);
        setIsLoading(false);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate meme! 😞",
        });
      },
    });

  const memes = memeData ?? [];

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openMemeGeneratedModal, setOpenMemeGeneratedModal] = useState(false);
  const [status, setStatus] = useState<StatusMessage>({
    message: "",
    type: "",
  });
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedMemeId = searchParams.get("meme");
  const selectedMeme =
    memes.find((meme) => {
      return meme.id === selectedMemeId;
    }) || null;

  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: "text-1",
      text: "",
      x: 0,
      y: 0,
      fontSize: config.defaultFontSize,
      fontColor: config.defaultFontColor,
      strokeColor: config.defaultStrokeColor,
      fontFamily: config.defaultFontFamily,
      isDragging: false,
    },
  ]);

  // REFS
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    function getSelectedMeme() {
      if (!selectedMeme) return;
      convertImageToBase64(selectedMeme.url, function (base64) {
        const patchTo64 = "data:image/jpeg;base64," + base64;

        const img = new Image();
        img.onload = () => {
          // Initialize text element positions
          setTextElements((texts) =>
            texts.map((text, index) => ({
              ...text,
              x: img.width / 2,
              y: index === 0 ? 50 : img.height - 50,
            }))
          );
          if (previewCanvasRef.current) {
            const ctx = previewCanvasRef.current.getContext("2d");
            if (ctx) {
              ctxRef.current = ctx;
            }
          }
          updatePreview();
        };
        img.src = patchTo64;
        setImage(img);
      });
    }

    function getMeme() {
      const memes_ = memes.length > 0 ? memes[0] : null;

      if (!memes_) return;
      convertImageToBase64(memes_.url, function (base64) {
        const patchTo64 = "data:image/jpeg;base64," + base64;

        const img = new Image();
        img.onload = () => {
          // Initialize text element positions
          setTextElements((texts) =>
            texts.map((text, index) => ({
              ...text,
              x: img.width / 2,
              y: index === 0 ? 50 : img.height - 50,
            }))
          );
          if (previewCanvasRef.current) {
            const ctx = previewCanvasRef.current.getContext("2d");
            if (ctx) {
              ctxRef.current = ctx;
            }
          }
          updatePreview();
        };
        img.src = patchTo64;
        setImage(img);
      });
    }

    if (!selectedMeme) {
      getMeme();
    }

    getSelectedMeme();
  }, [selectedMeme, memes]);

  const handleMemeClick = (meme: Meme) => {
    router.push(`?meme=${meme.id}`, { scroll: false });
  };

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const img = new Image();
          img.onload = () => {
            setImage(img);
            // Initialize text element positions
            setTextElements((texts) =>
              texts.map((text, index) => ({
                ...text,
                x: img.width / 2,
                y: index === 0 ? 50 : img.height - 50,
              }))
            );
            if (previewCanvasRef.current) {
              const ctx = previewCanvasRef.current.getContext("2d");
              if (ctx) {
                ctxRef.current = ctx;
              }
            }
            updatePreview();
          };
          img.src = result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle text elements
  const addNewTextField = () => {
    const newId = `text-${textElements.length + 1}`;
    const yPos = image ? image.height / 2 + textElements.length * 50 : 0;

    setTextElements([
      ...textElements,
      {
        id: newId,
        text: "",
        x: image ? image.width / 2 : 0,
        y: yPos,
        fontSize: config.defaultFontSize,
        fontColor: config.defaultFontColor,
        strokeColor: config.defaultStrokeColor,
        fontFamily: config.defaultFontFamily,
        isDragging: false,
      },
    ]);
  };

  const removeTextField = (id: string) => {
    setTextElements(textElements.filter((t) => t.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const updateTextField = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setTextElements(
      textElements.map((t) => {
        if (t.id === id) {
          return { ...t, [field]: value };
        }
        return t;
      })
    );
  };

  // Drag and drop functionality for image upload
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer?.files[0];
    if (file && file.type.match("image.*")) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleImageChange({
          target: { files: dataTransfer.files },
        } as ChangeEvent<HTMLInputElement>);
      }
    }
  };

  // Text dragging functionality
  const handleTextDragStart = (id: string, e: React.MouseEvent) => {
    if (!image || !previewCanvasRef.current) return;

    setSelectedTextId(id);
    const canvas = previewCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const elementIndex = textElements.findIndex((t) => t.id === id);

    if (elementIndex !== -1) {
      // Calculate mouse position relative to canvas
      const x = (e.clientX - rect.left) * (image.width / canvas.offsetWidth);
      const y = (e.clientY - rect.top) * (image.height / canvas.offsetHeight);

      // Get selected text element
      const element = textElements[elementIndex];
      dragStartPosRef.current = { x: x - element.x, y: y - element.y };

      // Update dragging state
      setTextElements((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isDragging: true } : t))
      );
    }
  };

  const handleTextDragEnd = () => {
    setTextElements((prev) =>
      prev.map((t) => (t.isDragging ? { ...t, isDragging: false } : t))
    );
  };

  const updatePreview = () => {
    updatePreviewCanvas(
      image,
      textElements,
      ctxRef,
      setTextElements,
      selectedTextId,
      previewCanvasRef
    );
  };

  // Main function to generate the final meme // generateCanvas
  const generateMeme = async () => {
    if (!image || !canvasRef.current) {
      toast({
        variant: "destructive",
        title: `Please upload an image first! `,
      });
      return;
    }

    setIsLoading(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    generateCanvas(canvas, image, ctx, textElements, selectedTextId);

    if (!ctx) {
      setStatus({ message: "Canvas context not available", type: "error" });
      setIsLoading(false);
      return;
    }
    // Add text watermark
    const watermarkText = "made on on-meme.vercel.app";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeText(watermarkText, 20, canvas.height - 20);
    ctx.fillStyle = "white";
    ctx.fillText(watermarkText, 20, canvas.height - 20);

    // Convert canvas to URL
    try {
      const url = canvas.toDataURL("image/png");

      const ipfsUrl = await uploadToIpfs(url);

      if (ipfsUrl) {
        const img = new Image();
        img.src = ipfsUrl;

        img.onload = () => {
          setMemeImage(ipfsUrl);
        };
      }

      if (ipfsUrl && !address) {
        setOpenMemeGeneratedModal(true);
        setIsLoading(false);
        return;
      }

      if (ipfsUrl && address) {
        await createMeme({
          ownerAddress: address,
          imageUrl: ipfsUrl,
          templateId: String(selectedMemeId),
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to upload meme to IPFS! 😞 ${e}`,
      });
    }
  };

  // Update preview whenever text elements change
  useEffect(() => {
    if (image) {
      updatePreview();
    }
  }, [textElements, image, selectedTextId]);

  // Set up event listeners for drag and drop
  useEffect(() => {
    const dropArea = document.getElementById("dropArea");
    if (!dropArea) return;

    const events = ["dragenter", "dragover", "dragleave", "drop"];

    events.forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults as EventListener);
    });

    dropArea.addEventListener("drop", handleDrop as EventListener);

    return () => {
      events.forEach((eventName) => {
        dropArea.removeEventListener(
          eventName,
          preventDefaults as EventListener
        );
      });

      dropArea.removeEventListener("drop", handleDrop as EventListener);
    };
  }, []);

  // Set up mouse event listeners for text dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (textElements.some((t) => t.isDragging)) {
        return handleTextDragMove(
          e as unknown as React.MouseEvent,
          previewCanvasRef,
          textElements,
          image,
          dragStartPosRef,
          ctxRef,
          setTextElements,
          updatePreview
        );
      }
    };

    const handleMouseUp = () => {
      handleTextDragEnd();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [textElements]);

  return (
    <LoadSkeleton skeleton={MemeGeneratorSkeleton} enabled={loading}>
      <Card className="p-6 my-6">
        <div className="flex flex-col md:flex-row w-fit md:w-full gap-2 justify-between">
          <CardTitle className="text-2xl">Meme Generator</CardTitle>

          <div className="flex justify-center items-center gap-4">
            <AiMemeGenerator address={address} />
            <UploadTemplate
              handleImageChange={handleImageChange}
              fileInputRef={fileInputRef}
            />
          </div>
        </div>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 p-0 mt-5">
          <div className="relative mt-6">
            <Canvas
              previewCanvasRef={previewCanvasRef}
              handleTextDragStart={handleTextDragStart}
              image={image}
              setSelectedTextId={setSelectedTextId}
              textElements={textElements}
            />
          </div>
          <div>
            <MemeSelection
              loading={loading}
              handleMemeClick={handleMemeClick}
              memes={memes}
              selectedMeme={selectedMeme}
              selectedMemeId={selectedMemeId}
            />

            <MemeCaptionInput
              addNewTextField={addNewTextField}
              removeTextField={removeTextField}
              textElements={textElements}
              updateTextField={updateTextField}
            />

            <Button
              onClick={generateMeme}
              disabled={isLoading || isPending}
              className="w-full font-semibold"
            >
              {isLoading || isPending ? <IsLoading /> : "Generate Meme"}
            </Button>

            {/*
          @Todo:
          - Replace the status component with a toast to display status messages
          */}
            <Status status={status} />

            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        </CardContent>
      </Card>
      <MemeGeneratedModal
        memeImage={memeImage}
        open={openMemeGeneratedModal}
        setOpen={setOpenMemeGeneratedModal}
      />
    </LoadSkeleton>
  );
}
