'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ColoringPage } from '@/types';

interface RelatedCardProps {
  page: ColoringPage;
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

export default function RelatedCard({ page }: RelatedCardProps) {
  const [imgSrc, setImgSrc] = useState(page.thumbnailUrl);
  const href = page.subCategorySlug
    ? `/${page.categorySlug}/${page.subCategorySlug}/${page.slug}`
    : `/${page.categorySlug}/${page.slug}`;

  return (
    <Link
      href={href}
      className="flex gap-3 p-1.5 rounded-xl border border-transparent hover:border-purple-600/10 hover:bg-purple-600/5 transition-all duration-300 group"
    >
      <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-black/5 p-1 flex-shrink-0 relative">
        <Image
          src={imgSrc}
          alt={`Free printable ${page.title} coloring page`}
          fill
          sizes="64px"
          onError={() => setImgSrc('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="200" viewBox="0 0 150 200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af">Coloring</text></svg>')}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center gap-1.5 min-w-0">
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 m-0 group-hover:text-purple-600 transition-colors">
          {page.title}
        </h4>
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1">
          <div className="flex items-center gap-1 group/stat hover:text-purple-600 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover/stat:opacity-100 group-hover/stat:scale-110 transition-all shrink-0">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{page.views !== undefined ? formatCount(page.views) : '0'}</span>
          </div>
          
          <div className="flex items-center gap-1 group/stat hover:text-orange-500 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover/stat:opacity-100 group-hover/stat:scale-110 transition-all shrink-0">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{page.downloads !== undefined ? formatCount(page.downloads) : '0'}</span>
          </div>
          
          <div className="flex items-center gap-1 group/stat hover:text-red-500 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover/stat:opacity-100 group-hover/stat:scale-110 transition-all shrink-0">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>{page.likes !== undefined ? formatCount(page.likes) : '0'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
