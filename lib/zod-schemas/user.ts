import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 character long" }),
  address: z.string().optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
