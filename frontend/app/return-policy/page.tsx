import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Return & Refund Policy</h1>
          <div className="gold-line mx-0 mb-8" />
          <div className="prose prose-sm max-w-none text-gray-500 space-y-6">
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
            {[
              { title: '1. Return Eligibility', body: 'We accept returns within 7 days of delivery if the product is damaged, defective, or significantly different from what was ordered. Products must be unused and in original packaging.' },
              { title: '2. Non-Returnable Items', body: 'Opened/partially consumed food products cannot be returned for hygiene reasons, unless there is a quality issue. Discount/sale items are not eligible for return.' },
              { title: '3. How to Initiate a Return', body: 'Email us at makrivatraders@gmail.com with your order number, a description of the issue, and photos if applicable. Our team will review and respond within 48 hours.' },
              { title: '4. Refund Process', body: 'Approved refunds are processed within 5–7 business days to your original payment method. For COD orders, refunds are issued via bank transfer.' },
              { title: '5. Replacement', body: 'For damaged or defective products, we offer a free replacement as a priority. Replacements are dispatched within 2 business days of approval.' },
              { title: '6. Return Shipping', body: 'If the return is due to our error (wrong item, quality issue), we bear the return shipping cost. For other returns, the customer bears the shipping cost.' },
              { title: '7. Contact', body: 'For return-related queries, contact us at makrivatraders@gmail.com or +91 83980 30577.' },
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
