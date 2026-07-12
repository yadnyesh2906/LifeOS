---
name: Digital Serenity
colors:
  surface: '#f6faff'
  surface-dim: '#d6dae0'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4fa'
  surface-container: '#eaeef4'
  surface-container-high: '#e4e8ee'
  surface-container-highest: '#dee3e9'
  on-surface: '#171c20'
  on-surface-variant: '#3e4850'
  inverse-surface: '#2c3135'
  inverse-on-surface: '#edf1f7'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#006686'
  on-secondary: '#ffffff'
  secondary-container: '#7ed4fd'
  on-secondary-container: '#005b78'
  tertiary: '#8a5100'
  on-tertiary: '#ffffff'
  tertiary-container: '#de8712'
  on-tertiary-container: '#4d2b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#c0e8ff'
  secondary-fixed-dim: '#7bd1fa'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d66'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#f6faff'
  on-background: '#171c20'
  surface-variant: '#dee3e9'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 20px
  stack-gap-lg: 24px
  stack-gap-md: 16px
  stack-gap-sm: 8px
  element-padding-v: 12px
  element-padding-h: 16px
---

## Brand & Style
The design system focuses on "Digital Serenity," a philosophy that balances high-performance productivity with cognitive ease. It targets professionals who require an organized, high-fidelity environment that feels expansive rather than cluttered. 

The aesthetic is **Modern Corporate with Glassmorphic accents**. It leverages the clarity of Minimalism while introducing depth through translucent layers and soft background blurs. The emotional response should be one of "controlled focus"—where the UI recedes to let the user's content and tasks take center stage, supported by a premium, architectural structure.

## Colors
The palette is rooted in a crisp, high-contrast foundation. The background utilizes a subtle vertical gradient from **Off-White (#F8FAFC)** to **Light Blue (#F0F9FF)** to prevent screen fatigue and provide a sense of sky-like openness. 

**Vibrant Royal Blue (#0EA5E9)** serves as the primary action color, ensuring high visibility for CTA elements. **Soft Sky Blue (#7DD3FC)** is reserved for secondary states, decorative accents, and light-themed progress indicators. Text is strictly **Deep Navy Slate (#0F172A)**, providing optimal legibility and a sophisticated, grounded feel against the airy background.

## Typography
Typography is highly structured. **Manrope** provides a bold, architectural feel for headers, using tighter letter-spacing to maintain a modern, "locked-in" appearance. **Inter** is the workhorse for all body and UI text, selected for its exceptional readability on mobile displays. 

**JetBrains Mono** is used sparingly for metadata, timestamps, and technical status labels to inject a sense of precision and data-driven utility. All type scales follow a 4px baseline grid to ensure vertical rhythm.

## Layout & Spacing
This design system utilizes a **Fluid Mobile Grid** with a 20px safe margin on both sides. The layout relies on a vertical stack-based rhythm:
- **Large gaps (24px):** Between distinct content sections or card groups.
- **Medium gaps (16px):** Between items within a list or elements inside a card.
- **Small gaps (8px):** Between labels and their corresponding input fields.

Content should feel uncrowded. Components like cards should span the full width of the available space within the margins, using padding to create internal breathing room.

## Elevation & Depth
Depth is achieved through **Glassmorphic layering** rather than traditional heavy shadows.
1.  **Base Layer:** The gradient background.
2.  **Surface Layer:** Semi-transparent white containers (`rgba(255, 255, 255, 0.7)`) with a `20px` backdrop-blur. 
3.  **Active Elevation:** Elements that are being interacted with (like a pressed card) use a very soft, diffused shadow: `0px 10px 30px rgba(15, 23, 42, 0.08)`.

Avoid solid white cards; use translucency to allow the background gradient to subtly peek through, reinforcing the "Digital Serenity" theme.

## Shapes
Shapes are refined and approachable. The standard radius for primary containers and cards is **0.5rem (8px)**, which provides a clean, professional look. For high-engagement interactive elements like buttons and chips, the `rounded-xl` or `rounded-full` treatment should be used to make them feel more "clickable" and distinct from the structural layout.

## Components
- **Buttons:** Primary buttons use a solid `#0EA5E9` fill with white text. Secondary buttons use a glass background with a `#0EA5E9` border.
- **Glass Cards:** Use the `surface_glass` token with a `1px` white inner stroke at 20% opacity to define the edge.
- **Chips/Tags:** Use the `secondary_color` (`#7DD3FC`) at 20% opacity for the background and the `primary_color` (`#0EA5E9`) for the text.
- **Input Fields:** Minimalist design. Soft gray underline or a very light ghost-border. Focus state transitions to a Royal Blue border with a soft outer glow.
- **Lists:** Clean rows separated by subtle 1px dividers (`#E2E8F0`). Use the `label-mono` typography for secondary data points like dates or ID numbers.
- **Progress Indicators:** Use thin, sleek lines with the secondary blue as the track and the primary blue as the fill.