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
    const messages = db.prepare("SELECT name, email, phone, message, created_at FROM messages ORDER BY created_at DESC").all() as any[];

    // Generate CSV content
    const csvHeader = 'Date,Name,Email,Phone,Message\n';
    const csvRows = messages.map(msg => {
      const date = new Date(msg.created_at).toISOString();
      // Escape quotes and wrap fields in quotes to handle commas/newlines in the message
      const escapeCSV = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      
      return `${date},${escapeCSV(msg.name)},${escapeCSV(msg.email)},${escapeCSV(msg.phone)},${escapeCSV(msg.message)}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    // Return as a downloadable file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="direct_messages.csv"',
      },
    });

  } catch (error) {
    console.error('Failed to export messages:', error);
    return NextResponse.json({ error: 'Failed to export messages' }, { status: 500 });
  }
}
