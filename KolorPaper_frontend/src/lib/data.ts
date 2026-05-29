import { Category, ColoringPage } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch all categories:", error);
    return [];
  }
}

export async function getCategories(parentSlug?: string): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const allCategories: Category[] = await res.json();
    return allCategories.filter((c) => (parentSlug ? c.parentSlug === parentSlug : !c.parentSlug));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch category by slug:", error);
    return null;
  }
}

export async function getColoringPages(
  categorySlug: string,
  filters?: { difficulty?: string; ageGroup?: string }
): Promise<ColoringPage[]> {
  try {
    const params = new URLSearchParams();
    params.append('categorySlug', categorySlug);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.ageGroup) params.append('ageGroup', filters.ageGroup);
    params.append('limit', '100'); // Or whatever max needed

    const res = await fetch(`${API_URL}/pages?${params.toString()}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.pages || [];
  } catch (error) {
    console.error("Failed to fetch coloring pages:", error);
    return [];
  }
}

export async function getAllColoringPages(): Promise<ColoringPage[]> {
  try {
    const res = await fetch(`${API_URL}/pages?limit=10000`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.pages || [];
  } catch (error) {
    console.error("Failed to fetch all coloring pages:", error);
    return [];
  }
}

export async function getColoringPageBySlug(slug: string): Promise<ColoringPage | null> {
  try {
    const res = await fetch(`${API_URL}/pages/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch coloring page by slug:", error);
    return null;
  }
}

export async function searchColoringPages(
  query: string,
  filters?: { difficulty?: string; ageGroup?: string }
): Promise<ColoringPage[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.ageGroup) params.append('ageGroup', filters.ageGroup);
    params.append('limit', '100');

    const res = await fetch(`${API_URL}/pages?${params.toString()}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.pages || [];
  } catch (error) {
    console.error("Failed to search coloring pages:", error);
    return [];
  }
}

export async function getPagesByTag(
  tag: string,
  filters?: { difficulty?: string; ageGroup?: string }
): Promise<ColoringPage[]> {
  try {
    const params = new URLSearchParams();
    params.append('tag', tag);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.ageGroup) params.append('ageGroup', filters.ageGroup);
    params.append('limit', '100');

    const res = await fetch(`${API_URL}/pages?${params.toString()}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.pages || [];
  } catch (error) {
    console.error("Failed to fetch coloring pages by tag:", error);
    return [];
  }
}
