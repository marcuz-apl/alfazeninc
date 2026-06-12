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

// Update a post
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { id, title, content, image_url, image_alt, author, published_date, display_order } = await request.json();
    if (!id || !title || !content || !image_url || !image_alt) {
      return NextResponse.json({ error: 'Missing required post fields' }, { status: 400 });
    }

    // content should be a string (JSON string or plaintext)
    const dbContent = typeof content === 'string' ? content : JSON.stringify(content);

    db.prepare(`
      UPDATE article_posts 
      SET title = ?, content = ?, image_url = ?, image_alt = ?, author = ?, published_date = ?, display_order = ?
      WHERE id = ?
    `).run(title, dbContent, image_url, image_alt, author || '', published_date || '', display_order || 0, id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update article post error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Add a new post
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { title, content, image_url, image_alt, author, published_date, display_order } = await request.json();
    if (!title || !content || !image_url || !image_alt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // content should be a string (JSON string or plaintext)
    const dbContent = typeof content === 'string' ? content : JSON.stringify(content);

    const result = db.prepare(`
      INSERT INTO article_posts (title, content, image_url, image_alt, author, published_date, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, dbContent, image_url, image_alt, author || '', published_date || '', display_order || 0);

    return NextResponse.json({ success: true, id: result.lastInsertRowId });
  } catch (err) {
    console.error('Create article post error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Delete a post
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
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }

    db.prepare("DELETE FROM article_posts WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete article post error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
