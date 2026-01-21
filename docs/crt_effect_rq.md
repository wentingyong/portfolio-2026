You are working in my Next.js App Router + TypeScript + Sass Modules (BEM) portfolio.

Goal: Implement the global “CRT Monitor” Medium layer (Layer 2) with React Three Fiber + @react-three/postprocessing:
1) Scanlines: subtle, moving horizontal scanline pattern covering the entire viewport.
2) RGB shift / Chromatic Aberration: very subtle edge split by default; strongly increases on user scroll + click (glitch impulse), then decays smoothly.
3) Vignette + Curvature: slight corner darkening + extremely subtle barrel distortion to simulate CRT glass curvature.

IMPORTANT SYSTEM RULES (must follow)
- Follow the 3-layer contract:
  - Layer 2 Canvas is fixed fullscreen BEHIND DOM, never affects layout.
  - pointer-events: none on Canvas wrapper.
  - z-index uses tokens: --z-canvas behind Layer 1 DOM.
- Use existing design tokens / CSS variables where possible (e.g. --c-accent, --c-ink, --c-bg).
- Respect prefers-reduced-motion:
  - reduce intensity heavily OR disable expensive FX.
  - stop continuous glitch jitter and keep visuals calm.
- Provide quality presets: low / medium / high:
  - cap DPR (e.g. 1 / 1.25 / 1.5).
  - allow disabling postprocessing entirely on low.
- Performance: avoid per-frame allocations; do not use React state updates in useFrame; use refs/uniforms.
- Keep implementation modular:
  - src/components/r3f/VisualStage.tsx (Canvas + mount in app layout)
  - src/components/r3f/PostFX.tsx (EffectComposer pipeline)
  - src/lib/motion/useCrtImpulse.ts (scroll/click impulse driver)
  - optional: src/components/r3f/CrtDomOverlay.tsx + SCSS module for CSS fallback scanlines/noise
- Must work across route changes (VisualStage mounted once in app/layout.tsx).

WHAT TO BUILD (step-by-step)
A) Add VisualStage (global, persistent)
1. Create `src/components/r3f/VisualStage.tsx`:
   - Wrap a <Canvas> in a fixed-position div: position: fixed; inset: 0; pointer-events: none; z-index: var(--z-canvas).
   - Canvas config:
     - orthographic OR minimal perspective; no visible 3D content required (we only need post FX).
     - set `dpr` based on preset.
     - Consider frameloop:
       - Default: `frameloop="always"` ONLY if we truly need GPU-time animation.
       - Prefer: CSS DOM overlay animates scanlines so Canvas can be `frameloop="demand"` and we invalidate on impulse/decay (better perf).
   - Include <PostFX preset=... /> inside Canvas.
   - Also include an optional cheap DOM overlay for scanlines/noise (CSS) so scanlines can animate without forcing WebGL every frame.

2. Mount <VisualStage /> in `src/app/layout.tsx` so it persists across routes and stays behind all DOM content.

B) Build the impulse system (scroll/click → glitch boost → decay)
1. Create `src/lib/motion/useCrtImpulse.ts`:
   - Provide a small imperative “impulse value” in a ref (0..1).
   - Add listeners:
     - `scroll` (passive) → add impulse (small increments, clamped).
     - `pointerdown` / `click` → add bigger impulse.
   - Implement decay with requestAnimationFrame loop OR a lightweight tick that:
     - decays impulse smoothly back to 0 (e.g. exponential).
     - triggers invalidation for Canvas if using frameloop="demand".
   - No React setState in a per-frame loop; use refs and a single rAF handler.

2. Also export “reduced motion” and “coarse pointer” gates (or accept them as args):
   - If prefers-reduced-motion: impulse still works but caps at a much smaller max and decays faster (or disable it).

C) Postprocessing pipeline
1. Create `src/components/r3f/PostFX.tsx` using `@react-three/postprocessing`.
2. Effects:
   - Chromatic Aberration:
     - default very subtle (near-zero).
     - intensity scales with impulse value (strong on interaction, then decays).
     - bias the effect toward edges if possible (vignette/curvature already helps; keep it tasteful).
   - Vignette:
     - subtle, constant (slight corner darkening).
   - Curvature / Barrel distortion:
     - implement extremely subtle barrel distortion as a custom postprocessing Effect (recommended) OR a shader pass compatible with @react-three/postprocessing.
     - Keep distortion tiny; just enough to feel like CRT glass.
   - Scanlines:
     - Preferred: CSS overlay (repeating-linear-gradient) with slow vertical movement.
     - Optional: if you do it in WebGL, implement a custom scanline shader effect with a time uniform.
3. Token hookup:
   - Read CSS variables once on mount (getComputedStyle(document.documentElement)) and pass colors to effects (accent tint for subtle noise/bloom if used).
   - Do not hardcode “random” colors; map to tokens.
4. Quality presets:
   - low: vignette only + DOM scanlines; chromatic disabled; curvature disabled; DPR=1; WebGL can even be disabled if needed (optional).
   - medium: vignette + subtle curvature + subtle chromatic (impulse-driven); DPR ~1.25.
   - high: same as medium with slightly better sampling/DPR; still keep effect subtle by default.

D) Styling + z-index contract
1. Ensure CSS tokens exist for z-index (or add them if missing in tokens.scss):
   - --z-canvas, --z-os, --z-chaos, --z-ui
2. VisualStage wrapper uses --z-canvas and does not create scrollbars or layout shifts.
3. DOM scanline overlay:
   - Build `src/components/r3f/CrtDomOverlay.tsx` + `CrtDomOverlay.module.scss`
   - Use BEM naming in module.
   - Use repeating-linear-gradient for scanlines, subtle opacity, and a slow translateY animation.
   - Respect prefers-reduced-motion: stop the animation (static scanlines) or lower opacity.

E) Acceptance tests (must verify)
- Canvas is fixed fullscreen behind DOM; no layout changes; no pointer blocking.
- Scanlines visible but subtle and premium (not noisy/cheap).
- Chromatic aberration:
  - very subtle at rest
  - noticeably increases on scroll/click
  - decays smoothly back to baseline within ~0.6–1.2s (tunable).
- Vignette + curvature are extremely subtle but perceptible.
- Reduced motion:
  - effects are reduced; no constant motion; scroll remains smooth.
- Performance:
  - no per-frame React re-renders
  - no allocations in useFrame loops
  - DPR capped per preset
  - postprocessing can be disabled on low preset

DELIVERABLE
Implement the files, wire VisualStage into app/layout.tsx, and include a small dev-only way to switch presets (query param like ?fx=low|med|high is OK). Document where to tune effect intensities.

Before coding:
1) Inspect existing repo structure and tokens files; do NOT invent conflicting token names.
2) Reuse existing patterns in the codebase (naming, folder structure).
3) Keep it minimal and shippable first; no extra fancy effects beyond the 3 required ones.
