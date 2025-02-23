import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  getAllNFTs,
  getNFTByID,
  getNFTsByOwner,
  isMemeMinted,
  mintNFT,
} from "@/lib/queries/dbQueries";
import { NFT } from "@/lib/types";

export const nftRouter = router({
  // Get all NFTs
  getAllNFTs: publicProcedure.query(async () => {
    return await getAllNFTs();
  }),

  getNFTByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getNFTByID(input.id);
    }),

  // Get NFTs owned by a specific user
  getNFTsByOwner: publicProcedure
    .input(z.object({ owner: z.string().length(42) }))
    .query(async ({ input }) => {
      return (await getNFTsByOwner(input.owner)) as NFT[];
    }),

  // Mint a new NFT
  mintNFT: publicProcedure
    .input(
      z.object({
        owner: z.string().length(42),
        metadata: z.record(z.any()),
        memeId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await mintNFT(input.owner, input.metadata, input.memeId);
    }),

  checkMemeMinted: publicProcedure
    .input(z.object({ memeId: z.number() }))
    .query(async ({ input }) => {
      return await isMemeMinted(input.memeId);
    }),
});
