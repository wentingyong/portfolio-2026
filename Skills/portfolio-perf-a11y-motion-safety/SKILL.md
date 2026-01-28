---
name: portfolio-perf-a11y-motion-safety
description: Define performance, accessibility, and motion safety rules to ensure the portfolio remains fast and usable. Covers animation optimization, reduced-motion compliance, accessibility standards, and jank prevention.
---
# SKILL: portfolio-perf-a11y-motion-safety

## Intent
Prevent the portfolio from becoming "cool but broken".
This skill defines performance, accessibility, and motion safety rules.

## Use when
- Before merging any motion-heavy feature
- Debugging jank, scroll issues, or trigger leaks
- Implementing reduced-motion behavior

## Must-follow rules
Performance
- animate transform/opacity first
- avoid layout thrash on scroll (no animating top/left/width/height)
- keep ScrollTrigger counts minimal and scoped
- refresh triggers on resize, but avoid excessive refresh loops

Motion safety
- prefers-reduced-motion:
  - disable pin/horizontal choreography (Home becomes vertical)
  - reduce/disable PostFX intensity
  - stop looping glitch jitter

Accessibility
- visible focus outlines
- keyboard navigation for menus
- semantic headings/landmarks
- avoid overlays blocking clicks or focus

Quality checklist (definition of done)
- route change does not leak triggers or animation contexts
- mobile UX is not scroll-hijacked
- Lighthouse performance is not destroyed by postprocessing
- core content readable with effects off

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
