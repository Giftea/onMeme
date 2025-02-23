"use client";
import { trpc } from "@/lib/trpc.utils";
import { shortenAddress } from "@/lib/utils";
import LoadSkeleton from "../skeleton";
import LeaderboardSkeleton from "../skeleton/leaderboard.skeleton";

const LeaderBoard = () => {
  const { data: leaderboard, isLoading } =
    trpc.leaderboard.getLeaderboard.useQuery();

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">🏆 Top Memers Leaderboard</h1>

      <div>
        <div className="p-2 border-b last:border-none grid grid-cols-2 py-4 text-xl">
          <p>Top Users</p>

          <div className="grid grid-cols-4">
            <p>NFTs Minted</p>
            <p>Total Likes</p>
            <p>NFTs Sold</p>
            <p>Total Points</p>
          </div>
        </div>
        <LoadSkeleton skeleton={LeaderboardSkeleton} enabled={isLoading}>
          {leaderboard?.map((user, index) => (
            <div
              key={user.userId}
              className="p-2 border-b last:border-none grid grid-cols-2 py-4"
            >
              <span className="font-semibold">
                #{index + 1}{" "}
                {user.username ? user.username : shortenAddress(user.address)}
              </span>

              <div className="grid grid-cols-4">
                <p>{user.totalNftsMinted}</p>
                <p>{user.totalLikes}</p>
                <p>{user.totalNftsSold}</p>
                <p>{user.totalPoints}</p>
              </div>
            </div>
          ))}
        </LoadSkeleton>
      </div>
    </div>
  );
};

export default LeaderBoard;
