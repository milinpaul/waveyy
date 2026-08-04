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
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <WaveScene />
    </Canvas>
  );
}
