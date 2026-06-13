import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const settings = db.prepare("SELECT * FROM products_settings WHERE id = 1").get();
    const items = db.prepare("SELECT * FROM products_items ORDER BY display_order ASC").all();

    return NextResponse.json({
      settings,
      items
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
