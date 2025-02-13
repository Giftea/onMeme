import { z } from "zod";

export const MintNFTSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
  description: z.string().optional(),
  price: z
    .string({ message: "Add a price" }),
});

export type MintNFTSchemaType = z.infer<typeof MintNFTSchema>;
