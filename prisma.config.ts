/**
 * Prisma Configuration for Provalo (Prisma v7)
 *
 * Local: SQLite file
 * Production: Turso (LibSQL)
 */

import { defineConfig } from 'prisma/config';

// Determine database URL based on environment
function getDatabaseUrl(): string {
  // Production: Use Turso
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    return `${url}?authToken=${token}`;
  }

  // Local development: SQLite file
  return process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
