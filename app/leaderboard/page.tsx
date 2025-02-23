"use client";
import { trpc } from "@/lib/trpc.utils";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } =
    trpc.leaderboard.getLeaderboard.useQuery();
  console.log(leaderboard);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="border border-gray-200 rounded-lg p-4">
          {leaderboard?.map((user, index) => (
            <li key={user.userId} className="p-2 border-b last:border-none">
              <span className="font-semibold">
                {index + 1}. {user.username}
              </span>{" "}
              - {user.totalPoints} points
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
