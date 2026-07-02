# Implementation Plan - Website Templates

This plan outlines the design and implementation of a **Website Templates** selector in the Admin Panel (`/admin`). It will allow the user to select and apply database presets for 5 distinct business categories. 

Applying a template will dynamically overwrite landing page configurations, services, products, team profiles, article posts, and global branding/SEO settings while preserving user-submitted data (inquiries, newsletter subscribers, and admin credentials).

---

## User Review Required

> [!WARNING]
> **Data Overwrite Notice:** Applying a template will overwrite current landing page content, services, team members, products, and articles. The application will include a prominent confirmation modal warning the user of this destructive action before it is executed.
>
> **Media Sync:** Curated external images (e.g., from Unsplash) will be used for template cards. After applying a template, the user should use the existing "Sync External Images" function in the **Media** tab to download these images to local storage and update database URLs automatically.

---

## Open Questions

None at this time. The proposed design integrates directly with the existing SQLite migration, database architecture, and tab UI.

---

## Proposed Changes

### Database & Presets Layer

#### [NEW] [presets.ts](file:///Users/marcus/Desktop/projects/alfazeninc/src/lib/templates/presets.ts)
- Define a dictionary containing the complete dataset for the 5 templates:
  1. **Oil & Gas / Energy Tech** (Alfazen Inc. default setup)
  2. **Professional Services & Consulting** (Summit Advisory Group)
  3. **Software / SaaS Startup** (SaaSify Core)
  4. **Specialty Industrial & Logistics** (Apex Logistics & Energy)
  5. **Creative Agencies & Studios** (PixelCraft Creative)
- Each preset will contain values for:
  - `site_name`, `site_slogan`, `site_logo_url`, `footer_phone`, `footer_email`, `footer_website`
  - `hero_settings`
  - `services_settings` & `services_cards`
  - `gallery_items`
  - `team_cards`
  - `products_settings` & `products_items`
  - `article_posts`
  - `global_seo` & `page_seo`
  - `footer_disclaimer_title` & `footer_disclaimer_text`

---

### Backend API Route

#### [NEW] [route.ts](file:///Users/marcus/Desktop/projects/alfazeninc/src/app/api/admin/templates/route.ts)
- Implement `GET` endpoint to return the metadata list of templates (ID, name, slogan, description, primary theme colors).
- Implement `POST` endpoint to apply a template:
  - Check admin session authentication.
  - Read template ID from body.
  - Execute a transaction on the SQLite database:
    - Update `admin_settings` keys: `site_name`, `site_slogan`, `site_logo_url`, `footer_phone`, `footer_email`, `footer_website`, `footer_disclaimer_title`, `footer_disclaimer_text`. (Ensure `admin_password` and `password_changed` are untouched!).
    - Delete and insert values into `hero_settings`.
    - Delete and insert values into `services_settings` and `services_cards`.
    - Delete and insert values into `gallery_items`.
    - Delete and insert values into `team_cards`.
    - Delete and insert values into `products_settings` and `products_items`.
    - Delete and insert values into `article_posts`.
    - Delete and insert values into `global_seo` and `page_seo`.

---

### Admin Panel UI Components

#### [NEW] [TemplatesTab.tsx](file:///Users/marcus/Desktop/projects/alfazeninc/src/app/admin/components/TemplatesTab.tsx)
- Create a UI tab component that fetches available templates.
- Render templates as cards featuring:
  - Visual preview block depicting the template color palette.
  - Description of the target business category.
  - Slogan and sample product names.
- Implement an **"Apply Template"** button that opens a confirmation modal:
  - Warns the user about the data rewrite.
  - Displays a text-matching input (e.g., type "RESET") or checkmark confirmation before proceeding.
- Triggers the POST request to reset the database and notifies the user of success.

#### [MODIFY] [page.tsx](file:///Users/marcus/Desktop/projects/alfazeninc/src/app/admin/page.tsx)
- Add `'templates'` to `settingsTab` state type.
- Import `TemplatesTab` from `./components/TemplatesTab`.
- Add a new "Website Templates" button under the settings sub-tab navigation menu.
- Render `<TemplatesTab />` when `settingsTab === 'templates'`.

---

## Verification Plan

### Manual Verification
1. Access the Admin Panel (`/admin`) and navigate to **Settings** -> **Website Templates**.
2. Observe the template choices and verify cards match modern, dark/light theme-aware design principles.
3. Click "Apply" on a template (e.g., **Software / SaaS Startup**). Verify the confirmation modal halts execution.
4. Proceed with confirmation and wait for success toast.
5. Visit the public homepage (`/`) and products page (`/products`). Verify all content, services, products, and team cards updated correctly.
6. Verify database inquires and messages were NOT deleted.
7. Go to **Media** tab -> click "Sync External Images" to verify that template images download correctly and database references are updated.
8. Re-apply the default **Oil & Gas** template and verify the original state is restored.
