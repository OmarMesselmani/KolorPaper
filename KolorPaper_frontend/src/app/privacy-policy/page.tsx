import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  title: "Privacy Policy - KolorPaper",
  description: "Read KolorPaper's privacy policy. Learn how we collect, use, and protect your information.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy - KolorPaper',
    description: 'Read KolorPaper\'s privacy policy. Learn how we collect, use, and protect your information.',
    url: `${siteUrl}/privacy-policy`,
    siteName: 'KolorPaper',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy - KolorPaper',
    description: 'Read KolorPaper\'s privacy policy. Learn how we collect, use, and protect your information.',
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-[#0F0728] dark:text-gray-100 mb-8">Privacy Policy</h1>
      <div className="prose prose-purple max-w-none text-gray-700 dark:text-gray-300 space-y-6">
        <p>Last updated: 26/05/2026</p>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">1. Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide when you:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Subscribe to our newsletter</li>
            <li>Contact us through forms</li>
            <li>Send feedback or inquiries</li>
          </ul>
          <p className="mt-4">This information may include your email address and any information you choose to provide.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">2. How We Use Your Information</h2>
          <p>We may use collected information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Improve our website and user experience</li>
            <li>Respond to inquiries and support requests</li>
            <li>Send newsletters or updates</li>
            <li>Analyze website traffic and performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">3. Cookies and Analytics</h2>
          <p>KolorPaper uses cookies and similar technologies to improve user experience and understand how visitors interact with the website.</p>
          <p className="mt-4">We may use third-party services such as analytics providers and advertising partners that may also use cookies.</p>
          <p className="mt-4">You can disable cookies through your browser settings if you prefer.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">4. Third-Party Services</h2>
          <p>We may use trusted third-party services including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Analytics tools</li>
            <li>Advertising networks</li>
            <li>Embedded content providers</li>
          </ul>
          <p className="mt-4">These third parties may collect information in accordance with their own privacy policies.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">5. Data Security</h2>
          <p>We take reasonable measures to protect user information from unauthorized access, disclosure, or misuse. However, no method of transmission over the internet is completely secure.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">6. Children&apos;s Privacy</h2>
          <p>KolorPaper does not knowingly collect personal information from children under the age of 13.</p>
          <p className="mt-4">If you believe that a child has provided personal information through our website, please contact us and we will remove the information promptly.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">7. External Links</h2>
          <p>Our website may contain links to external websites. We are not responsible for the privacy practices or content of those websites.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">9. Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, please contact us through the contact page available on the website.</p>
        </section>
      </div>
    </div>
  );
}
