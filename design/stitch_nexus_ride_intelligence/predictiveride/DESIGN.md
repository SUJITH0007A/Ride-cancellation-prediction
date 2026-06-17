---
name: PredictiveRide
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#009fb4'
  on-tertiary-container: '#002f36'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
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
  unit: 4px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  bento-gap: 16px
---

## Brand & Style
The design system embodies an ultra-premium, cinematic aesthetic tailored for a high-end AI transportation SaaS. It targets executive decision-makers and tech enthusiasts who value precision, foresight, and a futuristic edge. 

The visual style is a fusion of **Glassmorphism** and **Corporate Modernism**. It utilizes deep, infinite backgrounds to create a sense of vast space, punctuated by vibrant, glowing accents that represent data flow and intelligence. The emotional response is one of trust, high-velocity innovation, and "Apple-level" refinement. Interaction design should prioritize smooth, eased transitions and subtle micro-interactions that feel "magical" rather than mechanical.

## Colors
This design system operates exclusively in a **Deep Dark Mode**. 

The palette is anchored by a "Deep Navy/Black" base that provides high contrast for the electric accent colors. 
- **Primary (Electric Blue):** Used for main actions, active states, and core branding.
- **Secondary (Neon Purple):** Used for AI-driven insights, predictive features, and premium upsells.
- **Tertiary (Cyan Glow):** Reserved for status indicators, "live" data, and success states.
- **Surface Strategy:** Use layered transparency. Backgrounds are solid `#020617`, while foreground containers use semi-transparent fills with `backdrop-filter: blur(12px)` to create depth.

## Typography
The typography strategy pairs the technical, geometric precision of **Space Grotesk** for headings with the supreme legibility of **Inter** for UI elements and body copy.

- **Headings:** Apply a linear gradient from white (#FFFFFF) to a slight silver (#CBD5E1) at a 180-degree angle to create a "metallic" sheen. For hero sections, use a Primary-to-Secondary gradient.
- **Body:** Use high-contrast white for primary text and 60% opacity white for secondary/supporting text.
- **Labels:** Always utilize slightly increased letter spacing and semi-bold weights for a refined, "instrument-cluster" feel.

## Layout & Spacing
The layout follows a **Bento-style Fixed Grid** system. This modular approach organizes complex AI data into clean, digestible tiles of varying sizes.

- **Desktop:** 12-column grid with a max-width of 1440px. Use 24px gutters.
- **Bento Sections:** Content should be grouped into cards that span 3, 4, 6, or 12 columns. Ensure vertical gaps match horizontal gutters (16px or 24px) to maintain a perfect geometric rhythm.
- **Alignment:** Use aggressive white space (80px+ between sections) to evoke a premium, "uncluttered" feel reminiscent of Apple hardware marketing.

## Elevation & Depth
Depth is achieved through **Luminous Layering** rather than traditional drop shadows.

- **Z-Axis Tier 1 (Base):** Solid `#020617`.
- **Z-Axis Tier 2 (Cards/Widgets):** Semi-transparent background with a `1px` solid border at 10% opacity white. Use `box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5)`.
- **Z-Axis Tier 3 (Modals/Popovers):** Higher blur radius (20px) and a subtle "inner glow" using a secondary border or box-shadow.
- **Glow Effects:** Critical components (like the AI assistant) should have a soft, colored outer glow (`blur: 40px`) matching their accent color to appear as if they are emitting light.

## Shapes
The shape language is **Refined and Intentional**. 

Standard UI elements (buttons, inputs) use a **0.5rem (8px)** radius for a professional, structured feel. Larger containers and Bento cards use **1rem (16px)** to soften the layout and emphasize the "object-like" quality of the dashboard widgets. Circular shapes are reserved strictly for avatars and specific AI status indicators to signify "fluidity" and "life."

## Components

### Navigation Bar
A top-fixed "floating" bar. Use a highly transparent glass background with a high blur. The bottom border should be a subtle 1px gradient (White to Transparent).

### Premium CTA Buttons
Buttons should have a slight gradient fill. Primary buttons use a 2px "outer glow" on hover. Use `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` for all hover states to ensure a "buttery" feel.

### Dashboard Widgets & Bento Cards
Each card must feature a subtle "Tilt" interaction on hover (1-2 degrees) and a border that brightens slightly. Backgrounds should be `rgba(255, 255, 255, 0.03)` with a `backdrop-filter`.

### AI Assistant Widget
A persistent floating element in the bottom right. Use a mesh gradient background (Blue/Purple/Cyan) with a constant "pulse" animation.

### Prediction Indicators
Use Tertiary (Cyan) for positive trends and Secondary (Purple) for AI-calculated alternatives. Use small, glowing dots to indicate "Live" data streams.

### Inputs & Authentication
Fields should be dark, with borders that transition from 10% white to 100% Primary Blue on focus. Use monospaced fonts for numerical data to enhance the "technical" feel.