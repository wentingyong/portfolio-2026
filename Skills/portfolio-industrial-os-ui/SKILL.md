# SKILL: portfolio-industrial-os-ui

## Intent
Build the Layer 1 skeleton: Neo-brutalist bento grid + industrial UI styling + bottom-left dashboard menu.

## Use when
- Creating the grid layout system for sections
- Styling borders, typography, and UI modules
- Building the industrial "Menu / Dashboard" component

## Visual rules
- Thick black borders/dividers
- Strict bento grid structure
- Huge orange display headline (Anton/Impact vibe)
- Monospace for nav/data labels (Space Mono vibe)

## Token rules
- Centralize tokens in:
  - `tokens.scss` + CSS variables
- Use `clamp()` for responsive typography and spacing
- Provide consistent border thickness scale (e.g., 3�6px)

## Industrial Menu (bottom-left)
- Anchored bottom-left, always visible on Home
- Keyboard accessible
- Clear focus styles
- Uses Layer 1 styling (borders, labels, grid blocks)
- Does not overlap critical content on small screens (responsive reposition or collapse)

## Definition of done
- Skeleton reads like a "designed OS UI"
- Grid is stable across breakpoints
- Menu usable with keyboard + screen readers

## Stack-first grid rules
- Mobile: single-column feed (no complex bento required).
- Tablet: optional 2-column where it improves scanability.
- Desktop: bento grid is allowed, but each module must still work standalone.
- Use tokens for gutters and consistent spacing rhythm.

## Poster typography rules
- Hero/title uses fluid type tokens (e.g. `--fs-hero`) and intentional wrapping.
- Control line length via max-width in ch units where appropriate.
- Ensure no horizontal overflow from large text (long words/URLs must wrap).
