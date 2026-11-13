# Grainhouse Flooring — Flooring Company Website Prompt

## 1. Goal Statement
Build a warm, material-led flooring website for **Grainhouse**, defined by oat white, deep walnut, and a quiet editorial serif — built around a room visualiser that swaps floor finishes and a price-per-square-metre table that includes fitting, because hiding the fitting cost is why this category's websites fail.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(36, 28%, 96%);       /* #f8f4ee oat */
  --foreground: hsl(26, 20%, 16%);       /* #302722 walnut ink */
  --primary: hsl(26, 36%, 32%);          /* #6f4f37 walnut */
  --primary-foreground: hsl(36, 28%, 97%);
  --muted-foreground: hsl(26, 8%, 46%);
  --border: hsl(34, 16%, 87%);
  --card: hsl(36, 30%, 92%);
  --accent-sage: hsl(120, 14%, 46%);     /* sustainability marker */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **H1:** Newsreader 400, clamp(38px, 4.8vw, 66px), line-height 1.1
- **H2:** Newsreader 400, 30–44px
- **H3 / product names:** Inter 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.76
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, walnut
- **Prices per square metre:** Newsreader 500, tabular-nums

## 5. Visual Effects

**Effect 1 — Room visualiser.** A room photograph with a swatch row beneath. Selecting a floor finish cross-fades the floor area of the image, so customers can see oak against walnut against herringbone in the same room rather than imagining it from a 40mm sample.

```tsx
const finishes = [
  { id: 'oak-natural',  name: 'Natural Oak',      price: 62,  fit: 24 },
  { id: 'oak-smoked',   name: 'Smoked Oak',       price: 74,  fit: 24 },
  { id: 'walnut',       name: 'American Walnut',  price: 96,  fit: 24 },
  { id: 'herringbone',  name: 'Oak Herringbone',  price: 88,  fit: 38 },
  { id: 'lvt-stone',    name: 'LVT Stone Effect', price: 38,  fit: 22 },
];
const [sel, setSel] = useState('oak-natural');
const f = finishes.find(x => x.id === sel);

<AnimatePresence mode="wait">
  <motion.img
    key={sel}
    src=""
    alt="Living room with the selected floor finish"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.45 }}
    className="absolute inset-0 h-full w-full object-cover object-center"
  />
</AnimatePresence>
<p className="mt-4 tabular-nums">
  £{f.price}/m² supply · £{f.fit}/m² fitting · <strong>£{f.price + f.fit}/m² all in</strong>
</p>
```
Media brief per finish: a bright living room interior photographed from a low angle with the floor prominent, natural daylight, neutral furniture, calm editorial interiors style.

**Effect 2 — Grain scroll strip.** A horizontal band of five close-crop wood grain photographs that translate slowly on scroll at slightly different rates, creating a shallow parallax that emphasises texture. Reduced motion holds them static.

## 6. Component Breakdown

1. **Navbar** — 74px, sticky, oat, 1px bottom border. Wordmark left, links centre, phone and `Book a Free Survey` walnut button right.
2. **Hero** — split, text left, room image right. Eyebrow, serif H1, subline, two CTAs, four trust points. *Image: a wide oak plank floor in a bright room, low camera angle emphasising grain and length, warm natural light.*
3. **Room visualiser** — the primary interaction (Effect 1), placed immediately below the hero.
4. **Floor types** — 2x3 cards: solid wood, engineered wood, LVT, laminate, parquet and herringbone, carpet, each with a plain description of when it is the right choice and when it is not.
5. **Full price list** — supply and fit per square metre for every product, with underlay and subfloor prep costs listed separately rather than hidden.
6. **Grain strip** — the texture section (Effect 2) with a short paragraph on where the timber comes from.
7. **Subfloor honesty** — the section nobody else writes: what happens when the subfloor is uneven, what levelling costs, and why the quote can change after the floor comes up.
8. **Fitting process** — five steps from survey to final clean, with acclimatisation time stated, which is the most commonly skipped step in the trade.
9. **Care and guarantees** — what the twenty-five year wear guarantee covers, how to clean each type, and what voids it.
10. **Recent projects** — three jobs with the room, the product, the area in square metres and the days on site.
11. **Free survey** — form with room count, approximate area and a note that the survey includes moisture readings.
12. **Footer** — walnut, four columns, FSC certification, showroom address, contact.

## 7. Animations
- Hero: text fades up 0.7s; image reveals with a rise and fade, 0.9s
- Visualiser: floor image cross-fades 0.45s on swatch selection; price line re-mounts and fades, 0.25s
- Swatches: scale 1.1 and gain a walnut ring on hover, 0.2s
- Grain strip: parallax translate at three different rates on scroll, reduced-motion safe
- Price table rows: fade in staggered 0.03s
- Process steps: walnut connecting line scales from left, 0.8s

## 8. Responsive
- **Mobile (<768px):** hamburger; visualiser image sits above the swatch row and the price line, full width; H1 clamps to 38px; floor type cards 1-col; price table becomes stacked rows with supply, fit and total on three lines; `Book a Free Survey` pinned as a sticky bottom bar.
- **Tablet:** visualiser keeps side layout, floor types 2-col.
- **Desktop:** max width 1180px, `px-16`, `py-22`.

## 9. Full Copy

**Brand:** GRAINHOUSE FLOORING · Supply and fitting · Nottingham

**Navbar:** Visualiser · Floor Types · Prices · Process · Projects · `0115 555 0163` · [Button] Book a Free Survey

**Hero**
- Eyebrow: `NOTTINGHAM & EAST MIDLANDS · SUPPLY AND FIT · FSC CERTIFIED · SINCE 2007`
- H1: `See it in a room before you commit to forty square metres of it.`
- Subline: `Wood, engineered, LVT and carpet, supplied and fitted across the East Midlands. Prices include fitting, the survey is free, and we take moisture readings before we quote rather than after.`
- CTAs: `Book a Free Survey` · `Try the Visualiser`
- Trust points: `Prices include fitting` · `Free survey with moisture test` · `FSC certified timber` · `25-year wear guarantee`

**Visualiser** — Eyebrow `SEE IT FIRST` — H2 `Same room, different floors`
1. **Natural Oak** — £62/m² supply · £24/m² fitting · **£86/m² all in**
2. **Smoked Oak** — £74/m² supply · £24/m² fitting · **£98/m² all in**
3. **American Walnut** — £96/m² supply · £24/m² fitting · **£120/m² all in**
4. **Oak Herringbone** — £88/m² supply · £38/m² fitting · **£126/m² all in**
5. **LVT Stone Effect** — £38/m² supply · £22/m² fitting · **£60/m² all in**

**Floor types**
1. **Solid Wood** — One piece of timber throughout. Can be sanded and refinished many times, so it outlives everything else. Not suitable over underfloor heating or in bathrooms, and it will move with humidity.
2. **Engineered Wood** — A real wood top layer on a plywood core. Stable over underfloor heating, sandable two or three times depending on the wear layer. The right answer for most modern homes.
3. **LVT** — Luxury vinyl tile. Waterproof, warm underfoot, and genuinely convincing now in a way it was not ten years ago. Kitchens, bathrooms and utility rooms.
4. **Laminate** — The budget option, and there is no shame in it for a rental or a spare room. Not waterproof whatever the packaging says, and it cannot be repaired, only replaced.
5. **Parquet and Herringbone** — Blocks laid in a pattern. Twice the fitting labour of a plank floor, which is why the fitting price is higher. Worth it in a room you will look at for twenty years.
6. **Carpet** — Wool and wool-blend, 80/20 and 50/50. Still the right choice for bedrooms and stairs, and we will say so even though it is the cheapest thing we sell.

**Full price list**
| Product | Supply /m² | Fitting /m² | All in /m² |
|---|---|---|---|
| Laminate, 8mm | £16 | £18 | £34 |
| LVT, click | £38 | £22 | £60 |
| LVT, glue down | £42 | £28 | £70 |
| Engineered oak, 14mm | £52 | £24 | £76 |
| Natural oak, solid | £62 | £24 | £86 |
| Smoked oak, engineered | £74 | £24 | £98 |
| Oak herringbone | £88 | £38 | £126 |
| American walnut | £96 | £24 | £120 |
| Wool carpet, 80/20 | £34 | £14 | £48 |

Extras: `Underlay £6 to £14/m² depending on type · Self-levelling compound £18/m² where needed · Uplift and disposal of existing floor £8/m² · Beading and thresholds from £12 per metre · Furniture moving, free`

**Grain strip** — `Our oak comes from FSC-certified European forests, mostly France and Croatia, and is kiln-dried to eight percent before it reaches us. We hold stock rather than ordering per job, which is why we can usually fit within two weeks.`

**Subfloor honesty** — H2 `Why a quote can change once the old floor comes up`
`Nobody knows what is under your existing floor, including us. Most of the time it is fine. Occasionally there is a screed that has cracked, boards that have rotted at the edges, or a level difference of twenty millimetres across a room that was hidden under carpet.`
`We take moisture readings and check levels at the survey, which catches most of it. If something appears once we lift the old floor, we stop, show you, and quote the additional work before continuing. We never carry on and invoice you at the end, and levelling compound at £18 a square metre is the most common surprise.`

**Fitting process**
1. **Free survey** — We measure, take moisture readings in three places, check subfloor level, and discuss which product actually suits the room. About forty minutes.
2. **Quote** — Itemised within two working days: supply, fitting, underlay, prep, beading and disposal as separate lines.
3. **Acclimatisation** — Wood is delivered and left in the room for seven days before fitting. Skipping this is why floors cup and gap, and any fitter who offers to skip it is telling you something.
4. **Fitting** — One to three days for most homes. We work room by room so you keep the use of the house.
5. **Finish and clean** — Beading, thresholds, a full clean, and a care pack with the right cleaner for your floor type.

**Care and guarantees** — `Twenty-five year wear guarantee on engineered and solid wood, twenty on LVT, ten on laminate. It covers the wear layer failing under normal domestic use. It does not cover water damage, pet claws, dragging furniture, or steam mops — and steam mops are what kills more wood floors than everything else combined.`

**Recent projects**
1. **Victorian terrace, whole ground floor** — Nottingham — 52m² oak herringbone, five days on site including levelling.
2. **New-build kitchen and utility** — West Bridgford — 31m² glue-down LVT over underfloor heating, two days.
3. **1930s semi, stairs and landing** — Beeston — 22m² wool carpet with engineered oak on the landing, one and a half days.

**Free survey** — Form: Name / Postcode / Phone / How many rooms / Rough area in m² if known / What is down at the moment → [Button] `Book a Free Survey`
Note: `The survey is genuinely free and there is no obligation. We will tell you if a cheaper product is the right one for the room, and we would rather do that than sell you walnut for a rental.`

**Footer** — GRAINHOUSE FLOORING · `Prices include fitting. The survey is free.` · `Showroom: 210 Alfreton Road, Nottingham NG7 3NR` · `0115 555 0163` · FSC certified supplier C142880 · Mon–Fri 8:30–17:30, Sat 9:00–16:00 · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
