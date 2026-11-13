# Offset Club — Print Shop Website Prompt

## 1. Goal Statement
Build a loud, tactile website for **Offset Club**, an independent risograph and screen-print studio — fluorescent pink and bright blue ink on a cream paper background, headlines printed with deliberate misregistration, visible halftone texture, and the handmade energy of a zine rather than a corporate print service.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries, no file upload, no price calculator. Quote buttons link to email.

## 3. Design System — Colors
```css
:root {
  --background: hsl(44, 45%, 92%);       /* recycled cream paper */
  --foreground: hsl(230, 30%, 14%);      /* dark ink */
  --pink: hsl(330, 100%, 60%);           /* riso fluorescent pink */
  --blue: hsl(212, 100%, 45%);           /* riso medium blue */
  --yellow: hsl(52, 100%, 55%);          /* riso yellow, accents only */
  --primary: var(--pink);
  --primary-foreground: hsl(44, 45%, 96%);
  --muted-foreground: hsl(230, 12%, 38%);
  --border: hsl(230, 30%, 14%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
```
- **H1:** Archivo Black, uppercase, clamp(64px, 13vw, 210px), line-height 0.84, letter-spacing -0.03em
- **H2:** Archivo Black, uppercase, clamp(40px, 6vw, 90px), line-height 0.88
- **Body:** Space Mono 400, 15px, line-height 1.7
- **Labels and prices:** Space Mono 700, 12px, uppercase

## 5. Visual Effects

**Effect 1 — Misregistered headlines.** Every H1 and H2 is rendered twice, stacked: a pink layer and a blue layer on top with `mix-blend-mode: multiply`, offset by 3–5px on both axes, so overlapping areas print a deep purple like real two-colour riso. On hover over the heading, the offset briefly animates to 0 and back.

```jsx
<h1 className="relative">
  <span className="block text-[var(--pink)]">PRINT LOUD</span>
  <span aria-hidden className="absolute inset-0 translate-x-[4px] translate-y-[3px] text-[var(--blue)] mix-blend-multiply">PRINT LOUD</span>
</h1>
```

**Effect 2 — Halftone and grain.** A fixed overlay of radial-gradient dots (`radial-gradient(hsla(230,30%,14%,0.08) 1px, transparent 1.2px)` at 5px size) plus an SVG noise filter at 6% opacity, so the whole page has a printed texture.

**Effect 3 — Duotone images.** All photographs are converted to a pink-and-blue duotone with CSS: image set to `grayscale(1) contrast(1.2)` inside a wrapper with a blue background, and a pink overlay using `mix-blend-mode: lighten`. Hovering removes the effect and shows the original photo.

## 6. Component Breakdown

1. **Marquee** — 44px yellow band, dark ink text in Space Mono bold, scrolling offers.
2. **Navbar** — 80px, cream, wordmark left in Archivo Black with a small pink circle, links in Space Mono, `Get a quote` pink button with a 2px ink border right.
3. **Hero** — giant misregistered H1 (Effect 1) across three lines taking most of the viewport, a short mono paragraph bottom-left, and a slightly rotated duotone photo (Effect 3) bottom-right with a yellow tape strip at its top edge. *Image: risograph printer mid-print with colourful posters stacked beside it, studio setting, vivid.*
4. **What we print** — a 3-column grid of six products, each a bordered card with a duotone image, product name in Archivo Black, a mono spec line and a `from` price.
5. **Ink colours** — a row of eight circular ink swatches with names beneath in mono (pink, blue, yellow, green, orange, purple, black, gold). Each circle scales 1.1 on hover.
6. **Process** — four steps in a zigzag layout, each with a big misregistered number and short copy.
7. **Recent work** — masonry-style grid of eight print images at varied heights, each slightly rotated between -2 and 2 degrees, with client name in mono on hover. *Image briefs: colourful risograph posters, zines, art prints and gig posters laid on a table, bold graphic design, visible texture.*
8. **Workshops** — pink section with cream text, two workshop listings with date, length, price and a button.
9. **Studio** — split layout: duotone photo left, address, hours and a short paragraph right.
10. **Footer** — blue background, cream text, a giant misregistered `OFFSET CLUB` wordmark filling the width, links beneath.

## 7. Animations
- Hero H1: the two ink layers start 30px apart and slide into their 4px offset, 1.2s, ease `[0.22, 1, 0.36, 1]`, so it looks like the print registering
- Cards and swatches: fade up 20px, stagger 0.06s, with a random rotation settling to 0
- Recent work: images drop in with `y: -20 → 0` and settle to their rotation, stagger 0.05s
- Hover on duotone: filter transition 0.4s
- Marquee: 35s linear infinite

## 8. Responsive
- **Mobile (<768px):** H1 at 64px with offset reduced to 2px; hero photo moves below the paragraph and is not rotated; products 1 column; ink swatches become a horizontal scroll row; process becomes a single column; recent work 2 columns; duotone hover becomes a tap toggle; navbar shows wordmark and a pink menu button opening a full-screen cream overlay with huge links.
- **Tablet:** products 2 columns; recent work 3 columns.
- **Desktop:** max-width 1400px, `px-8`, section spacing `py-24`.

## 9. Full Copy

**Marquee:** `Riso prints from 50 copies · Screen-printed tees from 20 · Free delivery in Glasgow · Recycled paper as standard ·`

**Navbar:** Print · Colours · Work · Workshops · Studio — Get a quote

**Hero**
- H1: `PRINT / LOUD. / PRINT SMALL.`
- Paragraph: `Offset Club is a risograph and screen-print studio in Glasgow. We print zines, posters, art prints and merch for artists, bands and small brands, in runs from fifty to five thousand.`

**What we print** — H2 `WHAT WE PRINT`
1. **Zines** — `A5 or A6, stapled, up to 48 pages` — from £2.10 each
2. **Posters** — `A3 or A2, up to four colours` — from £1.40 each
3. **Art prints** — `Heavyweight 300gsm stock, numbered editions` — from £3.50 each
4. **Flyers** — `A6, double-sided, two colours` — from £0.22 each
5. **T-shirts** — `Screen-printed, organic cotton, one to three colours` — from £11 each
6. **Tote bags** — `Heavy canvas, one or two colours` — from £6 each

**Ink colours** — H2 `EIGHT INKS` · `Mix any two, three or four.` Swatches: Fluoro Pink · Medium Blue · Yellow · Green · Orange · Purple · Black · Metallic Gold

**Process** — H2 `HOW IT WORKS`
1. **Send your files** — `PDF with each colour on its own layer. Not sure how? We'll help.`
2. **Pick paper and inks** — `We post free paper and ink samples if you want to feel them first.`
3. **We print a proof** — `A photo of the first sheet off the drum before we run the lot.`
4. **Collect or delivered** — `Usually five working days from approval.`

**Recent work** — H2 `FRESH OFF THE DRUM` — client captions: `Mogwai tour poster` · `Glasgow Zine Fest` · `Wild Oat Bakery menus` · `Siobhan Reid art print` · `Barras Market tote` · `The Hug & Pint gig series` · `Leith Walk Cycling Club tees` · `Spit & Sawdust zine #7`

**Workshops** — H2 `LEARN TO RISO`
- **Intro to Risograph** — `Saturday 10 October · 10am – 4pm · £85` — `Design and print your own two-colour A3 poster. All materials included.` — `Book`
- **Make a Zine in a Day** — `Sunday 25 October · 11am – 5pm · £70` — `Write, lay out, print and bind a 16-page zine to take home.` — `Book`

**Studio** — H2 `COME AND SEE THE MACHINES` `We're in a railway arch in the East End. Drop in to talk through a project, or to pick up paper samples.` · `Arch 14, 70 Bain Street, Glasgow G40 2LA` · `Tue – Sat 10am – 6pm` · `hello@offsetclub.co.uk`

**Footer** — OFFSET CLUB · Print · Colours · Work · Workshops · Studio · File guide · Instagram · `Printed on recycled paper with soy-based inks.` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
