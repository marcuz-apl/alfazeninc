# Implementation Plan - Dynamic Content Management System & Admin Panel

This plan details the architecture and step-by-step changes required to transform the static components of the Alfazen Inc. web application into dynamic, database-backed components managed via a comprehensive, secure Admin Panel.

## Goal
Establish database tables for all landing page content sections, create corresponding content API routes, wire the homepage sections to dynamic data, and build out a multi-tabbed administration console supporting inline editing, card additions, card deletions, image updates, and sliding configuration settings.

## User Review Required

> [!IMPORTANT]
> - **Fallback & Seeding:** On the first execution, database tables will be seeded with the current landing page text, images, and settings. This ensures the site remains unchanged until edited.
> - **Authentication & Security:** All updates will be handled by the existing admin session cookie system. Users must log in via the normal `/admin` flow to gain editing privileges.
> - **Static/Client Rendering:** The homepage will continue to use React client-side rendering (`'use client'`) to fetch the content on mount. To prevent layout shift, a smooth skeleton loader or the seeded default content will serve as a fallback.

## Open Questions

> [!NOTE]
> 1. **Image Storage:** Since the database stores URLs, do you prefer manually pasting image URLs (e.g. Unsplash, CDN, local public links) for new cards/slides, or would you like a local file upload mechanism? (Manually pasting URLs is proposed as the default to avoid file storage complexities, but a clean text input will support any URL).
> 2. **Article Layout:** Currently, the home page displays a single highlighted article post on the right. If multiple posts are added in the Article section, should they stack vertically, render in a grid, or display the latest post first with a "read more" history list? (A grid/stack layout is proposed).

---

## Proposed Changes

### Database & Helpers
<truncated 4526 bytes>