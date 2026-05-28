import { remark } from 'remark';
import html from 'remark-html';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  coverImage: string;
  content?: string;
  contentHtml?: string;
  published?: boolean;
}

export async function getSortedPostsData(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/posts`, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`Failed to fetch posts from backend: ${res.statusText}`);
      return [];
    }
    const posts: BlogPost[] = await res.json();
    return posts;
  } catch (error) {
    console.error("Failed to fetch sorted posts data:", error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`Failed to fetch post from backend: ${res.statusText}`);
      return null;
    }
    const post: BlogPost = await res.json();
    
    if (!post || !post.content) {
      return {
        ...post,
        contentHtml: '',
      };
    }

    const processedContent = await remark()
      .use(html)
      .process(post.content);
    const contentHtml = processedContent.toString();

    return {
      ...post,
      contentHtml,
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}
