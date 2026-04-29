import PolicyLayout from '@/components/PolicyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy',
  description: 'How to cancel a MakRiva order and what to expect in terms of refunds.',
};

export default function CancellationPolicyPage() {
  return (
    <PolicyLayout
      title="Cancellation Policy"
      subtitle="Understand when and how you can cancel an order, and what happens next."
      effectiveDate="1 January 2025"
      lastUpdated="29 April 2026"
      sections={[
        {
          title: 'Cancellation Window',
          body: [
            'You may cancel your order free of charge within 2 hours of placement, provided it has not yet been packed or dispatched.',
            'Once the order status changes to "Processing" or "Dispatched", cancellation is no longer possible.',
            'To check your order status before requesting cancellation, log in to your account or contact us.',
          ],
        },
        {
          title: 'How to Cancel an Order',
          body: [
            'Email us at makrivatraders@gmail.com with the subject line: "Order Cancellation — [Your Order Number]".',
            'Alternatively, call us at +91 83980 30577 (Mon–Sat, 10am–6pm).',
            'Please have your order number and registered email/phone ready when contacting us.',
            'We will confirm the cancellation within 2 business hours if the order is still eligible.',
          ],
        },
        {
          title: 'After Dispatch — No Cancellation',
          body: [
            'Once an order has been dispatched and handed over to the courier partner, it cannot be cancelled.',
            'If you no longer wish to receive the order, you may refuse delivery at the door — the package will be returned to us.',
            'Upon receiving the returned package, we will process a refund after deducting applicable return shipping charges.',
            'For prepaid orders where delivery is refused, refunds will be processed within 7–10 business days after the package is returned to our warehouse.',
          ],
        },
        {
          title: 'Cancellation by MakRiva',
          body: [
            'MakRiva reserves the right to cancel orders in the following circumstances: pricing or listing errors on the website; items going out of stock after order placement; payment verification failure or suspected fraudulent activity; inability to deliver to the specified address.',
            'In all such cases, you will be notified via email/SMS promptly, and any amount paid will be fully refunded.',
          ],
        },
        {
          title: 'Refunds on Cancellation',
          body: [
            'Prepaid orders (card, UPI, net banking) cancelled before dispatch: full refund within 5–7 business days to the original payment method.',
            'Cash on Delivery (COD) orders cancelled before dispatch: no charge — no amount was collected.',
            'Orders cancelled after dispatch (refused at delivery): refund after deducting return shipping charges (up to ₹100), processed within 7–10 business days.',
            'Refunds to bank accounts (for COD returns) require you to share your bank details with us.',
          ],
        },
        {
          title: 'Partial Cancellation',
          body: [
            'If your order contains multiple items and only some are available at the time of packing, we may: (a) dispatch the available items and cancel unavailable items with a partial refund, or (b) contact you to confirm whether you want to proceed with a partial order.',
            'You will always be notified before partial dispatch occurs.',
          ],
        },
        {
          title: 'Contact for Cancellations',
          body: 'For urgent cancellation requests, please call +91 83980 30577 as this ensures the fastest response. Emails are addressed within 2 business hours on working days (Mon–Sat, 10am–6pm).',
        },
      ]}
    />
  );
}
