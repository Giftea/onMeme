import { Skeleton } from "@/components/ui/skeleton";

export default function MemeGeneratorSkeleton() {
  return (
    <div className="rounded-lg bg-card text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-48 bg-muted" />
        <Skeleton className="h-10 w-40 rounded-full bg-muted" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side - Meme Preview */}
        <div className="w-full">
          <Skeleton className="w-full aspect-[4/3] bg-muted rounded-lg" />
          <Skeleton className="h-4 w-64 mt-2 bg-muted" />
        </div>

        {/* Right side - Controls */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 bg-muted" />
          <Skeleton className="h-6 w-40 bg-muted" />

          {/* Text Elements Section */}
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-32 bg-muted" />
              <Skeleton className="h-9 w-28 rounded-md bg-muted" />
            </div>

            {/* Text Input */}
            <Skeleton className="h-12 w-full bg-muted rounded-lg" />

            {/* Font Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 bg-muted" />
                <Skeleton className="h-10 w-full bg-muted rounded-md" />
              </div>
            </div>

            {/* Color Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-muted" />
                <Skeleton className="h-10 w-full bg-muted rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 bg-muted" />
                <Skeleton className="h-10 w-full bg-muted rounded-md" />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Skeleton className="h-12 w-full bg-muted rounded-lg mt-8" />
        </div>
      </div>
    </div>
  );
}
