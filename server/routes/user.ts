import { AddressSchemaType } from "../../lib/types";
import {
  createUser,
  getUserByAddress,
  updateUser,
} from "@/lib/database/dbQueries";
import { generateMockEthereumAddress } from "@/lib/utils";
import { UserAddressSchema, UserSchema } from "@/lib/types";
import { publicProcedure, router } from "@/server/trpc";
import { FetchUserResponse } from "../types/response";
import { TRPCError } from "@trpc/server";
import { getAddress } from "@chopinframework/next";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";

export const userRouter = router({
  updateUser: publicProcedure.input(UserSchema).mutation(async ({ input }) => {
    const address = await getAddress();
    const { username } = input;

    if (!address) {
      throw new Error("Address not found");
    }
    const updatedUser = await updateUser(address, username);

    if (!updatedUser.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return updatedUser[0];
  }),

  fetchUser: publicProcedure
    .input(UserAddressSchema)
    .query(async ({ input }) => {
      const { address, initAccount } = input;
      const user = await getUserByAddress(address);

      if (initAccount && !user[0]) {
        await createUserAccount(address);
      }

      if (!user.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const avatar = createAvatar(croodles, {
        size: 128,
        seed: user[0].address || "default",
      }).toDataUri();

      const userData = {
        ...user[0],
        avatar,
      };

      return userData as FetchUserResponse & { avatar: string };
    }),
});

export async function createUserAccount(address?: AddressSchemaType) {
  const id = generateMockEthereumAddress();
  if (!address) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Address not found",
    });
  }

  const newUser = await createUser(id, address, '');

  return newUser;
}
