---
name: portfolio-foundation-next-sass-bem-gsap-r3f
description: "A comprehensive skill guide for building modern portfolio websites using Next.js 14+ with TypeScript, Sass Modules with BEM methodology, GSAP for advanced animations, and React Three Fiber for 3D visual elements. Implements a three-layer architecture separating skeleton DOM, canvas effects, and chaos overlays."
---
# SKILL: portfolio-foundation-next-sass-bem-gsap-r3f

## Intent
Build a Next.js (App Router) + TypeScript portfolio using Sass Modules + BEM.
GSAP is used for complex motion (especially scroll choreography).
R3F is REQUIRED required but lightweight by default (CRT/ASCII postprocessing).

## Use when
- Bootstrapping the repo
- Adding routes/layout shell
- Enforcing styling/motion conventions
- Any feature work that must respect the 3-layer architecture

## Non-negotiables
- Next.js App Router + TypeScript
- Sass Modules for component styles (Component.module.scss)
- BEM naming inside modules
- Prefer CSS animations first; GSAP only when needed (scroll, pin, orchestration)
- R3F Canvas is a fixed, full-viewport "Layer 2 Medium"
- Cleanups: GSAP contexts + ScrollTriggers must be killed on unmount/route change
- Respect prefers-reduced-motion with clear fallback behaviors

## Architecture: The 3-Layer Contract
Layer 1 (Skeleton / OS): DOM + CSS
- Grid, borders, typography, industrial UI menu, navigation

Layer 2 (Medium): R3F Canvas + postprocessing
- Fixed position, full viewport, behind DOM
- PostFX pipeline: scanlines/noise + curvature + bloom + RGB shift (quality presets)

Layer 3 (Chaos / Zine): DOM overlay accents
- Stickers/tape/doodles/glitch overlays above everything
- Intentional: do not spam effects

## Z-index contract (suggested)
- Layer 2 Canvas: z-index 0; pointer-events: none
- Layer 1 DOM: z-index 10
- Layer 3 Chaos overlay: z-index 20
- Dev/debug: z-index 30+

## Inputs the agent should read
- @PROJECT_SPEC.md (source of truth)
- Existing repo structure and configs
- Any design tokens file (if present)

## Outputs expected
- Stable folder structure
- 5 routes: /, /about, /projects, /blogs, /contact
- Layout shell + persistent VisualStage (Canvas)
- Tokenized styling + consistent class naming

## Repo structure (recommended)
src/
  app/
    layout.tsx
    page.tsx
    about/page.tsx
    projects/page.tsx
    blogs/page.tsx
    contact/page.tsx
  components/
    shell/
    home/
    r3f/
    overlays/
  styles/
    globals.scss
    tokens.scss
  lib/
    motion/
    hooks/

## Components ownership
- `components/shell/`: global layout shell and shared UI (Header/Footer/Nav/Menu).
- `components/home/`: page sections for `/` (Hero/About/Projects/Blogs/etc).
- `components/r3f/`: Layer 2 Canvas-only components (scenes, postFX, materials).
- `components/overlays/`: Layer 3 DOM overlay accents (stickers/tape/glitch).

## Motion storage rules
- Co-locate section-specific motion with the section component.
- Use `lib/motion/` for reusable GSAP setup, helpers, and timeline presets.
- Use `lib/hooks/` for shared motion hooks (reduced motion, media queries).
- Prefer `ref` + `gsap.context()` over global selectors.

Example structure:
components/
  home/
    hero/
      Hero.tsx
      Hero.module.scss
      Hero.motion.ts
lib/
  motion/
    gsap.ts
    scroll.ts
  hooks/
    useReducedMotion.ts

## Definition of done
- No layout-thrashing animations
- No ScrollTrigger leaks
- Reduced motion mode produces a usable experience
- R3F medium does not control DOM layout

## Responsive contract 
- Typography is the responsive engine: headings use `clamp()` and are allowed to wrap intentionally.
- Stack-first modules: every section must look correct as a single-column vertical feed by default.
- Desktop is an enhancement: complex pin/horizontal choreography can only be applied on top of a working stacked layout.
- Use global tokens for gutters/content width:
  - `--gutter`, `--content-max`, `--section-pad-y`, `--section-gap`
- Zero hover-only meaning: interactions must work via tap/keyboard.

## Token enforcement
- All spacing/type/borders use `styles/tokens.scss` + `styles/typography.scss`.
- No ad-hoc sizing inside modules unless it maps back to tokens.
- New components must declare spacing using tokens, not random values.

## Designed fallback mode (must feel intentional)
When any of the following is true:
- `prefers-reduced-motion`
- `pointer: coarse` (touch)
- viewport < desktop threshold

Then:
- Disable pin + horizontal choreography.
- Render a clean vertical stack experience with minimal CSS-first reveals.
- Narrative order stays identical; only choreography changes.
- Sections must not depend on being pinned/horizontal to be readable.
