import { FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Global setup for E2E tests
 * - Loads .env.test
 * - Validates required environment variables
 * - Checks server availability
 */
async function globalSetup(config: FullConfig) {
  console.log('🎭 Global Setup: Starting...');

  // Load .env.test file
  const envTestPath = path.resolve(process.cwd(), '.env.test');

  if (fs.existsSync(envTestPath)) {
    console.log('📁 Loading .env.test...');
    dotenv.config({ path: envTestPath });
  } else {
    console.log(' No .env.test found - using existing environment');
  }

  // Validate Privy test credentials
  validatePrivyCredentials();

  // Check if server is running (optional)
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  await checkServerAvailability(baseURL);

  console.log('Global Setup: Complete!\n');
}

/**
 * Validate Privy test credentials
 */
function validatePrivyCredentials() {
  const email = process.env.PRIVY_TEST_EMAIL;
  const otp = process.env.PRIVY_TEST_OTP;

  const hasValidEmail = email && !email.includes('XXXX');
  const hasValidOtp = otp && otp !== '000000' && otp.length === 6;

  if (hasValidEmail && hasValidOtp) {
    console.log(' Privy test credentials: Configured');
    console.log(`   Email: ${email?.substring(0, 10)}...`);
  } else {
    console.log('Privy test credentials: Not configured');
    console.log('   Authenticated tests will be skipped.');
    console.log('   To enable:');
    console.log(
      '   1. Go to Privy Dashboard > User Management > Authentication > Advanced'
    );
    console.log('   2. Enable "Enable test accounts"');
    console.log('   3. Copy credentials to .env.test:');
    console.log('      PRIVY_TEST_EMAIL=test-XXXX@privy.io');
    console.log('      PRIVY_TEST_OTP=XXXXXX');
  }

  // Set a flag that tests can check
  process.env.PRIVY_CREDENTIALS_VALID =
    hasValidEmail && hasValidOtp ? 'true' : 'false';
}

/**
 * Check if dev server is running
 */
async function checkServerAvailability(baseURL: string) {
  // Skip check in CI or if explicitly disabled
  if (process.env.CI || process.env.SKIP_SERVER_CHECK === 'true') {
    console.log('⚡ Skipping server check (CI mode or disabled)');
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(baseURL, {
      signal: controller.signal,
      method: 'HEAD',
    });

    clearTimeout(timeout);

    if (response.ok || response.status === 304) {
      console.log(`Server available at ${baseURL}`);
    } else {
      console.log(`Server returned ${response.status} at ${baseURL}`);
    }
  } catch (error) {
    console.log(`  Server check failed for ${baseURL}`);
    console.log('   Make sure your dev server is running: npm run dev');
  }
}

export default globalSetup;
