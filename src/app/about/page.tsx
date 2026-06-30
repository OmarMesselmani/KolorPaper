import Breadcrumbs from "@/components/Breadcrumbs";
import { Metadata } from "next";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0A051A] overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-8 pb-16 lg:pt-16 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-[#0F0728] dark:to-pink-900/10 -z-10" />

        {/* Abstract Background Shapes */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-300/30 dark:bg-purple-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-300/30 dark:bg-pink-600/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="max-w-[1240px] mx-auto px-6">
          <Breadcrumbs paths={[{ title: "About Us", href: "/about" }]} />

          <div className="mt-12 max-w-3xl text-center mx-auto">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-[#0F0728] dark:text-white tracking-tight mb-5 leading-tight">
              Print, color, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">smile.</span>
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Discover the magic of creativity with KolorPaper. We believe in providing free, beautiful canvases to let everyone's imagination run wild.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Identity Grid */}
      <div className="max-w-[1240px] mx-auto px-6 -mt-8 mb-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Mission Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border border-purple-100 dark:border-white/5 hover:-translate-y-1 transition-transform duration-500">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0F0728] dark:text-white mb-3">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              At KolorPaper, we believe every child and adult deserves a canvas for their imagination. Our mission is to provide free, high-quality printable coloring pages that inspire creativity, learning, and hours of joyful expression.
            </p>
          </div>

          {/* Identity Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border border-pink-100 dark:border-white/5 hover:-translate-y-1 transition-transform duration-500">
            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 dark:text-pink-400">
                <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
                <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0F0728] dark:text-white mb-3">Who We Are</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              We are a passionate team of designers, educators, and parents dedicated to creating beautiful coloring content. From adorable animals to space adventures, each page is crafted with love and attention to detail to ensure the best coloring experience.
            </p>
          </div>

        </div>
      </div>

      {/* Unique Selling Proposition (USP) Section */}
      <div className="max-w-[1240px] mx-auto px-6 mb-16">
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-[2rem] p-1 overflow-hidden group shadow-lg">
          <div className="relative bg-white dark:bg-[#0A051A] rounded-[1.9rem] p-6 lg:p-10 flex flex-col lg:flex-row items-center gap-10 overflow-hidden">
            {/* Soft background glow inside the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-full"></div>

            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs mb-5 uppercase tracking-wider">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> Exclusive Feature
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F0728] dark:text-white mb-4 leading-tight">
                A Colored Reference for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Every Single Page</span>
              </h2>
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Unlike other coloring platforms, we believe in providing endless inspiration. KolorPaper is the first specialized website to offer a beautifully colored model for every drawing. Whether you want to follow the artist's original vision or create your own unique masterpiece, the inspiration is always right there!
              </p>
            </div>

            {/* Visual Representation */}
            <div className="flex-1 w-full flex justify-center relative z-10">
              <div className="relative w-full max-w-[280px] sm:max-w-sm aspect-square mt-8 lg:mt-0">
                {/* Outline Image (Back) */}
                <div className="absolute top-0 right-[-8px] sm:right-[-16px] w-3/4 aspect-[3/4] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 rotate-6 transform transition-transform duration-500 group-hover:rotate-12 p-2 flex items-center justify-center">
                  <img
                    src="https://cdn.kolorpaper.com/uploads/images/-1780606216602-0gqnjr.jpg"
                    alt="Advanced Butterfly Coloring Sheet"
                    className="w-full h-full object-contain rounded-xl bg-white"
                  />
                </div>
                {/* Colored Image (Front) */}
                <div className="absolute bottom-0 left-0 w-3/4 aspect-[3/4] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 -rotate-3 transform transition-transform duration-500 group-hover:-rotate-6 p-2 flex items-center justify-center">
                  <img
                    src="https://cdn.kolorpaper.com/uploads/images/13-1782467228932-w9hmp5.jpg"
                    alt="Advanced Rose Flower Coloring Page"
                    className="w-full h-full object-contain rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Why Choose Us Section */}
      <div className="bg-white/50 dark:bg-white/[0.02] py-16 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#0F0728] dark:text-white mb-3">Why Choose KolorPaper?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base">Everything you need to enjoy a perfect coloring session.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/50 transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              </div>
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">Thousands of Pages</h3>
              <p className="text-purple-800/70 dark:text-purple-200/70 text-sm">Unique, hand-drawn coloring pages covering every theme imaginable.</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/50 transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.28l5.67-5.67" /></svg>
              </div>
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">Regular Updates</h3>
              <p className="text-purple-800/70 dark:text-purple-200/70 text-sm">Fresh new coloring content added every week to keep the fun going.</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/50 transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
              </div>
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">100% Free</h3>
              <p className="text-purple-800/70 dark:text-purple-200/70 text-sm">All of our coloring pages are completely free to download and print.</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/50 transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
              </div>
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">Organized Categories</h3>
              <p className="text-purple-800/70 dark:text-purple-200/70 text-sm">Easily find exactly what you're looking for with our clean organization.</p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/50 transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
              </div>
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">Print-Ready Files</h3>
              <p className="text-purple-800/70 dark:text-purple-200/70 text-sm">High-resolution PDFs perfectly formatted for standard paper sizes.</p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400/50 transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              </div>
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">Colored Reference</h3>
              <p className="text-purple-800/70 dark:text-purple-200/70 text-sm">Every page comes with a beautifully colored example to inspire your creativity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-[1240px] mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#0F0728] dark:text-white mb-4">
          Ready to Start Coloring?
        </h2>
        <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Grab your crayons, markers, or colored pencils. Explore our collection and let your creativity shine!
        </p>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_auto] text-white px-7 py-3 rounded-full font-bold text-base shadow-sm hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 hover:bg-[position:right_center] transition-all duration-500"
        >
          Explore Coloring Pages
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </Link>
      </div>
    </div>
  );
}
