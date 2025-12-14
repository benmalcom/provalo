import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      avatar?: string | null;
    } & Omit<DefaultSession['user'], 'image'>;
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    avatar?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    avatar?: string | null;
  }
}
