import { getCategoryBySlug, getCategories, getColoringPages, getColoringPageBySlug } from "@/lib/data";
import CategoryCard from "@/components/CategoryCard";
import ColoringCard from "@/components/ColoringCard";
import PrintButton from "@/components/PrintButton";
import DownloadPdf from "@/components/DownloadPdf";
import Breadcrumbs from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const lastSlug = slug[slug.length - 1];

  // تحضير مسارات Breadcrumbs
  const breadcrumbPaths = await Promise.all(slug.map(async (s, i) => {
    const cat = await getCategoryBySlug(s);
    const page = await getColoringPageBySlug(s);
    return {
      title: cat?.title || page?.title || s,
      href: `/${slug.slice(0, i + 1).join('/')}`
    };
  }));

  // 1. تحقق إذا كان الرابط يؤدي لصفحة تلوين فردية
  const coloringPage = await getColoringPageBySlug(lastSlug);
  if (coloringPage) {
    return (
      <>
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="container">
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px', background: 'white', padding: '1rem', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
              <img src={coloringPage.imageUrl} alt={coloringPage.title} style={{ width: '100%', borderRadius: '10px' }} />
            </div>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>{coloringPage.title}</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{coloringPage.description}</p>
              
              <div className="no-print" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <PrintButton />
                <DownloadPdf imageUrl={coloringPage.imageUrl} title={coloringPage.title} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 2. تحقق إذا كان الرابط يؤدي لصنف
  const category = await getCategoryBySlug(lastSlug);
  if (category) {
    const subCategories = await getCategories(category.slug);
    const pages = await getColoringPages(category.slug);

    return (
      <>
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{category.title}</h2>
          
          {subCategories.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>الأصناف الفرعية</h3>
              <div className="grid">
                {subCategories.map(sub => <CategoryCard key={sub.id} category={sub} />)}
              </div>
            </div>
          )}

          {pages.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>رسومات التلوين</h3>
              <div className="grid">
                {pages.map(page => <ColoringCard key={page.id} page={page} />)}
              </div>
            </div>
          )}
          
          {subCategories.length === 0 && pages.length === 0 && <p>لا توجد رسومات في هذا الصنف حالياً.</p>}
        </div>
      </>
    );
  }

  return notFound();
}
