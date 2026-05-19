export default function PrivacyPolicy() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-[#0F0728] mb-8">Privacy Policy</h1>
      <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">1. Information We Collect</h2>
          <p>We may collect personal information that you provide to us when you subscribe to our newsletter, respond to a survey, or use our website. This may include your email address.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">2. How We Use Your Information</h2>
          <p>Any of the information we collect from you may be used to personalize your experience, improve our website, send periodic emails, or provide customer service.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">3. Cookie Policy</h2>
          <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">4. Third-Party Disclosure</h2>
          <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">5. Contact Us</h2>
          <p>If there are any questions regarding this privacy policy, you may contact us using the information on our website.</p>
        </section>
      </div>
    </div>
  );
}
