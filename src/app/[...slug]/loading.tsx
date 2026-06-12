'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PageSkeleton, CategorySkeleton } from "@/components/Skeletons";

export default function Loading() {
  const pathname = usePathname();
  const [isCategory, setIsCategory] = useState<boolean | null>(null);

  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
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
      .catch((err) => {
        console.error("Failed to check category in loader:", err);
        if (active) {
          setIsCategory(false);
        }
      });

    return () => {
      active = false;
    };
  }, [lastSlug, segments.length]);

  // If path is empty, default to CategorySkeleton
  if (segments.length === 0) {
    return <CategorySkeleton />;
  }

  // 1 segment: always a parent category page (e.g. /animals)
  if (segments.length === 1) {
    return <CategorySkeleton />;
  }

  // 3 segments: always a coloring page (e.g. /animals/birds/parrot)
  if (segments.length === 3) {
    return <PageSkeleton />;
  }

  // 2 segments: could be a subcategory (e.g. /animals/birds) or a coloring page (e.g. /space/astronaut)
  if (segments.length === 2) {
    if (isCategory === null) {
      // While resolving, default to CategorySkeleton since most 2-segment pages are subcategories
      return <CategorySkeleton />;
    }
    return isCategory ? <CategorySkeleton /> : <PageSkeleton />;
  }

  // Fallback for length > 3
  return <PageSkeleton />;
}
