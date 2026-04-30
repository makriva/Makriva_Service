import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Makhana | Roasted, Flavoured & Raw Phool Makhana',
  description: "Browse MakRiva's full range of premium makhana. Dry roasted makhana, rock salt & pepper, pudina fresh, chilli cheese and more. All natural, zero preservatives, high protein, low calorie.",
  keywords: [
    'buy makhana', 'makhana online shop', 'flavoured makhana', 'dry roasted makhana',
    'rock salt makhana', 'pudina makhana', 'masala makhana', 'chilli makhana',
    'premium phool makhana', 'large grade makhana', 'healthy snack online india',
    'fox nuts shop', 'lotus seeds online', 'makhana varieties', 'best makhana brand',
  ],
  alternates: { canonical: 'https://makriva.in/products' },
  openGraph: {
    title: 'Shop All Makhana — Premium Roasted & Flavoured Fox Nuts | MakRiva',
    description: "Browse MakRiva's complete range of premium makhana snacks. All natural, no preservatives. Free delivery ₹499+.",
    url: 'https://makriva.in/products',
    images: [{ url: '/images/makriva-hero-background.png', width: 1200, height: 630, alt: 'MakRiva Makhana Products' }],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
