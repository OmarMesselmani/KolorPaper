import { MetadataRoute } from 'next';
import { getAllCategories, getAllColoringPages } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

  const categories = await getAllCategories();
  const pages = await getAllColoringPages();

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: cat.parentSlug ? `${siteUrl}/${cat.parentSlug}/${cat.slug}` : `${siteUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: page.subCategorySlug 
      ? `${siteUrl}/${page.categorySlug}/${page.subCategorySlug}/${page.slug}` 
      : `${siteUrl}/${page.categorySlug}/${page.slug}`,
    lastModified: new Date(page.createdAt || new Date()),
    changeFrequency: 'monthly',
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
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...categoryEntries,
    ...pageEntries,
  ];
}
