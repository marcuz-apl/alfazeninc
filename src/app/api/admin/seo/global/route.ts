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
    const settings = db.prepare('SELECT * FROM global_seo WHERE id = 1').get();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { global_title, global_description, og_image_url, twitter_handle } = await request.json();
    if (!global_title || !global_description) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    db.prepare('UPDATE global_seo SET global_title = ?, global_description = ?, og_image_url = ?, twitter_handle = ? WHERE id = 1').run(global_title, global_description, og_image_url || null, twitter_handle || null);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
