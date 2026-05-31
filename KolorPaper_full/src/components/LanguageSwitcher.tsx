'use client';

import { useState, useRef, useEffect } from 'react';

const USFlag = () => (
  <svg className="w-6 h-[18px] rounded-sm object-cover shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0" viewBox="0 0 741 390">
    <rect width="741" height="390" fill="#bf0a30"/>
    <path d="M0 30h741M0 90h741M0 150h741M0 210h741M0 270h741M0 330h741" stroke="#fff" strokeWidth="30"/>
    <rect width="296" height="210" fill="#002868"/>
    <g fill="#fff">
      {[...Array(5)].map((_, i) => (
        [...Array(6)].map((_, j) => (
          <circle key={`${i}-${j}`} cx={25 + j * 48} cy={20 + i * 42} r="6" />
        ))
      ))}
    </g>
  </svg>
);

const FranceFlag = () => (
  <svg className="w-6 h-[18px] rounded-sm object-cover shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0" viewBox="0 0 3 2">
    <rect width="1" height="2" fill="#002395"/>
    <rect x="1" width="1" height="2" fill="#fff"/>
    <rect x="2" width="1" height="2" fill="#ed2939"/>
  </svg>
);

const ArabLeagueFlag = () => (
  <svg className="w-6 h-[18px] rounded-sm object-cover shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#007A33"/>
    <circle cx="300" cy="200" r="90" fill="none" stroke="white" strokeWidth="6"/>
    <path d="M275 200 A25 25 0 1 0 325 200 A20 20 0 1 1 275 200 Z" fill="white" transform="translate(0, 5)"/>
    <path d="M210 200 Q210 280 300 280 Q390 280 390 200" fill="none" stroke="white" strokeWidth="4" strokeDasharray="4,8" />
    <path d="M220 180 Q220 120 300 120 Q380 120 380 180" fill="none" stroke="white" strokeWidth="4" strokeDasharray="4,8" />
  </svg>
);

const languages = [
  { code: 'en', name: 'English', flag: <USFlag />, label: 'English' },
  { code: 'fr', name: 'Français', flag: <FranceFlag />, label: 'Français' },
  { code: 'ar', name: 'العربية', flag: <ArabLeagueFlag />, label: 'العربية' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: typeof languages[0]) => {
    setSelectedLang(lang);
    setIsOpen(false);
    // Here you would typically handle the actual language switch logic
    // e.g., router.push(currentPath, currentPath, { locale: lang.code });
    console.log(`Language changed to: ${lang.code}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-gray-900 border border-purple-600/10 dark:border-white/10 rounded-xl cursor-pointer font-semibold text-gray-800 dark:text-gray-100 transition-all duration-300 shadow-sm w-[150px] font-inherit hover:border-purple-600 dark:hover:border-purple-500 hover:shadow-[0_10px_15px_-3px_rgba(124,58,237,0.1),0_4px_6px_-2px_rgba(124,58,237,0.05)] dark:hover:shadow-[0_10px_15px_-3px_rgba(168,85,247,0.15)] hover:-translate-y-[1px]" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {selectedLang.flag}
          <span>{selectedLang.label}</span>
        </div>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`ml-1 transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 rtl:right-auto rtl:left-0 w-[150px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-purple-600/10 dark:border-white/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden z-[1000]" role="listbox">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 w-full border-none bg-transparent font-inherit text-[0.95rem] text-left rtl:text-right rtl:flex-row-reverse text-gray-800 dark:text-gray-200 hover:bg-purple-600/5 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 ${selectedLang.code === lang.code ? 'bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold' : ''}`}
              onClick={() => handleSelect(lang)}
              role="option"
              aria-selected={selectedLang.code === lang.code}
            >
              {lang.flag}
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
