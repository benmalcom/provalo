/**
 * Push Prisma schema to Turso database
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

  const url = tursoUrl.split('?')[0];
  const authToken = tursoToken || tursoUrl.split('authToken=')[1];

  if (!authToken) {
    throw new Error('TURSO_AUTH_TOKEN is required for Turso databases');
  }

  const libsql = createClient({ url, authToken });

  console.log('[db-push] Generating SQL from schema...');

  try {
    const output = execSync(
      'npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script',
      { encoding: 'utf-8' }
    );

    // Filter out Prisma log lines, keep only SQL
    const sql = output
      .split('\n')
      .filter(line => {
        const t = line.trim();
        return (
          t &&
          !t.startsWith('Loaded') &&
          !t.startsWith('Prisma') &&
          !t.startsWith('✔')
        );
      })
      .join('\n');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    if (statements.length === 0) {
      const result = await libsql.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='User'"
      );
      if (result.rows.length > 0) {
        console.log('[db-push] Tables already exist.');
        libsql.close();
        return;
      }
      throw new Error('No SQL generated and no tables exist.');
    }

    console.log(`[db-push] Executing ${statements.length} statements...`);

    for (const statement of statements) {
      try {
        await libsql.execute(statement + ';');
        console.log(
          `[db-push] ✓ ${statement.substring(0, 50).replace(/\n/g, ' ')}...`
        );
      } catch (err) {
        if (err.message?.includes('already exists')) {
          console.log(`[db-push] Table already exists, skipping...`);
        } else {
          throw err;
        }
      }
    }

    console.log('[db-push] Schema pushed successfully!');
  } catch (err) {
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
