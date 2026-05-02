import PolicyLayout from '@/components/PolicyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'MakRiva shipping timelines, charges, and delivery information across India.',
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      subtitle="Delivery timelines, charges, and everything you need to know about receiving your order."
      effectiveDate="1 April 2025"
      lastUpdated="15 March 2026"
      sections={[
        {
          title: 'Delivery Coverage',
          body: [
            'We deliver pan-India to all major cities, towns, and most PIN codes.',
            'Delivery partners include Delhivery, DTDC, Blue Dart, Ekart, and India Post.',
            'Remote areas (hill stations, certain North-East regions) may have limited coverage or extended timelines.',
            'Please ensure your PIN code is serviceable at checkout; we will notify you if delivery is not possible to your location.',
          ],
        },
        {
          title: 'Order Processing Time',
          body: [
            'Orders are confirmed and packed within 1–2 business days of successful payment.',
            'Orders placed on Sundays or national public holidays are processed on the next working day.',
            'You will receive an email/SMS confirmation once your order is dispatched with a tracking link.',
          ],
        },
        {
          title: 'Delivery Timeline',
          body: [
            'Metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune): 2–4 business days after dispatch.',
            'Tier-2 and Tier-3 cities: 4–7 business days after dispatch.',
            'Remote or rural areas: 7–10 business days after dispatch.',
            'These are estimated timelines and may vary due to factors outside our control.',
          ],
        },
        {
          title: 'Shipping Charges',
          body: [
            'FREE shipping on all orders above ₹499.',
            'A flat shipping fee of ₹50 applies to orders below ₹499.',
            'No additional handling charges.',
            'For bulk or wholesale orders, shipping terms are agreed separately — contact us at team@makriva.in.',
          ],
        },
        {
          title: 'Order Tracking',
          body: [
            'Once dispatched, you will receive an SMS and email with your AWB (tracking) number.',
            'Track your shipment directly on the courier partner\'s website using the provided AWB number.',
            'You can also contact us with your order number and we will share the tracking details.',
          ],
        },
        {
          title: 'Delayed Deliveries',
          body: [
            'While we strive for on-time delivery, delays may occur due to weather conditions, local strikes, public holidays, or courier network congestion.',
            'In case of significant delays beyond the estimated window, please contact us at team@makriva.in.',
            'MakRiva is not liable for delays caused by courier partners, once the shipment has been handed over.',
          ],
        },
        {
          title: 'Undeliverable & Returned Packages',
          body: [
            'If a package is returned due to an incorrect address, failed delivery attempts (3 attempts are made), or refusal to accept, we will contact you.',
            'Re-delivery of returned packages may incur an additional shipping charge of ₹50.',
            'If the error in address was ours, re-delivery is free of charge.',
          ],
        },
        {
          title: 'Damaged in Transit',
          body: 'If your package arrives visibly damaged, please photograph it before opening and contact us within 48 hours of delivery at team@makriva.in. We will arrange a replacement or refund as applicable.',
        },
      ]}
    />
  );
}
