import { AddressSchemaType } from "../../lib/types";
import {
  createUser,
  getUserByAddress,
  updateUser,
} from "@/lib/database/dbQueries";
import { generateMockEthereumAddress } from "@/lib/utils";
import { UserAddressSchema, UserSchema } from "@/lib/types";
import { publicProcedure, router } from "@/server/trpc";
import { getAddress } from "@/lib/chopin/chopin-server";
import { FetchUserResponse } from "../types/response";
import { TRPCError } from "@trpc/server";

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

      return user[0] as FetchUserResponse;
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

  const newUser = await createUser(id, address);

  return newUser;
}
