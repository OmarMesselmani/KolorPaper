import { Category, ColoringPage } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    title: "حيوانات",
    slug: "animals",
    description: "صور تلوين حيوانات رائعة للأطفال",
    imageUrl: "/categories/animals.jpg",
  },
  {
    id: "2",
    title: "حيوانات المزرعة",
    slug: "farm-animals",
    description: "رسومات حيوانات المزرعة اللطيفة",
    imageUrl: "/categories/farm.jpg",
    parentSlug: "animals",
  },
  {
    id: "3",
    title: "فضاء",
    slug: "space",
    description: "استكشف الكون مع رسومات الفضاء",
    imageUrl: "/categories/space.jpg",
  },
];

export const coloringPages: ColoringPage[] = [
  {
    id: "101",
    title: "أسد شجاع",
    slug: "brave-lion",
    imageUrl: "/coloring-pages/lion.png",
    thumbnailUrl: "/coloring-pages/lion-thumb.png",
    categorySlug: "animals",
    subCategorySlug: "farm-animals",
    description: "صورة أسد ملك الغابة للتلوين",
  },
  {
    id: "102",
    title: "رائد فضاء",
    slug: "astronaut",
    imageUrl: "/coloring-pages/astronaut.png",
    thumbnailUrl: "/coloring-pages/astronaut-thumb.png",
    categorySlug: "space",
    description: "رائد فضاء يسبح في المجرة",
  },
];

export async function getCategories(parentSlug?: string) {
  return categories.filter((c) => c.parentSlug === parentSlug);
}

export async function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export async function getColoringPages(categorySlug: string) {
  return coloringPages.filter(
    (p) => p.categorySlug === categorySlug || p.subCategorySlug === categorySlug
  );
}

export async function getColoringPageBySlug(slug: string) {
  return coloringPages.find((p) => p.slug === slug);
}
