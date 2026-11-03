import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let client: PrismaClient | null = null;

try {
  client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
} catch (error) {
  console.warn("⚠️ Prisma client could not be initialized (falling back to mock data):", error);
  client = null;
}

export const prisma = client as unknown as PrismaClient;


