import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 className="main-title">🎨 ColoPaper</h1>
        </Link>
        <nav className="no-print">
          <Link href="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem' }}>
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
