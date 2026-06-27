import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-family",
  subsets: ["latin"],
});

import db from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  let title = "Alfazen Inc. - AI Solutions for Energy";
  let description = "With over 20 years of experience across multiple continents, Alfazen Inc. leverages advanced AI and data science to tackle the unique challenges of the oil and gas industry.";
  let ogImage = "/images/hero/hero_bg.jpg";
  let twitterHandle = "@alfazeninc";

  try {
    const globalSeo = db.prepare("SELECT * FROM global_seo WHERE id = 1").get() as any;
    if (globalSeo) {
      title = globalSeo.global_title || title;
      description = globalSeo.global_description || description;
      ogImage = globalSeo.og_image_url || ogImage;
      twitterHandle = globalSeo.twitter_handle || twitterHandle;
    }

    const siteNameRow = db.prepare("SELECT value FROM admin_settings WHERE key = 'site_name'").get() as any;
    if (siteNameRow && siteNameRow.value) {
      // If the admin specifically changed the global SEO title, we respect that.
      // Otherwise we prefix the site_name.
      if (!globalSeo || !globalSeo.global_title) {
        title = `${title.split(' - ')[0]} - ${siteNameRow.value}`;
      }
    }
  } catch (e) {
    console.error("Failed to fetch global SEO", e);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      title,
      description,
      images: [ogImage],
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
