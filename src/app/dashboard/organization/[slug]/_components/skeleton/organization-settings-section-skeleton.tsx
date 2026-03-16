import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationSettingsSectionSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, cardIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          key={`skeleton-card-${cardIndex}`}
          className="rounded-lg border bg-card p-6 space-y-6"
        >
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, fieldIndex) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                key={`skeleton-field-${cardIndex}-${fieldIndex}`}
                className="space-y-2 p-3 rounded-lg bg-muted/50"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
