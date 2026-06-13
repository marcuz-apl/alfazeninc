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
    const settings = db.prepare('SELECT * FROM products_settings WHERE id = 1').get();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (isPasswordChangeRequired()) return NextResponse.json({ error: 'Password change required' }, { status: 403 });

  try {
    const { title, description } = await request.json();
    if (!title || !description) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    db.prepare('UPDATE products_settings SET title = ?, description = ? WHERE id = 1').run(title, description);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
