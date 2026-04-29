import PolicyLayout from '@/components/PolicyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions governing use of the MakRiva website and purchase of our products.',
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using our website or placing an order."
      effectiveDate="1 January 2025"
      lastUpdated="29 April 2026"
      sections={[
        {
          title: 'Acceptance of Terms',
          body: 'By accessing or using the MakRiva website (makriva.in) and placing orders, you confirm that you are at least 18 years of age and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of our website and services immediately.',
        },
        {
          title: 'Products & Pricing',
          body: [
            'All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise.',
            'We reserve the right to change product prices, availability, and descriptions without prior notice.',
            'Product images on the website are representative; actual colour and appearance may vary slightly due to photography and screen settings.',
            'All weights (e.g., 100g, 250g) refer to net weight of the product.',
          ],
        },
        {
          title: 'Orders & Payment',
          body: [
            'By placing an order, you confirm that all information provided is accurate, complete, and up to date.',
            'We accept payments via credit/debit cards, UPI, net banking, and Cash on Delivery (select pin codes).',
            'Payment is processed securely through Instamojo — MakRiva does not store any payment card details.',
            'We reserve the right to cancel orders due to pricing errors, stock unavailability, suspected fraudulent activity, or inability to verify payment.',
            'In the event of cancellation by MakRiva, you will be notified and any payment made will be fully refunded.',
          ],
        },
        {
          title: 'User Accounts',
          body: [
            'Creating an account is optional but recommended for order tracking and a faster checkout experience.',
            'You are responsible for maintaining the confidentiality of your account credentials.',
            'You must notify us immediately at makrivatraders@gmail.com if you suspect any unauthorised use of your account.',
            'MakRiva is not liable for losses arising from unauthorised account access due to your failure to keep credentials secure.',
          ],
        },
        {
          title: 'Intellectual Property',
          body: [
            'All content on this website — including but not limited to the MakRiva logo, product images, text, descriptions, graphics, and design — is the exclusive property of MakRiva Traders.',
            'You may not reproduce, distribute, modify, or use our content for commercial purposes without prior written permission.',
            'Unauthorised use of our intellectual property may result in legal action.',
          ],
        },
        {
          title: 'Limitation of Liability',
          body: [
            'MakRiva\'s liability for any claim arising from the use of our products or website is limited to the value of the order in question.',
            'We are not liable for any indirect, incidental, special, or consequential damages including loss of profits, data, or goodwill.',
            'We do not guarantee that the website will be available at all times without interruptions or errors.',
            'Health claims on the website are informational only. Consult a healthcare professional for medical advice.',
          ],
        },
        {
          title: 'Governing Law & Jurisdiction',
          body: 'These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Jind, Haryana, India.',
        },
        {
          title: 'Amendments',
          body: 'MakRiva reserves the right to update these Terms at any time. Changes will be posted on this page with a revised "Last Updated" date. Continued use of our services after amendments constitutes acceptance of the updated Terms.',
        },
        {
          title: 'Contact',
          body: 'For questions or concerns regarding these Terms and Conditions, contact us at makrivatraders@gmail.com or +91 83980 30577.',
        },
      ]}
    />
  );
}
