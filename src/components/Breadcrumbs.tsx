import Link from "next/link";

export default function Breadcrumbs({ paths }: { paths: { title: string, href: string }[] }) {
  return (
    <nav className="container no-print" aria-label="Breadcrumb" style={{ paddingBottom: 0, marginTop: '1rem' }}>
      <ol style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#636e72' }}>
        <li>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
        </li>
        {paths.map((path, index) => (
          <li key={index} style={{ display: 'flex', gap: '0.5rem' }}>
            <span>/</span>
            <Link href={path.href} style={{ 
              color: index === paths.length - 1 ? 'inherit' : 'var(--primary)', 
              textDecoration: 'none',
              pointerEvents: index === paths.length - 1 ? 'none' : 'auto'
            }}>
              {path.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
