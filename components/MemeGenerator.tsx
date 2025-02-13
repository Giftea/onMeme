"use client";

// import { useEffect, useRef, useState } from "react";
// import * as fabric from "fabric";
import { Card } from "@/components/ui/card";

const MemeGenerator = () => {
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  // useEffect(() => {
  //   if (!canvasRef.current) return;

  //   const canvas = new fabric.Canvas(canvasRef.current, {
  //     backgroundColor: "#fff",
  //     width: 500,
  //     height: 500,
  //   });

  //   setFabricCanvas(canvas);

  //   return () => {
  //     canvas.dispose();
  //     setFabricCanvas(null);
  //   };
  // }, []);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!fabricCanvas) return;

  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     if (!e.target?.result) return;

  //     fabric.Image.fromURL(e.target.result as string, (img) => {
  //       fabricCanvas.add(img);

  //       if (img.width && img.width > fabricCanvas.width!) {
  //         img.scaleToWidth(fabricCanvas.width!);
  //       }

  //       fabricCanvas.renderAll();
  //     });
  //   };

  //   reader.readAsDataURL(file);
  // };

  // const handleAddText = () => {
  //   if (!fabricCanvas) return;

  //   const text = new fabric.IText("Click to Edit", {
  //     left: 100,
  //     top: 100,
  //     fontSize: 20,
  //     fill: "#000",
  //     fontFamily: "Arial",
  //     editable: true,
  //   });

  //   fabricCanvas.add(text);
  //   text.bringToFront();
  //   fabricCanvas.setActiveObject(text);
  //   fabricCanvas.renderAll();
  // };

  // const handleSave = () => {
  //   if (!fabricCanvas) return;

  //   const data = fabricCanvas.toDataURL();
  //   const link = document.createElement("a");
  //   link.href = data;
  //   link.download = "meme.png";
  //   link.click();
  // };

  return (
    <Card className="  p-6 my-6">
      <div></div>
      {/* <div className="flex">
        <div className="border bg-white">
          <canvas ref={canvasRef} className="border" />
        </div>
        <div className="bg-white/10 ml-4 p-4 rounded-md w-64">
          <p className="mb-2">Add Image</p>
          <input type="file" onChange={handleFileChange} className="mb-2" />
          <button
            onClick={handleAddText}
            className="w-full bg-blue-500 text-white p-2 mt-2 rounded-md"
          >
            Add Editable Text
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white p-2 mt-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div> */}
    </Card>
  );
};

export default MemeGenerator;
