import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyMakriva from '@/components/WhyMakriva';
import Testimonials from '@/components/Testimonials';
import CTABanner from '@/components/CTABanner';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <WhyMakriva />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
