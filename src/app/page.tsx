import { getCategories } from "@/lib/data";
import CategoryCard from "@/components/CategoryCard";

export default async function Home() {
  const mainCategories = await getCategories();

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="badge">100% Free 🎨</span>
          <h2>Coloring World in Your Hands</h2>
          <p>Explore thousands of ready-to-print coloring pages, from cute animals to your favorite cartoon characters!</p>
        </div>
      </section>

      <div className="container">
        <div className="grid">
          {mainCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </>
  );
}
