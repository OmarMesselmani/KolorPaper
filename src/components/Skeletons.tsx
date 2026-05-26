export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm flex flex-col h-full animate-pulse">
      <div className="h-60 bg-gray-200 dark:bg-gray-850 w-full"></div>
      <div className="p-5 flex flex-col gap-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 mx-auto"></div>
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-6">
      <div className="flex items-center justify-center gap-4 mb-8 border-b border-black/5 dark:border-white/5 pb-4">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 pb-8">
        {[...Array(8)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-6 pt-8 pb-16 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-6 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-md mb-8"></div>
      
      <div className="flex gap-8 items-start flex-wrap lg:flex-nowrap mt-8">
        {/* Image Column */}
        <div className="flex-[0.9] max-w-[450px] min-w-[300px] w-full bg-gray-200 dark:bg-gray-850 h-[600px] rounded-3xl border border-black/5 dark:border-white/5"></div>

        {/* Info Column */}
        <div className="flex-1 min-w-[320px] pt-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 w-3/4 rounded-md mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded-md mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded-md mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-4/5 rounded-md mb-10"></div>
          
          <div className="flex gap-4 flex-wrap">
            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
          
          <div className="h-8 bg-gray-200 dark:bg-gray-800 w-1/2 rounded-md mt-10"></div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 min-w-[280px] bg-white dark:bg-gray-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm flex flex-col gap-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 w-1/2 rounded-md mb-2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-850 rounded-xl"></div>
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded-md"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 w-2/3 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
