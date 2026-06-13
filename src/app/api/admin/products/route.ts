import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}

function isPasswordChangeRequired() {
  const pcRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'password_changed'").get() as { value: string } | undefined;
  return pcRow?.value === '0';
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (isPasswordChangeRequired()) return NextResponse.json({ error: 'Password change required' }, { status: 403 });

  try {
    const items = db.prepare('SELECT * FROM products_items ORDER BY display_order ASC').all();
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (isPasswordChangeRequired()) return NextResponse.json({ error: 'Password change required' }, { status: 403 });

  try {
    const data = await request.json();
    const { slug, name, description, features_json, color, logo_url, status, display_order } = data;
    
    if (!slug || !name || !description || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(
      'INSERT INTO products_items (slug, name, description, features_json, color, logo_url, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(slug, name, description, features_json ? (typeof features_json === 'string' ? features_json : JSON.stringify(features_json)) : null, color, logo_url || null, status || 'Officially released', display_order || 0);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (isPasswordChangeRequired()) return NextResponse.json({ error: 'Password change required' }, { status: 403 });

  try {
    const data = await request.json();
    const { id, slug, name, description, features_json, color, logo_url, status, display_order } = data;
    
    if (!id || !slug || !name || !description || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    db.prepare(
      'UPDATE products_items SET slug = ?, name = ?, description = ?, features_json = ?, color = ?, logo_url = ?, status = ?, display_order = ? WHERE id = ?'
    ).run(slug, name, description, features_json ? (typeof features_json === 'string' ? features_json : JSON.stringify(features_json)) : null, color, logo_url || null, status || 'Officially released', display_order || 0, id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (isPasswordChangeRequired()) return NextResponse.json({ error: 'Password change required' }, { status: 403 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    db.prepare('DELETE FROM products_items WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
