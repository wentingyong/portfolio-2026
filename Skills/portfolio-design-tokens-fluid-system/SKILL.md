---
name: portfolio-design-tokens-fluid-system
description: Create a single source of truth for responsive spacing, typography, and layout tokens using CSS variables and Sass helpers. Implements fluid typography with modular stacking and minimal breakpoints.
---
# SKILL: portfolio-design-tokens-fluid-system

## Intent
Create a single source of truth for responsive spacing/typography/layout tokens using CSS variables + Sass helpers.
This is the “responsive engine”: big type + modular stacking (scrib3-style), with minimal breakpoints.

## Use when
- Bootstrapping global styles
- Building new sections/components that must be responsive and consistent
- Normalizing spacing/type/border across OS Layer (DOM) and Chaos Layer overlays
- Creating a stable base before complex scroll choreography

## Outputs (must generate)
Create these files (or equivalents in your structure):

- `styles/tokens.scss`
  - colors, spacing, radii, borders, z-index, shadows
  - exported as CSS variables on `:root`

- `styles/typography.scss`
  - font stacks + fluid type scale (`clamp()`)
  - line-height rules + max line length conventions

- `styles/breakpoints.scss`
  - breakpoint tokens OR container query strategy (must be documented)

- `styles/mixins.scss`
  - fluid spacing/type mixins
  - focus ring
  - reduced motion helpers

## Non-negotiables
- All spacing/typography/border thickness must come from tokens or mixins (no ad-hoc values).
- Prefer fluid design: `clamp()` first; breakpoints only for layout shifts.
- “Stack-first” rule: every section must look correct in a single-column feed by default.
- Respect `prefers-reduced-motion` globally (no surprise motion).
- BEM inside CSS Modules is required.

## Token model (recommended)
### Layout
- `--gutter`: `clamp(16px, 3vw, 48px)`
- `--content-max`: `clamp(960px, 70vw, 1400px)`
- `--section-pad-y`: `clamp(24px, 4vw, 80px)`
- `--section-gap`: `clamp(16px, 2.5vw, 48px)`

### Borders / Radius
- `--border-w`: `clamp(2px, 0.35vw, 6px)`
- `--radius-sm/md/lg`: use small set, avoid random radii

### Typography (example naming)
- `--fs-hero`: `clamp(48px, 6vw, 96px)`
- `--fs-h1`: `clamp(32px, 4vw, 64px)`
- `--fs-body`: `clamp(14px, 1.1vw, 18px)`
- `--lh-tight/normal/loose`

### Z-index layers (3-layer system)
- `--z-canvas` (R3F medium)
- `--z-os` (DOM base)
- `--z-chaos` (stickers/overlays)
- `--z-ui` (menus/nav)

### Color tokens (project-specific)
- `--c-bg`, `--c-ink`, `--c-paper`
- `--c-accent` (orange)
- `--c-green` (status)
- Provide “warm black” rather than pure black if desired

## Mixins / helpers (must provide)
- `fluid($min, $max)` helper for `clamp()`
- `focusRing()` helper
- `reducedMotion()` wrapper:
  - disable looping animations
  - shorten durations
  - skip heavy transforms

## Definition of done (acceptance)
- No “naked px” for spacing/typography (exception: hairline borders if needed).
- All section padding/margins use tokens (or mixins that map to tokens).
- Hero + headers wrap intentionally and never cause horizontal scroll.
- `prefers-reduced-motion` disables key motion and heavy FX across the site.
- A new section can be built using only these tokens without inventing new values.
