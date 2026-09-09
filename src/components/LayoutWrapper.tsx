'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import type { Category } from "@/types";

export default function LayoutWrapper({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: Category[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    try {
      sessionStorage.removeItem('kolorpaper_auto_reload_on_error');
    } catch {}
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header categories={categories} />
      <main>{children}</main>
      <Footer categories={categories} />
      <BackToTop />
    </>
  );
}
