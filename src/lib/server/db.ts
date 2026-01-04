import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 *
 * EXPLANATION:
 * In development mode, Vite restarts the dev server often, which would create multiple
 * Prisma Client instances (bad!). This singleton pattern ensures we reuse the same
 * connection across restarts.
 *
 * The `globalThis` trick tells Node: "Keep this object alive even when the module reloads"
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
