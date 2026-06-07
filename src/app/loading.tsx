import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl space-y-5">
        <Skeleton className="h-7 w-40 rounded-full" />
        <Skeleton className="h-14 w-full max-w-2xl rounded-2xl sm:h-16" />
        <Skeleton className="h-5 w-full max-w-xl rounded-lg" />
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="premium-surface overflow-hidden">
            <Skeleton className="h-40 rounded-none" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-6 w-3/4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
