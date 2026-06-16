import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cachedGetAllCategories } from "@/lib/data";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Tajawal } from "next/font/google";
import Script from "next/script";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KolorPaper - Printable Coloring Pages with Colored Examples",
    template: "%s | KolorPaper",
  },
  description: "Free printable coloring pages with colored examples for kids and adults. Download coloring sheets and use the included color reference to inspire your creativity.",
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'KolorPaper',
    title: 'KolorPaper - Printable Coloring Pages with Colored Examples',
    description: 'Free printable coloring pages with colored examples for kids and adults. Download coloring sheets and use the included color reference to inspire your creativity.',
    images: [
      {
        url: `${siteUrl}/images/cover.jpg`,
        width: 1200,
        height: 630,
        alt: 'KolorPaper - Printable Coloring Pages with Colored Examples',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KolorPaper - Printable Coloring Pages with Colored Examples',
    description: 'Free printable coloring pages with colored examples for kids and adults. Download coloring sheets and use the included color reference to inspire your creativity.',
    images: [`${siteUrl}/images/cover.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await cachedGetAllCategories();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Organization + WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "KolorPaper",
                "url": siteUrl,
                "logo": `${siteUrl}/logo.svg`,
                "sameAs": []
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "KolorPaper",
                "url": siteUrl,
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${siteUrl}/search?q={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              }
            ])
          }}
        />
      </head>
      <body className={`bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans antialiased m-0 transition-colors duration-300 ${tajawal.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LayoutWrapper categories={categories}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>

        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
