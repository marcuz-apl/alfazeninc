import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}


export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const pages = db.prepare('SELECT * FROM page_seo').all();
    return NextResponse.json({ pages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { page_slug, meta_title, meta_description } = await request.json();
    if (!page_slug) return NextResponse.json({ error: 'Missing page_slug' }, { status: 400 });

    db.prepare('UPDATE page_seo SET meta_title = ?, meta_description = ? WHERE page_slug = ?').run(meta_title || null, meta_description || null, page_slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
