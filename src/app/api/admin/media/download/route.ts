import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

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
  try {
    const Database = require('better-sqlite3');
    const dbPath = path.resolve(process.cwd(), 'data/afzinc.db');
    const db = new Database(dbPath);
    const pcRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'password_changed'").get() as { value: string } | undefined;
    return pcRow?.value;
  } catch (e) {
    return '1';
  }
}

// Download file function supporting redirects
function downloadFromUrl(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (response) => {
      // Handle redirects (status codes 301, 302)
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFromUrl(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: status code ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { url, section } = await request.json();
    if (!url || !section) {
      return NextResponse.json({ error: 'Missing url or section' }, { status: 400 });
    }

    const sections = ['hero', 'services', 'gallery', 'team', 'articles'];
    if (!sections.includes(section)) {
      return NextResponse.json({ error: 'Invalid section folder' }, { status: 400 });
    }

    // Try to guess extension or filename from URL path
    const urlObj = new URL(url);
    let pathname = urlObj.pathname;
    let base = path.basename(pathname);

    // Default name if no clear file extension in path (e.g. Unsplash dynamic urls)
    if (!base || !base.includes('.')) {
      const format = urlObj.searchParams.get('fm') || 'jpg';
      base = `downloaded_image.${format}`;
    }

    // Sanitize base name
    const timestamp = Date.now();
    const sanitizedName = base
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

    console.log(`Downloading external URL: ${url} to ${finalPath}`);
    await downloadFromUrl(url, finalPath);

    const clientUrl = `/images/${section}/${finalFilename}`;

    return NextResponse.json({ 
      success: true, 
      url: clientUrl,
      filename: finalFilename
    });
  } catch (err: any) {
    console.error('Download media error:', err);
    return NextResponse.json({ error: err.message || 'Failed to download external asset' }, { status: 500 });
  }
}
