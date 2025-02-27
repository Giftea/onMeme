import { Button } from "../ui/button";

type Props = {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const UploadTemplate = ({ handleImageChange, fileInputRef }: Props) => {
  return (
    <>
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
        variant="outline"
        className="text-sm md:text-base py-5"
      >
        Upload templates
      </Button>
    </>
  );
};

export default UploadTemplate;
