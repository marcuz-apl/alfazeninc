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

### Public Website
- **Dark / Light Mode** — toggle in the header; preference saved to `localStorage`.
- **Hero Section** — configurable title, paragraph, background image or video, and optional "Contact Us" CTA.
- **Services Section** — dynamic card grid with images, managed from the CMS.
- **Gallery Section** — image carousel with configurable sliding effect (slide / fade) and autoplay speed.
- **Team Section** — circular avatar cards with advanced image cropping (zoom, pan, blur).
- **Products Section** — comprehensive product showcase featuring dynamically generated vector logos, custom color themes, and automatic status badges with theme-aware typography.
- **Articles Section** — blog-style posts with author and date fields.
- **Contact Form** — submissions stored in the `messages` table via `/api/contact`.
- **Framer Motion Animations** — smooth fade-ins and scroll-based reveals throughout.

### Admin Panel (`/admin`)

A full-featured CMS dashboard for managing the entire website. Protected by session-based authentication with enforced password change on first login.

| Tab | Capabilities |
|---|---|
| **Inquiries** | View and delete contact form submissions |
| **Hero** | Edit title, paragraph, toggle CTA, set background image/video |
| **Services** | Edit section title; add, edit, reorder, delete service cards |
| **Gallery** | Configure sliding effect & speed; add, edit, delete slides |
| **Team** | Add/delete team cards; advanced image adjustment (zoom, pan, blur) |
| **Products** | Manage product catalog; dynamic status assignment (color-coded automatically), inline order adjustment with up/down arrows |
| **Articles** | Full article CRUD with author, date, and image fields |
| **Media** | Unified media library — upload, drag-and-drop, download from URL, delete assets, sync external images to local storage |

### Media Management

The **Media** tab provides a centralized asset manager across all website sections:

- **Browse by Section** — filter view by Hero, Services, Gallery, Team, or Articles.
- **Drag & Drop Upload** — with real-time progress bar.
- **Download from URL** — paste an external URL to download and save locally.
- **Sync External Images** — one-click bulk operation that scans the database for external URLs, downloads them to local `/public/images/<section>/` folders, and updates all DB references.
- **Safe Delete** — prevents deletion of assets currently in use on the website.
- **File Preview** — click any thumbnail for a full-screen lightbox with video controls.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public landing page
│   ├── products/
│   │   └── page.tsx          # Public products showcase page
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Design system (CSS variables, components)
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard (all tabs except Media)
│   │   └── components/
│   │       └── MediaTab.tsx  # Media management tab component
│   └── api/
│       ├── contact/          # Public contact form endpoint
│       ├── content/          # Public content read endpoint
│       └── admin/
│           ├── login/        # Authentication
│           ├── logout/       # Session teardown
│           ├── change-password/
│           ├── messages/     # Inquiry CRUD
│           ├── content/      # CMS write endpoints
│           │   ├── hero/
│           │   ├── services/
│           │   ├── gallery/
│           │   ├── team/
│           │   ├── articles/
│           │   └── download-images/  # Bulk external→local sync
│           ├── products/     # Products CRUD endpoints
│           └── media/
│               ├── route.ts  # List & delete media assets
│               ├── upload/   # File upload endpoint
│               └── download/ # Download from URL endpoint
├── lib/
│   └── db.ts                 # SQLite connection & schema migrations
public/
├── images/
│   ├── hero/                 # Hero background assets
│   ├── services/             # Service card images
│   ├── gallery/              # Gallery slide images
│   ├── team/                 # Team avatar images
│   ├── products/             # Product logo images
│   └── articles/             # Article cover images
scripts/
└── download-images.js        # CLI script for initial asset migration
```

## Database Tables

| Table | Purpose |
|---|---|
| `messages` | Contact form submissions |
| `admin_settings` | Admin password hash, password-changed flag |
| `hero_settings` | Hero section config (title, content, background, CTA toggle) |
| `services_settings` | Services section title |
| `services_cards` | Individual service offering cards |
| `gallery_settings` | Carousel effect and autoplay speed |
| `gallery_items` | Individual gallery slides |
| `team_cards` | Team member cards (with image transform data) |
| `products_items` | Product catalog with descriptions, features, and dynamic statuses |
| `article_posts` | Blog articles with author and date |

## Architecture Guidelines

See [AGENTS.md](./AGENTS.md) for contribution rules and AI-agent guidelines.
