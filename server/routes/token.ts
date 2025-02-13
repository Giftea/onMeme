import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  createToken,
  mint,
  burn,
  transfer,
  getBalance,
} from "@/lib/queries/dbQueries";
import "dotenv/config";

export const tokenRouter = router({
  createToken: publicProcedure
    .input(
      z.object({
        creatorAddress: z.string().length(42),
        name: z.string(),
        symbol: z.string(),
        decimals: z.number(),
        maxSupply: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await createToken(
        input.creatorAddress,
        input.name,
        input.symbol,
        input.decimals,
        input.maxSupply
      );
    }),

  getBalance: publicProcedure
    .input(z.object({ address: z.string().length(42), tokenId: z.number() }))
    .query(async ({ input }) => getBalance(input.address, input.tokenId)),

  mint: publicProcedure
    .input(
      z.object({
        creatorAddress: z.string().length(42),
        address: z.string().length(42),
        tokenId: z.number(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.creatorAddress !== process.env.PROJECT_OWNER_ADDRESS) {
        throw new Error("Unauthorized");
      }
      return await mint(input.address, input.amount, input.tokenId);
    }),

  burn: publicProcedure
    .input(
      z.object({
        address: z.string().length(42),
        tokenId: z.number(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) =>
      burn(input.address, input.amount, input.tokenId)
    ),

  transfer: publicProcedure
    .input(
      z.object({
        from: z.string().length(42),
        to: z.string().length(42),
        tokenId: z.number(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) =>
      transfer(input.from, input.to, input.amount, input.tokenId)
    ),
});
