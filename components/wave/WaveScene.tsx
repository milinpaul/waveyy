"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import WaveLayer from "./WaveLayer";

const PALETTE = {
  deep: "#1E5FA8",
  light: "#7FB6E4",
  cream: "#EFD9A0",
  gold: "#D9A93F",
  fresnel: "#FFFFFF",
};

export default function WaveScene() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const width = viewport.width * 1.35;
  // ~1.4 cycles across the ribbon keeps it a long, elegant S-curve.
  const baseFreq = (Math.PI * 2 * 1.4) / width;

  useFrame((state) => {
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.05;

    if (group.current) {
      group.current.rotation.z = mouse.current.x * 0.015;
      group.current.position.y = mouse.current.y * viewport.height * 0.03;
    }
  });

  // Scale off width, not height: the strip is short and wide, so height-based
  // sizing blows the wave up out of frame on narrow viewports.
  const ribbonHeight = viewport.width * 0.14;
  const amp = viewport.width * 0.075;
  // ~1.25 twist cycles across the ribbon gives a couple of pinch/cross points.
  const twistFreq = (Math.PI * 2 * 1.25) / width;
  // Constant world-space strand spacing, so density reads the same at any size.
  const strandCount = Math.max(Math.round(ribbonHeight * 28), 10);

  return (
    <group ref={group}>
      <WaveLayer
        mouse={mouse}
        position={[0, 0, 0]}
        width={width}
        height={ribbonHeight}
        segmentsX={240}
        segmentsY={64}
        amp1={amp}
        amp2={amp * 0.42}
        amp3={amp * 0.2}
        freq1={baseFreq}
        freq2={baseFreq * 2.15}
        freq3={baseFreq * 3.9}
        speed1={0.2}
        speed2={0.26}
        speed3={0.32}
        phase={1.2}
        noiseFreq={0.16}
        noiseAmp={ribbonHeight * 0.12}
        foldSpeed={0.045}
        twistFreq={twistFreq}
        twistSpeed={0.16}
        twistPhase={0.9}
        colorDeep={PALETTE.deep}
        colorLight={PALETTE.light}
        colorCream={PALETTE.cream}
        colorGold={PALETTE.gold}
        fresnelColor={PALETTE.fresnel}
        fresnelPower={2.8}
        fresnelStrength={0.06}
        colorMix={0.45}
        opacity={1}
        edgeFadeX={0.08}
        edgeFadeY={0.06}
        grainStrength={0.03}
        strandCount={strandCount}
        strandSharpness={3.5}
        parallax={0}
        timeScale={1}
      />
    </group>
  );
}
