/**
 * Auth Module
 *
 * Auth.js v5 configuration and utilities for Provalo
 *
 * For middleware/edge: import authConfig from '@/lib/auth/auth.config'
 * For everything else: import { auth, signIn, signOut } from '@/lib/auth'
 */

export { auth, signIn, signOut, handlers } from './auth';
export { default as authConfig } from './auth.config';

// Re-export types
export type { Session, User } from 'next-auth';
