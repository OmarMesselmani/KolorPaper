import { PrismaNeonHttp } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaNeonHttp(connectionString, {});

let PrismaClientClass: any;

if (process.env.IS_CLOUDFLARE === "true") {
  // On Cloudflare Workers, we MUST use the edge client to avoid WebAssembly.Module embedder errors
  PrismaClientClass = require("@prisma/client/edge").PrismaClient;
} else {
  // During local Next.js SSG build (Node.js), we MUST use the standard client to avoid wasm undefined errors
  PrismaClientClass = require("@prisma/client").PrismaClient;
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClientClass({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
