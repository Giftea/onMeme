import { tokenRouter } from "./routes/token";
import { userRouter } from "./routes/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  token: tokenRouter,
});

export type AppRouter = typeof appRouter;
