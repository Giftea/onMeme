import { purchaseNFT } from "@/lib/database/dbQueries";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const marketplaceRouter = router({
  purchaseNFT: publicProcedure
    .input(z.object({ listingId: z.number(), buyerAddress: z.string() }))
    .mutation(async ({ input }) => {
      return await purchaseNFT(input.listingId, input.buyerAddress);
    }),
});
