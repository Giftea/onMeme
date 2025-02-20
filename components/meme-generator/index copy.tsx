"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";
// import { convertImageToBase64 } from "@/lib/utils";
import { preventDefaults } from "@/utils/prevent-default.utils";
import NextImage from "next/image";
import { convertImageToBase64 } from "@/lib/utils";

type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  strokeColor: string;
  fontFamily: string;
  isDragging: boolean;
}

interface StatusMessage {
  message: string;
  type: "success" | "error" | "info" | "";
}

export default function MemeGeneratorX() {
  const [defaultFontSize, setDefaultFontSize] = useState<number>(40);
  const [defaultFontColor, setDefaultFontColor] = useState<string>("#ffffff");
  const [defaultStrokeColor, setDefaultStrokeColor] =
    useState<string>("#000000");
  const [defaultFontFamily, setDefaultFontFamily] = useState<string>("Impact");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusMessage>({
    message: "",
    type: "",
  });
  const [memeUrl, setMemeUrl] = useState<string>("");

  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplate, setShowTemplate] = useState(false);

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
      fontSize: 40,
      fontColor: "#ffffff",
      strokeColor: "#000000",
      fontFamily: "Impact",
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
      const memesx = memes.length > 0 ? memes[0] : null;

      if (!memesx) return;
      convertImageToBase64(memesx.url, function (base64) {
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
          console.log("result", result);

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
        fontSize: defaultFontSize,
        fontColor: defaultFontColor,
        strokeColor: defaultStrokeColor,
        fontFamily: defaultFontFamily,
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

  // Calculate text dimensions
  const getTextDimensions = (
    text: string,
    fontSize: number,
    fontFamily: string
  ): { width: number; height: number } => {
    if (!ctxRef.current) return { width: 0, height: 0 };

    ctxRef.current.save();
    ctxRef.current.font = `${fontSize}px ${fontFamily}`;
    const metrics = ctxRef.current.measureText(text);
    ctxRef.current.restore();

    // Approximate height as fontSize since measureText doesn't provide height directly
    return {
      width: metrics.width,
      height: fontSize,
    };
  };

  // Enforce boundaries when moving text
  const keepTextInBounds = (
    x: number,
    y: number,
    text: string,
    fontSize: number,
    fontFamily: string
  ): { x: number; y: number } => {
    if (!image) return { x, y };

    const { width, height } = getTextDimensions(text, fontSize, fontFamily);

    // Add padding to prevent text from touching the edges
    const padding = 10;

    // Constrain x position to keep text within image bounds
    const minX = width / 2 + padding;
    const maxX = image.width - width / 2 - padding;
    const boundedX = Math.max(minX, Math.min(maxX, x));

    // Constrain y position to keep text within image bounds
    const minY = height / 2 + padding;
    const maxY = image.height - height / 2 - padding;
    const boundedY = Math.max(minY, Math.min(maxY, y));

    return { x: boundedX, y: boundedY };
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

  const handleTextDragMove = (e: React.MouseEvent) => {
    if (!image || !previewCanvasRef.current) return;

    const draggingElement = textElements.find((t) => t.isDragging);
    if (!draggingElement) return;

    const canvas = previewCanvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Calculate new position
    const rawX =
      (e.clientX - rect.left) * (image.width / canvas.offsetWidth) -
      dragStartPosRef.current.x;
    const rawY =
      (e.clientY - rect.top) * (image.height / canvas.offsetHeight) -
      dragStartPosRef.current.y;

    // Enforce boundaries
    const { x, y } = keepTextInBounds(
      rawX,
      rawY,
      draggingElement.text,
      draggingElement.fontSize,
      draggingElement.fontFamily
    );

    // Update element position
    setTextElements((prev) =>
      prev.map((t) => (t.id === draggingElement.id ? { ...t, x, y } : t))
    );

    // Update preview immediately for smooth dragging
    updatePreview();
  };

  const handleTextDragEnd = () => {
    setTextElements((prev) =>
      prev.map((t) => (t.isDragging ? { ...t, isDragging: false } : t))
    );
  };

  // Drawing functions
  const drawText = (ctx: CanvasRenderingContext2D, element: TextElement) => {
    ctx.save();
    ctx.font = `${element.fontSize}px ${element.fontFamily}`;
    ctx.fillStyle = element.fontColor;
    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.fontSize / 10;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the text stroke first, then fill
    ctx.strokeText(element.text, element.x, element.y);
    ctx.fillText(element.text, element.x, element.y);

    // Draw selection indicator if this text is selected
    if (element.id === selectedTextId) {
      const metrics = ctx.measureText(element.text);
      const textHeight = element.fontSize;
      const textWidth = metrics.width;

      ctx.strokeStyle = "#00B2FF";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        element.x - textWidth / 2 - 10,
        element.y - textHeight / 2 - 10,
        textWidth + 20,
        textHeight + 20
      );
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const updatePreview = () => {
    if (!image || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Store context reference for text measurement
    if (!ctxRef.current) {
      ctxRef.current = ctx;
    }

    // Calculate canvas dimensions while maintaining aspect ratio
    const containerWidth = canvas.parentElement?.offsetWidth || 800;
    const scale = containerWidth / image.width;
    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    canvas.width = image.width;
    canvas.height = image.height;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Draw image
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Draw text elements
    textElements.forEach((element) => {
      if (element.text) {
        // Ensure text is within bounds when drawing
        const { x, y } = keepTextInBounds(
          element.x,
          element.y,
          element.text,
          element.fontSize,
          element.fontFamily
        );

        // Only update position if it changed (to avoid re-renders)
        if (x !== element.x || y !== element.y) {
          setTextElements((prev) =>
            prev.map((t) => (t.id === element.id ? { ...t, x, y } : t))
          );
        }

        // Draw with bounded coordinates
        const boundedElement = { ...element, x, y };
        drawText(ctx, boundedElement);
      }
    });
  };

  // Download meme
  const downloadMeme = (url: string) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "meme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Main function to generate the final meme
  const generateMeme = () => {
    if (!image || !canvasRef.current) {
      setStatus({ message: "Please upload an image first", type: "error" });
      return;
    }

    setIsLoading(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setStatus({ message: "Canvas context not available", type: "error" });
      setIsLoading(false);
      return;
    }

    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Draw text elements
    textElements.forEach((element) => {
      if (element.text) {
        // Ensure text is within bounds when generating final meme
        const { x, y } = keepTextInBounds(
          element.x,
          element.y,
          element.text,
          element.fontSize,
          element.fontFamily
        );

        const boundedElement = { ...element, x, y };
        drawText(ctx, boundedElement);
      }
    });

    // Convert canvas to URL
    try {
      const url = canvas.toDataURL("image/png");
      setMemeUrl(url);
      setStatus({ message: "Meme generated successfully", type: "success" });
      downloadMeme(url);
    } catch (err: unknown) {
      setStatus({ message: `Error generating meme: ${err}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTemplate = () => {
    setShowTemplate(!showTemplate);
  };

  // FETCH MEMES
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
        handleTextDragMove(e as unknown as React.MouseEvent);
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
    <Card className="p-6 my-6">
      <div className="flex justify-between">
        <CardTitle className="text-2xl">Meme Generator</CardTitle>
        <Button onClick={handleNewTemplate} className="">
          Upload new template
        </Button>
      </div>

      <CardContent className="grid grid-cols-2 gap-x-4 p-0 mt-5">
        <div className="relative mt-6">
          <div className="relative overflow-hidden aspect-auto h-fit w-fit rounded">
            <canvas
              ref={previewCanvasRef}
              className="cursor-move max-w-full border w-full h-80 shadow-lg "
              onMouseDown={(e) => {
                if (!image || !previewCanvasRef.current) return;

                const canvas = previewCanvasRef.current;
                const rect = canvas.getBoundingClientRect();
                const x =
                  (e.clientX - rect.left) *
                  ((image as HTMLImageElement).width / canvas.offsetWidth);
                const y =
                  (e.clientY - rect.top) *
                  ((image as HTMLImageElement).height / canvas.offsetHeight);

                let closestText: TextElement | null = null;
                let minDistance = Number.MAX_VALUE;

                textElements.forEach((t) => {
                  if (t.text) {
                    const distance = Math.sqrt(
                      Math.pow(t.x - x, 2) + Math.pow(t.y - y, 2)
                    );
                    if (distance < minDistance) {
                      minDistance = distance;
                      closestText = t;
                    }
                  }
                });

                if (
                  closestText &&
                  minDistance < (closestText as TextElement).fontSize * 2
                ) {
                  if (closestText) {
                    handleTextDragStart((closestText as TextElement).id, e);
                  }
                } else {
                  setSelectedTextId(null);
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Click and drag text to reposition it
            </p>
          </div>

          {showTemplate && (
            <div
              id="dropArea"
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:bg-gray-50 transition-colors my-6"
            >
              <p className="text-sm md:text-base text-gray-500 mb-2">
                Drag & drop an image here or click to select
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="imageInput"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded hover:bg-blue-600 transition-colors"
              >
                Select template
              </Button>
            </div>
          )}
        </div>

        <div>
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
                      <NextImage
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

          {/* Text Elements Section */}
          <div className="border rounded-lg p-4 my-3 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Text Elements</h2>
              <button
                onClick={addNewTextField}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                + Add Text
              </button>
            </div>

            <div className="space-y-4 max-h-80 md:max-h-96 overflow-y-auto pr-1">
              {textElements.map((textElement, index) => (
                <div
                  key={textElement.id}
                  className={`p-3 border rounded ${
                    textElement.id === selectedTextId
                      ? "border-blue-400 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setSelectedTextId(textElement.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Text #{index + 1}</h3>
                    {index > 0 && (
                      <button
                        onClick={() => removeTextField(textElement.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={textElement.text}
                    onChange={(e) =>
                      updateTextField(textElement.id, "text", e.target.value)
                    }
                    placeholder="Enter text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Font Size: {textElement.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="120"
                        value={textElement.fontSize}
                        onChange={(e) =>
                          updateTextField(
                            textElement.id,
                            "fontSize",
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Font Family:
                      </label>
                      <select
                        value={textElement.fontFamily}
                        onChange={(e) =>
                          updateTextField(
                            textElement.id,
                            "fontFamily",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Impact">Impact</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                        <option value="Times New Roman">Times New Roman</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Font Color:
                      </label>
                      <input
                        type="color"
                        value={textElement.fontColor}
                        onChange={(e) =>
                          updateTextField(
                            textElement.id,
                            "fontColor",
                            e.target.value
                          )
                        }
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Stroke Color:
                      </label>
                      <input
                        type="color"
                        value={textElement.strokeColor}
                        onChange={(e) =>
                          updateTextField(
                            textElement.id,
                            "strokeColor",
                            e.target.value
                          )
                        }
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          )}

          <Button onClick={generateMeme} className="w-full font-semibold">
            Generate Meme
          </Button>

          {status.message && (
            <div
              className={`p-3 rounded ${
                status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : status.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {status.message}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
