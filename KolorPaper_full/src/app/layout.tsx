import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getAllCategories } from "@/lib/data";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KolorPaper - Free Printable Coloring Pages for Kids & Adults",
    template: "%s | KolorPaper",
  },
  description: "Explore thousands of free printable coloring pages for kids and adults. Download high-quality coloring sheets, print and enjoy!",
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
    title: 'KolorPaper - Free Printable Coloring Pages for Kids & Adults',
    description: 'Explore thousands of free printable coloring pages for kids and adults. Download high-quality coloring sheets, print and enjoy!',
    images: [
      {
        url: `${siteUrl}/images/cover.jpg`,
        width: 1200,
        height: 630,
        alt: 'KolorPaper - Free Printable Coloring Pages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KolorPaper - Free Printable Coloring Pages for Kids & Adults',
    description: 'Explore thousands of free printable coloring pages for kids and adults. Download high-quality coloring sheets, print and enjoy!',
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
  const categories = await getAllCategories();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
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
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans antialiased m-0 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutWrapper categories={categories}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>

        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
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
