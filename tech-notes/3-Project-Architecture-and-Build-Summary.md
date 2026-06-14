# Alfazen Inc. Project Architecture & Build Summary

This document provides a detailed summary of the technical design, implementation phases, and core features built for the Alfazen Inc. web platform.

## 1. Design Phase & Project Foundation
- **Technical Stack Established:** Set up Next.js (App Router) for server-side rendering and routing. Used `better-sqlite3` to interface with a local `smb4all.db` file, providing a lightning-fast, zero-configuration local database.
- **UI/UX Strategy:** Designed a sleek, responsive landing page emphasizing a professional aesthetic. Instead of Tailwind, the project uses Vanilla CSS (`globals.css`) with CSS Variables (`var(--background)`, `var(--primary)`, `var(--text-primary)`). This architecture provides deep theme customization and ensures absolute control over the visual output.
- **Dark/Light Mode:** Implemented a system-aware Dark/Light mode toggle that saves user preferences to `localStorage` and dynamically updates CSS variables across the entire application.
- **Core Layouts:** Constructed the base layout comprising the Hero, Services, Gallery, Team, and Articles sections to mirror the original site's requirements.

## 2. Initial Content & UI Implementation
- **Content Expansion:** Migrated and structured the complete text and media assets to ensure the new site accurately reflects the company's offerings, matching the depth of the original soloist.ai design.
- **Contact Form Development:** Built an interactive contact form (`src/components/ContactForm.tsx`). Upgraded the `messages` database schema to comprehensively capture user inquiries, expanding it to include the `phone` field. 
- **Animations:** Integrated `framer-motion` to handle smooth scroll-based reveals (`whileInView`), hover states, and dynamic micro-animations across the page (e.g., sliding text, fading cards) to elevate user engagement.
- **Responsive Architecture:** Ensured all grids, carousels, and typography gracefully scale across mobile, tablet, and desktop devices utilizing standard CSS Flexbox and Grid methodologies.

## 3. CMS Integration & Admin Dashboard
- **Security & Authentication:** Created a protected `/admin` dashboard relying on session-cookie authentication. The system checks against a `SESSION_SECRET` environment variable and actively enforces a mandatory password change for first-time logins.
- **Section Management (CRUD):** 
  - **Hero:** Editable titles, paragraphs, CTA buttons, and background media.
  - **Services & Gallery:** Full control over card content, display order, and carousel sliding effects/speeds.
  - **Team:** Avatar card management featuring an advanced UI for image cropping tools (zoom, pan, blur capabilities) natively within the browser.
  - **Articles:** A blog-style post manager capturing content, author, and publication dates, storing paragraph data seamlessly as JSON.
- **Unified Media Library (`/admin/components/MediaTab.tsx`):** Engineered a robust media manager to handle asset uploads, direct downloads from external URLs, and a sophisticated "Sync External Images" utility. This utility securely scans the database for external URLs, bulk-downloads them to local `/public/images/` subdirectories, and rewrites the database references to the new local paths.

## 4. Product Showcase Feature
- **Public Showcase (`/products`):** Developed a dedicated Products interface featuring dynamically cropped vector logos. Logos are zoomed via CSS (`transform: scale(1.35)`) to eliminate white padding, and custom color themes are applied to match each product's branding. Theme-aware typography automatically switches text colors between dark and light modes.
- **Status Tracking System:** Implemented a sophisticated status badge system for product lifecycles. It utilizes a logic map to automatically assign contrasting background colors based on the development status:
  - **Red:** "Officially released"
  - **Orange:** "In alfa/beta tests", "In developing"
  - **Blue:** "Scheduled, seeking patronage"
  - **Black:** "Feasibility study"
  - **Green:** "Scheduled, to be developed" (Default)
- **Admin Capabilities:** Upgraded the Admin Panel with a Products tab mapping to `products_items` in the DB. Introduced an intuitive up/down arrow system for instant display ordering—firing dual `PUT` requests to elegantly swap `display_order` synchronously without manual input.

## 5. Final Optimization & Verification
- **Database Resilience:** Structured `src/lib/db.ts` to automatically handle table creation and schema migrations (using `ALTER TABLE`) upon backend initialization, ensuring seamless local development.
- **API Reliability:** Standardized all Next.js API routes (`/api/content`, `/api/admin/*`) to efficiently fetch and update data while gracefully handling errors and enforcing authentication on every protected endpoint.
- **Performance:** Verified that local asset serving, CSS variable-based theming, and Framer Motion effects execute efficiently. Removed heavy dependencies like `axios` in favor of native `fetch` and `XMLHttpRequest` to keep bundle sizes lean.
