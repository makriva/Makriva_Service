import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShippingPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Shipping Policy</h1>
          <div className="gold-line mx-0 mb-8" />
          <div className="prose prose-sm max-w-none text-gray-500 space-y-6">
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
            {[
              { title: '1. Delivery Areas', body: 'We deliver pan-India to all major cities and towns via reputed courier partners (Delhivery, DTDC, Blue Dart, India Post). Remote areas may take additional time.' },
              { title: '2. Processing Time', body: 'Orders are processed within 1–2 business days of placement. Orders placed on weekends or public holidays are processed the next working day.' },
              { title: '3. Delivery Timeline', body: 'Standard delivery takes 4–7 business days from dispatch depending on your location. Metro cities may receive orders faster (2–4 days).' },
              { title: '4. Shipping Charges', body: 'Shipping is free on orders above ₹499. For orders below ₹499, a flat shipping charge of ₹50 is applicable.' },
              { title: '5. Tracking Your Order', body: 'Once your order is dispatched, you will receive a tracking number via email/SMS. You can use this to track your shipment on the courier partner\'s website.' },
              { title: '6. Delayed Deliveries', body: 'While we aim for on-time delivery, delays may occur due to weather, strikes, or other unforeseen circumstances. Contact us at makrivatraders@gmail.com for assistance.' },
              { title: '7. Undeliverable Packages', body: 'If a package is returned to us due to an incorrect address or failed delivery attempts, we will contact you for re-delivery. Additional shipping charges may apply.' },
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
