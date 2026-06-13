import { getHomePageData, cachedGetAllCategories } from "@/lib/data";
import { getRandomPostsData } from "@/lib/blog-data";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import HomePagesGrid from "@/components/HomePagesGrid";
import HomeCategoriesGrid from "@/components/HomeCategoriesGrid";
import WhyUs from "@/components/WhyUs";
import LatestPosts from "@/components/LatestPosts";

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
      <StatsBar />
      <HomePagesGrid
        newest={homeData.newest}
        mostDownloaded={homeData.mostDownloaded}
        mostLiked={homeData.mostLiked}
      />
      <HomeCategoriesGrid categories={subCategories} />
      <WhyUs />
      <LatestPosts posts={randomizedPosts} />
    </>
  );
}

