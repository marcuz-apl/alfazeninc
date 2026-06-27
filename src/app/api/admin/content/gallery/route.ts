import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}


// Update settings or slides
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Check if updating gallery settings (sliding_effect, autoplay_speed)
    if (data.sliding_effect !== undefined && data.autoplay_speed !== undefined) {
      db.prepare("INSERT OR REPLACE INTO gallery_settings (id, sliding_effect, autoplay_speed) VALUES (1, ?, ?)")
        .run(data.sliding_effect, data.autoplay_speed);
      return NextResponse.json({ success: true });
    }

    // Check if updating an individual slide
    const { id, image_url, image_alt, display_order, category } = data;
    if (!id || !image_url || !image_alt) {
      return NextResponse.json({ error: 'Missing required slide fields' }, { status: 400 });
    }

    db.prepare(`
      UPDATE gallery_items 
      SET image_url = ?, image_alt = ?, display_order = ?, category = ?
      WHERE id = ?
    `).run(image_url, image_alt, display_order || 0, category || 'all', id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update gallery error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Add a new slide
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { image_url, image_alt, display_order, category } = await request.json();
    if (!image_url || !image_alt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO gallery_items (image_url, image_alt, display_order, category)
      VALUES (?, ?, ?, ?)
    `).run(image_url, image_alt, display_order || 0, category || 'all');

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Create gallery item error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Delete a slide
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing slide ID' }, { status: 400 });
    }

    db.prepare("DELETE FROM gallery_items WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete gallery item error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
