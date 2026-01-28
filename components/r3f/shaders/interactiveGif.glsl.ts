export const interactiveGifVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const interactiveGifFragment = /* glsl */ `
  precision mediump float;

  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uRadius;
  uniform float uBulgeStrength;
  uniform float uRippleStrength;
  uniform float uGlitch;
  uniform float uGlitchStrength;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    float d = distance(uv, uMouse);
    float falloff = smoothstep(uRadius, 0.0, d);

    vec2 dir = normalize(uv - uMouse + 0.0001);
    uv += dir * falloff * uBulgeStrength;

    float ripple = sin(uTime * 6.0 + d * 24.0) * uRippleStrength * falloff;
    uv += dir * ripple;

    float glitch = uGlitch * uGlitchStrength;
    vec4 color;

    if (glitch > 0.0001) {
      float blocks = mix(30.0, 90.0, clamp(glitch, 0.0, 1.0));
      vec2 blockUv = floor(uv * blocks) / blocks;
      float n = hash(blockUv + floor(uTime * 12.0));
      vec2 jitter = (vec2(n, fract(n * 17.0)) - 0.5) * 0.008 * glitch;
      uv += jitter;

      vec2 rgbOffset = (vec2(fract(n * 3.7), fract(n * 5.3)) - 0.5) * 0.004 * glitch;
      uv = clamp(uv, 0.001, 0.999);

      float r = texture2D(uTex, uv + rgbOffset).r;
      float g = texture2D(uTex, uv).g;
      float b = texture2D(uTex, uv - rgbOffset).b;
      color = vec4(r, g, b, 1.0);
    } else {
      uv = clamp(uv, 0.001, 0.999);
      color = texture2D(uTex, uv);
    }

    color = sRGBTransferEOTF(color);
    gl_FragColor = linearToOutputTexel(color);
  }
`
