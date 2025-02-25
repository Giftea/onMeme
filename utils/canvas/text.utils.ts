import { TextElement } from "../../lib/types/index";

export const drawText = (
  ctx: CanvasRenderingContext2D,
  element: TextElement,
  selectedTextId: string | null
) => {
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

export const getTextDimensions = (
  text: string,
  fontSize: number,
  fontFamily: string,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>
): {
  width: number;
  height: number;
} => {
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
export const keepTextInBounds = (
  x: number,
  y: number,
  text: string,
  fontSize: number,
  fontFamily: string,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  image: HTMLImageElement
): { x: number; y: number } => {
  if (!image) return { x, y };

  const { width, height } = getTextDimensions(
    text,
    fontSize,
    fontFamily,
    ctxRef
  );

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

export const handleTextDragMove = (
  e: React.MouseEvent,
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  textElements: TextElement[],
  image: HTMLImageElement | null,
  dragStartPosRef: React.RefObject<{ x: number; y: number }>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  setTextElements: React.Dispatch<React.SetStateAction<TextElement[]>>,
  updatePreview: () => void
) => {
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
    draggingElement.fontFamily,
    ctxRef,
    image
  );

  // Update element position
  setTextElements((prev) =>
    prev.map((t) => (t.id === draggingElement.id ? { ...t, x, y } : t))
  );

  // Update preview immediately for smooth dragging
  updatePreview();
};
