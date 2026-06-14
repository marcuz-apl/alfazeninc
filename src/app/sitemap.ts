import { MetadataRoute } from 'next';
import db from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alfazeninc.com';

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ];

  try {
    const products = db.prepare("SELECT slug FROM products_items").all() as any[];
    for (const product of products) {
      sitemap.push({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    const articles = db.prepare("SELECT id FROM article_posts").all() as any[];
    for (const article of articles) {
      sitemap.push({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.7,
      });
    }
  } catch (e) {
    console.error("Failed to fetch dynamic routes for sitemap", e);
  }

  return sitemap;
}
