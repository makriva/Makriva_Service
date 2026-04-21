import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CancellationPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Cancellation Policy</h1>
          <div className="gold-line mx-0 mb-8" />
          <div className="prose prose-sm max-w-none text-gray-500 space-y-6">
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
            {[
              { title: '1. Order Cancellation by Customer', body: 'You may cancel your order free of charge within 2 hours of placement, provided it has not yet been dispatched. To cancel, email us at makrivatraders@gmail.com with your order number.' },
              { title: '2. After Dispatch', body: 'Once an order has been dispatched, it cannot be cancelled. You may initiate a return after delivery as per our Return Policy.' },
              { title: '3. Cancellation by MakRiva', body: 'We reserve the right to cancel orders in cases of pricing errors, stock unavailability, payment failure, or suspected fraudulent activity. You will be notified and fully refunded.' },
              { title: '4. Refunds on Cancellation', body: 'For prepaid orders cancelled before dispatch, refunds are processed within 5–7 business days to the original payment method. COD orders cancelled before dispatch incur no charge.' },
              { title: '5. Partial Cancellation', body: 'If your order contains multiple items and only some are available, we may dispatch the available items and cancel the rest with a partial refund.' },
              { title: '6. How to Cancel', body: 'Email makrivatraders@gmail.com or call +91 83980 30577 with subject line "Order Cancellation — [Your Order Number]" within the eligible window.' },
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
