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

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { title, content, show_contact_us, background_type, background_url } = await request.json();
    if (title === undefined || content === undefined || show_contact_us === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    db.prepare(`
      INSERT OR REPLACE INTO hero_settings (id, title, content, show_contact_us, background_type, background_url)
      VALUES (1, ?, ?, ?, ?, ?)
    `).run(title, content, show_contact_us ? 1 : 0, background_type || 'image', background_url || '/images/hero/hero_bg.jpg');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update hero error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
