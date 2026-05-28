import { prisma } from "../src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to frontend blog folder
const frontendBlogDir = path.resolve(__dirname, "../../KolorPaper_frontend/content/blog");

function parseFrontmatter(fileContents: string) {
  const lines = fileContents.split(/\r?\n/);
  const metadata: any = {};
  let inFrontmatter = false;
  const yamlLines: string[] = [];
  const contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "---") {
      if (!inFrontmatter && yamlLines.length === 0) {
        inFrontmatter = true;
      } else if (inFrontmatter) {
        inFrontmatter = false;
      }
      continue;
    }

    if (inFrontmatter) {
      yamlLines.push(line);
    } else {
      contentLines.push(line);
    }
  }

  yamlLines.forEach(line => {
    const colonIdx = line.indexOf(":");
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      metadata[key] = value;
    }
  });

  const content = contentLines.join("\n").trim();
  return { metadata, content };
}

async function migrate() {
  console.log("Starting blog posts migration...");

  if (!fs.existsSync(frontendBlogDir)) {
    console.error(`Blog directory not found: ${frontendBlogDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(frontendBlogDir).filter(f => f.endsWith(".md"));
  console.log(`Found ${files.length} posts to migrate.`);

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(frontendBlogDir, file);
    const fileContents = fs.readFileSync(filePath, "utf-8");

    const { metadata, content } = parseFrontmatter(fileContents);

    // Map coverImage to backend uploads path
    let coverImage = metadata.coverImage || "";
    if (coverImage.includes("colored-pencils")) {
      coverImage = "http://localhost:5000/uploads/images/colored-pencils.png";
    } else if (coverImage.includes("adult-coloring")) {
      coverImage = "http://localhost:5000/uploads/images/adult-coloring.png";
    }

    console.log(`Migrating post: "${metadata.title}" (slug: ${slug})`);

    await prisma.blogPost.upsert({
      where: { slug },
      update: {
        title: metadata.title,
        date: metadata.date,
        author: metadata.author || "KolorPaper Team",
        category: metadata.category || "General",
        excerpt: metadata.excerpt || "",
        coverImage,
        content,
        published: true,
      },
      create: {
        slug,
        title: metadata.title,
        date: metadata.date,
        author: metadata.author || "KolorPaper Team",
        category: metadata.category || "General",
        excerpt: metadata.excerpt || "",
        coverImage,
        content,
        published: true,
      }
    });
  }

  console.log("Blog migration complete successfully!");
}

migrate()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
