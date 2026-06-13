# Implementation Plan - CMS Media Manager (Updated)

## Goal Description
Implement a new **"Media"** tab in the Admin Panel to manage image and video assets across the site. Features include:
- Listing media files per section (hero, services, gallery, team, articles).
- Uploading local files (max 50 MB, allowed formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.mp4`, `.webm`).
- Downloading external assets via URL, saving them locally.
- Deleting assets with safety checks to prevent removal of files currently referenced in the database.
- UI respects existing light/dark theming (CSS variables) and uses `framer-motion` for smooth animations.

## User Review Required
- **Layout Preference:** Use a combined grid with a section filter dropdown (as per user choice).
- **File Types:** Restrict to the recommended image/video formats.
- **Delete vs Hide:** Deletion is permanent; assets cannot be hidden (deletion blocked if in use).
- **Filename Collisions:** Append a timestamp to the filename to avoid overwriting existing files.

## Open Questions
*All answered based on user input.*

## Proposed Changes
---
### Backend API (already implemented)
- `/src/app/api/admin/media/` – GET, DELETE routes.
- `/src/app/api/admin/media/upload/` – POST route for multipart uploads.
- `/src/app/api/admin/media/download/` – POST route for external URL downloads.

### Frontend Adjustments
#### 1. Extend Tab Navigation
- **File:** `src/app/admin/page.tsx`
- Extend `activeTab` union to include `'media'`.
- Add a navigation button for the Media tab in the tabs list.
- Import and render new `MediaTab` component when `activeTab === 'media'`.

#### 2. New MediaTab Component
- **File:** `src/app/admin/components/MediaTab.tsx`
- Fetch media list from `/api/admin/media` on mount.
- Section selector dropdown (`hero`, `services`, `gallery`, `team`, `articles`).
- Display a responsive grid (`.media-grid`) with thumbnails or video previews.
- Upload form:
  - `<input type="file" accept="image/*,vi
<truncated 2144 bytes>