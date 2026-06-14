# Dynamic Page Structure Implementation Plan

The goal is to address the "Hardcoded Page Structure" architectural limitation by allowing you to reorder sections on the homepage and dynamically create entirely new custom pages (like "About Us", "Pricing", or "FAQ").

## User Review Required

> [!IMPORTANT]
> **To keep the CMS user-friendly for small businesses while making it universal, I propose a dual-approach:**
> 1. **Homepage Reordering**: We will keep the existing sections (Hero, Services, Gallery, Team, Articles, Contact) but allow them to be reordered or hidden.
> 2. **Custom Pages**: We will create a new "Pages" tab in the Admin Panel to create simple content pages (like "About Us"). These will be rendered dynamically based on their URL slug.
>
> **Questions:** 
> 1. Does this dual-approach align with your vision for a "Universal Small Business Template"?
> 2. For the new Custom Pages, a simple WYSIWYG/HTML editor is usually sufficient for things like FAQs or "About Us". Is this acceptable for now?
> 3. Regarding your question: Yes, the main page (`/`) acts as the "Landing Page", while `/products` acts as your catalog. In our new setup, the Landing Page will become fully reorderable!

## Proposed Changes

### 1. Database Schema
#### [MODIFY] [db.ts](file:///root/projects/alfazeninc-agy/src/lib/db.ts)
- Add a new table `custom_pages`:
  - `id` (INTEGER PRIMARY KEY)
  - `slug` (TEXT UNIQUE) - The URL path, e.g. `about-us`
  - `title` (TEXT)
  - `content_html` (TEXT)
  - `meta_title` (TEXT)
  - `meta_description` (TEXT)
- Insert a default setting into `admin_settings` for `homepage_layout` to store a JSON array of the active sections and their order. e.g. `['hero', 'services', 'gallery', 'quote', 'image_banner', 'team', 'article', 'contact-us']`.

### 2. Backend APIs
#### [NEW] `/src/app/api/admin/pages/route.ts`
- CRUD operations for the new `custom_pages` table.
#### [NEW] `/src/app/api/admin/layout/route.ts`
- Get and Update the `homepage_layout` setting.
#### [MODIFY] `/src/app/api/content/route.ts`
- Return the `homepage_layout` alongside the other data so the frontend knows what order to render sections in.

### 3. Frontend Architecture
#### [NEW] `/src/app/[slug]/page.tsx`
- A dynamic Next.js Server Component that catches any route (like `/about-us`), looks it up in the `custom_pages` table, and renders the `title` and `content_html`.
- It will include its own SEO `generateMetadata` function based on the database fields.
#### [MODIFY] `/src/app/HomeClient.tsx`
- Refactor the hardcoded sequence of `<section>` tags.
- Create a rendering map: based on the `homepage_layout` array, it will render the `<Hero>`, `<Services>`, etc., dynamically in a loop.

### 4. Admin Dashboard
#### [NEW] `src/app/admin/components/PagesTab.tsx`
- A new tab for creating and editing Custom Pages.
#### [NEW] `src/app/admin/components/LayoutTab.tsx`
- A new tab for Homepage Layout. We will build a simple UI with "Up/Down" arrows or drag-and-drop to let the admin reorder the sections and toggle them on/off.

## Verification Plan
- Build the database migration and verify `custom_pages` exists.
- Build the Admin UI and test reordering the Homepage Layout and creating an "About Us" page.
- Test visiting `/about-us` to see the new page rendered.
- Test visiting the homepage to verify the sections render in the new order.
