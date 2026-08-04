"use client";

import { Canvas } from "@react-three/fiber";
import WaveScene from "./WaveScene";

export default function WaveStrip() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 100, position: [0, 0, 10], near: 0.1, far: 50 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      // Measure immediately. With the default debounce the initial measure can
      // come back 0 and the canvas is left at its 300x150 HTML default,
      // rendering a tiny wave in the corner of an otherwise blank strip.
      resize={{ debounce: 0, scroll: false }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <WaveScene />
    </Canvas>
  );
}
