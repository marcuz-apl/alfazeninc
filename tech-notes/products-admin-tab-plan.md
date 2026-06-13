# Add Products Management to Admin Panel

This plan outlines the architecture for establishing a Products management tab in the CMS Admin panel.

## User Review Required
> [!IMPORTANT]
> Please review the database schema and planned structure. Once approved, I will execute the changes, which involve creating new API routes, updating the database, building the admin tab, and hooking the frontend up to the new backend endpoints.

## Proposed Changes

### Database Updates

#### [MODIFY] [db.ts](file:///root/projects/alfazeninc-agy/src/lib/db.ts)
- Create `products_settings` table for the Products page hero section (title and description).
- Create `products_items` table for individual products with the following schema:
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `name TEXT NOT NULL`
  - `description TEXT NOT NULL`
  - `features_json TEXT` (to store the list of features as a JSON array)
  - `color TEXT`
  - `logo_url TEXT`
  - `display_order INTEGER`
- Seed the table with the existing product line (ResoLogix, Elogant, Diabit, Seiscul, FinaPick) so data is preserved.

### API Routes

#### [NEW] [route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/products/route.ts)
- Admin endpoints (GET, POST, PUT, DELETE) for managing product cards. Requires admin session validation.

#### [NEW] [settings/route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/products/settings/route.ts)
- Admin endpoints (GET, PUT) for managing the Products page hero settings.

#### [NEW] [route.ts](file:///root/projects/alfazeninc-agy/src/app/api/products/route.ts)
- Public endpoint (GET) to fetch products and settings for the frontend.

### Admin Panel UI

#### [NEW] [ProductsTab.tsx](file:///root/projects/alfazeninc-agy/src/app/admin/components/ProductsTab.tsx)
- Create a new tab component with:
  - Settings Form: Edit the main title and description.
  - Products List: View, Add, Edit, and Delete individual products.
  - Integration with the local media gallery for selecting product logos.
  
#### [MODIFY] [page.tsx](file:///root/projects/alfazeninc-agy/src/app/admin/page.tsx)
- Add "Products" to the admin tab navigation.
- Render the `<ProductsTab />` component when active.

### Frontend Update

#### [MODIFY] [page.tsx](file:///root/projects/alfazeninc-agy/src/app/products/page.tsx)
- Remove the hardcoded `products` array.
- Add a `useEffect` hook to fetch data from `/api/products` to dynamically render the product sections and hero text.

## Verification Plan
1. Start the development server and navigate to `/admin`.
2. Verify the "Products" tab is visible and functional.
3. Edit a product (e.g., change its color or text) and verify the database saves it.
4. Navigate to `/products` and ensure the public page successfully fetches and renders the database content exactly as before, with the edits reflected.
