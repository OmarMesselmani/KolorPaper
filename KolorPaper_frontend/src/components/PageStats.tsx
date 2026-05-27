'use client';

interface PageStatsProps {
  views?: number;
  downloads?: number;
  likes?: number;
  className?: string;
}

export default function PageStats({ views, downloads, likes, className }: PageStatsProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className || ''}`}>
      {/* Views */}
      <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="font-bold">{views !== undefined ? views.toLocaleString() : '0'}</span>
        <span className="text-sm font-medium opacity-80">Views</span>
      </div>

      {/* Downloads */}
      <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-xl">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="font-bold">{downloads !== undefined ? downloads.toLocaleString() : '0'}</span>
        <span className="text-sm font-medium opacity-80">Downloads</span>
      </div>

      {/* Likes */}
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span className="font-bold">{likes !== undefined ? likes.toLocaleString() : '0'}</span>
        <span className="text-sm font-medium opacity-80">Likes</span>
      </div>
    </div>
  );
}
