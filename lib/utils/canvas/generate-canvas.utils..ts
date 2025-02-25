import { TextElement } from "@/lib/types/index";
import { drawText, keepTextInBounds } from "./text.utils";

export const generateCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  ctx: CanvasRenderingContext2D | null,
  textElements: TextElement[],
  selectedTextId: string | null
) => {
  if (!ctx) return;
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
        element.fontFamily,
        { current: null },
        image
      );

      const boundedElement = { ...element, x, y };
      drawText(ctx, boundedElement, selectedTextId);
    }
  });
};

export const updatePreviewCanvas = (
  image: HTMLImageElement | null,
  textElements: TextElement[],
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  setTextElements: React.Dispatch<React.SetStateAction<TextElement[]>>,
  selectedTextId: string | null,
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
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
        element.fontFamily,
        ctxRef,
        image
      );

      // Only update position if it changed (to avoid re-renders)
      if (x !== element.x || y !== element.y) {
        setTextElements((prev) =>
          prev.map((t) => (t.id === element.id ? { ...t, x, y } : t))
        );
      }

      // Draw with bounded coordinates
      const boundedElement = { ...element, x, y };
      drawText(ctx, boundedElement, selectedTextId);
    }
  });
};
