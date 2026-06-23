import { MetadataRoute } from 'next';
import {
  getSitemapCategories,
  getSitemapColoringPages,
  getSitemapBlogPosts,
  getSitemapTags,
} from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

  // Fetch all dynamic data in parallel; individual helpers already catch errors
  // and return [] on failure, so one broken source won't crash the whole sitemap.
  const [categories, pages, blogPosts, tags] = await Promise.all([
    getSitemapCategories(),
    getSitemapColoringPages(),
    getSitemapBlogPosts(),
    getSitemapTags(),
  ] as const);

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: cat.parentSlug ? `${siteUrl}/${cat.parentSlug}/${cat.slug}` : `${siteUrl}/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: page.subCategorySlug
      ? `${siteUrl}/${page.categorySlug}/${page.subCategorySlug}/${page.slug}`
      : `${siteUrl}/${page.categorySlug}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag.name)}`,
    lastModified: tag.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-of-use`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...categoryEntries,
    ...pageEntries,
    ...blogEntries,
    ...tagEntries,
  ];
}
