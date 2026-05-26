import Link from "next/link";
import { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={category.parentSlug ? `/${category.parentSlug}/${category.slug}` : `/${category.slug}`} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:hover:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.15)] hover:border-purple-600/20 dark:hover:border-purple-500/30 group">
      <div className="h-60 bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-850 flex items-center justify-center text-8xl transition-transform duration-500 group-hover:scale-105">
        {category.imageUrl ? (
          <img src={category.imageUrl} alt={category.title} className="w-full h-full object-cover" />
        ) : (
          <div className="placeholder-img">🎨</div>
        )}
      </div>
      <div className="p-5 text-center bg-white dark:bg-gray-900 border-t border-black/5 dark:border-white/5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 m-0">{category.title}</h3>
      </div>
    </Link>
  );
}
