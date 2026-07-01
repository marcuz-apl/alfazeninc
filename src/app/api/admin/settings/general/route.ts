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
    const keys = [
      'site_name', 'site_slogan', 'site_logo_url',
      'footer_phone', 'footer_email', 'footer_website', 'footer_twitter', 'footer_linkedin',
      'footer_disclaimer_title', 'footer_disclaimer_text',
      'footer_patronage_enabled', 'patronage_message', 'patronage_link', 'article_image_height',
      'footer_show_powered_by',
      'password_changed'
    ];
    const placeholders = keys.map(() => '?').join(',');
    const rows = db.prepare(`SELECT key, value FROM admin_settings WHERE key IN (${placeholders})`).all(...keys) as {key: string, value: string}[];
    
    const settings: Record<string, string> = {
      site_name: 'Alfazen Inc.',
      site_slogan: 'Stay Zen at First Place',
      site_logo_url: '/images/brand/logo.png',
      footer_phone: '+1 (403) 555-0123',
      footer_email: 'info@alfazen.org',
      footer_website: 'https://alfazen.org',
      footer_twitter: 'https://x.com',
      footer_linkedin: 'https://linkedin.com',
      footer_disclaimer_title: 'Disclaimer & Professional Statement',
      footer_disclaimer_text: 'Alfazen Inc. is a technical consultancy and AI software solutions provider based in Calgary, AB, Canada. The analytical models, reservoir simulations, predictive maintenance algorithms, and consulting services presented on this website or delivered during client engagements are intended for operational optimization and general informational purposes.\n\nWhile our solutions utilize advanced artificial intelligence and data science methodologies, all technical evaluations, engineering recommendations, and geoscientific designs must be reviewed, validated, and signed off by licensed professional engineers and qualified geoscientists prior to operational deployment or final field execution.\n\nAlfazen Inc. shall not be held liable for any engineering decisions, operational downtime, equipment failures, resource mismanagement, or financial outcomes arising from the implementation of analytical projections or software configurations provided by our consultancy.',
      footer_patronage_enabled: 'true',
      patronage_message: 'I am passionate about creating free, high-quality software for the energy sector. However, the costs of maintaining and hosting these services can add up quickly. If you find value in my work, please consider supporting me with a small donation. Your kindness and generosity are deeply appreciated and help keep these tools free for everyone!',
      patronage_link: '',
      article_image_height: '400px',
      footer_show_powered_by: 'true',
      password_changed: '1'
    };

    rows.forEach(row => {
      if (row.key in settings) settings[row.key] = row.value;
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const SESSION_SECRET = process.env.SESSION_SECRET || 'alfazen-secure-secret-token';
  if (!session || session.value !== SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const stmt = db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES (?, ?)");
    
    // Run in transaction
    const updateMany = db.transaction((settings: {key: string, value: string}[]) => {
      for (const setting of settings) {
        stmt.run(setting.key, setting.value);
      }
    });

    updateMany([
      { key: 'site_name', value: body.site_name || 'Alfazen Inc.' },
      { key: 'site_slogan', value: body.site_slogan || 'Stay Zen at First Place' },
      { key: 'site_logo_url', value: body.site_logo_url || '/images/brand/logo.png' },
      { key: 'footer_phone', value: body.footer_phone || '' },
      { key: 'footer_email', value: body.footer_email || '' },
      { key: 'footer_website', value: body.footer_website || '' },
      { key: 'footer_twitter', value: body.footer_twitter || '' },
      { key: 'footer_linkedin', value: body.footer_linkedin || '' },
      { key: 'footer_disclaimer_title', value: body.footer_disclaimer_title || 'Disclaimer & Professional Statement' },
      { key: 'footer_disclaimer_text', value: body.footer_disclaimer_text || '' },
      { key: 'footer_patronage_enabled', value: body.footer_patronage_enabled !== undefined ? String(body.footer_patronage_enabled) : 'true' },
      { key: 'patronage_message', value: body.patronage_message || '' },
      { key: 'patronage_link', value: body.patronage_link || '' },
      { key: 'article_image_height', value: body.article_image_height || '400px' },
      { key: 'footer_show_powered_by', value: body.footer_show_powered_by !== undefined ? String(body.footer_show_powered_by) : 'true' }
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
