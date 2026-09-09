'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  PageSkeleton,
  CategorySkeleton,
  HomeSkeleton,
  AllCategoriesSkeleton,
  GridSkeleton,
} from '@/components/Skeletons';

function RouteSkeleton() {
  const pathname = usePathname();
  const [isCategory, setIsCategory] = useState<boolean | null>(null);

  const segments = pathname ? pathname.split('/').filter(Boolean) : [];
  const lastSlug = segments[segments.length - 1];

  useEffect(() => {
    if (segments.length !== 2 || !lastSlug) return;

    let active = true;
    fetch(`/api/check-category?slug=${encodeURIComponent(lastSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setIsCategory(data.isCategory);
        }
      })
      .catch(() => {
        if (active) {
          setIsCategory(false);
        }
      });

    return () => {
      active = false;
    };
  }, [lastSlug, segments.length]);

  // Home Page
  if (!pathname || pathname === '/' || segments.length === 0) {
    return <HomeSkeleton />;
  }

  // All Categories index
  if (pathname === '/categories') {
    return <AllCategoriesSkeleton />;
  }

  // Search or Tags
  if (pathname === '/search' || pathname.startsWith('/tags/')) {
    return <GridSkeleton />;
  }

  // Blog
  if (pathname.startsWith('/blog')) {
    return <CategorySkeleton />;
  }

  // 1 segment: always parent category page (e.g. /characters)
  if (segments.length === 1) {
    return <CategorySkeleton />;
  }

  // 3+ segments: coloring page (e.g. /characters/royalty/young-prince-with-medal-coloring-page)
  if (segments.length >= 3) {
    return <PageSkeleton />;
  }

  // 2 segments: could be subcategory or coloring page
  if (segments.length === 2) {
    if (isCategory === null) {
      return <CategorySkeleton />;
    }
    return isCategory ? <CategorySkeleton /> : <PageSkeleton />;
  }

  return <PageSkeleton />;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging
    console.error("Application error encountered:", error);

    const reloadKey = 'kolorpaper_auto_reload_on_error';
    const lastReloadTime = sessionStorage.getItem(reloadKey);
    const now = Date.now();

    // If no reload in the last 3 seconds, reload immediately
    if (!lastReloadTime || now - parseInt(lastReloadTime, 10) > 3000) {
      sessionStorage.setItem(reloadKey, now.toString());
      window.location.reload();
    } else {
      // If caught in an ongoing error state, retry after 3 seconds
      const timer = setTimeout(() => {
        sessionStorage.setItem(reloadKey, Date.now().toString());
        window.location.reload();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return <RouteSkeleton />;
}
