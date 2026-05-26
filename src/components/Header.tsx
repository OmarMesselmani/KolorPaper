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
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between items-center w-full gap-4">
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-6 md:gap-8">
              <NavMenu categories={categories} />
              <Link href="/" className="no-underline flex items-center">
                <Image src="/logo.png" alt="KolorPaper" width={180} height={32} className="h-8 w-auto object-contain" />
              </Link>
            </div>
          </div>

          <SearchBar />

          <div className="flex items-center gap-4 sm:gap-6 order-2 sm:order-none">
            <DarkModeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
