import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Read KolorPaper's terms of use. Understand the rules and guidelines for using our free printable coloring pages.",
  alternates: {
    canonical: `${siteUrl}/terms-of-use`,
  },
  openGraph: {
    title: 'Terms of Use',
    description: 'Read KolorPaper\'s terms of use. Understand the rules and guidelines for using our free printable coloring pages.',
    url: `${siteUrl}/terms-of-use`,
    siteName: 'KolorPaper',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Use',
    description: 'Read KolorPaper\'s terms of use. Understand the rules and guidelines for using our free printable coloring pages.',
  },
};

export default function TermsOfUse() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-[#0F0728] dark:text-gray-100 mb-8">Terms of Use</h1>
      <div className="prose prose-purple max-w-none text-gray-700 dark:text-gray-300 space-y-6">
        <p>Last updated: 26/05/2026</p>
        
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using KolorPaper, you accept and agree to be bound by these Terms of Use and all applicable laws and regulations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily download and print one copy of the materials (coloring pages) from KolorPaper for personal, non-commercial use only.</p>
          <p className="mt-4">This license does not include:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Modifying or copying the materials for commercial purposes</li>
            <li>Redistributing or reselling the materials</li>
            <li>Removing copyright or proprietary notices from the materials</li>
            <li>Using the materials for unlawful purposes</li>
          </ul>
          <p className="mt-4">All rights not expressly granted are reserved by KolorPaper.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">3. Intellectual Property</h2>
          <p>Unless otherwise stated, all original content, designs, graphics, and materials on KolorPaper are the property of KolorPaper.</p>
          <p className="mt-4">Some characters, trademarks, names, or copyrighted materials displayed on this website may belong to their respective owners. KolorPaper does not claim ownership over third-party intellectual property.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">4. Copyright Complaints</h2>
          <p>If you are a copyright owner and believe that any content on this website infringes your intellectual property rights, please contact us with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Your contact information</li>
            <li>Proof of ownership</li>
            <li>The URL(s) of the allegedly infringing content</li>
          </ul>
          <p className="mt-4">We will review and remove content when appropriate.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">5. Disclaimer</h2>
          <p>The materials on KolorPaper are provided on an “as is” basis. KolorPaper makes no warranties, expressed or implied, and disclaims all warranties including, without limitation:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Accuracy or reliability of content</li>
          </ul>
          <p className="mt-4">KolorPaper does not guarantee that the website will always be available, error-free, or uninterrupted.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">6. Limitation of Liability</h2>
          <p>In no event shall KolorPaper or its owners be liable for any damages arising out of the use or inability to use the materials on this website.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">7. Revisions and Changes</h2>
          <p>KolorPaper may revise these Terms of Use at any time without notice. By using this website, you agree to be bound by the current version of these Terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">8. Governing Law</h2>
          <p>Any claim relating to KolorPaper shall be governed by the laws of the website owner&apos;s jurisdiction without regard to conflict of law provisions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">9. Contact</h2>
          <p>If you have any questions regarding these Terms, please contact us through the contact page available on the website.</p>
        </section>
      </div>
    </div>
  );
}
