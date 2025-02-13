import { createUser, getUserByAddress, updateUser } from "@/lib/queries/dbQueries";
import { generateMockEthereumAddress } from "@/lib/utils";
import { UserAddressSchema, UserSchema } from "@/lib/zod-schemas/user";
import { publicProcedure, router } from "@/server/trpc";
import { getAddress } from "@/lib/chopin-server";

export const userRouter = router({
  createUser: publicProcedure.input(UserAddressSchema).mutation(async ({ input }) => {
    const id = generateMockEthereumAddress();
    const { address } = input;
    if (!address) {
      throw new Error("Address not found");
    }
    
    const newUser = await createUser(id, address);

    return newUser;
  }),

  updateUser: publicProcedure.input(UserSchema).mutation(async ({ input }) => {
    const address = await getAddress();
    const { username } = input;

    if (!address) {
      throw new Error("Address not found");
    }
    const updatedUser = await updateUser(address, username);

    if (!updatedUser.length) {
      throw new Error("User not found");
    }

    return updatedUser[0];
  }),

  fetchUser: publicProcedure
  .input(UserAddressSchema)
  .query(async ({ input }) => {
    const user = await getUserByAddress(input.address);

    if (!user.length) {
      throw new Error("User not found");
    }

    return user[0]; // Return user object
  }),
});
