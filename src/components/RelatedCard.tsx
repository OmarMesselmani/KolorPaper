'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ColoringPage } from '@/types';

interface RelatedCardProps {
  page: ColoringPage;
}

export default function RelatedCard({ page }: RelatedCardProps) {
  const [imgSrc, setImgSrc] = useState(page.thumbnailUrl);
  const href = page.subCategorySlug
    ? `/${page.categorySlug}/${page.subCategorySlug}/${page.slug}`
    : `/${page.categorySlug}/${page.slug}`;

  return (
    <Link
      href={href}
      className="flex gap-4 p-2 rounded-2xl border border-transparent hover:border-purple-600/10 hover:bg-purple-600/5 transition-all duration-300 group"
    >
      <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden border border-black/5 p-1 flex-shrink-0 relative">
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
        <h4 className="font-bold text-sm text-gray-800 m-0 group-hover:text-purple-600 transition-colors truncate">
          {page.title}
        </h4>
        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
          Free Print
        </span>
      </div>
    </Link>
  );
}
