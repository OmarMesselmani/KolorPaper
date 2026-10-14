import { getHomePageData, cachedGetAllCategories } from "@/lib/data";
import { getRandomPostsData } from "@/lib/blog-data";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import HomePagesGrid from "@/components/HomePagesGrid";
import HomeCategoriesCarousel from "@/components/HomeCategoriesCarousel";
import WhyUs from "@/components/WhyUs";
import LatestPosts from "@/components/LatestPosts";

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  // Run all data fetches in parallel
  const [homeData, allCategories, randomizedPosts] = await Promise.all([
    getHomePageData(),
    cachedGetAllCategories(),
    getRandomPostsData(),
  ]);
  const subCategories = allCategories.filter(cat => cat.parentSlug);

  return (
    <>
      <Hero />
      <HomeCategoriesCarousel categories={subCategories} />
      <HomePagesGrid
        newest={homeData.newest}
        mostDownloaded={homeData.mostDownloaded}
        mostLiked={homeData.mostLiked}
      />
      <StatsBar />
      <WhyUs />
      <LatestPosts posts={randomizedPosts} />
    </>
  );
}

