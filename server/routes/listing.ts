import { router, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import {
  getAllListings,
  getListingsBySeller,
  createListing,
  updateListingStatus,
  likeListing,
  getLikesForListing,
  getMarketplaceListings,
  getListingByID,
} from "@/lib/queries/dbQueries";

export const listingRouter = router({
  // Get all listings
  getAllListings: publicProcedure.query(async () => {
    return await getAllListings();
  }),

  getListingByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getListingByID(input.id);
    }),

  getMarketplaceListings: publicProcedure.query(async () => {
    return await getMarketplaceListings();
  }),

  // Get listings by seller
  getListingsBySeller: publicProcedure
    .input(z.object({ seller: z.string().length(42) }))
    .query(async ({ input }) => {
      return await getListingsBySeller(input.seller);
    }),

  // Create a new listing
  createListing: publicProcedure
    .input(
      z.object({
        nftId: z.number(),
        seller: z.string().length(42),
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

  // Get all likes for an nft
  getLikesForNft: publicProcedure
    .input(z.object({ nftId: z.number() }))
    .query(async ({ input }) => {
      return await getLikesForListing(input.nftId);
    }),

  // Like an nft
  likeNft: publicProcedure
    .input(z.object({ listingId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      return await likeListing(input.listingId, input.userId);
    }),
});
