import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blog-data';

interface LatestPostsProps {
  posts: BlogPost[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="w-full max-w-[1240px] mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-[#0F0728] dark:text-white leading-tight">
            From the{' '}
            <span className="bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Blog
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 text-base">
            Tips, ideas, and inspiration for colorists of all ages.
          </p>
        </div>
        <Link
          href="/blog"
          className="hidden sm:flex items-center gap-1.5 text-sm font-extrabold text-purple-600 dark:text-purple-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 group no-underline shrink-0 ml-4"
        >
          View All
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-purple-600/20 dark:hover:border-purple-500/30 transition-all duration-300 flex flex-col no-underline"
          >
            {/* Cover image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-tr from-purple-100 to-orange-50 dark:from-gray-800 dark:to-gray-850">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
                  📝
                </div>
              )}
              {/* Category badge */}
              <span className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-gray-900/90 text-purple-600 dark:text-purple-400 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                {post.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-grow">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {post.date}
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read More
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile "View All" link */}
      <div className="flex sm:hidden justify-center mt-8">
        <Link
          href="/blog"
          className="text-sm font-extrabold text-purple-600 dark:text-purple-400 hover:text-orange-500 transition-colors duration-200 no-underline"
        >
          View All Posts →
        </Link>
      </div>
    </section>
  );
}
