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
    const subscribers = db.prepare("SELECT email, status, created_at FROM subscribers ORDER BY created_at DESC").all() as any[];

    // Generate CSV content
    const csvHeader = 'Email,Status,Date Subscribed\n';
    const csvRows = subscribers.map(sub => {
      const date = new Date(sub.created_at).toISOString();
      return `${sub.email},${sub.status},${date}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    // Return as a downloadable file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="subscribers.csv"',
      },
    });

  } catch (error) {
    console.error('Failed to export subscribers:', error);
    return NextResponse.json({ error: 'Failed to export subscribers' }, { status: 500 });
  }
}
