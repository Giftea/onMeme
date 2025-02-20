import React from "react";
import { Button } from "../ui/button";

type Props = {
  showTemplate: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const UploadTemplate = ({
  showTemplate,
  handleImageChange,
  fileInputRef,
}: Props) => {
  return (
    <React.Fragment>
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
            Select templates
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default UploadTemplate;
