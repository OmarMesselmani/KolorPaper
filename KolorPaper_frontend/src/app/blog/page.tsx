import { getSortedPostsData } from '@/lib/blog-data';
import BlogCard from '@/components/BlogCard';

export const metadata = {
  title: 'Blog | KolorPaper',
  description: 'Useful articles and coloring tips for kids and adults.',
};

export default async function BlogIndex() {
  const allPosts = await getSortedPostsData();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="mb-12 text-center md:text-left rtl:md:text-right ltr:md:text-left">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          Blog
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 dark:from-purple-400 dark:to-orange-400 inline-block mx-2">
            & Articles
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Discover useful tips, guides, and amazing benefits of coloring for kids and adults.
        </p>
      </div>

      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {allPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-white/5">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No articles available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
