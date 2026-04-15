import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Privacy Policy</h1>
          <div className="gold-line mx-0 mb-8" />
          <div className="prose prose-invert prose-sm max-w-none text-gray-400 space-y-6">
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
            {[
              { title: '1. Information We Collect', body: 'We collect information you provide directly, such as name, email, phone number, and delivery address when you create an account or place an order. We also collect payment-related information, though payment details are processed securely by Instamojo.' },
              { title: '2. How We Use Your Information', body: 'We use your information to process orders, provide customer support, send order updates, and occasionally share promotional offers. We never sell your personal data to third parties.' },
              { title: '3. Data Security', body: 'All data is stored securely. Payment transactions are processed through Instamojo\'s PCI-DSS compliant platform. We use industry-standard encryption for all data transmission.' },
              { title: '4. Cookies', body: 'We use essential cookies to maintain your session and cart. You can disable cookies in your browser settings, though this may affect site functionality.' },
              { title: '5. Third-Party Services', body: 'We use Cloudinary for image storage, Instamojo for payment processing, and may use Google Analytics for site improvement. Each service has its own privacy policy.' },
              { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal data. Contact us at hello@makriva.in to exercise these rights.' },
              { title: '7. Contact', body: 'For privacy-related queries, contact us at hello@makriva.in.' },
            ].map(s => (
              <div key={s.title}>
                <h2 className="text-white font-semibold text-base mb-2">{s.title}</h2>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
