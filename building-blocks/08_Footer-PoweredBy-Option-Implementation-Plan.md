# Configurable 'Powered By' Footer Option and Row Split

This change splits the central footer text into two rows and introduces an option in the Admin Panel to show or hide the second row ("The website is empowered by Gemini AI").

## User Review Required

> [!NOTE]
> The database migration will run automatically on the next startup/hot-reload by inserting the `footer_show_powered_by` key into `admin_settings` if it does not already exist.

## Open Questions

None. The requirements are clear and follow existing general settings patterns.

---

## Proposed Changes

### Database & Backend Config

#### [MODIFY] [db.ts](file:///Users/marcus/Desktop/projects/alfazeninc/src/lib/db.ts)
- Initialize the `footer_show_powered_by` setting in the SQLite database to default to `'true'`.

#### [MODIFY] [route.ts](file:///Users/marcus/Desktop/projects/alfazeninc/src/app/api/settings/general/route.ts)
- Expose the `footer_show_powered_by` key in the public general settings endpoint.

#### [MODIFY] [route.ts](file:///Users/marcus/Desktop/projects/alfazeninc/src/app/api/admin/settings/general/route.ts)
- Include the `footer_show_powered_by` key in the admin settings GET and POST API endpoints to allow reading and updating the setting.

---

### Admin Panel UI

#### [MODIFY] [GeneralSettingsTab.tsx](file:///Users/marcus/Desktop/projects/alfazeninc/src/app/admin/components/GeneralSettingsTab.tsx)
- Add the `footer_show_powered_by` state with a default value of `'true'`.
- Add a new checkbox in the Footer Settings section of the Admin General Settings tab to toggle the visibility of the "Powered by Gemini AI" text.

---

### Public Site UI

#### [MODIFY] [Footer.tsx](file:///Users/marcus/Desktop/projects/alfazeninc/src/components/Footer.tsx)
- Read `footer_show_powered_by` setting from the retrieved settings.
- Restructure the central footer section (`.footer-center`) into two block rows:
  - Row 1: `@2026 {settings.site_name}. All rights reserved.`
  - Row 2 (conditional): `The website is empowered by ❤️ Gemini AI ❤️`

---

## Verification Plan

### Automated Tests
- Confirm compilation succeeds without syntax or typescript errors.

### Manual Verification
1. Open the Admin Panel (`/admin`).
2. Go to General Settings -> Footer Settings.
3. Locate the new checkbox **"Show 'Powered by Gemini AI' text"**.
4. Uncheck the checkbox and click "Save".
5. Verify on the home page footer that the text "The website is empowered by Gemini AI" is hidden.
6. Re-check the checkbox and save.
7. Verify that the text reappears.
