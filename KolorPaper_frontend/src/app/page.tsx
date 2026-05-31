import { getAllCategories } from "@/lib/data";
import { getSortedPostsData } from "@/lib/blog-data";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import CategoryGrid from "@/components/CategoryGrid";
import WhyUs from "@/components/WhyUs";
import LatestPosts from "@/components/LatestPosts";

export default async function Home() {
  const allCategories = await getAllCategories();
  const subCategories = allCategories.filter(c => c.parentSlug);
  const latestPosts = await getSortedPostsData();

  return (
    <>
      <Hero />
      <StatsBar />
      <CategoryGrid categories={subCategories} />
      <WhyUs />
      <LatestPosts posts={latestPosts} />
    </>
  );
}
