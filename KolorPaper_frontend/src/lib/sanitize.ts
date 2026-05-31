/**
 * Strips HTML tags from a string to prevent XSS.
 */
export const stripHtml = (text: string): string => {
  if (typeof text !== "string") return "";
  return text.replace(/<[^>]*>/g, "").trim();
};

/**
 * Validates and sanitizes a slug format.
 */
export const sanitizeSlug = (slug: string): string => {
  if (typeof slug !== "string") return "";
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
