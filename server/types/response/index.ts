import { Meme } from "@/lib/types/index";

export type GetMemeTemplateResponse = {
  success: boolean;
  data?: {
    memes: Meme[];
  };
  message?: string;
};

export type FetchUserResponse = {
  address: string;
  username: string;
  id: string;
  createdAt: string | null;
};
