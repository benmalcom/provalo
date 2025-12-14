import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { Providers } from '@/providers/Providers';
import {
  metadata as siteMetadata,
  viewport as siteViewport,
  jsonLd,
} from './metadata';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get cookies for SSR hydration
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  );
}
