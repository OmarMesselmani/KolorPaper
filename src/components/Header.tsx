import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 className="main-title">🎨 PaperKolor</h1>
            </Link>

          </div>

          <SearchBar />

          <div className="header-right">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
