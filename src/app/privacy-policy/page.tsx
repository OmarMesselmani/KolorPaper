import { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read KolorPaper's privacy policy. Learn how we collect, use, and protect your information.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy',
    description: 'Read KolorPaper\'s privacy policy. Learn how we collect, use, and protect your information.',
    url: `${siteUrl}/privacy-policy`,
    siteName: 'KolorPaper',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy',
    description: 'Read KolorPaper\'s privacy policy. Learn how we collect, use, and protect your information.',
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-[#0F0728] dark:text-gray-100 mb-8">Privacy Policy</h1>
      <div className="prose prose-purple max-w-none text-gray-700 dark:text-gray-300 space-y-6">
        <p>Last updated: 14/07/2026</p>
        <p>KolorPaper respects your privacy and is committed to protecting personal information and being transparent about how information may be collected, used, and processed when you visit or use our website.</p>
        <p>This Privacy Policy explains the types of information we may collect, how we may use and protect that information, the circumstances in which information may be processed by third-party service providers, and the choices and rights that may be available to users.</p>
        <p>By accessing or using KolorPaper, you acknowledge that you have read and understood this Privacy Policy.</p>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">1. Information You Provide Voluntarily</h2>
          <p>You may provide personal information voluntarily when you:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Contact us through a contact form.</li>
            <li>Send feedback, questions, requests, reports, or inquiries.</li>
            <li>Submit a copyright, intellectual property, privacy, or other legal request.</li>
            <li>Communicate with KolorPaper through available contact methods.</li>
          </ul>
          <p>The information you provide may include:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Your name.</li>
            <li>Your email address.</li>
            <li>The content of your message.</li>
            <li>Any documents, links, information, or other materials you choose to provide.</li>
          </ul>
          <p>Please do not submit personal information that is unnecessary for the purpose of your request.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">2. Information Collected Automatically</h2>
          <p>When you access, browse, or use KolorPaper, certain technical and usage information may be collected or processed automatically by the website or by service providers that support its operation.</p>
          <p>This information may include:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Internet Protocol (IP) address.</li>
            <li>Browser type and browser version.</li>
            <li>Device type.</li>
            <li>Operating system.</li>
            <li>Language and general browser settings.</li>
            <li>Pages viewed or visited.</li>
            <li>Referring pages, websites, or search engines.</li>
            <li>Date, time, and approximate duration of visits.</li>
            <li>General geographic information derived from an IP address, such as country, region, or city.</li>
            <li>Website interactions and navigation activity.</li>
            <li>Download requests and general download activity.</li>
            <li>Request, traffic, performance, and diagnostic information.</li>
            <li>Error reports and technical logs.</li>
            <li>Cookie identifiers or similar technical identifiers.</li>
            <li>Security, fraud-prevention, anti-bot, and abuse-detection signals.</li>
          </ul>
          <p>This information generally helps us operate, maintain, secure, analyze, and improve the website. Technical information does not necessarily identify you directly.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">3. How We Use Information</h2>
          <p>We may use collected or processed information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Operate, maintain, and provide KolorPaper.</li>
            <li>Deliver website pages, images, downloadable materials, and other content.</li>
            <li>Improve website functionality, performance, accessibility, and user experience.</li>
            <li>Understand how visitors use and interact with the website.</li>
            <li>Analyze website traffic, usage patterns, popular content, and technical performance.</li>
            <li>Respond to questions, feedback, support requests, and other communications.</li>
            <li>Process copyright, intellectual property, privacy, or legal requests.</li>
            <li>Diagnose technical problems and correct errors.</li>
            <li>Maintain website security and availability.</li>
            <li>Detect bots, automated activity, malicious traffic, suspicious behavior, and unauthorized access.</li>
            <li>Prevent automated scraping, excessive downloading, unauthorized content extraction, spam, fraud, abuse, and misuse.</li>
            <li>Apply and enforce reasonable download limits, rate limits, access restrictions, and other technical protection measures.</li>
            <li>Protect KolorPaper&rsquo;s content, services, users, infrastructure, and legal rights.</li>
            <li>Enforce our Terms of Use.</li>
            <li>Comply with applicable laws, regulations, legal obligations, or lawful requests.</li>
          </ul>
          <p>We may use aggregated or anonymized information for statistical, analytical, security, research, and website-improvement purposes where permitted by applicable law.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">4. Cookies and Similar Technologies</h2>
          <p>KolorPaper may use cookies and similar technologies to operate the website, remember certain preferences, understand website usage, improve performance, provide relevant features, maintain security, and support analytics or advertising services.</p>
          <p>Cookies are small files or pieces of information stored on or associated with your browser or device.</p>
          <p>Cookies and similar technologies used on or in connection with KolorPaper may include:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Essential cookies:</strong> Used for website functionality, security, traffic management, fraud prevention, abuse prevention, and other necessary technical purposes.</li>
            <li><strong>Preference cookies:</strong> Used to remember settings or choices where such features are available.</li>
            <li><strong>Analytics cookies:</strong> Used to understand website traffic, visitor interactions, content performance, and website usage.</li>
            <li><strong>Advertising cookies:</strong> Used by advertising partners, where applicable, to display, measure, limit, or personalize advertisements, subject to applicable law and user choices.</li>
          </ul>
          <p>Some cookies may be placed or processed by third-party service providers.</p>
          <p>Where required by applicable law, KolorPaper may request consent before using non-essential cookies or similar technologies.</p>
          <p>You may be able to manage cookie preferences through an available cookie-consent tool or through your browser settings. Blocking or deleting certain cookies may affect some website features or functionality.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">5. Analytics</h2>
          <p>KolorPaper may use third-party analytics services to better understand how visitors interact with the website and to measure traffic, performance, engagement, and content usage.</p>
          <p>Analytics services may collect or process information such as:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Pages visited.</li>
            <li>Approximate location.</li>
            <li>Device and browser information.</li>
            <li>Referring websites or search engines.</li>
            <li>Website interactions.</li>
            <li>Visit duration.</li>
            <li>Technical identifiers.</li>
            <li>Cookie or similar technology data.</li>
          </ul>
          <p>Analytics information may be used to improve website content, organization, performance, accessibility, and user experience.</p>
          <p>Where required by applicable law, analytics technologies that are not strictly necessary will be used only after obtaining appropriate consent.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">6. Advertising</h2>
          <p>KolorPaper may display advertisements provided by third-party advertising partners.</p>
          <p>Advertising partners may use cookies, similar technologies, device information, technical identifiers, approximate location information, or information about website interactions to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Display advertisements.</li>
            <li>Measure advertisement performance.</li>
            <li>Limit how often advertisements are displayed.</li>
            <li>Detect invalid, fraudulent, or abusive advertising activity.</li>
            <li>Provide personalized or non-personalized advertisements where permitted by applicable law and user choices.</li>
          </ul>
          <p>Where required, users may be provided with options to accept, reject, or manage certain advertising technologies.</p>
          <p>KolorPaper does not directly control all cookies, technologies, or data-processing practices used by third-party advertising providers. Such providers may process information in accordance with their own privacy policies and applicable legal obligations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">7. Third-Party Service Providers</h2>
          <p>KolorPaper may use trusted third-party service providers to support the operation and availability of the website.</p>
          <p>These providers may assist with services such as:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Website hosting and technical infrastructure.</li>
            <li>Data storage and database services.</li>
            <li>Content storage and delivery.</li>
            <li>Website performance and optimization.</li>
            <li>Security and traffic management.</li>
            <li>Bot detection and abuse prevention.</li>
            <li>Analytics and website measurement.</li>
            <li>Advertising services.</li>
            <li>Contact-form processing.</li>
            <li>Error monitoring and technical support.</li>
          </ul>
          <p>These providers may process limited information as reasonably necessary to perform services on our behalf, maintain security, comply with legal obligations, or provide their own services where applicable.</p>
          <p>We encourage users to review the privacy policies and privacy controls of relevant third-party services where appropriate.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">8. How Information May Be Shared</h2>
          <p>KolorPaper does not sell personal information.</p>
          <p>We may share or allow the processing of information only when reasonably necessary for purposes such as:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Operating, hosting, maintaining, securing, and improving the website.</li>
            <li>Providing website functionality and technical services.</li>
            <li>Delivering content and processing website requests.</li>
            <li>Providing analytics or advertising services.</li>
            <li>Preventing fraud, spam, scraping, automated abuse, security threats, or unauthorized activity.</li>
            <li>Enforcing our Terms of Use and protecting our rights.</li>
            <li>Responding to lawful requests, legal proceedings, court orders, or regulatory obligations.</li>
            <li>Protecting the safety, rights, property, services, or security of KolorPaper, its users, or others.</li>
            <li>Completing a business transfer, merger, acquisition, restructuring, or transfer of website assets, where permitted by applicable law.</li>
          </ul>
          <p>Third-party service providers may process information under their own terms, privacy policies, legal obligations, or agreements with KolorPaper.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">9. Data Retention</h2>
          <p>KolorPaper retains personal information only for as long as reasonably necessary to fulfill the purposes described in this Privacy Policy, provide requested services, respond to communications, maintain security, resolve disputes, enforce agreements, and comply with applicable legal obligations.</p>
          <p>Retention periods may vary depending on:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>The type of information.</li>
            <li>The purpose for which it was collected.</li>
            <li>The nature of a request or communication.</li>
            <li>Security and abuse-prevention requirements.</li>
            <li>Technical and operational needs.</li>
            <li>Applicable legal or regulatory requirements.</li>
          </ul>
          <p>Technical logs, security information, analytics information, download-related records, and abuse-prevention data may be retained for limited periods as reasonably necessary for website operation, analysis, security, fraud prevention, abuse prevention, and enforcement.</p>
          <p>Information may be deleted, anonymized, or aggregated when it is no longer reasonably required, subject to applicable law and legitimate operational needs.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">10. Data Security</h2>
          <p>KolorPaper uses reasonable technical, administrative, and organizational measures designed to protect information against unauthorized access, misuse, loss, alteration, disclosure, destruction, or other unauthorized activity.</p>
          <p>These measures may include access controls, traffic monitoring, automated security systems, bot protection, abuse-prevention tools, rate limits, download limits, and other technical safeguards.</p>
          <p>However, no website, internet transmission, electronic storage system, or security method can be guaranteed to be completely secure.</p>
          <p>Therefore, KolorPaper cannot guarantee the absolute security of information transmitted to, processed by, or stored in connection with the website.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">11. Children&rsquo;s Privacy</h2>
          <p>KolorPaper provides coloring pages and creative materials for users of different ages, including children, families, teachers, educators, and adults. Some content is designed primarily for children, while other coloring materials may be suitable for teenagers, adults, or users seeking more detailed and advanced coloring activities.</p>
          <p>When children use the website, parents, legal guardians, teachers, caregivers, or other responsible adults are encouraged to provide appropriate supervision.</p>
          <p>KolorPaper does not knowingly request or collect personal information directly from children under the age of 13, or under any higher minimum age required by applicable local law, without appropriate authorization or consent where legally required.</p>
          <p>Users are not required to create an account or provide personal information in order to browse, view, download, or print coloring pages.</p>
          <p>Children should not submit personal information through contact forms, email, or other communication features without the involvement, supervision, or permission of a parent or legal guardian.</p>
          <p>Parents, guardians, teachers, and other responsible adults should supervise children&rsquo;s use of the website and help them avoid sharing personal information online.</p>
          <p>If we become aware that personal information has been collected from a child in a manner inconsistent with applicable law, we will take reasonable steps to delete or appropriately handle that information.</p>
          <p>If you are a parent or legal guardian and believe that a child has provided personal information through KolorPaper, please contact us through the contact page so that we can review the matter and take appropriate action.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">12. Your Privacy Rights and Choices</h2>
          <p>Depending on your location and applicable law, you may have certain rights regarding your personal information.</p>
          <p>These rights may include the ability to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Request access to personal information associated with you.</li>
            <li>Request correction of inaccurate or incomplete personal information.</li>
            <li>Request deletion of certain personal information.</li>
            <li>Request restriction of certain processing activities.</li>
            <li>Object to certain uses of personal information.</li>
            <li>Withdraw consent where processing is based on consent.</li>
            <li>Request information about how personal information is used or shared.</li>
            <li>Manage certain cookie, analytics, or advertising preferences.</li>
            <li>Submit a complaint to an appropriate data-protection authority where applicable.</li>
          </ul>
          <p>These rights may be subject to legal exceptions, verification requirements, and limitations under applicable law.</p>
          <p>To submit a privacy-related request, please contact us through the contact page and provide sufficient information to identify and process your request.</p>
          <p>We may request reasonable information to verify the request and protect users from unauthorized access or fraudulent requests.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">13. International Data Processing and Transfers</h2>
          <p>KolorPaper is available to users in different countries.</p>
          <p>Information may be processed, stored, or transferred in countries other than the country in which you are located because website service providers and technical infrastructure may operate internationally.</p>
          <p>Data-protection laws may differ between countries.</p>
          <p>Where required by applicable law, reasonable measures may be used to provide appropriate protection for personal information transferred or processed internationally.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">14. External Links</h2>
          <p>KolorPaper may contain links to external websites, services, applications, or third-party resources.</p>
          <p>We are not responsible for the content, availability, security, privacy practices, cookies, or data-processing activities of third-party websites or services.</p>
          <p>Visiting an external website is subject to that website&rsquo;s own terms and privacy policy.</p>
          <p>We encourage users to review the privacy policies of third-party websites before providing personal information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">15. Changes to This Privacy Policy</h2>
          <p>KolorPaper may revise, modify, update, or replace this Privacy Policy from time to time to reflect changes in website features, technologies, services, legal requirements, or privacy practices.</p>
          <p>Any changes will be published on this page with an updated &ldquo;Last updated&rdquo; date.</p>
          <p>Changes become effective when the revised Privacy Policy is published, unless otherwise stated or required by applicable law.</p>
          <p>We encourage users to review this Privacy Policy periodically.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">16. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, wish to exercise privacy rights available under applicable law, believe that personal information has been handled improperly, or wish to submit a privacy-related request, please contact us through the <Link href="/contact" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline">contact page</Link> available on the KolorPaper website or by email at <a href="mailto:info@kolorpaper.com" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline">info@kolorpaper.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
