// Shared GLSL noise utility (public-domain style simplex noise, Ashima Arts / Ian McEwan).
const noiseChunk = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amp * snoise(p);
      p *= 1.8;
      amp *= 0.42;
    }
    return value;
  }
`;

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;

  uniform float uAmp1;
  uniform float uAmp2;
  uniform float uAmp3;
  uniform float uFreq1;
  uniform float uFreq2;
  uniform float uFreq3;
  uniform float uSpeed1;
  uniform float uSpeed2;
  uniform float uSpeed3;
  uniform float uPhase;

  uniform float uNoiseFreq;
  uniform float uNoiseAmp;
  uniform float uFoldSpeed;

  uniform float uTwistFreq;
  uniform float uTwistSpeed;
  uniform float uTwistPhase;

  varying vec2 vUv;
  varying float vHeight;
  varying float vNoise;
  varying float vPatch;
  varying vec3 vNormalW;
  varying vec3 vViewPosition;

  ${noiseChunk}

  float ridge(float x, float t) {
    return uAmp1 * sin(x * uFreq1 + t * uSpeed1 + uPhase)
         + uAmp2 * sin(x * uFreq2 - t * uSpeed2 + uPhase * 1.31)
         + uAmp3 * sin(x * uFreq3 + t * uSpeed3 * 0.7 - uPhase * 0.53);
  }

  // Signed width envelope. Where this crosses zero the ribbon pinches to a
  // point and flips over, which is what produces the self-crossing X shapes.
  float twist(float x, float t) {
    return sin(x * uTwistFreq + t * uTwistSpeed + uTwistPhase);
  }

  vec3 wavePoint(vec2 xy, float t) {
    float r = ridge(xy.x, t);

    // Two decorrelated 2D noise fields. Driving the vertical offset (not just
    // depth) is what turns flat horizontal bands into actual draped folds:
    // the surface now curves across y as well as x, so normals — and with
    // them the light/shadow that reads as cloth — vary in both directions.
    vec2 q = vec2(xy.x * uNoiseFreq + t * uFoldSpeed, xy.y * uNoiseFreq * 2.2 - t * uFoldSpeed * 0.6);
    float nY = fbm(q);
    float nZ = fbm(q + vec2(37.2, 11.7));

    float y = xy.y * twist(xy.x, t) + r + nY * uNoiseAmp;
    return vec3(xy.x, y, nZ * uNoiseAmp * 0.7);
  }

  void main() {
    vUv = uv;

    float eps = 0.18;
    vec3 p0 = wavePoint(position.xy, uTime);
    vec3 px = wavePoint(position.xy + vec2(eps, 0.0), uTime);
    vec3 py = wavePoint(position.xy + vec2(0.0, eps), uTime);

    vec3 tangentX = px - p0;
    vec3 tangentY = py - p0;
    vec3 n = normalize(cross(tangentX, tangentY));

    vHeight = p0.y;
    vNoise = fbm(position.xy * uNoiseFreq + uTime * uFoldSpeed + uPhase);
    vPatch = fbm(position.xy * 0.14 + uPhase * 2.0 + uTime * 0.015);
    vNormalW = normalize(normalMatrix * n);

    vec4 mvPosition = modelViewMatrix * vec4(p0, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorLight;
  uniform vec3 uColorCream;
  uniform vec3 uColorGold;
  uniform vec3 uFresnelColor;
  uniform float uFresnelPower;
  uniform float uFresnelStrength;
  uniform float uOpacity;
  uniform float uColorMix;
  uniform float uEdgeFadeX;
  uniform float uEdgeFadeY;
  uniform float uGrainStrength;
  uniform float uStrandCount;
  uniform float uStrandSharpness;
  // 1 = fully resolved into strands, 0 = solid sheet.
  uniform float uStrandStrength;
  // Light bleeding through the sheet, for the backlit fabric look.
  uniform float uTranslucency;
  // Higher = softer, more gradual light-to-shadow falloff across a fold.
  uniform float uShadeSoftness;

  // Hard contour line tracing each sheet's long edges.
  uniform vec3 uBorderColor;
  uniform float uBorderWidth;
  // How far in from the edge the line sits. It has to sit inside the edge
  // fade, otherwise the fade zeroes the alpha and the line never shows.
  uniform float uBorderInset;
  uniform float uBorderStrength;

  varying vec2 vUv;
  varying float vHeight;
  varying float vNoise;
  varying float vPatch;
  varying vec3 vNormalW;
  varying vec3 vViewPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    // Sheets are DoubleSide, so flip the normal on back faces or the
    // lighting inverts wherever a fold turns away from the camera.
    vec3 normal = normalize(vNormalW);
    if (!gl_FrontFacing) normal = -normal;
    vec3 viewDir = normalize(vViewPosition);

    vec3 lightDir = normalize(vec3(0.35, 0.55, 1.0));

    // Half-lambert: no hard terminator, so folds read as soft cloth rather
    // than a lit solid. uShadeSoftness biases how quickly it rolls off.
    float halfLambert = dot(normal, lightDir) * 0.5 + 0.5;
    float shade = pow(clamp(halfLambert, 0.0, 1.0), uShadeSoftness);
    shade = mix(shade, smoothstep(-1.0, 1.0, vNoise), 0.25);

    vec3 blueTone = mix(uColorDeep, uColorLight, shade);
    vec3 warmTone = mix(uColorGold, uColorCream, shade);

    float patchT = smoothstep(-0.35, 0.35, vPatch + (uColorMix - 0.5) * 1.4);
    vec3 base = mix(blueTone, warmTone, patchT);

    // Light transmitted through the sheet from behind.
    float back = pow(max(dot(normal, -lightDir), 0.0), 1.5);
    base += uFresnelColor * back * uTranslucency;

    float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), uFresnelPower);
    vec3 color = base + uFresnelColor * fresnel * uFresnelStrength;

    float grain = hash(gl_FragCoord.xy + fract(uTime) * 173.0) - 0.5;
    color += grain * uGrainStrength;

    // Resolve the ribbon into fine strands running along its length. The
    // sine keeps the falloff smooth (no hard stripe edges to alias), and the
    // noise offset lets the strands bunch and splay organically as it twists.
    float strandCoord = vUv.y * uStrandCount + vNoise * 0.8;
    float wave = sin(strandCoord * 6.28318530718) * 0.5 + 0.5;
    float strand = mix(1.0, pow(wave, uStrandSharpness), uStrandStrength);

    float edgeX = smoothstep(0.0, uEdgeFadeX, vUv.x) * (1.0 - smoothstep(1.0 - uEdgeFadeX, 1.0, vUv.x));
    float edgeY = smoothstep(0.0, uEdgeFadeY, vUv.y) * (1.0 - smoothstep(1.0 - uEdgeFadeY, 1.0, vUv.y));

    float alpha = uOpacity * strand * edgeX * edgeY;

    // Crisp contour band a fixed inset in from each long edge. It carries its
    // own alpha so it stays sharp where the soft body has already faded out.
    float dEdge = min(vUv.y, 1.0 - vUv.y);
    float line = 1.0 - smoothstep(0.0, uBorderWidth, abs(dEdge - uBorderInset));
    line *= uBorderStrength * edgeX;
    color = mix(color, uBorderColor, line);
    alpha = max(alpha, line * uOpacity);
    gl_FragColor = vec4(color, alpha);
  }
`;
