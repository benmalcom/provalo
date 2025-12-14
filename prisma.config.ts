/**
 * Prisma Configuration for Provalo (Prisma v7)
 *
 * Configures database connection for CLI commands (migrate, db push, etc.)
 */

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Schema location
  schema: 'prisma/schema.prisma',

  // Migration settings
  migrations: {
    path: 'prisma/migrations',
  },

  // Database connection for CLI
  datasource: {
    // Use Turso URL if available, otherwise fall back to local SQLite
    url:
      process.env.TURSO_DATABASE_URL ||
      process.env.DATABASE_URL ||
      'file:./prisma/dev.db',
  },
});
