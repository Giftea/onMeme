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

export type GenerateAiMemeResponse = {
  success: boolean;
  data?: {
    texts: string[];
    template_id: 131087935;
    url: string;
    page_url: string;
  };
};
