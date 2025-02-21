"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function NFTDescriptionSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="w-[140px] h-10 rounded-full bg-slate-600 " />
      <Skeleton className="w-[200px] h-10 rounded-full bg-slate-600 " />
      <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
      <Skeleton className="w-full h-[200px] rounded-lg bg-slate-600 " />
    </div>
  );
}
