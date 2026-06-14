import { Metadata } from 'next';
import db from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let title = "Page Not Found";
  let description = "";

  try {
    const page = db.prepare("SELECT * FROM custom_pages WHERE slug = ?").get(params.slug) as any;
    if (page) {
      title = page.meta_title || `${page.title} - Alfazen Inc.`;
      description = page.meta_description || "";
    }
  } catch (e) {
    console.error("Failed to fetch page SEO", e);
  }

  return { title, description };
}

export default function CustomPage({ params }: { params: { slug: string } }) {
  const page = db.prepare("SELECT * FROM custom_pages WHERE slug = ?").get(params.slug) as any;

  if (!page) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>404 - Page Not Found</h1>
          <p style={{ color: 'var(--text-secondary)' }}>The page you are looking for does not exist.</p>
          <Link href="/" className="btn" style={{ marginTop: '24px' }}>Back Home</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Header />
      <div style={{ flex: 1, backgroundColor: 'var(--background)', paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: 0, color: 'var(--text-primary)', marginBottom: '32px' }}>
            {page.title}
          </h1>

          <div 
            className="custom-page-content" 
            dangerouslySetInnerHTML={{ __html: page.content_html }} 
            style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}
          />

        </div>
      </div>
      <Footer />
    </main>
  );
}
