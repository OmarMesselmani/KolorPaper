import { remark } from 'remark';
import html from 'remark-html';
import sanitizeHtml from 'sanitize-html';
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
    let contentHtml = sanitizeHtml(rawContentHtml, {
      allowedTags: [
        'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4',
        'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'blockquote', 'dd', 'div',
        'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'main', 'ol', 'p', 'pre',
        'ul', 'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
        'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp',
        'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'img'
      ],
      allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      },
    });

    // Wrap references section in a styled div
    const referencesRegex = /(<h[1-6][^>]*>[ \t]*(References|المراجع|مراجع)[ \t]*<\/h[1-6]>)/i;
    const match = contentHtml.match(referencesRegex);
    if (match && match.index !== undefined) {
      const headingHtml = match[0];
      const index = match.index;
      const beforeReferences = contentHtml.substring(0, index);
      const afterReferences = contentHtml.substring(index + headingHtml.length);
      contentHtml = `${beforeReferences}<hr class="references-separator" />${headingHtml}<div class="post-references">${afterReferences}</div>`;
    }

    return {
      ...post,
      contentHtml,
    } as BlogPost;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}
