import { remark } from 'remark';
import html from 'remark-html';
import DOMPurify from 'isomorphic-dompurify';
import { prisma } from '@/lib/db';

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
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" }
    });
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to fetch sorted posts data:", error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true }
    });
    
    if (!post) return null;
    
    if (!post.content) {
      return {
        ...post,
        contentHtml: '',
      } as BlogPost;
    }

    const processedContent = await remark()
      .use(html)
      .process(post.content);
    const rawContentHtml = processedContent.toString();
    
    // Sanitize the parsed HTML to prevent stored XSS
    const contentHtml = DOMPurify.sanitize(rawContentHtml);

    return {
      ...post,
      contentHtml,
    } as BlogPost;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}
