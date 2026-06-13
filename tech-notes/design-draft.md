# Alfazen Inc. Tech Note: Navigation & Products Refactor Draft

## Objective
To modularize the application layout by extracting the `Header` and `Footer` components, implement a "Products" dropdown menu in the header, and create a dedicated products page showcasing the Alfazen product suite.

## Architecture & Components

### 1. Shared Components
- **`Header.tsx`** (`src/components/Header.tsx`): 
  - Extracted from `page.tsx`. 
  - Manages the top navigation, including the brand logo, theme toggle, mobile menu state, and the new "Products" dropdown menu. 
  - Implements conditional logic to route hash links correctly whether the user is on the root landing page or sub-pages (`/#services`, etc.).
- **`Footer.tsx`** (`src/components/Footer.tsx`): 
  - Extracted from `page.tsx`. 
  - Contains global copyright info, social links, and the application's Disclaimer modal logic.

### 2. Pages
- **`src/app/page.tsx` (Landing Page)**: 
  - Updated to import and render `<Header />` and `<Footer />` instead of inline HTML. 
  - Maintains dynamic data state for Hero, Services, Gallery, Team, and Articles.
- **`src/app/products/page.tsx`**: 
  - A new App Router page consisting of:
    - Global `Header`
    - A hero/intro section for the products.
    - Five distinct product sections: `ResoLogix`, `Elogant`, `Diabit`, `Seiscul`, and `FinaPick`. Each section features alternating background colors and graphical elements.
    - Global `Footer`

### 3. Styling & CSS
- **`globals.css`**: Added new vanilla CSS classes:
  - `.nav-item-dropdown`: Wrapper for the dropdown menu with hover state management.
  - `.dropdown-menu`: Absolute-positioned container for dropdown items with Framer Motion animations.
  - `.dropdown-item`: Styles for individual product links in the dropdown.

## Next Steps / Future Enhancements
- Replace placeholder graphics in `/products` with actual product UI screenshots or relevant imagery.
- Integrate product data into the CMS (e.g., `afzinc.db`) allowing administrators to dynamically update product descriptions, titles, and images via the admin panel.
