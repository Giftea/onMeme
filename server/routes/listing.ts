import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  getAllListings,
  getListingsBySeller,
  createListing,
  updateListingStatus,
} from "@/lib/queries/dbQueries";

export const listingRouter = router({
  // Get all listings
  getAllListings: publicProcedure.query(async () => {
    return await getAllListings();
  }),

  // Get listings by seller
  getListingsBySeller: publicProcedure
    .input(z.object({ seller: z.string().length(42) })) // Ensures valid wallet address
    .query(async ({ input }) => {
      return await getListingsBySeller(input.seller);
    }),

  // Create a new listing
  createListing: publicProcedure
    .input(
      z.object({
        nftId: z.number(),
        seller: z.string().length(42), // Wallet address
        price: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return await createListing(input.nftId, input.seller, input.price);
    }),

  // Update listing status
  updateListingStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["listed", "sold", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      return await updateListingStatus(input.id, input.status);
    }),
});
