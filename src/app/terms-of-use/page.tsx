import { Metadata } from "next";
import Link from "next/link";

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
        <p>Last updated: 14/07/2026</p>
        <p>Welcome to KolorPaper. These Terms of Use govern your access to and use of the KolorPaper website, including its coloring pages, illustrations, images, downloadable materials, written content, and other resources.</p>
        <p>By accessing or using KolorPaper, you agree to comply with these Terms of Use.</p>
        
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing, browsing, using, downloading from, or printing materials from KolorPaper, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and all applicable laws and regulations.</p>
          <p>If you do not agree with these Terms, you should not use the website or download its materials.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">2. Personal and Educational Use License</h2>
          <p>KolorPaper grants users a limited, non-exclusive, non-transferable, and revocable license to access, download, and print coloring pages for personal, family, classroom, and non-commercial educational use.</p>
          <p>Parents, teachers, educators, caregivers, and nonprofit educational organizations may print multiple copies when reasonably necessary for use by their children, students, classroom participants, or educational groups, provided that the materials are not sold, redistributed, republished, or used for commercial purposes.</p>
          <p>Permitted uses may include:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Printing coloring pages for personal or family use.</li>
            <li>Using printed coloring pages in classrooms or non-commercial educational activities.</li>
            <li>Printing reasonable quantities for students, children, or participants in nonprofit educational activities.</li>
            <li>Sharing links to pages on the KolorPaper website.</li>
          </ul>
          <p>Downloading or printing materials does not transfer ownership of the materials and does not grant users the right to redistribute, republish, sell, license, or commercially exploit the digital or printed content.</p>
          <p>All rights not expressly granted under these Terms are reserved by KolorPaper.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">3. Prohibited Uses</h2>
          <p>Unless prior written permission has been obtained from KolorPaper, users may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Sell, license, rent, sublicense, distribute, or commercially exploit KolorPaper materials.</li>
            <li>Copy, reproduce, republish, upload, host, redistribute, or make KolorPaper image files or downloadable materials available on another website, application, platform, public cloud-storage service, social media account, digital collection, or file-sharing service.</li>
            <li>Include KolorPaper materials in products offered for sale, including coloring books, printable bundles, digital downloads, activity books, educational products, merchandise, or print-on-demand products.</li>
            <li>Use KolorPaper materials to create, populate, support, or expand a competing coloring-page website, application, digital library, image collection, or commercial service.</li>
            <li>Remove, crop, obscure, erase, modify, cover, or replace the KolorPaper name, logo, watermark, copyright notice, or other proprietary markings.</li>
            <li>Add another person’s, website’s, company’s, or organization’s name, logo, watermark, or branding to KolorPaper materials in a manner that falsely suggests ownership or authorship.</li>
            <li>Claim ownership or authorship of KolorPaper materials or present them as original works created by another person, website, company, or organization.</li>
            <li>Modify, adapt, recolor, trace, convert, or otherwise alter KolorPaper materials for the purpose of redistribution, republication, resale, or commercial exploitation.</li>
            <li>Use the materials in unlawful, misleading, fraudulent, harmful, or unauthorized activities.</li>
            <li>Use KolorPaper materials in a manner that falsely implies endorsement, sponsorship, partnership, or affiliation with KolorPaper.</li>
          </ul>
          <p>Attribution, credit, or a link to KolorPaper does not by itself grant permission to reproduce, upload, redistribute, or republish KolorPaper materials.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">4. Bulk Downloading, Scraping, and Content Extraction</h2>
          <p>Users may not systematically copy, download, extract, collect, scrape, crawl, reproduce, archive, or obtain all or a substantial portion of KolorPaper’s content without prior written permission.</p>
          <p>This restriction applies to, but is not limited to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Coloring pages.</li>
            <li>Colored illustrations.</li>
            <li>Line-art images.</li>
            <li>Downloadable image files.</li>
            <li>Edited or adapted illustrations.</li>
            <li>Image collections.</li>
            <li>Titles and written descriptions.</li>
            <li>Tags, categories, and metadata.</li>
            <li>Page content and website organization.</li>
            <li>Collections, classifications, and content arrangements.</li>
          </ul>
          <p>The use of bots, scripts, automated browsers, scraping software, download managers, artificial intelligence agents, automated extraction systems, or similar tools to collect, reproduce, archive, republish, redistribute, or create a competing collection from KolorPaper content is prohibited without prior written permission.</p>
          <p>Repeated or cumulative copying of smaller portions of the website may also be considered prohibited when such activity results in the extraction, reconstruction, duplication, republication, or reuse of a substantial portion of the KolorPaper content library.</p>
          <p>KolorPaper reserves the right to restrict or block access, limit downloads, block automated activity, suspend access, or take other appropriate technical or legal action in response to unauthorized scraping, bulk downloading, content extraction, or republication.</p>
          <p>Nothing in this section is intended to prevent ordinary indexing by legitimate search engines for the purpose of displaying and linking to KolorPaper pages in search results.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">5. Intellectual Property and Content Rights</h2>
          <p>Unless otherwise stated, KolorPaper retains all rights and interests available under applicable law in its website, branding, logos, website design, page layouts, written content, edited illustrations, coloring-page adaptations, line-art preparation, human-created modifications, image arrangements, titles, descriptions, categories, tags, curated collections, and the selection, organization, coordination, and presentation of its content library.</p>
          <p>Some visual materials may be created or developed with the assistance of artificial intelligence tools and may subsequently be selected, edited, modified, refined, arranged, converted into line art, combined with other elements, or incorporated into page designs by KolorPaper.</p>
          <p>KolorPaper claims rights in its content and creative contributions only to the extent permitted under applicable law and does not claim exclusive rights over material that is not legally eligible for protection.</p>
          <p>The editing, selection, arrangement, organization, categorization, presentation, and coordinated collection of materials published on KolorPaper represent substantial creative, editorial, technical, and organizational effort.</p>
          <p>Copying, extracting, reproducing, reconstructing, redistributing, or republishing all or a substantial portion of this collection is prohibited unless expressly permitted under these Terms, authorized in writing by KolorPaper, or otherwise permitted by applicable law.</p>
          <p>The availability of content for free viewing, downloading, or printing does not place that content in the public domain and does not grant permission for redistribution, republication, resale, commercial exploitation, or claims of ownership.</p>
          <p>Certain names, characters, trademarks, logos, brands, or other third-party intellectual property referenced or depicted on the website may belong to their respective owners.</p>
          <p>KolorPaper does not claim ownership of third-party intellectual property, and any such content remains subject to the rights of its respective owners.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">6. Republishing, Sharing, and Attribution</h2>
          <p>Users are welcome to share links that direct visitors to pages on the KolorPaper website.</p>
          <p>However, unless prior written permission has been obtained, users may not copy, upload, host, embed, redistribute, republish, or make the original image files or downloadable materials available through another website, application, platform, social media account, public collection, or downloadable archive.</p>
          <p>The presence of the KolorPaper name, logo, watermark, or branding on an image or file does not grant permission to republish, redistribute, sell, or commercially use that material.</p>
          <p>Providing attribution, mentioning KolorPaper as the source, or including a link to the website does not replace the requirement to obtain permission when permission is required under these Terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">7. Artificial Intelligence and Dataset Use</h2>
          <p>Unless expressly authorized in writing by KolorPaper, website content may not be systematically copied, downloaded, scraped, extracted, collected, or compiled for the purpose of creating, training, fine-tuning, testing, evaluating, validating, improving, or enriching:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Artificial intelligence models.</li>
            <li>Machine-learning systems.</li>
            <li>Image-generation models.</li>
            <li>Computer-vision systems.</li>
            <li>Training datasets.</li>
            <li>Image datasets or digital archives.</li>
            <li>Automated content-generation systems.</li>
            <li>Similar technologies, databases, or services.</li>
          </ul>
          <p>This restriction does not apply to ordinary indexing performed by legitimate search engines for the purpose of displaying, ranking, and linking to KolorPaper pages in search results.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">8. Copyright and Intellectual Property Complaints</h2>
          <p>KolorPaper respects the intellectual property rights of others.</p>
          <p>If you are a copyright owner, trademark owner, authorized representative, or other rights holder and believe that content available on KolorPaper infringes your intellectual property rights, please contact us and provide:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Your full name and contact information.</li>
            <li>Identification of the copyrighted work, trademark, or other intellectual property involved.</li>
            <li>Proof of ownership or authorization to act on behalf of the rights holder.</li>
            <li>The exact URL or URLs of the allegedly infringing content.</li>
            <li>A clear explanation of the claimed infringement.</li>
            <li>Any additional information reasonably necessary to review the request.</li>
          </ul>
          <p>KolorPaper will review properly submitted complaints and may remove, restrict, modify, or disable access to content when appropriate.</p>
          <p>Submitting false, misleading, or abusive intellectual property claims may result in the rejection of the request and may have legal consequences under applicable law.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">9. Disclaimer</h2>
          <p>The materials and services available on KolorPaper are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.</p>
          <p>To the fullest extent permitted by applicable law, KolorPaper makes no warranties, expressed or implied, regarding:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>The accuracy, completeness, reliability, or availability of website content.</li>
            <li>Merchantability.</li>
            <li>Fitness for a particular purpose.</li>
            <li>Non-infringement.</li>
            <li>Continuous, uninterrupted, secure, or error-free website operation.</li>
            <li>The availability of any particular coloring page, image, file, feature, or service.</li>
          </ul>
          <p>KolorPaper does not guarantee that the website will always be available or free from errors, interruptions, technical issues, harmful components, data loss, or temporary service disruptions.</p>
          <p>Website content may be modified, updated, replaced, restricted, or removed at any time without prior notice.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">10. Limitation of Liability</h2>
          <p>To the fullest extent permitted by applicable law, KolorPaper and its owners, operators, contributors, or representatives shall not be liable for any direct, indirect, incidental, special, consequential, or other damages arising from:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Access to or use of the website.</li>
            <li>Inability to access or use the website.</li>
            <li>Downloading, printing, or using website materials.</li>
            <li>Reliance on website content.</li>
            <li>Temporary website unavailability.</li>
            <li>Loss of data, files, profits, opportunities, or other damages resulting from the use of the website.</li>
          </ul>
          <p>Some jurisdictions may not allow certain limitations or exclusions of liability. In such cases, these limitations shall apply only to the maximum extent permitted by applicable law.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">11. Enforcement and Termination of Access</h2>
          <p>KolorPaper reserves the right to restrict, limit, suspend, block, or terminate access to the website, its services, or its materials when there is reasonable evidence of:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Unauthorized bulk downloading.</li>
            <li>Excessive, abnormal, or automated downloading.</li>
            <li>Automated scraping, crawling, or content extraction.</li>
            <li>Repeated violations of these Terms.</li>
            <li>Unauthorized redistribution or republication.</li>
            <li>Commercial exploitation of website materials.</li>
            <li>Attempts to bypass, disable, evade, interfere with, or circumvent technical restrictions or security measures.</li>
            <li>Activities that may harm KolorPaper, its users, its services, its infrastructure, or its content library.</li>
          </ul>
          <p>KolorPaper may apply reasonable download limits, rate limits, access restrictions, automated abuse-prevention systems, anti-bot protections, traffic controls, or other technical measures to protect the website, maintain service availability, ensure fair access, and prevent excessive, automated, abusive, or unauthorized downloading.</p>
          <p>Download limits and other technical restrictions may vary or be adjusted over time based on website usage, security requirements, service availability, technical considerations, or suspected abuse.</p>
          <p>Users may not bypass, disable, evade, interfere with, defeat, or attempt to circumvent download limits, rate limits, access controls, anti-bot systems, automated abuse-prevention systems, security features, or other technical protection measures implemented by KolorPaper.</p>
          <p>Users may not use bots, scripts, automated browsers, download automation tools, proxy networks, account rotation, or other methods for the purpose of avoiding download restrictions, concealing automated activity, or obtaining content beyond the limits or permissions provided by KolorPaper.</p>
          <p>KolorPaper may use reasonable technical, administrative, or legal measures to protect its website, services, content, infrastructure, and rights.</p>
          <p>Any restriction, suspension, or blocking of access may be temporary or permanent, depending on the nature, frequency, and severity of the activity.</p>
          <p>Nothing in this section is intended to restrict ordinary website browsing, permitted personal or educational use, or legitimate search-engine indexing performed for the purpose of displaying and linking to KolorPaper pages in search results.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">12. Revisions and Changes</h2>
          <p>KolorPaper may revise, modify, update, or replace these Terms of Use at any time.</p>
          <p>Any changes will become effective when the updated Terms are published on this page, unless otherwise stated.</p>
          <p>The &ldquo;Last updated&rdquo; date at the top of this page indicates when the Terms were most recently revised.</p>
          <p>By continuing to access or use KolorPaper after changes are published, you agree to be bound by the current version of these Terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">13. Governing Law</h2>
          <p>These Terms shall be governed by and interpreted in accordance with the applicable laws of Tunisia, without regard to conflict-of-law principles.</p>
          <p>Any dispute relating to these Terms, the use of KolorPaper, or the website&rsquo;s materials shall be handled in accordance with applicable law.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">14. Severability</h2>
          <p>If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision shall be limited or removed only to the minimum extent necessary.</p>
          <p>The remaining provisions shall continue to remain valid and enforceable.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">15. Contact</h2>
          <p>If you have questions about these Terms of Use, wish to request permission for a use not expressly allowed under these Terms, or wish to submit an intellectual property complaint, please contact us through the <Link href="/contact" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline">contact page</Link> available on the KolorPaper website, or you can contact us via email at <a href="mailto:info@kolorpaper.com" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline">info@kolorpaper.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
