/**
 * Auth.js v5 Full Configuration for Provalo
 *
 * This file includes the Prisma adapter and all providers.
 * Use this for: API routes, server components, server actions
 *
 * For middleware, use auth.config.ts instead (edge-compatible)
 */

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
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
import authConfig from './auth.config';

/**
 * Build additional providers (email, credentials) that need database
 */
function getAdditionalProviders(): Provider[] {
  const providers: Provider[] = [];

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'Provalo <onboarding@resend.dev>';
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // Dev mode: Use Ethereal (fake SMTP that captures emails)
    const etherealUser = process.env.ETHEREAL_EMAIL;
    const etherealPass = process.env.ETHEREAL_PASSWORD;

    if (etherealUser && etherealPass) {
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
            console.log(
              `\n📧 Magic Link sent to ${email}\n👉 View: ${previewUrl}\n`
            );
          },
        })
      );
    } else {
      // Fallback: just log magic link to console
      providers.push(
        Nodemailer({
          server: 'smtp://localhost:1025',
          from: emailFrom,
          async sendVerificationRequest({ identifier: email, url }) {
            console.log(`\n📧 Magic Link for ${email}:\n${url}\n`);
          },
        })
      );
    }
  } else if (resendApiKey) {
    // Production: Use Resend API
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
  }

  // Development-only: Credentials provider for testing
  if (isDev) {
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
        authorize: async (credentials): Promise<User | null> => {
          if (!credentials?.email) return null;

          const email = credentials.email as string;

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
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [...authConfig.providers, ...getAdditionalProviders()],
  callbacks: {
    ...authConfig.callbacks,

    redirect({ url, baseUrl }) {
      if (url.startsWith('/') && url !== '/') {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl) && url !== baseUrl && url !== `${baseUrl}/`) {
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
  debug: false,
});
