/**
 * Prisma Configuration for Provalo (Prisma v7)
 *
 * Local: SQLite file
 * Production: Turso (LibSQL)
 */

import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load from .env.local (Next.js convention)
dotenv.config({ path: '.env.local' });

// Determine database URL based on environment
function getDatabaseUrl(): string {
  // Production: Use Turso
  if (process.env.TURSO_DATABASE_URL) {
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (token) {
      // Append auth token to URL
      return `${url}?authToken=${token}`;
    }
    return url;
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
