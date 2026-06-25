import { cachedGetAllCategories } from "@/lib/data";
import CollapsibleCategorySection from "@/components/CollapsibleCategorySection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Categories - KolorPaper",
  description: "Browse all coloring page categories and themes on KolorPaper.",
};

export default async function CategoriesPage() {
  const allCategories = await cachedGetAllCategories();

  // Filter top-level categories
  const mainCategories = allCategories.filter(c => !c.parentSlug);
  
  const breadcrumbPaths = [
    { title: "Home", href: "/" },
    { title: "Categories", href: "/categories" },
  ];

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-6 pt-8">
        <Breadcrumbs paths={breadcrumbPaths} />
        <h1 className="text-4xl font-extrabold mt-8 mb-3 text-gray-800 dark:text-gray-100">All Categories</h1>
        <p className="text-sm sm:text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-8 max-w-3xl">
          Browse all our main categories and specific coloring page topics to find exactly what you're looking for.
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto px-6">
        {mainCategories.length > 0 ? (
          <div className="mb-16 flex flex-col gap-8">
            {mainCategories.map(main => {
              const subCategories = allCategories.filter(sub => sub.parentSlug === main.slug);
              return (
                <CollapsibleCategorySection 
                  key={main.id} 
                  mainCategory={main} 
                  subCategories={subCategories} 
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center p-16 bg-white dark:bg-gray-900 rounded-2xl text-gray-500 dark:text-gray-400 border-2 border-dashed border-black/5 dark:border-white/5 mb-16">
            <p className="mb-4">No categories found.</p>
          </div>
        )}
      </div>
    </>
  );
}
