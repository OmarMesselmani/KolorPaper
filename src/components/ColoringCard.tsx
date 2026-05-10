'use client';

import Link from "next/link";
import { ColoringPage } from "@/types";

export default function ColoringCard({ page }: { page: ColoringPage }) {
  return (
    <Link href={`/${page.categorySlug}/${page.slug}`} className="coloring-card">
      <div className="coloring-image-wrapper">
        <img 
          src={page.thumbnailUrl} 
          alt={page.title} 
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x600?text=Coloring+Page')}
        />
      </div>
      <div className="coloring-info">
        <h3>{page.title}</h3>
        <span className="badge">Color</span>
      </div>
    </Link>
  );
}
