# Falls & Sons: Gutter Cleaning Website Prompt

## 1. Goal
Build a plain, dependable website for **Falls & Sons**, a gutter cleaning company working from a vacuum pole and a ladder. Slate paper, dark ink, one rainwater blue accent, a sturdy grotesk, and one signature: a drawn gutter section where a single line of water finds its way to the downpipe. Nothing flashy, because the customer just wants the water to stop coming over the edge.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking engine, no quote calculator. Actions are a phone link and an email link.

## 3. Design system
```css
:root {
  --paper: #EDEFF0;
  --ink: #1C2226;
  --accent: #2E6E8E;           /* rainwater blue */
  --on-accent: #FFFFFF;
  --surface: #E0E4E6;
  --muted: #5B666D;
  --line: rgba(28,34,38,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Archivo 700, clamp(42px, 5.6vw, 86px), line-height 1.0, letter-spacing -0.035em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Prices, storey counts, times, index labels.
- No italics. Emphasis by a whole line in rainwater blue.

## 5. Signature element
**Water finding the downpipe.** A cross section of a gutter drawn in 2px ink hairlines: the fascia, the gutter run, a bracket and the downpipe at the right. A blue line starts at the left end, runs along the gutter, hesitates at a drawn clump of leaves, then continues and turns down the pipe. It draws once over 2 seconds with `pathLength`, and the leaves fade out as it passes them.

No loop, no splash, no droplets. It explains the service in one drawing.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, slate paper, one hairline beneath. Wordmark left, four links right, blue pill with a round arrow circle and the phone number in mono.
2. **Hero, split portrait**: headline left over a hairline, photograph bleeding off the right edge, sentence and two actions beneath. Min height `clamp(500px, 74vh, 760px)`. *Photograph: a technician on a driveway using a carbon fibre vacuum pole up to a two storey gutter, overcast daylight, van in the background.*
3. **Why it matters, statement**: light. One paragraph at 22px from one third, label `001/ Why bother` in the left column. Damp walls, rotten fascia, wasps.
4. **The gutter**: surface. The signature drawing (section 5) with a mono caption.
5. **Prices, ruled table**: light. Five rows: property type, storeys, price, time on site. Figures in mono, right aligned.
6. **What we do while we are there, index**: light. Two ruled columns: included and extra. Downpipes, hopper heads, moss, fascia wipe.
7. **Before and after**: dark ink ground, inset 16px, `--panel-radius`. Two photographs side by side with mono captions, plus one line about the camera on the pole. *Photographs: a gutter packed with moss and silt, and the same gutter clear, both shot from below.*
8. **How the visit works, numbered rows**: light. Four rows with mono markers: booking, arrival, the work, the photographs.
9. **One quote**: surface. A single centred quote in Archivo 500 at 26px with a signature line in mono.
10. **Book, accent panel**: blue ground, inset panel. One line, the phone number set large, and a mono note about how far ahead they are booking.
11. **Footer**: dark ink. Giant cropped `FALLS & SONS` wordmark, coverage, insurance line, three small links.

## 7. Motion
- Headline fades up 16px once.
- The water line draws once, as described.
- Table rows fade in with 0.04s stagger.
- Photographs settle from `scale 1.02`.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the water already at the downpipe.

## 8. Responsive
- **Mobile under 768px:** a blue call bar is fixed to the bottom with `env(safe-area-inset-bottom)` padding. Hero photograph above the headline at 40vh. Price table becomes stacked rows with the price on the same line as the property type. Before and after stack. No horizontal page scroll.
- **Tablet:** hero stays split, before and after side by side.
- **Desktop:** content max-width 1180px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** FALLS & SONS. Meta: `GUTTER CLEARING. NO LADDERS ON YOUR ROOF. WORCESTERSHIRE.`

**Nav:** Prices, What we do, Areas, Contact. Button: `Book a clear`. Mono: `01905 555 0164`

**Hero**
- Headline: `Gutters clear, from the ground, in about an hour.`
- Sentence: `A carbon fibre vacuum pole reaches three storeys without a ladder touching your roof, your conservatory or your flowerbed. You get photographs of every run before we leave.`
- Actions: `Book a clear`, `Call 01905 555 0164`

**Why it matters** (label `001/ Why bother`)
`A blocked gutter does not announce itself. It quietly runs down the wall for two winters, the plaster inside goes cold and patchy, and the fascia behind it softens. By the time anyone notices, it is a joiner rather than an hour with a vacuum. Clear them once a year, twice if you have a beech or a sycamore near the house.`

**The gutter caption:** `Silt, moss and a tennis ball. The tennis ball is more common than you would think.`

**Prices** (label `002/ Prices`)
| Property | Storeys | Price | On site |
|---|---|---|---|
| Terrace or flat | 2 | 60 GBP | 40 MIN |
| Semi detached | 2 | 75 GBP | 50 MIN |
| Detached | 2 | 95 GBP | 1 HR |
| Detached, large | 3 | 135 GBP | 1 HR 30 |
| Bungalow | 1 | 55 GBP | 35 MIN |
Note: `Prices include downpipes, hopper heads and taking the debris away. No charge if we cannot reach a run and have to leave it.`

**While we are there** (label `003/ Included`)
- Included: `All gutter runs vacuumed`, `Downpipes checked and cleared`, `Hopper heads emptied`, `Debris bagged and taken away`, `Photographs of every run`, `A note if we spot a cracked joint or a loose bracket`
- Extra: `Fascia and soffit wash, from 45 GBP`, `Conservatory roof clean, from 40 GBP`, `Moss removal from a low roof, quoted`, `Replacing a broken bracket, 15 GBP plus the part`

**Before and after**: `Silted to the brim, north side.` · `The same run, ten minutes later.` · `The camera sits on the pole, so the photographs are from the gutter, not from the ground.`

**How the visit works** (label `004/ The visit`)
- `WHEN YOU BOOK` **A fixed price.** `Tell us the type of house and the number of storeys. That is enough for a price.`
- `ON THE DAY` **A two hour window.** `We text when we set off. You do not need to be in, as long as we can reach the sides.`
- `THE WORK` **From the ground.** `No ladders against your gutters, nothing leaning on the conservatory.`
- `BEFORE WE GO` **Photographs.** `Every run, sent by text, along with anything worth keeping an eye on.`

**Quote:** `Two winters of damp in the back bedroom. It was a gutter joint full of moss, and he showed me the photograph of it.`
Signature: `Ann P, Malvern`

**Book panel**
- Line: `Most jobs are done within the week.`
- Phone set large: `01905 555 0164`
- Mono: `BOOKING ABOUT SIX DAYS AHEAD. AUTUMN IS BUSIER, RING EARLY.`

**Footer**
`FALLS & SONS`, `Worcester, Malvern, Droitwich, Pershore and Evesham`, `book@fallsandsons.co.uk`
Mono: `2m GBP public liability insurance. Working at height trained. Waste carrier licence CBDU221904.`
Links: `Prices`, `What we do`, `Areas`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, before and after sliders, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
