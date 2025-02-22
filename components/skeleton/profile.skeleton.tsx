"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileMemeSkeleton() {
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col items-end gap-4">
              <Skeleton className="h-72 w-full rounded-lg bg-slate-600" />
              <Skeleton className="h-10 w-24 bg-slate-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
