import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBar from "./SearchBar";
import NavMenu from "./NavMenu";
import DarkModeToggle from "./DarkModeToggle";
import { Category } from "@/types";

export default function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-[100] bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-purple-600/10 dark:border-white/10 py-4 transition-all duration-300 print:hidden">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Mobile Header (displayed on mobile screens only) */}
        <div className="flex sm:hidden items-center justify-between w-full relative">
          <div className="flex-shrink-0 z-10">
            <NavMenu categories={categories} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Link href="/" className="no-underline flex items-center pointer-events-auto">
              <Image src="/logo.svg" alt="KolorPaper - Free Printable Coloring Pages" width={220} height={44} className="h-11 w-auto object-contain" />
            </Link>
          </div>
          {/* Spacer to balance the layout */}
          <div className="w-10 h-10 pointer-events-none" />
        </div>

        {/* Desktop Header (displayed on sm screens and larger) */}
        <div className="hidden sm:flex justify-between items-center w-full gap-4">
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-6 md:gap-8">
              <NavMenu categories={categories} />
              <Link href="/" className="no-underline flex items-center">
                <Image src="/logo.svg" alt="KolorPaper - Free Printable Coloring Pages" width={240} height={48} className="h-12 w-auto object-contain" />
              </Link>
            </div>
          </div>

          <SearchBar />

          <div className="flex items-center gap-4 sm:gap-6 order-2 sm:order-none">
            <DarkModeToggle />
            {/* <LanguageSwitcher /> */}
          </div>
        </div>
      </div>
    </header>
  );
}
