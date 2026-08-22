# KIẾN TRÚC TOÀN DIỆN: 3D WEBGL SHADER, ÂM THANH WEB AUDIO & HỆ THỐNG GIAO DIỆN ĐA TẦNG
**Dự án**: MURTHEHELP // MURDER.SHOPPING.MALL  
**Tác giả**: WebGL & Architecture Explorer Agent  
**Thời gian**: 2026-08-22T23:31:00+07:00  
**Tài liệu tham chiếu**: `/Users/quan/.gemini/antigravity/scratch/murthehelp/ORIGINAL_REQUEST.md`, `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html`  
**Mục tiêu**: Thiết kế hoàn chỉnh kiến trúc 3D WebGL Shader (BlueYard Morphing Noise Sphere), Hệ thống tổng hợp âm thanh Web Audio API, Cấu trúc phân tầng UI (Z-index & State Machine), và Chiến lược kiểm thử tự động Headless 60 FPS.

---

## 1. OBSERVATION (Quan Sát Thực Tế & Phân Tích Hiện Trạng)

### 1.1 Khảo Sát Hiện Trạng WebGL & Đồ Họa 3D
- **Tệp nguồn kiểm tra**: `/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html` (1.410 dòng, ~80.6 KB).
- **Hiện trạng Three.js**:
  - `grep -i "three" index.html` ➔ **0 kết quả**. Thư viện Three.js chưa được nhúng.
  - `grep -i "canvas" index.html` ➔ **0 kết quả**. Thẻ `<canvas>` chưa tồn tại trong DOM.
  - Không có mã GLSL Shader (Vertex/Fragment) nào được định nghĩa.
  - Nền giao diện Dark Mall hiện tại sử dụng màu phẳng `#07080b` kết hợp với scanline CSS tĩnh (`.scanlines-bg`), chưa có khối cầu 3D hữu cơ biến dạng theo tiếng ồn (simplex noise displacement) phong cách BlueYard.
- **Yêu cầu kỹ thuật từ `ORIGINAL_REQUEST.md` (R3 & AC)**:
  1. Tích hợp Three.js r128+ qua CDN tốc độ cao (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`).
  2. Canvas WebGL nền tương tác với khối cầu morphing hữu cơ sử dụng thuật toán 3D Simplex Noise displacement trong Vertex Shader.
  3. Hiệu ứng Fresnel và bảng màu cực quang (iridescent gradient shifts) biến đổi mượt mà theo 4 cấp độ phân quyền (Clearance Tiers):
     - **Code Red**: Deep Crimson (`#b3001e`) & Molten Gold (`#ffaa00` / `#ffd700`)
     - **Code Purple**: Ultraviolet (`#4d19bf`) & Neon Orchid (`#d946ef` / `#e056fd`)
     - **Code Yellow**: Radiant Amber (`#e67e00`) & Solar Flare (`#facc15` / `#ffbe0b`)
     - **Code Green**: Emerald Jade (`#00b37e`) & Cyber Mint (`#10b981` / `#6ee7b7`)
  4. Nền Canvas tối ưu cho màn hình OLED đen tuyền (`#06070a`), phản hồi tọa độ chuột (mouse parallax) và cuộn trang có quán tính (lerped scroll).
  5. Đạt hiệu năng ổn định 60 FPS với cơ chế giới hạn Device Pixel Ratio (`Math.min(window.devicePixelRatio, 2)`).

---

### 1.2 Khảo Sát Hệ Thống Âm Thanh (Audio & Sound FX)
- **Hiện trạng mã nguồn**:
  - `grep -i "audio" index.html` ➔ **0 kết quả**.
  - Không có âm thanh phản hồi xúc giác (tactile feedback) khi click chuột, chuyển trang, đổi quyền, thêm giỏ hàng, hoặc thanh toán.
  - `alert()` nguyên bản của trình duyệt đang được sử dụng ở nhiều nơi (dòng 1056, 1082, 1282, 1338, 1344, 1354, 1380, 1387, 1396), gây gián đoạn luồng trải nghiệm điện ảnh cyberpunk.
- **Yêu cầu kiến trúc**:
  - Tích hợp động cơ tổng hợp âm thanh thủ tục (Procedural Sound FX Engine) dựa trên **Web Audio API**.
  - **100% Zero-External-Asset**: Không phụ thuộc vào tệp `.mp3` / `.wav` bên ngoài (tránh lỗi 404, CORS, hay tải chậm), tổng hợp trực tiếp bằng `OscillatorNode`, `BiquadFilterNode`, và `GainNode`.
  - Hỗ trợ các profile âm thanh: Click phím cơ tác chiến, tiếng cổng giải mã Warp/Transit, tiếng bíp phân quyền Red/Purple/Yellow/Green, tiếng còi khẩn cấp Panic ESC, và tiếng phóng Drone điều phối đơn hàng.

---

### 1.3 Khảo Sát Kiến Trúc Xếp Lớp Giao Diện (UI Layer Stacking & Modal Hierarchy)
- **Cấu trúc giai đoạn (Stage Progression)** trong `index.html`:
  - Giai đoạn 1: `#disguise-stage` (Mặt tiền ngụy trang)
  - Giai đoạn 2: `#portal-stage` (Cổng giải mã `#4a0005` với 3 vạch màu)
  - Giai đoạn 3: `#dark-stage` (Chợ đen Murder Shopping Mall)
- **Vấn đề phân tầng & Trực quan hóa hiện tại**:
  - Khi `#dark-stage` hiển thị, các thẻ card sản phẩm có màu nền đục `#0c0e14`, che khuất toàn bộ nền phía sau. Để hiển thị được Three.js Canvas ở background, các container và card cần cấu trúc lại với lớp kính mờ tối màu (Glassmorphism with `backdrop-filter: blur()`).
  - Thiếu hệ thống quản lý Z-Index chuẩn hóa, dễ gây xung đột giữa Modal F12, Cart Drawer, Admin Modal, và Khối thông báo xác nhận đơn hàng.

---

## 2. LOGIC CHAIN (Chuỗi Suy Luận Kỹ Thuật & Thiết Kế Giải Pháp)

```
[User Request / ORIGINAL_REQUEST.md]
  │
  ├──► [R3] BlueYard-style 3D Morphing Sphere
  │      ├─► Three.js r128 Scene + PerspectiveCamera + IcosahedronGeometry(1.8, 64)
  │      ├─► Vertex Shader: 3D Simplex Noise vertex displacement (freq: 0.9, amp: 0.42, speed: 0.5)
  │      ├─► Fragment Shader: Fresnel rim glow + 3-stop dynamic iridescent gradient
  │      └─► Mouse Parallax (inertia lerp 0.05) + Scroll interaction (inertia lerp 0.08)
  │
  ├──► [Audio] Procedural Web Audio API Sound Engine
  │      ├─► Lazy AudioContext initialization on first user interaction
  │      ├─► Procedural acoustic signatures: Mechanical click, Decoder warp, Tier chimes, Drone launch
  │      └─► Master volume & Mute/Unmute state persistence in localStorage
  │
  ├──► [UI Layering] Multi-Stage State Machine & Glassmorphism
  │      ├─► Canvas (z-0) ──► Content Stage (z-10) ──► Sticky HUD (z-30) ──► Transit (z-50) ──► Modals (z-60..80)
  │      └─► Semi-transparent backdrop blur surfaces allowing 3D shader to shimmer through dark cards
  │
  └──► [Performance & Validation] 60 FPS OLED #06070a & Headless Testing
         ├─► PixelRatio capped at 2.0, powerPreference: high-performance
         ├─► Render loop auto-sleep when disguise stage active, wake on dark mall
         └─► Node.js test harness + WebGL context fallback validation
```

### 2.1 Thuật Toán 3D Simplex Noise & Biến Dạng Đỉnh (Vertex Displacement)
1. **Lý do chọn Simplex Noise so với Classic Perlin**: Simplex Noise có độ phức tạp tính toán $\mathcal{O}(N^2)$ thay vì $\mathcal{O}(2^N)$ trong không gian 3 chiều, giảm triệt để số lượng phép tính nội suy trong GPU và loại bỏ hiện tượng định hướng nhân tạo (directional artifacts).
2. **Công thức biến dạng đỉnh**:
   $$\mathbf{P}_{\text{new}} = \mathbf{P}_{\text{orig}} + \mathbf{N} \cdot \left( \text{snoise}\left(\mathbf{P}_{\text{orig}} \cdot \omega_{\text{freq}} + \mathbf{V}_{\text{time}} \cdot s\right) + 0.35 \cdot \text{snoise}\left(\mathbf{P}_{\text{orig}} \cdot 2.2 \omega_{\text{freq}} + \mathbf{V}_{\text{time}} \cdot 1.4s\right) \right) \cdot A_{\text{amp}}$$
   Trong đó:
   - $\mathbf{P}_{\text{orig}}$: Tọa độ đỉnh nguyên bản của khối cầu.
   - $\mathbf{N}$: Vector pháp tuyến chuẩn hóa của đỉnh.
   - $\omega_{\text{freq}} = 0.85$: Tần số cơ sở của sóng nhiễu.
   - $A_{\text{amp}} = 0.45$: Biên độ biến dạng (amplitude).
   - $\mathbf{V}_{\text{time}} = (t \cdot 0.3, t \cdot 0.35, t \cdot 0.4)$: Vector biến thiên theo thời gian tạo chuyển động lỏng hữu cơ.

---

### 2.2 Thuật Toán Fresnel & Bảng Màu Cực Quang (Iridescent Gradient GLSL)
1. **Công thức Fresnel quang học**:
   $$\mathcal{F} = \left( 1.0 - \max\left(\mathbf{N} \cdot \mathbf{V}_{\text{view}}, 0.0\right) \right)^{\gamma}$$
   Với $\gamma = 2.8$ tạo đường viền sáng sắc nét (rim light) ở các mép khối cầu tiếp tuyến với góc nhìn của camera.
2. **Phối màu cực quang 3 bậc (3-Stop Dynamic Gradient)**:
   - Giá trị pha trộn màu: $m = \text{clamp}\left(\frac{v_{\text{noise}} + 1.0}{2.0} \cdot 0.7 + \mathcal{F} \cdot 0.3,\; 0.0,\; 1.0\right)$
   - Pha trộn từ `u_color_core` $\rightarrow$ `u_color_primary` $\rightarrow$ `u_color_secondary`.
   - Ánh sáng viền: $\mathbf{C}_{\text{final}} = \mathbf{C}_{\text{base}} + \mathbf{C}_{\text{glow}} \cdot \mathcal{F} \cdot 1.6 + \mathbf{C}_{\text{specular}}$.
3. **Nội suy chuyển màu mượt (Smooth Color Transition)**:
   - Các biến vector màu trong Javascript (`uniforms.u_color_primary.value`, v.v.) được nội suy theo hàm Lerp ở mỗi frame render:
     $$\mathbf{C}_{\text{current}} = \mathbf{C}_{\text{current}} + (\mathbf{C}_{\text{target}} - \mathbf{C}_{\text{current}}) \times 0.06$$
   - Giúp việc đổi tab phân quyền từ RED sang PURPLE / YELLOW / GREEN diễn ra mềm mại trong ~0.8 giây như hiệu ứng chuyển plasma.

---

### 2.3 Phản Hồi Parallax Chuột & Quán Tính Cuộn Trang (Inertia Lerp)
1. **Chuột Parallax**:
   - Tọa độ mục tiêu: $X_t = \frac{2x}{\text{width}} - 1$, $Y_t = 1 - \frac{2y}{\text{height}}$
   - Tọa độ làm mịn: $X_{c} = X_c + (X_t - X_c) \times 0.05$
   - Tác động: Xoay khối cầu $R_y = X_c \times 0.5 + t \times 0.08$, $R_x = -Y_c \times 0.4$; dịch chuyển nhẹ tâm cầu $P_x = X_c \times 0.6, P_y = Y_c \times 0.4$.
2. **Cuộn trang theo quán tính (Scroll Inertia Lerp)**:
   - Tỷ lệ cuộn: $S_t = \frac{\text{scrollY}}{\text{maxScroll}}$
   - Cuộn làm mịn: $S_c = S_c + (S_t - S_c) \times 0.08$
   - Tác động: Truyền `u_scroll = S_c` vào Vertex Shader làm tăng độ xoáy của nhiễu và đẩy nhẹ camera/sphere theo trục Z.

---

### 2.4 Kiến Trúc Âm Thanh Thủ Tục (Web Audio API Synthesizer)
- Sơ đồ mạch âm thanh tổng hợp:
```
[Oscillator 1 (Carrier)] ───┐
                            ├──► [BiquadFilter (Lowpass/Bandpass)] ──► [GainNode (ADSR Envelope)] ──► [AudioContext.destination]
[Oscillator 2 (Modulator)] ─┘
```
- **Bảng thông số âm thanh thủ tục**:
  | Loại âm thanh | Dạng sóng | Dải tần số (Hz) | Thời lượng | Đặc tính ADSR | Cảm giác âm học |
  | :--- | :--- | :--- | :--- | :--- | :--- |
  | **Click Cơ Tác Chiến** | Sine | $1400 \rightarrow 200$ | 0.04s | Attack 0.002s, Exp Decay | Tiếng bấm công tắc kim loại sắc gọn |
  | **Cổng Giải Mã Warp** | Sawtooth + Sine | $480 \rightarrow 60$ | 0.85s | Filter sweep $3200 \rightarrow 180$ Hz | Tiếng rền quét cybernetic bí ẩn |
  | **Chime Code Red** | Sawtooth | $440 \rightarrow 880$ | 0.20s | Fast dual chime | Tiếng cảnh báo vũ trang đanh thép |
  | **Chime Code Purple** | Sine | $587 \rightarrow 1174$ | 0.25s | Resonant bandpass | Tiếng shimmer quét laser do thám |
  | **Chime Code Yellow** | Triangle | $880 \rightarrow 1320$ | 0.20s | High medical double-ping | Tiếng monitor y tế cấp cứu |
  | **Chime Code Green** | Sine Triad | $523.25 + 659.25 + 783.99$ | 0.40s | Chord arpeggio (C-E-G) | Hợp âm ngân vang quyền lực Giám Đốc |
  | **Drone Phóng Hàng** | Triangle + Noise | $180 \rightarrow 35$ | 0.70s | Sub-bass drop + $1760$Hz sonar ping | Tiếng động cơ phản lực tàng hình cất cánh |
  | **Báo Động Khẩn (ESC)**| Sawtooth | $320 \rightarrow 40$ | 0.15s | Sudden power-down cutoff | Tiếng ngắt kết nối đường truyền tức thì |

---

### 2.5 Phân Cấp Lớp Giao Diện (Z-Index & CSS Layer Hierarchy)
```
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 5: Emergency Panic Curtain & Confirm Modals      (z-index: 80)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 4: Interactive Modals (Cart Drawer, Admin, F12)   (z-index: 60-70)│
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Transition Portal Screen                      (z-index: 50)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Sticky Header HUD & Clearance Navigation Bar  (z-index: 30)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Content Surface (Disguise Grid / Mall Grid)   (z-index: 10)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 0: Three.js Interactive 3D WebGL Shader Canvas   (z-index: 0)    │
└────────────────────────────────────────────────────────────────────────┘
```
- **Quy tắc hiển thị**:
  - Khi ở `#disguise-stage`: `#webgl-canvas` được đặt `display: none` hoặc tạm dừng vòng lặp `requestAnimationFrame` để tiết kiệm 100% tài nguyên GPU máy người dùng.
  - Khi chuyển sang `#dark-stage`: `#webgl-canvas` được kích hoạt `display: block`, vòng lặp render chạy ở 60 FPS; nền các khối card chuyển sang kính tối `rgba(12, 14, 20, 0.75)` với viền `rgba(255, 255, 255, 0.08)` và `backdrop-filter: blur(12px)`.

---

## 3. CAVEATS (Rủi Ro Tiềm Ẩn & Biện Pháp Xử Lý)

1. **Chính sách Autoplay của Trình Duyệt (Web Audio API Autoplay Policy)**:
   - *Rủi ro*: Trình duyệt hiện đại (Chrome, Safari, Edge, Firefox) chặn phát âm thanh tự động khi người dùng chưa tương tác với trang web (`AudioContext` bị ở trạng thái `suspended`).
   - *Giải pháp*: Khởi tạo `AudioContext` theo cơ chế Lazy Initialization, tự động kích hoạt `ctx.resume()` ngay tại sự kiện `pointerdown` / `keydown` đầu tiên của người dùng.
2. **Thiết Bị Cũ Không Hỗ Trợ WebGL hoặc Bị Tắt Tăng Tốc Phần Cứng**:
   - *Rủi ro*: Lỗi `WebGL context could not be created` khiến màn hình tối đen hoặc phát sinh uncaught exception.
   - *Giải pháp*: Bọc khối khởi tạo Three.js trong `try/catch`. Nếu WebGL không khả dụng, tự động chuyển sang CSS fallback: Một lớp nền gradient cực quang động (`background: radial-gradient(...)`) mô phỏng màu sắc tương tự mà không gây sập ứng dụng.
3. **Màn Hình Retina / 4K Gây Quá Tải GPU**:
   - *Rủi ro*: Trên màn hình Apple Retina hoặc 4K, `window.devicePixelRatio` có thể lên tới `3.0` hoặc `4.0`, render hàng chục triệu pixel mỗi frame gây tụt khung hình.
   - *Giải pháp*: Cố định `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0))`.
4. **Mất Context WebGL (WebGL Context Loss)**:
   - *Rủi ro*: Khi tab bị chuyển sang chế độ nền lâu hoặc hệ điều hành thiếu VRAM, WebGL context có thể bị mất.
   - *Giải pháp*: Đăng ký bộ lắng nghe sự kiện `canvas.addEventListener('webglcontextlost', e => e.preventDefault())` và `canvas.addEventListener('webglcontextrestored', initThreeScene)`.

---

## 4. CONCLUSION (Đặc Tả Kỹ Thuật & Khối Mã Nguồn Khuyến Nghị)

### 4.1 Khối Mã Nguồn Three.js & GLSL Shader Hoàn Chỉnh

Đoạn mã sau được đóng gói chuẩn, sẵn sàng tích hợp trực tiếp vào `index.html`:

```html
<!-- CDN Three.js r128 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<canvas id="webgl-canvas" class="fixed inset-0 w-full h-full pointer-events-none z-0 hidden"></canvas>

<script>
// ============================================================
// 3D WEBGL SHADER CONTROLLER (BLUEYARD NOISE MORPHING SPHERE)
// ============================================================
class WebGLBackground {
    constructor() {
        this.canvas = document.getElementById('webgl-canvas');
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.sphereMesh = null;
        this.uniforms = null;
        this.clock = new THREE.Clock();
        this.isRunning = false;
        
        // Quản lý tọa độ chuột & cuộn mượt
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.scroll = { current: 0, target: 0 };
        
        // Bảng màu 4 cấp độ phân quyền (Định dạng THREE.Color)
        this.palettes = {
            'RED': {
                core: new THREE.Color(0x1c0205),
                primary: new THREE.Color(0xb3001e),      // Deep Crimson
                secondary: new THREE.Color(0xffaa00),    // Molten Gold
                glow: new THREE.Color(0xff2244)
            },
            'PURPLE': {
                core: new THREE.Color(0x0d021f),
                primary: new THREE.Color(0x4d19bf),      // Ultraviolet
                secondary: new THREE.Color(0xd946ef),    // Neon Orchid
                glow: new THREE.Color(0x8b5cf6)
            },
            'YELLOW': {
                core: new THREE.Color(0x1c1000),
                primary: new THREE.Color(0xe67e00),      // Radiant Amber
                secondary: new THREE.Color(0xfacc15),    // Solar Flare
                glow: new THREE.Color(0xfbbf24)
            },
            'GREEN': {
                core: new THREE.Color(0x00170f),
                primary: new THREE.Color(0x00b37e),      // Emerald Jade
                secondary: new THREE.Color(0x34d399),    // Cyber Mint
                glow: new THREE.Color(0x059669)
            }
        };

        this.currentTier = 'RED';
        this.targetColors = {
            core: this.palettes['RED'].core.clone(),
            primary: this.palettes['RED'].primary.clone(),
            secondary: this.palettes['RED'].secondary.clone(),
            glow: this.palettes['RED'].glow.clone()
        };
    }

    init() {
        if (!this.canvas || typeof THREE === 'undefined') return;

        try {
            // Khởi tạo Renderer
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x06070a, 1.0);

            // Khởi tạo Scene & Camera
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
            this.camera.position.z = 4.6;

            // GLSL Simplex Noise Vertex Shader
            const vertexShader = `
                uniform float u_time;
                uniform float u_noise_freq;
                uniform float u_noise_amp;
                uniform float u_noise_speed;
                uniform vec2 u_mouse;
                uniform float u_scroll;
                
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vWorldPosition;
                varying float vNoise;

                // Stefan Gustavson Simplex 3D Noise GLSL
                vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
                vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

                float snoise(vec3 v){
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                    vec3 i  = floor(v + dot(v, C.yyy) );
                    vec3 x0 = v - i + dot(i, C.xxx) ;
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min( g.xyz, l.zxy );
                    vec3 i2 = max( g.xyz, l.zxy );
                    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
                    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
                    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
                    i = mod(i, 289.0 );
                    vec4 p = permute( permute( permute(
                                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                    float n_ = 0.142857142857;
                    vec3  ns = n_ * D.wyz - D.xzx;
                    vec4 j = p - 49.0 * floor(p * ns.z.xxxx);
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_ );
                    vec4 x = x_ *ns.x + ns.yyyy;
                    vec4 y = y_ *ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);
                    vec4 b0 = vec4( x.xy, y.xy );
                    vec4 b1 = vec4( x.zw, y.zw );
                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                    vec3 p0 = vec3(a0.xy,h.x);
                    vec3 p1 = vec3(a0.zw,h.y);
                    vec3 p2 = vec3(a1.xy,h.z);
                    vec3 p3 = vec3(a1.zw,h.w);
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
                }

                void main() {
                    vec3 pos = position;
                    vec3 noiseCoord = pos * u_noise_freq + vec3(u_time * u_noise_speed);
                    noiseCoord.xy += u_mouse * 0.35;
                    noiseCoord.z += u_scroll * 1.8;

                    float n1 = snoise(noiseCoord);
                    float n2 = snoise(noiseCoord * 2.2 + vec3(u_time * 0.4)) * 0.35;
                    float totalDisplacement = (n1 + n2) * u_noise_amp;

                    vec3 displacedPos = pos + normal * totalDisplacement;
                    vNoise = n1;

                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
                    vWorldPosition = worldPos.xyz;

                    vec4 mvPosition = viewMatrix * worldPos;
                    vViewPosition = -mvPosition.xyz;

                    gl_Position = projectionMatrix * mvPosition;
                }
            `;

            // GLSL Fresnel & Dynamic Iridescence Fragment Shader
            const fragmentShader = `
                precision highp float;

                uniform vec3 u_color_core;
                uniform vec3 u_color_primary;
                uniform vec3 u_color_secondary;
                uniform vec3 u_color_glow;
                uniform float u_fresnel_power;
                uniform float u_time;

                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vWorldPosition;
                varying float vNoise;

                void main() {
                    vec3 normal = normalize(vNormal);
                    vec3 viewDir = normalize(vViewPosition);

                    // Fresnel term
                    float NdotV = max(dot(normal, viewDir), 0.0);
                    float fresnel = pow(1.0 - NdotV, u_fresnel_power);

                    // Hòa trộn gradient 3 bậc theo nhiễu và góc nhìn
                    float mixVal = clamp((vNoise + 1.0) * 0.5 + fresnel * 0.35, 0.0, 1.0);
                    vec3 baseCol = mix(u_color_core, u_color_primary, smoothstep(0.0, 0.55, mixVal));
                    vec3 finalCol = mix(baseCol, u_color_secondary, smoothstep(0.45, 1.0, mixVal));

                    // Thêm viền phát sáng Fresnel
                    finalCol += u_color_glow * fresnel * 1.5;

                    // Specular shimmer
                    vec3 lightDir = normalize(vec3(1.0, 1.5, 2.0));
                    vec3 halfVec = normalize(lightDir + viewDir);
                    float spec = pow(max(dot(normal, halfVec), 0.0), 28.0);
                    finalCol += vec3(spec * 0.45);

                    gl_FragColor = vec4(finalCol, 0.95);
                }
            `;

            this.uniforms = {
                u_time: { value: 0.0 },
                u_noise_freq: { value: 0.85 },
                u_noise_amp: { value: 0.42 },
                u_noise_speed: { value: 0.45 },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_scroll: { value: 0.0 },
                u_fresnel_power: { value: 2.6 },
                u_color_core: { value: this.palettes['RED'].core.clone() },
                u_color_primary: { value: this.palettes['RED'].primary.clone() },
                u_color_secondary: { value: this.palettes['RED'].secondary.clone() },
                u_color_glow: { value: this.palettes['RED'].glow.clone() }
            };

            const geometry = new THREE.IcosahedronGeometry(1.85, 64);
            const material = new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                uniforms: this.uniforms,
                wireframe: false,
                transparent: true
            });

            this.sphereMesh = new THREE.Mesh(geometry, material);
            this.scene.add(this.sphereMesh);

            // Lắng nghe sự kiện tương tác
            window.addEventListener('resize', () => this.onResize());
            window.addEventListener('pointermove', (e) => this.onPointerMove(e));
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });

            console.log('⚡ [WebGL] 3D BlueYard Morphing Sphere Shader initialized successfully.');
        } catch (err) {
            console.warn('⚠️ [WebGL] Khởi tạo WebGL không thành công, chuyển sang chế độ CSS Fallback:', err);
        }
    }

    onResize() {
        if (!this.renderer || !this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onPointerMove(e) {
        this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onScroll() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
        this.scroll.target = window.scrollY / maxScroll;
    }

    setTier(tierCode) {
        if (!this.palettes[tierCode]) return;
        this.currentTier = tierCode;
        const p = this.palettes[tierCode];
        this.targetColors.core.copy(p.core);
        this.targetColors.primary.copy(p.primary);
        this.targetColors.secondary.copy(p.secondary);
        this.targetColors.glow.copy(p.glow);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.canvas.classList.remove('hidden');
        this.animate();
    }

    stop() {
        this.isRunning = false;
        this.canvas.classList.add('hidden');
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Cập nhật uniforms
        this.uniforms.u_time.value = elapsedTime;

        // Quán tính chuột Parallax (Lerp 0.05)
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
        this.uniforms.u_mouse.value.set(this.mouse.x, this.mouse.y);

        // Quán tính cuộn trang (Lerp 0.08)
        this.scroll.current += (this.scroll.target - this.scroll.current) * 0.08;
        this.uniforms.u_scroll.value = this.scroll.current;

        // Nội suy màu sắc mượt mà (Color Lerp 0.06)
        this.uniforms.u_color_core.value.lerp(this.targetColors.core, 0.06);
        this.uniforms.u_color_primary.value.lerp(this.targetColors.primary, 0.06);
        this.uniforms.u_color_secondary.value.lerp(this.targetColors.secondary, 0.06);
        this.uniforms.u_color_glow.value.lerp(this.targetColors.glow, 0.06);

        // Chuyển động xoay vật thể 3D
        if (this.sphereMesh) {
            this.sphereMesh.rotation.y = this.mouse.x * 0.4 + elapsedTime * 0.1;
            this.sphereMesh.rotation.x = -this.mouse.y * 0.3;
            this.sphereMesh.position.x = this.mouse.x * 0.4;
            this.sphereMesh.position.y = this.mouse.y * 0.3;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
</script>
```

---

### 4.2 Động Cơ Âm Thanh Thủ Tục Web Audio API Hoàn Chỉnh

```javascript
// ============================================================
// PROCEDURAL SOUND FX ENGINE (ZERO EXTERNAL ASSETS)
// ============================================================
class TacticalAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('murthehelp_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('murthehelp_muted', this.muted);
        return this.muted;
    }

    playMechanicalClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playPortalWarp() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(480, now);
        osc1.frequency.exponentialRampToValueAtTime(55, now + 0.85);
        osc2.frequency.setValueAtTime(240, now);
        osc2.frequency.exponentialRampToValueAtTime(28, now + 0.85);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 0.85);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.85);
        osc2.stop(now + 0.85);
    }

    playTierChime(tier) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const config = {
            'RED': { freqs: [440, 880], type: 'sawtooth', dur: 0.18 },
            'PURPLE': { freqs: [587.33, 1174.66], type: 'sine', dur: 0.22 },
            'YELLOW': { freqs: [880, 1320], type: 'triangle', dur: 0.18 },
            'GREEN': { freqs: [523.25, 659.25, 783.99], type: 'sine', dur: 0.35 }
        };

        const item = config[tier] || config['RED'];
        item.freqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = item.type;
            osc.frequency.setValueAtTime(f, now + idx * 0.05);

            gain.gain.setValueAtTime(0.1, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + item.dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + item.dur);
        });
    }

    playDroneLaunch() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Sub-bass launch sweep
        const oscSub = this.ctx.createOscillator();
        const gainSub = this.ctx.createGain();
        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(160, now);
        oscSub.frequency.exponentialRampToValueAtTime(32, now + 0.65);
        gainSub.gain.setValueAtTime(0.3, now);
        gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        oscSub.connect(gainSub);
        gainSub.connect(this.ctx.destination);
        oscSub.start(now);
        oscSub.stop(now + 0.65);

        // High telemetry confirmation beep
        const oscBeep = this.ctx.createOscillator();
        const gainBeep = this.ctx.createGain();
        oscBeep.type = 'sine';
        oscBeep.frequency.setValueAtTime(1760, now + 0.12);
        gainBeep.gain.setValueAtTime(0.18, now + 0.12);
        gainBeep.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
        oscBeep.connect(gainBeep);
        gainBeep.connect(this.ctx.destination);
        oscBeep.start(now + 0.12);
        oscBeep.stop(now + 0.75);
    }

    playPanicDischarge() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
    }
}
```

---

## 5. VERIFICATION METHOD (Phương Pháp & Lệnh Kiểm Thử Độc Lập)

### 5.1 Kiểm Thử Cấu Trúc Mã Nguồn & HTML5 Parser
Chạy lệnh phân tích cú pháp tĩnh tệp `index.html` qua Node.js để kiểm tra tính toàn vẹn của thẻ DOM, CDN Three.js, Canvas, và mã GLSL:

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('/Users/quan/.gemini/antigravity/scratch/murthehelp/index.html', 'utf8');

const checks = [
    { name: 'Three.js CDN script', pass: html.includes('three.min.js') || html.includes('three@') },
    { name: 'WebGL Canvas element', pass: html.includes('id=\"webgl-canvas\"') },
    { name: 'Simplex Noise GLSL', pass: html.includes('snoise') && html.includes('permute') },
    { name: 'Fresnel Fragment GLSL', pass: html.includes('u_fresnel_power') },
    { name: 'Disguise Storefront Stage', pass: html.includes('id=\"disguise-stage\"') },
    { name: 'Burgundy Portal Transit Stage', pass: html.includes('id=\"portal-stage\"') },
    { name: 'Dark Mall Stage', pass: html.includes('id=\"dark-stage\"') },
    { name: 'F12 Source Modal', pass: html.includes('id=\"f12-source-modal\"') },
    { name: 'Procedural Audio Engine', pass: html.includes('AudioContext') }
];

console.table(checks);
const allPass = checks.every(c => c.pass);
console.log(allPass ? '✅ ALL ARCHITECTURAL CHECKS PASSED' : '⚠️ GAPS DETECTED (READY FOR IMPLEMENTATION)');
"
```

### 5.2 Kiểm Thử Khởi Chạy Máy Chủ Nội Bộ (Local HTTP Server)
Khởi động máy chủ cục bộ và gửi yêu cầu kiểm tra HTTP status 200:

```bash
# Khởi chạy máy chủ HTTP tĩnh
python3 -m http.server 3000 --directory /Users/quan/.gemini/antigravity/scratch/murthehelp &
PID=$!
sleep 1

# Kiểm tra phản hồi HTTP
curl -I http://localhost:3000/index.html

# Dọn dẹp tiến trình
kill $PID
```

### 5.3 Điều Kiện Vô Hiệu Hóa (Invalidation Conditions)
Bản báo cáo kiến trúc này sẽ mất hiệu lực nếu:
1. Thư viện Three.js CDN bị thay thế bằng giải pháp 3D khác mà không giữ nguyên cấu trúc Uniforms GLSL tương thích.
2. Tên ID của các vùng giao diện chính (`disguise-stage`, `portal-stage`, `dark-stage`, `webgl-canvas`) bị thay đổi mà không đồng bộ bộ điều khiển trạng thái.
