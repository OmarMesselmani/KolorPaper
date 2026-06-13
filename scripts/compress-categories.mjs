import { PrismaClient } from '@prisma/client';
import { AwsClient } from 'aws4fetch';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Try to load sharp, if it fails, error out
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error("sharp is not installed. Please install it first.");
  process.exit(1);
}

// Ensure env variables from .env.local are loaded if needed (usually run with dotenv or just directly in this script)
const R2_ENDPOINT = "https://519517ffba842fe1cff0e4901b6aac85.r2.cloudflarestorage.com";
const R2_ACCESS_KEY_ID = "0068d8d29d759dbd232ddb61fbcf544a";
const R2_SECRET_ACCESS_KEY = "a9fd22ec03d6253bec8633f0f7914dff2a43337e380fab7be79ae9992dbff35c";
const R2_BUCKET_NAME = "kolorpaper-uploads";
const R2_PUBLIC_URL = "https://pub-162912fe6efc44cda5df2c1c79b73435.r2.dev";

const aws = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  service: "s3",
  region: "auto",
});

const prisma = new PrismaClient();

async function run() {
  console.log("Fetching categories...");
  const categories = await prisma.category.findMany({
    where: {
      imageUrl: {
        contains: "/uploads/images/"
      }
    }
  });

  console.log(`Found ${categories.length} categories with /uploads/images/ URL.`);

  for (const cat of categories) {
    const originalUrl = cat.imageUrl;
    console.log(`\nProcessing: ${cat.title} (${originalUrl})`);
    
    const filename = originalUrl.split('/').pop();
    if (!filename) continue;
    
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    const thumbFileName = `thumb-${nameWithoutExt}.webp`;
    const tS3Key = `uploads/thumbnails/${thumbFileName}`;
    const tUploadUrl = `${R2_ENDPOINT.replace(/\/$/, '')}/${R2_BUCKET_NAME}/${tS3Key}`;

    // 1. Fetch original image
    console.log(`Downloading original image...`);
    const res = await fetch(originalUrl);
    if (!res.ok) {
      console.error(`Failed to download ${originalUrl}: ${res.statusText}`);
      continue;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Compress with sharp
    console.log(`Compressing to webp...`);
    try {
      const webpBuffer = await sharp(buffer)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      // 3. Upload to R2
      console.log(`Uploading to R2...`);
      const uploadRes = await aws.fetch(tUploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "image/webp",
          "Content-Length": webpBuffer.length.toString(),
        },
        body: webpBuffer,
      });

      if (!uploadRes.ok) {
        console.error(`Failed to upload thumbnail:`, await uploadRes.text());
      } else {
        console.log(`✅ Success! Created thumbnail for ${cat.title}`);
      }
    } catch (e) {
      console.error(`Sharp compression failed for ${cat.title}:`, e);
    }
  }

  console.log("\nDone!");
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
