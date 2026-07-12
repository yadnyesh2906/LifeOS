---
name: Atmospheric Intelligence
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#474751'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f5f69'
  on-tertiary-container: '#dbdae5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e3e1ed'
  tertiary-fixed-dim: '#c7c5d1'
  on-tertiary-fixed: '#1a1b23'
  on-tertiary-fixed-variant: '#46464f'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system focuses on the concept of "AI-Native Clarity"—a visual language that feels processed, precise, and ethereal. It targets high-growth technology sectors where the interface acts as a transparent conduit for machine intelligence. 

The aesthetic is a refined evolution of **Glassmorphism** and **Minimalism**, characterized by high-translucency surfaces, ultra-thin "circuitry" borders, and a sense of depth created through light rather than shadow. The emotional response is one of calm sophistication, technical mastery, and seamless efficiency.

## Colors
This design system utilizes a luminous light mode palette. The foundation is a pure white (`#FFFFFF`) or slightly tinted cool-grey background, overlaid with complex mesh gradients.

- **Primary (Neural Indigo):** Used for key actions and focal points of intelligence.
- **Secondary (Data Cyan):** Used for highlights, success states, and active data streams.
- **Accents:** Subtle glowing borders use a 1px linear gradient transition between Primary and Secondary at 40% opacity.
- **Surface:** Backgrounds are not solid; they utilize a soft mesh of `#F5F3FF` and `#ECFEFF` to simulate a "glowing" hardware core beneath the glass.

## Typography
The typography system uses **Outfit** for its geometric precision and modern "tech" feel. For technical data or metadata, **Geist** is introduced to provide a developer-friendly, monospaced utility.

Headlines should be set with tight tracking to emphasize the geometric construction of the letterforms. Body text maintains generous line-height to ensure readability amidst the glass-textured backgrounds. Labels are always uppercase with increased tracking to evoke a "system readout" aesthetic.

## Layout & Spacing
The layout relies on a **Fluid Grid** with wide margins to create a "breathable" interface. 

- **Desktop:** 12-column grid, 64px outside margins, 24px gutters.
- **Tablet:** 8-column grid, 32px outside margins.
- **Mobile:** 4-column grid, 16px outside margins.

Spacing is governed by a 4px baseline, but "AI-native" cards use exaggerated internal padding (32px+) to signify premium, focused content. Grouping of elements should feel modular, with wide gaps between major sections to prevent visual clutter.

## Elevation & Depth
Depth is achieved through **Glassmorphism** rather than traditional shadows.

1.  **Backdrop Blur:** Use `backdrop-filter: blur(12px)` for all floating or elevated surfaces.
2.  **Luminous Borders:** Instead of shadows, use 1px semi-transparent borders (`rgba(79, 70, 229, 0.1)`). On hover, these borders should transition to a subtle glow.
3.  **Tonal Stacking:** Higher elevation levels are indicated by increased opacity of the background white (from 60% to 80%) rather than darker shadows. 
4.  **Z-axis:** Use a single "Soft Glow" shadow for the highest-level components (modals), using the primary color at 5% opacity with a 40px blur.

## Shapes
The shape language is "Calculated Softness." Standard elements use an 8px (`0.5rem`) radius to maintain a professional structure, while interactive elements like buttons and chips utilize larger radii to feel more approachable.

- **Standard Containers:** 8px (base)
- **Cards & Modals:** 16px (rounded-lg)
- **Inputs & Buttons:** 12px

## Components
### Buttons
Buttons are semi-transparent with a 1px border. The "Primary" button features a subtle inner glow. Hover states should trigger a "fill" animation where the background opacity increases from 10% to 100% using a 300ms cubic-bezier transition.

### Cards
Cards are the core of this system. They must be slim, with a maximum width constrained by the grid to prevent line lengths from becoming too long. They use a `backdrop-filter: blur(20px)` and a thin indigo-to-cyan gradient border. Whitespace inside cards is intentional and generous.

### Input Fields
Inputs are "Ghost" style—transparent backgrounds with a bottom-border only, or a very faint 1px wrap. Upon focus, the border should glow with the primary indigo color and a small 4px outer glow.

### Chips & Tags
Small, pill-shaped, and high-contrast labels using the `label-sm` typography. They should appear like "data tags" in a futuristic HUD.

### Interaction Details
Transitions must be fluid. When elements appear, use a "fade and slight scale" (from 98% to 100%). Hovering over any card should trigger a subtle shift in the background mesh gradient, making the interface feel reactive to user presence.