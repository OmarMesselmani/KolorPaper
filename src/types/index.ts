export interface ColoringPage {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  thumbnailUrl: string;
  categorySlug: string;
  subCategorySlug?: string;
  description?: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentSlug?: string; // لتمثيل الأصناف الفرعية
}
