/**
 * Auth.js v5 Configuration for Provalo
 *
 * Providers: Google, GitHub, Email (Magic Link via Resend)
 * Database: Prisma Adapter (SQLite/Turso)
 */

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Resend from 'next-auth/providers/resend';
import Nodemailer from 'next-auth/providers/nodemailer';
import Credentials from 'next-auth/providers/credentials';
import * as nodemailer from 'nodemailer';
import { Resend as ResendClient } from 'resend';
import type { Provider } from 'next-auth/providers';
import type { Adapter } from 'next-auth/adapters';
import type { User } from 'next-auth';
import { prisma } from '@/lib/db';
import {
  getMagicLinkHtml,
  getMagicLinkText,
  MAGIC_LINK_SUBJECT,
} from './email-templates';

/**
 * Build providers array based on available environment variables
 */
function getProviders(): Provider[] {
  const providers: Provider[] = [];

  // Google OAuth
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  // GitHub OAuth
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    );
  }

  // Email Provider (Magic Link)
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'Provalo <onboarding@resend.dev>';
  const isDev = process.env.NODE_ENV === 'development';

  console.log('[Auth] Environment:', process.env.NODE_ENV);

  if (isDev) {
    // Dev mode: Use Ethereal (fake SMTP that captures emails)
    // Create account at https://ethereal.email/ and add credentials to .env.local
    const etherealUser = process.env.ETHEREAL_EMAIL;
    const etherealPass = process.env.ETHEREAL_PASSWORD;

    if (etherealUser && etherealPass) {
      console.log('[Auth] Using Ethereal email for dev');
      console.log('[Auth] 📬 View emails at: https://ethereal.email/login');
      providers.push(
        Nodemailer({
          server: {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
              user: etherealUser,
              pass: etherealPass,
            },
          },
          from: `Provalo <${etherealUser}>`,
          async sendVerificationRequest({ identifier: email, url, provider }) {
            const transport = nodemailer.createTransport({
              host: 'smtp.ethereal.email',
              port: 587,
              auth: {
                user: etherealUser,
                pass: etherealPass,
              },
            });

            const result = await transport.sendMail({
              to: email,
              from: provider.from,
              subject: MAGIC_LINK_SUBJECT,
              text: getMagicLinkText({ url }),
              html: getMagicLinkHtml({ url, email }),
            });

            // Log the Ethereal URL to view the email
            const previewUrl = nodemailer.getTestMessageUrl(result);
            console.log('\n');
            console.log(
              '╔════════════════════════════════════════════════════════════╗'
            );
            console.log(
              '║              📧 Magic Link Email Sent                      ║'
            );
            console.log(
              '╠════════════════════════════════════════════════════════════╣'
            );
            console.log(`║ To: ${email}`);
            console.log('║');
            console.log('║ 👉 View email at:');
            console.log(`║ ${previewUrl}`);
            console.log(
              '╚════════════════════════════════════════════════════════════╝'
            );
            console.log('\n');
          },
        })
      );
    } else {
      // Fallback: just log to console
      console.log(
        '[Auth] No Ethereal credentials - logging magic links to console'
      );
      console.log(
        '[Auth] To use Ethereal, add ETHEREAL_EMAIL and ETHEREAL_PASSWORD to .env.local'
      );
      providers.push(
        Nodemailer({
          server: 'smtp://localhost:1025',
          from: emailFrom,
          async sendVerificationRequest({ identifier: email, url }) {
            console.log('\n');
            console.log(
              '╔════════════════════════════════════════════════════════════╗'
            );
            console.log(
              '║                    📧 MAGIC LINK                           ║'
            );
            console.log(
              '╠════════════════════════════════════════════════════════════╣'
            );
            console.log(`║ To: ${email}`);
            console.log('║');
            console.log('║ Click this URL to sign in:');
            console.log(`║ ${url}`);
            console.log(
              '╚════════════════════════════════════════════════════════════╝'
            );
            console.log('\n');
          },
        })
      );
    }
  } else if (resendApiKey) {
    // Production: Use Resend API with custom template
    console.log('[Auth] Using Resend for emails');
    providers.push(
      Resend({
        apiKey: resendApiKey,
        from: emailFrom,
        async sendVerificationRequest({ identifier: email, url, provider }) {
          const resend = new ResendClient(resendApiKey);

          await resend.emails.send({
            from: provider.from as string,
            to: email,
            subject: MAGIC_LINK_SUBJECT,
            html: getMagicLinkHtml({ url, email }),
            text: getMagicLinkText({ url }),
          });
        },
      })
    );
  } else {
    console.warn('[Auth] No email provider configured!');
  }

  // Development-only: Credentials provider for testing
  if (process.env.NODE_ENV === 'development') {
    providers.push(
      Credentials({
        name: 'Dev Login',
        credentials: {
          email: {
            label: 'Email',
            type: 'email',
            placeholder: 'test@example.com',
          },
        },
        authorize: async (credentials, _request): Promise<User | null> => {
          if (!credentials?.email) return null;

          const email = credentials.email as string;

          // Find or create user for dev testing
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: email.split('@')[0],
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          };
        },
      })
    );
  }

  return providers;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: getProviders(),

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
    redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/wallets`;
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.avatar = token.avatar as string | null;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
});
