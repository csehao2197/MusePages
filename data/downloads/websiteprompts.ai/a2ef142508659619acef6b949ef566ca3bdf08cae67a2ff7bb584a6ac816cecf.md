# Gleam Auto Spa — Car Wash Website Prompt
### websiteprompts.ai — Production-Ready for Lovable, Bolt, v0, Claude, Cursor

---

## 1. GOAL STATEMENT

Build a full-featured premium car wash and auto detailing website for **Gleam Auto Spa** — a clean, precise, high-conversion single-page site in deep navy and electric cyan that communicates professional quality, drives online bookings, and upsells service packages.

---

## 2. TECH STACK

- **React 18 + Vite 5 + TypeScript**
- **Tailwind CSS v3** (JIT mode)
- **Framer Motion** — import exclusively from `motion/react`
- **shadcn/ui** — Card, Badge, Button components
- **lucide-react** — icons (Check, ChevronRight, MapPin, Clock, Star, Phone, Droplets, Car, Zap, Shield)
- **Google Fonts** — Space Grotesk + Inter

---

## 3. DESIGN SYSTEM

Add this to your global CSS (`index.css` or `globals.css`):

```css
:root {
  /* Core palette */
  --color-navy:          8 24 40;       /* #081828 — deep background */
  --color-navy-mid:      12 34 56;      /* #0c2238 — card backgrounds */
  --color-navy-lift:     16 44 72;      /* #102c48 — elevated surfaces */
  --color-navy-light:    20 56 90;      /* #14385a — borders/dividers */
  --color-cyan:          0 180 204;     /* #00b4cc — primary accent */
  --color-cyan-bright:   0 210 240;     /* #00d2f0 — hover states */
  --color-cyan-pale:     0 180 204;     /* same, used at low opacity */
  --color-white:         240 248 255;   /* #f0f8ff — primary text */
  --color-white-muted:   180 210 230;   /* #b4d2e6 — secondary text */
  --color-white-faint:   100 140 170;   /* #648caa — muted text */

  /* Semantic tokens */
  --bg-page:             rgb(var(--color-navy));
  --bg-card:             rgb(var(--color-navy-mid));
  --bg-card-hover:       rgb(var(--color-navy-lift));
  --text-primary:        rgb(var(--color-white));
  --text-secondary:      rgb(var(--color-white-muted));
  --text-muted:          rgb(var(--color-white-faint));
  --accent:              rgb(var(--color-cyan));
  --accent-hover:        rgb(var(--color-cyan-bright));
  --border-subtle:       rgba(var(--color-cyan) / 0.12);
  --border-cyan:         rgba(var(--color-cyan) / 0.5);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-page);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}
```

---

## 4. TYPOGRAPHY

**Google Fonts import** — place in `<head>` or via `@import` at top of CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```

**Usage rules:**

| Element | Font | Weight | Size |
|---|---|---|---|
| All `<h1>` | Space Grotesk | 800 | clamp(52px, 8vw, 140px) |
| All `<h2>` | Space Grotesk | 800 | clamp(36px, 4.5vw, 72px) |
| `<h3>` section subtitles | Space Grotesk | 700 | clamp(24px, 2.5vw, 40px) |
| Body copy | Inter | 300 | 17px / 1.7 line-height |
| Labels, tags, nav | Inter | 500 | 12–13px tracking-[0.08em] uppercase |
| Prices | Space Grotesk | 800 | inherit size |
| Stats numbers | Space Grotesk | 800 | clamp(56px, 8vw, 100px) |
| Step numbers (bg) | Inter | 800 | 80px |
| Watermark | Space Grotesk | 800 | clamp(200px, 30vw, 460px) |

---

## 5. VISUAL EFFECTS

### Effect 1 — Animated CSS Water Droplet (Signature Hero Element)

A single animated water droplet falls from top to bottom of the hero content area, then splits into three smaller droplets that fan outward and fade. Pure CSS `@keyframes` — no JS. Runs on a 4-second interval loop.

```css
/* Add to global CSS */

@keyframes droplet-fall {
  0%   { transform: translateY(0) scale(1);   opacity: 0; }
  5%   { opacity: 0.8; }
  80%  { transform: translateY(280px) scale(1); opacity: 0.8; }
  100% { transform: translateY(300px) scale(1); opacity: 0; }
}

@keyframes droplet-split-left {
  0%   { transform: translate(0, 0) scale(1);        opacity: 0; }
  10%  { opacity: 0.6; }
  100% { transform: translate(-28px, 30px) scale(0.5); opacity: 0; }
}

@keyframes droplet-split-center {
  0%   { transform: translate(0, 0) scale(1);       opacity: 0; }
  10%  { opacity: 0.6; }
  100% { transform: translate(0, 42px) scale(0.4);  opacity: 0; }
}

@keyframes droplet-split-right {
  0%   { transform: translate(0, 0) scale(1);        opacity: 0; }
  10%  { opacity: 0.6; }
  100% { transform: translate(28px, 30px) scale(0.5); opacity: 0; }
}

.droplet-container {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  pointer-events: none;
  animation: droplet-fall 4s ease-in infinite;
}

.droplet-main {
  width: 14px;
  height: 18px;
  background: rgb(0, 180, 204);
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  margin: 0 auto;
  opacity: 0.7;
}

.droplet-split-group {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  animation: none;
}

/* Trigger split group at 80% of 4s = 3.2s */
.droplet-container:nth-child(1) .droplet-split-group {
  animation: droplet-split-center 0.8s ease-out 3.2s infinite;
}
```

Full implementation in TSX:

```tsx
// components/WaterDroplet.tsx
export function WaterDroplet() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="droplet-container">
        <div className="droplet-main" />
      </div>
      {/* Split droplets — absolutely positioned at impact point */}
      <div className="absolute pointer-events-none"
           style={{ top: "calc(60px + 300px)", left: "50%", transform: "translateX(-50%)" }}>
        <div style={{
          position: "absolute",
          width: "8px", height: "10px",
          background: "rgb(0,180,204)",
          borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
          animation: "droplet-split-left 0.7s ease-out 3.18s infinite",
          opacity: 0,
        }} />
        <div style={{
          position: "absolute",
          width: "8px", height: "10px",
          background: "rgb(0,180,204)",
          borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
          animation: "droplet-split-center 0.7s ease-out 3.18s infinite",
          opacity: 0,
        }} />
        <div style={{
          position: "absolute",
          width: "8px", height: "10px",
          background: "rgb(0,180,204)",
          borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
          animation: "droplet-split-right 0.7s ease-out 3.18s infinite",
          opacity: 0,
        }} />
      </div>
    </div>
  );
}
```

### Effect 2 — Background Watermark Text

Render "GLEAM" in Space Grotesk 800 at `clamp(200px, 30vw, 460px)`, cyan at 2.5% opacity, right side of the hero, partially off-screen.

```tsx
<span
  aria-hidden="true"
  className="absolute top-1/2 right-0 -translate-y-1/2 select-none pointer-events-none font-space font-extrabold leading-none"
  style={{
    fontSize: "clamp(200px, 30vw, 460px)",
    color: "rgba(0, 180, 204, 0.025)",
    transform: "translateY(-50%) translateX(18%)",
    lineHeight: 0.9,
  }}
>
  GLEAM
</span>
```

### Effect 3 — Faded Step Numbers Behind How It Works

Large Inter 800 numerals ("01", "02", "03") at 80px, cyan at 6% opacity, rendered absolutely behind each step card:

```tsx
<div className="relative">
  <span
    aria-hidden="true"
    className="absolute -top-6 -left-4 font-inter font-extrabold leading-none select-none pointer-events-none"
    style={{ fontSize: "80px", color: "rgba(0,180,204,0.06)", zIndex: 0 }}
  >
    {String(index + 1).padStart(2, "0")}
  </span>
  <div className="relative z-10">{/* step content */}</div>
</div>
```

### Effect 4 — Pulsing Cyan Dot (Wait Time Card)

A continuously pulsing cyan dot indicating live status, using Framer Motion:

```tsx
<motion.span
  className="inline-block rounded-full"
  style={{ width: "8px", height: "8px", background: "rgb(0,180,204)" }}
  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
/>
```

### Effect 5 — Staggered Scale Entry for Service Cards

Service package cards animate from scale 0.95 + opacity 0 → scale 1 + opacity 1 using Framer Motion stagger:

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};
const cardVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};
```

### Effect 6 — Count-Up Stats on Scroll (Cyan Background)

Same `useCountUp` hook as standard — triggers once via `useInView`, easeOutCubic over 1600ms, staggered 150ms per stat. Applied to the Trust Stats strip with cyan background.

```tsx
function useCountUp(target: number, duration = 1600, delay = 0): number {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}
```

---

## 6. COMPONENT BREAKDOWN

---

### SECTION 1 — NAVBAR

**Layout:** Fixed top, `backdrop-blur-md`, background `rgba(8,24,40,0.88)`, border-bottom `rgba(0,180,204,0.12)`. Height: 72px desktop / 64px mobile. z-50.

**Desktop structure (left → right):**
```
[Logo]   [flex-1]   [Nav links × 4]   [gap-8]   [CTA Button]
```

**Logo:** "GLEAM" in Space Grotesk 800, 24px, cyan. Followed by "AUTO SPA" in Inter 300, 14px, `var(--text-secondary)`, ml-1.5 aligned to baseline. Or render as one unit: `GLEAM AUTO SPA` with "GLEAM" in cyan and the rest in white-muted.

**Nav links** (Inter 500, 13px, tracking-[0.07em], uppercase, white-muted, hover → cyan, transition 200ms):
- Services
- How It Works
- Before & After
- Membership

**CTA Button:** "Book Now" — background cyan `rgb(0,180,204)`, text navy `rgb(8,24,40)`, Space Grotesk 700, 13px uppercase tracking-[0.07em], px-6 py-2.5, border-radius 0 (sharp), hover: `rgb(0,210,240)`, transition 200ms. Add lucide `ChevronRight` icon (size-4) inline after text.

**Mobile:** Hamburger (lucide `Menu`, 22px, white). Drawer from right, full-height, navy background, links stacked, py-5 each.

---

### SECTION 2 — HERO

**Container:** `relative min-h-screen overflow-hidden flex flex-col justify-center px-6 md:px-20`

**Background image:**
```jsx
{/* Image: Aerial overhead view of a luxury car being washed — deep navy vehicle with water cascading across the roof and bonnet, white soap suds creating abstract patterns on dark paint, high-contrast, studio-quality automotive photography, blue and white tones, precision and premium feel */}
<img
  src=""
  alt="Premium car wash at Gleam Auto Spa"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>
```

**Gradient overlay:**
```tsx
{/* Left-to-right dark overlay keeping right side more visible */}
<div
  className="absolute inset-0 z-[1]"
  style={{ background: "linear-gradient(105deg, rgba(8,24,40,0.92) 0%, rgba(8,24,40,0.7) 45%, rgba(8,24,40,0.3) 100%)" }}
/>
{/* Bottom fade for any text overflow */}
<div
  className="absolute bottom-0 left-0 right-0 h-32 z-[1]"
  style={{ background: "linear-gradient(to top, rgb(8,24,40), transparent)" }}
/>
```

**Water droplet animation (z-[2]):** `<WaterDroplet />` — positioned over the left content area.

**Content block (relative z-10, max-w-3xl):**
```
<p style={{ fontFamily: "Inter", fontWeight: 500, fontSize: "13px", letterSpacing: "0.08em", color: "rgb(0,180,204)", textTransform: "uppercase", marginBottom: "20px" }}>
  Premium Auto Care · Marlow, Berkshire
</p>
<h1 style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "clamp(52px,8vw,140px)", color: "rgb(240,248,255)", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
  YOUR CAR DESERVES BETTER.
</h1>
<p style={{ fontFamily: "Inter", fontWeight: 300, fontSize: "18px", lineHeight: "1.7", color: "rgb(180,210,230)", marginTop: "28px", maxWidth: "460px" }}>
  Professional car washing and detailing services with industry-leading products, zero shortcuts, and a guarantee you'll love the result.
</p>
[Button row, mt-10, flex gap-4 flex-wrap]:
  Button 1: "Book a Wash" — cyan bg, navy text, Space Grotesk 700, 14px uppercase, px-8 py-3.5, rounded-none
  Button 2: "View Packages" — transparent, border 1px solid rgba(0,180,204,0.5), cyan text, same sizing, hover border-cyan
```

**Floating "CURRENT WAIT TIME" card (absolute bottom-8 right-6 md:right-10, z-20):**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9, y: 16 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.55, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
  style={{
    background: "rgba(8,24,40,0.80)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(0,180,204,0.25)",
    padding: "20px 24px",
    minWidth: "200px",
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
    {/* Pulsing cyan dot */}
    <motion.span
      style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgb(0,180,204)", display: "inline-block" }}
      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "rgb(0,180,204)", textTransform: "uppercase" }}>
      Current Wait Time
    </span>
  </div>
  <p style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "36px", color: "rgb(240,248,255)", lineHeight: 1, marginBottom: "12px" }}>
    ~8 <span style={{ fontSize: "16px", fontWeight: 400, fontFamily: "Inter", color: "rgb(180,210,230)" }}>minutes</span>
  </p>
  <a href="#book" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: "13px", color: "rgb(0,180,204)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
    Book ahead → 
  </a>
</motion.div>
```

**Watermark:** "GLEAM" — `absolute top-1/2 right-0`, -translateY-1/2, Space Grotesk 800, `clamp(200px,30vw,460px)`, `rgba(0,180,204,0.025)`, `translateX(18%)`, z-[1], pointer-events-none select-none.

---

### SECTION 3 — SERVICE PACKAGES

**Layout:** Background `var(--bg-page)` (navy), py-24, px-6 md:px-20.

**Section header (centered, mb-16):**
```
Label: "CHOOSE YOUR SERVICE" — Inter 500 11px cyan uppercase tracking-[0.08em] mb-4
H2: "Three Ways to Shine." — Space Grotesk 800 clamp(36px,4.5vw,72px) white
Subline: "From a quick refresh to a full showroom finish — every wash uses professional-grade products." — Inter 300 17px white-muted mt-4 max-w-xl mx-auto text-center
```

**3 cards in `grid grid-cols-1 md:grid-cols-3 gap-0` — no gap, cards share borders:**

Apply Framer Motion `variants` for stagger entry (scale 0.95→1, opacity 0→1, y 20→0, 500ms, stagger 120ms).

**Card base styling:**
```
background: rgb(12,34,56)    [navy-mid]
border: 1px solid rgba(0,180,204,0.1)
border-radius: 0  [sharp corners]
padding: p-8 md:p-10
position: relative
overflow: hidden
on hover: border-color rgba(0,180,204,0.5), transition 300ms
```

**Card — EXPRESS:**
```
Top chip: "MOST POPULAR" — hidden on this card
Price row: "£12" in Space Grotesk 800, clamp(48px,5vw,72px), cyan + "/wash" Inter 300 16px white-muted self-end mb-1
Name: "Express Wash" — Space Grotesk 700, 22px, white, mt-0
Tagline: "Clean, fast, done." — Inter 300, 14px, white-muted, mt-2 mb-6
Divider: 1px rgba(0,180,204,0.15) horizontal line
Features list (mt-6, flex flex-col gap-3):
  ✓ Exterior hand wash
  ✓ Wheel clean & rinse
  ✓ Window wipe
  ✓ Air dry
  [Check icon: lucide Check, size-4, cyan, mr-3]
  [Feature text: Inter 300, 14px, white-muted]
CTA button (mt-8): "Book Express" — border 1px solid rgba(0,180,204,0.4), cyan text, Inter 500 13px uppercase tracking-[0.07em], px-6 py-3, rounded-none, w-full, hover: bg-cyan text-navy
```

**Card — SIGNATURE (featured, middle):**
```
Top chip (absolute top-4 right-4): "MOST POPULAR" — cyan bg, navy text, Inter 500 10px uppercase tracking-[0.07em], px-3 py-1, rounded-none
Background: rgb(16,44,72) [navy-lift, slightly elevated]
Border: 1px solid rgba(0,180,204,0.35)
Price: "£22" same styling as above
Name: "Signature Wash" — Space Grotesk 700, 22px, white
Tagline: "Our full exterior service." — Inter 300, 14px, white-muted, mt-2 mb-6
Features list:
  ✓ Full exterior hand wash
  ✓ Wheel & tyre clean
  ✓ Glass clean inside & out
  ✓ Door sill wipe
  ✓ Tyre dressing
  ✓ Hand dry with microfibre
CTA button: "Book Signature" — solid cyan bg, navy text, hover bg-cyan-bright, w-full
```

**Card — FULL DETAIL:**
```
Price: "£45" same styling
Name: "Full Detail" — Space Grotesk 700, 22px, white
Tagline: "Showroom finish, guaranteed." — Inter 300, 14px, white-muted
Features list:
  ✓ Everything in Signature
  ✓ Full interior vacuum
  ✓ Leather / fabric wipe
  ✓ Dashboard & console clean
  ✓ Air freshener
  ✓ Wax & paint sealant
  ✓ Ceramic coat option (+£35)
CTA button: "Book Detail" — border style, same as Express
```

---

### SECTION 4 — HOW IT WORKS

**Layout:** Background `rgb(12,34,56)` (navy-mid), py-24, px-6 md:px-20.

**Section header (centered, mb-20):**
```
Label: "THE PROCESS" — Inter 500 11px cyan uppercase tracking-[0.08em] mb-4
H2: "Simple. Fast. Spotless." — Space Grotesk 800 clamp(36px,4.5vw,64px) white
```

**3 steps in `grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6`:**

Each step — `relative`:
```
Background faded number (absolute -top-6 -left-4, z-0):
  "01" / "02" / "03" — Inter 800, 80px, rgba(0,180,204,0.06), pointer-events-none
Step content (relative z-10):
  Icon circle: 52px × 52px, border 1px solid rgba(0,180,204,0.3), rounded-none, flex items-center justify-center mb-6
    lucide icon (size-6, cyan stroke, strokeWidth 1.5)
  Step label: Inter 500, 11px, cyan, uppercase, tracking-[0.08em], mb-3
    "STEP 01" / "STEP 02" / "STEP 03"
  Heading: Space Grotesk 700, 22px, white, mb-4
  Body: Inter 300, 15px, white-muted, leading-[1.75]
```

**Step 1:** Icon: `Car` (lucide). Heading: "Drive In." Body: "Pull straight into one of our 12 bays — no appointment needed for Express or Signature washes. Just show up."

**Step 2:** Icon: `Droplets` (lucide). Heading: "We Get to Work." Body: "Our trained team gets started immediately with pH-neutral shampoos, microfibre mitts, and professional tools. No brushes, no scratches."

**Step 3:** Icon: `Zap` (lucide). Heading: "Drive Away Clean." Body: "Pick up your keys and go. Express washes take 12 minutes. Full Details are typically ready in 90 minutes."

Entry animation per step: opacity 0→1, y 30→0, 600ms, stagger 150ms, easeOut, triggered once on scroll inView.

---

### SECTION 5 — BEFORE / AFTER

**Layout:** Background `var(--bg-page)` (navy), py-24, px-6 md:px-20.

**Section header (centered, mb-16):**
```
Label: "THE DIFFERENCE" — Inter 500 11px cyan uppercase tracking-[0.08em] mb-4
H2: "See It for Yourself." — Space Grotesk 800 clamp(36px,4.5vw,64px) white
```

**Two-column comparison block:** `grid grid-cols-2 gap-0 relative max-w-4xl mx-auto` — the two panels sit side by side. A vertical cyan line (1px, full height of the grid, absolute center) separates them.

```tsx
<div className="relative max-w-4xl mx-auto grid grid-cols-2">
  {/* Vertical divider */}
  <div
    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-10"
    style={{ width: "1px", background: "rgb(0,180,204)" }}
  />

  {/* BEFORE panel */}
  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
    {/* Image: Dusty unwashed car — grey sedan with visible road grime, dust, and mud splatter across panels and windows, flat overcast lighting, realistic and unsatisfying, documentary photography */}
    <img src="" alt="Car before professional wash at Gleam Auto Spa" className="w-full h-full object-cover object-center" />
    {/* Label chip */}
    <div className="absolute top-4 left-4 z-10" style={{ background: "rgba(8,24,40,0.85)", border: "1px solid rgba(255,255,255,0.15)", padding: "6px 14px" }}>
      <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "rgb(240,248,255)", textTransform: "uppercase" }}>BEFORE</span>
    </div>
  </div>

  {/* AFTER panel */}
  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
    {/* Image: Gleaming freshly-washed car — same grey sedan now spotless and reflective, droplets of water glistening on paint, bright clean studio lighting, high-contrast automotive photography, premium and satisfying */}
    <img src="" alt="Car after professional wash at Gleam Auto Spa" className="w-full h-full object-cover object-center" />
    {/* Cyan overlay tint to reinforce "clean" feeling */}
    <div className="absolute inset-0" style={{ background: "rgba(0,180,204,0.04)" }} />
    {/* Label chip */}
    <div className="absolute top-4 right-4 z-10" style={{ background: "rgb(0,180,204)", padding: "6px 14px" }}>
      <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "rgb(8,24,40)", textTransform: "uppercase" }}>AFTER</span>
    </div>
  </div>
</div>
```

**Below the comparison (mt-12, text-center):**
```
P: "Every car gets the same care whether it's a hatchback or a supercar. That's the Gleam guarantee." — Inter 300 16px white-muted max-w-lg mx-auto
CTA link: "Book Your Wash →" — Inter 500 14px cyan hover:underline
```

---

### SECTION 6 — TRUST STATS (CYAN BACKGROUND)

**Layout:** Full-width, background `rgb(0,180,204)` (cyan), py-20, px-6.

**4 stats in `flex flex-row justify-center flex-wrap gap-16 md:gap-24`:**

| Value | Label |
|---|---|
| 5,000 | "Cars Washed Monthly" |
| 99 | "% Satisfaction Rate" |
| 2018 | "Established" |
| 12 | "Professional Bays" |

**Per-stat:**
```tsx
<div className="text-center">
  <p
    className="font-space font-extrabold leading-none"
    style={{ fontSize: "clamp(56px,8vw,100px)", color: "rgb(8,24,40)", letterSpacing: "-0.02em" }}
  >
    {count}{suffix}
  </p>
  <p className="mt-3 font-inter font-medium text-xs uppercase tracking-[0.08em]"
     style={{ color: "rgba(8,24,40,0.65)" }}>
    {label}
  </p>
</div>
```

Suffixes: "5,000+" has the "+" appended; "99" has "%" appended; "2018" and "12" bare numbers.

Count-up: fires once on scroll inView, easeOutCubic 1600ms, stagger 0/150/300/450ms. For "2018" animate from 2000→2018 (not from 0). For "5,000" animate 0→5000 then display as "5,000+".

Mobile: 2×2 grid, gap-10, py-14.

---

### SECTION 7 — ADD-ONS

**Layout:** Background `rgb(12,34,56)` (navy-mid), py-20, px-6 md:px-20.

**Section header (left-aligned, mb-10):**
```
Label: "EXTRA SERVICES" — Inter 500 11px cyan uppercase tracking-[0.08em] mb-4
H2: "Upgrade Your Wash." — Space Grotesk 800 clamp(28px,3vw,52px) white
P: "Add any of these to any package at checkout or on arrival." — Inter 300 16px white-muted mt-3
```

**Horizontal scrolling chip row:** `overflow-x-auto flex gap-3 pb-3 scrollbar-hide mt-8`

Each chip:
```
background: rgb(16,44,72)
border: 1px solid rgba(0,180,204,0.2)
padding: px-5 py-3
border-radius: 0
on hover: border-color rgba(0,180,204,0.6), bg-navy-lift
flex-shrink: 0
```

Inside each chip:
```
[service name — Inter 500 14px white]
[price — Inter 500 14px cyan ml-3]
```

**Add-ons (7 chips):**
- Interior Vacuum · +£8
- Tyre Shine · +£6
- Air Freshener · +£3
- Ceramic Coat · +£35
- Wax Polish · +£15
- Leather Conditioning · +£20
- Engine Bay Clean · +£25

Mobile: chips scroll horizontally, no wrapping.

---

### SECTION 8 — MONTHLY MEMBERSHIP CTA

**Layout:** Full-width, background `var(--bg-page)` (navy), py-24, px-6 md:px-20. Max-w-4xl mx-auto.

**Content block (centered):**
```
Label: "UNLIMITED WASHES" — Inter 500 11px cyan uppercase tracking-[0.08em] mb-6
H2: "Wash More. Pay Less." — Space Grotesk 800 clamp(36px,5vw,80px) cyan
P: "Our monthly membership gives you unlimited Signature Washes for one fixed monthly fee. Cancel any time, no contracts." — Inter 300 17px white-muted mt-6 mb-12 max-w-2xl mx-auto text-center
```

**3 membership tiers in `grid grid-cols-1 md:grid-cols-3 gap-6 mt-12`:**

**BASIC — £19/mo:**
```
background: rgb(12,34,56), border 1px solid rgba(0,180,204,0.15), p-8, rounded-none
Name: "Basic" — Space Grotesk 700, 18px, white, mb-2
Price: "£19" — Space Grotesk 800, 48px, white + "/mo" Inter 300 16px white-muted
Features: Unlimited Express Washes · 10% off Add-Ons
CTA: "Start Basic" — border cyan, cyan text, w-full, px-6 py-3, rounded-none, hover bg-cyan text-navy
```

**SIGNATURE — £29/mo (featured):**
```
background: rgb(0,180,204), p-8, rounded-none
Name: "Signature" — Space Grotesk 700, 18px, navy, mb-2
"MOST VALUE" chip — navy bg, cyan text, 10px uppercase, px-3 py-1, absolute top-4 right-4
Price: "£29" — Space Grotesk 800, 48px, navy + "/mo" Inter 300 16px rgba(8,24,40,0.6)
Features (navy text): Unlimited Signature Washes · 15% off Add-Ons · Priority Queue
CTA: "Start Signature" — navy bg, white text, w-full, px-6 py-3, rounded-none, hover bg-navy-lift text-white
```

**DETAIL PASS — £49/mo:**
```
background: rgb(12,34,56), border 1px solid rgba(0,180,204,0.15), p-8
Name: "Detail Pass" — Space Grotesk 700, 18px, white
Price: "£49" — same as Basic
Features: 1× Full Detail/month · Unlimited Signature Washes · 20% off Add-Ons · Priority Queue · Free Air Freshener
CTA: "Start Detail Pass" — border cyan, cyan text, same as Basic CTA
```

**Below tiers (mt-10, text-center):**
```
"No contracts. Cancel any time. Membership begins the day you sign up." — Inter 300 14px white-muted
```

---

### SECTION 9 — FOOTER

**Layout:** 3-column grid `grid-cols-1 md:grid-cols-3 gap-12`, background `rgb(6,18,30)` (deeper navy), border-top `1px solid rgba(0,180,204,0.1)`, pt-14 pb-10, px-6 md:px-20.

**Column 1 — Brand:**
```
Logo: "GLEAM AUTO SPA" — Space Grotesk 800, 20px. "GLEAM" in cyan, "AUTO SPA" in white-muted
Tagline: "Premium car washing and detailing in Marlow, Berkshire. Professional products, guaranteed results." — Inter 300 14px white-muted mt-4 max-w-xs leading-relaxed
Social icons (mt-6, flex gap-4): Instagram, Facebook (lucide icons, size-5, white-muted, hover → cyan, transition 200ms)
```

**Column 2 — Location & Hours:**
```
Heading: "FIND US" — Inter 500 11px cyan uppercase tracking-[0.08em] mb-4
Address (Inter 300 14px white-muted leading-loose):
  Gleam Auto Spa
  River Road Business Park
  Marlow, SL7 1QT

Hours:
  Mon–Fri:  8:00am – 7:00pm
  Saturday: 8:00am – 6:00pm
  Sunday:   9:00am – 5:00pm

Note: "Last car accepted 30 minutes before close"
```

**Column 3 — Quick Links:**
```
Heading: "QUICK LINKS" — Inter 500 11px cyan uppercase tracking-[0.08em] mb-4
Links (flex flex-col gap-3, Inter 300 14px white-muted hover:white transition 200ms):
  Services / How It Works / Add-Ons / Memberships / Book Now / Gift Vouchers / Contact Us
```

**Footer bar (mt-12, pt-8, border-top rgba(0,180,204,0.06)):**
```
flex justify-between flex-wrap gap-4
Left: "© 2024 Gleam Auto Spa. All rights reserved." — 12px, color rgba(100,140,170,0.7)
Right: "Privacy Policy · Terms" — 12px, same color, hover white-muted
```

---

## 7. ANIMATIONS — COMPLETE SPECIFICATION

| Element | Initial | Final | Duration | Delay | Easing | Trigger |
|---|---|---|---|---|---|---|
| Navbar | opacity 0, y -12 | opacity 1, y 0 | 400ms | 0ms | easeOut | page load |
| Hero label | opacity 0, y 12 | opacity 1, y 0 | 500ms | 100ms | easeOut | page load |
| Hero h1 | opacity 0, y 40 | opacity 1, y 0 | 800ms | 250ms | [0.25,0.1,0.25,1] | page load |
| Hero subline | opacity 0, y 24 | opacity 1, y 0 | 650ms | 500ms | easeOut | page load |
| Hero buttons | opacity 0, y 16 | opacity 1, y 0 | 550ms | 700ms | easeOut | page load |
| Wait time card | opacity 0, scale 0.9, y 16 | opacity 1, scale 1, y 0 | 550ms | 400ms | spring [0.34,1.56,0.64,1] | page load |
| Pulsing dot | scale 1, opacity 1 | scale [1,1.6,1], opacity [1,0.4,1] | 1800ms | 0ms | easeInOut | infinite |
| Water droplet | translateY 0, opacity 0 | translateY 300px, opacity [0,0.8,0] | 4000ms | 0ms | ease-in | infinite |
| Droplet splits | at 3.2s mark | fan out + fade | 700ms | 3.18s | easeOut | triggered at 80% of fall |
| Section headings | opacity 0, y 28 | opacity 1, y 0 | 650ms | 0ms | [0.25,0.1,0.25,1] | scroll inView once |
| Service cards | opacity 0, scale 0.95, y 20 | opacity 1, scale 1, y 0 | 500ms | 120ms stagger | [0.25,0.1,0.25,1] | scroll inView |
| Service card hover | border rgba(0,180,204,0.1) | border rgba(0,180,204,0.5) | 300ms | — | easeOut | hover |
| How It Works steps | opacity 0, y 30 | opacity 1, y 0 | 600ms | 150ms stagger | easeOut | scroll inView |
| Before/After panels | opacity 0, x ±30 | opacity 1, x 0 | 700ms | 0/200ms | easeOut | scroll inView |
| Stats count-up | 0 | target | 1600ms | 0/150/300/450ms stagger | easeOutCubic | scroll inView once |
| Add-on chips | opacity 0, x 20 | opacity 1, x 0 | 400ms | 50ms stagger | easeOut | scroll inView |
| Membership cards | opacity 0, y 30 | opacity 1, y 0 | 600ms | 100ms stagger | easeOut | scroll inView |
| Nav links | color white-muted | color cyan | 200ms | — | easeOut | hover |
| CTA button | — | brightness +8% | 200ms | — | easeOut | hover |

---

## 8. RESPONSIVE DESIGN

### Desktop (≥1280px)
- Container: max-w-7xl mx-auto px-6 md:px-12 lg:px-20
- Hero: min-h-screen, content center-aligned with max-w-3xl
- Service Packages: 3-column grid, no gap
- How It Works: 3-column grid
- Before/After: 2-column side-by-side, max-w-4xl centered
- Trust Stats: 4-column flex row
- Membership: 3-column grid
- Footer: 3-column grid

### Tablet (768px–1279px)
- Service Packages: keep 3-column, reduce padding to p-6
- How It Works: keep 3-column
- Before/After: 2-column, reduce aspect-ratio to 3/2
- Trust Stats: 2×2 grid
- Membership: keep 3-column, reduce padding
- Footer: keep 3-column, reduce gap

### Mobile (<768px)
- Navbar: logo + hamburger, drawer from right
- Hero: min-h-screen; wait time card moves to bottom-left, full-width style; water droplet animation disabled (hide via `hidden md:block`)
- Service Packages: 1-column stack
- How It Works: 1-column stack, background numbers smaller (48px)
- Before/After: keep 2-column side-by-side, shorter aspect (1/1 square)
- Trust Stats: 2×2 grid, stat number clamp floor 48px, py-12
- Add-ons: horizontal scroll (scrollbar-hide)
- Membership: 1-column stack
- Footer: 1-column stack, gap-10

---

## 9. FULL COPY

### Brand & Core
- **Name:** Gleam Auto Spa
- **Tagline:** Your Car Deserves Better.
- **Location:** River Road Business Park, Marlow, SL7 1QT, Berkshire
- **Phone:** 01628 551 007
- **Email:** book@gleamautospa.co.uk

### Navigation
Services · How It Works · Before & After · Membership · Book Now

### Hero
- **Pre-headline:** Premium Auto Care · Marlow, Berkshire
- **H1:** YOUR CAR DESERVES BETTER.
- **Subline:** Professional car washing and detailing services with industry-leading products, zero shortcuts, and a guarantee you'll love the result.
- **CTA 1:** Book a Wash
- **CTA 2:** View Packages

### Wait Time Card
- Status label: CURRENT WAIT TIME (with pulsing dot)
- Value: ~8 minutes
- Link: Book ahead →

### Service Packages
- **Label:** CHOOSE YOUR SERVICE
- **H2:** Three Ways to Shine.
- **Subline:** From a quick refresh to a full showroom finish — every wash uses professional-grade products.
- **Express:** £12 · "Clean, fast, done." · Book Express
- **Signature:** £22 · "Our full exterior service." · Book Signature · MOST POPULAR chip
- **Full Detail:** £45 · "Showroom finish, guaranteed." · Book Detail

### How It Works
- **Label:** THE PROCESS
- **H2:** Simple. Fast. Spotless.
- Step 1: Drive In — "Pull straight into one of our 12 bays — no appointment needed for Express or Signature washes. Just show up."
- Step 2: We Get to Work — "Our trained team gets started immediately with pH-neutral shampoos, microfibre mitts, and professional tools. No brushes, no scratches."
- Step 3: Drive Away Clean — "Pick up your keys and go. Express washes take 12 minutes. Full Details are typically ready in 90 minutes."

### Before / After
- **Label:** THE DIFFERENCE
- **H2:** See It for Yourself.
- Quote: "Every car gets the same care whether it's a hatchback or a supercar. That's the Gleam guarantee."
- CTA: Book Your Wash →

### Trust Stats
- 5,000+ · Cars Washed Monthly
- 99% · Satisfaction Rate
- Since 2018 · Established
- 12 · Professional Bays

### Add-Ons
- **Label:** EXTRA SERVICES
- **H2:** Upgrade Your Wash.
- **Subline:** Add any of these to any package at checkout or on arrival.
- Interior Vacuum +£8 / Tyre Shine +£6 / Air Freshener +£3 / Ceramic Coat +£35 / Wax Polish +£15 / Leather Conditioning +£20 / Engine Bay Clean +£25

### Membership
- **Label:** UNLIMITED WASHES
- **H2:** Wash More. Pay Less.
- **Subline:** Our monthly membership gives you unlimited Signature Washes for one fixed monthly fee. Cancel any time, no contracts.
- Basic £19/mo / Signature £29/mo — MOST VALUE / Detail Pass £49/mo
- Footer note: No contracts. Cancel any time. Membership begins the day you sign up.

### Footer
- **Tagline:** Premium car washing and detailing in Marlow, Berkshire. Professional products, guaranteed results.
- **Copyright:** © 2024 Gleam Auto Spa. All rights reserved.
- **Legal:** Privacy Policy · Terms

---

## 10. KEY DEPENDENCIES

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "motion": "^11.11.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.460.0",
    "@shadcn/ui": "latest"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47"
  }
}
```

**shadcn/ui components to install:**
```bash
npx shadcn@latest add card badge button
```

**Tailwind `fontFamily` extension (`tailwind.config.ts`):**
```ts
theme: {
  extend: {
    fontFamily: {
      space: ['"Space Grotesk"', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
    },
  },
}
```

**Framer Motion import — always use this, never `framer-motion`:**
```tsx
import { motion, useInView, useAnimation, AnimatePresence } from "motion/react";
```

**Custom CSS `scrollbar-hide` utility:**
```css
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
```
