/**
 * Prisma Configuration for Provalo (Prisma v7)
 */

import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load from .env.local (Next.js convention)
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  },
});
