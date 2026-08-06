/**
 * The ribbon is two-sided: one face reads warm, its reverse reads as a
 * different hue, and the twist is what exposes the reverse. Each side needs a
 * shadow/lit pair, so a palette is four colours plus the rim light.
 */
export type WavePalette = {
  id: string;
  name: string;
  /** Reverse side of the ribbon, in shadow. */
  deep: string;
  /** Reverse side, lit. Keep this an actual hue — desaturating it to
   *  near-white is what makes the lit side wash out to grey. */
  light: string;
  /** Face of the ribbon, in shadow. */
  gold: string;
  /** Face, lit. */
  cream: string;
  /** Rim light, and the glow transmitted through the sheet from behind. */
  fresnel: string;
};

/**
 * Hand-tuned presets. Each is built the same way: a saturated mid-tone for the
 * reverse, a soft muted tone for the face, and near-white for the face's lit
 * half so the ribbon still composites onto a white page.
 */
export const PALETTES: WavePalette[] = [
  {
    id: "champagne",
    name: "Champagne",
    deep: "#1f6fe0",
    light: "#7fb2f2",
    gold: "#efdfb6",
    cream: "#fffdf7",
    fresnel: "#ffffff",
  },
  {
    id: "ember",
    name: "Ember",
    deep: "#e4572e",
    light: "#f79d65",
    gold: "#f2cbb6",
    cream: "#fff8f3",
    fresnel: "#ffffff",
  },
  {
    id: "orchid",
    name: "Orchid",
    deep: "#8b3fcf",
    light: "#c89bee",
    gold: "#efd3e8",
    cream: "#fdf8fd",
    fresnel: "#ffffff",
  },
  {
    id: "moss",
    name: "Moss",
    deep: "#2f7d52",
    light: "#85c89e",
    gold: "#dce6c4",
    cream: "#fbfdf6",
    fresnel: "#ffffff",
  },
  {
    id: "lagoon",
    name: "Lagoon",
    deep: "#0e7c86",
    light: "#6fc7ce",
    gold: "#d6eae4",
    cream: "#f6fdfc",
    fresnel: "#ffffff",
  },
  {
    id: "graphite",
    name: "Graphite",
    deep: "#3f3f46",
    light: "#a1a1aa",
    gold: "#e4e4e7",
    cream: "#fafafa",
    fresnel: "#ffffff",
  },
];

export const DEFAULT_PALETTE = PALETTES[0];

/** How far the lit half of each side is lifted from the colour the user picks. */
export const REVERSE_LIFT = 0.45;
export const FACE_LIFT = 0.9;

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const rgb =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];

  return `#${rgb
    .map((v) =>
      Math.round(Math.min(Math.max(v + m, 0), 1) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

/**
 * Raise a colour's lightness by `amount` of its remaining headroom to white,
 * keeping hue and saturation. The shader wants a shadow/lit pair per side, so
 * this derives the lit half and the picker only has to ask for one colour.
 */
export function lift(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return hslToHex(h, s, l + (1 - l) * amount);
}

/** Swap the ribbon's face colour, deriving its lit half. */
export function withFace(palette: WavePalette, hex: string): WavePalette {
  return {
    ...palette,
    id: "custom",
    name: "Custom",
    gold: hex,
    cream: lift(hex, FACE_LIFT),
  };
}

/** Swap the ribbon's reverse colour, deriving its lit half. */
export function withReverse(palette: WavePalette, hex: string): WavePalette {
  return {
    ...palette,
    id: "custom",
    name: "Custom",
    deep: hex,
    light: lift(hex, REVERSE_LIFT),
  };
}
