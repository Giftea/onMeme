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
  isNFTListed,
  getListingByNFTId,
  updateListingPrice,
  getNFTTransfersByNFTId,
} from "@/lib/database/dbQueries";
import { ListedNFT } from "@/lib/types";

export const listingRouter = router({
  // Get all listings
  getAllListings: publicProcedure.query(async () => {
    return await getAllListings();
  }),

  getListingByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return (await getListingByID(input.id)) as ListedNFT;
    }),

  getNFTTransfersByNFTId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getNFTTransfersByNFTId(input.id);
    }),

  getListingByNFTId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return (await getListingByNFTId(input.id)) as ListedNFT;
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

  // Handle listing creation, update, and cancellation
  handleListing: publicProcedure
    .input(
      z.discriminatedUnion("action", [
        z.object({
          action: z.literal("create"),
          nftId: z.number(),
          seller: z.string().length(42),
          price: z.number().min(1),
        }),
        z.object({
          action: z.literal("update"),
          listingId: z.number(),
          newPrice: z.number().min(1),
        }),
        z.object({
          action: z.literal("cancel"),
          id: z.number(),
          status: z.literal("cancelled"),
        }),
      ])
    )
    .mutation(async ({ input }) => {
      switch (input.action) {
        case "create":
          return await createListing(input.nftId, input.seller, input.price);
        case "update":
          return await updateListingPrice(input.listingId, input.newPrice);
        case "cancel":
          return await updateListingStatus(input.id, input.status);
        default:
          throw new Error("Invalid action");
      }
    }),

  // Get all likes for an NFT
  getLikesForNft: publicProcedure
    .input(z.object({ nftId: z.number() }))
    .query(async ({ input }) => {
      return await getLikesForListing(input.nftId);
    }),

  // Like an NFT
  likeNft: publicProcedure
    .input(z.object({ listingId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      return await likeListing(input.listingId, input.userId);
    }),

  // Check if an NFT is listed
  checkNFTListed: publicProcedure
    .input(z.object({ nftId: z.number() }))
    .query(async ({ input }) => {
      return await isNFTListed(input.nftId);
    }),
});
