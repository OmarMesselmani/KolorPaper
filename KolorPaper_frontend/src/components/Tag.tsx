import Link from "next/link";

interface TagProps {
  name: string;
  className?: string;
}

export default function Tag({ name, className = "" }: TagProps) {
  return (
    <Link 
      href={`/tags/${encodeURIComponent(name)}`}
      className={`px-3 py-1.5 bg-gray-50 dark:bg-gray-950/40 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5 text-xs font-bold rounded-xl whitespace-nowrap hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors ${className}`}
    >
      {name}
    </Link>
  );
}
