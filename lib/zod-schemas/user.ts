import { z } from "zod";

export const UserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 character long" }),
});

export const AddressSchema = z.string().length(42)

// Define input validation schema
export const UserAddressSchema = z.object({
  address: AddressSchema,
  initialAddress: z.string().optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type AddressSchemaType = z.infer<typeof AddressSchema>;
