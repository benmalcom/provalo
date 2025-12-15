/**
 * Auth.js v5 Edge-Compatible Configuration
 *
 * This file contains only the edge-compatible parts of the auth config.
 * It does NOT include the Prisma adapter or any database operations.
 *
 * Used by: middleware.ts
 * Full config with adapter: auth.ts
 */

import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-compatible auth configuration
 * No database adapter, no Prisma imports
 */
const authConfig: NextAuthConfig = {
  providers: [
    // Only include OAuth providers here (they work on edge)
    // Email/Credentials providers need database access
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
  },

  callbacks: {
    // This runs on edge - keep it simple, no DB calls
    authorized({ auth, request }) {
      const isAuthenticated = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Public paths that don't require auth
      const publicPaths = [
        '/',
        '/login',
        '/register',
        '/verify-email',
        '/verify',
      ];
      const isPublicPath = publicPaths.some(
        path => pathname === path || pathname.startsWith('/verify/')
      );

      if (isPublicPath) {
        return true;
      }

      return isAuthenticated;
    },
  },
};

export default authConfig;
