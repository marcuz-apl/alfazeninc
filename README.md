# Alfazen Inc. Website & CMS

A high-performance, professional Next.js landing page for **Alfazen Inc.** featuring sleek animations, dark/light mode, a fully functional SQLite CMS, and a built-in Admin Panel for managing every section of the website.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Styling** | Vanilla CSS (`globals.css`) with CSS Variables for theming |
| **Animations** | Framer Motion |
| **Database** | SQLite (`better-sqlite3`) — local file `smb4all.db` |
| **Auth** | Session cookie + password hashing (admin panel) |

### CMS Details
All website content is dynamically driven by the database (`smb4all.db`). The Admin Panel includes sections for:
- **Pages:** Create dynamic subpages (`/pages/[slug]`).
- **Landing Page:** Toggle/reorder sections (Hero, Services, Gallery, Team, Articles).
- **Products:** Manage digital catalog.
- **Media:** Unified local asset library.
- **Settings:** Adjust Global SEO metadata and update password.
- **Inbox:** View contact form inquiries.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:1000](http://localhost:1000) to view the website.

3. **Database Management**

   1. **Auto-Initialization:** 
   The app auto-creates `smb4all.db` on first launch. You can inspect it with any SQLite client:
   ```bash
   sqlite3 smb4all.db ".tables"
   ```

## Key Features

Please refer to the [Project-Key-Features.md](./Project-Key-Features.md) file for a detailed breakdown of the public website features, admin panel capabilities, and media management functionality.



## Architecture Guidelines

See [AGENTS.md](./AGENTS.md) for contribution rules and AI-agent guidelines.

## License

Apache 2.0
