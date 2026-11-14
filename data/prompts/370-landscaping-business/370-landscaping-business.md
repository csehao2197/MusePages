# Landscaping Website — VERDANT

Build a modern, editorial landscaping and garden design website called "VERDANT" — warm white background, deep forest green accent (#2D6A4F), generous whitespace, large serif display typography. Clean, minimal, premium. Think high-end garden studio, not a lawn mowing company.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```

---

## Design System

```css
:root {
  --background: 60 20% 97%;          /* warm off-white #FAFAF8 */
  --foreground: 128 18% 13%;         /* deep forest #1B2A1D */
  --primary: 150 41% 30%;            /* forest green #2D6A4F */
  --primary-foreground: 60 20% 97%;
  --muted: 120 12% 93%;              /* pale sage #EBF0EB */
  --muted-foreground: 128 10% 48%;
  --border: 120 10% 87%;
  --card: 60 20% 99%;
}
```

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

- **Display headings**: Cormorant Garamond 600 italic — large, editorial, generous line height
- **Section headings**: Cormorant Garamond 600, not italic
- **Body / UI**: Inter 400–500, text-sm to text-base
- **Labels / caps**: Inter 500, uppercase, tracking-[0.18em], text-xs, text-primary

---

## Visual Effects

### 1. Clip-path image reveal on scroll
```tsx
// Images reveal left-to-right as they enter viewport
initial={{ clipPath: "inset(0 100% 0 0)" }}
whileInView={{ clipPath: "inset(0 0% 0 0)" }}
transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
viewport={{ once: true, margin: "-60px" }}
```

### 2. Horizontal marquee ticker
```tsx
// Green band between hero and services
// Scrolls continuously: "GARDEN DESIGN · LAWN CARE · PLANTING · LANDSCAPE · MAINTENANCE · "
// Implemented as two identical spans side by side, animating x: 0 → -50% on infinite loop
<div className="overflow-hidden bg-[hsl(var(--primary))] py-4">
  <motion.div
    className="flex whitespace-nowrap"
    animate={{ x: ["0%", "-50%"] }}
    transition={{ duration: 22, ease: "linear", repeat: Infinity }}
  >
    {[0, 1].map(i => (
      <span key={i} className="text-white font-['Inter'] text-xs font-500 uppercase tracking-[0.22em] pr-12">
        GARDEN DESIGN &nbsp;·&nbsp; LAWN CARE &nbsp;·&nbsp; PLANTING &nbsp;·&nbsp; LANDSCAPE ARCHITECTURE &nbsp;·&nbsp; SEASONAL MAINTENANCE &nbsp;·&nbsp; OUTDOOR LIVING &nbsp;·&nbsp;
      </span>
    ))}
  </motion.div>
</div>
```

### 3. Staggered fade-up (Framer Motion)
```tsx
initial={{ opacity: 0, y: 28 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.65, ease: "easeOut", delay: index * 0.1 }}
viewport={{ once: true, margin: "-60px" }}
```

### 4. Image hover zoom
```tsx
// On service/project cards — inner image scales on card hover
<div className="overflow-hidden rounded-2xl">
  <motion.img
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="w-full h-full object-cover object-center"
  />
</div>
```

### 5. Botanical SVG line decoration
```tsx
// Thin hand-drawn style botanical branch SVG — decorative only, aria-hidden
// Used as section divider and corner ornament in hero
// Draw as a simple SVG path: thin curved branch with 3–4 small leaves
// stroke: hsl(var(--primary)), strokeWidth: 1, fill: none, opacity: 0.3
// Example (inline, simplified):
<svg viewBox="0 0 200 80" className="w-48 opacity-30 text-primary" fill="none" stroke="currentColor" strokeWidth="1">
  <path d="M10 60 C50 40 80 20 150 10" />          {/* main branch */}
  <path d="M60 35 C65 20 78 15 90 22" />            {/* leaf 1 */}
  <path d="M100 22 C108 8 120 6 128 14" />          {/* leaf 2 */}
  <path d="M40 45 C42 30 52 26 62 32" />            {/* leaf 3 */}
</svg>
```

---

## Component Breakdown

### 1 — Navbar

- Fixed top, h-[64px], z-50, bg-[hsl(var(--background))]/90, backdrop-blur-md
- Border-bottom: 1px solid hsl(var(--border))
- max-w-[1120px] mx-auto px-6, flex justify-between items-center
- Left: wordmark `font-['Cormorant_Garamond'] text-xl font-semibold italic text-[hsl(var(--foreground))] tracking-wide` — "Verdant"
- Center (desktop): nav links — "Services" · "Projects" · "About" · "Contact"
  - `text-sm text-muted-foreground hover:text-foreground transition-colors`
- Right: `h-10 px-6 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 transition-opacity` — "Get a Quote"
- Mobile: hamburger (lucide Menu, `text-foreground`), center nav hidden

---

### 2 — Hero

- `min-h-screen grid grid-cols-1 md:grid-cols-2` — split layout
- Left half: `flex flex-col justify-center px-8 md:px-16 lg:px-24 py-32`
- Right half: full-height image

**Left content:**

Label: `text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-8` — "Garden Design Studio"

Botanical SVG decoration above headline (see effect #5 above), `mb-4`

H1:
```tsx
<h1 className="font-['Cormorant_Garamond'] italic font-semibold text-[clamp(3.2rem,5.5vw,5.5rem)] leading-[1.05] text-[hsl(var(--foreground))]">
  Spaces that<br />
  <span className="text-[hsl(var(--primary))]">breathe.</span>
</h1>
```

Sub: `text-sm text-[hsl(var(--muted-foreground))] mt-8 max-w-[340px] leading-relaxed` — "We design and build outdoor spaces that feel as intentional as the homes they surround. Garden design, planting, and landscape architecture for discerning clients."

CTAs: `flex gap-3 mt-10`
- Primary: `h-11 px-7 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 transition-opacity` — "View Our Work"
- Secondary: `h-11 px-7 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm font-medium hover:border-[hsl(var(--primary))] transition-colors` — "Get a Quote"

Stats row: `flex gap-8 mt-14 pt-8 border-t border-[hsl(var(--border))]`
```
120+         14 yrs         98%
Projects     Experience     Satisfaction
```
Number: `font-['Cormorant_Garamond'] font-semibold text-3xl text-[hsl(var(--foreground))]`
Label: `text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest mt-0.5`

**Right side — hero image:**
```tsx
<div className="relative h-full min-h-[60vh] md:min-h-screen overflow-hidden">
  {/* clip-path reveal animation wraps the image div */}
  {/* Image: lush formal garden with manicured hedges, stone pathway, soft morning light, rich deep greens, minimal and elegant, top-down or eye-level perspective, editorial photography */}
  <img
    src=""
    alt="Formal garden with manicured hedges and stone pathway"
    className="w-full h-full object-cover object-center"
  />
  {/* subtle green overlay at bottom edge to blend into page */}
  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[hsl(var(--background))] to-transparent" />
</div>
```

---

### 3 — Marquee Ticker

Full-width green band — see Visual Effect #2 above. No max-width constraint.

---

### 4 — Services

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- Label: `text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-5` — "What We Do"
- H2: `font-['Cormorant_Garamond'] font-semibold text-4xl md:text-5xl text-[hsl(var(--foreground))]` — "Every outdoor space tells a story."
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6 mt-16`

**Card:** `rounded-2xl overflow-hidden bg-[hsl(var(--card))] border border-[hsl(var(--border))] group`

```tsx
{/* image top */}
<div className="h-[240px] overflow-hidden">
  <motion.img
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    src=""
    alt="..."
    className="w-full h-full object-cover object-center"
  />
</div>
{/* text bottom */}
<div className="p-6">
  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--primary))] mb-3">01</p>
  <h3 className="font-['Cormorant_Garamond'] font-semibold text-2xl text-[hsl(var(--foreground))] mb-3">Garden Design</h3>
  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">Full-service design from concept to completion. We create gardens that work with your home's architecture and the natural landscape.</p>
  {/* animated underline CTA */}
  <button className="mt-5 text-sm font-medium text-[hsl(var(--primary))] flex items-center gap-1.5 group">
    Learn more
    <span className="group-hover:translate-x-1 transition-transform">→</span>
  </button>
</div>
```

Service data (3 cards):

| No. | Title | Description | Image |
|---|---|---|---|
| 01 | Garden Design | Full-service design from concept to completion. We create gardens that work with your home's architecture and the natural landscape. | manicured garden border with perennial planting, lush layered greens, natural stone edging, soft daylight, editorial photography |
| 02 | Landscape Architecture | Large-scale outdoor environments — terraces, water features, lighting, and structural planting for residential and commercial clients. | modern landscape terrace with geometric planters, clean lines, architectural planting, golden hour light |
| 03 | Seasonal Maintenance | Year-round care that keeps your garden performing at its peak. Pruning, replanting, soil health, and everything in between. | gardener tending manicured hedges with topiary tools, green garden backdrop, natural documentary photography |

---

### 5 — Featured Project (Full-width split)

- `py-24 md:py-32 bg-[hsl(var(--muted))]`
- max-w-[1120px] mx-auto px-6
- `grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center`

**Left — text:**
- Label: `text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-5` — "Featured Project"
- H2: `font-['Cormorant_Garamond'] italic font-semibold text-4xl md:text-5xl leading-tight text-[hsl(var(--foreground))]` — "The Whitmore Garden, Surrey"
- Body: `text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mt-6` — "A complete rear garden transformation across 1.2 acres. Working with the existing mature trees, we introduced a formal lawn, mixed perennial borders, a sunken seating area, and a kitchen garden enclosed by espaliered apple trees."
- Detail tags: `flex flex-wrap gap-2 mt-8`
  - Each: `text-xs border border-[hsl(var(--border))] px-3 py-1.5 rounded-full text-[hsl(var(--muted-foreground))]`
  - "1.2 Acres" · "18 Month Project" · "Full Design & Build" · "Surrey, UK"
- CTA: `mt-8 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))] hover:gap-3 transition-all` — "View Full Case Study →"

**Right — image (clip-path reveal):**
```tsx
<div className="relative rounded-2xl overflow-hidden h-[480px]">
  {/* Image: English country garden, wide lawn surrounded by lush mixed borders, mature trees framing the view, formal yet natural, warm afternoon light, editorial landscape photography */}
  <img src="" alt="The Whitmore Garden Surrey" className="w-full h-full object-cover object-center" />
  {/* floating badge */}
  <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-[hsl(var(--border))]">
    <p className="font-['Cormorant_Garamond'] font-semibold text-lg text-[hsl(var(--foreground))]">2024</p>
    <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Project of the Year</p>
  </div>
</div>
```

---

### 6 — Process

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- Label + H2 centered: `text-center`
  - Label: "How We Work"
  - H2: `font-['Cormorant_Garamond'] font-semibold text-4xl md:text-5xl` — "From first meeting to final planting."
- Steps: `grid grid-cols-1 md:grid-cols-4 gap-8 mt-16`

**Step card:** plain, no background — just number + title + text
- Number: `font-['Cormorant_Garamond'] italic text-5xl font-semibold text-[hsl(var(--primary))] opacity-40` — "01"
- Divider: `h-px w-full bg-[hsl(var(--border))] my-4`
- Title: `font-['Cormorant_Garamond'] font-semibold text-xl text-[hsl(var(--foreground))] mb-3` 
- Body: `text-sm text-[hsl(var(--muted-foreground))] leading-relaxed`

| Step | Title | Body |
|---|---|---|
| 01 | Consultation | We visit your site, listen to your goals, and assess the space. No obligation, no pressure — just a conversation. |
| 02 | Design | We produce a full planting and layout plan, 3D visualisations, and material schedules for your approval. |
| 03 | Build | Our team handles all groundworks, construction, and planting to the exact specification agreed. |
| 04 | Care | Ongoing maintenance plans to keep your garden at its best through every season. |

---

### 7 — Testimonial

- `py-24 md:py-32 bg-[hsl(var(--muted))]`
- max-w-[720px] mx-auto px-6 text-center
- Botanical SVG decoration centered above quote (see effect #5), `mb-8 mx-auto`
- Large quote mark: `font-['Cormorant_Garamond'] italic text-7xl text-[hsl(var(--primary))] opacity-20 leading-none` — `"`
- Quote: `font-['Cormorant_Garamond'] italic text-2xl md:text-3xl leading-relaxed text-[hsl(var(--foreground))] mt-2` — "Working with Verdant was the single best decision we made during our renovation. Our garden now feels like a proper extension of our home — somewhere we actually want to spend time."
- Author: `text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--primary))] mt-8` — "Sarah & James H. — Surrey"
- Star row: `flex justify-center gap-1 mt-4 text-[hsl(var(--primary))]` — 5× `★`

---

### 8 — CTA

- `py-24 md:py-32 bg-[hsl(var(--primary))]`
- max-w-[720px] mx-auto px-6 text-center
- Botanical SVG decoration centered above, `mb-8 mx-auto`, stroke: rgba(255,255,255,0.3)
- H2: `font-['Cormorant_Garamond'] italic font-semibold text-[clamp(2.8rem,6vw,5rem)] leading-tight text-white` — "Ready to transform your garden?"
- Sub: `text-sm text-white/70 mt-6` — "We take on a limited number of projects each year. Get in touch early to discuss your space."
- CTA: `mt-10 h-12 px-10 rounded-full bg-white text-[hsl(var(--primary))] text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2` — "Get a Free Consultation →"

---

### 9 — Footer

- `py-14 border-t border-[hsl(var(--border))]`
- max-w-[1120px] mx-auto px-6
- `grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-start`
- Col 1: wordmark italic + `text-xs text-[hsl(var(--muted-foreground))] mt-2 leading-relaxed` — "Garden design and landscape architecture for residential and commercial clients." + `mt-4 text-xs text-[hsl(var(--muted-foreground))]` — "© 2025 Verdant Studio"
- Col 2: `text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] mb-4` — "Pages" + nav links list `text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors` — Services · Projects · About · Process · Contact
- Col 3: `text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] mb-4` — "Contact" + `text-sm text-[hsl(var(--muted-foreground))]` — "hello@verdantstudio.co" · "+44 20 7946 0000" · "London & Surrey, UK"

---

## Animations

```
Navbar: opacity 0 → 1, delay 0, duration 0.4s
Hero label: opacity 0, y 16 → 0, delay 0.1s, duration 0.5s
Hero SVG decoration: opacity 0 → 0.3, delay 0.15s, duration 0.6s
Hero H1 lines: stagger per line, delay 0.2s + index*0.12, duration 0.65s, ease easeOut
Hero sub: delay 0.5s, duration 0.5s
Hero CTAs: delay 0.65s, duration 0.5s
Hero stats: stagger per stat, delay 0.8s + index*0.1
Hero right image: clip-path inset(0 100% 0 0) → inset(0 0% 0 0), delay 0.3s, duration 0.9s, ease [0.76,0,0.24,1]
Marquee: infinite continuous scroll, duration 22s linear
All scroll sections: useInView once:true, margin "-60px", stagger children 0.1s
Service cards: y 32 → 0, opacity 0 → 1, stagger 0.1s
Featured project: text side y 32 → 0, image clip-path reveal, both on same scroll trigger
Process steps: y 24 → 0, opacity 0 → 1, stagger 0.12s
Testimonial: opacity 0, y 24 → 0, single block, duration 0.65s
CTA block: opacity 0, y 32 → 0, scale 0.97 → 1, duration 0.65s
```

---

## Responsive

```
Navbar: desktop → full links + CTA; mobile → logo + hamburger, links hidden
Hero: 2-col desktop → 1-col mobile (text first, image below, min-h-[50vh] for image)
Hero H1: clamp(3.2rem, 5.5vw, 5.5rem) — scales naturally
Hero CTAs: flex-row desktop → flex-col w-full max-w-[300px] mx-auto mobile
Services grid: 3-col desktop → 1-col mobile
Featured: 2-col desktop → 1-col mobile (image above text), image h-[320px] mobile
Process: 4-col desktop → 2-col mobile → 1-col small mobile
Footer: 3-col desktop → 1-col mobile stacked
CTA H2: clamp(2.8rem, 6vw, 5rem) — scales naturally
```

---

## Full Copy

| Element | Copy |
|---------|------|
| Brand | Verdant |
| Nav links | Services · Projects · About · Contact |
| Nav CTA | Get a Quote |
| Hero label | Garden Design Studio |
| Hero H1 | Spaces that / breathe. |
| Hero sub | We design and build outdoor spaces that feel as intentional as the homes they surround. Garden design, planting, and landscape architecture for discerning clients. |
| Hero CTA primary | View Our Work |
| Hero CTA secondary | Get a Quote |
| Stats | 120+ Projects · 14 yrs Experience · 98% Satisfaction |
| Marquee | GARDEN DESIGN · LAWN CARE · PLANTING · LANDSCAPE ARCHITECTURE · SEASONAL MAINTENANCE · OUTDOOR LIVING |
| Services label | What We Do |
| Services H2 | Every outdoor space tells a story. |
| Featured label | Featured Project |
| Featured H2 | The Whitmore Garden, Surrey |
| Featured body | A complete rear garden transformation across 1.2 acres. Working with the existing mature trees, we introduced a formal lawn, mixed perennial borders, a sunken seating area, and a kitchen garden enclosed by espaliered apple trees. |
| Featured badge | 2024 / Project of the Year |
| Process label | How We Work |
| Process H2 | From first meeting to final planting. |
| Quote | Working with Verdant was the single best decision we made during our renovation. Our garden now feels like a proper extension of our home — somewhere we actually want to spend time. |
| Quote author | Sarah & James H. — Surrey |
| CTA H2 | Ready to transform your garden? |
| CTA sub | We take on a limited number of projects each year. Get in touch early to discuss your space. |
| CTA button | Get a Free Consultation → |
| Footer tagline | Garden design and landscape architecture for residential and commercial clients. |
| Footer copyright | © 2025 Verdant Studio |
| Footer contact | hello@verdantstudio.co · +44 20 7946 0000 · London & Surrey, UK |

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx"
}
```
