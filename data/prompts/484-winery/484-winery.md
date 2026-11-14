# Cellar & Stone — Winery / Vineyard Website Prompt

## 1. Goal Statement
Build an editorial, unhurried winery website for **Cellar & Stone**, defined by bone-white space, deep burgundy accents, and a high-contrast Didone serif that reads like a wine label rather than a restaurant page — built to sell tasting reservations and wine club memberships.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(38, 24%, 96%);       /* #f8f5f0 bone */
  --foreground: hsl(20, 14%, 14%);       /* #29221f near-black brown */
  --primary: hsl(345, 52%, 26%);         /* #652034 burgundy */
  --primary-foreground: hsl(38, 24%, 97%);
  --muted-foreground: hsl(20, 8%, 46%);
  --border: hsl(35, 16%, 84%);
  --card: hsl(38, 26%, 93%);
  --accent-vine: hsl(96, 14%, 38%);      /* muted vine green */
  --gold-leaf: hsl(40, 42%, 58%);
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
```

- **H1 / hero display:** `'Playfair Display', serif;` weight 400, letter-spacing: -0.015em, line-height: 1.02
- **H2:** Playfair Display 400, 40–56px
- **H3 / wine names:** Playfair Display italic 400, 22–26px
- **Body:** `'Jost', sans-serif;` weight 300, line-height: 1.85, letter-spacing: 0.01em
- **Eyebrows / labels:** Jost 500, uppercase, letter-spacing: 0.22em, 11px
- **Vintage years / prices:** Playfair Display 400, tabular

---

## 5. Visual Effects

### Effect 1 — Slow Ken Burns Hero
```jsx
<motion.img
  src=""
  alt="Vineyard rows at golden hour"
  className="absolute inset-0 w-full h-full object-cover object-center"
  initial={{ scale: 1.12 }}
  animate={{ scale: 1 }}
  transition={{ duration: 14, ease: 'linear' }}
/>
{/* Image: vineyard rows receding into low hills, golden hour backlight, dust and warm haze, soft film grain, muted earthy palette */}
<div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(41,34,31,0.35) 0%, rgba(41,34,31,0.12) 45%, rgba(41,34,31,0.62) 100%)' }} />
```

### Effect 2 — Wine Bottle Card with Label Lift
```tsx
<div className="group relative text-center">
  <div className="relative overflow-hidden bg-[var(--card)] aspect-[3/4]">
    {/* Image: single wine bottle standing on pale stone, soft directional daylight, long gentle shadow, minimal styling */}
    <img src="" alt="Estate wine bottle" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]" />
  </div>
  <div className="pt-5">
    <div className="font-serif italic text-2xl">Stonecrop Cabernet</div>
    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">2021 · Estate Reserve</div>
    <div className="mt-3 font-serif text-lg text-[var(--primary)]">$48</div>
  </div>
  {/* Burgundy underline sweeps in on hover */}
  <div className="mx-auto mt-4 h-px w-0 bg-[var(--primary)] transition-all duration-500 group-hover:w-16" />
</div>
```

### Effect 3 — Tasting Notes Accordion
```tsx
// shadcn/ui Accordion, single-open, with burgundy chevron rotation
// Trigger: wine name (Playfair italic) + vintage; Content: aroma / palate / pairing in 3 short lines
<AccordionItem value={wine.slug} className="border-b border-[var(--border)]">
  <AccordionTrigger className="py-6 font-serif italic text-xl hover:no-underline">
    {wine.name} <span className="ml-3 font-sans text-xs tracking-[0.22em] uppercase text-[var(--muted-foreground)]">{wine.vintage}</span>
  </AccordionTrigger>
  <AccordionContent className="pb-6 font-sans font-light leading-relaxed">…</AccordionContent>
</AccordionItem>
```

### Effect 4 — Editorial Fade-Up
```
initial={{ opacity: 0, y: 28 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.85, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 84px desktop / 64px mobile, `fixed top-0 z-40`, transparent over hero → bone background with 1px bottom border after `scrollY > 80`
- **Centered wordmark:** "CELLAR & STONE" (Playfair 400, tracking 0.18em); nav links split left and right of it
- Left links: Our Wines · Visit · The Estate — Right links: Wine Club · Journal · [Button] Reserve a Tasting (burgundy outline)
- Mobile: wordmark centered, hamburger right, full-screen bone overlay menu

### Section 2 — Hero
- `h-screen`, content centered, max-w-3xl
- Eyebrow: `SONOMA COUNTY · ESTATE GROWN SINCE 1978`
- H1: `Wine made slowly,\nfrom one hillside.` (clamp 44px–92px, white)
- Subline: `Forty acres of dry-farmed cabernet and chardonnay above the Russian River. Tastings by reservation, seven days a week.`
- CTA row: `Reserve a Tasting` (burgundy filled) + `Explore the Wines` (white ghost)
- Scroll cue: thin vertical line with slow pulse

### Section 3 — Intro Statement
- Bone background, `py-28`, single centered column max-w-2xl
- Eyebrow `OUR PHILOSOPHY` + a 3-sentence statement in Playfair 28px, generous leading
- Below: signature-style line — `— Elena Marchetti, Winemaker`

### Section 4 — The Wines
- Background `--background`, `py-24`
- Eyebrow `THE COLLECTION` + H2 `Six Wines, One Hillside`
- **3-col grid** desktop / 2-col tablet / 1-col mobile, bottle cards (Effect 2)
- Each: bottle image, name, vintage + designation, price, hover underline
- Below grid: text link `View full tasting notes ↓` scrolling to Section 5

### Section 5 — Tasting Notes
- Background `--card`, 2-col split: left sticky heading, right accordion (Effect 3)
- Six accordion items with aroma / palate / pairing lines

### Section 6 — Visit / Tasting Room
- Split 50/50, full-height
```jsx
{/* Image: warm tasting room interior, long oak table, glasses catching afternoon light, stone wall, unhurried and uncrowded */}
```
- Right panel on bone: eyebrow `VISIT US`, H2 `The Tasting Room`, three experience blocks:
  - **Classic Flight — $35/person, 45 min** — Five current-release pours at the bar.
  - **Estate Seated Tasting — $65/person, 90 min** — Six wines with cheese, at a reserved table on the terrace.
  - **Vineyard Walk & Barrel Tasting — $95/person, 2 hrs** — Walk the blocks with a winemaker, taste from barrel. Saturdays only.
- Hours block + `Reserve a Tasting` button + note about groups over 8

### Section 7 — Wine Club
- Full-bleed burgundy background, bone text, `py-28`
- Eyebrow `WINE CLUB` + H2 `The Stone Circle`
- 3 membership tiers in bordered cards (bone 1px border on burgundy)
- Each: tier name (Playfair italic), shipment cadence, bottle count, price per shipment, 4 benefit lines, `Join` button (bone filled, burgundy text)
- Below: `Members receive complimentary tastings for two, all year.`

### Section 8 — The Estate / Story
- Bone background, alternating 2-col rows (image / text, then text / image)
- Three rows: The Land · The Farming · The Cellar — each with a short paragraph and one image
```jsx
{/* Image: hands holding freshly picked wine grapes, dirt under fingernails, natural daylight, documentary style */}
{/* Image: old concrete fermentation tanks in a dim cellar, single shaft of light, quiet and still */}
```

### Section 9 — Journal Preview
- 3 latest posts in a light card row: date eyebrow, Playfair title, 1-line excerpt, `Read →`

### Section 10 — Reservation CTA
- Centered on `--card`, H2 `Come Taste With Us`, short line, burgundy CTA + phone

### Section 11 — Footer
- Bone with 1px top border; 4 columns: brand + address / Wines / Visit + Club / Newsletter signup
- Newsletter: single input + burgundy arrow button, label `Vintage notes, twice a year. Nothing else.`
- Bottom strip: © line + `Please enjoy responsibly.` + social icons

---

## 7. Animations

- **Hero:** Ken Burns 1.12 → 1 over 14s linear; H1 fades up 0.9s at 0.25s; subline 0.15s later; CTAs 0.15s after that
- **Navbar:** background and border cross-fade at `scrollY > 80`, 0.4s ease
- **Section headings:** fade-up 0.75s, ease `[0.22, 1, 0.36, 1]`
- **Bottle cards:** stagger `i * 0.09`; hover scales image 1.04 over 0.7s and sweeps a 16px burgundy underline in over 0.5s
- **Accordion:** height auto with 0.35s ease; chevron rotates 180° in 0.3s
- **Estate rows:** image slides in from its own side (`x: ±36 → 0`) while text fades up, 0.85s
- **Wine club cards:** stagger 0.12s, subtle `y: 20 → 0`
- **Scroll cue:** opacity 0.4 ↔ 1 pulse, 2.4s infinite

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: centered wordmark + hamburger, full-screen bone menu with Playfair 30px links
- Hero: H1 clamps to 44px, CTAs stacked full-width, scroll cue hidden
- Wines: 1-col, bottle image aspect `4/5`
- Tasting notes: heading stacks above accordion (not sticky)
- Visit: image stacks above the text panel; experience blocks become bordered cards
- Wine club: 1-col, tiers stacked
- Estate: all rows become image-then-text, no alternating
- Footer: 1-col with newsletter first

### Tablet (768–1024px)
- Wines 2-col · Estate rows keep alternating at reduced padding · Wine club 3-col with tighter cards

### Desktop (> 1024px)
- Max content width 1240px, `px-16`, section padding `py-28`

---

## 9. Full Copy

### Brand
**CELLAR & STONE** — Sonoma County, California

### Navbar
Our Wines · Visit · The Estate · Wine Club · Journal · [Button] Reserve a Tasting

### Hero
- Eyebrow: `SONOMA COUNTY · ESTATE GROWN SINCE 1978`
- H1: `Wine made slowly, from one hillside.`
- Subline: `Forty acres of dry-farmed cabernet and chardonnay above the Russian River. Tastings by reservation, seven days a week.`
- CTA 1: `Reserve a Tasting` · CTA 2: `Explore the Wines`

### Philosophy
Eyebrow: `OUR PHILOSOPHY`
Statement: `We farm one hillside and we have never bought a grape. Some years that means less wine than we would like. Every year it means the bottle tells you exactly where it came from.`
Signature: `— Elena Marchetti, Winemaker`

### The Wines
Eyebrow: `THE COLLECTION` — H2: `Six Wines, One Hillside`

1. **Stonecrop Cabernet Sauvignon** · 2021 · Estate Reserve · $48
2. **North Block Chardonnay** · 2023 · Unoaked · $34
3. **Old Vine Zinfandel** · 2020 · Block 7 · $52
4. **Rosé of Cabernet** · 2024 · Limited · $28
5. **Hillside Blend** · 2019 · Library Release · $68
6. **Late Harvest Chardonnay** · 2022 · Dessert · $38 (375ml)

### Tasting Notes
Eyebrow: `TASTING NOTES` — H2: `What You Will Find in the Glass`

- **Stonecrop Cabernet Sauvignon, 2021** — *Aroma:* black cherry, cedar, dried thyme. *Palate:* firm but rounded tannin, graphite, long dark-fruit finish. *Pairing:* dry-aged beef, aged hard cheeses, mushroom ragù.
- **North Block Chardonnay, 2023** — *Aroma:* white peach, lemon peel, wet stone. *Palate:* no oak, bright acid, saline finish. *Pairing:* oysters, roast chicken, anything from the grill.
- **Old Vine Zinfandel, 2020** — *Aroma:* raspberry, black pepper, brambles. *Palate:* full and spicy without heat, soft tannin. *Pairing:* barbecue, lamb, sharp cheddar.
- **Rosé of Cabernet, 2024** — *Aroma:* strawberry, blood orange, rose petal. *Palate:* dry, crisp, faintly savoury. *Pairing:* salads, charcuterie, hot afternoons.
- **Hillside Blend, 2019** — *Aroma:* cassis, tobacco leaf, violet. *Palate:* structured and slow-opening, built for another decade. *Pairing:* decant an hour, then anything worth the occasion.
- **Late Harvest Chardonnay, 2022** — *Aroma:* apricot, honeycomb, orange blossom. *Palate:* sweet but balanced by acid, not cloying. *Pairing:* blue cheese, stone fruit tart, on its own.

### Visit
Eyebrow: `VISIT US` — H2: `The Tasting Room`
- **Classic Flight** — $35 per person · 45 minutes · Five current-release pours at the bar. Walk-ins welcome before 3pm.
- **Estate Seated Tasting** — $65 per person · 90 minutes · Six wines with local cheese and bread, at a reserved table on the terrace.
- **Vineyard Walk & Barrel Tasting** — $95 per person · 2 hours · Walk the blocks with a winemaker and taste from barrel. Saturdays only, limited to eight guests.
Hours: `Open daily 11am – 5pm · Last tasting seated at 4pm`
Note: `Groups of eight or more, please call us directly at (707) 555-0142.`

### Wine Club
Eyebrow: `WINE CLUB` — H2: `The Stone Circle`

- **Quarterly** — 4 shipments a year · 3 bottles each · $105 per shipment — Winemaker selection each season · 15% off all orders · Complimentary tastings for two · First access to library releases
- **Half Case** — 4 shipments a year · 6 bottles each · $195 per shipment — Choose reds, whites, or mixed · 20% off all orders · Complimentary tastings for four · Invitation to the spring barrel day
- **Collector** — 2 shipments a year · 12 bottles each · $520 per shipment — Includes library and small-lot wines · 25% off all orders · Private seated tasting once a year · Harvest weekend invitation for two

Note: `Members receive complimentary tastings for two, all year. Skip or cancel any shipment before it ships.`

### The Estate
1. **The Land** — Forty acres on a west-facing slope of decomposed shale, planted between 1978 and 1994. Thin soil and no irrigation mean small berries, deep colour, and yields that would make an accountant nervous.
2. **The Farming** — Dry-farmed and certified organic since 2006. We cover-crop between rows, run sheep through in winter, and pick by hand in the cool hours before sunrise.
3. **The Cellar** — Native fermentation in concrete and neutral oak. Minimal handling, no fining, light filtration only when the wine asks for it. The cellar is eleven degrees year-round without help.

### Journal
1. `March 2026` — **Why we stopped irrigating, and what it cost us** — Three dry years taught us more about this hillside than the twenty before them.
2. `November 2025` — **Harvest notes: the 2025 vintage** — A cool August pushed picking back eleven days. We think it was the best thing that could have happened.
3. `August 2025` — **A short defence of unoaked chardonnay** — Oak is a seasoning, not a food group.

### Final CTA
H2: `Come Taste With Us`
Subline: `The terrace is open daily, the dog is friendly, and the last tasting sits at four.`
CTA: `Reserve a Tasting` · Phone: `(707) 555-0142`

### Footer
- CELLAR & STONE · `Estate grown, Sonoma County, since 1978.`
- Address: `4180 Westside Road, Healdsburg, CA 95448`
- Newsletter label: `Vintage notes, twice a year. Nothing else.`
- © 2026 Cellar & Stone. All rights reserved. · `Please enjoy responsibly.`

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-accordion": "^1.2.0",
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
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        'stone-bone': '#f8f5f0',
        'stone-burgundy': '#652034',
        'stone-vine': '#5a6b4f',
      },
    },
  },
};
```
