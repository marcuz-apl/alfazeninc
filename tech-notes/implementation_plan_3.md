# Content and Visual Alignment Implementation Plan

To achieve full content and visual alignment with the target site [https://soloist.ai/alfazeninc](https://soloist.ai/alfazeninc), we will enhance the current text-based layout by integrating all missing image assets, banners, and an interactive image carousel.

## User Review Required

> [!IMPORTANT]
> - All styling will be implemented in Vanilla CSS (`src/app/globals.css`) in accordance with the project guidelines. No Tailwind CSS will be used.
> - We will use `framer-motion` to create a smooth, animated image carousel for the Gallery section, replacing the simple text placeholder.
> - We will verify the visual alignment by checking layouts in both light and dark themes.

## Proposed Changes

### 1. Main Page Component (`src/app/page.tsx`)
- **Hero Section**: 
  - Add the background image: `https://images.unsplash.com/photo-1731397977989-b4f4e298168f` (with dark overlay for high contrast text readability).
- **Services Section**: 
  - Add card-top images to all three services to mirror the original site:
    - Reservoir Analysis: `https://images.unsplash.com/photo-1691505748956-2d02b6603e84`
    - Predictive Maintenance: `https://images.unsplash.com/photo-1701383838063-ceb050928f24`
    - Custom AI Solutions: `https://images.unsplash.com/photo-1721314787850-5745fdfb06b4`
- **Gallery Section**: 
  - Replace the text-only placeholder with an interactive **Image Carousel** featuring these 6 images:
    - Oil pumps group: `https://images.unsplash.com/photo-1695060601967-7fb135446f67`
    - Black & white pump: `https://images.unsplash.com/photo-1729201754182-536252085563`
    - Sunset pump: `https://images.unsplash.com/photo-1646800864458-c4ea73403075`
    - Black & white pump 2: `https://images.unsplash.com/photo-1694039446022-2d227e8b104b`
    - Sunset silhouette: `https://images.unsplash.com/photo-1596017264419-23e7af0e86db`
    - ERiELL oil rig: `https://images.unsplash.com/photo-1562237548-2e0fd9797537`
  - Carousel will feature manual sliding, left/right arrows, and navigation dots.
- **Quote Banner Section**:
  - Add a full-width text banner between Gallery and Team sections:
    - Heading: "Empowering Oil & Gas with AI, 20 years strong."
    - Subtitle: "Discover our expertise now!"
- **Image Banner Section**:
  - Add a full-width landscape banner with the sunset silhouette image (`https://images.unsplash.com/photo-1596017264419-23e7af0e86db`) and a subtle parallax style.
- **Team Section**:
  - Add profile pictures for each team member:
    - Marcus Zou: `https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/6579892a-1466-44d5-a9b8-e34587dd8543_1040x1040.webp`
    - Edward Zou: `https://cdn.soloist.ai/9a6cdcdf-8b81-4230-a673-75d77e3a7a88/c9974234-a8b3-4d4d-ad52-138e1f64cd04_1040x1040.webp`
- **Article Section**:
  - Convert into a two-column grid on larger screens, with the article body on one side and the article cover image on the other:
    - Cover Image: `https://images.unsplash.com/photo-1646800864458-c4ea73403075`

### 2. Stylesheet (`src/app/globals.css`)
- **Hero Image Overlay**: Styles for absolute positioning of background image with opacity, ensuring text remains clear.
- **Card Images**: Clean image layouts with `object-fit: cover` and hover zoom transitions.
- **Carousel Styles**: Positional styling for the slider, transition wrappers, arrows, dots, and indicators.
- **Quote & Image Banners**: Spacing, background positioning, and full-width containers.
- **Team Profile Pictures**: Rounded image styling with soft borders and centering.
- **Two-Column Grid**: Grid rules for the Article section layout.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no TypeScript, hydration, or compiler warnings.

### Manual Verification
- Test all links in the Navigation bar to ensure they scroll to the correct section.
- Verify image carousel functionality (clicking arrows and dots slides the images correctly).
- Verify dark/light toggle switches themes smoothly and the background text remains legible against all overlay images.
