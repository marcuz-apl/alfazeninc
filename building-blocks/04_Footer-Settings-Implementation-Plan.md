# Feature Implementation: Configurable Footer Settings

To continue moving away from hardcoded elements, we will make the Footer completely configurable from the CMS Dashboard. This includes managing social media links and customizing the Legal Disclaimer text.

## Proposed Changes

### Database Layer
We will add new key-value pairs to the existing `admin_settings` table to store:
- `footer_email` (Default: "info@alfazen.org")
- `footer_website` (Default: "https://alfazen.org")
- `footer_twitter` (Default: "https://x.com")
- `footer_linkedin` (Default: "https://linkedin.com")
- `footer_disclaimer_title` (Default: "Disclaimer & Professional Statement")
- `footer_disclaimer_text` (We will convert the current hardcoded 3-paragraph text into a single string that supports double line breaks for paragraph separation).

### API Layer
#### [MODIFY] `src/app/api/admin/settings/general/route.ts` & `src/app/api/settings/general/route.ts`
- Extend both the Admin and Public endpoints to retrieve and save the new `footer_*` keys alongside the existing `site_name` and `site_slogan`.

### CMS Dashboard (Admin)
#### [MODIFY] `src/app/admin/components/GeneralSettingsTab.tsx`
- We will expand the **General Settings** tab to include two new subsections:
  1. **Social Links:** Input fields for Email, Website, Twitter, and LinkedIn URLs.
  2. **Legal Disclaimer:** Input fields for the Disclaimer Title and a large Textarea for the Disclaimer body text.

### Frontend Components
#### [MODIFY] `src/components/Footer.tsx`
- Refactor the component to use the dynamically fetched settings from `/api/settings/general`.
- Conditionally render social icons (if a user leaves a social URL blank in the CMS, the icon will automatically hide).
- Render the Disclaimer body text dynamically by splitting the text by line breaks (`\n`) and mapping them to `<p>` tags.

## User Review Required

> [!TIP]
> By adding this to the existing **General Settings** tab rather than creating a whole new tab just for the Footer, we keep the dashboard streamlined. Let me know if you prefer this approach!

## Verification Plan
1. Ensure the app builds without errors.
2. Log into the Admin panel and navigate to Settings > General.
3. Verify the new Social Links and Legal Disclaimer fields appear and are populated with the defaults.
4. Modify a social link and update the disclaimer text.
5. Save the settings and check the public website footer to verify the changes immediately took effect.
