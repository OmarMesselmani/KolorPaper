import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kolorpaper.com';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with KolorPaper. Send us your questions, suggestions, or feedback about our free printable coloring pages.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us',
    description: 'Get in touch with KolorPaper. Send us your questions, suggestions, or feedback about our free printable coloring pages.',
    url: `${siteUrl}/contact`,
    siteName: 'KolorPaper',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us',
    description: 'Get in touch with KolorPaper. Send us your questions, suggestions, or feedback about our free printable coloring pages.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
