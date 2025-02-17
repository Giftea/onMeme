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
