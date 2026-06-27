import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}

function isPasswordChangeRequired() {
  const pcRow = dbPrepareValue();
  return pcRow === '0';
}

function dbPrepareValue() {
  // Read DB directly to avoid ESM imports caching issue if any
  try {
    const Database = require('better-sqlite3');
    const dbPath = path.resolve(process.cwd(), 'data/smb4all.db');
    const db = new Database(dbPath);
    const pcRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'password_changed'").get() as { value: string } | undefined;
    return pcRow?.value;
  } catch (e) {
    return '1';
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const section = formData.get('section') as string | null;

    if (!file || !section) {
      return NextResponse.json({ error: 'Missing file or section' }, { status: 400 });
    }

    const sections = ['brand', 'hero', 'services', 'gallery', 'team', 'articles', 'products'];
    if (!sections.includes(section)) {
      return NextResponse.json({ error: 'Invalid section folder' }, { status: 400 });
    }

    // Read file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Limit to 50MB
    const limitBytes = 50 * 1024 * 1024;
    if (buffer.length > limitBytes) {
      return NextResponse.json({ error: 'File size exceeds the 50MB limit.' }, { status: 400 });
    }

    // Sanitize filename and append unique timestamp
    const timestamp = Date.now();
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_');
    const finalFilename = `${timestamp}-${sanitizedName}`;

    // Target folder path
    const publicDir = path.resolve(process.cwd(), 'public');
    const destDir = path.join(publicDir, 'images', section);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const finalPath = path.join(destDir, finalFilename);
    fs.writeFileSync(finalPath, buffer);

    const clientUrl = `/images/${section}/${finalFilename}`;

    return NextResponse.json({ 
      success: true, 
      url: clientUrl,
      filename: finalFilename
    });
  } catch (err: any) {
    console.error('Upload media error:', err);
    return NextResponse.json({ error: err.message || 'Server upload error' }, { status: 500 });
  }
}
