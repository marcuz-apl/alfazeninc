import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    try {
      const stmt = db.prepare('INSERT INTO subscribers (email) VALUES (?)');
      stmt.run(email.toLowerCase().trim());
      
      return NextResponse.json({ success: true, message: 'Subscribed successfully' });
    } catch (dbError: any) {
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        // They are already subscribed
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
