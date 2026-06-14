import { Metadata } from 'next';
import db from '@/lib/db';
import ProductsClient from './ProductsClient';

export async function generateMetadata(): Promise<Metadata> {
  let title = "Products";
  let description = "";

  try {
    const pageSeo = db.prepare("SELECT * FROM page_seo WHERE page_slug = 'products'").get() as any;
    if (pageSeo && pageSeo.meta_title) title = pageSeo.meta_title;
    if (pageSeo && pageSeo.meta_description) description = pageSeo.meta_description;
  } catch (e) {
    console.error("Failed to fetch products page SEO", e);
  }

  const metadata: Metadata = {};
  if (title && title !== "Products") metadata.title = title;
  if (description) metadata.description = description;

  return metadata;
}

export default function ProductsPage() {
  return <ProductsClient />;
}
