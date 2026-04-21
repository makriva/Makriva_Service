import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Terms & Conditions</h1>
          <div className="gold-line mx-0 mb-8" />
          <div className="prose prose-sm max-w-none text-gray-500 space-y-6">
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
            {[
              { title: '1. Acceptance of Terms', body: 'By accessing or using the MakRiva website and placing orders, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.' },
              { title: '2. Products & Pricing', body: 'All product prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to change prices without prior notice. Images are for representation only.' },
              { title: '3. Orders & Payments', body: 'By placing an order, you agree to provide accurate and complete information. We reserve the right to cancel orders due to pricing errors, stock unavailability, or suspected fraud.' },
              { title: '4. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorised use of your account at makrivatraders@gmail.com.' },
              { title: '5. Intellectual Property', body: 'All content on this website — including logos, images, text, and product descriptions — is the property of MakRiva Traders and may not be used without written permission.' },
              { title: '6. Limitation of Liability', body: 'MakRiva shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability is limited to the order value.' },
              { title: '7. Governing Law', body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Jind, Haryana.' },
              { title: '8. Contact', body: 'For questions regarding these Terms, contact us at makrivatraders@gmail.com.' },
            ].map(s => (
              <div key={s.title}>
                <h2 className="text-[#1C1C1C] font-semibold text-base mb-2">{s.title}</h2>
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
