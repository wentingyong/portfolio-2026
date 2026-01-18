# Portfolio 2026

A physical digital space portfolio built with Next.js, TypeScript, Sass Modules, GSAP, and React Three Fiber.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Sass Modules + BEM
- GSAP (+ ScrollTrigger)
- Three.js + React Three Fiber
- @react-three/drei
- postprocessing

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  layout.tsx          # Root layout with SiteShell
  page.tsx            # Home page (5 sections)
  about/page.tsx      # About page
  projects/page.tsx   # Projects page
  blogs/page.tsx      # Blogs page
  contact/page.tsx    # Contact page

components/
  shell/              # SiteShell wrapper
  home/               # Home page sections
  r3f/                # R3F Canvas (VisualStage)
  overlays/           # Layer 3 chaos/zine overlays

styles/
  globals.scss        # Global styles
  tokens.scss         # Design tokens

lib/
  motion/             # GSAP utilities
  hooks/              # Custom hooks
```

## Architecture: 3-Layer System

- **Layer 1 (Skeleton/OS)**: DOM + CSS - Grid, borders, typography, industrial UI
- **Layer 2 (Medium)**: R3F Canvas + postprocessing - CRT effects, scanlines, bloom
- **Layer 3 (Chaos/Zine)**: DOM overlay accents - Stickers, glitches, doodles

## Next Steps

See PROJECT_SPEC.md for full requirements and implementation phases.
