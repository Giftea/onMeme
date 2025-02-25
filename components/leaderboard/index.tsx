"use client";
import { trpc } from "@/lib/utils/trpc.utils";
import { shortenAddress } from "@/lib/utils";
import LoadSkeleton from "../skeleton";
import LeaderboardSkeleton from "../skeleton/leaderboard.skeleton";
import Link from "next/link";

const LeaderBoard = () => {
  const { data: leaderboard, isLoading } =
    trpc.leaderboard.getLeaderboard.useQuery();

  return (
    <div className="md:p-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        🏆 Top Memers Leaderboard
      </h1>

      <div className="overflow-x-auto">
        <div className="p-2 border-b last:border-none grid grid-cols-2 py-4 text-base md:text-xl min-w-[600px]">
          <p>Top Users</p>

          <div className="grid grid-cols-4 place-items-center">
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
              className="p-2 border-b last:border-none grid grid-cols-2 py-4 min-w-[600px]"
            >
              <span className="font-semibold">
                #{index + 1}{" "}
                <Link className="text-primary" href={`/user/${user.address}`}>
                  {user.username ? user.username : shortenAddress(user.address)}
                </Link>
              </span>

              <div className="grid grid-cols-4 md:place-items-center">
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
