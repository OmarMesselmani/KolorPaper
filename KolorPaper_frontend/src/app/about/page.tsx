import Breadcrumbs from "@/components/Breadcrumbs";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  title: "About Us - KolorPaper",
  description: "Learn about KolorPaper's mission to provide free, high-quality printable coloring pages that inspire creativity for kids and adults.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Us - KolorPaper',
    description: 'Learn about KolorPaper\'s mission to provide free, high-quality printable coloring pages that inspire creativity for kids and adults.',
    url: `${siteUrl}/about`,
    siteName: 'KolorPaper',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About Us - KolorPaper',
    description: 'Learn about KolorPaper\'s mission to provide free, high-quality printable coloring pages that inspire creativity for kids and adults.',
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <Breadcrumbs paths={[{ title: "About Us", href: "/about" }]} />
      </div>
      <div className="max-w-[800px] mx-auto px-6 py-16 min-h-[60vh]">
        <h1 className="text-4xl font-black text-[#0F0728] mb-8">About Us</h1>
        <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-[#0F0728] mb-4">Our Mission</h2>
            <p>
              At KolorPaper, we believe every child deserves a canvas for their imagination. Our mission is to provide 
              free, high-quality printable coloring pages that inspire creativity, learning, and hours of fun for kids 
              and adults alike.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#0F0728] mb-4">Who We Are</h2>
            <p>
              We are a passionate team of designers, educators, and parents dedicated to creating beautiful coloring 
              content. From adorable animals to space adventures, each page is crafted with love and attention to detail 
              to ensure the best coloring experience.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-[#0F0728] mb-4">Why Choose Us</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Thousands of unique, hand-drawn coloring pages</li>
              <li>Regular updates with fresh new content every week</li>
              <li>100% free to download and print</li>
              <li>Organized categories for easy browsing</li>
              <li>High-resolution print-ready files</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
