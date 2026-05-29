import Link from "next/link";
import { Category } from "@/types";

function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const formatted = (n / 1_000_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  if (n >= 1_000) {
    const formatted = (n / 1_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}K`;
  }
  return String(n);
}

function getDefaultPageCount(title: string): number {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const min = 120;
  const max = 1800;
  const count = min + (Math.abs(hash) % (max - min));
  return Math.round(count / 10) * 10;
}

export default function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  // Determine badge: first 3 are "New", top downloads get "Popular"
  const badge: "Popular" | null =
    (category.downloads ?? 0) >= 800 ? "Popular" : null;

  const href = category.parentSlug
    ? `/${category.parentSlug}/${category.slug}`
    : `/${category.slug}`;

  const pageCount = category.parentSlug
    ? (category._count?.subPages ?? 0)
    : (category._count?.pages ?? 0);

  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:hover:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.15)] hover:border-purple-600/20 dark:hover:border-purple-500/30 group relative"
    >
      {/* Badge */}
      {badge && (
        <span
          className="absolute top-3 left-3 z-10 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md bg-orange-500 text-white"
        >
          🔥 Popular
        </span>
      )}

      {/* Image area */}
      <div className="h-60 bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-850 flex items-center justify-center text-8xl transition-transform duration-500 group-hover:scale-105 overflow-hidden">
        {category.imageUrl ? (
          <img src={category.imageUrl} alt={category.title} className="w-full h-full object-cover" />
        ) : (
          <div className="placeholder-img">🎨</div>
        )}
      </div>

      {/* Info area */}
      <div className="p-5 bg-white dark:bg-gray-900 border-t border-black/5 dark:border-white/5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">
          {category.title}
        </h3>
        <p className="text-sm font-medium text-purple-600 dark:text-purple-400 text-center mb-3">
          ({pageCount}) pages
        </p>

        {/* Stats row */}
        {(category.downloads !== undefined || category.likes !== undefined) && (
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
            {category.downloads !== undefined && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 3v9" />
                </svg>
                {formatCount(category.downloads)}
              </span>
            )}
            {category.likes !== undefined && (
              <span className="flex items-center gap-1 text-rose-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {formatCount(category.likes)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
