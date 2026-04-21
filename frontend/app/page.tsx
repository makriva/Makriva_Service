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

export default function HomePage() {
  return (
    <>
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
