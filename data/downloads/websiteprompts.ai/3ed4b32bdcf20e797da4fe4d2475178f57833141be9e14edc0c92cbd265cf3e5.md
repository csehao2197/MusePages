# Thread & Chalk — Bespoke Tailor Website Prompt

## 1. Goal Statement
Build a quiet, craft-first bespoke tailoring website for **Thread & Chalk**, defined by charcoal, chalk white, and a fine editorial serif — a site that sells the eleven-week process and the fitting room rather than a product grid.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(30, 8%, 12%);        /* #211f1d charcoal */
  --foreground: hsl(38, 22%, 92%);       /* #eee8df chalk */
  --primary: hsl(38, 34%, 66%);          /* #c4ac82 thread gold */
  --primary-foreground: hsl(30, 10%, 10%);
  --muted-foreground: hsl(34, 8%, 58%);
  --border: hsl(30, 8%, 22%);
  --card: hsl(30, 8%, 16%);
  --chalk-line: hsl(200, 32%, 70%);      /* tailor chalk blue */
  --light: hsl(38, 24%, 94%);            /* inverted sections */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** EB Garamond 400, clamp(38px, 5vw, 72px), line-height 1.08
- **H2:** EB Garamond 400, 30–46px
- **H3:** Inter 500, 17–19px
- **Body:** Inter 300, 16px, line-height 1.82
- **Eyebrows:** Inter 500, uppercase, letter-spacing 0.24em, 10px, thread gold
- **Prices / measurements:** EB Garamond 500, tabular-nums

## 5. Visual Effects

**Effect 1 — Chalk-line measurement annotations.** On the process and cloth sections, thin dashed chalk-blue lines with small measurement labels animate in over the imagery, drawn with SVG `stroke-dasharray` and `pathLength`, mimicking a tailor's chalk marks on cloth.

```tsx
<svg className="pointer-events-none absolute inset-0" viewBox="0 0 400 500">
  <motion.line x1="60" y1="120" x2="340" y2="120"
    stroke="var(--chalk-line)" strokeWidth="1" strokeDasharray="6 5"
    initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 0.8 }}
    viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
  <motion.text x="348" y="124" fill="var(--chalk-line)" fontSize="10" letterSpacing="1.5"
    initial={{ opacity: 0 }} whileInView={{ opacity: 0.85 }} viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 1.2 }}>CHEST 102</motion.text>
</svg>
```

**Effect 2 — Cloth swatch hover.** A grid of cloth swatches where hovering scales the swatch slightly and reveals the mill name, weight in grams and composition beneath, with a thread-gold hairline expanding under the label.

## 6. Component Breakdown

1. **Navbar** — 74px, fixed, charcoal with blur, thread-gold hairline on scroll. Serif wordmark left, links centre, `Book a Fitting` gold outline button right.
2. **Hero** — 90vh, full-bleed workshop photograph with a heavy left gradient. Eyebrow, serif H1, subline, two CTAs. *Image: tailor's workbench with chalk, shears and half-finished cloth, warm low workshop light, hands visible, craft documentary photography.*
3. **What bespoke means** — a short honest statement distinguishing bespoke from made-to-measure, on an inverted light band.
4. **The process** — eleven weeks in five stages with chalk-line annotations (Effect 1): consultation, pattern cutting, first fitting, forward fitting, finishing.
5. **Cloth** — swatch grid (Effect 2) with six mills, composition, weight and seasonality.
6. **What we make** — 2x3: two-piece suit, three-piece, dinner suit, overcoat, sport coat, shirts.
7. **Pricing** — a plain table with starting prices by garment and cloth tier, plus an honest note about what drives cost.
8. **The fitting room** — split image and text describing what a first appointment involves and how long to allow.
9. **Alterations and restoration** — a service for garments not made here, including remodelling inherited suits.
10. **The workshop** — a short paragraph on who actually cuts and sews, with a note that nothing is outsourced overseas.
11. **Visit** — address, appointment-only note, travelling fitting dates in other cities.
12. **Footer** — near-black, thread-gold hairline, three columns, established year, appointment line.

## 7. Animations
- Hero: image scales `1.04 → 1` over 14s; H1 fades up 0.9s
- Chalk lines: `pathLength 0 → 1` over 1s, labels fade in at 1.2s delay
- Light band inversion: background cross-fades over 0.6s as the section enters
- Swatches: scale `1 → 1.05` on hover over 0.5s; gold hairline expands under the label 0.4s
- Process stages: fade-up staggered 0.12s with the week label appearing first
- Pricing rows: fade in staggered 0.04s
- Motion is slow throughout — nothing on this site should feel hurried

## 8. Responsive
- **Mobile (<768px):** hamburger with a full-screen charcoal overlay; H1 clamps to 38px; chalk annotations reduce to two lines to avoid clutter; swatches 2-col with details always visible rather than hover-gated; pricing table becomes stacked rows; `Book a Fitting` pinned as a sticky bottom bar.
- **Tablet:** swatches 3-col, process stages 2-col, hero gradient shifts to bottom-weighted.
- **Desktop:** max width 1160px, `px-16`, `py-24`.

## 9. Full Copy

**Brand:** THREAD & CHALK · Bespoke tailors · Est. 1979 · Edinburgh

**Navbar:** Bespoke · Process · Cloth · Pricing · Alterations · Visit · [Button] Book a Fitting

**Hero**
- Eyebrow: `EDINBURGH · BESPOKE TAILORS SINCE 1979 · CUT ON THE PREMISES`
- H1: `Eleven weeks, three fittings, one pattern that is only yours.`
- Subline: `A small bespoke tailoring house on Thistle Street. Every pattern is cut by hand for one person, every garment is made in the room behind the shop, and nothing leaves this building to be finished elsewhere.`
- CTAs: `Book a Fitting` · `See the Process`

**What bespoke means** — H2 `The word is used loosely. Here is what we mean by it.`
`Made-to-measure adjusts an existing block pattern to your measurements. Bespoke means a pattern is drafted from nothing, for you, on paper, and kept on file with your name on it. The first takes a fortnight and costs less. The second takes eleven weeks and fits differently, particularly if your shoulders are uneven, which almost everyone's are.`

**The process** — Eyebrow `THE PROCESS` — H2 `Eleven weeks, start to finish`
1. **Week 1 — Consultation and measure** — Ninety minutes. We take around thirty measurements, discuss cloth and cut, and photograph your posture from four angles. You leave without committing to anything.
2. **Week 2 — Pattern cutting** — Your pattern is drafted by hand on paper and cut into the cloth. This is the step that cannot be rushed and the step that most of the price pays for.
3. **Week 5 — First fitting (baste)** — The garment is loosely stitched together with no lining and one sleeve. It will look alarming. This is normal, and it is where the real fitting happens.
4. **Week 8 — Forward fitting** — Lining in, both sleeves on, buttonholes marked. Refinements here are small and precise.
5. **Week 11 — Finishing and collection** — Hand-finished buttonholes, pressed, and a final try-on. Adjustments in the first year are free.

**Cloth** — Eyebrow `CLOTH` — H2 `Six mills we keep coming back to`
1. **Fox Brothers** — Somerset, England — Flannel, 380–500g, winter weight, the best flannel made anywhere.
2. **Harrisons of Edinburgh** — Huddersfield, England — Worsted, 280–340g, year-round suiting, exceptional drape.
3. **Drago** — Biella, Italy — Super 130s wool, 240–280g, summer weight with a soft handle.
4. **Holland & Sherry** — Peebles, Scotland — Worsted and mohair blends, 260–320g, crisp and hard-wearing.
5. **Lovat Mill** — Hawick, Scotland — Tweed, 400–560g, country jackets and overcoats, woven eight miles away.
6. **Solbiati** — Como, Italy — Linen and linen-wool, 220–300g, high summer only, wrinkles beautifully.

**What we make**
- **Two-piece suit** — Jacket and trousers, fully canvassed, hand-padded lapels.
- **Three-piece suit** — With a matching or contrasting waistcoat, six or five button.
- **Dinner suit** — Grosgrain or barathea facings, no vents, side adjusters instead of belt loops.
- **Overcoat** — Chesterfield, polo, or a covert coat. Made from 480g cloth upwards.
- **Sport coat** — Half or quarter-lined, patch pockets, softer shoulder than a suit jacket.
- **Shirts** — Bespoke pattern, single needle, hand-attached collar. Minimum order of four.

**Pricing** — Eyebrow `PRICING` — H2 `What it costs and why`
| Garment | From | Typical |
|---|---|---|
| Two-piece suit | £3,200 | £3,600 |
| Three-piece suit | £3,800 | £4,200 |
| Dinner suit | £3,900 | £4,400 |
| Overcoat | £3,400 | £3,900 |
| Sport coat | £2,400 | £2,700 |
| Shirt, per shirt in a four | £280 | £320 |

Note: `Price is driven by two things: the cloth, which ranges from about £90 to £340 a metre, and the hours. A jacket takes between forty-five and sixty hours of hand work. Nothing else moves the number much, and anyone telling you otherwise is selling you a brand.`

**The fitting room** — `Allow ninety minutes for a first appointment. Bring a jacket you like the fit of and one you do not, because the second is more useful. We do not take a deposit until after the consultation, and if we think you would be better served by made-to-measure elsewhere, we will tell you.`

**Alterations and restoration** — `We alter garments not made here, and we remodel inherited suits — recutting a father's jacket to fit a son is the job we enjoy most. Bring it in and we will tell you honestly whether the cloth has enough life left in it.`

**The workshop** — `Three cutters and four tailors work in the room behind the shop. Nothing is sent abroad, nothing is machine-finished where it should be hand-finished, and the person who cut your pattern is the person you will speak to at every fitting.`

**Visit** — `18 Thistle Street, Edinburgh EH2 1EN` · Tue–Fri 10:00–18:00 · Sat 10:00–16:00 · By appointment
`Travelling fittings: London, first Thursday and Friday monthly · Manchester, second Tuesday monthly · Dublin, quarterly.`

**Footer** — THREAD & CHALK · `Bespoke tailors, Edinburgh, since 1979` · `0131 555 0158` · Appointments only · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
