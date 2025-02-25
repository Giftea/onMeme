import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardSkeleton() {
  const skeletons = Array.from({ length: 8 });

  return (
    <div className="space-y-4">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="p-2 border-b last:border-none grid grid-cols-2 py-4 text-xl"
        >
          <Skeleton className="p-4 w-20 bg-muted" />
          <div className="grid grid-cols-4">
            <Skeleton className="p-4 w-20 bg-muted" />
            <Skeleton className="p-4 w-20 bg-muted" />
            <Skeleton className="p-4 w-20 bg-muted" />
            <Skeleton className="p-4 w-20 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
