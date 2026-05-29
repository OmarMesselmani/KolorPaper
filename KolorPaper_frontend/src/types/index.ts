export interface ColoringPage {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  thumbnailUrl: string;
  categorySlug: string;
  subCategorySlug?: string;
  description?: string;
  views?: number;
  downloads?: number;
  likes?: number;
  pdfUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  ageGroup?: 'kids' | 'adults';
  tags?: string[];
  createdAt?: string | Date;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentSlug?: string;
  views?: number;
  downloads?: number;
  likes?: number;
  createdAt?: string | Date;
  _count?: {
    pages: number;
    subPages: number;
  };
}
