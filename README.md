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
- **`components/wave/palettes.ts`** — the palette type, the presets, and
  `lift()`, which derives a side's lit half from the colour you pick.
- **`components/wave/PalettePicker.tsx`** / **`WaveHero.tsx`** — the docked
  palette box, and the client component that owns the hero's palette.

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

## Colour

`WaveStrip` takes an optional `palette`, and defaults to Champagne:

```tsx
import { PALETTES } from "@/components/wave/palettes";

<WaveStrip palette={PALETTES[1]} />;
```

A palette is four colours plus a rim light: a shadow/lit pair for the
ribbon's face, and another for its reverse. Because the twist is what
exposes the reverse, the two pairs are what give the ribbon its two-tone
read — keep the lit halves actual hues rather than near-white, or the lit
side washes out to grey.

Changing it mid-flight is cheap by design. `WaveLayer` holds the target
colours as `THREE.Color`s and eases the uniforms toward them each frame,
mutating in place, so a switch cross-fades over ~0.4s without rebuilding
the material or recompiling the shader — sweeping the picker through the
whole spectrum adds zero shader compiles, zero program links, and never
remounts the canvas. The ribbon keeps animating straight through.

## Stack

Next.js · React · Three.js · @react-three/fiber · Tailwind CSS · TypeScript
