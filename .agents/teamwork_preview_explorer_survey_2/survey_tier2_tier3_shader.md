# Comprehensive Architectural Survey: Tier 2 Transit Portal & Tier 3 WebGL Plasma Shader + UI Overhaul

**Target Project**: Murthehelp Dual-Layer Simulation Platform (`index.html`)  
**Investigator**: Explorer 2 (UI/UX, 3D WebGL Shader & Interactive Engineering Specialist)  
**Date**: 2026-08-25  
**Integrity Mode**: Production Agency-Tier ($150k+ Awwwards Standard) / Zero Regressions

---

## 1. Executive Summary & Problem Formulation

The Murthehelp platform operates as a covert dual-layer web simulation comprised of:
1. **Tier 1**: European Industrial B2B Disguise Storefront (Tập đoàn Cơ khí & Thủy lực Hoàng Hắc Long).
2. **Tier 2**: Cinematic Transit Portal Gateway (`#portal-stage` / `murderhelp`).
3. **Tier 3**: Dark Tactical Marketplace & Procurement Mall (`#dark-stage` / `MURDER-SHOP`).

While the core game logic, secret triggers, Supabase authentication, and 54-item catalog are robust and pass 100% of automated test suites (E2E, Adversarial, Empirical, and Oracle harnesses), the current visual presentation of **Tier 2** and **Tier 3** requires a substantial visual engineering upgrade to achieve an **elite $150k+ digital agency / Awwwards Site of the Day** standard.

### Core Objectives of this Survey:
- **Map Tier 2 (`#portal-stage`)**: Upgrade from a flat burgundy background to an immersive cinematic transit environment featuring rich burgundy radial vignette gradients (`#4a0005` to `#240003` to `#0d0001`), biometric laser scanning animations, holographic grid telemetry, an ultra-sleek 3-color clearance stripe, and high-refraction glassmorphic authentication modal.
- **Map Tier 3 (`#dark-stage`)**: Transform the basic wireframe icosahedron into a high-performance **Fresnel Iridescent Plasma Sphere** with GLSL 3D Simplex noise vertex displacement, chromatic aberration/dispersion, dynamic Fresnel rim glow, and clearance-reactive color palettes (RED, PURPLE, YELLOW, GREEN).
- **Design Tier 3 UI Components**: Establish a **Double-Bezel Weapon Card** design system with recessed image wells, **Floating Island Action Buttons**, fluid subcategory navigation, and slick cart drawer interactions.
- **Preserve 100% Contract Integrity**: Guarantee exact compatibility with all existing DOM IDs, data attributes, test assertions, and event handlers.

---

## 2. Investigation of Existing Implementation in `index.html`

### 2.1 Current Tier 2 Transit Portal (`#portal-stage`) Analysis
- **DOM Location**: `index.html` lines 453–544.
- **Current Container**:
  ```html
  <div id="portal-stage" class="fixed inset-0 bg-[#3b0206] hidden z-50 flex-col items-center justify-center font-mono-code text-white fade-in overflow-y-auto p-4">
  ```
- **Existing Elements**:
  - `#portal-stage` container with flat background color `#3b0206`.
  - Centered `murderhelp` text: `<h1 class="text-7xl sm:text-8xl md:text-9xl font-black tracking-widest text-red-500 lowercase drop-shadow-[0_0_45px_rgba(239,68,68,0.9)] animate-pulse text-center select-none">murderhelp</h1>`.
  - Clearance stripe: `#clearance-bar` with `data-testid="clearance-stripe"`, containing 3 child divs (Red `#b3001e`, Purple `#4d19bf`, Amber `#e67e00`).
  - Auth modal: `<div class="bg-[#0b0d13] border border-red-800/80 text-gray-200 p-6 rounded-3xl shadow-2xl space-y-4 text-left">`.
  - Input fields: `#login-username`, `#login-password`, `#reg-fullname`, `#reg-username`, `#reg-password`, `#reg-tier`.
- **Identified Deficiencies**:
  - The background is a flat solid color (`#3b0206`) lacking atmospheric depth, vignette lighting, and cinematic mood.
  - Absence of biometric laser scanning effects, holographic grid lines, and tactical HUD telemetry overlays.
  - The title glow relies on basic Tailwind `drop-shadow` and `animate-pulse` rather than a layered multi-stage neon glow with chromatic depth.
  - The auth modal uses simple opacity rather than frosted optical glassmorphism with high-refraction borders and tactile input affordances.

---

### 2.2 Current Three.js WebGL Setup & Shader Analysis
- **DOM Location**: `index.html` line 553 (`<canvas id="webgl-canvas" class="fixed inset-0 w-full h-full pointer-events-none opacity-35 z-0"></canvas>`).
- **JavaScript Code Location**: `index.html` lines 2670–2809.
- **Current Shaders**:
  - **Vertex Shader**:
    ```glsl
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        vNormal = normal;
        vPosition = position;
        vec3 newPosition = position + normal * (sin(position.x * 2.0 + uTime) * 0.15);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
    ```
  - **Fragment Shader**:
    ```glsl
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        vec3 color = mix(uColorA, uColorB, vPosition.y * 0.5 + 0.5);
        gl_FragColor = vec4(color + intensity * 0.4, 0.85);
    }
    ```
  - **Geometry & Material**:
    ```javascript
    const geometry = new THREE.IcosahedronGeometry(1.4, 32);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        transparent: true,
        wireframe: true
    });
    ```
  - **Uniforms & Animation**:
    - Uniforms: `uTime`, `uColorA`, `uColorB`.
    - Color lerp: `uColorA.value.lerp(targetColorA, 0.05)` and `uColorB.value.lerp(targetColorB, 0.05)`.
    - Mouse movement: Translates `sphereMesh.position` and adds gentle rotation.
- **Identified Deficiencies**:
  - Vertex displacement uses a trivial 1D sine wave (`sin(position.x * 2.0 + uTime) * 0.15`), producing rigid, repetitive, artificial ripples rather than organic fluid plasma turbulence.
  - Fragment shader uses a basic linear color mix and crude dot-product rim without true Fresnel equations, thin-film optical interference, or chromatic aberration.
  - Wireframe-only rendering creates a low-complexity look instead of a luminous, high-energy volumetric plasma core with glowing atmospheric edges.
  - Color palettes lack molten ember intensity, neon violet saturation, and cyber emerald radiance.

---

### 2.3 Current Tier 3 UI & Product Card Analysis
- **DOM Location**: `index.html` lines 548–750 and lines 2139–2214 (`renderProducts()`).
- **Current Card Structure**:
  - Card container: `bg-[#0b0d14]/90 backdrop-blur-md border border-neutral-800/80 rounded-2xl`.
  - Image container: `relative w-full h-44 bg-neutral-950 overflow-hidden cursor-pointer`.
  - Buttons: Standard 2-column grid of basic rectangular buttons (`bg-neutral-900` and `bg-red-900/80`).
- **Identified Deficiencies**:
  - Single flat border without the depth of a layered **Double-Bezel** architectural frame.
  - Action buttons are standard flat blocks lacking the tactile elevation, fluid micro-interactions, and visual distinction of modern **Floating Island** action triggers.
  - Subcategory sidebar list is basic text without tactical status pips, active glow indicators, or category telemetry.

---

## 3. Tier 2 Transit Portal Architectural Blueprint (`#portal-stage`)

### 3.1 Atmospheric Background & Burgundy Vignette Gradient
To evoke the covert, high-stakes military transit gateway seen in Korean thriller cinematography (such as *A Shop for Killers*), the background canvas must combine deep burgundy tones with radial darkness:
- **Palette**:
  - Central Core Glow: `#4a0005` (Deep Sanguine Burgundy)
  - Mid Vignette: `#240003` (Dark Oxide Burgundy)
  - Edge Void: `#0d0001` to `#050001` (Near-OLED Crimson Black)
- **CSS Specification**:
  ```css
  .portal-bg-atmosphere {
      background: radial-gradient(circle at 50% 45%, #4a0005 0%, #240003 55%, #0d0001 85%, #050001 100%);
      position: relative;
      overflow: hidden;
  }
  ```

---

### 3.2 Biometric Laser Scanning System & Holographic Telemetry

#### A. Holographic Matrix Grid
An ultra-fine procedural grid layer with subtle optical noise and low-opacity crosshairs:
```css
.portal-holo-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: 
        linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px);
    background-size: 32px 32px;
    background-position: center center;
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 75%);
}
```

#### B. Dynamic Biometric Laser Sweep Beam
A dual-layer horizontal laser line that sweeps vertically across the viewport with radiant bloom, chromatic flare, and trailing phosphor decay:
```css
@keyframes laserSweepVertical {
    0% {
        top: -5%;
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        top: 105%;
        opacity: 0;
    }
}

.biometric-laser-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(239, 68, 68, 0.4) 15%, 
        #ff2a55 50%, 
        rgba(239, 68, 68, 0.4) 85%, 
        transparent 100%);
    box-shadow: 
        0 0 10px #ff2a55,
        0 0 25px rgba(255, 42, 85, 0.8),
        0 0 50px rgba(179, 0, 30, 0.6),
        0 0 100px rgba(179, 0, 30, 0.3);
    animation: laserSweepVertical 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    pointer-events: none;
    z-index: 5;
}

/* Secondary scanning flare */
.biometric-laser-glow {
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    margin-top: -20px;
    background: linear-gradient(180deg, 
        rgba(255, 42, 85, 0) 0%, 
        rgba(255, 42, 85, 0.08) 50%, 
        rgba(255, 42, 85, 0) 100%);
    pointer-events: none;
}
```

#### C. Tactical HUD Telemetry & Optical Reticles
Corner bracket reticles and military-grade telemetry HUD markers positioned around the portal viewport:
- **Top-Left HUD**: `[ BIOMETRIC RADAR // RETINAL SCAN ACTIVE ]`
- **Top-Right HUD**: `[ LAT: 16.4637° N | LON: 107.5909° E // HUE_NODE_04 ]`
- **Bottom-Left HUD**: `[ ENCRYPTION: QUANTUM-ECC-512 // SECURE ]`
- **Bottom-Right HUD**: `[ TRANSIT GATEWAY // PROTOCOL 7209 ]`

---

### 3.3 Centered `murderhelp` Neon Display & 3-Color Clearance Stripe

#### A. Multi-Layer Sanguine Neon Typography
The `murderhelp` title must feature deep luminous neon radiance:
```css
.murderhelp-neon-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 900;
    letter-spacing: 0.25em;
    color: #ffffff;
    text-shadow: 
        0 0 5px #ffffff,
        0 0 10px #ff3355,
        0 0 20px #ff1a40,
        0 0 40px #b3001e,
        0 0 80px #700010,
        0 0 120px rgba(112, 0, 16, 0.8);
    animation: neonPulseGlow 3s ease-in-out infinite alternate;
}

@keyframes neonPulseGlow {
    0% {
        text-shadow: 
            0 0 4px #ffffff,
            0 0 10px #ff3355,
            0 0 20px #ff1a40,
            0 0 40px #b3001e,
            0 0 70px #700010;
        opacity: 0.95;
    }
    100% {
        text-shadow: 
            0 0 6px #ffffff,
            0 0 15px #ff4d6d,
            0 0 30px #ff2a55,
            0 0 60px #b3001e,
            0 0 100px #900015,
            0 0 140px rgba(179, 0, 30, 0.7);
        opacity: 1;
    }
}
```

#### B. Extended 3-Color Clearance Stripe Specification
The clearance stripe `#clearance-bar` (`data-testid="clearance-stripe"`) serves as a central visual anchor representing the 3 primary operative clearance levels:
- **Dimensions**: Width: `w-full max-w-md sm:max-w-lg md:max-w-xl`, Height: `h-3 sm:h-3.5`.
- **Segments**:
  1. Red (`#b3001e`): Represents CODE RED combat operatives.
  2. Purple (`#4d19bf`): Represents CODE PURPLE clean-up & espionage.
  3. Amber (`#e67e00`): Represents CODE YELLOW medical & bio-support.
- **Visual Refinement**:
  - Rounded pill contour (`rounded-full`).
  - Subtle 1px outer metallic rim (`border border-white/10`).
  - Interior specular highlight / glass sheen overlay (`box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), 0 0 25px rgba(179,0,30,0.5)`).
  - Shimmer light sweep animation across the stripe segments.

---

### 3.4 Auth Modal Optical Glassmorphism & Tactical Input Affordances

#### A. High-Refraction Dark Glassmorphism Container
```css
.portal-glass-modal {
    background: rgba(11, 13, 19, 0.75);
    backdrop-filter: blur(28px) saturate(190%);
    -webkit-backdrop-filter: blur(28px) saturate(190%);
    border: 1px solid rgba(239, 68, 68, 0.25);
    box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.12),
        inset 0 -1px 1px rgba(0, 0, 0, 0.6),
        0 25px 60px rgba(0, 0, 0, 0.85),
        0 0 35px rgba(179, 0, 30, 0.2);
    border-radius: 1.5rem;
}
```

#### B. Tactical Input Styling
- Translucent input wells (`background: rgba(18, 21, 31, 0.8)`).
- Crisp 1px border with high-contrast active state (`border: 1px solid rgba(255,255,255,0.12)`).
- On focus: Active crimson glow (`border-color: #ef4444`, `box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2), inset 0 1px 2px rgba(0,0,0,0.5)`).
- Typography: Micro-labels in `Space Grotesk` uppercase tracking (`tracking-wider text-[11px] font-bold text-neutral-400`).

#### C. Primary Tactical Submission Trigger
- High-intensity crimson gradient: `background: linear-gradient(135deg, #b3001e 0%, #e11d48 50%, #881337 100%)`.
- Hover state: Ambient red bloom (`box-shadow: 0 0 25px rgba(225, 29, 72, 0.6)`), slight elevation (`transform: translateY(-1px)`).
- Active state: Tactile depression (`transform: translateY(1px)`).

---

## 4. Tier 3 WebGL Plasma Shader Architecture (`#dark-stage`)

### 4.1 3D Fresnel Iridescent Plasma Sphere Design
The current wireframe sphere will be replaced with an **Awwwards-grade volumetric Fresnel Iridescent Plasma Sphere** that fluidly reacts to clearance selection, mouse movement, and time.

#### Mathematical Foundation:
1. **3D Simplex Noise Vertex Displacement**:
   - Computes smooth, non-repeating analytical noise $S(p)$ in $\mathbb{R}^3$.
   - Multi-octave Fractional Brownian Motion (fBm):
     $$\text{fBm}(p) = \sum_{k=0}^{N-1} a^k \cdot S(f^k \cdot p + \omega \cdot t)$$
   - Vertices displaced along normal vector $\hat{n}$:
     $$p' = p + \hat{n} \cdot (\text{fBm}(p) \cdot A)$$
2. **Fresnel Rim Computation**:
   $$\text{Fresnel} = \left( 1.0 - \max( \hat{n} \cdot \hat{v}, 0.0 ) \right)^{\gamma}$$
   where $\hat{v}$ is the normalized view vector, $\hat{n}$ is the surface normal, and $\gamma \approx 3.0$ is the Fresnel power exponent.
3. **Thin-Film Iridescence & Cosine Chromatic Color Dispersion**:
   $$\vec{C}_{\text{iridescent}} = \frac{1}{2} + \frac{1}{2} \cos\left( 2\pi \left( \vec{a} \cdot \text{Fresnel} + \vec{b} + \vec{c} \cdot t \right) \right)$$
4. **Chromatic Aberration**:
   - Independent phase and spatial offsets for Red, Green, and Blue channels based on the displacement gradient and viewing angle.

---

### 4.2 Complete GLSL Shader Implementation Blueprint

```glsl
/* =========================================================================
   AWWWARDS-GRADE VERTEX SHADER: 3D SIMPLEX NOISE DISPLACEMENT & FRESNEL PASS
   ========================================================================= */
uniform float uTime;
uniform float uNoiseFrequency;
uniform float uNoiseSpeed;
uniform float uDisplacementStrength;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vNoise;

// Simplex 3D Noise implementation (Stefan Gustavson / Ian McEwan, Ashima Arts)
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Layered 2-Octave Fractional Brownian Motion
float fbm(vec3 p) {
    float total = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 2; i++) {
        total += snoise(p * freq) * amp;
        freq *= 2.05;
        amp *= 0.45;
    }
    return total;
}

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Temporal noise displacement
    vec3 noiseCoord = position * uNoiseFrequency + vec3(0.0, 0.0, uTime * uNoiseSpeed);
    float noiseVal = fbm(noiseCoord);
    vNoise = noiseVal;

    // Displace vertex along normal
    vec3 displacedPosition = position + normal * (noiseVal * uDisplacementStrength);

    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
```

```glsl
/* =========================================================================
   AWWWARDS-GRADE FRAGMENT SHADER: FRESNEL IRIDESCENCE & CHROMATIC DISPERSION
   ========================================================================= */
uniform vec3 uColorA;               // Primary Clearance Color
uniform vec3 uColorB;               // Secondary Ember / Accent Color
uniform float uTime;
uniform float uFresnelPower;        // Default: 3.0
uniform float uChromaticOffset;     // Default: 0.15
uniform float uWireframeMix;        // Blend factor for procedural lattice

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vNoise;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // 1. Precise Fresnel Optical Rim
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NdotV, uFresnelPower);

    // 2. Base Organic Plasma Gradient
    float plasmaMix = clamp(vPosition.y * 0.4 + 0.5 + vNoise * 0.35, 0.0, 1.0);
    vec3 basePlasma = mix(uColorA, uColorB, plasmaMix);

    // 3. Thin-Film Cosine Iridescence
    float phase = fresnel * 3.14159 + vNoise * 1.5 + uTime * 0.15;
    vec3 iridescence = vec3(
        0.5 + 0.5 * cos(phase + 0.0),
        0.5 + 0.5 * cos(phase + 2.094),
        0.5 + 0.5 * cos(phase + 4.188)
    );

    // 4. Chromatic Aberration Fringe on Grazing Angles
    vec3 chromaticColor;
    chromaticColor.r = mix(basePlasma.r, iridescence.r, fresnel * (1.0 + uChromaticOffset));
    chromaticColor.g = mix(basePlasma.g, iridescence.g, fresnel);
    chromaticColor.b = mix(basePlasma.b, iridescence.b, fresnel * (1.0 - uChromaticOffset));

    // 5. Deep Ambient Core & Radiant Specular Edge Synthesis
    vec3 coreColor = basePlasma * 0.25; // Rich dark interior
    vec3 rimGlow = uColorB * (fresnel * 1.8);
    vec3 finalColor = coreColor + chromaticColor * 0.75 + rimGlow;

    // 6. Alpha Modulation: Luminous core with soft outer glow
    float alpha = clamp(0.4 + fresnel * 0.55 + abs(vNoise) * 0.15, 0.0, 0.95);

    gl_FragColor = vec4(finalColor, alpha);
}
```

---

### 4.3 Reactive Clearance Color Palettes

| Clearance Tier | Name & Tactical Role | Primary Color (`uColorA`) | Secondary Color (`uColorB`) | Aesthetic Emotion |
|---|---|---|---|---|
| **CODE RED** | Combat Weapons & Munitions | `#b3001e` (Deep Crimson) `vec3(0.702, 0.0, 0.118)` | `#ff4d00` / `#d4af37` (Molten Ember Gold) `vec3(1.0, 0.302, 0.0)` | Volcanic, lethal, high-tension energy |
| **CODE PURPLE** | Clean-up & Espionage | `#4d19bf` (Ultraviolet) `vec3(0.302, 0.098, 0.749)` | `#d946ef` (Neon Violet Flare) `vec3(0.851, 0.275, 0.937)` | Covert, spectral, cyber-reconnaissance |
| **CODE YELLOW** | Medical & Bio-Support | `#e67e00` (Radiant Solar Amber) `vec3(0.902, 0.494, 0.0)` | `#facc15` (Golden Glow) `vec3(0.980, 0.800, 0.082)` | Hazardous, bio-synthetic, vital adrenaline |
| **CODE GREEN** | Director Master Clearance | `#00b37e` (Cyber Emerald) `vec3(0.0, 0.702, 0.494)` | `#00ffaa` (Electric Mint Radiant) `vec3(0.0, 1.0, 0.667)` | Omnipotent, quantum encrypted, root access |

---

### 4.4 Uniforms, Transitions & 60fps Performance Optimization

#### A. Uniform Definitions
```javascript
uniforms = {
    uTime: { value: 0.0 },
    uColorA: { value: new THREE.Color(0xb3001e) },
    uColorB: { value: new THREE.Color(0xff4d00) },
    uNoiseFrequency: { value: 1.2 },
    uNoiseSpeed: { value: 0.35 },
    uDisplacementStrength: { value: 0.22 },
    uFresnelPower: { value: 2.8 },
    uChromaticOffset: { value: 0.18 }
};
```

#### B. Geometry & Mesh Setup
- Geometry: `new THREE.IcosahedronGeometry(1.5, 64)` (high subdivision density for silky-smooth vertex displacement without polygon artifacts).
- Material: `THREE.ShaderMaterial` with `transparent: true`, `depthWrite: false`, `blending: THREE.NormalBlending`.
- Position: Centered in scene, scale reactive to viewport aspect ratio.

#### C. Smooth Palette Transition (Delta Lerping)
In `setClearanceTab(tabCode)`:
```javascript
function updateWebGLColor(tier) {
    if (!uniforms || typeof THREE === 'undefined') return;
    const palettes = {
        'RED':    { a: 0xb3001e, b: 0xff4d00 },
        'PURPLE': { a: 0x4d19bf, b: 0xd946ef },
        'YELLOW': { a: 0xe67e00, b: 0xfacc15 },
        'GREEN':  { a: 0x00b37e, b: 0x00ffaa }
    };
    const target = palettes[tier] || palettes['RED'];
    targetColorA = new THREE.Color(target.a);
    targetColorB = new THREE.Color(target.b);
}
```
In `animateWebGL()`:
```javascript
if (uniforms.uColorA && uniforms.uColorA.value && targetColorA) {
    uniforms.uColorA.value.lerp(targetColorA, 0.06);
}
if (uniforms.uColorB && uniforms.uColorB.value && targetColorB) {
    uniforms.uColorB.value.lerp(targetColorB, 0.06);
}
```

#### D. Performance Safeguards (60fps Target)
1. **Device Pixel Ratio Capping**:
   ```javascript
   renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
   ```
2. **Zero Allocation in Render Loop**:
   - Re-use all vectors and matrices; avoid `new` allocations inside `requestAnimationFrame`.
3. **Visibility & Stage Culling**:
   - Only execute `renderer.render(scene, camera)` when `#dark-stage` is visible (`!document.getElementById('dark-stage').classList.contains('hidden')`). This saves GPU cycles during Tier 1 and Tier 2 browsing.
4. **Resize Debounce / Passive Listeners**:
   - `window.addEventListener('resize', onWindowResize, { passive: true })`.

---

## 5. Tier 3 Tactical UI & Interaction Design System

### 5.1 Double-Bezel Weapon Card Architecture
Modern dark military design requires multi-layered containment so product assets feel encased in titanium-alloy telemetry frames rather than floating on simple cards.

#### Structural Layers:
1. **Outer Bezel (Chassis)**:
   - Deep obsidian acrylic background: `background: linear-gradient(180deg, rgba(13, 16, 24, 0.85) 0%, rgba(6, 8, 12, 0.95) 100%)`.
   - 1px Chamfered perimeter border: `border: 1px solid rgba(255, 255, 255, 0.08)`.
   - Atmospheric backdrop blur: `backdrop-filter: blur(20px)`.
   - Dynamic tier-colored top accent line (1px subtle glow matching RED/PURPLE/YELLOW/GREEN).
2. **Inner Bezel (Asset Well)**:
   - Recessed dark display chamber: `background: #040508`.
   - Inset 1px containment border: `border: 1px solid rgba(255, 255, 255, 0.05)`.
   - Internal optical vignette: `box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.9)`.
   - Corner telemetry brackets: 4 subtle L-shaped reticle marks.
3. **Information Compartment**:
   - High-density spec pills: Monospace badges with caliber, action type, and serial prefix.
   - Price display: Monospace emerald readout (`text-emerald-400 font-mono-code font-black text-sm`).

---

### 5.2 Floating Island Action Buttons
Action buttons will be housed in a distinct pill-shaped bottom island:
- **Button Cluster Layout**:
  - **Left Button (Tactical Ghost)**: "🔍 XEM CHI TIẾT" — Dark translucent base (`rgba(255,255,255,0.04)`), crisp 1px neutral border, subtle hover luminescence. Opens `#product-detail-modal`.
  - **Right Button (Combat Action)**: "+ THÊM GIỎ" — Vibrant clearance-accented pill (e.g. `bg-red-900/80 hover:bg-red-600` for RED tier) with smooth active state.
- **Micro-Interactions**:
  - `transform: translateY(-2px)` on hover.
  - Radiant rim glow pulse on button click.
  - Direct delegation to `addToCart(item.id)` and `openProductDetailModal(item.id)`.

---

### 5.3 Category Navigation & Cart Drawer Animations

#### A. Tactical Category Sidebar
- Subcategory items render with a vertical glowing indicator strip when active:
  ```css
  .subcat-btn-active {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
      border-left: 3px solid #ef4444;
      font-weight: 700;
  }
  ```

#### B. Cart Drawer Slide-In Animation
- Modal / Drawer transition using hardware-accelerated transforms:
  ```css
  @keyframes drawerSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0%); opacity: 1; }
  }
  .cart-drawer-active {
      animation: drawerSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  ```

---

## 6. Compatibility Matrix & Regression Prevention Protocol

To ensure 100% test passing across the 44-test E2E runner, 85-assertion Victory Audit, 52-check Empirical Challenger, and 11-oracle Adversarial suites:

| Component / Selector | Current Functionality | Invariant Rule |
|---|---|---|
| `#portal-stage` | Gateway stage container | Must toggle `hidden` and `flex` classes via `triggerMurthehelpPortal()` and `returnToDisguise()`. |
| `#clearance-bar` | 3-Color clearance stripe | Must retain `data-testid="clearance-stripe"` and 3 distinct colored child elements. |
| `#webgl-canvas` | Three.js WebGL canvas | Must retain id `#webgl-canvas`, handle window resize, and update colors via `setClearanceTab()`. |
| `#dark-stage` | Dark mall main view | Must toggle `hidden` and `flex` classes via `enterDarkMallFinal()` and `returnToDisguise()`. |
| `#tab-RED`, `tab-PURPLE`, `tab-YELLOW`, `tab-GREEN` | Clearance tier buttons | Must call `setClearanceTab('TIER')` and update `currentTab`. |
| `#sub-category-list` | Dynamic subcategory filter | Must populate buttons with `onclick` handlers updating `currentSubCat`. |
| `#dark-products-grid` | Product grid container | Must dynamically render filtered items from `PRODUCTS_DB` with matching IDs. |
| `#product-detail-modal` | Blueprint quick-view modal | Must open via `openProductDetailModal(id)` and close via `closeProductDetailModal()`. |
| `#cart-modal` | Tactical cart drawer/modal | Must open via `openCartModal()` / `openCartDrawer()` and calculate correct VNĐ totals. |
| `PRODUCTS_DB` | 54-item catalog database | Must remain untouched in memory with 100% valid HTTP 200 image URLs. |
| `DEFAULT_USERS` | Auth database | Must maintain `q121101` / `Tungqu@n1208.` admin access and passcode `7209`. |

---

## 7. Conclusion & Next Steps

This survey establishes the complete technical and visual roadmap for Tier 2 and Tier 3. The proposed GLSL shaders, biometric laser scanning system, Double-Bezel card architecture, and Floating Island action buttons will elevate the Murthehelp simulation to Awwwards / $150k+ digital agency standards while preserving 100% of underlying game logic and test suite invariants.
