"use client";

import { useState } from "react";
import PalettePicker from "./PalettePicker";
import WaveStrip from "./WaveStrip";
import { DEFAULT_PALETTE, type WavePalette } from "./palettes";

/**
 * Owns the hero's palette and renders the canvas and the picker either side of
 * the hero copy. The copy comes in as `children` so it stays a Server
 * Component — none of the page's text is pulled into the client bundle just to
 * put a colour picker next to it.
 *
 * Returns a fragment, so the hero `<section>` remains the direct flex parent of
 * all three and the existing layout is untouched.
 */
export default function WaveHero({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<WavePalette>(DEFAULT_PALETTE);

  return (
    <>
      <div className="absolute inset-0 z-0">
        <WaveStrip palette={palette} />
      </div>
      {children}
      <PalettePicker palette={palette} onChange={setPalette} />
    </>
  );
}
