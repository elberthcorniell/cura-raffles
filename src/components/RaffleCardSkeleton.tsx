import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RaffleCardSkeleton = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-card border-card-border">
      {/* Image Skeleton */}
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="p-6 space-y-4">
        {/* Title and Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Price and Time Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Progress Section Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-12 w-full rounded-lg" />

        {/* Additional Info Skeleton */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-card-border">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default RaffleCardSkeleton;




