import { prisma } from "@/lib/db";

export default async function StatsBar() {
  let statsData = { totalPages: 0, totalCategories: 0, totalDownloads: 0 };
  
  try {
    const totalPages = await prisma.coloringPage.count({ where: { published: true } });
    const totalCategories = await prisma.category.count();
    const pageMetrics = await prisma.coloringPage.aggregate({
      where: { published: true },
      _sum: { downloads: true }
    });
    
    statsData = {
      totalPages,
      totalCategories,
      totalDownloads: pageMetrics._sum.downloads || 0
    };
  } catch (error) {
    console.error("Failed to fetch public stats from DB:", error);
  }

  const formatCount = (n: number) => {
    if (n >= 1_000_000) {
      const formatted = (n / 1_000_000).toFixed(1);
      return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M+`;
    }
    if (n >= 1_000) {
      const formatted = (n / 1_000).toFixed(1);
      return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}K+`;
    }
    return String(n);
  };

  const stats = [
    { value: formatCount(statsData.totalPages), label: "Coloring Pages" },
    { value: formatCount(statsData.totalCategories), label: "Categories" },
    { value: "100%",   label: "Free" },
    { value: formatCount(statsData.totalDownloads), label: "Downloads" },
  ];

  return (
    <section className="w-full max-w-[1240px] mx-auto px-6 mb-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-2xl bg-white dark:bg-gray-900 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent">
              {stat.value}
            </span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
