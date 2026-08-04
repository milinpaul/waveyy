"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import WaveLayer from "./WaveLayer";

// Champagne is the ribbon's face; blue is its reverse, showing where the band
// twists over. The blue is a vivid cornflower — keeping `light` an actual blue
// rather than near-white is what stops the lit side washing out to grey.
const PALETTE = {
  deep: "#1F6FE0",
  light: "#7FB2F2",
  cream: "#FFFDF7",
  gold: "#EFDFB6",
  fresnel: "#FFFFFF",
};

/**
 * A few thin ribbons sharing one twist, offset in phase and depth. Kept
 * narrow with generous white space, as in the reference.
 */
const RIBBONS = [
  {
    z: -0.2,
    y: 0.1,
    heightMul: 1,
    ampMul: 1,
    phase: 0.4,
    freqMul: 1,
    twistMul: 1,
    twistPhase: 0.9,
    opacity: 0.72,
  },
  {
    z: -0.1,
    y: -0.04,
    heightMul: 0.86,
    ampMul: 0.82,
    phase: 2.7,
    freqMul: 1.15,
    twistMul: 0.85,
    twistPhase: 2.4,
    opacity: 0.6,
  },
  {
    z: 0,
    y: -0.18,
    heightMul: 0.72,
    ampMul: 0.66,
    phase: 4.9,
    freqMul: 1.32,
    twistMul: 1.2,
    twistPhase: 4.1,
    opacity: 0.5,
  },
];

export default function WaveScene() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const width = viewport.width * 1.5;
  const baseFreq = (Math.PI * 2 * 1.35) / width;
  const twistFreq = (Math.PI * 2 * 1.15) / width;

  const baseHeight = viewport.width * 0.1;
  const baseAmp = viewport.width * 0.045;

  // Sit below centre. When the canvas is a tall hero background this keeps the
  // ribbon clear of the headline; in a short strip it is a negligible nudge.
  const restY = -viewport.height * 0.16;

  useFrame((state) => {
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.05;

    if (group.current) {
      group.current.rotation.z = mouse.current.x * 0.012;
      group.current.position.y = restY + mouse.current.y * viewport.width * 0.012;
    }
  });

  return (
    <group ref={group}>
      {RIBBONS.map((ribbon, i) => {
        const ribbonHeight = baseHeight * ribbon.heightMul;
        const amp = baseAmp * ribbon.ampMul;
        return (
          <WaveLayer
            key={i}
            mouse={mouse}
            position={[0, ribbon.y * baseHeight, ribbon.z]}
            width={width}
            height={ribbonHeight}
            segmentsX={240}
            segmentsY={48}
            amp1={amp}
            amp2={amp * 0.44}
            amp3={amp * 0.2}
            freq1={baseFreq * ribbon.freqMul}
            freq2={baseFreq * ribbon.freqMul * 2.15}
            freq3={baseFreq * ribbon.freqMul * 3.9}
            speed1={0.17}
            speed2={0.22}
            speed3={0.27}
            phase={ribbon.phase}
            noiseFreq={0.12}
            noiseAmp={ribbonHeight * 0.3}
            foldSpeed={0.035}
            twistFreq={twistFreq * ribbon.twistMul}
            twistSpeed={0.13}
            twistPhase={ribbon.twistPhase}
            colorDeep={PALETTE.deep}
            colorLight={PALETTE.light}
            colorCream={PALETTE.cream}
            colorGold={PALETTE.gold}
            fresnelColor={PALETTE.fresnel}
            fresnelPower={2.4}
            fresnelStrength={0.08}
            colorMix={0.62}
            opacity={ribbon.opacity}
            edgeFadeX={0.12}
            edgeFadeY={0.34}
            grainStrength={0.05}
            strandStrength={0}
            translucency={0.05}
            shadeSoftness={1.3}
            viewFade={0.22}
            twoSided={0.85}
            parallax={0}
            timeScale={1}
          />
        );
      })}
    </group>
  );
}
