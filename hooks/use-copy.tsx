import { useToast } from "./use-toast";


interface UseCopy {
  copyToClipboard: (url: string, successMessage?: string) => void;
}

const useCopy = (): UseCopy => {
  const { toast } = useToast();

  const copyToClipboard = (url: string, successMessage?: string) => {
    if (navigator && url) {
      navigator.clipboard.writeText(url);
      toast({
        title: 'Success',
        description: successMessage ?? 'Link copied!',
        variant: 'success',
      })
    }
  };

  return { copyToClipboard };
};

export default useCopy;
