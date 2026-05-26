'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';

export default function NavMenu({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const topLevelCategories = categories.filter(c => !c.parentSlug);

  const toggleExpand = (catId: string) => {
    setExpandedCats(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#0F0728]/10 dark:hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center group"
        aria-label="Menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#0F0728] dark:text-white"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-screen min-h-screen w-80 bg-white dark:bg-gray-900 shadow-2xl z-[1001] transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ height: '100vh' }}
      >
        <div className="p-6 border-b border-purple-600/10 dark:border-white/10 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent">Categories</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar bg-white dark:bg-gray-900">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-purple-600/5 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl transition-all font-bold text-gray-700 dark:text-gray-300 group"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/blog"
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-purple-600/5 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl transition-all font-bold text-gray-700 dark:text-gray-300 group"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          
          <div className="h-px bg-purple-600/5 dark:bg-white/5 my-4 mx-4" />
          
          <p className="px-4 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Categories</p>
          
          {topLevelCategories.map((category) => {
            const subCats = categories.filter(c => c.parentSlug === category.slug);
            const isExpanded = expandedCats.includes(category.id);

            return (
              <div key={category.id} className="space-y-1">
                <div className="flex items-center justify-between group">
                  <Link
                    href={`/${category.slug}`}
                    className="flex-1 flex items-center gap-4 px-4 py-3.5 hover:bg-purple-600/5 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl transition-all font-bold text-gray-700 dark:text-gray-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.title}
                  </Link>
                  {subCats.length > 0 && (
                    <button 
                      onClick={() => toggleExpand(category.id)}
                      className={`p-3 mr-2 hover:bg-purple-600/10 dark:hover:bg-purple-500/20 rounded-xl transition-all ${isExpanded ? 'rotate-180 text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  )}
                </div>

                {isExpanded && subCats.length > 0 && (
                  <div className="pl-12 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {subCats.map(sub => (
                      <Link
                        key={sub.id}
                        href={`/${sub.parentSlug}/${sub.slug}`}
                        className="block px-4 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-600/5 dark:hover:bg-purple-500/10 rounded-xl transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


