import { PrismaNeonHTTP } from "@prisma/adapter-neon";

import { PrismaClient } from "@prisma/client";

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

  const adapter = new PrismaNeonHTTP(connectionString, {});
  const client = new PrismaClient({ adapter });

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
