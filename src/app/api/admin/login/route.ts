import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as { value: string } | undefined;
    const dbHashedPassword = row?.value;

    const inputHashed = crypto.createHash('sha256').update(password || '').digest('hex');

    if (username === ADMIN_USER && dbHashedPassword && inputHashed === dbHashedPassword) {
      const pcRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'password_changed'").get() as { value: string } | undefined;
      const passwordChangeRequired = pcRow?.value === '0';

      const response = NextResponse.json({ success: true, passwordChangeRequired });
      
      // Set secure HTTP-only cookie
      response.cookies.set('admin_session', SESSION_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
