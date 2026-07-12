---
name: LifeOS Light
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
  on-surface-variant: '#3e4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
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
  tertiary: '#576065'
  on-tertiary: '#ffffff'
  tertiary-container: '#949da3'
  on-tertiary-container: '#2c3539'
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
  tertiary-fixed: '#dbe4ea'
  tertiary-fixed-dim: '#bfc8ce'
  on-tertiary-fixed: '#141d21'
  on-tertiary-fixed-variant: '#3f484d'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1440px
---

## Brand & Style

The design system is built on the philosophy of "Digital Serenity." It targets high-performance individuals who require a focused, low-friction environment to manage their lives. The aesthetic is **Minimalist** with a **Corporate Modern** polish—prioritizing clarity, breathability, and precision. 

The goal is to evoke a sense of organized calm. By utilizing expansive whitespace and a restrained color palette, the UI recedes into the background, allowing the user's data and tasks to take center stage. The futuristic feel is achieved not through decorative elements, but through rigorous alignment, razor-sharp typography, and subtle micro-interactions that suggest a highly sophisticated engine beneath a simple surface.

## Colors

This design system utilizes a high-clarity light palette designed for long-term legibility and reduced eye strain.

- **Primary (#0EA5E9):** A vibrant Sky Blue used for primary call-to-actions, critical status indicators, and active selection states.
- **Secondary (#7DD3FC):** A softer Baby Blue used for secondary interactive elements, progress bar fills, and subtle highlights.
- **Surface Accent (#F0F9FF):** An ultra-light tint used for large surface areas like active row backgrounds or container fills to provide soft contrast against the white base.
- **Typography & Neutrals (#0F172A):** A deep Navy Slate is used for all primary text to ensure a premium, high-contrast feel that is softer on the eyes than pure black. 
- **Background (#F8FAFC):** An off-white base that prevents screen glare while maintaining an "airy" atmosphere.

## Typography

The typography strategy blends modern geometric sans-serifs with a technical monospaced font to reinforce the "OS" feel.

- **Headlines:** Uses **Manrope**. Its balanced, modern proportions provide a premium feel. Use tighter letter-spacing on larger sizes to maintain a "locked-in" architectural look.
- **Body:** Uses **Inter**. Chosen for its exceptional readability and neutral, systematic tone. It handles dense information sets without fatigue.
- **Labels & Data:** Uses **JetBrains Mono**. Reserved for metadata, timestamps, and status labels. This adds a subtle "futuristic/developer" edge to the minimalist aesthetic, signaling precision.

## Layout & Spacing

The design system employs a **Fluid Grid** with generous margins to create the "airy" feel requested. 

- **Grid:** A 12-column system on desktop, collapsing to 4 columns on mobile. 
- **Rhythm:** An 8px linear scale (with a 4px step for micro-adjustments) governs all padding and margins. 
- **Padding:** Containers should use at least `24px` (lg) padding to ensure content does not feel cramped. 
- **Desktop Strategy:** Content is centered with a max-width of `1440px`. Large "white-space lungs" are encouraged between major sections to facilitate visual breathing room.
- **Mobile Strategy:** Margins reduce to `16px`, and vertical spacing between cards is prioritized over horizontal density.

## Elevation & Depth

This design system rejects heavy blurs and glassmorphism in favor of **Tonal Layering** and **Architectural Shadows**.

- **Surface Strategy:** The primary background is `#F8FAFC`. Elements "lift" off the page using white fills (`#FFFFFF`) combined with ultra-thin borders (`1px`) in a very light neutral tint.
- **Shadows:** Use "Ambient Shadows"—multi-layered, low-opacity (4-8%) blurs with no spread. These should feel like natural sunlight, creating a soft lift rather than a floating effect.
- **Borders:** Use `#E2E8F0` for standard dividers and card outlines. For interactive hover states, the border should transition to the Primary Sky Blue or a slightly darker neutral.
- **Depth Levels:**
  - **Level 0 (Base):** `#F8FAFC`
  - **Level 1 (Cards/Sections):** White background + 1px border + soft ambient shadow.
  - **Level 2 (Modals/Popovers):** White background + slightly more defined shadow + 2px border.

## Shapes

The shape language is **Rounded**, reflecting a friendly yet professional demeanor. 

- **Standard Elements:** Buttons, input fields, and cards utilize a `0.5rem` (8px) radius. This provides enough softness to feel modern without becoming "bubbly" or childish.
- **Large Containers:** Section containers or large dashboard cards should use `rounded-lg` (16px) to define major layout areas.
- **Pill Accents:** Status badges and "New" tags may use a full pill shape (999px radius) to differentiate them from functional UI components.

## Components

- **Buttons:** 
  - *Primary:* Solid `#0EA5E9` with white text. No gradient. 
  - *Secondary:* `#F0F9FF` background with `#0EA5E9` text. 
  - *Ghost:* No background, navy slate text, appearing only on hover with a light gray tint.
- **Input Fields:** Pure white background, `1px` border in `#E2E8F0`. Focus state uses a `2px` Sky Blue border and a soft blue outer glow (3px blur).
- **Cards:** White fill, `8px` corner radius, `1px` border, and Level 1 ambient shadow. Content inside should have `24px` internal padding.
- **Progress Bars:** Background track in `#F1F5F9` (light gray), with the fill in `#7DD3FC`.
- **Chips/Badges:** Use JetBrains Mono for the text. Use `#F0F9FF` backgrounds with `#0EA5E9` text for an active/positive feel.
- **Lists:** Rows are separated by a `1px` border (`#F1F5F9`). Active rows use a subtle background shift to `#F8FAFC`.
- **Checkboxes/Radios:** When selected, these should be solid Primary Blue with a crisp white checkmark/dot.