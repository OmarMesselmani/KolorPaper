import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blog-data';

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 transition-all duration-400 hover:shadow-lg hover:-translate-y-1 hover:border-purple-600/30 dark:hover:border-purple-500/30 flex flex-col h-full"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-orange-500/10 dark:from-purple-500/20 dark:to-orange-500/20 z-10" />
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-5 sm:p-6 flex flex-col flex-grow relative z-20">
        <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
          <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 ltr:group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Read More
            <svg className="w-4 h-4 ltr:rotate-0 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
