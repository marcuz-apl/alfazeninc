import { Metadata } from 'next';
import db from '@/lib/db';
import HomeClient from './HomeClient';

export async function generateMetadata(): Promise<Metadata> {
  let title = "Home";
  let description = "";

  try {
    const pageSeo = db.prepare("SELECT * FROM page_seo WHERE page_slug = 'home'").get() as any;
    if (pageSeo && pageSeo.meta_title) title = pageSeo.meta_title;
    if (pageSeo && pageSeo.meta_description) description = pageSeo.meta_description;
  } catch (e) {
    console.error("Failed to fetch home page SEO", e);
  }

  // If there's no override, Next.js falls back to the global metadata automatically
  const metadata: Metadata = {};
  if (title && title !== "Home") metadata.title = title;
  if (description) metadata.description = description;

  return metadata;
}

export default function Home() {
  return <HomeClient />;
}
