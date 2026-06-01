'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function SearchFilters({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentQuery = searchParams.get('q') || '';
  const currentDifficulty = searchParams.get('difficulty') || '';
  const currentAgeGroup = searchParams.get('ageGroup') || '';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  return (
    <div className={className || "w-full lg:w-64 flex-shrink-0 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-[0_4px_6px_-2px_rgba(0,0,0,0.05)] h-fit sticky top-24"}>
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-black/5 dark:border-white/5 pb-4">Filters</h3>
      
      <div className="mb-8">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Difficulty</h4>
        <div className="flex flex-col gap-3">
          {['easy', 'medium', 'hard'].map(level => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${currentDifficulty === level ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-700 group-hover:border-purple-600 dark:group-hover:border-purple-400'}`}>
                {currentDifficulty === level && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={currentDifficulty === level}
                onChange={() => handleFilterChange('difficulty', currentDifficulty === level ? '' : level)}
              />
              <span className="text-gray-600 dark:text-gray-400 capitalize group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors font-medium">{level}</span>
            </label>
          ))}
        </div>
      </div>
 
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Age Group</h4>
        <div className="flex flex-col gap-3">
          {['kids', 'adults'].map(age => (
            <label key={age} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${currentAgeGroup === age ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-700 group-hover:border-purple-600 dark:group-hover:border-purple-400'}`}>
                {currentAgeGroup === age && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={currentAgeGroup === age}
                onChange={() => handleFilterChange('ageGroup', currentAgeGroup === age ? '' : age)}
              />
              <span className="text-gray-600 dark:text-gray-400 capitalize group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors font-medium">
                {age === 'adults' ? 'adult' : age}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {(currentDifficulty || currentAgeGroup) && (
        <button 
          onClick={() => {
            const params = new URLSearchParams();
            if (currentQuery) params.set('q', currentQuery);
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="mt-8 w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors cursor-pointer border-none text-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
