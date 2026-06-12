const fs = require('fs');
const path = require('path');
const https = require('https');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, '../data/afzinc.db');
const db = new Database(dbPath);

// Ensure the local folders exist
const sections = ['hero', 'services', 'gallery', 'team', 'articles'];
sections.forEach(sec => {
  const dir = path.resolve(__dirname, `../public/images/${sec}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    // If URL is already local, skip
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
      fs.unlink(destPath, () => {}); // Delete the file async if error
      reject(err);
    });
  });
}

async function run() {
  console.log('Starting download and sync process...');

  // Safe Migrations for existing databases
  try {
    db.exec("ALTER TABLE hero_settings ADD COLUMN background_type TEXT DEFAULT 'image'");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE hero_settings ADD COLUMN background_url TEXT DEFAULT '/images/hero/hero_bg.jpg'");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE team_cards ADD COLUMN image_zoom REAL DEFAULT 1.0");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE team_cards ADD COLUMN image_x REAL DEFAULT 0.0");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE team_cards ADD COLUMN image_y REAL DEFAULT 0.0");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE team_cards ADD COLUMN image_blur REAL DEFAULT 0.0");
  } catch (e) {}

  // 1. Hero background
  try {
    const hero = db.prepare("SELECT * FROM hero_settings WHERE id = 1").get();
    if (hero) {
      const imgUrl = hero.background_url || 'https://images.unsplash.com/photo-1731397977989-b4f4e298168f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0OTUyODh8MHwxfHNlYXJjaHwyMHx8b2lsJTIwZ2FzJTIwaW5kdXN0cnklMjB0ZWNobm9sb2d5fGVufDB8MHx8fDE3NjM0MDE3NjF8MA&ixlib=rb-4.1.0&q=85&w=1400&q=80&auto=format&fit=clip';
      const destImg = path.resolve(__dirname, '../public/images/hero/hero_bg.jpg');
      
      console.log('Downloading Hero Image...');
      await downloadFile(imgUrl, destImg);
      
      // Let's also download a default video background
      const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-oil-rig-pumping-under-sunset-41716-large.mp4';
      const destVideo = path.resolve(__dirname, '../public/images/hero/hero_bg.mp4');
      console.log('Downloading Hero Video...');
      try {
        await downloadFile(videoUrl, destVideo);
      } catch (videoErr) {
        console.error('Failed to download default hero video, using fallback empty video file placeholder', videoErr.message);
        // Create an empty file to prevent 404
        fs.writeFileSync(destVideo, '');
      }

      db.prepare("UPDATE hero_settings SET background_url = ?, background_type = ? WHERE id = 1")
        .run('/images/hero/hero_bg.jpg', 'image');
      
      console.log('Hero background migrated.');
    }
  } catch (err) {
    console.error('Error migrating Hero background:', err.message);
  }

  // 2. Services cards
  try {
    const cards = db.prepare("SELECT * FROM services_cards").all();
    for (const card of cards) {
      if (card.image_url.startsWith('http')) {
        const fileExt = card.image_url.includes('.webp') ? '.webp' : '.jpg';
        const cleanTitle = card.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const filename = `${card.id}_${cleanTitle}${fileExt}`;
        const dest = path.resolve(__dirname, `../public/images/services/${filename}`);
        
        console.log(`Downloading service image for: ${card.title}...`);
        await downloadFile(card.image_url, dest);
        
        db.prepare("UPDATE services_cards SET image_url = ? WHERE id = ?")
          .run(`/images/services/${filename}`, card.id);
      }
    }
    console.log('Services cards migrated.');
  } catch (err) {
    console.error('Error migrating Services cards:', err.message);
  }

  // 3. Gallery items
  try {
    const items = db.prepare("SELECT * FROM gallery_items").all();
    for (const item of items) {
      if (item.image_url.startsWith('http')) {
        const fileExt = item.image_url.includes('.webp') ? '.webp' : '.jpg';
        const filename = `gallery_${item.id}${fileExt}`;
        const dest = path.resolve(__dirname, `../public/images/gallery/${filename}`);
        
        console.log(`Downloading gallery image ID: ${item.id}...`);
        await downloadFile(item.image_url, dest);
        
        db.prepare("UPDATE gallery_items SET image_url = ? WHERE id = ?")
          .run(`/images/gallery/${filename}`, item.id);
      }
    }
    console.log('Gallery items migrated.');
  } catch (err) {
    console.error('Error migrating Gallery items:', err.message);
  }

  // 4. Team cards
  try {
    const members = db.prepare("SELECT * FROM team_cards").all();
    for (const member of members) {
      if (member.image_url.startsWith('http')) {
        const fileExt = member.image_url.includes('.webp') ? '.webp' : '.jpg';
        const cleanName = member.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const filename = `${cleanName}${fileExt}`;
        const dest = path.resolve(__dirname, `../public/images/team/${filename}`);
        
        console.log(`Downloading team profile for: ${member.name}...`);
        await downloadFile(member.image_url, dest);
        
        db.prepare("UPDATE team_cards SET image_url = ? WHERE id = ?")
          .run(`/images/team/${filename}`, member.id);
      }
    }
    console.log('Team cards migrated.');
  } catch (err) {
    console.error('Error migrating Team cards:', err.message);
  }

  // 5. Article posts
  try {
    const posts = db.prepare("SELECT * FROM article_posts").all();
    for (const post of posts) {
      if (post.image_url.startsWith('http')) {
        const fileExt = post.image_url.includes('.webp') ? '.webp' : '.jpg';
        const cleanTitle = post.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
        const filename = `article_${post.id}_${cleanTitle}${fileExt}`;
        const dest = path.resolve(__dirname, `../public/images/articles/${filename}`);
        
        console.log(`Downloading article cover for: ${post.title.substring(0, 20)}...`);
        await downloadFile(post.image_url, dest);
        
        db.prepare("UPDATE article_posts SET image_url = ? WHERE id = ?")
          .run(`/images/articles/${filename}`, post.id);
      }
    }
    console.log('Articles migrated.');
  } catch (err) {
    console.error('Error migrating articles:', err.message);
  }

  console.log('Image download and sync process completed successfully!');
}

run().catch(err => {
  console.error('Migration script failed:', err);
});
