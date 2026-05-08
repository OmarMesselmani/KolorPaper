import Link from "next/link";
import { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/${category.slug}`} className="category-card">
      <div className="card-image-container">
        {/* سنستخدم صورة افتراضية حالياً أو صورة الصنف */}
        <div className="placeholder-img">🎨</div>
      </div>
      <div className="card-content">
        <h3>{category.title}</h3>
        {category.description && <p>{category.description}</p>}
      </div>
    </Link>
  );
}
