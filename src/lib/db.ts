import { PrismaNeonHttp } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

let cachedPrisma: any;

function getPrismaClient() {
  if (cachedPrisma) return cachedPrisma;
  if (globalForPrisma.prisma) {
    cachedPrisma = globalForPrisma.prisma;
    return cachedPrisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured in environment variables");
  }

  const adapter = new PrismaNeonHttp(connectionString, {});
  let PrismaClientClass: any;

  if (process.env.IS_CLOUDFLARE === "true") {
    PrismaClientClass = require("@prisma/client/edge").PrismaClient;
  } else {
    PrismaClientClass = require("@prisma/client").PrismaClient;
  }

  const client = new PrismaClientClass({ adapter });

  cachedPrisma = client;
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = new Proxy({} as any, {
  get: (target, prop) => {
    return getPrismaClient()[prop];
  },
});
