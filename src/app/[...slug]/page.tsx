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

  const breadcrumbPaths = await Promise.all(slug.map(async (s, i) => {
    const cat = await getCategoryBySlug(s);
    const page = await getColoringPageBySlug(s);
    return {
      title: cat?.title || page?.title || s,
      href: `/${slug.slice(0, i + 1).join('/')}`
    };
  }));

  const coloringPage = await getColoringPageBySlug(lastSlug);
  if (coloringPage) {
    return (
      <>
        <div className="container" style={{ paddingTop: '2rem' }}>
          <Breadcrumbs paths={breadcrumbPaths} />
        </div>
        
        <div className="container" style={{ paddingBottom: '4rem' }}>
          <div className="coloring-view-layout">
            <div className="coloring-main-image">
              <img src={coloringPage.imageUrl} alt={coloringPage.title} />
            </div>
            <div className="coloring-details">
              <span className="badge">Coloring Page 🎨</span>
              <h2 className="title-gradient">{coloringPage.title}</h2>
              <p className="description">{coloringPage.description}</p>
              
              <div className="no-print actions-group">
                <PrintButton />
                <DownloadPdf imageUrl={coloringPage.imageUrl} title={coloringPage.title} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const category = await getCategoryBySlug(lastSlug);
  if (category) {
    const subCategories = await getCategories(category.slug);
    const pages = await getColoringPages(category.slug);

    return (
      <>
        <div className="container" style={{ paddingTop: '2rem' }}>
          <Breadcrumbs paths={breadcrumbPaths} />
          <h2 className="section-title">{category.title}</h2>
        </div>
        
        <div className="container">
          {subCategories.length > 0 && (
            <div className="sub-section">
              <h3 className="sub-title">Subcategories</h3>
              <div className="grid">
                {subCategories.map(sub => <CategoryCard key={sub.id} category={sub} />)}
              </div>
            </div>
          )}

          {pages.length > 0 && (
            <div className="sub-section">
              <h3 className="sub-title">Coloring Pages</h3>
              <div className="grid">
                {pages.map(page => <ColoringCard key={page.id} page={page} />)}
              </div>
            </div>
          )}
          
          {subCategories.length === 0 && pages.length === 0 && (
            <div className="empty-state">
              <p>No drawings found in this category yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </>
    );
  }

  return notFound();
}
