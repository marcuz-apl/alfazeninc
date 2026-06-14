# Version 2.0.0 Release Notes 🎉

Welcome to version 2.0.0 of **Web4SMB Lite** (formerly Alfazen Inc. Website & CMS)! 

This major release marks the transformation of our platform from a rigid landing page into a **Universal Small Business Template** with a fully dynamic CMS, highly optimized for VPS, Docker, and self-hosting environments.

## Major Architectural Shifts
- **VPS-First Architecture:** We have officially embraced a self-hosted, bare-metal optimized architecture using `better-sqlite3`. This keeps the application blazingly fast and extremely cheap to host without the vendor lock-in of serverless remote databases.

## Key Features & Additions

### 🛍️ Headless E-commerce & Checkout
- **External Checkout Links:** The Products section is now a dynamic digital catalog capable of routing customers directly to external payment gateways (like Stripe Checkout or Shopify) via the new `checkout_url` field.
- **Dynamic "Buy Now" CTAs:** Buttons intelligently appear only when a product's status is set to "Officially released". 

### ⚙️ Ultimate CMS Control
- **Dynamic Page Builder:** Create unlimited custom sub-pages (`/pages/[slug]`) directly from the Admin Dashboard.
- **Section Sorting & Toggling:** Rearrange or hide the Hero, Services, Gallery, Team, and Articles sections on the homepage with a drag-and-drop Layout manager.
- **White-Label Branding:** Update the Site Name, Slogan, Header Logo, Footer Social Links, and Phone Numbers directly from the CMS without touching the code.

### 📈 SEO & Lead Generation
- **Dynamic SEO Management:** A dedicated SEO Settings tab allows you to configure global Meta Titles, Descriptions, and OpenGraph images. Products and Articles now support granular, entity-level SEO overrides.
- **Newsletter Subscription System:** Capture leads directly from the footer.
- **CRM & Data Export:** Seamlessly export Contact Inquiries and Newsletter Subscribers to CSV from the dashboard for importing into external CRMs. Added 1-click `mailto:` replies.

### 📊 System Health & Monitoring
- **Live Diagnostics Dashboard:** A new "System" tab inside the Admin Panel provides real-time monitoring of CPU load, memory utilization, and OS environment health.

### 🎨 Design & UI Polish
- **Refined Dark Mode:** Updated the dark theme with a sleek "Navy" primary palette (`#1e3a8a`, `#172554`) for better contrast and a highly premium feel.
- **Admin Theme Toggle:** Admins can now toggle between light and dark modes within the dashboard.

## Upgrade Notes
If upgrading from a 1.x version, your existing `smb4all.db` database will automatically apply any missing columns (like `checkout_url` in the products table) upon server start. No manual schema migrations are required!
