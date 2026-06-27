import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
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

function getConnectionString() {
  if (process.env.HYPERDRIVE && typeof process.env.HYPERDRIVE === 'string') {
    return process.env.HYPERDRIVE;
  }
  if (process.env.HYPERDRIVE && typeof process.env.HYPERDRIVE === 'object') {
    return (process.env.HYPERDRIVE as any).connectionString;
  }
  return process.env.DATABASE_URL;
}

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_URL or HYPERDRIVE is not configured in environment variables");
  }

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const adapter = new PrismaPg(pool);
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
