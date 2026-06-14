# Alfazen Inc. Website & CMS

A high-performance, professional Next.js landing page for **Alfazen Inc.** featuring sleek animations, dark/light mode, a fully functional SQLite CMS, and a built-in Admin Panel for managing every section of the website.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Styling** | Vanilla CSS with CSS Variables — no Tailwind |
| **Animations** | Framer Motion |
| **Database** | SQLite (`better-sqlite3`) — local file `afzinc.db` |
| **Auth** | Session cookie + password hashing (admin panel) |

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

3. **Database**
   The app auto-creates `afzinc.db` on first launch. You can inspect it with any SQLite client:
   ```bash
   sqlite3 afzinc.db ".tables"
   ```

## Key Features

Please refer to the [Project-Key-Features.md](./Project-Key-Features.md) file for a detailed breakdown of the public website features, admin panel capabilities, and media management functionality.



## Architecture Guidelines

See [AGENTS.md](./AGENTS.md) for contribution rules and AI-agent guidelines.

## License

Apache 2.0
