# Implementation Plan - CMS Enhancements & Media Tools

This plan covers downloading external assets to local storage, introducing advanced image manipulation controls (zoom, pan, blur) for Team member cards, expanding the Hero Section to support big images or short video background media, and adding smooth navigation to the company header/logo.

## User Review Required

> [!IMPORTANT]
> - **Database Column Migrations:** Safe ALTER queries will run on startup in [db.ts](file:///root/projects/alfazeninc-agy/src/lib/db.ts) to add background media columns (`background_type`, `background_url`) to the `hero_settings` table, and adjustment columns (`image_zoom`, `image_x`, `image_y`, `image_blur`) to the `team_cards` table.
> - **Interactive CSS Adjustments:** The team member photos in [page.tsx](file:///root/projects/alfazeninc-agy/src/app/page.tsx) and the admin preview will apply CSS variables or inline styles (e.g., `transform: scale(zoom) translate(x, y)` and `filter: blur(px)`) dynamically.

## Open Questions

> [!NOTE]
> 1. **Default Hero Video:** For the default background video, we will download a free royalty-free energy/gas sector MP4 placeholder during setup and store it under `public/images/hero/hero_bg.mp4`. Let us know if you prefer a different default source.
> 2. **Blur limits:** We will restrict the blur slider from `0` to `20px` and zoom from `1` (no zoom) to `3` (300% zoom) to keep the editor controls intuitive.

---

## Proposed Changes

### Database & Helpers

#### [MODIFY] [db.ts](file:///root/projects/alfazeninc-agy/src/lib/db.ts)
- Add safe ALTER columns code blocks:
  - `hero_settings`: `background_type` TEXT DEFAULT 'image', `background_url` TEXT DEFAULT ''
  - `team_cards`: `image_zoom` REAL DEFAULT 1.0, `image_x` REAL DEFAULT 0.0, `image_y` REAL DEFAULT 0.0, `image_blur` REAL DEFAULT 0.0
- Update default seeded hero query to include default background image URL `/images/hero/hero_bg.jpg` and background type `'image'`.

---

### Backend API Routes

#### [MODI
<truncated 3764 bytes>