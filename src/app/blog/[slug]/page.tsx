import { getPostData, getSortedPostsData } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ArticlePrintButton from '@/components/ArticlePrintButton';
import CopyLinkButton from '@/components/CopyLinkButton';

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }
  
  const url = `${siteUrl}/blog/${slug}`;
  const title = `${post.title} | KolorPaper Blog`;
  const description = post.excerpt || `Read ${post.title} on KolorPaper Blog.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'KolorPaper',
      type: 'article',
      images: post.coverImage ? [
        {
          url: post.coverImage,
          alt: post.title,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `${siteUrl}/blog/${slug}`;

  return (
    <>
      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt || '',
            "image": post.coverImage || undefined,
            "datePublished": post.date || undefined,
            "author": {
              "@type": "Organization",
              "name": "KolorPaper"
            },
            "publisher": {
              "@type": "Organization",
              "name": "KolorPaper",
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.svg`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${siteUrl}/blog/${slug}`
            }
          })
        }}
      />
      <article className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-8 print:hidden" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 mx-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/blog" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Blog
              </Link>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-sm mb-6 print:hidden">
          {post.category}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>
      </header>

      {/* Cover Image */}
      {post.coverImage ? (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/5 shadow-md">
          <Image 
            src={post.coverImage} 
            alt={post.title} 
            fill
            sizes="(max-width: 800px) 100vw, 800px"
            priority
            className="object-cover" 
          />
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-orange-500/5 dark:from-purple-500/10 dark:to-orange-500/10" />
          <div className="absolute inset-0 flex items-center justify-center">
             <svg className="w-20 h-20 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        className="prose prose-purple dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-purple-600 dark:prose-a:text-purple-400 hover:prose-a:text-purple-500 prose-img:rounded-2xl"
        dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
      />
      
      {/* Share Actions */}
      <div className="mt-16 pt-8 border-t border-purple-200 dark:border-purple-800 print:hidden">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Share Article</h3>
        <div className="flex gap-4">
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all hover:scale-110 duration-200 cursor-pointer"
            aria-label="Share on Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a>
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteUrl}/blog/${slug}`)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-gray-50 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all hover:scale-110 duration-200 cursor-pointer"
            aria-label="Share on X"
          >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${siteUrl}/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40 transition-all hover:scale-110 duration-200 cursor-pointer"
            aria-label="Share on WhatsApp"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" />
            </svg>
          </a>
          <CopyLinkButton url={articleUrl} />
          <div className="w-px h-11 bg-gray-200 dark:bg-gray-800 mx-1"></div>
          <ArticlePrintButton />
        </div>
      </div>
    </article>
    </>
  );
}
