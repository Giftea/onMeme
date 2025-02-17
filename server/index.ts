import { listingRouter } from "./routes/listing";
import { memeRouter } from "./routes/memes";
import { nftRouter } from "./routes/nfts";
import { tokenRouter } from "./routes/token";
import { userRouter } from "./routes/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  token: tokenRouter,
  meme: memeRouter,
  nft: nftRouter,
  listing: listingRouter,
});

export type AppRouter = typeof appRouter;
