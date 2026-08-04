"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import WaveLayer from "./WaveLayer";

// Sampled from the reference: sky blue in the fold cores, pale blue on the
// lit faces, near-white highlights, and a soft cream that pools low-centre.
const PALETTE = {
  deep: "#3E9BD4",
  light: "#BEDFF3",
  cream: "#FBFDFF",
  gold: "#F0DFB6",
  fresnel: "#FFFFFF",
};

/**
 * Overlapping translucent sheets. Each is the same wave at a different
 * scale/phase/depth, so they read as one draped piece of fabric with volume
 * rather than as separate ribbons.
 */
const SHEETS = [
  // Tall background peak, sitting high and swinging widest.
  {
    z: -0.3,
    y: 0.15,
    heightMul: 0.9,
    ampMul: 1.8,
    phase: 0.3,
    freqMul: 0.7,
    colorMix: 0.16,
    opacity: 0.88,
    translucency: 0.06,
  },
  // Mid-ground body.
  {
    z: -0.15,
    y: 0,
    heightMul: 1,
    ampMul: 0.95,
    phase: 3.4,
    freqMul: 1.05,
    colorMix: 0.42,
    opacity: 0.86,
    translucency: 0.05,
  },
  // Foreground drape, where the warm cream collects.
  {
    z: 0,
    y: -0.13,
    heightMul: 0.95,
    ampMul: 0.7,
    phase: 5.1,
    freqMul: 1.2,
    colorMix: 0.66,
    opacity: 0.84,
    translucency: 0.04,
  },
];

export default function WaveScene() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const width = viewport.width * 1.5;
  const baseFreq = (Math.PI * 2 * 1.5) / width;

  const baseHeight = viewport.width * 0.105;
  const baseAmp = viewport.width * 0.05;

  useFrame((state) => {
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.05;

    if (group.current) {
      group.current.rotation.z = mouse.current.x * 0.012;
      group.current.position.y = mouse.current.y * viewport.width * 0.012;
    }
  });

  return (
    <group ref={group}>
      {SHEETS.map((sheet, i) => {
        const sheetHeight = baseHeight * sheet.heightMul;
        const amp = baseAmp * sheet.ampMul;
        return (
          <WaveLayer
            key={i}
            mouse={mouse}
            position={[0, sheet.y * baseHeight * 1.6 - baseHeight * 0.35, sheet.z]}
            width={width}
            height={sheetHeight}
            segmentsX={200}
            segmentsY={56}
            amp1={amp}
            amp2={amp * 0.44}
            amp3={amp * 0.2}
            freq1={baseFreq * sheet.freqMul}
            freq2={baseFreq * sheet.freqMul * 2.15}
            freq3={baseFreq * sheet.freqMul * 3.9}
            speed1={0.16}
            speed2={0.21}
            speed3={0.26}
            phase={sheet.phase}
            noiseFreq={0.15}
            noiseAmp={sheetHeight * 0.7}
            foldSpeed={0.04}
            twistFreq={0}
            twistSpeed={0}
            twistPhase={Math.PI / 2}
            colorDeep={PALETTE.deep}
            colorLight={PALETTE.light}
            colorCream={PALETTE.cream}
            colorGold={PALETTE.gold}
            fresnelColor={PALETTE.fresnel}
            fresnelPower={2.4}
            fresnelStrength={0.1}
            colorMix={sheet.colorMix}
            opacity={sheet.opacity}
            edgeFadeX={0.14}
            edgeFadeY={0.16}
            grainStrength={0.012}
            strandStrength={0}
            translucency={sheet.translucency}
            shadeSoftness={1.1}
            parallax={0}
            timeScale={1}
          />
        );
      })}
    </group>
  );
}
