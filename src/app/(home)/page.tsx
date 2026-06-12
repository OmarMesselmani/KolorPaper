import { getAllColoringPages, getAllCategories } from "@/lib/data";
import { getRandomPostsData } from "@/lib/blog-data";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import HomePagesGrid from "@/components/HomePagesGrid";
import HomeCategoriesGrid from "@/components/HomeCategoriesGrid";
import WhyUs from "@/components/WhyUs";
import LatestPosts from "@/components/LatestPosts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allPages = await getAllColoringPages();
  const allCategories = await getAllCategories();
  const subCategories = allCategories.filter(cat => cat.parentSlug);
  const randomizedPosts = await getRandomPostsData();

  return (
    <>
      <Hero />
      <StatsBar />
      <HomePagesGrid pages={allPages} />
      <HomeCategoriesGrid categories={subCategories} />
      <WhyUs />
      <LatestPosts posts={randomizedPosts} />
    </>
  );
}
