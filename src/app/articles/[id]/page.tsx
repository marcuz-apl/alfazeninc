import { Metadata } from 'next';
import db from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let title = "Article Details";
  let description = "Read our latest article.";

  try {
    const article = db.prepare("SELECT * FROM article_posts WHERE id = ?").get(params.id) as any;
    if (article) {
      title = article.meta_title || `${article.title} - Alfazen Inc.`;
      
      let excerpt = article.content;
      try {
        const parsed = JSON.parse(article.content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          excerpt = parsed[0].text;
        }
      } catch (e) {
        // use raw string
      }

      description = article.meta_description || excerpt?.substring(0, 160) || description;
    }
  } catch (e) {
    console.error("Failed to fetch article SEO", e);
  }

  return { title, description };
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = db.prepare("SELECT * FROM article_posts WHERE id = ?").get(params.id) as any;

  if (!article) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Article Not Found</h1>
          <p style={{ color: 'var(--text-secondary)' }}>The article you are looking for does not exist.</p>
          <Link href="/" className="btn" style={{ marginTop: '24px' }}>Back Home</Link>
        </div>
        <Footer />
      </main>
    );
  }

  let paragraphs = [];
  try {
    paragraphs = JSON.parse(article.content);
    if (!Array.isArray(paragraphs)) paragraphs = [{ text: article.content }];
  } catch (e) {
    paragraphs = [{ text: article.content }];
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Header />
      <div style={{ flex: 1, backgroundColor: 'var(--background)', paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <img 
            src={article.image_url} 
            alt={article.image_alt} 
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px' }} 
          />

          <h1 style={{ fontSize: '3.5rem', margin: 0, color: 'var(--text-primary)', marginBottom: '16px' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
            <span>By {article.author || 'Anonymous'}</span>
            <span>|</span>
            <span>{article.published_date}</span>
          </div>

          <div className="article-body">
            {paragraphs.map((para: any, idx: number) => (
              <div key={idx} style={{ marginBottom: '32px' }}>
                {para.heading && <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '16px' }}>{para.heading}</h3>}
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{para.text}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--surface-border)' }}>
            <Link href="/#article" className="btn btn-secondary">
              &larr; Back to Articles
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
