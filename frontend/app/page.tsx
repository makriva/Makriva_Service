import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import StatsSection from '@/components/StatsSection';
import HealthBenefits from '@/components/HealthBenefits';
import NutritionHighlight from '@/components/NutritionHighlight';
import WhyMakriva from '@/components/WhyMakriva';
import ComingSoon from '@/components/ComingSoon';
import InstagramReels from '@/components/InstagramReels';
import Testimonials from '@/components/Testimonials';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Buy Makhana Online | Premium Phool Makhana & Healthy Fox Nuts Snacks — MakRiva',
  description: 'Shop premium makhana online — dry roasted, flavoured & raw phool makhana (fox nuts / lotus seeds). High protein, low calorie, zero preservatives. Sourced directly from Bihar farms. Free delivery on orders above ₹499.',
  keywords: [
    'buy makhana online', 'premium makhana', 'phool makhana', 'healthy makhana',
    'raw makhana', 'roasted makhana', 'fox nuts online', 'lotus seeds snack',
    'healthy snacks india', 'high protein snacks', 'low calorie snacks',
    'makhana online india', 'natural makhana', 'buy fox nuts', 'makhana shop',
    'organic makhana', 'flavoured makhana', 'Bihar makhana', 'makhana snack',
  ],
  alternates: { canonical: 'https://makriva.in' },
  openGraph: {
    title: 'Buy Premium Makhana Online — Healthy Phool Makhana & Fox Nuts | MakRiva',
    description: 'Premium phool makhana — dry roasted, flavoured & raw. High protein, low calorie. Direct from Bihar farms. Free delivery ₹499+.',
    url: 'https://makriva.in',
    images: [{ url: '/images/makriva-hero-background.png', width: 1200, height: 630, alt: 'MakRiva Premium Makhana — Buy Healthy Fox Nuts Online' }],
  },
};

const homepageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'MakRiva Premium Makhana Products',
  description: 'Premium makhana snacks — dry roasted, flavoured & raw phool makhana (fox nuts). High protein, low calorie, zero preservatives.',
  url: 'https://makriva.in/products',
  numberOfItems: 3,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Premium Dry Roasted Makhana', url: 'https://makriva.in/products/dry-roasted-makhana' },
    { '@type': 'ListItem', position: 2, name: 'Phool Makhana — Large Grade', url: 'https://makriva.in/products/large-grade' },
    { '@type': 'ListItem', position: 3, name: 'Phool Makhana — Medium Grade', url: 'https://makriva.in/products/medium-grade' },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }} />
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedProducts />
        <HealthBenefits />
        <NutritionHighlight />
        <WhyMakriva />
        <ComingSoon />
        <InstagramReels />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
