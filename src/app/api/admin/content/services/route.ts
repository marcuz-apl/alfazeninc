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

// Update settings or cards
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const data = await request.json();
    
    // Check if updating settings title
    if (data.settingsTitle !== undefined) {
      db.prepare("INSERT OR REPLACE INTO services_settings (id, title) VALUES (1, ?)")
        .run(data.settingsTitle);
      return NextResponse.json({ success: true });
    }

    // Check if updating an individual card
    const { id, title, description, image_url, image_alt, display_order } = data;
    if (!id || !title || !description || !image_url || !image_alt) {
      return NextResponse.json({ error: 'Missing required card fields' }, { status: 400 });
    }

    db.prepare(`
      UPDATE services_cards 
      SET title = ?, description = ?, image_url = ?, image_alt = ?, display_order = ?
      WHERE id = ?
    `).run(title, description, image_url, image_alt, display_order || 0, id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update services error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Add a new card
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { title, description, image_url, image_alt, display_order } = await request.json();
    if (!title || !description || !image_url || !image_alt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO services_cards (title, description, image_url, image_alt, display_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description, image_url, image_alt, display_order || 0);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Create service card error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Delete a card
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

    db.prepare("DELETE FROM services_cards WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete service card error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
