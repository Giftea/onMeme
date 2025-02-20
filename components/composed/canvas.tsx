import { TextElement } from "@/lib/types/index";
import React from "react";

type Props = {
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  image: HTMLImageElement | null;
  textElements: TextElement[];
  setSelectedTextId: React.Dispatch<React.SetStateAction<string | null>>;
  handleTextDragStart: (
    id: string,
    e: React.MouseEvent<HTMLCanvasElement>
  ) => void;
};

const Canvas = ({
  previewCanvasRef,
  image,
  textElements,
  handleTextDragStart,
  setSelectedTextId,
}: Props) => {
  return (
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
  );
};

export default Canvas;
