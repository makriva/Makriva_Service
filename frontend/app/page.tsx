import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import HealthBenefits from '@/components/HealthBenefits';
import WhyMakriva from '@/components/WhyMakriva';
import ComingSoon from '@/components/ComingSoon';
import Testimonials from '@/components/Testimonials';
import CTABanner from '@/components/CTABanner';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <HealthBenefits />
        <WhyMakriva />
        <ComingSoon />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
