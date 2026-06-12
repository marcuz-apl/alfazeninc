# Alfazen Inc. Website Clone

A high-performance, professional Next.js landing page for Alfazen Inc. featuring sleek animations, a dark/light mode toggle, and a fully functional local SQLite database for the Contact form.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS Modules with CSS Variables (No Tailwind)
- **Animations:** Framer Motion
- **Database:** SQLite3 (`better-sqlite3`)

## Setup Instructions

1. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Run the Development Server**
   Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:4000](http://localhost:4000) to view the website.

3. **Database Management**
   The application automatically creates a local database file named `afzinc.db` in the root directory upon the first form submission or API initialization.
   You can query it using standard SQLite tools:
   ```bash
   sqlite3 afzinc.db
   sqlite> SELECT * FROM messages;
   ```

## Key Features
- **Dark/Light Mode:** Toggle easily in the top right header. User preference is saved to `localStorage`.
- **Framer Motion Animations:** Smooth fade-ins and scroll-based reveal animations.
- **Contact API:** The `/api/contact` route safely handles user messages and logs them into the `afzinc.db` SQLite database.

## Architecture Guidelines
Please refer to [AGENTS.md](./AGENTS.md) for more details on contributing and AI-agent guidelines.
