import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const stmt = db.prepare('INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, email, phone || null, message);

    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Database insertion error:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving your message.' },
      { status: 500 }
    );
  }
}
