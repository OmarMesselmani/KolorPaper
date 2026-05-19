export default function TermsOfUse() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl font-black text-[#0F0728] mb-8">Terms of Use</h1>
      <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using PaperKolor, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (coloring pages) on PaperKolor's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>You may not modify or copy the materials for commercial purposes.</li>
            <li>You may not remove any copyright or other proprietary notations from the materials.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">3. Disclaimer</h2>
          <p>The materials on PaperKolor's website are provided on an 'as is' basis. PaperKolor makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">4. Revisions and Errata</h2>
          <p>The materials appearing on PaperKolor's website could include technical, typographical, or photographic errors. PaperKolor does not warrant that any of the materials on its website are accurate, complete or current.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[#0F0728] mb-4">5. Governing Law</h2>
          <p>Any claim relating to PaperKolor's website shall be governed by the laws of the website owner's jurisdiction without regard to its conflict of law provisions.</p>
        </section>
      </div>
    </div>
  );
}
