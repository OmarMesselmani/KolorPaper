import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "PaperKolor - Coloring World for Kids",
  description: "The best site for downloading and printing high-quality coloring pages for kids and adults.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getAllCategories();

  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 text-gray-800 font-sans antialiased m-0" style={{
        backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,0) 0, hsla(253,16%,7%,0) 50%, hsla(253,16%,7%,0.02) 100%), radial-gradient(at 50% 0%, hsla(225,39%,30%,0.03) 0, hsla(225,39%,30%,0) 50%, hsla(225,39%,30%,0) 100%)'
      }}>
        <Header categories={categories} />
        <main>{children}</main>
        <Footer categories={categories} />
      </body>
    </html>
  );
}
