import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { TEMPLATE_PRESETS } from '@/lib/templates/presets';

const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';

function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  return token === SESSION_SECRET;
}

// GET - List available templates
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get currently active site name from admin_settings to compare
    const activeSiteNameRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'site_name'").get() as { value: string } | undefined;
    const activeSiteName = activeSiteNameRow?.value || '';

    const templates = Object.values(TEMPLATE_PRESETS).map(preset => ({
      id: preset.id,
      name: preset.name,
      description: preset.description,
      primaryColor: preset.primary_color,
      secondaryColor: preset.secondary_color,
      siteName: preset.site_name,
      siteSlogan: preset.site_slogan,
      isActive: activeSiteName.toLowerCase() === preset.site_name.toLowerCase()
    }));

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Failed to list templates:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST - Apply a template
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { templateId } = await request.json();
    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    const preset = TEMPLATE_PRESETS[templateId];
    if (!preset) {
      return NextResponse.json({ error: `Template preset not found for id: ${templateId}` }, { status: 404 });
    }

    // Run database replacement in a transaction
    const runTransaction = db.transaction(() => {
      // 1. Clear tables (products are NOT cleared — they are managed independently)
      db.prepare("DELETE FROM services_cards").run();
      db.prepare("DELETE FROM gallery_items").run();
      db.prepare("DELETE FROM team_cards").run();
      db.prepare("DELETE FROM article_posts").run();
      db.prepare("DELETE FROM page_seo").run();

      // 2. Set Hero
      db.prepare(`
        INSERT OR REPLACE INTO hero_settings (id, title, content, show_contact_us, background_type, background_url)
        VALUES (1, ?, ?, ?, ?, ?)
      `).run(
        preset.hero_title,
        preset.hero_content,
        preset.hero_show_contact_us,
        preset.hero_background_type,
        preset.hero_background_url
      );

      // 3. Set Services
      db.prepare(`
        INSERT OR REPLACE INTO services_settings (id, title)
        VALUES (1, ?)
      `).run(preset.services_title);

      const insertService = db.prepare(`
        INSERT INTO services_cards (title, description, image_url, image_alt, display_order)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const card of preset.services_cards) {
        insertService.run(card.title, card.description, card.image_url, card.image_alt, card.display_order);
      }

      // 4. Set Gallery
      const insertGallery = db.prepare(`
        INSERT INTO gallery_items (image_url, image_alt, display_order, category)
        VALUES (?, ?, ?, ?)
      `);
      for (const item of preset.gallery_items) {
        insertGallery.run(item.image_url, item.image_alt, item.display_order, item.category);
      }

      // 5. Set Team
      const insertTeam = db.prepare(`
        INSERT INTO team_cards (name, role, bio, image_url, display_order, image_zoom, image_x, image_y, image_blur)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const card of preset.team_cards) {
        insertTeam.run(
          card.name,
          card.role,
          card.bio,
          card.image_url,
          card.display_order,
          card.image_zoom ?? 1.0,
          card.image_x ?? 0.0,
          card.image_y ?? 0.0,
          card.image_blur ?? 0.0
        );
      }

      // 6. Set Products
      db.prepare(`
        INSERT OR REPLACE INTO products_settings (id, title, description)
        VALUES (1, ?, ?)
      `).run(preset.products_title, preset.products_description);

      const insertProduct = db.prepare(`
        INSERT INTO products_items (slug, name, description, features_json, color, logo_url, status, display_order, external_url, checkout_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const item of preset.products_items) {
        insertProduct.run(
          item.slug,
          item.name,
          item.description,
          item.features_json,
          item.color,
          item.logo_url,
          item.status ?? 'Officially released',
          item.display_order,
          item.external_url ?? null,
          item.checkout_url ?? null
        );
      }

      // 7. Set Articles
      const insertArticle = db.prepare(`
        INSERT INTO article_posts (title, content, image_url, image_alt, author, published_date, display_order, meta_title, meta_description, image_height)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const post of preset.article_posts) {
        insertArticle.run(
          post.title,
          post.content,
          post.image_url,
          post.image_alt,
          post.author,
          post.published_date,
          post.display_order,
          post.meta_title ?? null,
          post.meta_description ?? null,
          '400px'
        );
      }

      // 8. Set SEO
      db.prepare(`
        INSERT OR REPLACE INTO global_seo (id, global_title, global_description, og_image_url)
        VALUES (1, ?, ?, ?)
      `).run(preset.global_title, preset.global_description, preset.og_image_url);

      const insertPageSeo = db.prepare(`
        INSERT INTO page_seo (page_slug, meta_title, meta_description)
        VALUES (?, ?, ?)
      `);
      insertPageSeo.run('home', preset.global_title, preset.global_description);
      insertPageSeo.run('products', preset.products_title, preset.products_description);
      insertPageSeo.run('articles', 'Tech Notes & Articles - ' + preset.site_name, preset.global_description);
      insertPageSeo.run('gallery', 'Gallery - ' + preset.site_name, preset.global_description);

      // 9. Set Admin General Settings (Preserving admin password and password_changed)
      const updateAdminSetting = db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES (?, ?)");
      updateAdminSetting.run('site_name', preset.site_name);
      updateAdminSetting.run('site_slogan', preset.site_slogan);
      updateAdminSetting.run('site_logo_url', preset.site_logo_url);
      updateAdminSetting.run('footer_phone', preset.footer_phone);
      updateAdminSetting.run('footer_email', preset.footer_email);
      updateAdminSetting.run('footer_website', preset.footer_website);
      updateAdminSetting.run('footer_twitter', preset.footer_twitter);
      updateAdminSetting.run('footer_linkedin', preset.footer_linkedin);
      updateAdminSetting.run('footer_disclaimer_title', preset.footer_disclaimer_title);
      updateAdminSetting.run('footer_disclaimer_text', preset.footer_disclaimer_text);
      updateAdminSetting.run('quote_title', preset.quote_title);
      updateAdminSetting.run('quote_subtitle', preset.quote_subtitle);
    });

    runTransaction();

    return NextResponse.json({ success: true, message: `Successfully applied template: ${preset.name}` });
  } catch (error: any) {
    console.error('Failed to apply template:', error);
    return NextResponse.json({ error: error.message || 'Database error while applying template' }, { status: 500 });
  }
}
