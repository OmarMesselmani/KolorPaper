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
              <h1 className="main-title">🎨 ColoPaper</h1>
            </Link>
            <nav className="no-print">
              <Link href="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem' }}>
                Home
              </Link>
            </nav>
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
