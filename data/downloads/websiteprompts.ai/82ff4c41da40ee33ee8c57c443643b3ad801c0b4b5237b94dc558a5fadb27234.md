# Ember & Wick — Candle Shop Website Prompt

## 1. Goal Statement
Build a dark, glowing website for **Ember & Wick**, a small-batch candle maker — a near-black warm background, a soft amber light that follows the cursor like a candle carried through a dark room, elegant serif type, and product photography that feels lit by flame alone.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries and no cart logic. Product buttons are links.

## 3. Design System — Colors
```css
:root {
  --background: hsl(25, 20%, 6%);        /* warm near-black */
  --foreground: hsl(36, 38%, 88%);       /* candlelit cream */
  --primary: hsl(34, 88%, 58%);          /* flame amber */
  --primary-foreground: hsl(25, 20%, 6%);
  --muted-foreground: hsl(30, 12%, 58%);
  --border: hsl(28, 14%, 18%);
  --card: hsl(25, 18%, 10%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Manrope:wght@300;400;600&display=swap" rel="stylesheet" />
```
- **H1:** Fraunces 300, opsz 144, clamp(52px, 8vw, 120px), line-height 0.95, letter-spacing -0.02em
- **H2:** Fraunces 300, clamp(36px, 4.5vw, 64px)
- **Italic accent:** Fraunces 300 italic in `--primary`
- **Body:** Manrope 300, 16px, line-height 1.75
- **Labels and prices:** Manrope 600, 11px, uppercase, letter-spacing 0.18em

## 5. Visual Effects

**Effect 1 — Candlelight cursor.** A fixed, pointer-events-none layer covering the viewport with a radial gradient centred on the cursor. The glow lags slightly behind the pointer using a spring. On touch devices, the glow sits fixed near the top centre of the hero and slowly flickers instead.

```jsx
const x = useSpring(0, { stiffness: 60, damping: 20 });
const y = useSpring(0, { stiffness: 60, damping: 20 });
// on mousemove: x.set(e.clientX); y.set(e.clientY);
const bg = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, hsla(34, 88%, 58%, 0.14), transparent 70%)`;
<motion.div style={{ background: bg }} className="pointer-events-none fixed inset-0 z-30" />
```

**Effect 2 — Flicker.** The small flame icon beside the wordmark and the hero glow on mobile use a subtle flicker: opacity keyframes `[1, 0.85, 0.95, 0.8, 1]` over 3s, repeating, with slight random delay.

**Effect 3 — Warm vignette on images.** Every product image has an inner vignette overlay `radial-gradient(ellipse at center, transparent 40%, hsla(25, 20%, 6%, 0.7) 100%)` so all photography blends into the dark page.

## 6. Component Breakdown

1. **Navbar** — 80px, transparent over the hero, wordmark left with a small flickering flame icon (Effect 2), links centre, `Bag (0)` right. Becomes `--background` at 90% with blur after 80px scroll.
2. **Hero** — full viewport. Centred H1, subline, button. Behind the text a dark candle photograph with a heavy bottom gradient. *Image: single lit amber glass candle on dark wood, flame the only light source, deep shadows, warm glow, moody.*
3. **Scent families** — four columns separated by thin vertical borders: family name in Fraunces italic, three words, and a candle count.
4. **Bestsellers** — a 3-column grid of candles on `--card` with vignette (Effect 3): image 4:5, name, scent notes line, burn time and price.
5. **Made by hand** — split section: tall image left, text right with three short numbered steps. *Image: hands pouring melted wax from a steel jug into amber glass jars, dim workshop light, steam visible.*
6. **Scent quote** — one enormous italic Fraunces line centred across the page with lots of space around it.
7. **Gift sets** — two wide horizontal cards side by side, each with image, set name, contents and price.
8. **Candle care** — a simple 4-row list with a number, a heading and one sentence. Separated by borders.
9. **Workshop** — a panel describing the monthly candle-making evening, with date, price and a `Book a place` link.
10. **Footer** — three columns, newsletter line with an email input, and a giant italic `Ember & Wick` across the bottom at 14vw in 6% opacity cream.

## 7. Animations
- Hero H1: fade and blur in, `filter: blur(12px) → blur(0)`, `opacity 0 → 1`, 1.4s, ease out
- Subline and button: same, delays 0.4s and 0.6s
- Product cards: fade up 20px, stagger 0.1s
- Product image hover: scale 1.05 over 1s and the vignette lightens slightly
- Scent quote: letters fade in with 0.02s stagger as the section enters view
- Candlelight cursor: Effect 1, always running

## 8. Responsive
- **Mobile (<768px):** cursor glow replaced by a fixed flickering glow at the top of the hero; H1 at 52px; scent families become a 2×2 grid; bestsellers show as a horizontal snap-scroll row at 80% width per card; made-by-hand stacks image first; gift sets stack; navbar shows wordmark and a menu icon opening a full-screen dark overlay.
- **Tablet:** bestsellers 2 columns; scent families stay 4 columns with smaller type.
- **Desktop:** max-width 1320px, `px-8`, section spacing `py-32`.

## 9. Full Copy

**Brand:** EMBER & WICK · Hand-poured in Edinburgh

**Navbar:** Candles · Gift sets · Workshop · Our story — Bag (0)

**Hero**
- Label: `SMALL-BATCH SOY CANDLES`
- H1: `Light something *slower*.`
- Subline: `Hand-poured soy wax, cotton wicks and scents built like perfume. Every candle burns for at least fifty hours.`
- Button: `Shop candles`

**Scent families**
- ***Woods*** — `Cedar, smoke, vetiver` — 5 candles
- ***Florals*** — `Fig leaf, rose, neroli` — 4 candles
- ***Kitchen*** — `Tomato vine, basil, black pepper` — 3 candles
- ***Seasonal*** — `Pine, clove, orange peel` — 4 candles

**Bestsellers** — H2 `The ones people *reorder*.`
1. **Bothy** — `Peat smoke · birch tar · oakmoss` — 55 hours — £34
2. **Fig Terrace** — `Fig leaf · warm stone · white tea` — 55 hours — £34
3. **Library** — `Old paper · cedarwood · tonka` — 55 hours — £34
4. **Leith Harbour** — `Sea salt · driftwood · sage` — 55 hours — £34
5. **Glasshouse** — `Tomato vine · basil · wet earth` — 55 hours — £34
6. **Midwinter** — `Pine needle · clove · blood orange` — 55 hours — £36

**Made by hand** — H2 `Poured in batches of *forty*.`
1. `We blend each fragrance ourselves with perfumers' oils, never ready-made candle scents.`
2. `Wax is poured at exactly 62 degrees and left to cure for two full weeks before it ships.`
3. `Every candle is test-burned from each batch, and labelled with the batch number and date.`

**Scent quote:** `*A candle is a small way of deciding how a room should feel.*`

**Gift sets**
- **The Evening Set** — `Bothy and Library in 200g jars, with a brass wick trimmer.` — £72
- **The Trio** — `Three 90g travel candles of your choice, in a linen-lined box.` — £45

**Candle care** — Label `BURN IT WELL`
1. **First burn** — `Let the wax melt all the way to the edge, usually two to three hours, so it never tunnels.`
2. **Trim the wick** — `Cut it to 5mm before every burn for a clean, steady flame.`
3. **Four hours at most** — `After that the wick mushrooms and the glass gets too hot.`
4. **Keep the lid** — `Put it back on once cool to keep the scent strong.`

**Workshop** — H2 `Make your own, *by candlelight*.` `Once a month in our Leith workshop. Blend a scent, pour two candles and take them home. Wine and oatcakes included.` — `Next date: Thursday 8 October, 7pm · £55 · 10 places` — `Book a place`

**Footer** — Candles · Gift sets · Workshop · Wholesale · Delivery · Care guide · Contact · `One email a month, about new scents.` Input `Your email` · `Ember & Wick, 22 Coburg Street, Leith, Edinburgh EH6 6ET` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
