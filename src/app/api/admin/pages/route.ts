import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pages = db.prepare("SELECT * FROM custom_pages ORDER BY id DESC").all();
    return NextResponse.json({ pages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, slug, title, content_html, meta_title, meta_description } = await request.json();

    if (id) {
      // Update
      db.prepare(`
        UPDATE custom_pages 
        SET slug = ?, title = ?, content_html = ?, meta_title = ?, meta_description = ? 
        WHERE id = ?
      `).run(slug, title, content_html, meta_title || null, meta_description || null, id);
    } else {
      // Create
      db.prepare(`
        INSERT INTO custom_pages (slug, title, content_html, meta_title, meta_description)
        VALUES (?, ?, ?, ?, ?)
      `).run(slug, title, content_html, meta_title || null, meta_description || null);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    db.prepare("DELETE FROM custom_pages WHERE id = ?").run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
