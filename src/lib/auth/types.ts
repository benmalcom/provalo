/**
 * NextAuth Type Declarations for Provalo
 *
 * Extends default NextAuth types with custom fields
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extends the built-in User type
   */
  interface User {
    id: string;
    name: string | null;
    email: string; // Required - used for identity
    avatar: string | null;
  }

  /**
   * Extends the built-in Session type
   */
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string; // Required
      avatar: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT type
   */
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    provider?: string;
  }
}
