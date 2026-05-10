'use client';

import { useState, useRef, useEffect } from 'react';

const USFlag = () => (
  <svg className="flag-icon" viewBox="0 0 741 390">
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
  <svg className="flag-icon" viewBox="0 0 3 2">
    <rect width="1" height="2" fill="#002395"/>
    <rect x="1" width="1" height="2" fill="#fff"/>
    <rect x="2" width="1" height="2" fill="#ed2939"/>
  </svg>
);

const ArabLeagueFlag = () => (
  <svg className="flag-icon" viewBox="0 0 600 400">
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
    <div className="lang-switcher-container" ref={dropdownRef}>
      <button 
        className="lang-button" 
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
          style={{ 
            marginLeft: '4px', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease'
          }}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="lang-dropdown" role="listbox">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${selectedLang.code === lang.code ? 'active' : ''}`}
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
