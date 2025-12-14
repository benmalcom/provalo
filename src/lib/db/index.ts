/**
 * Prisma Client with Turso/LibSQL Support (Prisma v7)
 *
 * - Local development: Uses LibSQL with local file
 * - Production: Uses Turso (LibSQL cloud)
 */

import { PrismaClient } from '../../../prisma/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Production: Use Turso with auth token
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    return new PrismaClient({ adapter });
  }

  // Local development: Use LibSQL with local file (no auth needed)
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
