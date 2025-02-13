import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  getAllMemes,
  getMemesByOwner,
  createMeme,
  getLikesForMeme,
  likeMeme,
} from "@/lib/queries/dbQueries";

export const memeRouter = router({
  // Get all memes
  getAllMemes: publicProcedure.query(async () => {
    return await getAllMemes();
  }),

  // Get memes by user
  getMemesByOwner: publicProcedure
    .input(z.object({ ownerId: z.string() }))
    .query(async ({ input }) => {
      return await getMemesByOwner(input.ownerId);
    }),

  // Create a new meme
  createMeme: publicProcedure
    .input(
      z.object({
        ownerId: z.string().length(42),
        templateId: z.number(),
        imageUrl: z.string().url(),
        isPublic: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      return await createMeme(
        input.ownerId,
        input.templateId,
        input.imageUrl,
        input.isPublic
      );
    }),

  // Get all likes for a meme
  getLikesForMeme: publicProcedure
    .input(z.object({ memeId: z.number() }))
    .query(async ({ input }) => {
      return await getLikesForMeme(input.memeId);
    }),

  // Like a meme
  likeMeme: publicProcedure
    .input(z.object({ memeId: z.number(), userId: z.string().length(42) }))
    .mutation(async ({ input }) => {
      return await likeMeme(input.memeId, input.userId);
    }),
});
