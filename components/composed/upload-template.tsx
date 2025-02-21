import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadTemplate = ({
  handleImageChange,
  fileInputRef,
  open,
  setOpen,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border p-2 rounded text-sm bg-muted">
        Upload New Template
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload an Image from Device</DialogTitle>
        </DialogHeader>
        <div
          id="dropArea"
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center my-6"
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
            variant={"ghost"}
            className="text-sm md:text-base"
          >
            Select templates
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTemplate;
