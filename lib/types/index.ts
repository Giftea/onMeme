import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, likes } from "@/lib/database/schema";
import { z } from "zod";

export const MintNFTSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
  description: z.string().optional(),
});

export type MintNFTSchemaType = z.infer<typeof MintNFTSchema>;

// Listing schema
export const ListingSchema = z.object({
  price: z.string().min(1),
});

export type ListingSchemaType = z.infer<typeof ListingSchema>;

export const UserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 character long" }),
});

export const AddressSchema = z.string().length(42);

// Define input validation schema
export const UserAddressSchema = z.object({
  address: AddressSchema,
  initAccount: z.boolean().default(false),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type AddressSchemaType = z.infer<typeof AddressSchema>;

// 🔹 User Types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

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
  ownerId?: string;
  ownerAddress: string;
  templateId: string;
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

export interface NftMetaData {
  name: string;
  image: string;
  price: number;
  description: string;
}

export interface ListedNFT {
  listingId: number;
  price: number;
  status: "listed" | "sold" | "cancelled";
  listedAt: string | null;
  nftId: number;
  nftToken: string;
  nftMetadata: NftMetaData;
  sellerId: string;
  sellerAddress: string;
  sellerUsername: string;
}

export type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  strokeColor: string;
  fontFamily: string;
  isDragging: boolean;
}

export interface StatusMessage {
  message: string;
  type: "success" | "error" | "info" | "";
}
