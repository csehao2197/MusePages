# Hollow Pines — Campground & Glamping Website Prompt

## 1. Goal Statement
Build a warm, woodsmoke-scented campground and glamping website for **Hollow Pines**, defined by deep forest green, ember orange, and a rounded outdoor sans — a site built around a pitch-type chooser and honest information about what the ground is actually like.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(40, 34%, 95%);       /* #f7f2e7 canvas */
  --foreground: hsl(150, 26%, 13%);      /* #192a22 forest ink */
  --primary: hsl(150, 34%, 24%);         /* #28513f forest green */
  --primary-foreground: hsl(40, 34%, 97%);
  --muted-foreground: hsl(150, 8%, 44%);
  --border: hsl(38, 18%, 85%);
  --card: hsl(40, 36%, 91%);
  --accent-ember: hsl(20, 82%, 54%);     /* fire orange */
  --deep: hsl(150, 30%, 11%);            /* night sections */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Bricolage Grotesque 700, clamp(40px, 5.6vw, 82px), letter-spacing -0.02em
- **H2:** Bricolage Grotesque 600, 32–48px
- **H3:** Bricolage Grotesque 600, 18–22px
- **Body:** Inter 300–400, 17px, line-height 1.74
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, ember
- **Prices / capacities:** Bricolage Grotesque 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Pitch type chooser.** Five pitch cards — tent, electric hookup, campervan, bell tent, cabin — where selecting one swaps a description, a sleeps count, a facilities list and a nightly price, and filters the availability calendar beneath.

```tsx
const pitches = [
  { id: 'tent',   name: 'Tent pitch',       sleeps: 6, price: 24, note: 'Grass, no hookup, fire pit allowed' },
  { id: 'hookup', name: 'Electric pitch',   sleeps: 6, price: 34, note: '16A hookup, hardstanding edge' },
  { id: 'van',    name: 'Campervan pitch',  sleeps: 4, price: 38, note: 'Hardstanding, hookup, grey waste point' },
  { id: 'bell',   name: 'Bell tent',        sleeps: 4, price: 95, note: 'Furnished, beds made, wood burner' },
  { id: 'cabin',  name: 'Cabin',            sleeps: 5, price: 140, note: 'Insulated, kitchenette, private shower' },
];
const [sel, setSel] = useState('tent');
const p = pitches.find(x => x.id === sel);

<AnimatePresence mode="wait">
  <motion.div key={sel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
    <h3 className="font-display text-3xl">{p.name}</h3>
    <p className="mt-2 text-[var(--muted-foreground)]">Sleeps {p.sleeps} · {p.note}</p>
    <p className="mt-4 font-display text-4xl tabular-nums">£{p.price}<span className="text-base"> per night</span></p>
  </motion.div>
</AnimatePresence>
```

**Effect 2 — Ember glow on the night section.** The campfire and stargazing section sits on `--deep` with a soft radial ember gradient behind the heading, slowly oscillating opacity between 0.15 and 0.28 over six seconds, disabled under reduced motion.

## 6. Component Breakdown

1. **Navbar** — 74px, sticky, canvas with blur, 1px bottom border on scroll. Pine-mark wordmark left, links centre, `Check Availability` ember button right.
2. **Hero** — 90vh, full-bleed woodland photograph with a bottom canvas gradient. Eyebrow, H1, subline, two CTAs, four practical points. *Image: tents pitched among tall pines at golden hour, woodsmoke in the air, warm low light, relaxed outdoor photography.*
3. **Season strip** — thin band showing the open season, current weather note and a `Book direct and save the booking fee` line.
4. **Pitch chooser** — the primary interaction (Effect 1) with a booking CTA.
5. **The site** — a hand-drawn style site map with numbered zones and a short description of each: meadow, woodland, van field, glamping row, and the facilities block.
6. **Facilities** — 2x4 icon grid: hot showers, washing up, laundry, drinking water, waste points, fire pit hire, wood and kindling, dog field.
7. **Honest information** — the section that sets this site apart: what the ground is like in rain, how far the walk to the showers is, whether the phone signal works, and what time it gets quiet.
8. **Campfire and stargazing** — night section (Effect 2) with fire rules, wood pricing and a note on the dark sky designation.
9. **What is nearby** — four walks and three pubs with distances and rough walking times.
10. **Rules** — a plain list covering arrival times, noise, dogs, single-sex groups and cancellation.
11. **Availability and booking** — calendar filtered by pitch type with a minimum-stay note.
12. **Footer** — deep forest, four columns, address, what3words location, seasonal contact hours.

## 7. Animations
- Hero: image scales `1.05 → 1` over 12s; H1 fades up 0.8s
- Pitch cards: selected card gets an ember 2px border and lifts `-4px`; detail panel swaps with AnimatePresence, 0.28s
- Site map zones: numbered pins pop `scale 0 → 1` with a 0.1s stagger as the map enters view
- Facility icons: fade-up stagger 0.05s
- Ember glow: opacity oscillation 0.15 ↔ 0.28 over 6s, reduced-motion safe
- Nearby list: rows fade in staggered 0.06s

## 8. Responsive
- **Mobile (<768px):** hamburger; H1 clamps to 40px; pitch chooser becomes a horizontally scrollable card row with the detail panel beneath; site map becomes a vertical zone list with the map image above; facilities 2-col; `Check Availability` pinned as a sticky bottom bar.
- **Tablet:** pitch cards 3+2, facilities 4-col, nearby 2-col.
- **Desktop:** max width 1180px, `px-16`, `py-22`.

## 9. Full Copy

**Brand:** HOLLOW PINES · Campsite and glamping · Snowdonia edge, North Wales

**Navbar:** Pitches · The Site · Facilities · Nearby · Rules · [Button] Check Availability

**Hero**
- Eyebrow: `NORTH WALES · 42 PITCHES · OPEN MARCH TO OCTOBER · DARK SKY SITE`
- H1: `Woodsmoke, cold rivers, and no wifi in the field.`
- Subline: `A forty-two pitch campsite on the edge of Snowdonia, with grass pitches, hardstanding for vans, four bell tents and two cabins. Fires allowed, dogs welcome, showers hot.`
- CTAs: `Check Availability` · `See the Pitches`
- Points: `Fires allowed` · `Dogs welcome` · `Hot showers` · `Dark sky site`

**Season strip:** `Open 14 March to 26 October · Book direct and skip the booking fee`

**Pitches**
- **Tent pitch — £24 per night** — Sleeps up to 6 · Grass, no hookup, fire pit allowed · Car beside the tent on most pitches
- **Electric pitch — £34 per night** — Sleeps up to 6 · 16A hookup, hardstanding edge, fire pit allowed
- **Campervan pitch — £38 per night** — Sleeps up to 4 · Hardstanding, 16A hookup, grey waste point on the field
- **Bell tent — £95 per night** — Sleeps 4 · Furnished, beds made up, wood burner, rugs and lanterns · Two-night minimum
- **Cabin — £140 per night** — Sleeps 5 · Insulated, kitchenette, private shower and loo, veranda · Two-night minimum

**The site** — H2 `Five fields and a stream`
1. **The Meadow** — Open grass, best for groups and families, closest to the play area and the loudest field by some distance.
2. **The Woodland** — Twelve pitches among the pines. Shaded, sheltered, quieter, and slightly harder to get pegs into.
3. **The Van Field** — Fourteen hardstanding pitches with hookups, level, and a five-metre gap between vans.
4. **Glamping Row** — Four bell tents and two cabins along the top edge with the best view down the valley.
5. **Facilities Block** — Central to everything. Nothing in the site is more than a hundred and forty metres from a hot shower.

**Facilities** — `Hot showers, 20p for 6 minutes` · `Covered washing up sinks` · `Laundry, £4 a load` · `Drinking water points on every field` · `Chemical and grey waste disposal` · `Fire pit hire, £8` · `Logs £6, kindling £3` · `Fenced dog field`

**Honest information** — H2 `Things we would want to know before booking`
1. **The ground after heavy rain** — The meadow drains well. The woodland turns soft after two days of rain and we will move you rather than let you get stuck.
2. **How far are the showers?** — Longest walk on site is about a hundred and forty metres, from the far corner of the van field.
3. **Is there phone signal?** — Patchy. EE works in most of the site, others mostly do not. There is free wifi at reception and deliberately nowhere else.
4. **When does it get quiet?** — Music off at ten, quiet from eleven, and we do enforce it. If you want a party site, we are honestly not it.
5. **Can we bring the dog?** — Yes, two per pitch, £4 each per stay. There is a fenced field for off-lead running and dogs must be on a lead everywhere else.

**Campfire and stargazing** — H2 `Fires are allowed. Properly.`
`Every grass pitch can have a fire in a raised fire pit, which we hire for eight pounds a stay. Logs are six pounds a net and kindling three, both from a plantation nine miles away. Fires out by midnight, and never directly on the grass.`
`We sit inside a Dark Sky reserve. On a clear moonless night you can see the Milky Way with the naked eye from the top of the van field, and the site lighting is deliberately low and downward-facing to keep it that way.`

**What is nearby**
Walks: `Cwm Idwal circuit, 12 min drive, 3 hours` · `Aber Falls, 20 min drive, 90 minutes` · `The river path from the gate, on foot, 40 minutes` · `Moel Wnion summit, from the gate, 3 hours`
Pubs: `The Bull, 1.4 miles, food until 9` · `Ty Gwyn, 2.8 miles, dog friendly` · `The Slaters Arms, 4 miles, best pint locally`

**Rules**
`Arrival 1pm to 8pm · Departure by 11am · Music off at 10pm, quiet from 11pm · Two dogs per pitch, on leads except in the dog field · Fires only in hired pits, out by midnight · No single-sex groups over four, sorry, we learned this the hard way · Free cancellation up to 14 days before, 50% up to 7 days, non-refundable after that`

**Footer** — HOLLOW PINES · `Woodsmoke, cold rivers, and no wifi in the field.` · `Hollow Pines, Bethesda, Gwynedd LL57 3LX` · what3words: `pines.hollow.stream` · `01248 555 0161` · Reception 9am–8pm in season · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "react-day-picker": "^9.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
