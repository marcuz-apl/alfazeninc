import { Metadata } from 'next';
import db from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  let title = "Product Details";
  let description = "Learn more about our product.";

  try {
    const { slug } = await params;
    const product = db.prepare("SELECT * FROM products_items WHERE slug = ?").get(slug) as any;
    if (product) {
      title = product.meta_title || `${product.name} - Alfazen Inc.`;
      description = product.meta_description || product.description;
    }
  } catch (e) {
    console.error("Failed to fetch product SEO", e);
  }

  return { title, description };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = db.prepare("SELECT * FROM products_items WHERE slug = ?").get(slug) as any;

  if (!product) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Product Not Found</h1>
          <p style={{ color: 'var(--text-secondary)' }}>The product you are looking for does not exist.</p>
          <Link href="/products" className="btn" style={{ marginTop: '24px' }}>Back to Products</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const features = product.features_json ? JSON.parse(product.features_json) : null;
  const statusBgColor = product.status === 'Officially released' ? '#ef4444' : '#22c55e';

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Header />
      <div style={{ flex: 1, backgroundColor: 'var(--background)', paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="card" style={{ padding: '60px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
              
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <h1 style={{ fontSize: '3.5rem', margin: 0, color: 'var(--text-primary)' }}>{product.name}™</h1>
                  <span style={{ padding: '6px 12px', backgroundColor: statusBgColor, color: '#ffffff', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {product.status || 'Officially released'}
                  </span>
                </div>
                
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  {product.description}
                </p>

                {features && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Key Features</h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      {features.map((feat: string, i: number) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {product.checkout_url ? (
                    <>
                      <a href={product.checkout_url} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '1.1rem', padding: '12px 32px' }}>
                        Buy Now / Get Access
                      </a>
                      <Link href="/products" className="btn btn-secondary">
                        &larr; Back
                      </Link>
                    </>
                  ) : (
                    <Link href="/products" className="btn btn-secondary">
                      &larr; Back to Products
                    </Link>
                  )}
                </div>
              </div>

              <div style={{ 
                flex: '1 1 300px', 
                height: '400px', 
                borderRadius: 'var(--radius)', 
                background: product.logo_url ? 'transparent' : `linear-gradient(135deg, ${product.color}20, ${product.color}10)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {product.logo_url && (
                  <img src={product.logo_url} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
