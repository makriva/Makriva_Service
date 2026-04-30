import PolicyLayout from '@/components/PolicyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How MakRiva collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information."
      effectiveDate="1 April 2025"
      lastUpdated="15 March 2026"
      sections={[
        {
          title: 'Information We Collect',
          body: [
            'Personal details you provide: name, email address, phone number, and delivery address when creating an account or placing an order.',
            'Order and transaction data: products purchased, order history, payment status (we do not store card details — payments are processed by Instamojo).',
            'Usage data: pages visited, browser type, device information, and IP address collected automatically for site improvement.',
            'Communications: emails or messages you send us for support or enquiries.',
          ],
        },
        {
          title: 'How We Use Your Information',
          body: [
            'To process and fulfil your orders, including sending order confirmations, dispatch notifications, and delivery updates.',
            'To provide customer support and respond to your queries promptly.',
            'To send promotional offers and newsletters — you can opt out at any time.',
            'To improve our website, products, and services using aggregated analytics data.',
            'We never sell, rent, or trade your personal data to third parties.',
          ],
        },
        {
          title: 'Data Security',
          body: [
            'All data transmission is encrypted using industry-standard SSL/TLS protocols.',
            'Payment transactions are processed through Instamojo\'s PCI-DSS compliant platform — MakRiva never stores card or UPI details.',
            'Access to customer data is restricted to authorised personnel only.',
            'We regularly review our security practices to protect against unauthorised access or disclosure.',
          ],
        },
        {
          title: 'Cookies & Tracking',
          body: [
            'We use essential cookies to maintain your login session and shopping cart.',
            'Analytics cookies (Google Analytics) help us understand how visitors use our site — these are anonymised.',
            'You can disable cookies in your browser settings; however, some features (e.g., cart persistence) may not work correctly.',
            'We do not use cookies to serve third-party advertising.',
          ],
        },
        {
          title: 'Third-Party Services',
          body: [
            'Cloudinary — for secure cloud image storage.',
            'Instamojo — for payment processing (see Instamojo\'s Privacy Policy).',
            'Google Analytics — for anonymised website analytics.',
            'Each third-party service operates under its own privacy policy. MakRiva is not responsible for their practices.',
          ],
        },
        {
          title: 'Data Retention',
          body: 'We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion at any time.',
        },
        {
          title: 'Your Rights',
          body: [
            'Right to access: request a copy of the personal data we hold about you.',
            'Right to correct: request correction of inaccurate or incomplete data.',
            'Right to delete: request deletion of your personal data, subject to legal obligations.',
            'Right to opt out: unsubscribe from marketing communications at any time.',
            'To exercise any of these rights, email us at hello@makriva.in.',
          ],
        },
        {
          title: 'Changes to This Policy',
          body: 'We may update this Privacy Policy periodically. Significant changes will be communicated via email or a prominent notice on our website. Continued use of our services after changes constitutes acceptance.',
        },
        {
          title: 'Contact',
          body: 'For privacy-related queries or to exercise your data rights, contact us at makrivatraders@gmail.com or +91 83980 30577.',
        },
      ]}
    />
  );
}
