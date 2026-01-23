# 2026 Portfolio — Project Spec (Next.js + TS + Sass Modules + GSAP + R3F)

## Goal
Build a portfolio that feels like a **physical digital space** with depth, not a flat webpage.
It is driven by a **3-layer visual logic** + **hybrid scroll choreography** (horizontal + vertical, pinned sequences).

## Tech Stack (must use)
- Next.js (App Router)
- TypeScript
- Sass
- CSS Modules
- GSAP (+ ScrollTrigger)
- Three.js
- React Three Fiber (R3F)
- (Optional but recommended) @react-three/drei, postprocessing (or equivalent)

## Pages / Routes (5 pages)
- `/` Home
- `/about` About
- `/projects` Projects
- `/blogs` Blogs
- `/contact` Contact

## Home Page Sections (5 sections)
Home page is composed of:
1) Hero
2) About
3) Projects
4) Blogs
5) CTA

Each section has its own animation scope and cleanup rules.

---

# Core Visual System: The 3-Layer Logic

We are building a 3D-feeling interface by stacking three layers:

## Layer 1 — The OS & Skeleton (Base + Structure)
**Style:** Neo-Brutalism + Bento Grid + Industrial UI  
**Purpose:** Order, structure, “hard-tech” tone.

**Visual rules**
- Thick black borders and dividers
- Strict grid layout (bento)
- Huge orange sans-serif headline (Anton/Impact vibe)
- Monospace industrial font for data/nav (Space Mono vibe)
- The bottom-left “industrial dashboard menu” belongs to Layer 1

**Implementation**
- Mostly DOM + CSS (Sass Modules)
- Layout should be stable and responsive
- Use transform/opacity for animation; avoid layout thrashing

## Layer 2 — The Medium / Filter (CRT / ASCII)
**Style:** CRT screen medium, slight curvature and scanlines  
**Purpose:** Unify the entire site into retro-futuristic immersion.

**Global effects (R3F postprocessing)**
- Fullscreen scanlines + orange noise speckles
- Screen-edge curvature / distortion
- Bloom on highlights
- RGB shift / chromatic aberration on edges
- Potential ASCII/dithering effect (shader-based)

**Implementation**
- A fixed, full-viewport R3F Canvas sits behind DOM content
- Postprocessing is global and persistent across route changes
- Effects must degrade gracefully on low-end devices
- Respect prefers-reduced-motion (reduce intensity, disable heavy effects)

References:
- https://tympanus.net/codrops/2026/01/04/efecto-building-real-time-ascii-and-dithering-effects-with-webgl-shaders/

## Layer 3 — The Chaos / Expression (Acid Zine)
**Style:** Acid Graphics + Digital Collage + Zine  
**Purpose:** Break the order; inject human creativity + unpredictability (creative layer).

**Visual motifs**
- Stickers: torn paper edges, tape marks, elements that look “stuck on top”
- Local glitches: pixel stretch, signal damage, data loss
- Handwritten/doodle annotations over the grid
- This layer sits above Layer 1 and Layer 2

**Implementation**
- DOM overlay elements with higher z-index
- Use CSS blend modes, masks/clip-path, pseudo-elements for tape/paper
- Use GSAP only for complex sequences; prefer CSS keyframes for small loops
- Keep it tasteful (not everywhere); use it as accent

References:
- https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/

---

# Scroll Choreography (Home Page)

Home scroll is a designed sequence:

## Section sizing constraints
- Hero: `width: 100vw; height: 100vh`
- About: `width: 100vw; height: 100vh` (pinned until its animation completes)
- Projects: vertical scrolling within the section; height is content-driven; must be > 100vh
- Blogs: vertical scrolling within the section; continues until CTA bottom
- CTA: final section, reached by vertical scroll completion inside Blogs

## Required scroll behavior
1) **Hero → About**
   - Horizontal scrolling transition
   - Hero is full-screen; transition slides to About

2) **About pinned sequence**
   - About section does NOT move away immediately
   - It stays pinned until its internal scroll-triggered animation finishes
   - After completion, transition horizontally to Projects

3) **Projects vertical scroll**
   - Once Projects is reached, the user scrolls vertically through Projects content
   - When Projects reaches bottom, transition horizontally to Blogs

4) **Blogs vertical scroll until CTA bottom**
   - Blogs scrolls vertically
   - Continues into CTA (CTA is at the end)

## Implementation notes (GSAP)
- Use ScrollTrigger for pinning and for horizontal transitions
- Use a “scroll container” strategy: either
  A) one main page scroller with pinned panels + horizontal tweening, or
  B) a wrapper that translates X for horizontal steps, then releases into vertical stacks
- Ensure cleanup on route change to prevent stale triggers
- Ensure `prefers-reduced-motion`: disable pinned madness; fall back to normal vertical layout

---

# Design Tokens / Styling Rules
- Use Sass Modules for component styles (`Component.module.scss`)
- Class naming: BEM inside each module (e.g., `.hero`, `.hero__title`, `.hero--active`)
- Use responsive sizing with `clamp()` for typography and spacing where possible
- Use CSS variables for theme tokens (colors, border thickness, spacing, z-index layers)
- Provide both light/dark friendly contrast where relevant (even if default is “bright industrial”)

Core tokens (initial)
- Borders: thick black (e.g., 3px–6px, responsive if needed)
- Accent: orange highlight for headlines and CRT noise accents
- Typography: display (Anton/Impact vibe), mono (Space Mono vibe)

---

# Performance / Quality Bar
- All animations: transform/opacity first
- No layout thrash on scroll
- R3F effects must be toggleable and have quality presets
- Avoid blocking main thread; keep scroll smooth
- Accessibility:
  - keyboard nav for menus
  - focus states visible
  - reduced motion respected
- SEO:
  - metadata per page
  - semantic headings and landmarks

---

# Deliverables (MVP)
1) App Router with 5 pages routes
2) Home page with 5 sections + scroll choreography working
3) 3-layer visuals: Skeleton (DOM), Medium (R3F CRT), Chaos (DOM overlay accents)
4) Industrial dashboard menu anchored bottom-left
5) Basic content placeholders wired for future content

Done means:
- scroll sequence is reliable (no jitter)
- route changes do not leak ScrollTriggers
- reduced motion mode works
