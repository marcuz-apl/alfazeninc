import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}

function isPasswordChangeRequired() {
  const pcRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'password_changed'").get() as { value: string } | undefined;
  return pcRow?.value === '0';
}

const SECTIONS = ['brand', 'hero', 'services', 'gallery', 'team', 'articles', 'products'] as const;

// GET: List files in public/images subfolders
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const publicDir = path.resolve(process.cwd(), 'public');
    const result: Record<string, { name: string, size: number, dimensions?: string }[]> = {};

    SECTIONS.forEach((sec) => {
      const dirPath = path.join(publicDir, 'images', sec);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      const files = fs.readdirSync(dirPath)
        .filter(file => {
          const stats = fs.statSync(path.join(dirPath, file));
          return stats.isFile() && !file.startsWith('.');
        })
        .map(file => {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);
          let dimensions;
          try {
            const buffer = fs.readFileSync(filePath);
            const dimensionsObj = imageSize(buffer);
            if (dimensionsObj && dimensionsObj.width && dimensionsObj.height) {
              dimensions = `${dimensionsObj.width}x${dimensionsObj.height}`;
            }
          } catch (e) {
            // Not an image or unsupported format, skip dimensions
          }
          return { name: file, size: stats.size, dimensions };
        });
        
      result[sec] = files;
    });

    return NextResponse.json({ files: result });
  } catch (err: any) {
    console.error('List media error:', err);
    return NextResponse.json({ error: 'Database/fs error' }, { status: 500 });
  }
}

// DELETE: Safely delete a file from disk if not in use in the database
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isPasswordChangeRequired()) {
    return NextResponse.json({ error: 'Password change required' }, { status: 403 });
  }

  try {
    const { filename, section } = await request.json();
    if (!filename || !section || !SECTIONS.includes(section)) {
      return NextResponse.json({ error: 'Missing filename or invalid section' }, { status: 400 });
    }

    const publicDir = path.resolve(process.cwd(), 'public');
    const filePath = path.join(publicDir, 'images', section, filename);
    const dbUrlPath = `/images/${section}/${filename}`;

    // 1. Check if the file is used in database
    // Hero background
    const inHero = db.prepare("SELECT count(*) as count FROM hero_settings WHERE background_url = ?").get(dbUrlPath) as { count: number };
    // Services
    const inServices = db.prepare("SELECT count(*) as count FROM services_cards WHERE image_url = ?").get(dbUrlPath) as { count: number };
    // Gallery
    const inGallery = db.prepare("SELECT count(*) as count FROM gallery_items WHERE image_url = ?").get(dbUrlPath) as { count: number };
    // Team
    const inTeam = db.prepare("SELECT count(*) as count FROM team_cards WHERE image_url = ?").get(dbUrlPath) as { count: number };
    // Articles
    const inArticles = db.prepare("SELECT count(*) as count FROM article_posts WHERE image_url = ?").get(dbUrlPath) as { count: number };
    // Products
    const inProducts = db.prepare("SELECT count(*) as count FROM products_items WHERE logo_url = ?").get(dbUrlPath) as { count: number };

    const inUse = (inHero?.count || 0) > 0 || 
                  (inServices?.count || 0) > 0 || 
                  (inGallery?.count || 0) > 0 || 
                  (inTeam?.count || 0) > 0 || 
                  (inArticles?.count || 0) > 0 ||
                  (inProducts?.count || 0) > 0;

    if (inUse) {
      return NextResponse.json({ 
        error: `Cannot delete '${filename}'. This asset is currently in use on the website.` 
      }, { status: 400 });
    }

    // 2. Delete the file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete media error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
