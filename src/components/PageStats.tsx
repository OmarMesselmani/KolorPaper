'use client';

import { useState, useEffect } from 'react';

interface PageStatsProps {
  slug?: string;
  views?: number;
  downloads?: number;
  likes?: number;
  className?: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const formatted = (n / 1_000_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  if (n >= 1_000) {
    const formatted = (n / 1_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}K`;
  }
  return String(n);
}

export default function PageStats({ slug, views, downloads, likes, className }: PageStatsProps) {
  const [currentViews, setCurrentViews] = useState(views || 0);

  useEffect(() => {
    if (views !== undefined) {
      setCurrentViews(views);
    }
  }, [views]);

  useEffect(() => {
    if (!slug) return;
    // Automated browsers and bots
    if (typeof navigator !== 'undefined') {
      if (navigator.webdriver) return;
      const ua = (navigator.userAgent || '').toLowerCase();
      if (!ua || ua.length < 10 || /bot|crawler|spider|headless|lightpanda|scraper|wget|curl|python/i.test(ua)) {
        return;
      }
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
    const VISIBLE_MS_REQUIRED = 4000;
    let recorded = false;
    let visibleMs = 0;
    let lastTick = Date.now();

    const recordView = () => {
      if (recorded) return;
      recorded = true;
      cleanup();
      fetch(`${API_URL}/pages/${slug}/view`, {
        method: 'POST',
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
          if (data && typeof data.views === 'number') {
            setCurrentViews(data.views);
          }
        })
        .catch((err) => console.error("Failed to record view:", err));
    };

    // Count a view only after real engagement: a user interaction, or enough time with the tab visible.
    // Scraper bots typically load the page and leave immediately, so they never trigger this.
    const interactionEvents = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'mousemove'] as const;
    interactionEvents.forEach((evt) => window.addEventListener(evt, recordView, { passive: true, once: true }));

    const timer = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === 'visible') visibleMs += now - lastTick;
      lastTick = now;
      if (visibleMs >= VISIBLE_MS_REQUIRED) recordView();
    }, 500);

    function cleanup() {
      window.clearInterval(timer);
      interactionEvents.forEach((evt) => window.removeEventListener(evt, recordView));
    }

    return cleanup;
  }, [slug]);

  return (
    <div className={`hidden flex-row items-center gap-2 flex-nowrap ${className || ''}`}>
      {/* Views */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl text-xs sm:text-sm font-medium">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="font-extrabold">{formatCount(currentViews)}</span>
        <span className="opacity-80 text-[11px] sm:text-xs">Views</span>
      </div>

      {/* Downloads */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-xl text-xs sm:text-sm font-medium">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="font-extrabold">{downloads !== undefined ? formatCount(downloads) : '0'}</span>
        <span className="opacity-80 text-[11px] sm:text-xs">Downloads</span>
      </div>

      {/* Likes */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs sm:text-sm font-medium">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span className="font-extrabold">{likes !== undefined ? formatCount(likes) : '0'}</span>
        <span className="opacity-80 text-[11px] sm:text-xs">Likes</span>
      </div>
    </div>
  );
}
