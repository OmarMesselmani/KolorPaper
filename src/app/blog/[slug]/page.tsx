import { getPostData, getSortedPostsData } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);
  
  if (!post) {
    return { title: 'مقال غير موجود' };
  }
  
  return {
    title: `${post.title} | المدونة`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              الرئيسية
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 mx-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/blog" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                المدونة
              </Link>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-6">
          {post.category}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
              {post.author.charAt(0)}
            </div>
            <span>{post.author}</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
      </header>

      {/* Cover Image Placeholder */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/5">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-orange-500/5 dark:from-purple-500/10 dark:to-orange-500/10" />
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-20 h-20 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-purple-600 dark:prose-a:text-purple-400 hover:prose-a:text-purple-500 prose-img:rounded-2xl"
        dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
      />
      
      {/* Share Actions */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">شارك المقال</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium text-sm cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
            فيسبوك
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors font-medium text-sm cursor-pointer">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
            تويتر
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors font-medium text-sm cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" />
            </svg>
            واتساب
          </button>
        </div>
      </div>
    </article>
  );
}
