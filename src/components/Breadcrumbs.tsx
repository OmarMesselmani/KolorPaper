import Link from "next/link";

export default function Breadcrumbs({ paths }: { paths: { title: string, href: string }[] }) {
  return (
    <nav className="max-w-[1240px] mx-auto px-6 print:hidden mt-4 pb-0" aria-label="Breadcrumb">
      <ol className="list-none p-0 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link href="/" className="text-purple-600 dark:text-purple-400 no-underline hover:underline font-medium">Home</Link>
        </li>
        {paths.map((path, index) => (
          <li key={index} className="flex gap-2">
            <span>/</span>
            <Link href={path.href} className={`no-underline font-medium ${index === paths.length - 1 ? 'text-inherit pointer-events-none' : 'text-purple-600 dark:text-purple-400 hover:underline'}`}>
              {path.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
