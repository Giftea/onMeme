import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  getAllMemes,
  getMemesByOwner,
  createMeme,
  getMemeByID,
} from "@/lib/database/dbQueries";
import { TRPCError } from "@trpc/server";
import {
  GenerateAiMemeResponse,
  GetMemeTemplateResponse,
} from "../types/response";
import { BLANK_MEME_TEMPLATE } from "@/config/meme.config";
import { uploadToIpfs } from "@/lib/utils/ipfs.utils";
import { addWatermark } from "@/lib/utils/image.utlis";

export const memeRouter = router({
  // Get all memes
  getAllMemes: publicProcedure.query(async () => {
    return await getAllMemes();
  }),

  // Get memes by user
  getMemesByOwner: publicProcedure
    .input(z.object({ ownerAddress: z.string() }))
    .query(async ({ input }) => {
      return await getMemesByOwner(input.ownerAddress);
    }),

  getMemeByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getMemeByID(input.id);
    }),

  // Create a new meme
  createMeme: publicProcedure
    .input(
      z.object({
        ownerAddress: z.string(),
        templateId: z.string(),
        imageUrl: z.string().url(),
        isPublic: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      return await createMeme(
        input.ownerAddress,
        input.templateId,
        input.imageUrl,
        input.isPublic
      );
    }),

  fetchMemes: publicProcedure.query(async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "failed to fetch memes",
        });
      }
      const data = (await response.json()) as GetMemeTemplateResponse;

      const joinTemplates = [BLANK_MEME_TEMPLATE, ...(data.data?.memes ?? [])];

      return joinTemplates;
    } catch (err: unknown) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch memes",
        cause: err as Error,
      });
    }
  }),
  fetchAiMemes: publicProcedure.query(async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "failed to fetch memes",
        });
      }
      const data = (await response.json()) as GetMemeTemplateResponse;

      const defaultData = data.data?.memes ?? [];

      return defaultData;
    } catch (err: unknown) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch memes",
        cause: err as Error,
      });
    }
  }),
  generateAiMeme: publicProcedure
    .input(
      z.object({
        template_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { template_id } = input;

      const payload = new URLSearchParams();
      payload.append("username", process.env.IMGFLIP_USERNAME!);
      payload.append("password", process.env.IMGFLIP_PASSWORD!);
      payload.append("model", "classic");
      payload.append("prefix_text", "");
      payload.append("template_id", template_id);
      payload.append("no_watermark", "true");

      try {
        const response = await fetch("https://api.imgflip.com/ai_meme", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload,
        });

        const data = (await response.json()) as GenerateAiMemeResponse;

        if (data.data?.url) {
          const watermarkImage = await addWatermark(data.data.url);

          const ipfsData = await uploadToIpfs(
            data.data.url,
            true,
            watermarkImage
          );
          return ipfsData;
        }

        if (!data.success) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "AI failed to generate meme",
          });
        }
      } catch (err: unknown) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI Failed to generate meme",
          cause: err as Error,
        });
      }
    }),
});
