"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders";

export type WaveLayerConfig = {
  /** Position in the group; z controls depth ordering / parallax strength. */
  position: [number, number, number];
  /** Plane size in world units. */
  width: number;
  height: number;
  /** Geometry resolution. */
  segmentsX?: number;
  segmentsY?: number;
  /** Ridge wave shape. */
  amp1: number;
  amp2: number;
  amp3: number;
  freq1: number;
  freq2: number;
  freq3: number;
  speed1: number;
  speed2: number;
  speed3: number;
  phase: number;
  /** Fine silk-fold noise. */
  noiseFreq: number;
  noiseAmp: number;
  foldSpeed: number;
  /** Ribbon twist — where the envelope crosses zero the band pinches and crosses over. */
  twistFreq?: number;
  twistSpeed?: number;
  twistPhase?: number;
  /** Palette. */
  colorDeep: string;
  colorLight: string;
  colorCream: string;
  colorGold: string;
  fresnelColor: string;
  fresnelPower: number;
  fresnelStrength: number;
  colorMix: number;
  opacity: number;
  edgeFadeX?: number;
  edgeFadeY?: number;
  grainStrength?: number;
  /** How many fine strands the ribbon resolves into across its width. */
  strandCount?: number;
  /** Higher = thinner, more separated strands. */
  strandSharpness?: number;
  /** 1 = fully resolved into strands, 0 = solid sheet. */
  strandStrength?: number;
  /** Light bleeding through the sheet, for a backlit fabric look. */
  translucency?: number;
  /** Higher = softer light-to-shadow falloff across a fold. */
  shadeSoftness?: number;
  /**
   * Fade width at the canvas top/bottom, in NDC units (0-1). Keeps sheets that
   * overflow the canvas from being hard-cut by its edge. 0 disables it.
   */
  viewFade?: number;
  /** Blend toward front-warm / back-blue face colouring (0-1). */
  twoSided?: number;
  /** How strongly this layer reacts to pointer movement (0 = static). */
  parallax?: number;
  timeScale?: number;
  /** Shared smoothed pointer, updated every frame by the parent scene. */
  mouse: React.MutableRefObject<THREE.Vector2>;
};

export default function WaveLayer({
  position,
  width,
  height,
  segmentsX = 200,
  segmentsY = 60,
  amp1,
  amp2,
  amp3,
  freq1,
  freq2,
  freq3,
  speed1,
  speed2,
  speed3,
  phase,
  noiseFreq,
  noiseAmp,
  foldSpeed,
  // Defaults are a no-op twist: sin(pi/2) == 1, i.e. full width everywhere.
  twistFreq = 0,
  twistSpeed = 0,
  twistPhase = Math.PI / 2,
  colorDeep,
  colorLight,
  colorCream,
  colorGold,
  fresnelColor,
  fresnelPower,
  fresnelStrength,
  colorMix,
  opacity,
  edgeFadeX = 0.12,
  edgeFadeY = 0.22,
  grainStrength = 0.035,
  strandCount = 40,
  strandSharpness = 3,
  strandStrength = 1,
  translucency = 0,
  shadeSoftness = 1,
  viewFade = 0,
  twoSided = 0,
  parallax = 0,
  timeScale = 1,
  mouse,
}: WaveLayerConfig) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(width, height, segmentsX, segmentsY),
    [width, height, segmentsX, segmentsY]
  );

  // Uniforms are created once; per-frame/prop updates are pushed via .value in useFrame below.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAmp1: { value: amp1 },
      uAmp2: { value: amp2 },
      uAmp3: { value: amp3 },
      uFreq1: { value: freq1 },
      uFreq2: { value: freq2 },
      uFreq3: { value: freq3 },
      uSpeed1: { value: speed1 },
      uSpeed2: { value: speed2 },
      uSpeed3: { value: speed3 },
      uPhase: { value: phase },
      uNoiseFreq: { value: noiseFreq },
      uNoiseAmp: { value: noiseAmp },
      uFoldSpeed: { value: foldSpeed },
      uTwistFreq: { value: twistFreq },
      uTwistSpeed: { value: twistSpeed },
      uTwistPhase: { value: twistPhase },
      uColorDeep: { value: new THREE.Color(colorDeep) },
      uColorLight: { value: new THREE.Color(colorLight) },
      uColorCream: { value: new THREE.Color(colorCream) },
      uColorGold: { value: new THREE.Color(colorGold) },
      uFresnelColor: { value: new THREE.Color(fresnelColor) },
      uFresnelPower: { value: fresnelPower },
      uFresnelStrength: { value: fresnelStrength },
      uColorMix: { value: colorMix },
      uOpacity: { value: opacity },
      uEdgeFadeX: { value: edgeFadeX },
      uEdgeFadeY: { value: edgeFadeY },
      uGrainStrength: { value: grainStrength },
      uStrandCount: { value: strandCount },
      uStrandSharpness: { value: strandSharpness },
      uStrandStrength: { value: strandStrength },
      uTranslucency: { value: translucency },
      uShadeSoftness: { value: shadeSoftness },
      uViewFade: { value: viewFade },
      uTwoSided: { value: twoSided },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    if (!material || !mesh) return;

    material.uniforms.uTime.value = state.clock.elapsedTime * timeScale;
    material.uniforms.uMouse.value.copy(mouse.current);

    if (parallax > 0) {
      mesh.position.x = position[0] + mouse.current.x * parallax;
      mesh.position.y = position[1] + mouse.current.y * parallax * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
