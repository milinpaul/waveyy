"use client";

import { PALETTES, withFace, withReverse, type WavePalette } from "./palettes";

// Native colour inputs normalise to lowercase. Feeding a controlled input an
// uppercase hex leaves React's tracked value permanently out of step with the
// DOM's, so normalise on the way in.
const hex = (value: string) => value.toLowerCase();

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-zinc-600">
      {label}
      <input
        type="color"
        value={hex(value)}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 w-12 cursor-pointer appearance-none rounded-md border border-zinc-200 bg-transparent p-0 [&::-moz-color-swatch]:rounded [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-1"
      />
    </label>
  );
}

/**
 * Docked box for recolouring the ribbon. Presets are the fast path; the two
 * inputs below take an arbitrary colour per side and derive its lit half.
 *
 * Sits outside the hero's `pointer-events-none` overlay, so it keeps its own
 * hits without re-blocking the pointer moves that drive the parallax.
 */
export default function PalettePicker({
  palette,
  onChange,
}: {
  palette: WavePalette;
  onChange: (palette: WavePalette) => void;
}) {
  return (
    <aside className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 sm:top-1/2 sm:right-6 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:-translate-y-1/2">
      <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-3 shadow-sm backdrop-blur-md sm:w-52 sm:p-4">
        <p className="hidden text-xs font-medium tracking-wide text-zinc-500 uppercase sm:block">
          Palette
        </p>

        <div className="grid grid-cols-6 gap-2 sm:mt-3 sm:grid-cols-3">
          {PALETTES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.name}
              aria-label={preset.name}
              aria-pressed={palette.id === preset.id}
              onClick={() => onChange(preset)}
              className={`h-8 w-8 rounded-lg ring-offset-2 ring-offset-white transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none sm:h-12 sm:w-auto ${
                palette.id === preset.id
                  ? "ring-2 ring-zinc-900"
                  : "ring-1 ring-zinc-200"
              }`}
              // Reads left-to-right as the ribbon does: reverse side, then face.
              style={{
                background: `linear-gradient(135deg, ${preset.deep} 0%, ${preset.light} 38%, ${preset.gold} 70%, ${preset.cream} 100%)`,
              }}
            />
          ))}
        </div>

        <div className="mt-4 hidden space-y-2 border-t border-zinc-200/70 pt-3 sm:block">
          <ColorRow
            label="Face"
            value={palette.gold}
            onChange={(value) => onChange(withFace(palette, value))}
          />
          <ColorRow
            label="Reverse"
            value={palette.deep}
            onChange={(value) => onChange(withReverse(palette, value))}
          />
        </div>
      </div>
    </aside>
  );
}
