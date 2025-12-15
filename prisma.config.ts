/**
 * Prisma Configuration for Provalo (Prisma v7)
 *
 * Local: DATABASE_URL=file:./prisma/dev.db
 * Production: DATABASE_URL=libsql://...?authToken=...
 */

import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
