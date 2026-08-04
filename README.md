# Waveyy

An animated silk-ribbon hero background built with Three.js, [React Three
Fiber](https://docs.pmnd.rs/react-three-fiber), and a custom GLSL shader —
no textures, no post-processing.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint + typecheck
```

## How it works

- **`components/wave/shaders.ts`** — the vertex shader displaces a plane
  with layered sine ridges plus simplex/fbm noise, and twists it: a signed
  width envelope that crosses zero pinches the ribbon to a point and flips
  it over. The fragment shader colours each face differently (front warm,
  back blue), so colour is placed by geometry — it shows up exactly where
  the ribbon folds, not scattered by noise.
- **`components/wave/WaveLayer.tsx`** — one ribbon mesh: geometry, uniforms,
  and the per-frame update loop.
- **`components/wave/WaveScene.tsx`** — composes a few `WaveLayer`s at
  different depth/phase/scale into one piece of woven silk, and drives a
  subtle mouse-parallax tilt.
- **`components/wave/WaveStrip.tsx`** — the `<Canvas>` wrapper. Drop it
  into any sized, `relative`-positioned container and it fills it.

## Using it as a background

```tsx
<section className="relative ...">
  <div className="absolute inset-0 z-0">
    <WaveStrip />
  </div>
  <div className="pointer-events-none relative z-10 ...">
    {/* content; re-enable pointer-events on anything clickable */}
  </div>
</section>
```

Two things that matter here:

1. Give both layers an explicit `position` **and** `z-index`. A `relative`
   parent with its own background paints over a negative-`z` child, which
   hides the canvas outright.
2. The content layer sits above the canvas and spans the whole section, so
   without `pointer-events-none` it swallows every mouse move before the
   canvas sees one — killing the parallax with no visible symptom.

## Stack

Next.js · React · Three.js · @react-three/fiber · Tailwind CSS · TypeScript
