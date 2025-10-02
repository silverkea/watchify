import { Skeleton } from "@/components/ui/skeleton"

interface MovieCardSkeletonProps {
  variant?: 'default' | 'compact'
}

export function MovieCardSkeleton({ variant = 'default' }: MovieCardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className="group relative overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="aspect-[2/3] relative">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-2">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      {/* Poster Skeleton */}
      <div className="aspect-[2/3] relative">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <Skeleton className="h-5 w-full mb-2" />
        
        {/* Year and Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Overview */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        
        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        
        {/* Cast */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  )
}