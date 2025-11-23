# Theme Documentation - BetterBlend

## Overview
This theme is designed to be **1:1 identical** to the landing page design, ensuring all components use the exact same colors and styling patterns.

## Color Palette (Exact Matches)

### Primary Colors
- **Spotify Green**: `#1DB954` → `oklch(0.662 0.18 146)`
  - Used for: Primary buttons, CTAs, brand elements
  - Hover: `#1ed760` → `oklch(0.759 0.18 145.7)`

### Accent Colors
- **Hot Pink**: `#FF006E` → `oklch(0.544 0.25 9.7)`
  - Used for: Secondary accents, gradients, decorative elements
- **Brand Blue**: `#3A86FF` → `oklch(0.572 0.2 285.3)`
  - Used for: Tertiary accents, icons

### Background Colors
- **Dark Background**: `#1a1625` → `oklch(0.084 0.02 302.8)`
  - Main dark mode background (matches landing page exactly)
- **Black**: `#000000` → `oklch(0 0 0)`
  - Used in gradients

### Text Colors
- **Primary Text**: White (`#FFFFFF`)
- **Secondary Text**: Gray-300 (`#D1D5DB`)
- **Muted Text**: Gray-400 (`#9CA3AF`)

### Glass Morphism
- **Card Background**: `rgba(255, 255, 255, 0.05)`
- **Card Border**: `rgba(255, 255, 255, 0.1)`
- **Backdrop Blur**: `12px`

## Theme Structure

### Light Mode (`:root`)
- Clean, modern design with Spotify Green as primary
- Light backgrounds with dark text
- Suitable for general UI components

### Dark Mode (`.dark`)
- **Exact match to landing page**
- Dark purple-gray background (`#1a1625`)
- Glass morphism cards
- White text with gray accents
- Spotify Green primary actions

## Component Behavior

### Buttons
- **Primary**: Spotify Green (`#1DB954`) with black text
- **Ghost**: Transparent with `white/10` hover in dark mode (matches landing page)
- **Outline**: White borders with transparency, `white/10` hover

### Cards
- Use `bg-card` which maps to glass morphism in dark mode
- Border uses `border` variable (white/20 opacity in dark mode)
- Can use `.glass-card` utility class for explicit glass effect

### Badges
- Outline variant supports green badges with `#1DB954/5` background and `#1DB954/50` border
- Text uses `#1DB954` color

## Usage

### Applying Dark Mode
Add the `.dark` class to the root element (typically `<html>` or a wrapper):

```tsx
<html className="dark">
  {/* Your app */}
</html>
```

### Using Brand Colors Directly
You can use the brand colors via CSS variables:

```tsx
// In Tailwind classes
<div className="bg-[var(--spotify-green)]">
<div className="bg-[var(--hot-pink)]">
<div className="bg-[var(--brand-blue)]">
```

### Glass Morphism Cards
Use the `.glass-card` utility class or apply manually:

```tsx
<div className="glass-card rounded-xl p-6">
  {/* Card content */}
</div>
```

### Selection Styling
Text selection automatically uses Spotify Green background with black text (matches landing page).

## CSS Variables Reference

### Core Theme Variables
- `--background`: Page background
- `--foreground`: Primary text color
- `--card`: Card background (glass morphism in dark mode)
- `--card-foreground`: Card text color
- `--primary`: Spotify Green (`#1DB954`)
- `--primary-foreground`: Black (for text on green)
- `--accent`: Hot Pink (`#FF006E`)
- `--muted`: Muted background
- `--muted-foreground`: Muted text (gray-400)
- `--border`: Border color (white/20 in dark mode)
- `--ring`: Focus ring (Spotify Green)

### Brand Color Variables
- `--spotify-green`: `#1DB954`
- `--spotify-green-light`: `#1ed760`
- `--hot-pink`: `#FF006E`
- `--brand-blue`: `#3A86FF`
- `--dark-bg`: `#1a1625`

## Matching Landing Page Elements

### Navigation
- Ghost buttons use `hover:bg-white/10` (updated in button component)
- Text uses `text-gray-300` with `hover:text-white`

### Hero Section
- Primary button: `bg-[#1DB954]` with `hover:bg-[#1ed760]`
- Outline button: `border-white/20` with `hover:bg-white/10`
- Badge: `bg-[#1DB954]/5` with `border-[#1DB954]/50`

### Cards
- Glass morphism effect with backdrop blur
- Border: `border-white/10`
- Background: `rgba(255, 255, 255, 0.05)`

## Verification

To verify the theme matches the landing page:
1. All colors use the exact hex values converted to OKLCH
2. Dark mode background is `#1a1625` (exact match)
3. Primary color is `#1DB954` (Spotify Green)
4. Glass morphism matches landing page cards
5. Hover states match landing page interactions
6. Selection styling matches landing page

## Notes

- The landing page uses direct color overrides in some places (e.g., `bg-[#1DB954]`), which is fine and will work with this theme
- Components will automatically use the theme colors when using semantic classes like `bg-primary`, `text-foreground`, etc.
- For exact landing page matches, you can still use direct hex values, but the theme ensures consistency across all components

