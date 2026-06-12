import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing current or new password' }, { status: 400 });
    }

    // 1. Verify current password
    const row = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password'").get() as { value: string } | undefined;
    const dbHashedPassword = row?.value;

    const currentHashed = crypto.createHash('sha256').update(currentPassword).digest('hex');

    if (!dbHashedPassword || currentHashed !== dbHashedPassword) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    // 2. Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: 'New password must contain at least one uppercase letter' }, { status: 400 });
    }
    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json({ error: 'New password must contain at least one lowercase letter' }, { status: 400 });
    }
    if (!/\d/.test(newPassword)) {
      return NextResponse.json({ error: 'New password must contain at least one number' }, { status: 400 });
    }
    if (!/[@$!%*?&#]/.test(newPassword)) {
      return NextResponse.json({ error: 'New password must contain at least one special character (e.g. @$!%*?&#)' }, { status: 400 });
    }

    // Prevent re-using the same password
    const newHashed = crypto.createHash('sha256').update(newPassword).digest('hex');
    if (newHashed === dbHashedPassword) {
      return NextResponse.json({ error: 'New password cannot be the same as the current password' }, { status: 400 });
    }

    // 3. Save new password and set password_changed = '1'
    db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password', ?)")
      .run(newHashed);
    db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('password_changed', '1')")
      .run();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
