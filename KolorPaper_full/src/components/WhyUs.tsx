const features = [
  {
    title: "Completely Free",
    description: "All coloring pages are 100% free to download and print — no hidden fees, no subscriptions.",
  },
  {
    title: "Print-Ready Quality",
    description: "Every page is optimized for high-quality printing so colors come out vivid and crisp.",
  },
  {
    title: "Always Updated",
    description: "We regularly add new pages and categories so there's always something fresh to discover.",
  },
  {
    title: "Family Friendly",
    description: "Safe, age-appropriate content suitable for toddlers, kids, and adults alike.",
  },
];

export default function WhyUs() {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-6 py-16">
      {/* Section header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-[#0F0728] dark:text-white mb-4">
          Why{" "}
          <span className="bg-gradient-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent">
            KolorPaper?
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-medium">
          The easiest way to find, print, and color thousands of free pages — all in one place.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center gap-3 p-7 rounded-2xl bg-white dark:bg-gray-900 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-purple-600/20 dark:hover:border-purple-500/30 transition-all duration-300 group"
          >
            <h3 className="text-lg font-black bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent pb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
