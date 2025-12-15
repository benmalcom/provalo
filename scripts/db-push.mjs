/**
 * Push Prisma schema to Turso database
 *
 * This script uses the LibSQL adapter to push schema changes
 * since `prisma db push` doesn't support libsql:// URLs directly
 */

import { execSync } from 'child_process';
import { createClient } from '@libsql/client';

async function pushSchema() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // If no Turso URL, use local SQLite with regular prisma db push
  if (!tursoUrl || !tursoUrl.startsWith('libsql://')) {
    console.log('[db-push] Using local SQLite, running prisma db push...');
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    return;
  }

  console.log('[db-push] Detected Turso database, pushing schema...');

  // Extract URL without authToken query param if present
  const url = tursoUrl.split('?')[0];
  const authToken = tursoToken || tursoUrl.split('authToken=')[1];

  if (!authToken) {
    throw new Error('TURSO_AUTH_TOKEN is required for Turso databases');
  }

  // Create LibSQL client
  const libsql = createClient({
    url,
    authToken,
  });

  // Generate migration SQL
  console.log('[db-push] Generating migration SQL...');

  try {
    const sql = execSync(
      'npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script',
      { encoding: 'utf-8' }
    );

    // Split into individual statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`[db-push] Executing ${statements.length} statements...`);

    for (const statement of statements) {
      try {
        await libsql.execute(statement + ';');
      } catch (err) {
        // Ignore "table already exists" errors
        if (err.message?.includes('already exists')) {
          console.log(`[db-push] Table already exists, skipping...`);
        } else {
          throw err;
        }
      }
    }

    console.log('[db-push] Schema pushed successfully!');
  } catch (err) {
    // If migrate diff fails, tables might already exist - that's ok
    if (err.message?.includes('already exists')) {
      console.log('[db-push] Schema already up to date');
    } else {
      throw err;
    }
  }

  libsql.close();
}

pushSchema().catch(err => {
  console.error('[db-push] Error:', err.message);
  process.exit(1);
});
