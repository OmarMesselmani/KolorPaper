'use client';

import { useState, useMemo } from "react";
import { Category } from "@/types";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  categories: Category[];
}

type Tab = "newest" | "downloads" | "likes";

const tabs: { key: Tab; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "downloads", label: "Most Downloaded" },
  { key: "likes", label: "Most Liked" },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [activeTab, setActiveTab] = useState<Tab>("newest");
  const [visibleCount, setVisibleCount] = useState(8);

  const sorted = useMemo(() => {
    const list = [...categories];
    if (activeTab === "downloads") {
      list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (activeTab === "likes") {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return list;
  }, [categories, activeTab]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div className="max-w-[1240px] mx-auto px-6">
      <div className="flex items-center justify-center gap-1 mb-8 border-b border-black/5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setVisibleCount(8); }}
            className={`px-8 py-4 text-base font-bold border-b-2 transition-all duration-300 cursor-pointer bg-transparent ${
              activeTab === tab.key
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 pb-8">
        {visible.map((category, idx) => (
          <CategoryCard key={category.id} category={category} index={idx} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pb-16">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 8, sorted.length))}
            className="px-7 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-extrabold rounded-xl text-base transition-all duration-300 shadow-md hover:shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-none"
          >
            See More...
          </button>
        </div>
      )}
    </div>
  );
}
