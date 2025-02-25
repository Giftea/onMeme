import { publicProcedure, router } from "@/server/trpc";
import { getLeaderboard } from "@/lib/database/dbQueries";

export const leaderboardRouter = router({
  getLeaderboard: publicProcedure.query(async () => await getLeaderboard()),
});
