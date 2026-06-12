import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const hero = db.prepare("SELECT * FROM hero_settings WHERE id = 1").get();
    const servicesSettings = db.prepare("SELECT * FROM services_settings WHERE id = 1").get();
    const services = db.prepare("SELECT * FROM services_cards ORDER BY display_order ASC, id ASC").all();
    const gallerySettings = db.prepare("SELECT * FROM gallery_settings WHERE id = 1").get();
    const gallery = db.prepare("SELECT * FROM gallery_items ORDER BY display_order ASC, id ASC").all();
    const team = db.prepare("SELECT * FROM team_cards ORDER BY display_order ASC, id ASC").all();
    const articles = db.prepare("SELECT * FROM article_posts ORDER BY display_order ASC, id ASC").all();

    // Parse JSON articles content safely
    const parsedArticles = articles.map((art: any) => {
      try {
        return {
          ...art,
          paragraphs: JSON.parse(art.content)
        };
      } catch (e) {
        return {
          ...art,
          paragraphs: [{ heading: '', text: art.content }]
        };
      }
    });

    return NextResponse.json({
      hero,
      servicesSettings,
      services,
      gallerySettings,
      gallery,
      team,
      articles: parsedArticles
    });
  } catch (err) {
    console.error('Fetch landing page content error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
