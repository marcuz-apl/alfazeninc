import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';
  
  if (!session || session.value !== SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscribers = db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all();
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';
  
  if (!session || session.value !== SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM subscribers WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete subscriber:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
