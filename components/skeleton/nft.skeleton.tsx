"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NFTDescriptionSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="w-[140px] h-10 rounded-full bg-slate-600 " />
      <Skeleton className="w-[200px] h-10 rounded-full bg-slate-600 " />
      <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
      <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
    </div>
  );
}

export function MarketplaceViewNFTSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border flex justify-center items-center border-gray-400 rounded-lg p-4">
        <Skeleton className="w-full h-[500px] rounded-lg bg-slate-600 " />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-[140px] h-10 rounded-full bg-slate-600 " />
        <Skeleton className="w-[200px] h-10 rounded-full bg-slate-600 " />
        <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
        <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
      </div>
    </div>
  );
}
