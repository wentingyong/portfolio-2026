# SKILL: portfolio-chaos-zine-overlays

## Intent
Create Layer 3 "Chaos" accents: stickers, tape marks, doodles, localized glitch moments.
This layer sits ABOVE skeleton DOM and the R3F medium.

## Use when
- Building Sticker/Tape/Doodle components
- Adding controlled "creative disruption" to sections
- Implementing local glitch moments (not global chaos)

## Design constraints
- Intentional placement: start with 2–4 accents per section maximum
- CSS-first for looping motion; GSAP only for one-off hero moments
- Must not block content readability or navigation

## Component library (starter set)
- `<Sticker />`:
  - torn paper edges (mask/clip-path/pseudo-elements)
  - slight drop shadow, subtle rotation
- `<Tape />`:
  - translucent strip with noise texture
- `<DoodleNote />`:
  - handwriting-style annotation overlay
- `<LocalGlitch />`:
  - local text/image glitch (clip-path slices, jitter, rgb split)

## Implementation rules
- Use Sass Modules + BEM
- Use CSS variables for accent colors
- Provide a single "ChaosLayer" wrapper with high z-index
- Ensure focus/interaction unaffected (pointer-events: none by default; enable only when needed)

## Definition of done
- Chaos layer feels like "collage on glass" (above everything)
- No accidental click-blocking
- Accents look intentional, not random spam
