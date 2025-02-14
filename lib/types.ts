import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, memes, templates, likes, nfts } from "@/lib/db/schema";

// 🔹 User Types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// 🔹 Meme Types
export type Meme = InferSelectModel<typeof memes>;
export type NewMeme = InferInsertModel<typeof memes>;

// 🔹 Template Types
export type Template = InferSelectModel<typeof templates>;
export type NewTemplate = InferInsertModel<typeof templates>;

// 🔹 Likes Types
export type Like = InferSelectModel<typeof likes>;
export type NewLike = InferInsertModel<typeof likes>;

export interface UserType {
  username: string;
  address: string;
  id: string;
  createdAt: string | null;
}

export interface Memes {
  id: number;
  createdAt: string | null;
  ownerId: string;
  templateId: number | null;
  imageUrl: string;
  isPublic: boolean | null;
}

export type NFT = {
  id: number;
  token: string;
  owner: string;
  mintedAt: string | null;
  metadata?: {
    name: string;
    description: string;
    image: string;
    price: string;
  };
};

export interface ListedNFT {
  status: "listed" | "sold" | "cancelled";
  seller: string;
  nftId: number;
  price: number;
  id: number;
  listedAt: string | null;
  metadata?: {
    name: string;
    description: string;
    image: string;
    price: string;
  };
}
