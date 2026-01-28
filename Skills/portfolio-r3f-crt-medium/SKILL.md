---
name: portfolio-r3f-crt-medium
description: Build the global R3F "Medium layer" (Layer 2) with CRT/ASCII filtered visuals, postprocessing effects (scanlines, noise, curvature, bloom, RGB shift), and quality presets. Fixed full-viewport canvas with reduced-motion support.
---
# SKILL: portfolio-r3f-crt-medium

## Intent
Build the global R3F "Medium layer" that makes the entire site feel like a CRT/ASCII filtered display.

## Use when
- Setting up the Canvas + postprocessing
- Tuning scanlines/noise/curvature/bloom/RGB shift
- Implementing quality presets + reduced motion behavior

## Non-negotiables
- Canvas is fixed full-viewport behind DOM
- Canvas never affects DOM layout
- pointer-events disabled (unless you explicitly build an interactive 3D feature later)
- Provide quality presets: low / medium / high
- respects prefers-reduced-motion:
  - reduce intensity or disable heavy passes

## Recommended component structure
- `VisualStage` (mounted in app layout):
  - `Canvas` (R3F)
  - `PostFX` pipeline
  - Optional cheap DOM overlay (scanlines/noise) as fallback

## Effects checklist (start minimal; add gradually)
- Scanlines
- Noise (orange speckle)
- Curvature / slight distortion near edges
- Bloom on highlights
- RGB shift / chromatic aberration

## Performance rules
- cap DPR (example: low=1, med=1.25, high=1.5)
- avoid per-frame allocations
- avoid React state updates in `useFrame`
- allow disabling PostFX entirely on low-end or reduced motion

## Token hookup
- Read accent colors from CSS variables where possible (e.g. `--c-accent`) so the CRT speckle/bloom tint matches the DOM theme.
- Do not hardcode colors in shaders if the DOM theme provides tokens.
- Keep Canvas behind DOM (`--z-canvas`) and never interfere with layout or pointer events.

## 3D moments budget (rare, controlled)
We still use R3F globally for the CRT medium layer, but actual “3D scenes” are rare moments.

Rules:
- Max 1 active 3D scene per route (or per scroll step).
- Scenes must mount only when in/near viewport; unmount/pause when offscreen.
- Prefer `frameloop="demand"` for non-interactive scenes.
- Avoid per-frame allocations and avoid React state updates in `useFrame`.
- Mobile and `prefers-reduced-motion`: default to LOW preset (no heavy passes, no expensive post FX).


## Debug toggles (recommended)
- query param or dev flag to switch preset and toggle FX
- show current preset in dev only

## Definition of done
- Medium layer visible but not overpowering
- Smooth scrolling remains smooth
- Reduced motion disables/tones down expensive FX
