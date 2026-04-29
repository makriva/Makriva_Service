import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

const LOGO_URL = 'https://res.cloudinary.com/dsqzdclae/image/upload/f_auto,q_auto/v1776442607/makriva-v2/makriva-logo.png';
const SITE_URL = 'https://makriva.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MakRiva — Premium Makhana | Fox Nuts from Bihar\'s Farms',
    template: '%s | MakRiva',
  },
  description: 'Buy premium makhana (fox nuts / lotus seeds) online. Dry roasted, flavoured & raw grades sourced directly from Bihar\'s finest farms. Natural, healthy, delicious. Free delivery above ₹499.',
  keywords: ['makhana', 'fox nuts', 'lotus seeds', 'phool makhana', 'premium makhana', 'healthy snacks', 'makriva', 'roasted makhana', 'buy makhana online', 'Bihar makhana'],
  authors: [{ name: 'MakRiva', url: SITE_URL }],
  creator: 'MakRiva',
  publisher: 'MakRiva',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  icons: {
    icon: LOGO_URL,
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'MakRiva',
    title: 'MakRiva — Premium Makhana | Fox Nuts from Bihar\'s Farms',
    description: 'Premium makhana sourced directly from Bihar\'s farms. Naturally healthy, irresistibly delicious. 4.8★ · 2,000+ customers.',
    images: [{ url: '/images/makriva-hero-background.png', width: 1200, height: 630, alt: 'MakRiva Premium Makhana' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MakRiva — Premium Makhana',
    description: 'Premium makhana from Bihar\'s finest farms. Natural, healthy, delicious.',
    images: ['/images/makriva-hero-background.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'MakRiva',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
        width: 200,
        height: 200,
      },
      sameAs: [
        'https://www.instagram.com/makriva.in',
        'https://www.facebook.com/profile.php?id=61583943211780',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-83980-30577',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: 'Haryana',
        addressLocality: 'Jind',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'MakRiva',
      description: 'Premium makhana (fox nuts) sourced directly from Bihar\'s farms.',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/products?search={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: { background: '#111', color: '#fff', border: '1px solid #222' },
                success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
