'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleCopy}
        className={`flex items-center justify-center w-11 h-11 rounded-full transition-all hover:scale-110 duration-200 cursor-pointer ${
          copied 
            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
        }`}
        aria-label="Copy Article Link"
      >
        {copied ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scale-100 transition-transform duration-200">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        )}
      </button>

      {/* Tooltip / Toast */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs font-semibold rounded shadow-lg transition-all duration-300 pointer-events-none whitespace-nowrap ${
        copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
      }`}>
        Copied!
      </div>
    </div>
  );
}
