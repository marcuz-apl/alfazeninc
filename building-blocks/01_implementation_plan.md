# Dynamic SEO Management Implementation Plan

Based on the goal of making the CMS universally viable for small businesses, dynamic SEO is a crucial feature. Below is a structured plan to fully integrate Next.js Server-Side SEO management linked to your SQLite database.

## User Review Required

> [!IMPORTANT]
> - **Entity Pages vs. List Pages:** Currently, your Products and Articles are displayed as lists on single pages (e.g., `/products`). For a product or article to have its *own* unique Meta Title, Description, and OG Image that appears when shared on social media, it requires its own dedicated URL (e.g., `/products/resologix`). 
> - **Question:** Do you want me to create individual, dynamic pages for Products and Articles as part of this SEO update, or do you strictly want to manage Global SEO and the existing static page SEO?

## Proposed Architecture

### 1. Database Expansions
#### [MODIFY] [db.ts](file:///root/projects/alfazeninc-agy/src/lib/db.ts)
- **New Table (`global_seo`)**: Create a table to store the default site-wide `meta_title`, `meta_description`, `og_image_url`, and `twitter_handle`.
- **New Table (`page_seo`)**: Create a table to store overrides for specific static pages (Home, Products, Gallery).
- **Modify Existing Tables (`products_items`, `article_posts`)**: Add `meta_title` and `meta_description` columns so each entity can be individually optimized.

### 2. Next.js Metadata API Integration
#### [MODIFY] [layout.tsx](file:///root/projects/alfazeninc-agy/src/app/layout.tsx)
- Replace the static `export const metadata` with the asynchronous `export async function generateMetadata()`. This will read the `global_seo` settings from the database on every page request.
#### [MODIFY] [page.tsx](file:///root/projects/alfazeninc-agy/src/app/page.tsx) & [products/page.tsx](file:///root/projects/alfazeninc-agy/src/app/products/page.tsx)
- Implement `generateMetadata()` in these files to fetch the specific `page_seo` settings and override the global defaults.

### 3. Admin Dashboard Enhancements
#### [NEW] `src/app/admin/components/SEOTab.tsx`
- Create a dedicated "SEO Settings" tab in the Admin Panel to manage the `global_seo` and `page_seo` tables.
#### [MODIFY] `src/app/admin/components/ProductsTab.tsx` & `ArticlesTab.tsx`
- Add an "Advanced SEO" accordion inside the "Add/Edit" forms. This will allow the admin to specify custom meta tags for specific products and articles.

### 4. Automated Sitemap & Robots
#### [NEW] `src/app/sitemap.ts` & `src/app/robots.ts`
- Implement dynamic sitemap generation. Whenever a new product or article is added, it will automatically be indexed in the sitemap for Google.

---

## Execution Steps

1. **Wait for your feedback** on whether we should create dynamic individual pages (`/products/[slug]`) to fully utilize entity-level SEO.
2. Execute the database migrations to add all necessary SEO columns.
3. Build the Backend APIs to fetch and update SEO data.
4. Construct the Admin "SEO Management" tab and modify existing forms.
5. Wire up the Next.js `generateMetadata()` functions across the frontend.
6. Generate the dynamic `sitemap.xml`.
