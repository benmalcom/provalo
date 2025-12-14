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
import type { Provider } from 'next-auth/providers';
import type { Adapter } from 'next-auth/adapters';
import type { User } from 'next-auth';
import { prisma } from '@/lib/db';

/**
 * Custom email template for magic links
 */
function html({ url }: { url: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: #0A0E14; margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 480px; margin: 0 auto; background-color: #141922; border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.06);">
          <div style="text-align: center; margin-bottom: 32px;">
            <span style="font-size: 28px; font-weight: 700; color: #F9FAFB;">pro<span style="color: #06B6D4;">v</span>alo</span>
          </div>
          
          <h1 style="color: #F9FAFB; font-size: 24px; font-weight: 600; margin: 0 0 16px; text-align: center;">
            Sign in to your account
          </h1>
          
          <p style="color: #9ca3af; font-size: 16px; line-height: 24px; margin: 0 0 32px; text-align: center;">
            Click the button below to sign in to Provalo. This link expires in 24 hours.
          </p>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${url}" style="display: inline-block; background-color: #06B6D4; color: white; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
              Sign in to Provalo
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
            If you didn't request this email, you can safely ignore it.
          </p>
          
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 32px 0;">
          
          <p style="color: #4b5563; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
            Button not working? Copy and paste this link:<br>
            <a href="${url}" style="color: #06B6D4; word-break: break-all;">${url}</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

function text({ url }: { url: string }) {
  return `Sign in to Provalo\n\nClick this link to sign in:\n${url}\n\nThis link expires in 24 hours.\n\nIf you didn't request this email, you can safely ignore it.`;
}

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
      console.log('[Auth] View emails at: https://ethereal.email/messages');
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
    // Production: Use Resend API
    console.log('[Auth] Using Resend for emails');
    providers.push(
      Resend({
        apiKey: resendApiKey,
        from: emailFrom,
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
