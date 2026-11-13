# Ashford Manor Wedding Venue — Full Website Prompt
# websiteprompts.ai

---

## 1. GOAL STATEMENT

Build a complete, production-ready website for **Ashford Manor** — an exclusive country estate wedding venue — that communicates timeless romance, natural luxury, and exclusivity through a warm ivory, sage green, and aged gold design system with Cormorant Garamond display type and refined Framer Motion animation.

---

## 2. TECH STACK

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS v3 (with custom CSS variables)
- **Animation:** Framer Motion (`motion/react`) — import exclusively from `motion/react`, never from `framer-motion`
- **UI Components:** shadcn/ui
- **Icons:** lucide-react
- **Fonts:** Google Fonts (Cormorant Garamond + Plus Jakarta Sans via `<link>` in index.html)

---

## 3. DESIGN SYSTEM

Place these CSS custom properties in `src/index.css` inside `:root {}`:

```css
:root {
  /* Core Palette */
  --color-bg:           hsl(40, 33%, 97%);      /* #faf7f2 — warm ivory */
  --color-bg-warm:      hsl(38, 28%, 94%);      /* #f3efe8 — slightly deeper ivory */
  --color-surface:      hsl(0, 0%, 100%);       /* pure white for cards */
  --color-border:       hsl(40, 20%, 88%);      /* #e4ddd2 — warm border */
  --color-border-gold:  hsl(40, 52%, 56%);      /* #c4a35a — aged gold border */
  --color-sage:         hsl(104, 14%, 38%);     /* #5a7052 — sage green */
  --color-sage-light:   hsl(104, 14%, 94%);     /* #edf2ec — sage tint */
  --color-sage-mid:     hsl(104, 14%, 55%);     /* #7d9875 — medium sage */
  --color-gold:         hsl(40, 52%, 56%);      /* #c4a35a — aged gold */
  --color-gold-light:   hsl(40, 52%, 92%);      /* #f5edd9 — gold tint */
  --color-charcoal:     hsl(210, 10%, 20%);     /* #2d3238 — deep charcoal text */
  --color-text-mid:     hsl(210, 8%, 42%);      /* #636b74 — mid text */
  --color-text-light:   hsl(40, 12%, 60%);      /* #a09880 — light warm text */
  --color-white:        hsl(0, 0%, 100%);

  /* Typography Scale */
  --text-hero:    clamp(52px, 8vw, 140px);
  --text-h2:      clamp(34px, 4.5vw, 72px);
  --text-h3:      clamp(22px, 2.4vw, 32px);
  --text-body:    16px;
  --text-small:   14px;
  --text-label:   12px;

  /* Spacing */
  --section-px:   clamp(24px, 5vw, 96px);
  --section-py:   clamp(72px, 9vw, 140px);

  /* Radius */
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-lg:    16px;

  /* Transitions */
  --ease-out:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-gentle:  cubic-bezier(0.4, 0, 0.2, 1);
}
```

Set `body { background-color: var(--color-bg); color: var(--color-charcoal); }` globally.

---

## 4. TYPOGRAPHY

Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

**Usage rules:**
- `font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;` — ALL display headlines (hero, section heads, venue names, couple names in testimonials)
- `font-family: 'Cormorant Garamond', serif; font-weight: 400; font-style: italic;` — Pull quotes, decorative subtext
- `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 300;` — Body copy, card descriptions, supporting text
- `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400;` — Form inputs, nav links, general body
- `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;` — Labels, metadata, date chips
- `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;` — CTA buttons, nav CTAs, form submit
- Letter spacing: display headlines use `letter-spacing: -0.02em`; all-caps labels use `letter-spacing: 0.12em; text-transform: uppercase`
- Line height: display text `1.0`; body text `1.75`

---

## 5. VISUAL EFFECTS

### Effect 1 — Hero Radial + Linear Vignette
```css
background:
  radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%),
  linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.50) 100%);
```
Applied as `absolute inset-0 z-10` over the hero image. Creates a natural cinematic vignette that darkens edges and bottom, ensuring text legibility regardless of photo composition.

### Effect 2 — Animated Gold Underline
```tsx
{/* Decorative gold line, placed immediately beneath the hero headline */}
<motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
  style={{
    height: "2px",
    width: "160px",
    backgroundColor: "var(--color-gold)",
    transformOrigin: "left center",
    margin: "28px auto 32px",
  }}
/>
```
Grows from left to right after the headline fades in, animating `scaleX: 0 to 1` over `1.2s` with `delay: 0.8s`. The `transformOrigin: "left center"` makes it draw left-to-right. Purely decorative.

### Effect 3 — Background Watermark "MANOR"
```jsx
<span
  className="absolute select-none pointer-events-none"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontStyle: "italic",
    fontSize: "clamp(200px, 30vw, 460px)",
    color: "rgba(90, 112, 82, 0.025)",
    right: "-1%",
    top: "50%",
    transform: "translateY(-50%)",
    lineHeight: 1,
    letterSpacing: "-0.03em",
    zIndex: 5,
    userSelect: "none",
  }}
>
  MANOR
</span>
```
Sits between the photo layer (z-1) and the gradient overlay (z-10). Renders in sage at 2.5% opacity — subliminally reinforces the brand name without competing with the photography.

### Effect 4 — Venue Card Parallax Scale on Hover
Outer card container is a `motion.div` with `whileHover={{ scale: 1.02 }}` and `transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}`. Inside it, a nested `motion.div` wrapping only the `<img>` has `whileHover={{ scale: 1.06 }}` with the same transition. The two different scale values create a zoom-within-zoom parallax effect that feels natural and cinematic. The outer card must have `overflow: hidden` and `border-radius` set to contain the inner scale.

### Effect 5 — Gold Separator Lines
Between the Hero and Venue Spaces sections, and between the Testimonials and Availability CTA sections:
```jsx
<div style={{
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "0 var(--section-px)",
}}>
  <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
  <span style={{ color: "var(--color-gold)", fontSize: "20px" }}>✦</span>
  <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
</div>
```

### Effect 6 — Form Input Focus Ring
In `index.css`:
```css
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 3px rgba(196, 163, 90, 0.30);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
```
Gold glow ring on the sage-background enquiry form inputs.

---

## 6. COMPONENT BREAKDOWN

---

### SECTION 1 — NAVBAR

**Layout:** `position: sticky; top: 0; z-index: 90`
- Background: `rgba(250, 247, 242, 0.92)` + `backdrop-filter: blur(12px) saturate(1.5)`
- Border bottom: `1px solid var(--color-border)`
- Padding: `18px var(--section-px)`
- Structure: 3-part flex row — `[left nav] [center logo] [right CTA]`

**Left nav links (desktop only, hidden `<768px`):** `Services · Gallery · Packages · Testimonials · Blog`
Plus Jakarta Sans 400, `14px`, `letter-spacing: 0.02em`, `color: var(--color-text-mid)`. On hover: `color: var(--color-sage)`, transition `0.15s ease`.

**Center logo:**
```jsx
<div style={{ textAlign: "center", flexShrink: 0 }}>
  <div style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontStyle: "italic",
    fontSize: "clamp(18px, 2vw, 24px)",
    color: "var(--color-charcoal)",
    letterSpacing: "0.04em",
    lineHeight: 1.1,
  }}>
    Ashford Manor
  </div>
  <div style={{
    width: "32px",
    height: "1px",
    backgroundColor: "var(--color-gold)",
    margin: "5px auto 0",
  }} />
</div>
```

**Right:** `Contact` plain link + `Enquire` filled sage button.
```jsx
<a href="#enquire" style={{
  backgroundColor: "var(--color-sage)",
  color: "white",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  padding: "9px 20px",
  borderRadius: "var(--radius-sm)",
  textDecoration: "none",
  letterSpacing: "0.02em",
  transition: "background-color 0.15s ease",
}}>
  Enquire
</a>
```

**Mobile (<768px):** Centered logo only + `Menu` icon (lucide) right-aligned. Tap opens a full-screen ivory overlay with all links stacked vertically (Plus Jakarta Sans 400, 22px, `var(--color-charcoal)`).

---

### SECTION 2 — HERO

**Container:** `position: relative; height: 100vh; min-height: 680px; overflow: hidden`

**Layer 1 — Photo (z-index: 1):**
```jsx
{/* Image: Outdoor wedding ceremony setup at a grand English country estate on a summer afternoon. White wooden chairs arranged in symmetrical rows facing a floral arch covered in white roses, peonies, and trailing eucalyptus. Golden hour sunlight filters through the canopy of mature oak trees at the frame's edges, casting long warm rays across a lush manicured lawn. A stone manor house is softly visible out of focus in the background. Warm, romantic, aspirational. Shot on 85mm, shallow depth of field, wide crop. */}
<img
  src=""
  alt="Outdoor wedding ceremony on the lawns of Ashford Manor"
  className="absolute inset-0 w-full h-full object-cover object-center"
  style={{ zIndex: 1 }}
/>
```

**Layer 2 — Watermark "MANOR" (z-index: 5):** See Effect 3 above.

**Layer 3 — Vignette overlay (z-index: 10):** See Effect 1 above.

**Layer 4 — Centered Content (z-index: 20):**
```jsx
<div style={{
  position: "absolute",
  inset: 0,
  zIndex: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "0 var(--section-px)",
}}>
  {/* Eyebrow */}
  <motion.p
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 500,
      fontSize: "12px",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--color-gold)",
      marginBottom: "20px",
    }}
  >
    Ashford, Hertfordshire · Est. 1847
  </motion.p>

  {/* Main Headline */}
  <motion.h1
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
      fontStyle: "italic",
      fontSize: "var(--text-hero)",
      color: "white",
      lineHeight: 1.0,
      letterSpacing: "-0.02em",
      maxWidth: "960px",
      marginBottom: 0,
    }}
  >
    Where Your Story Begins.
  </motion.h1>

  {/* Animated Gold Underline */}
  <motion.div
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
    style={{
      height: "2px",
      width: "160px",
      backgroundColor: "var(--color-gold)",
      transformOrigin: "left center",
      margin: "28px auto 32px",
    }}
  />

  {/* Subline */}
  <motion.p
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 300,
      fontSize: "clamp(15px, 1.6vw, 20px)",
      color: "rgba(255,255,255,0.85)",
      maxWidth: "600px",
      lineHeight: 1.7,
      marginBottom: "12px",
    }}
  >
    An exclusive country manor for intimate weddings and grand celebrations alike.
  </motion.p>

  {/* Capacity note */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 300,
      fontSize: "15px",
      color: "rgba(255,255,255,0.60)",
      letterSpacing: "0.04em",
      marginBottom: "44px",
    }}
  >
    Capacity 20–180 guests · Licensed for civil ceremonies
  </motion.p>

  {/* CTA Pair */}
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
    style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}
  >
    <a href="#enquire" style={{
      backgroundColor: "var(--color-sage)",
      color: "white",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
      fontSize: "15px",
      padding: "14px 32px",
      borderRadius: "var(--radius-sm)",
      textDecoration: "none",
      letterSpacing: "0.02em",
    }}>
      Check Availability
    </a>
    <a href="#gallery" style={{
      border: "1px solid rgba(255,255,255,0.55)",
      color: "white",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 400,
      fontSize: "15px",
      padding: "14px 32px",
      borderRadius: "var(--radius-sm)",
      textDecoration: "none",
      letterSpacing: "0.02em",
      backgroundColor: "rgba(255,255,255,0.08)",
    }}>
      View Our Gallery
    </a>
  </motion.div>
</div>
```

**Scroll indicator (z-20, bottom center):**
```jsx
<motion.div
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
  style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}
>
  <ChevronDown size={24} color="rgba(255,255,255,0.45)" />
</motion.div>
```

---

### SECTION 3 — VENUE SPACES

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-bg)`

**Section heading (centered):**
```jsx
<div style={{ textAlign: "center", marginBottom: "60px" }}>
  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "14px" }}>
    Our Spaces
  </p>
  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontStyle: "italic", fontSize: "var(--text-h2)", color: "var(--color-charcoal)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
    Three Breathtaking Settings
  </h2>
</div>
```

**Grid:** `display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px` on desktop.

**3 Venue Space Cards — each full-bleed 16:9 aspect ratio:**
```jsx
<motion.div
  key={space.name}
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
  style={{
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    position: "relative",
    aspectRatio: "16/9",
    cursor: "pointer",
  }}
>
  {/* Parallax image — nested motion.div for independent scale */}
  <motion.div
    style={{ position: "absolute", inset: 0 }}
    whileHover={{ scale: 1.06 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Image: [see venue space image descriptions in data block below] */}
    <img src="" alt={space.name + " at Ashford Manor"} className="w-full h-full object-cover object-center" />
  </motion.div>

  {/* Gradient overlay — darkens slightly more on hover via CSS transition */}
  <div style={{
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0) 100%)",
    zIndex: 2,
    transition: "background 0.4s ease",
  }} />

  {/* Text overlay — bottom */}
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px", zIndex: 3 }}>
    <span style={{
      display: "block",
      width: "fit-content",
      backgroundColor: "rgba(196, 163, 90, 0.25)",
      border: "1px solid rgba(196, 163, 90, 0.5)",
      color: "var(--color-gold)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 500,
      fontSize: "12px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "4px 12px",
      borderRadius: "2px",
      marginBottom: "10px",
    }}>
      Up to {space.capacity} guests
    </span>
    <h3 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
      fontStyle: "italic",
      fontSize: "clamp(22px, 2.4vw, 32px)",
      color: "white",
      letterSpacing: "-0.01em",
      lineHeight: 1.1,
      marginBottom: "6px",
    }}>
      {space.name}
    </h3>
    <p style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 300,
      fontSize: "14px",
      color: "rgba(255,255,255,0.72)",
      lineHeight: 1.5,
    }}>
      {space.tagline}
    </p>
  </div>
</motion.div>
```

**Venue Spaces Data:**
```ts
const venueSpaces = [
  {
    name: "The Grand Hall",
    capacity: 200,
    tagline: "Vaulted stone ceilings, crystal chandeliers, and original oak floors.",
    imageDesc: "Elegant wedding banquet in a grand stone hall with high vaulted ceilings, multiple crystal chandeliers casting warm candlelight, white floral centrepieces on round tables with ivory linens, 200 guests seated, wide-angle cinematic shot",
  },
  {
    name: "The Orangery",
    capacity: 80,
    tagline: "Floor-to-ceiling glass, tropical botanicals, and dappled garden light.",
    imageDesc: "Intimate wedding reception inside a Victorian orangery with floor-to-ceiling arched glass windows, lush tropical hanging ferns and potted plants, white dining tables, warm golden afternoon light streaming through glass, wide shot",
  },
  {
    name: "The Garden Terrace",
    capacity: 60,
    tagline: "Open-air celebrations beneath a canopy of fairy lights and stars.",
    imageDesc: "Outdoor evening wedding reception on a manicured stone terrace, thousands of warm fairy lights strung between mature trees, white-draped round tables, stone balustrade, rose bushes in bloom, warm dusk light, romantic and magical",
  },
];
```

---

### SECTION 4 — WHAT'S INCLUDED

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-bg-warm)`

**Layout:** `display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: center`

**Left column — heading + prose:**
```jsx
<div>
  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "14px" }}>
    Every Package Includes
  </p>
  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontStyle: "italic", fontSize: "var(--text-h2)", color: "var(--color-charcoal)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "28px" }}>
    What's Included
  </h2>
  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 300, fontSize: "17px", color: "var(--color-text-mid)", lineHeight: 1.75 }}>
    Every Ashford Manor wedding package includes exclusive use of the estate and all its facilities. We believe your wedding day should feel entirely yours — no shared spaces, no conflicting events, no compromises.
  </p>
</div>
```

**Right column — 14-item checklist in 2-col sub-grid:**
```jsx
<ul style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px 32px", listStyle: "none", padding: 0, margin: 0 }}>
  {inclusions.map((item, i) => (
    <motion.li
      key={i}
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
    >
      <Check size={16} color="var(--color-sage)" strokeWidth={2.5} style={{ marginTop: "3px", flexShrink: 0 }} />
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "var(--color-charcoal)", lineHeight: 1.5 }}>
        {item}
      </span>
    </motion.li>
  ))}
</ul>
```

**14 Inclusions:**
```ts
const inclusions = [
  "Exclusive use of the entire estate",
  "Bridal suite for getting-ready prep",
  "5 acres of private landscaped gardens",
  "250-space private car park",
  "Licensed for civil ceremonies",
  "Dedicated wedding coordinator",
  "Ceremony and reception chairs",
  "Tables, linens, and crockery",
  "In-house catering available",
  "Bar facilities and full licence",
  "Accommodation for up to 22 guests",
  "Grand piano in The Grand Hall",
  "Award-winning floral designer referrals",
  "Complimentary menu tasting for two",
];
```

---

### SECTION 5 — WEDDING GALLERY

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-bg)`

**Section heading (centered, `margin-bottom: 56px`):**
```
A Glimpse of Your Day
```
Cormorant Garamond 600 italic, `var(--text-h2)`, `var(--color-charcoal)`, letter-spacing -0.02em.

**Asymmetric 5-image grid using a 12-column CSS grid:**
```jsx
<div style={{
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridTemplateRows: "auto auto",
}}>
  {/* Image 1 — Large landscape, columns 1-7, row 1 */}
  <div style={{ gridColumn: "1 / 8", gridRow: "1", aspectRatio: "4/3", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
    {/* Image: Bride and groom exchanging vows under a floral arch on a sunlit lawn, golden hour warm light, candid emotional moment, soft focus background, romantic wide shot */}
    <img src="" alt="Wedding ceremony vows under the floral arch at Ashford Manor" className="w-full h-full object-cover object-center" />
  </div>

  {/* Image 2 — Portrait, columns 8-12, row 1 */}
  <div style={{ gridColumn: "8 / 13", gridRow: "1", aspectRatio: "3/4", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
    {/* Image: Bridal bouquet close-up, white roses and peonies with trailing eucalyptus greenery, held in both hands with lace wedding dress visible, warm natural daylight, soft macro detail */}
    <img src="" alt="Bridal bouquet detail — white roses and peonies" className="w-full h-full object-cover object-center" />
  </div>

  {/* Image 3 — Portrait, columns 1-4, row 2 */}
  <div style={{ gridColumn: "1 / 5", gridRow: "2", aspectRatio: "3/4", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
    {/* Image: Couple's first dance in The Grand Hall, crystal chandeliers above, dress hem in motion blur, close romantic crop, warm candlelight tones */}
    <img src="" alt="First dance in The Grand Hall at Ashford Manor" className="w-full h-full object-cover object-center" />
  </div>

  {/* Image 4 — Portrait, columns 5-8, row 2 */}
  <div style={{ gridColumn: "5 / 9", gridRow: "2", aspectRatio: "3/4", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
    {/* Image: Elegant wedding table setting — ivory linen, gold cutlery, crystal glasses, white floral centrepiece with candles, detail shot, warm shallow depth of field */}
    <img src="" alt="Elegant reception table setting at Ashford Manor" className="w-full h-full object-cover object-center" />
  </div>

  {/* Image 5 — Square, columns 9-12, row 2 */}
  <div style={{ gridColumn: "9 / 13", gridRow: "2", aspectRatio: "1/1", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
    {/* Image: The Orangery interior during an evening wedding reception, warm fairy lights through glass walls, tropical plants, guests in formal attire mingling, candid atmosphere */}
    <img src="" alt="Evening reception in The Orangery at Ashford Manor" className="w-full h-full object-cover object-center" />
  </div>
</div>
```

**Below grid — centered link:**
```jsx
<div style={{ textAlign: "center", marginTop: "40px" }}>
  <a href="#gallery" style={{
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 500,
    fontSize: "15px",
    color: "var(--color-sage)",
    textDecoration: "none",
    letterSpacing: "0.04em",
    borderBottom: "1px solid var(--color-sage)",
    paddingBottom: "2px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  }}>
    View Full Gallery <ArrowRight size={16} />
  </a>
</div>
```

---

### SECTION 6 — TESTIMONIALS

**Container:** `padding: var(--section-py) var(--section-px); background: var(--color-bg-warm)`

**Section heading (centered, `margin-bottom: 56px`):**
```
Words From Our Couples
```
Cormorant Garamond 600 italic, `var(--text-h2)`, `var(--color-charcoal)`.

**Grid:** `display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px`

**3 Testimonial Cards:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 28 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-40px" }}
  transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
  style={{
    backgroundColor: "var(--color-surface)",
    borderRadius: "var(--radius-md)",
    borderLeft: "3px solid var(--color-gold)",
    padding: "36px 32px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
  }}
>
  {/* 5 stars */}
  <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
    {[...Array(5)].map((_, s) => (
      <Star key={s} size={16} fill="var(--color-gold)" color="var(--color-gold)" />
    ))}
  </div>

  {/* Quote */}
  <p style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
    fontStyle: "italic",
    fontSize: "clamp(18px, 1.8vw, 22px)",
    color: "var(--color-charcoal)",
    lineHeight: 1.65,
    marginBottom: "28px",
  }}>
    "{testimonial.quote}"
  </p>

  {/* Couple name + date chip */}
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
    <div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontStyle: "italic", fontSize: "20px", color: "var(--color-charcoal)", marginBottom: "2px" }}>
        {testimonial.couple}
      </p>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "13px", color: "var(--color-text-light)" }}>
        {testimonial.venue}
      </p>
    </div>
    <span style={{
      backgroundColor: "var(--color-sage-light)",
      color: "var(--color-sage)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 500,
      fontSize: "12px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "5px 12px",
      borderRadius: "2px",
    }}>
      {testimonial.date}
    </span>
  </div>
</motion.div>
```

**3 Testimonials Data:**
```ts
const testimonials = [
  {
    quote: "Ashford Manor exceeded every expectation. From the first enquiry call to the final dance, every detail was handled with such grace and care. Our guests still talk about it.",
    couple: "Charlotte & James Whitmore",
    venue: "The Grand Hall · 180 guests",
    date: "June 2024",
  },
  {
    quote: "We had always dreamed of an outdoor ceremony, and The Garden Terrace was exactly what we'd imagined — but more beautiful. The fairy lights at dusk were simply magical.",
    couple: "Amara & Daniel Okafor",
    venue: "The Garden Terrace · 55 guests",
    date: "September 2024",
  },
  {
    quote: "The Orangery was the perfect intimate setting for our small, meaningful wedding. The botanical atmosphere, the light, the staff — everything was flawless. Truly perfect.",
    couple: "Sophie & Miriam Leclair",
    venue: "The Orangery · 42 guests",
    date: "April 2024",
  },
];
```

---

### SECTION 7 — AVAILABILITY CTA

**Container:**
```jsx
<section id="enquire" style={{
  backgroundColor: "var(--color-sage)",
  padding: "var(--section-py) var(--section-px)",
  position: "relative",
  overflow: "hidden",
}}>
  {/* Decorative watermark "2025" */}
  <span style={{
    position: "absolute",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    fontStyle: "italic",
    fontSize: "clamp(200px, 30vw, 500px)",
    color: "rgba(255,255,255,0.04)",
    right: "-5%",
    bottom: "-10%",
    pointerEvents: "none",
    userSelect: "none",
    lineHeight: 1,
  }}>
    2025
  </span>

  <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
      Limited Dates Remaining
    </p>

    <motion.h2
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600,
        fontStyle: "italic",
        fontSize: "clamp(40px, 6vw, 100px)",
        color: "white",
        letterSpacing: "-0.02em",
        lineHeight: 1.0,
        marginBottom: "20px",
      }}
    >
      Your Perfect Day Awaits.
    </motion.h2>

    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 300, fontSize: "clamp(15px, 1.5vw, 18px)", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: "48px" }}>
      We have limited availability for 2025 and 2026. Fill in your details and our wedding coordinator will be in touch within 24 hours.
    </p>

    {/* Enquiry Form — 2-column grid */}
    <form style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", textAlign: "left" }}>

      {/* Field: Your Name */}
      <div>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
          Your Name
        </label>
        <input type="text" placeholder="Charlotte & James" style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "var(--radius-sm)", padding: "13px 16px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "white", outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Field: Email Address */}
      <div>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
          Email Address
        </label>
        <input type="email" placeholder="hello@example.com" style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "var(--radius-sm)", padding: "13px 16px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "white", outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Field: Preferred Date */}
      <div>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
          Preferred Date
        </label>
        <input type="date" style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "var(--radius-sm)", padding: "13px 16px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.7)", outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Field: Estimated Guests */}
      <div>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
          Estimated Guests
        </label>
        <select style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "var(--radius-sm)", padding: "13px 16px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.85)", outline: "none", boxSizing: "border-box", appearance: "none" }}>
          <option value="" style={{ color: "var(--color-charcoal)" }}>Select a range</option>
          <option value="20-40" style={{ color: "var(--color-charcoal)" }}>20–40 guests</option>
          <option value="40-80" style={{ color: "var(--color-charcoal)" }}>40–80 guests</option>
          <option value="80-120" style={{ color: "var(--color-charcoal)" }}>80–120 guests</option>
          <option value="120-180" style={{ color: "var(--color-charcoal)" }}>120–180 guests</option>
        </select>
      </div>

      {/* Submit — full width */}
      <div style={{ gridColumn: "1 / -1" }}>
        <button type="submit" style={{
          width: "100%",
          backgroundColor: "white",
          color: "var(--color-sage)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: "16px",
          padding: "16px",
          borderRadius: "var(--radius-sm)",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}>
          Check My Date →
        </button>
      </div>
    </form>

    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 300, fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "16px" }}>
      No commitment required. We'll reply within one business day.
    </p>
  </div>
</section>
```

On submit, toggle a React `useState` that replaces the form with:
```jsx
<div style={{ textAlign: "center", padding: "48px 0" }}>
  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontStyle: "italic", fontSize: "clamp(28px, 3.5vw, 48px)", color: "white", marginBottom: "16px" }}>
    Thank you — we'll be in touch shortly.
  </p>
  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 300, fontSize: "16px", color: "rgba(255,255,255,0.75)" }}>
    Our wedding coordinator will reply to you within one business day.
  </p>
</div>
```

---

### SECTION 8 — FOOTER

**Container:** `background: var(--color-bg); border-top: 1px solid var(--color-border); padding: 72px var(--section-px) 32px`

**3-Column Grid:** `display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 60px`

**Column 1 — Brand + Address:**
- Logo: Cormorant Garamond 600 italic, 28px, `var(--color-charcoal)`
- Gold line: 40px wide, 1px tall, `var(--color-gold)`, `margin: 16px 0 20px`
- Tagline: Plus Jakarta Sans 300, 15px, `var(--color-text-mid)`, `margin-bottom: 28px`
- Address, email, phone: Plus Jakarta Sans 400, 14px, `var(--color-text-mid)`, line-height 2.0
- Map link: Plus Jakarta Sans 500, 14px, `var(--color-sage)`, hover underline

Text:
```
Ashford Manor

A 19th-century country estate offering exclusive wedding packages for 20–180 guests in the heart of Hertfordshire. Licensed for civil ceremonies, civil partnerships, and blessing ceremonies.

Ashford Manor Estate
Church Lane, Ashford
Hertfordshire, AL5 2PQ

enquiries@ashfordmanor.co.uk
01234 567 890

Get Directions →
```

**Column 2 — Social Links + Awards:**
```
Follow Our Journey

Instagram · @ashfordmanorweddings
Pinterest · @ashfordmanor
Facebook · Ashford Manor Estate

Awards & Memberships

★ Hitched Top Venue 2024
★ Guides for Brides Recommended
★ UKAWP Member
★ WeddingPlanner.co.uk — Gold Badge
★ Hitched Couples' Choice Award
```
Section label: Plus Jakarta Sans 600, 12px, uppercase, 0.1em letter-spacing, `var(--color-charcoal)`, `margin-bottom: 16px`. Social links: Plus Jakarta Sans 400, 14px, `var(--color-text-mid)`, hover `var(--color-sage)`. Awards: same style with `Star` icon (lucide, 14px, `var(--color-gold)`) preceding each item.

**Column 3 — Quick Links:**
```
Explore
Our Venue · Wedding Packages · Gallery · Testimonials · Blog · FAQs

Contact
Enquiry Form · Call: 01234 567 890 · Email: enquiries@ashfordmanor.co.uk
```
Same section label style. Links: Plus Jakarta Sans 400, 15px, `var(--color-text-mid)`, hover `var(--color-sage)`, displayed as a stacked list, `line-height: 2.2`.

**Bottom bar:** `border-top: 1px solid var(--color-border); padding-top: 28px; margin-top: 48px`
```
© 2024 Ashford Manor Estate Ltd. All rights reserved. · Privacy Policy · Terms & Conditions · Accessibility
```
Center-aligned, Plus Jakarta Sans 300, 13px, `var(--color-text-light)`.

---

## 7. ANIMATIONS

| Element | Type | Duration | Delay | Easing |
|---|---|---|---|---|
| Navbar (load) | Fade from y:-8 | 0.5s | 0s | ease-out |
| Hero eyebrow | Fade from y:12 | 0.6s | 0.1s | [0.22,1,0.36,1] |
| Hero headline | Fade from y:28 | 0.9s | 0.25s | [0.22,1,0.36,1] |
| Gold underline | scaleX 0→1 | 1.2s | 0.8s | [0.22,1,0.36,1] |
| Hero subline | Fade from y:16 | 0.7s | 0.5s | [0.22,1,0.36,1] |
| Capacity note | Fade in | 0.6s | 0.65s | ease-out |
| Hero CTAs | Fade from y:16 | 0.6s | 0.75s | [0.22,1,0.36,1] |
| Scroll chevron | Float y:0→10→0 | 2.5s | — | ease-in-out, Infinity |
| Venue space cards | Fade from y:32, stagger | 0.7s | index×0.12s | [0.22,1,0.36,1] |
| Venue card outer (hover) | scale 1.02 | 0.4s | — | [0.22,1,0.36,1] |
| Venue card inner img (hover) | scale 1.06 | 0.4s | — | [0.22,1,0.36,1] |
| Inclusion list items | Fade from x:12, stagger | 0.4s | index×0.05s | [0.22,1,0.36,1] |
| Gallery section heading | Fade from y:24 | 0.65s | 0s | [0.22,1,0.36,1] |
| Testimonial cards | Fade from y:28, stagger | 0.65s | index×0.12s | [0.22,1,0.36,1] |
| Availability headline | Fade from y:28 | 0.75s | 0s | [0.22,1,0.36,1] |
| Footer | Fade from y:16 | 0.6s | 0s | [0.22,1,0.36,1] |

All `whileInView` use `viewport={{ once: true, margin: "-60px" }}`.

---

## 8. RESPONSIVE SPECIFICATIONS

### Desktop (≥1024px)
- Navbar: 3-part layout `[left nav | center logo | right CTA]`
- Venue spaces: `repeat(3, 1fr)` grid
- What's Included: 2-column layout (`1fr 1.2fr`)
- Inclusions checklist: 2-column sub-grid inside right column
- Gallery: full 12-column asymmetric grid as specified
- Testimonials: `repeat(3, 1fr)`
- Enquiry form: 2-column grid
- Footer: 3-column grid

### Tablet (640px–1023px)
- Navbar: centered logo + hamburger
- Venue spaces: `repeat(2, 1fr)` — 2 cards row 1, 1 card full width row 2
- What's Included: single column, checklist below heading in `repeat(2, 1fr)`
- Gallery: `repeat(2, 1fr)` simple grid, images `aspect-ratio: 4/3`
- Testimonials: `repeat(2, 1fr)` — third card full width below
- Enquiry form: 2-column maintained
- Footer: `repeat(2, 1fr)` — column 3 wraps to full width

### Mobile (<640px)
- Hero headline at `clamp(44px, 11vw, 72px)`, gold line width `120px`, CTAs stack vertically (`flex-direction: column`, each full width)
- Venue spaces: `repeat(1, 1fr)`, `aspect-ratio: 16/9`
- What's Included: single column heading + single column checklist
- Gallery: `repeat(1, 1fr)`, all images `aspect-ratio: 4/3`
- Testimonials: single column stacked
- Enquiry form: single column (all fields full width)
- Footer: single column stacked, `gap: 40px`

---

## 9. FULL COPY

### Navbar
`Services · Gallery · Packages · Testimonials · Blog` | `Ashford Manor` | `Contact · Enquire`

### Hero
- Eyebrow: `Ashford, Hertfordshire · Est. 1847`
- Headline: `Where Your Story Begins.`
- Subline: `An exclusive country manor for intimate weddings and grand celebrations alike.`
- Capacity: `Capacity 20–180 guests · Licensed for civil ceremonies`
- CTA 1: `Check Availability`
- CTA 2: `View Our Gallery`

### Venue Spaces
- Eyebrow: `Our Spaces` | Headline: `Three Breathtaking Settings`
- Cards: The Grand Hall (200 guests) / The Orangery (80 guests) / The Garden Terrace (60 guests)

### What's Included
- Eyebrow: `Every Package Includes` | Headline: `What's Included`
- Prose: `Every Ashford Manor wedding package includes exclusive use of the estate and all its facilities. We believe your wedding day should feel entirely yours — no shared spaces, no conflicting events, no compromises.`

### Gallery
- Headline: `A Glimpse of Your Day` | Link: `View Full Gallery →`

### Testimonials
- Headline: `Words From Our Couples`
- Couple 1: Charlotte & James Whitmore / June 2024
- Couple 2: Amara & Daniel Okafor / September 2024
- Couple 3: Sophie & Miriam Leclair / April 2024

### Availability CTA
- Eyebrow: `Limited Dates Remaining`
- Headline: `Your Perfect Day Awaits.`
- Body: `We have limited availability for 2025 and 2026. Fill in your details and our wedding coordinator will be in touch within 24 hours.`
- Submit: `Check My Date →`
- Footnote: `No commitment required. We'll reply within one business day.`

### Footer
- Address: `Ashford Manor Estate, Church Lane, Ashford, Hertfordshire, AL5 2PQ`
- Email: `enquiries@ashfordmanor.co.uk` | Phone: `01234 567 890`
- Copyright: `© 2024 Ashford Manor Estate Ltd. All rights reserved. · Privacy Policy · Terms & Conditions · Accessibility`

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
- `ChevronDown` — hero scroll indicator
- `Check` — inclusions checklist
- `Star` — testimonial stars, footer awards
- `ArrowRight` — gallery link
- `Menu`, `X` — mobile nav
- `MapPin` — footer address
- `Phone` — footer phone
- `Mail` — footer email

**Key implementation notes:**
1. Import all Framer Motion from `motion/react`, never `framer-motion`
2. The gold underline `scaleX: 0 → 1` uses `animate` (not `whileInView`) so it fires as part of the hero load sequence, with `transformOrigin: "left center"` for left-to-right draw
3. Venue card hover: outer `motion.div` (scale 1.02) wraps an inner `motion.div` (scale 1.06) that contains the `<img>` — both must have `transition={{ duration: 0.4 }}`; outer div has `overflow: hidden` and `border-radius`
4. The gold separator lines (Effect 5) appear between Hero → Venue Spaces and between Testimonials → Availability CTA
5. The enquiry form uses a React `useState` boolean to toggle between the form and the thank-you confirmation state on submit
6. Gallery grid: on screens below 640px, collapse to a simple `repeat(1, 1fr)` grid — the custom `gridColumn` and `gridRow` values should be overridden with `gridColumn: "1 / -1"` and `gridRow: "auto"` at mobile via a CSS media query in `index.css`
