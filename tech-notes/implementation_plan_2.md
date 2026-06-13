# Full Content Implementation Plan

I have scraped the full text of the original site (https://soloist.ai/alfazeninc) and noticed that several sections and fields were left out of the initial "lite" build. I will expand the site to include everything.

## User Review Required

> [!IMPORTANT]
> The database schema for `afzinc.db` needs to be updated to include the `phone` field. Since the table was already created, the easiest approach is to drop the existing table and recreate it. **This will delete any test messages currently in the database.** Please confirm if this is acceptable.

## Proposed Changes

### 1. Database & API Expansion
- **Schema Update (`src/lib/db.ts`)**: Add a `phone` column to the `messages` table. I will write a migration script to drop the old table and create the new one.
- **API Update (`src/app/api/contact/route.ts`)**: Update the POST request to capture and insert the new `phone` field.

### 2. Contact Form Update
- **Component (`src/components/ContactForm.tsx`)**: Add a "Phone Number" input field to match the original site's requirements.

### 3. Page Content Expansion (`src/app/page.tsx`)
I will add the following missing sections to perfectly mirror the original content:

- **Navigation Bar**: Add links to Services, Gallery, Team, Article, and Contact Us.
- **Services Section**: 
  - AI-Driven Reservoir Analysis
  - Predictive Maintenance Solutions
  - Custom AI Solutions Development
- **Gallery Section**: Add a placeholder gallery layout with the quote "Empowering Oil & Gas with AI, 20 years strong."
- **Team Section**:
  - Marcus Zou (Commercialisation Officer)
  - Edward Zou (Business Portfolio Manager)
- **Article Section (About)**: Add the "Pioneering Data Science Solutions" text block, including the "Expertise Rooted in Experience", "Comprehensive Data Science Services", and "Empowering the Industry" paragraphs.

### 4. Styling
- Update `src/app/globals.css` with new utility classes for the team grid, gallery, and article typography to maintain the sleek, professional Next.js look.

## Verification Plan
1. Re-run `npm run build` to ensure no errors.
2. Verify the new UI sections appear correctly with Framer Motion animations.
3. Test the contact form to ensure the `phone` field is successfully captured in the SQLite database.
