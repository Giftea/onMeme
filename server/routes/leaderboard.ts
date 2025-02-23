import { publicProcedure, router } from "@/server/trpc";
import { getLeaderboard } from "@/lib/queries/dbQueries";

export const leaderboardRouter = router({
  getLeaderboard: publicProcedure.query(async () => await getLeaderboard()),
});
