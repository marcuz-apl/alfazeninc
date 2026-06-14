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
    const layout = db.prepare("SELECT value FROM admin_settings WHERE key = 'homepage_layout'").get() as any;
    return NextResponse.json({ layout: layout ? JSON.parse(layout.value) : [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch layout' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== process.env.SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { layout } = await request.json();
    db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('homepage_layout', ?)").run(JSON.stringify(layout));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save layout' }, { status: 500 });
  }
}
