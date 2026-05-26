'use client';

import { useState, useRef } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [botError, setBotError] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const loadTime = useRef(Date.now());
  const [cooldown, setCooldown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBotError(false);

    if (honeypotRef.current?.value) {
      setBotError(true);
      return;
    }

    if (Date.now() - loadTime.current < 3000) {
      setBotError(true);
      return;
    }

    if (name.trim() && email.trim() && message.trim()) {
      setSent(true);
      setCooldown(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => {
        setSent(false);
        setCooldown(false);
      }, 30000);
    }
  };

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <Breadcrumbs paths={[{ title: "Contact Us", href: "/contact" }]} />
      </div>
      <div className="max-w-[800px] mx-auto px-6 py-16 min-h-[60vh]">
        <h1 className="text-4xl font-black text-[#0F0728] dark:text-gray-100 mb-8">Contact Us</h1>
        <div className="prose prose-purple max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">Get in Touch</h2>
            <p>
              Have a question, suggestion, or just want to say hello? We would love to hear from you! 
              Feel free to reach out to us through any of the channels below.
            </p>
          </section>
 
          <section>
            <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">Send Us a Message</h2>
            {sent ? (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 text-purple-800 dark:text-purple-300 rounded-2xl font-semibold">
                Your message has been sent successfully! We&apos;ll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  tabIndex={-1}
                  autoComplete="off"
                />
                {botError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm font-semibold">
                    Submission blocked. Please try again in a moment.
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-purple-600/20 dark:border-white/10 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-purple-600/20 dark:border-white/10 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-purple-600/20 dark:border-white/10 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-sm transition-all duration-300 resize-y"
                  />
                </div>
                <button
                  type="submit"
                  disabled={cooldown}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 text-white font-extrabold rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  Send Message
                </button>
              </form>
            )}
          </section>
 
          <section>
            <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-[#0F0728] dark:text-gray-100 mb-1">Email</p>
                <a href="mailto:info@paperkolor.com" className="text-purple-600 dark:text-purple-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors no-underline font-semibold">
                  info@paperkolor.com
                </a>
              </div>
              <div>
                <p className="font-bold text-[#0F0728] dark:text-gray-100 mb-1">Follow Us</p>
                <div className="flex items-center gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-semibold no-underline">
                    Instagram
                  </a>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-semibold no-underline">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </section>
 
          <section>
            <h2 className="text-2xl font-bold text-[#0F0728] dark:text-gray-100 mb-4">Response Time</h2>
            <p>
              We typically respond within 24-48 hours during business days. Your feedback helps us improve 
              and grow, so don&apos;t hesitate to reach out!
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
