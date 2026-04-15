import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://makriva.in'),
  title: 'MakRiva — Premium Makhana',
  description: 'India\'s finest premium fox nuts (makhana). Roasted, flavoured, and naturally healthy.',
  keywords: 'makhana, foxnuts, lotus seeds, premium snacks, healthy snacks, makriva',
  openGraph: {
    title: 'MakRiva — Premium Makhana',
    description: 'India\'s finest premium fox nuts.',
    images: ['/images/makriva-hero-background.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
