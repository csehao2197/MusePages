# Halstead Construction — General Contractor Website Prompt

## 1. Goal Statement
Build a heavyweight general contractor website for **Halstead Construction**, defined by raw concrete greys, safety amber, and an industrial grotesk — a site that looks like it was built by people who actually pour foundations, with a project gallery and a build-phase timeline doing the selling.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(220, 8%, 12%);        /* #1c1e21 charcoal */
  --foreground: hsl(30, 6%, 93%);         /* #efedeb concrete white */
  --primary: hsl(38, 92%, 52%);           /* #f5a218 safety amber */
  --primary-foreground: hsl(220, 10%, 10%);
  --muted-foreground: hsl(220, 5%, 60%);
  --border: hsl(220, 7%, 24%);
  --card: hsl(220, 8%, 16%);
  --card-light: hsl(30, 6%, 95%);         /* light sections invert */
  --steel: hsl(210, 10%, 42%);
}
```

Light sections (Projects, Process) invert: `--card-light` background with `--background` text.

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```

- **H1 / hero:** `'Archivo', sans-serif;` weight 800, uppercase, clamp(44px, 6.4vw, 104px), letter-spacing: -0.03em, line-height: 0.94
- **H2:** Archivo 700, uppercase, 34–52px, letter-spacing: -0.02em
- **H3 / card titles:** Archivo 600, 18–22px
- **Body:** Inter 300–400, 17px, line-height: 1.72
- **Eyebrows / labels:** Archivo 600, uppercase, letter-spacing: 0.2em, 11px, amber
- **Stats / project numbers:** Archivo 800, tabular-nums

---

## 5. Visual Effects

### Effect 1 — Amber Hazard Stripe Divider
```jsx
<div
  className="h-3 w-full"
  style={{
    backgroundImage: 'repeating-linear-gradient(45deg, var(--primary) 0 18px, transparent 18px 36px)',
  }}
/>
```

### Effect 2 — Project Card with Sliding Metadata Panel
```tsx
<div className="group relative overflow-hidden">
  {/* Image: completed commercial building exterior, dramatic low-angle architectural photography, strong directional daylight, clean lines */}
  <img src="" alt="Completed project" className="w-full aspect-[4/3] object-cover object-center transition-transform duration-700 group-hover:scale-105" />
  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,30,33,0.9) 0%, transparent 55%)' }} />
  <div className="absolute inset-x-0 bottom-0 translate-y-6 p-6 transition-transform duration-400 group-hover:translate-y-0">
    <span className="font-display text-[11px] uppercase tracking-[0.2em] text-[var(--primary)]">Commercial · 2025</span>
    <h3 className="mt-2 font-display text-2xl uppercase text-white">Ridgeline Logistics Center</h3>
    <div className="mt-3 flex gap-5 text-sm text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span>142,000 sq ft</span><span>14 months</span><span>$38M</span>
    </div>
  </div>
</div>
```

### Effect 3 — Build Phase Timeline with Scroll Progress
```tsx
// A vertical amber line whose height maps to scroll progress through the section
const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.4'] });
<motion.div
  className="absolute left-6 top-0 w-[3px] origin-top bg-[var(--primary)]"
  style={{ height: '100%', scaleY: scrollYProgress }}
/>
// Each phase node fades and slides in as the line passes it
```

### Effect 4 — Stat Count-Up on Concrete Band
```
Numbers count from 0 over 1800ms on useInView, ease-out, tabular-nums
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 78px, `fixed top-0 z-40`, `rgba(28,30,33,0.95)` with blur; amber 3px bottom border after `scrollY > 60`
- Left: bold "HALSTEAD" (Archivo 800, tracking -0.02em) + amber square dot + "CONSTRUCTION" (Inter 500, 9px, letterspaced)
- Center: Projects · Services · Process · About · Safety
- Right: phone (Archivo 600, amber) + `Request a Bid` (amber filled, square corners)
- Mobile: wordmark + hamburger; full-screen charcoal overlay, Archivo 34px uppercase links

### Section 2 — Hero (Full-Bleed, Bottom-Weighted)
- `h-screen`, content anchored bottom-left, `pb-20 px-6 md:px-16`
```jsx
{/* Image: active construction site at dusk, steel frame silhouette against a deep blue sky, tower crane, work lights glowing amber, industrial and cinematic */}
<img src="" alt="Construction site at dusk" className="absolute inset-0 w-full h-full object-cover object-center" />
<div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,30,33,0.95) 0%, rgba(28,30,33,0.45) 50%, rgba(28,30,33,0.75) 100%)' }} />
```
- Eyebrow: `DENVER, CO · GENERAL CONTRACTOR · LICENSED & BONDED SINCE 1988`
- H1: `WE BUILD IT\nRIGHT THE\nFIRST TIME.`
- Subline (max-w-xl): `Commercial, industrial, and multifamily construction across the Front Range. Self-performed concrete and steel, in-house project management, and a schedule we actually hold.`
- CTA row: `Request a Bid` (amber) + `See Our Work` (ghost, concrete-white border)
- Bottom credential row: `EMR 0.68` · `LEED Accredited` · `$120M Bonding Capacity` · `38 Years`

### Section 3 — Hazard Stripe Divider (Effect 1)

### Section 4 — Stats Band
- `--card` background, 4-col divided by vertical borders
- `$1.4B` Built to date · `310` Projects delivered · `0.68` EMR safety rating · `92%` Repeat clients

### Section 5 — Services
- `--background`, eyebrow `WHAT WE BUILD` + H2 `SERVICES`
- **2x3 grid** of service cards: `--card` background, amber left border 4px, lucide icon, title, 2-sentence description
- Preconstruction · General Contracting · Design-Build · Construction Management · Self-Perform Concrete · Tenant Improvement

### Section 6 — Projects (Light Section)
- `--card-light` background, dark text
- Eyebrow `SELECTED WORK` + H2 `PROJECTS`
- Filter row: All · Commercial · Industrial · Multifamily · Institutional (amber active state, square buttons)
- **3-col masonry-ish grid** of project cards (Effect 2), first card spans 2 columns
- Below: `View all 310 projects →`

### Section 7 — Process (Light Section)
- `--card-light`, eyebrow `HOW A JOB RUNS` + H2 `FROM BID TO KEYS`
- Vertical timeline with scroll-linked amber line (Effect 3), 6 phases
- Each phase: amber number badge, title (Archivo 700 uppercase), 2-sentence description, typical duration in mono-ish small caps

### Section 8 — Safety
- `--background`, 2-col split
- Left: eyebrow `SAFETY`, H2 `AN EMR OF 0.68 IS NOT AN ACCIDENT`, paragraph, then 4 stat lines with amber rules
- Right: full-bleed image
```jsx
{/* Image: construction workers in full PPE reviewing plans on site, hard hats and high-vis vests, natural daylight, documentary style, competent and focused */}
```

### Section 9 — Team / Leadership
- `--card`, 4-col grid, grayscale portraits with amber bottom border on hover
- Each: name (Archivo 600 uppercase), role, years-with-firm line

### Section 10 — Clients & Certifications
- `--background`, two rows of text-only badges: repeat client names, then certifications (AGC, ABC, OSHA 30, LEED AP, MBE)

### Section 11 — Bid CTA
- Full-bleed amber background, charcoal text
- H2 `GOT PLANS? SEND THEM OVER.`
- Short line + 2 CTAs: `Request a Bid` (charcoal filled) + phone number (large, charcoal)

### Section 12 — Footer
- `hsl(220, 10%, 8%)`, amber top border 3px, 4 columns
- Brand + license numbers / Services / Projects / Contact + office address
- Bottom strip: © line, `Equal Opportunity Employer`, `Careers →` in amber

---

## 7. Animations

- **Hero:** H1 lines reveal with `clipPath: inset(0 0 100% 0) → inset(0 0 0 0)`, 0.85s each, stagger 0.1s; subline and CTAs fade-up at 0.55s
- **Navbar:** amber bottom border scales from left, 0.4s, at `scrollY > 60`
- **Hazard stripe:** background-position shifts 36px on loop, 3s linear infinite (subtle motion, respects `prefers-reduced-motion`)
- **Stats:** count-up 1800ms on `useInView`
- **Service cards:** stagger `i * 0.08`, `y: 28 → 0`; hover widens amber left border 4px → 8px, 0.25s
- **Project cards:** image scales 1 → 1.05 over 0.7s; metadata panel slides `translateY(24px) → 0` over 0.4s; sq-ft/duration/value row fades in at 0.3s
- **Filter change:** `AnimatePresence` grid re-flow, `opacity 0→1, scale 0.98→1`, 0.35s
- **Process timeline:** amber line `scaleY` bound to `scrollYProgress`; nodes fade + slide `x: -20 → 0` as reached
- **Team portraits:** amber 3px bottom border scales from left on hover, 0.3s

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: wordmark + hamburger; overlay menu full-screen with amber underlines
- Hero: H1 clamps to 44px, credential row becomes a 2x2 grid, CTAs stacked full-width
- Stats band: 2x2 grid with borders on all sides
- Services: 1-col
- Projects: 1-col, feature card same size as others; filter row horizontally scrollable
- Process: timeline stays vertical, amber line moves to `left-4`, text indents
- Safety: image stacks below text
- Team: 2-col
- Bid CTA: phone number becomes a tap-to-call button

### Tablet (768–1024px)
- Services 2-col · Projects 2-col with feature card full-width · Team 2-col · Stats 4-col retained at smaller type

### Desktop (> 1024px)
- Max width 1320px (wider than typical — this is a heavy, confident layout), `px-16`

---

## 9. Full Copy

### Brand
**HALSTEAD CONSTRUCTION** — Denver, Colorado

### Navbar
Projects · Services · Process · About · Safety · `(303) 555-0126` · [Button] Request a Bid

### Hero
- Eyebrow: `DENVER, CO · GENERAL CONTRACTOR · LICENSED & BONDED SINCE 1988`
- H1: `WE BUILD IT RIGHT THE FIRST TIME.`
- Subline: `Commercial, industrial, and multifamily construction across the Front Range. Self-performed concrete and steel, in-house project management, and a schedule we actually hold.`
- CTA 1: `Request a Bid` · CTA 2: `See Our Work`
- Credentials: `EMR 0.68` · `LEED Accredited` · `$120M Bonding Capacity` · `38 Years`

### Stats
- `$1.4B` — Built to date
- `310` — Projects delivered
- `0.68` — EMR safety rating
- `92%` — Repeat clients

### Services
Eyebrow: `WHAT WE BUILD` — H2: `SERVICES`

1. **Preconstruction** (icon: `ClipboardList`) — Budgeting, constructability review, and value engineering before a shovel moves. Most of the money on a job is decided here, not in the field.
2. **General Contracting** (icon: `HardHat`) — Hard-bid and negotiated work with our own superintendents on every site. We do not subcontract supervision.
3. **Design-Build** (icon: `PenTool`) — Single-contract delivery with our architecture and engineering partners. One team, one schedule, one point of accountability.
4. **Construction Management** (icon: `Network`) — CM at-risk and agency CM for owners who want transparency into every buyout and change order.
5. **Self-Perform Concrete & Steel** (icon: `Layers`) — Foundations, slabs, tilt-up, and structural steel erected by our own crews. It is how we hold schedule when trades are tight.
6. **Tenant Improvement** (icon: `Building2`) — Occupied-space buildouts on nights and weekends, phased so your tenants keep operating.

### Projects
Eyebrow: `SELECTED WORK` — H2: `PROJECTS`
Filters: `All` · `Commercial` · `Industrial` · `Multifamily` · `Institutional`

1. **Ridgeline Logistics Center** · Industrial · 2025 · 142,000 sq ft · 14 months · $38M
2. **Cherry Creek Medical Pavilion** · Commercial · 2025 · 88,000 sq ft · 19 months · $54M
3. **The Foundry Lofts** · Multifamily · 2024 · 214 units · 22 months · $61M
4. **Front Range Technical College — Trades Building** · Institutional · 2024 · 64,000 sq ft · 16 months · $29M
5. **Baxter Cold Storage Expansion** · Industrial · 2023 · 96,000 sq ft · 11 months · $31M
6. **Union Station Office Retrofit** · Commercial · 2023 · 120,000 sq ft · 15 months · $42M

### Process
Eyebrow: `HOW A JOB RUNS` — H2: `FROM BID TO KEYS`

1. **01 — Bid & Award** *(2–6 weeks)* — We review documents, walk the site, and price it honestly. If the budget and the drawings do not agree, you will hear it from us before you award, not during.
2. **02 — Preconstruction** *(4–10 weeks)* — Constructability review, long-lead procurement, permit strategy, and a schedule built backwards from your occupancy date.
3. **03 — Mobilisation** *(1–2 weeks)* — Site logistics, safety plan, temporary utilities, and a superintendent on site from day one who stays until closeout.
4. **04 — Construction** *(varies)* — Weekly owner-architect-contractor meetings, a live schedule you can see, and change orders priced within five business days. No surprises at month nine.
5. **05 — Closeout** *(3–5 weeks)* — Punch list, commissioning, as-builts, O&M manuals, and training for your facilities team before we hand over keys.
6. **06 — Warranty** *(12 months minimum)* — One-year warranty walk at month eleven, and a phone number that still works at month thirteen.

### Safety
Eyebrow: `SAFETY` — H2: `AN EMR OF 0.68 IS NOT AN ACCIDENT`
Paragraph: `Every superintendent holds OSHA 30. Every crew starts the day with a documented task-specific hazard analysis. We stop work for conditions other contractors would push through, and we have lost bids because of it. That is a trade we will keep making.`
- `0.68` — Experience Modification Rate
- `0` — Lost-time incidents in 2025
- `100%` — Supervisors OSHA 30 certified
- `Daily` — Documented pre-task safety planning

### Leadership
Eyebrow: `WHO RUNS THE JOB` — H2: `LEADERSHIP`
1. **RAY HALSTEAD** — Founder & CEO — 38 years
2. **DENISE OKONKWO** — President — 21 years
3. **MARTY VELASQUEZ** — VP, Field Operations — 26 years
4. **SAM KLEIN** — VP, Preconstruction — 14 years

### Clients & Certifications
Eyebrow: `REPEAT CLIENTS`
`Baxter Cold Chain` · `Front Range Technical College` · `Cherry Creek Health` · `Anders Development` · `Union Station Partners` · `Meridian Industrial REIT`

Eyebrow: `CERTIFICATIONS`
`AGC Member` · `ABC Member` · `OSHA 30 — All Supervisors` · `LEED AP on Staff` · `Colorado GC License #GC-1988-0442`

### Bid CTA
H2: `GOT PLANS? SEND THEM OVER.`
Subline: `Send drawings, a scope narrative, or a napkin sketch. We will tell you within a week whether we are the right contractor for it — including when the answer is no.`
CTA: `Request a Bid` · Phone: `(303) 555-0126`

### Footer
- HALSTEAD CONSTRUCTION · `Commercial · Industrial · Multifamily · Front Range, Colorado`
- Address: `4400 Brighton Boulevard, Denver, CO 80216`
- Colorado GC License #GC-1988-0442 · Bonded & Insured
- © 2026 Halstead Construction Inc. All rights reserved. · Equal Opportunity Employer · `Careers →`

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

**Tailwind config additions:**
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Archivo', 'Helvetica Neue', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'hal-charcoal': '#1c1e21',
        'hal-amber': '#f5a218',
        'hal-concrete': '#efedeb',
      },
      borderRadius: { none: '0px', DEFAULT: '0px' },
    },
  },
};
```
