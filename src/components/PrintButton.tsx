'use client';

import { useState, useEffect } from 'react';
interface PrintButtonProps {
  slug: string;
  imageUrl: string;
  title: string;
}

export default function PrintButton({ slug, imageUrl, title }: PrintButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<{ hours: number, minutes: number } | null>(null);

  useEffect(() => {
    if (!nextAvailableTime) return;
    
    const calculateRemaining = () => {
      const now = new Date().getTime();
      const available = new Date(nextAvailableTime).getTime();
      const diff = available - now;
      
      if (diff <= 0) {
        setIsRateLimited(false);
        setNextAvailableTime(null);
        setRemainingTime(null);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        // If it's something like 0h 0m but diff > 0, show 1m to avoid 0m
        if (hours === 0 && minutes === 0) {
          setRemainingTime({ hours: 0, minutes: 1 });
        } else {
          setRemainingTime({ hours, minutes });
        }
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 60000);
    return () => clearInterval(interval);
  }, [nextAvailableTime]);

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
        const res = await fetch(`${API_URL}/pages/${slug}/download`);
        const data = await res.json();
        if (data.limited) {
          setIsRateLimited(true);
          if (data.nextAvailableTime) {
            setNextAvailableTime(data.nextAvailableTime);
          }
        }
      } catch (err) {
        console.error("Failed to check limit", err);
      }
    };
    checkRateLimit();
  }, [slug]);

  const handlePrint = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    // Check if we already have a print container
    let printContainer = document.getElementById('print-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-container';
      document.body.appendChild(printContainer);
      
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body > *:not(#print-container) {
            display: none !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          #print-container {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100vh;
          }
          #print-container img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
          @page { margin: 0; size: auto; }
        }
        @media screen {
          #print-container {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const trackPrint = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
        const res = await fetch(`${API_URL}/pages/${slug}/download`, { method: 'POST' });
        if (res.status === 429) {
          setIsRateLimited(true);
          const data = await res.json();
          if (data.nextAvailableTime) {
            setNextAvailableTime(data.nextAvailableTime);
          }
        }
      } catch (err) {
        console.error("Failed to track print download", err);
      }
    };

    const loadImageWithRetry = (attempt: number) => {
      const img = new Image();
      const src = attempt > 0 ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}retry=${attempt}` : imageUrl;
      
      img.onload = async () => {
        if (printContainer) {
          printContainer.innerHTML = '';
          printContainer.appendChild(img);
        }
        window.print();
        await trackPrint();
        setLoading(false);
      };
      
      img.onerror = () => {
        // Retry loading in the background
        setTimeout(() => loadImageWithRetry(attempt + 1), 1500);
      };
      
      img.src = src;
    };

    loadImageWithRetry(0);
  };

  return (
    <button 
      onClick={handlePrint}
      disabled={loading || isRateLimited}
      className={`relative group w-full h-14 flex items-center justify-center border-none rounded-2xl transition-all duration-300 select-none ${
        isRateLimited 
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
          : 'bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white cursor-pointer hover:-translate-y-1 active:translate-y-0 active:scale-95'
      } ${loading && !isRateLimited ? 'cursor-not-allowed opacity-75' : ''}`} 
      aria-label="Print Page"
    >
      {isRateLimited ? (
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs sm:text-sm text-center">
            {remainingTime 
              ? `Please wait ${remainingTime.hours > 0 ? `${remainingTime.hours}h ` : ''}${remainingTime.minutes}m`
              : 'Please wait 6 hours'}
            <br/>to download again
          </span>
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-semibold text-sm sm:text-base">Preparing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg 
            viewBox="0 0 24 24" 
            width="20" 
            height="20" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span className="font-semibold text-sm sm:text-base">Print</span>
        </div>
      )}
    </button>
  );
}
