import { getAddress } from "@/lib/chopin-server";
import LeaderBoard from "@/components/leaderboard";

export default async function LeaderboardPage() {
  const address = await getAddress();

  return <LeaderBoard />;
}
