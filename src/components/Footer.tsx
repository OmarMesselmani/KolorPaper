'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';

interface FooterProps {
  categories?: Category[];
}

export default function Footer({ categories = [] }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Get first 6 parent categories to display dynamically in the footer, or fall back to static list if none passed
  const popularCategories = categories.length > 0
    ? categories.filter(c => !c.parentSlug).slice(0, 6)
    : [
        { id: "1", title: "Animals", slug: "animals" },
        { id: "11", title: "Fantasy", slug: "fantasy" },
        { id: "9", title: "Space", slug: "space" },
        { id: "2", title: "Transportation", slug: "transportation" },
        { id: "10", title: "Education", slug: "education" },
        { id: "6", title: "Nature", slug: "nature" }
      ];

  return (
    <footer className="relative bg-[#0F0728] text-white mt-24 print:hidden overflow-hidden">
      {/* Decorative Brand Gradient Line at Top */}
      <div className="h-[5px] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 w-full" />

      {/* Decorative background glow shapes */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          
          {/* Brand Info & Vision Column */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block no-underline">
              <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent text-3xl font-black tracking-wide">
                🎨 PaperKolor
              </span>
            </Link>
            <p className="text-purple-200/70 text-sm leading-relaxed max-w-sm">
              Bringing colors to life! Explore our curated universe of high-quality printable coloring pages. Perfect for developing kids' creativity or enjoying a relaxing artistic escape for adults.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* Pinterest */}
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:-translate-y-1"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.102-.947-.195-2.404.04-3.443.213-.935 1.37-5.765 1.37-5.765s-.351-.7-.351-1.734c0-1.625.943-2.838 2.11-2.838 1.002 0 1.481.747 1.481 1.643 0 1.002-.646 2.507-.978 3.906-.276 1.162.581 2.108 1.73 2.108 2.07 0 3.661-2.185 3.661-5.337 0-2.794-2.007-4.75-4.87-4.75-3.317 0-5.263 2.485-5.263 5.053 0 1.002.383 2.077.865 2.662.097.117.11.221.081.338-.09.377-.29 1.18-.329 1.344-.052.214-.175.26-.405.152-1.516-.703-2.46-2.91-2.46-4.68 0-3.812 2.775-7.316 7.99-7.316 4.195 0 7.458 2.99 7.458 6.986 0 4.17-2.617 7.52-6.262 7.52-1.22 0-2.37-.633-2.763-1.383l-.75 2.868c-.27 1.04-.98 2.348-1.46 3.12a12.012 12.012 0 0113.978-13.97c4.685 1.954 7.613 6.425 7.613 11.48 0 6.62-5.367 11.987-11.988 11.987z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-500 hover:border-transparent transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* Youtube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 hover:-translate-y-1"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Popular Categories Column */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-white font-extrabold text-lg tracking-wider uppercase relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-1 after:bg-orange-500 after:rounded">
              Popular Categories
            </h3>
            <ul className="space-y-3 p-0 m-0 list-none pt-2">
              {popularCategories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/${category.slug}`}
                    className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                  >
                    <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-white font-extrabold text-lg tracking-wider uppercase relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-1 after:bg-orange-500 after:rounded">
              Quick Resources
            </h3>
            <ul className="space-y-3 p-0 m-0 list-none pt-2">
              <li>
                <Link 
                  href="/"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  Home Page
                </Link>
              </li>
              <li>
                <Link 
                  href="/print-guide"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  Perfect Print Guide
                </Link>
              </li>
              <li>
                <Link 
                  href="/coloring-tips"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  Kid's Coloring Tips
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-use"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-white font-extrabold text-lg tracking-wider uppercase relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-1 after:bg-orange-500 after:rounded">
              Coloring Club
            </h3>
            <div className="pt-2">
              <p className="text-purple-200/70 text-sm leading-relaxed mb-4">
                Get 10+ new free high-quality coloring sheets delivered directly to your inbox every single week!
              </p>
              
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/40 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-sm transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white font-extrabold rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#0F0728]"
                  >
                    Subscribe Now
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-gradient-to-r from-purple-950/80 to-purple-900/60 border border-purple-500/30 rounded-2xl animate-in fade-in duration-300">
                  <p className="text-orange-400 font-extrabold text-sm mb-1">🎉 Awesome Choice!</p>
                  <p className="text-purple-100 text-xs">You have successfully joined. Welcome to the Coloring Club!</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Divider line between grid and copyrights */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent w-full" />

        {/* Footer Bottom Bar */}
        <div className="py-8 flex justify-center items-center">
          <p className="text-purple-300/50 text-xs text-center m-0 font-medium font-sans">
            &copy; {new Date().getFullYear()} <span className="text-purple-300 font-bold">PaperKolor</span>. All Rights Reserved. Crafted with ❤️ for creative minds.
          </p>
        </div>
      </div>
    </footer>
  );
}
