# Feature Implementation: Global General Settings

Currently, the website's core branding (Site Name, Slogan, and Logo) is hardcoded into the source code (`Header.tsx`, `Footer.tsx`, and `layout.tsx`). To make this CMS truly Universal, we will add a **"General"** sub-tab under the new **"Settings"** tab to allow the business owner to dynamically update these assets.

## Proposed Changes

### Database Layer
We will leverage the existing `admin_settings` key-value table to store:
- `site_name` (Default: "Alfazen Inc.")
- `site_slogan` (Default: "Stay Zen at First Place")
- `site_logo_url` (Default: "/logo.png")

### API Layer
- **[NEW]** `src/app/api/admin/settings/general/route.ts`: Admin-only endpoints (`GET` and `POST`) to retrieve and update the general settings in the database.
- **[NEW]** `src/app/api/settings/general/route.ts`: Public `GET` endpoint for the frontend components to fetch the active branding.

### Frontend Components
#### [MODIFY] `src/components/Header.tsx`
- Refactor the component to fetch the latest `site_name`, `site_slogan`, and `site_logo_url` via `useEffect` on page load, falling back to defaults if the database is uninitialized.

#### [MODIFY] `src/components/Footer.tsx`
- Replace the hardcoded "@2026 Alfazen Inc." copyright string to dynamically use the `site_name` variable.

#### [MODIFY] `src/app/layout.tsx`
- Update the `generateMetadata()` Server-Side-Rendering function to prepend the dynamic `site_name` to the browser tab titles.

### CMS Dashboard (Admin)
#### [NEW] `src/app/admin/components/GeneralSettingsTab.tsx`
- Create a new component featuring:
  - Input fields for Site Name and Slogan.
  - A Media Picker/URL field for the Site Logo.

#### [MODIFY] `src/app/admin/page.tsx`
- Add "General" to the sub-navigation of the **Settings** tab.
- Mount the `<GeneralSettingsTab />` component.

## User Review Required

> [!IMPORTANT]
> The logo image must be uploaded via the **Media** tab first, and then the generated URL can be pasted into the new General Settings field. Does this flow work for you?

## Verification Plan
1. Launch the dev server.
2. Log into the Admin panel and navigate to Settings > General.
3. Update the Site Name to "ResoLogix Corp" and the slogan to "Next-Gen Analytics".
4. Verify that the Header, Footer, and Browser Tab metadata instantly update across the site.
