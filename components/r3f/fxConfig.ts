export type FxPreset = 'low' | 'medium' | 'high'

// Tune effect intensity + performance presets here.
export const FX_PRESETS: Record<
  FxPreset,
  {
    dpr: number
    enablePostFx: boolean
    scanlines: { opacity: number; speed: number }
    chromatic: { enabled: boolean; base: number; boost: number; vertical: number }
    vignette: { enabled: boolean; offset: number; darkness: number }
    curvature: { enabled: boolean; amount: number }
    impulse: { max: number; scroll: number; click: number; decayRate: number }
  }
> = {
  low: {
    dpr: 1,
    enablePostFx: true, // Set false to disable postprocessing on low.
    scanlines: { opacity: 0.24, speed: 14 },
    chromatic: { enabled: false, base: 0, boost: 0, vertical: 0.6 },
    vignette: { enabled: true, offset: 0.4, darkness: 0.45 },
    curvature: { enabled: false, amount: 0 },
    impulse: { max: 0.6, scroll: 0.035, click: 0.12, decayRate: 3.8 },
  },
  medium: {
    dpr: 1.25,
    enablePostFx: true,
    scanlines: { opacity: 0.28, speed: 10 },
    chromatic: { enabled: true, base: 0.0008, boost: 0.0035, vertical: 0.75 },
    vignette: { enabled: true, offset: 0.35, darkness: 0.55 },
    curvature: { enabled: true, amount: 0.035 },
    impulse: { max: 1, scroll: 0.05, click: 0.2, decayRate: 3.6 },
  },
  high: {
    dpr: 1.5,
    enablePostFx: true,
    scanlines: { opacity: 0.32, speed: 8 },
    chromatic: { enabled: true, base: 0.001, boost: 0.0045, vertical: 0.8 },
    vignette: { enabled: true, offset: 0.32, darkness: 0.6 },
    curvature: { enabled: true, amount: 0.045 },
    impulse: { max: 1, scroll: 0.06, click: 0.22, decayRate: 3.4 },
  },
}
