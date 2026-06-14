<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Alfazen Inc. Project Guidelines

This project is a Next.js (App Router) based clone of the Alfazen Inc. website with a full-featured CMS Admin Panel, designed for AI agents and human developers to easily maintain.

## Architecture & Technology Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS (`globals.css`) for maximum flexibility, specifically utilizing CSS Variables for theming. Do NOT install or use Tailwind CSS.
- **Animations:** `framer-motion` is used for sleek, professional animations.
- **Database:** `better-sqlite3` connecting to a local `smb4all.db` file.
- **Media Storage:** All assets are stored locally in `public/images/<section>/` subfolders (hero, services, gallery, team, articles).

## Development Rules

1. **Theming:** The application supports Light and Dark modes. Always use CSS variables (e.g., `var(--background)`, `var(--primary)`) rather than hardcoded hex colors when building new components.

2. **API Routes:** Backend API routes are located in `src/app/api/...`. The `better-sqlite3` instance should always be imported from `src/lib/db.ts` to ensure consistent database initialization.

3. **Database Schema:** We use a local SQLite database. Tables include `messages`, `admin_settings`, `hero_settings`, `services_settings`, `services_cards`, `gallery_settings`, `gallery_items`, `team_cards`, and `article_posts`. All schema changes must be executed in `src/lib/db.ts` using the migration pattern established there.

4. **Professionalism:** When editing or extending this project, ensure that the design remains sleek and professional. Use appropriate animations (like fades, slight scale effects) for interactivity.

5. **Admin Panel Components:** The admin panel lives at `src/app/admin/`. Complex tab UIs should be extracted into separate components under `src/app/admin/components/` (e.g., `MediaTab.tsx`). Each component should follow the established design patterns: use the project's CSS classes (`card`, `btn`, `btn-secondary`, `label`, `input`, `form-group`, `admin-stat-card`, `admin-empty-state`, etc.) and `framer-motion` for animations.

6. **Media Management:** All website images should be stored locally in `public/images/<section>/`. The Media tab and `/api/admin/media/` endpoints handle upload, download-from-URL, listing, and safe deletion (assets in use cannot be deleted). The "Sync External Images" feature bulk-downloads external URLs to local storage.

7. **Authentication:** The admin panel uses a session cookie (`admin_session`) validated against `SESSION_SECRET` (env var). Password change is enforced on first login. Always check authentication in admin API routes using the established pattern.

8. **Documentation:** Whenever an Implementation Plan is created and approved, always save a copy of it into the `./building-blocks/` directory with a sequential number prefix (e.g., `./building-blocks/04_Feature-Name-Implementation-Plan.md`) for historical tracking.
