import { z } from "zod";

export const UserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 character long" }),
});

// Define input validation schema
export const UserAddressSchema = z.object({
  address: z.string().length(42),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
