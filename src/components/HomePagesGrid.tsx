'use client';

import { useState, useMemo, useEffect } from "react";
import { ColoringPage } from "@/types";
import ColoringCard from "./ColoringCard";
import LoadMore from "./LoadMore";

interface HomePagesGridProps {
  pages: ColoringPage[];
}

type Tab = "newest" | "downloads" | "likes";

const tabs: { key: Tab; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "downloads", label: "Most Downloaded" },
  { key: "likes", label: "Most Liked" },
];

export default function HomePagesGrid({ pages }: HomePagesGridProps) {
  const [activeTab, setActiveTab] = useState<Tab>("newest");
  const [step, setStep] = useState(12);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      const currentStep = window.innerWidth >= 2560 ? 15 : 12;
      setStep(currentStep);
      setVisibleCount(prev => {
        // Only override if the user hasn't loaded more items yet
        if (prev <= 15) return currentStep;
        return prev;
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sorted = useMemo(() => {
    const list = [...pages];
    if (activeTab === "downloads") {
      list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (activeTab === "likes") {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // newest
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return list;
  }, [pages, activeTab]);

  const MAX_CARDS = 120;
  const visible = sorted.slice(0, Math.min(visibleCount, MAX_CARDS));
  const hasMore = visibleCount < sorted.length && visibleCount < MAX_CARDS;

  return (
    <div className="max-w-[1240px] mx-auto px-6">
      <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent text-center pb-2 mb-6">
        Start Your Coloring Journey
      </h2>
      <div className="flex items-center justify-center gap-1 mb-8 border-b border-black/5 dark:border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setVisibleCount(step); }}
            className={`px-8 py-4 text-base font-bold border-b-2 transition-all duration-300 cursor-pointer bg-transparent ${activeTab === tab.key
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[2560px]:grid-cols-5 gap-4 sm:gap-8 pb-8">
        {visible.map((page) => (
          <ColoringCard key={page.id} page={page} />
        ))}
      </div>

      {hasMore && (
        <LoadMore 
          onClick={() => setVisibleCount(prev => Math.min(prev + step, sorted.length, MAX_CARDS))} 
          label="See More..." 
        />
      )}
    </div>
  );
}
