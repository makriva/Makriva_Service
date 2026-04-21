import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://makriva.in'),
  title: 'MakRiva — Premium Makhana',
  description: 'India\'s finest premium fox nuts (makhana). Roasted, flavoured, and naturally healthy.',
  keywords: 'makhana, foxnuts, lotus seeds, premium snacks, healthy snacks, makriva',
  icons: {
    icon: 'https://res.cloudinary.com/dsqzdclae/image/upload/f_auto,q_auto/v1776442607/makriva-v2/makriva-logo.png',
    shortcut: 'https://res.cloudinary.com/dsqzdclae/image/upload/f_auto,q_auto/v1776442607/makriva-v2/makriva-logo.png',
    apple: 'https://res.cloudinary.com/dsqzdclae/image/upload/f_auto,q_auto/v1776442607/makriva-v2/makriva-logo.png',
  },
  openGraph: {
    title: 'MakRiva — Premium Makhana',
    description: 'India\'s finest premium fox nuts.',
    images: ['/images/makriva-hero-background.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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
