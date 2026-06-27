import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';
import https from 'https';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}


function downloadFile(url: string, destPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (url.startsWith('/') || url.startsWith('file://')) {
      resolve(url);
      return;
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
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

  try {
    const publicDir = path.resolve(process.cwd(), 'public');
    const sections = ['brand', 'hero', 'services', 'gallery', 'team', 'articles', 'products'];
    
    sections.forEach(sec => {
      const dir = path.join(publicDir, 'images', sec);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // 1. Hero background image & video
    const hero = db.prepare("SELECT * FROM hero_settings WHERE id = 1").get() as any;
    if (hero) {
      if (hero.background_url && hero.background_url.startsWith('http')) {
        const destImg = path.join(publicDir, 'images', 'hero', 'hero_bg.jpg');
        await downloadFile(hero.background_url, destImg);
        db.prepare("UPDATE hero_settings SET background_url = ? WHERE id = 1")
          .run('/images/hero/hero_bg.jpg');
      }
    }

    // 2. Services cards
    const services = db.prepare("SELECT * FROM services_cards").all() as any[];
    for (const card of services) {
      if (card.image_url && card.image_url.startsWith('http')) {
        const fileExt = card.image_url.includes('.webp') ? '.webp' : '.jpg';
        const cleanTitle = card.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const filename = `${card.id}_${cleanTitle}${fileExt}`;
        const dest = path.join(publicDir, 'images', 'services', filename);
        
        await downloadFile(card.image_url, dest);
        db.prepare("UPDATE services_cards SET image_url = ? WHERE id = ?")
          .run(`/images/services/${filename}`, card.id);
      }
    }

    // 3. Gallery items
    const gallery = db.prepare("SELECT * FROM gallery_items").all() as any[];
    for (const item of gallery) {
      if (item.image_url && item.image_url.startsWith('http')) {
        const fileExt = item.image_url.includes('.webp') ? '.webp' : '.jpg';
        const filename = `gallery_${item.id}${fileExt}`;
        const dest = path.join(publicDir, 'images', 'gallery', filename);
        
        await downloadFile(item.image_url, dest);
        db.prepare("UPDATE gallery_items SET image_url = ? WHERE id = ?")
          .run(`/images/gallery/${filename}`, item.id);
      }
    }

    // 4. Team cards
    const team = db.prepare("SELECT * FROM team_cards").all() as any[];
    for (const member of team) {
      if (member.image_url && member.image_url.startsWith('http')) {
        const fileExt = member.image_url.includes('.webp') ? '.webp' : '.jpg';
        const cleanName = member.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const filename = `${cleanName}${fileExt}`;
        const dest = path.join(publicDir, 'images', 'team', filename);
        
        await downloadFile(member.image_url, dest);
        db.prepare("UPDATE team_cards SET image_url = ? WHERE id = ?")
          .run(`/images/team/${filename}`, member.id);
      }
    }

    // 5. Articles
    const articles = db.prepare("SELECT * FROM article_posts").all() as any[];
    for (const post of articles) {
      if (post.image_url && post.image_url.startsWith('http')) {
        const fileExt = post.image_url.includes('.webp') ? '.webp' : '.jpg';
        const cleanTitle = post.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
        const filename = `article_${post.id}_${cleanTitle}${fileExt}`;
        const dest = path.join(publicDir, 'images', 'articles', filename);
        
        await downloadFile(post.image_url, dest);
        db.prepare("UPDATE article_posts SET image_url = ? WHERE id = ?")
          .run(`/images/articles/${filename}`, post.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Image sync error:', err);
    return NextResponse.json({ error: err.message || 'Download error' }, { status: 500 });
  }
}
