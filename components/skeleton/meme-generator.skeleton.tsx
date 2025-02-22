import { Skeleton } from "@/components/ui/skeleton";

export default function MemeGeneratorSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-48 bg-slate-800" />
        <Skeleton className="h-10 w-40 rounded-full bg-slate-800" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side - Meme Preview */}
        <div className="w-full">
          <Skeleton className="w-full aspect-[4/3] bg-slate-800 rounded-lg" />
          <Skeleton className="h-4 w-64 mt-2 bg-slate-800" />
        </div>

        {/* Right side - Controls */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 bg-slate-800" />
          <Skeleton className="h-6 w-40 bg-slate-800" />

          {/* Text Elements Section */}
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-32 bg-slate-800" />
              <Skeleton className="h-9 w-28 rounded-md bg-slate-800" />
            </div>

            {/* Text Input */}
            <Skeleton className="h-12 w-full bg-slate-800 rounded-lg" />

            {/* Font Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 bg-slate-800" />
                <Skeleton className="h-10 w-full bg-slate-800 rounded-md" />
              </div>
            </div>

            {/* Color Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-slate-800" />
                <Skeleton className="h-10 w-full bg-slate-800 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 bg-slate-800" />
                <Skeleton className="h-10 w-full bg-slate-800 rounded-md" />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Skeleton className="h-12 w-full bg-slate-800 rounded-lg mt-8" />
        </div>
      </div>
    </div>
  );
}
