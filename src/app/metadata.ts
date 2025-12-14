import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Provalo',
  description:
    'Convert crypto income into verifiable, institution-ready financial documents. Trusted by banks, landlords, and immigration authorities.',
  keywords: [
    'crypto income',
    'income verification',
    'crypto taxes',
    'blockchain',
    'financial documents',
    'income proof',
    'freelancer',
    'contractor',
    'visa application',
    'rental application',
  ],
  authors: [{ name: 'Provalo Team' }],
  creator: 'Provalo Team',
  publisher: 'Provalo',
  applicationName: 'Provalo',
  category: 'Finance & Business',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Provalo - Crypto Income Verification',
    description:
      'Convert crypto income into verifiable financial documents. Trusted by banks, landlords, and immigration authorities.',
    url: 'https://provalo.io',
    siteName: 'Provalo',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://provalo.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Provalo - Crypto Income Verification Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@provalo_io',
    site: '@provalo_io',
    images: ['https://provalo.io/twitter-image.png'],
  },
  manifest: '/manifest.json',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#06B6D4',
  colorScheme: 'dark',
};

// Structured data for SEO
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Provalo',
  description:
    'Crypto income verification platform for generating institution-ready financial documents',
  url: 'https://provalo.io',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'Crypto income verification',
    'PDF report generation',
    'Sender verification',
    'Multi-wallet support',
    'Institution-ready documents',
  ],
};
