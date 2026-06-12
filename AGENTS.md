<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Alfazen Inc. Project Guidelines

This project is a Next.js (App Router) based clone of the Alfazen Inc. website, designed for AI agents and human developers to easily maintain.

## Architecture & Technology Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS (`globals.css`) for maximum flexibility, specifically utilizing CSS Variables for theming. Do NOT install or use Tailwind CSS.
- **Animations:** `framer-motion` is used for sleek, professional animations.
- **Database:** `better-sqlite3` connecting to a local `afzinc.db` file.

## Development Rules
1. **Theming:** The application supports Light and Dark modes. Always use CSS variables (e.g., `var(--background)`, `var(--primary)`) rather than hardcoded hex colors when building new components.
2. **API Routes:** Backend API routes are located in `src/app/api/...`. The `better-sqlite3` instance should always be imported from `src/lib/db.ts` to ensure consistent database initialization.
3. **Database Schema:** We use a local SQLite database for capturing form submissions (currently the `messages` table). Schema changes should be executed in `src/lib/db.ts`.
4. **Professionalism:** When editing or extending this project, ensure that the design remains sleek and professional. Use appropriate animations (like fades, slight scale effects) for interactivity.
