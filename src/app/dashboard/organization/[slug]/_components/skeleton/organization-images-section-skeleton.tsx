import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationImagesSectionSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <div key={`skeleton-img-${i}`} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
