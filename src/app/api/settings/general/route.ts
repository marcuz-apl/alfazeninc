import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const keys = [
      'site_name', 'site_slogan', 'site_logo_url',
      'footer_phone', 'footer_email', 'footer_website', 'footer_twitter', 'footer_linkedin',
      'footer_disclaimer_title', 'footer_disclaimer_text',
      'footer_patronage_enabled', 'patronage_message', 'patronage_link', 'article_image_height'
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
      article_image_height: '400px'
    };

    rows.forEach(row => {
      if (row.key in settings) settings[row.key] = row.value;
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
