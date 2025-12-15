/**
 * Auth Middleware for Provalo (Auth.js v5)
 *
 * Uses edge-compatible auth config (no Prisma/database).
 * Protects dashboard routes and redirects unauthenticated users to login.
 */

import NextAuth from 'next-auth';
import authConfig from '@/lib/auth/auth.config';

// Create a separate NextAuth instance for middleware (edge-compatible)
const { auth } = NextAuth(authConfig);

export default auth;

/**
 * Matcher configuration
 *
 * Protected routes:
 * - / (dashboard home)
 * - /transactions
 * - /wallets
 * - /reports
 * - /settings
 *
 * Excluded from middleware:
 * - /api/auth/* (NextAuth routes)
 * - /login, /register, /verify-email (public auth pages)
 * - /verify/* (public report verification)
 * - /_next/* (Next.js internals)
 * - Static assets
 */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - / (home page - public)
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     * - login, register, verify pages
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts|login|register|verify|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
