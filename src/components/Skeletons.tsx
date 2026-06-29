export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm flex flex-col h-full animate-pulse">
      {/* Image Area */}
      <div className="h-48 sm:h-60 bg-gray-200 dark:bg-gray-900 w-full relative"></div>
      
      {/* Info Area */}
      <div className="px-3 py-2.5 sm:px-5 sm:py-3.5 border-t border-black/5 dark:border-white/5 flex flex-col items-center gap-2 bg-white dark:bg-gray-900">
        {/* Title */}
        <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 mb-1"></div>
        {/* Pages count / Info */}
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-1/3 mb-1"></div>
        {/* Stats Row */}
        <div className="flex gap-3 sm:gap-4 justify-center">
           <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
           <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-6">
      <div className="flex flex-col items-center justify-center mb-8 pb-4">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4"></div>
        <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-72 max-w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
        {[...Array(12)].map((_, i) => (
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
      <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-800 w-1/2 sm:w-1/3 rounded-md mb-8"></div>
      
      <div className="flex gap-8 items-start flex-wrap lg:flex-nowrap mt-8">
        {/* Image Column */}
        <div className="flex-[0.9] max-w-[450px] min-w-[300px] w-full bg-gray-200 dark:bg-gray-850 h-[500px] sm:h-[600px] rounded-3xl border border-black/5 dark:border-white/5"></div>

        {/* Info Column */}
        <div className="flex-1 min-w-[320px] pt-4">
          <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-800 w-3/4 rounded-md mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded-md mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded-md mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-4/5 rounded-md mb-10"></div>
          
          <div className="flex gap-4 flex-wrap">
            <div className="h-10 sm:h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-10 sm:h-12 w-40 sm:w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-10 sm:h-12 w-40 sm:w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-10 sm:h-12 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
          
          <div className="h-20 bg-gray-200 dark:bg-gray-800 w-full rounded-2xl mt-10"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-800 w-full rounded-2xl mt-6"></div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 min-w-[280px] bg-white dark:bg-gray-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm flex flex-col gap-6 flex-shrink-0">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 w-1/2 rounded-md mb-2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-850 rounded-xl flex-shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded-md"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 w-2/3 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-6 pt-8 animate-pulse">
      {/* Breadcrumbs */}
      <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-800 w-1/4 rounded-md mb-8"></div>
      
      {/* Title */}
      <div className="h-10 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-md mb-4 mt-8"></div>
      
      {/* Description */}
      <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4 max-w-2xl rounded-md mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2 max-w-2xl rounded-md mb-12"></div>

      {/* Subheader */}
      <div className="h-8 bg-gray-200 dark:bg-gray-800 w-48 rounded-md mb-6"></div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
        {[...Array(8)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Pages Section Skeleton */}
      <div className="max-w-[1240px] mx-auto px-6 mb-16">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md mx-auto mb-6"></div>
        {/* Tabs Skeleton */}
        <div className="flex justify-center gap-4 mb-8 border-b border-black/5 dark:border-white/5 pb-4">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-8">
          {[...Array(10)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* StatsBar Skeleton */}
      <div className="w-full max-w-[1240px] mx-auto px-6 mt-12 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-2xl bg-white dark:bg-gray-900 border border-black/5 dark:border-white/5 h-28">
              <div className="h-7 w-16 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

