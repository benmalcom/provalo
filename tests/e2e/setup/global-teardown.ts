import { FullConfig } from '@playwright/test';

/**
 * Global teardown runs once after all tests
 * Use this for:
 * - Cleaning up test database
 * - Stopping services
 * - Removing test files
 * - Final cleanup
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global Teardown: Starting...');

  try {
    // 1. Clean up test data
    // await cleanupTestDatabase();

    // 2. Remove test files
    // await removeTestFiles();

    // 3. Stop any services you started
    // await stopTestServices();

    // 4. Clean up environment
    delete process.env.PLAYWRIGHT_TEST_MODE;

    console.log('Global Teardown: Complete!');
  } catch (error) {
    console.error('Global Teardown: Failed!', error);
    // Don't throw - we don't want teardown to fail the build
  }
}

export default globalTeardown;
