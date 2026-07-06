'use client';

import { useState, useEffect, useRef } from 'react';
import CategoryCard from "@/components/CategoryCard";
import { Category } from "@/types";

interface CollapsibleCategorySectionProps {
  mainCategory: Category;
  subCategories: Category[];
  defaultOpen?: boolean;
}

export default function CollapsibleCategorySection({ mainCategory, subCategories, defaultOpen = true }: CollapsibleCategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasOpened, setHasOpened] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If explicitly opened by user click
    if (isOpen && !hasOpened && !defaultOpen) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened, defaultOpen]);

  useEffect(() => {
    if (typeof IntersectionObserver !== 'undefined' && sectionRef.current && !hasOpened) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setHasOpened(true);
            observer.disconnect();
          }
        },
        { rootMargin: '400px' } // Load images when within 400px of viewport
      );
      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    } else if (!hasOpened) {
      setHasOpened(true); // Fallback
    }
  }, [hasOpened]);

  return (
    <div ref={sectionRef} className="border-b border-black/5 dark:border-white/5 pb-12 last:border-0">
      <div 
        className="flex items-center justify-between mb-6 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 before:content-[''] before:block before:w-1 before:h-8 before:bg-purple-600 before:rounded-sm">
          {mainCategory.title}
        </h2>
        
        <button 
          className={`p-3 rounded-xl transition-all ${isOpen ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'} group-hover:bg-purple-600/10 dark:group-hover:bg-purple-500/20`}
          aria-label="Toggle section"
        >
          <svg 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
      
      <div 
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-0' : 'grid-rows-[0fr] opacity-0 -mt-2'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 pt-2">
            {subCategories.length > 0 ? (
              subCategories.map(sub => (
                <CategoryCard key={sub.id} category={sub} deferImage={!hasOpened} />
              ))
            ) : (
              <CategoryCard category={mainCategory} deferImage={!hasOpened} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
