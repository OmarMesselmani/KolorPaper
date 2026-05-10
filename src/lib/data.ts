import { Category, ColoringPage } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    title: "Animals",
    slug: "animals",
    description: "Wonderful animal coloring pages for children",
    imageUrl: "/categories/animals.jpg",
  },
  {
    id: "2",
    title: "Farm Animals",
    slug: "farm-animals",
    description: "Cute farm animal drawings",
    imageUrl: "/categories/farm.jpg",
    parentSlug: "animals",
  },
  {
    id: "3",
    title: "Space",
    slug: "space",
    description: "Explore the universe with space drawings",
    imageUrl: "/categories/space.jpg",
  },
];

export const coloringPages: ColoringPage[] = [
  {
    id: "101",
    title: "Brave Lion",
    slug: "brave-lion",
    imageUrl: "/coloring-pages/lion.png",
    thumbnailUrl: "/coloring-pages/lion-thumb.png",
    categorySlug: "animals",
    subCategorySlug: "farm-animals",
    description: "King of the jungle lion coloring page",
  },
  {
    id: "102",
    title: "Astronaut",
    slug: "astronaut",
    imageUrl: "/coloring-pages/astronaut.png",
    thumbnailUrl: "/coloring-pages/astronaut-thumb.png",
    categorySlug: "space",
    description: "An astronaut floating in the galaxy",
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
