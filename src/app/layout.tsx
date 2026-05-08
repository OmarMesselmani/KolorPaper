import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ColoPaper - عالم التلوين للأطفال",
  description: "أفضل موقع لتحميل وطباعة صور التلوين للأطفال والكبار بجودة عالية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="header">
          <div className="container">
            <h1 className="main-title">🎨 ColoPaper</h1>
            <p>ارسم، لون، واستمتع!</p>
          </div>
        </header>
        <main>{children}</main>
        <footer className="container" style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
          <p>© 2024 ColoPaper - جميع الحقوق محفوظة</p>
        </footer>
      </body>
    </html>
  );
}
