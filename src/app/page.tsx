import { getCategories } from "@/lib/data";
import CategoryCard from "@/components/CategoryCard";

export default async function Home() {
  const mainCategories = await getCategories(); // سيجلب الأصناف التي ليس لها parent

  return (
    <div className="container">
      <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>اختر صنفاً لتبدأ التلوين</h2>
        <p>مجموعة كبيرة من الرسومات الجاهزة للطباعة والتحميل</p>
      </section>

      <div className="grid">
        {mainCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
