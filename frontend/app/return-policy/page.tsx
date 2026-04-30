import PolicyLayout from '@/components/PolicyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Refund Policy',
  description: 'MakRiva return eligibility, refund timelines, and how to initiate a return.',
};

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Return & Refund Policy"
      subtitle="We stand behind every pack we ship. Here is how we make it right if something goes wrong."
      effectiveDate="1 April 2025"
      lastUpdated="15 March 2026"
      sections={[
        {
          title: 'Return Eligibility',
          body: [
            'Returns are accepted within 7 days of delivery.',
            'Eligible reasons: product is damaged, defective, incorrectly packed (wrong item sent), or seal is broken on arrival.',
            'Products must be unused and in their original packaging with the seal intact (except in cases of quality issues).',
            'Photographic evidence of the issue must be provided at the time of raising a return request.',
          ],
        },
        {
          title: 'Non-Returnable Items',
          body: [
            'Opened or partially consumed food products — for hygiene and safety reasons — unless there is a verifiable quality defect.',
            'Products purchased during clearance sales or at heavily discounted rates (marked as "final sale").',
            'Products damaged due to improper storage by the customer after delivery.',
            'Orders where the 7-day return window has passed.',
          ],
        },
        {
          title: 'How to Initiate a Return',
          body: [
            'Email us at makrivatraders@gmail.com with subject line: "Return Request — [Your Order Number]".',
            'Include: your order number, description of the issue, and clear photographs of the product and packaging.',
            'Our customer care team will review your request and respond within 48 business hours.',
            'Once approved, you will receive pickup instructions or a prepaid return label (where applicable).',
          ],
        },
        {
          title: 'Replacement Policy',
          body: [
            'For eligible quality issues (damaged, defective, or wrong product), we prioritise sending a free replacement.',
            'Replacements are dispatched within 2 business days of return approval.',
            'You will receive a new tracking link for the replacement shipment.',
          ],
        },
        {
          title: 'Refund Process',
          body: [
            'Refunds are approved only when a replacement is not feasible (e.g., item out of stock).',
            'Approved refunds are processed within 5–7 business days.',
            'Refunds are credited to your original payment method (credit/debit card, UPI, net banking).',
            'For Cash on Delivery (COD) orders, refunds are issued via bank transfer — please provide your bank details at the time of the return request.',
            'Shipping charges (if any) are non-refundable unless the return is due to our error.',
          ],
        },
        {
          title: 'Return Shipping',
          body: [
            'If the return is due to MakRiva\'s error (wrong item, quality issue, damaged in transit): we bear the return shipping cost and arrange pickup.',
            'If the return is for any other reason: the customer bears the return shipping cost.',
            'Please use a trackable shipping service for returns; MakRiva is not responsible for packages lost in return transit.',
          ],
        },
        {
          title: 'Contact for Return Queries',
          body: 'Reach our team at makrivatraders@gmail.com or +91 83980 30577 (Mon–Sat, 10am–6pm). We aim to resolve all return queries within 2 business days.',
        },
      ]}
    />
  );
}
