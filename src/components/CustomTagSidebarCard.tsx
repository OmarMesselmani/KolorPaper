import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CustomTagSidebarCard({ name }: { name: string }) {
  // Fetch tag data to get its custom image, and count total pages
  const [tagData, count] = await Promise.all([
    prisma.tag.findUnique({
      where: { name }
    }),
    prisma.coloringPage.count({
      where: { tags: { contains: '"' + name + '"' }, published: true }
    })
  ]);

  if (count === 0) {
    // If no pages are found for this tag, return null to hide it
    return null;
  }

  const imageUrl = tagData?.imageUrl;
  
  // Format title: strictly use capitalized tag name as requested
  const title = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <Link 
      href={`/tags/${name}`} 
      className="flex items-center gap-3 p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-black/5 dark:border-white/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-600/20 dark:hover:border-purple-500/30 group relative"
    >
      <div className="w-14 h-14 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-sm border border-black/5 dark:border-white/5">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title} 
            fill 
            sizes="56px"
            className="object-cover group-hover:scale-110 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl placeholder-img">
            🎨
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate capitalize m-0">{title}</h4>
        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-1">({count}) pages</p>
      </div>
    </Link>
  );
}
