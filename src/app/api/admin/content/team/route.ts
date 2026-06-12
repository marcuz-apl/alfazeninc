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

// Update a team card
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { id, name, role, bio, image_url, display_order } = await request.json();
    if (!id || !name || !role || !bio || !image_url) {
      return NextResponse.json({ error: 'Missing required card fields' }, { status: 400 });
    }

    db.prepare(`
      UPDATE team_cards 
      SET name = ?, role = ?, bio = ?, image_url = ?, display_order = ?
      WHERE id = ?
    `).run(name, role, bio, image_url, display_order || 0, id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update team error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Add a new team card
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { name, role, bio, image_url, display_order } = await request.json();
    if (!name || !role || !bio || !image_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO team_cards (name, role, bio, image_url, display_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, role, bio, image_url, display_order || 0);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Create team member error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Delete a team card
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing card ID' }, { status: 400 });
    }

    db.prepare("DELETE FROM team_cards WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete team member error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
