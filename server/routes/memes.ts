import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  getAllMemes,
  getMemesByOwner,
  createMeme,
} from "@/lib/queries/dbQueries";
import { TRPCError } from "@trpc/server";

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

  fetchMemes: publicProcedure.query(async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      // if (!response.ok) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "failed to fetch memes",
      //   });
      // }
      const data = await response.json();
      console.log("response=======================", data);

      return data.data.memes;
    } catch(err: unknown) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch memes",
        cause: err as Error,
      });
    }
  }),
});
