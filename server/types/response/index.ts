import { Meme } from "@/lib/types/index";

export type GetMemeTemplateResponse = {
  success: boolean;
  data?: {
    memes: Meme[];
  };
  message?: string;
};
