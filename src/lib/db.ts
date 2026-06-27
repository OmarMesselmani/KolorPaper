import { PrismaD1 } from "@prisma/adapter-d1";
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

  // Extract directly from OpenNext Cloudflare Context
  const cfContext = (globalThis as any)[Symbol.for("__cloudflare-context__")];
  
  // D1 binding is expected to be named 'DB'
  const d1Binding = cfContext?.env?.DB || (process.env as any).DB;

  let client;

  if (d1Binding) {
    const adapter = new PrismaD1(d1Binding);
    client = new PrismaClient({ adapter });
  } else {
    // Fallback for local development or scripts (requires DATABASE_URL in .env)
    client = new PrismaClient();
  }

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
