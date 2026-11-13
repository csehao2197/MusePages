# Axle & Co Auto Repair — Full Website Prompt
# websiteprompts.ai

---

## 1. GOAL STATEMENT

Build a complete, production-ready website for **Axle & Co Auto Repair** — an independent mechanic and MOT testing garage — that communicates industrial expertise, honest pricing, and trustworthy service through a dark charcoal, signal orange, and light grey design system with Space Grotesk display type and full Framer Motion animation.

---

## 2. TECH STACK

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS v3 (with custom CSS variables)
- **Animation:** Framer Motion (`motion/react`) — import exclusively from `motion/react`, never from `framer-motion`
- **UI Components:** shadcn/ui
- **Icons:** lucide-react
- **Fonts:** Google Fonts (Space Grotesk + Plus Jakarta Sans via `<link>` in index.html)

---

## 3. DESIGN SYSTEM

Place these CSS custom properties in `src/index.css` inside `:root {}`:

```css
:root {
  /* Core Palette */
  --color-bg:           hsl(216, 14%, 10%);     /* #111418 — deep charcoal */
  --color-surface:      hsl(216, 12%, 14%);     /* #1c2028 — card background */
  --color-surface-mid:  hsl(216, 10%, 18%);     /* #272d35 — elevated surface */
  --color-border:       hsl(216, 10%, 22%);     /* #313840 — subtle border */
  --color-orange:       hsl(22, 97%, 47%);      /* #e85d04 — signal orange */
  --color-orange-hover: hsl(22, 97%, 42%);      /* #d15203 — orange hover */
  --color-orange-glow:  hsla(22, 97%, 47%, 0.18); /* orange ambient glow */
  --color-grey-light:   hsl(0, 0%, 91%);        /* #e8e8e8 — light grey */
  --color-grey-mid:     hsl(0, 0%, 62%);        /* #9e9e9e — mid grey */
  --color-grey-dark:    hsl(0, 0%, 38%);        /* #616161 — dark grey */
  --color-white:        hsl(0, 0%, 100%);

  /* Typography Scale */
  --text-hero:    clamp(50px, 7.5vw, 130px);
  --text-h2:      clamp(32px, 4vw, 60px);
  --text-h3:      clamp(20px, 2.2vw, 28px);
  --text-body:    16px;
  --text-small:   14px;
  --text-label:   12px;

  /* Spacing */
  --section-px:   clamp(24px, 5vw, 96px);
  --section-py:   clamp(64px, 8vw, 120px);

  /* Radius */
  --radius-sm:    6px;
  --radius-md:    12px;
  --radius-lg:    20px;

  /* Transitions */
  --ease-out:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
}
```

Set `body { background-color: var(--color-bg); color: var(--color-grey-light); }` globally.

---

## 4. TYPOGRAPHY

Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

**Usage rules:**
- `font-family: 'Space Grotesk', sans-serif; font-weight: 800;` — ALL display headlines (hero, section heads, emergency CTA, marquee)
- `font-family: 'Space Grotesk', sans-serif; font-weight: 700;` — Navbar logo, pricing table headers, trust marquee text
- `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400;` — Body copy, card descriptions, footer content
- `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;` — Service card names, nav links, price chips, CTA labels
- `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 300;` — Subheadlines, captions, supporting text under emergency section
- Letter spacing: headlines use `letter-spacing: -0.02em`; labels use `letter-spacing: 0.08em; text-transform: uppercase`

---

## 5. VISUAL EFFECTS

### Effect 1 — Hero Horizontal Gradient
```css
background: linear-gradient(
  to right,
  rgba(17, 20, 24, 0.96) 0%,
  rgba(17, 20, 24, 0.80) 40%,
  rgba(17, 20, 24, 0.40) 65%,
  rgba(17, 20, 24, 0.00) 100%
);
```
Applied as `absolute inset-0 z-10` over the hero image. Ensures text is readable across all photo compositions without relying on image placement.

### Effect 2 — Background Watermark "AXLE"
```jsx
<span
  className="absolute select-none pointer-events-none"
  style={{
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: "clamp(240px, 34vw, 520px)",
    color: "rgba(232, 232, 232, 0.03)",
    right: "-2%",
    top: "50%",
    transform: "translateY(-50%)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
    zIndex: 5,
    userSelect: "none",
  }}
>
  AXLE
</span>
```
Sits between the photo layer and the gradient overlay (z-5). Creates brand identity without distracting from content.

### Effect 3 — Orange Glow on Cards (hover state)
```css
box-shadow: 0 0 0 0 transparent;
transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
```
On hover: `box-shadow: 0 8px 32px var(--color-orange-glow), 0 2px 8px rgba(0,0,0,0.4);` — creates a subtle orange ambient halo around hovered cards.

### Effect 4 — Infinite Scrolling Marquee
```css
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 35s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
```
Duplicate the trust text content once so the animation loops seamlessly.

### Effect 5 — Fixed Orange CTA Bar (hero-only)
A `position: fixed; bottom: 0; left: 0; right: 0; z-index: 100` bar that renders only when the user is within the hero viewport. Controlled via a `useEffect` + `IntersectionObserver` on a hero sentinel `<div>`. Fades out (`opacity: 0; pointer-events: none`) when hero exits view.

---

## 6. COMPONENT BREAKDOWN

---

### SECTION 1 — NAVBAR

**Layout:** `position: sticky; top: 0; z-index: 90`
- Background: `var(--color-bg)` with `border-bottom: 1px solid var(--color-border)`
- Padding: `16px var(--section-px)`
- Flex: `justify-between; align-items: center`

**Left — Logo:**
```jsx
<div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-white)", letterSpacing: "-0.02em" }}>
  AXLE <span style={{ color: "var(--color-orange)" }}>&</span> CO
</div>
```

**Center — Nav Links (desktop only, hidden on mobile):**
`Services · About · Pricing · Reviews` — rendered as `<nav>` with `<a>` tags, `color: var(--color-grey-mid)`, `font-family: Plus Jakarta Sans 600`, `font-size: 15px`, `letter-spacing: 0.01em`. On hover: `color: var(--color-grey-light)`, transition `0.15s ease`.

**Right — CTA:**
```jsx
<a href="#booking"
  style={{
    backgroundColor: "var(--color-orange)",
    color: "var(--color-white)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    padding: "10px 20px",
    borderRadius: "var(--radius-sm)",
    textDecoration: "none",
    transition: "background-color 0.15s ease",
  }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--color-orange-hover)"}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--color-orange)"}
>
  Book Online
</a>
```

**Mobile:** Hamburger icon (Menu from lucide-react), slides down a full-width drawer with links stacked vertically, same dark background.

---

### SECTION 2 — HERO

**Container:** `position: relative; height: 100vh; min-height: 640px; overflow: hidden`

**Layer 1 — Photo:**
```jsx
{/* Image: Professional mechanic in a clean navy uniform lying beneath a lifted car on a hydraulic ramp, dramatic underlighting from LED inspection lights casting warm orange/white on engine components. Background shows a tidy garage with tools organized on an orange pegboard. Cinematic wide-angle composition, slight grain, warm industrial atmosphere. */}
<img
  src=""
  alt="Mechanic working beneath a lifted car at Axle & Co garage"
  className="absolute inset-0 w-full h-full object-cover object-center"
  style={{ zIndex: 1 }}
/>
```

**Layer 2 — Watermark "AXLE"** (z-index: 5, see Effect 2 above)

**Layer 3 — Horizontal Gradient Overlay** (z-index: 10, see Effect 1 above)

**Layer 4 — Content (z-index: 20):**
```jsx
<div
  className="absolute inset-0 flex flex-col justify-center"
  style={{
    zIndex: 20,
    paddingLeft: "var(--section-px)",
    paddingRight: "var(--section-px)",
    maxWidth: "820px",
  }}
>
  {/* Eyebrow label */}
  <motion.p
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
      fontSize: "13px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--color-orange)",
      marginBottom: "20px",
    }}
  >
    Trusted Independent Garage · Est. 2008
  </motion.p>

  {/* Main Headline */}
  <motion.h1
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 800,
      fontSize: "var(--text-hero)",
      color: "var(--color-white)",
      lineHeight: 0.92,
      letterSpacing: "-0.03em",
      marginBottom: "28px",
    }}
  >
    WE FIX WHAT<br />
    <span style={{ color: "var(--color-orange)" }}>OTHERS</span> MISS.
  </motion.h1>

  {/* Subheadline */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 300,
      fontSize: "clamp(16px, 1.8vw, 22px)",
      color: "var(--color-grey-light)",
      maxWidth: "480px",
      lineHeight: 1.6,
      marginBottom: "40px",
    }}
  >
    Honest diagnostics. Fair pricing. Guaranteed work.
  </motion.p>

  {/* CTA Buttons */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
    style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
  >
    <a href="#booking" style={{
      backgroundColor: "var(--color-orange)",
      color: "var(--color-white)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
      fontSize: "16px",
      padding: "14px 28px",
      borderRadius: "var(--radius-sm)",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    }}>
      Book a Service
    </a>
    <a href="tel:02079460823" style={{
      border: "1px solid var(--color-border)",
      color: "var(--color-grey-light)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
      fontSize: "16px",
      padding: "14px 28px",
      borderRadius: "var(--radius-sm)",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "rgba(255,255,255,0.04)",
    }}>
      020 7946 0823
    </a>
  </motion.div>
</div>
```

**Layer 5 — Scroll indicator (bottom center, z-20):**
```jsx
<motion.div
  animate={{ y: [0, 8, 0] }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  style={{ position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}
>
  <ChevronDown size={28} color="rgba(232,232,232,0.4)" />
</motion.div>
```

**Fixed Call Bar (Layer 6 — separate DOM node at root level):**
```jsx
<motion.div
  initial={{ y: 80, opacity: 0 }}
  animate={heroVisible ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "var(--color-orange)",
    padding: "14px var(--section-px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    pointerEvents: heroVisible ? "auto" : "none",
  }}
>
  <PhoneCall size={22} color="white" />
  <span style={{
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: "clamp(18px, 2.2vw, 28px)",
    color: "var(--color-white)",
    letterSpacing: "-0.01em",
  }}>
    CALL NOW: 020 7946 0823
  </span>
  <span style={{
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 400,
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)",
    marginLeft: "8px",
  }}>
    Mon–Sat 8am–6pm · Emergency callout available
  </span>
</motion.div>
```

Use `useEffect` + `IntersectionObserver` on a `ref` at the bottom of the hero section. Set state `heroVisible: boolean`. When hero exits viewport, bar slides down and becomes non-interactive.

---

### SECTION 3 — SERVICES GRID

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-bg)`

**Section heading:**
```jsx
<div style={{ marginBottom: "56px" }}>
  <p style={{ /* orange eyebrow */ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-orange)", marginBottom: "12px" }}>
    What We Do
  </p>
  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "var(--text-h2)", color: "var(--color-white)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
    Full-Spectrum<br />
    <span style={{ color: "var(--color-grey-mid)" }}>Auto Services</span>
  </h2>
</div>
```

**Grid:** `display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;` on desktop. Each card shares a continuous surface — the `2px` gap creates thin dark dividers. On mobile: `repeat(1, 1fr)`, stacked.

**6 Service Cards — identical structure, staggered reveal (delay: index × 0.08s):**

Each card:
```jsx
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
  whileHover={{ y: -3 }}
  style={{
    backgroundColor: "var(--color-surface)",
    padding: "36px 32px",
    borderLeft: "3px solid transparent",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
  }}
  onHoverStart={e => {
    e.currentTarget.style.borderLeftColor = "var(--color-orange)";
    e.currentTarget.style.boxShadow = "0 8px 32px var(--color-orange-glow)";
  }}
  onHoverEnd={e => {
    e.currentTarget.style.borderLeftColor = "transparent";
    e.currentTarget.style.boxShadow = "none";
  }}
>
  {/* Icon */}
  <div style={{ marginBottom: "20px" }}>
    <Icon size={32} color="var(--color-orange)" strokeWidth={1.5} />
  </div>
  {/* Service name */}
  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "var(--text-h3)", color: "var(--color-white)", marginBottom: "10px", letterSpacing: "-0.01em" }}>
    {service.name}
  </h3>
  {/* Description */}
  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "var(--color-grey-mid)", lineHeight: 1.65, marginBottom: "24px" }}>
    {service.description}
  </p>
  {/* Price chip */}
  <span style={{
    display: "inline-block",
    backgroundColor: "rgba(232, 93, 4, 0.12)",
    color: "var(--color-orange)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    fontSize: "13px",
    letterSpacing: "0.04em",
    padding: "6px 14px",
    borderRadius: "100px",
    border: "1px solid rgba(232, 93, 4, 0.25)",
  }}>
    {service.price}
  </span>
</motion.div>
```

**6 Services Data:**
```ts
const services = [
  {
    name: "MOT Testing",
    icon: ClipboardCheck,  // lucide-react
    description: "Class 4 and Class 7 MOT tests on-site. Fast turnaround, same-day results, retest included free within 10 working days.",
    price: "From £29.99",
  },
  {
    name: "Engine Repair",
    icon: Gauge,
    description: "Full engine diagnostics and repair. From sensor faults to full rebuilds — we get to the root cause, not just the symptom.",
    price: "From £95",
  },
  {
    name: "Brake Service",
    icon: CircleDot,
    description: "Pad and disc replacement, brake fluid flush, handbrake adjustment. All brake work comes with a 12-month parts guarantee.",
    price: "From £79 per axle",
  },
  {
    name: "Tyres",
    icon: Circle,
    description: "Supply and fit for all tyre sizes. Budget, mid-range, and premium brands. Free wheel balancing included with every tyre fit.",
    price: "From £49 fitted",
  },
  {
    name: "Air Con Regas",
    icon: Wind,
    description: "Full air conditioning recharge using R134a or R1234yf refrigerant. Includes system leak check and performance test.",
    price: "From £49",
  },
  {
    name: "Diagnostics",
    icon: ScanLine,
    description: "OBD2 full-system scan covering engine, ABS, airbag, gearbox, and emissions. We read the codes and explain what they actually mean.",
    price: "From £35",
  },
];
```

---

### SECTION 4 — WHY CHOOSE US

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-surface)`

**Layout:** Single row on desktop (`display: flex; gap: 40px; flex-wrap: wrap`), stacked on mobile.

**Section heading (left-aligned, full width above the row):**
```
Why Axle & Co?
```
Space Grotesk 800, `var(--text-h2)`, white, `-0.02em` letter-spacing, `margin-bottom: 48px`.

**4 Trust Points — each:**
```jsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
  style={{ flex: "1 1 220px", display: "flex", alignItems: "flex-start", gap: "16px" }}
>
  {/* Orange circle checkmark */}
  <div style={{
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--color-orange)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
  }}>
    <Check size={20} color="white" strokeWidth={2.5} />
  </div>
  <div>
    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--color-white)", marginBottom: "6px" }}>
      {point.title}
    </p>
    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "var(--color-grey-mid)", lineHeight: 1.6 }}>
      {point.detail}
    </p>
  </div>
</motion.div>
```

**4 Trust Points Data:**
```ts
const trustPoints = [
  {
    title: "No Hidden Charges",
    detail: "We quote before we touch. If we discover additional work needed, we call you first. Always.",
  },
  {
    title: "12-Month Parts Guarantee",
    detail: "Every part we fit is guaranteed for 12 months or 12,000 miles — whichever comes first.",
  },
  {
    title: "Same-Day Service Available",
    detail: "Most repairs completed while you wait. Drop off in the morning, collect by afternoon.",
  },
  {
    title: "Free Collection & Delivery",
    detail: "Can't get to us? We'll collect your vehicle and return it to your door. Free within 5 miles.",
  },
];
```

---

### SECTION 5 — THE TEAM

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-bg)`

**Section heading:**
```
Meet the Mechanics
```
Space Grotesk 800, white, `var(--text-h2)`, `margin-bottom: 56px`.

**Grid:** `display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px` on desktop. `repeat(1, 1fr)` on mobile.

**3 Team Cards:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-40px" }}
  transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
  style={{
    backgroundColor: "var(--color-surface)",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    borderTop: "4px solid transparent",
    transition: "border-color 0.15s ease",
  }}
  onHoverStart={e => e.currentTarget.style.borderTopColor = "var(--color-orange)"}
  onHoverEnd={e => e.currentTarget.style.borderTopColor = "transparent"}
>
  {/* Photo — 4:3 ratio */}
  <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
    {/* Image: [mechanic portrait — see copy below] */}
    <img src="" alt="{member.name} — mechanic at Axle & Co" className="w-full h-full object-cover object-center" />
  </div>

  <div style={{ padding: "24px 28px 28px" }}>
    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--color-white)", marginBottom: "4px" }}>
      {member.name}
    </h3>
    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "14px", color: "var(--color-grey-mid)", marginBottom: "16px" }}>
      {member.experience} years experience
    </p>
    {/* Speciality chip */}
    <span style={{
      display: "inline-block",
      backgroundColor: "var(--color-orange)",
      color: "white",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
      fontSize: "12px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "5px 12px",
      borderRadius: "4px",
    }}>
      {member.speciality}
    </span>
  </div>
</motion.div>
```

**3 Team Members Data:**
```ts
const team = [
  {
    name: "Danny Rowe",
    experience: 18,
    speciality: "Engine & Transmission",
    imageDesc: "Mid-30s male mechanic in clean navy uniform, confident expression, arms crossed, workshop background with orange-lit pegboard tools, portrait orientation, warm professional lighting",
  },
  {
    name: "Priya Mehta",
    experience: 11,
    speciality: "Diagnostics & Electronics",
    imageDesc: "Early 30s female mechanic holding a diagnostic tablet, professional navy uniform, slight smile, clean workshop background, warm studio lighting, portrait orientation",
  },
  {
    name: "Carl Hutchins",
    experience: 24,
    speciality: "Brakes & Suspension",
    imageDesc: "Late 40s male senior mechanic, weathered hands, confident expression, navy uniform with Axle & Co logo, garage background with lifted vehicle partially visible, portrait orientation, cinematic lighting",
  },
];
```

---

### SECTION 6 — TRUST MARQUEE

**Container:**
```jsx
<div style={{
  backgroundColor: "var(--color-surface)",
  borderTop: "1px solid var(--color-border)",
  borderBottom: "1px solid var(--color-border)",
  padding: "20px 0",
  overflow: "hidden",
}}>
  <div className="marquee-track" style={{ display: "flex", alignItems: "center", gap: "0" }}>
    {/* Render items twice for seamless loop */}
    {[...items, ...items].map((item, i) => (
      <React.Fragment key={i}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(14px, 1.4vw, 17px)",
          color: "var(--color-grey-light)",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          padding: "0 40px",
        }}>
          {item}
        </span>
        <span style={{ color: "var(--color-orange)", fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>·</span>
      </React.Fragment>
    ))}
  </div>
</div>
```

**Marquee Items:**
```ts
const items = [
  "AA Approved Garage",
  "ASE Certified Technicians",
  "500+ Five-Star Reviews",
  "Est. 2008",
  "IMI Registered",
  "RAC Approved Garage",
  "Free MOT Retest",
  "12-Month Parts Guarantee",
];
```

Animation: `35s linear infinite`, pauses on hover. CSS defined in `index.css` as shown in Effect 4.

---

### SECTION 7 — TRANSPARENT PRICING

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-bg)`

**Section heading:**
```
No Surprises. Just Prices.
```
Space Grotesk 800, white, `var(--text-h2)`, `margin-bottom: 12px`.

**Subhead:** "Every price shown is the starting rate — we'll always confirm your exact quote before starting work." — Plus Jakarta Sans 300, `var(--color-grey-mid)`, 17px, `margin-bottom: 48px`.

**Table:**
```jsx
<div style={{
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  border: "1px solid var(--color-border)",
}}>
  {/* Header row */}
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 160px 140px",
    backgroundColor: "var(--color-orange)",
    padding: "16px 28px",
  }}>
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>Service</span>
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>From Price</span>
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>Avg. Time</span>
  </div>

  {/* Data rows — alternate between --color-surface and --color-surface-mid */}
  {pricingRows.map((row, i) => (
    <div key={i} style={{
      display: "grid",
      gridTemplateColumns: "1fr 160px 140px",
      padding: "18px 28px",
      backgroundColor: i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-mid)",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "16px", color: "var(--color-grey-light)" }}>{row.service}</span>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "16px", color: "var(--color-orange)" }}>{row.price}</span>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "var(--color-grey-mid)" }}>{row.time}</span>
    </div>
  ))}
</div>
```

**8 Pricing Rows:**
```ts
const pricingRows = [
  { service: "MOT Test (Class 4)",        price: "From £29.99",      time: "45–60 min" },
  { service: "Full Service",               price: "From £149",        time: "2–3 hrs" },
  { service: "Interim Service",            price: "From £89",         time: "1–2 hrs" },
  { service: "Brake Pads (per axle)",      price: "From £79",         time: "1 hr" },
  { service: "Brake Discs + Pads",         price: "From £149 axle",   time: "1.5 hrs" },
  { service: "Air Con Regas",              price: "From £49",         time: "30–45 min" },
  { service: "Diagnostic Scan",            price: "From £35",         time: "30 min" },
  { service: "Tyre Supply & Fit (each)",   price: "From £49 fitted",  time: "20 min each" },
];
```

**Note below table:** "All prices exclude VAT. Prices are indicative starting rates and may vary by vehicle. We confirm all costs before work begins." — Plus Jakarta Sans 300, 13px, `var(--color-grey-dark)`, `margin-top: 16px`.

---

### SECTION 8 — EMERGENCY SECTION

**Container:**
```jsx
<section style={{
  backgroundColor: "var(--color-orange)",
  padding: "var(--section-py) var(--section-px)",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
}}>
  {/* Background watermark "24/7" for depth */}
  <span style={{
    position: "absolute",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: "clamp(180px, 28vw, 400px)",
    color: "rgba(0,0,0,0.06)",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
  }}>
    24/7
  </span>

  <div style={{ position: "relative", zIndex: 1 }}>
    <motion.h2
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(36px, 5vw, 80px)",
        color: "white",
        letterSpacing: "-0.03em",
        lineHeight: 0.95,
        marginBottom: "28px",
      }}
    >
      BROKEN DOWN?<br />
      WE COME TO YOU.
    </motion.h2>

    <motion.a
      href="tel:02079460823"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "block",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(44px, 6vw, 90px)",
        color: "white",
        letterSpacing: "-0.03em",
        lineHeight: 1,
        textDecoration: "none",
        marginBottom: "20px",
      }}
    >
      020 7946 0823
    </motion.a>

    <p style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 300,
      fontSize: "clamp(15px, 1.6vw, 19px)",
      color: "rgba(255,255,255,0.82)",
      letterSpacing: "0.02em",
    }}>
      Available 7 days · Usually within 2 hours · No call-out charge within 10 miles
    </p>
  </div>
</section>
```

---

### SECTION 9 — FOOTER

**Container:** `background: var(--color-surface); border-top: 1px solid var(--color-border); padding: 64px var(--section-px) 32px`

**3-Column Grid (`display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 48px`):**

**Column 1 — Brand:**
```
AXLE & CO
Est. 2008 — trusted independent garage serving South London and the surrounding area. MOT, servicing, repairs, and tyres.

Unit 4, Grange Road Industrial Estate
London, SE1 3BT

Open Mon–Fri: 8:00am – 6:00pm
Saturday: 8:00am – 4:00pm
Sunday: Emergency callout only
```
Logo in Space Grotesk 800, white. Address and hours in Plus Jakarta Sans 400, `var(--color-grey-mid)`, 14px. Map link: "Get Directions →" in orange, 14px.

**Column 2 — Opening Hours Table:**
```
Monday      8:00am – 6:00pm
Tuesday     8:00am – 6:00pm
Wednesday   8:00am – 6:00pm
Thursday    8:00am – 6:00pm
Friday      8:00am – 6:00pm
Saturday    8:00am – 4:00pm
Sunday      Emergency only
```
Rendered as a `<table>` with `border-collapse: collapse`. Each `<tr>` has `padding: 6px 0`. Day names in Plus Jakarta Sans 600, white; times in Plus Jakarta Sans 400, `var(--color-grey-mid)`.

**Column 3 — Certifications & Links:**
```
Certifications
AA Approved Garage
RAC Approved Garage
IMI Registered (No. 123456)
ASE Certified Technicians

Quick Links
Book Online
View Pricing
Get a Quote
Contact Us
```
Certifications with small ShieldCheck icon (lucide, 14px, orange) beside each. Links in Plus Jakarta Sans 400, `var(--color-grey-mid)`, hover orange.

**Bottom bar (border-top: 1px solid var(--color-border); padding-top: 24px; margin-top: 40px):**
```
© 2024 Axle & Co Auto Repair Ltd. All rights reserved. · Privacy Policy · Terms of Service
```
Center-aligned, Plus Jakarta Sans 400, 13px, `var(--color-grey-dark)`.

---

## 7. ANIMATIONS

| Element | Type | Duration | Delay | Easing |
|---|---|---|---|---|
| Navbar (on load) | Fade in from y:-8 | 0.4s | 0s | ease-out |
| Hero eyebrow | Fade in from y:16 | 0.5s | 0.1s | [0.22,1,0.36,1] |
| Hero headline | Fade in from y:24 | 0.7s | 0.2s | [0.22,1,0.36,1] |
| Hero subhead | Fade in from y:20 | 0.6s | 0.4s | [0.22,1,0.36,1] |
| Hero CTAs | Fade in from y:20 | 0.6s | 0.55s | [0.22,1,0.36,1] |
| Scroll chevron | Float y:0→8→0 | 2s | — | ease-in-out, repeat:Infinity |
| Fixed call bar | Slide from y:80 | 0.35s | — | [0.22,1,0.36,1] |
| Service cards | Fade from y:32, stagger | 0.55s | index×0.08s | [0.22,1,0.36,1] |
| Service card (hover) | y:-3 | 0.2s | — | ease |
| Trust points | Fade from x:-20, stagger | 0.5s | index×0.1s | [0.22,1,0.36,1] |
| Team cards | Fade from y:24, stagger | 0.55s | index×0.1s | [0.22,1,0.36,1] |
| Trust marquee | Continuous scroll | 35s | — | linear, infinite |
| Pricing table rows | Fade from x:-16, stagger | 0.4s | index×0.06s | [0.22,1,0.36,1] |
| Emergency section h2 | Fade from y:32 | 0.65s | 0s | [0.22,1,0.36,1] |
| Emergency phone number | Fade + scale from 0.95 | 0.5s | 0.2s | [0.22,1,0.36,1] |

All `whileInView` animations use `viewport={{ once: true }}` so they fire once on scroll.

---

## 8. RESPONSIVE SPECIFICATIONS

### Desktop (≥1024px)
- Services grid: `grid-template-columns: repeat(3, 1fr)` — 2 rows of 3 cards
- Trust points: single horizontal row, `flex-wrap: wrap`
- Team cards: `repeat(3, 1fr)`
- Pricing table: 3 columns visible
- Footer: 3-column grid
- Marquee text: 17px
- Hero text: full `clamp()` scale

### Tablet (640px–1023px)
- Services grid: `repeat(2, 1fr)` — 3 rows of 2 cards
- Team cards: `repeat(2, 1fr)`
- Footer: `repeat(2, 1fr)`, third column wraps to full width
- Navbar: hide center nav links, show hamburger
- Fixed call bar: reduce font size to 18px, hide supporting text

### Mobile (<640px)
- Services grid: `repeat(1, 1fr)` — stacked
- Team cards: `repeat(1, 1fr)` — stacked
- Footer: single column, stacked
- Hero: `min-height: 100svh`, headline at `clamp(44px, 12vw, 70px)`
- Pricing table: hide "Avg. Time" column, show "Service" + "From Price" only
- Fixed call bar: full width, `font-size: 18px`, just phone number + icon
- Trust points: stacked vertically with `gap: 24px`

---

## 9. FULL COPY

### Navbar
- Logo: `AXLE & CO`
- Nav: `Services` · `About` · `Pricing` · `Reviews`
- CTA: `Book Online`

### Hero
- Eyebrow: `Trusted Independent Garage · Est. 2008`
- Headline line 1: `WE FIX WHAT`
- Headline line 2: `OTHERS MISS.`
- Subhead: `Honest diagnostics. Fair pricing. Guaranteed work.`
- CTA 1: `Book a Service`
- CTA 2: `020 7946 0823`
- Fixed bar: `CALL NOW: 020 7946 0823` + `Mon–Sat 8am–6pm · Emergency callout available`

### Services Section
- Eyebrow: `What We Do`
- Headline: `Full-Spectrum Auto Services`
- Services: (see services data above)

### Why Choose Us
- Headline: `Why Axle & Co?`
- Points: (see trust points data above)

### Team Section
- Headline: `Meet the Mechanics`
- Members: Danny Rowe / Priya Mehta / Carl Hutchins (see data above)

### Pricing Section
- Headline: `No Surprises. Just Prices.`
- Subhead: `Every price shown is the starting rate — we'll always confirm your exact quote before starting work.`
- Footnote: `All prices exclude VAT. Prices are indicative starting rates and may vary by vehicle. We confirm all costs before work begins.`

### Emergency Section
- Headline line 1: `BROKEN DOWN?`
- Headline line 2: `WE COME TO YOU.`
- Phone: `020 7946 0823`
- Subtext: `Available 7 days · Usually within 2 hours · No call-out charge within 10 miles`

### Footer
- Tagline: `Est. 2008 — trusted independent garage serving South London and the surrounding area. MOT, servicing, repairs, and tyres.`
- Address: `Unit 4, Grange Road Industrial Estate, London, SE1 3BT`
- Map link: `Get Directions →`
- Hours (see column 2 above)
- Copyright: `© 2024 Axle & Co Auto Repair Ltd. All rights reserved. · Privacy Policy · Terms of Service`

---

## 10. KEY DEPENDENCIES

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "motion": "^11.11.0",
    "lucide-react": "^0.441.0",
    "tailwindcss": "^3.4.13",
    "@shadcn/ui": "latest"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vite": "^5.4.8",
    "@vitejs/plugin-react": "^4.3.2"
  }
}
```

**lucide-react icons used:**
- `PhoneCall` — fixed call bar + emergency
- `ClipboardCheck` — MOT card
- `Gauge` — Engine card
- `CircleDot` — Brakes card
- `Circle` — Tyres card
- `Wind` — Air Con card
- `ScanLine` — Diagnostics card
- `Check` — trust points
- `ChevronDown` — hero scroll indicator
- `ShieldCheck` — footer certifications
- `Menu`, `X` — mobile nav

**Important implementation notes:**
1. Import all Framer Motion components from `motion/react`, not `framer-motion`
2. All `whileHover` inside `whileInView` elements require the parent `motion.div` — do not split into separate divs
3. The `IntersectionObserver` for the fixed call bar should observe a `ref` div placed at the bottom edge of the hero `<section>`, triggering when it exits the top of the viewport (threshold: 0)
4. The marquee CSS animation must be defined in `index.css`, not inline styles, for browser compatibility
5. Pricing table on mobile: wrap in a horizontally scrollable div with `-webkit-overflow-scrolling: touch`
