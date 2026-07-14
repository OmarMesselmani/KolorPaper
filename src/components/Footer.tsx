'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

interface FooterProps {
  categories?: Category[];
}

export default function Footer({ categories = [] }: FooterProps) {
  // Get first 6 parent categories to display dynamically in the footer, or fall back to static list if none passed
  const popularCategories = categories.length > 0
    ? categories.filter(c => !c.parentSlug).slice(0, 5)
    : [
        { id: "1", title: "Animals", slug: "animals" },
        { id: "11", title: "Fantasy", slug: "fantasy" },
        { id: "9", title: "Space", slug: "space" },
        { id: "2", title: "Transportation", slug: "transportation" },
        { id: "3", title: "Nature", slug: "nature" }
      ];

  return (
    <footer className="relative bg-[#0F0728] text-white mt-24 print:hidden overflow-hidden">

      {/* Decorative background glow shapes */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          
          {/* Brand Info & Vision Column */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block no-underline">
              <Image src="/logoWhite.svg" alt="KolorPaper" width={220} height={44} className="h-11 w-auto object-contain" />
            </Link>
            <p className="text-purple-200/70 text-sm leading-relaxed max-w-sm">
              Bringing colors to life! Explore KolorPaper&apos;s universe of high-quality printable coloring pages. Every page includes a beautifully colored reference to inspire your creativity.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/kolorpaper" 
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
                    href={category.parentSlug ? `/${category.parentSlug}/${category.slug}` : `/${category.slug}`}
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
                  href="/categories"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  All Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  Blog
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

          {/* About Column */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-white font-extrabold text-lg tracking-wider uppercase relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-1 after:bg-orange-500 after:rounded">
              About
            </h3>
            <ul className="space-y-3 p-0 m-0 list-none pt-2">
              <li>
                <Link 
                  href="/about"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="group text-purple-200/70 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-sm font-bold no-underline"
                >
                  <span className="text-purple-400 group-hover:text-orange-400 transition-colors duration-300 text-xs">✦</span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider line between grid and copyrights */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent w-full" />

        {/* Footer Bottom Bar */}
        <div className="py-8 flex justify-center items-center">
          <p className="text-purple-200 text-xs text-center m-0 font-medium font-sans">
            &copy; {new Date().getFullYear()} <span className="text-white font-bold">KolorPaper</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
