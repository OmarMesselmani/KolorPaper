'use client';

export default function ArticlePrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center justify-center w-11 h-11 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all hover:scale-110 duration-200 cursor-pointer"
      aria-label="Print Article"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
    </button>
  );
}
