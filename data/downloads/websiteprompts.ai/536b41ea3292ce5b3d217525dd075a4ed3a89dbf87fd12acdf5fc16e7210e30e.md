# Ivory & Thread: Bridal Shop Website Prompt

## 1. Goal
Build an unhurried, grown up website for **Ivory & Thread**, a bridal boutique in Bath that stocks eleven designers and fits everything in house. Near white paper, soft black ink, one clay rose accent, a fine serif, and one signature: a dress drawn in a single continuous line, with a measuring tape that unrolls beneath it. Quiet and expensive, not sparkly.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking engine, no lightbox, no size calculator. Appointments go to an email link. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #FAF7F4;
  --ink: #241F1C;
  --accent: #9B6B5C;           /* clay rose */
  --on-accent: #FFFFFF;
  --surface: #EFE8E2;
  --muted: #635B55;
  --line: rgba(36,31,28,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines instead of boxes, no shadows anywhere.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=Jost:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Cormorant Garamond 300, clamp(46px, 6.6vw, 104px), line-height 1.0, letter-spacing -0.015em
- **Body:** Jost 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Prices, lead times, sizes, index labels.
- At most one italic word per headline, in clay rose.

## 5. Signature element
**A dress, in one line.** The silhouette of a gown drawn as a single unbroken 1.5px stroke, no fill: shoulder, bodice, waist, the fall of a skirt. It draws itself over 2 seconds on scroll with `pathLength`. When it finishes, a thin measuring tape unrolls horizontally beneath it with three marks in mono: bust, waist, hip.

It draws once and stops. No sparkle, no shimmer, no fabric simulation.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, paper, one hairline beneath. Wordmark left, four links right, clay pill with a round arrow circle.
2. **Hero, passepartout**: a photograph framed in a wide paper mat like a picture on a wall, headline above it, one sentence and one action below. Min height `clamp(540px, 76vh, 820px)`. *Photograph: a single ivory gown on a wooden hanger against a plain plastered wall, daylight from one side, no model.*
3. **Statement**: light. One long Cormorant paragraph starting at one third, label `001/ Eleven designers` in the left column.
4. **The dress**: surface. The signature element (section 5) with a mono caption about fitting.
5. **The designers, Swiss list**: light. Label `002/ What we stock`, five stacked designer names from one third, each with one line about the house and a mono price band.
6. **Your appointment, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Four rows in paper colour with mono markers: the first visit, choosing, the fittings, collection.
7. **Sizes and alterations, index**: light. Two ruled columns. Left: the sizes we actually hold in store, written plainly. Right: what alterations cost and how long they take.
8. **Recently, loose grid**: light. Six photographs at varied sizes with mono captions naming the designer and the month. *Photographs: understated wedding dresses on hangers and dress forms, close crops of a hem, a button back, a sleeve.*
9. **One quote**: surface. A single centred quote in Cormorant at 32px with a signature line in mono.
10. **Book a fitting, accent panel**: clay ground, inset panel. One line, two actions, a mono note about how long to allow.
11. **Footer**: dark ink. Giant cropped `IVORY & THREAD` wordmark, address, opening hours, three small links.

## 7. Motion
- Headline fades up 18px once, framed photograph settles from `scale 1.03`.
- Dress draws once, tape unrolls after it, as described.
- Grid images settle from `scale 1.03` with 0.07s stagger, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the dress drawn and the tape unrolled.

## 8. Responsive
- **Mobile under 768px:** passepartout mat narrows to 16px, headline at 42px. The drawn dress scales to 240px and the tape sits under it. Designer list stacks with the price band on its own line. Grid one column with offsets removed. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1160px, gutters 40px, section padding 120px.

## 9. Full copy

**Wordmark:** IVORY & THREAD. Meta: `BRIDAL BOUTIQUE. ELEVEN DESIGNERS. BATH.`

**Nav:** Designers, Appointments, Alterations, Visit. Button: `Book a fitting`

**Hero**
- Headline: `Try eleven dresses. Buy *one*.`
- Sentence: `A quiet shop on a Georgian street with two fitting rooms, no commission, and a seamstress upstairs.`
- Action: `Book a fitting`

**Statement** (label `001/ Eleven designers`)
`We stock eleven houses and nothing else, because eleven is the number our two fitting rooms can do properly in two hours. Every dress is altered here by Teresa, who has been doing it for thirty one years and has never once suggested you lose weight for the fitting.`

**Dress caption:** `Every gown is cut to the designer's size chart, not yours. That is what the three fittings are for.`

**The designers** (label `002/ What we stock`)
- **Charlotte Simpson.** `British, clean lines, almost no beading.` `1,400 TO 2,600 GBP`
- **Savin London.** `Separates and two piece looks for a register office.` `900 TO 1,900 GBP`
- **Halfpenny London.** `Soft, layered, good for a barn or a garden.` `1,800 TO 3,400 GBP`
- **Andrea Hawkes.** `Structured bodices, deep pockets, sensible straps.` `1,600 TO 2,900 GBP`
- **Rime Arodaky.** `French, sharper, for a bride who does not want a princess dress.` `2,100 TO 3,800 GBP`

**Your appointment** (label `003/ How it works`)
- `TWO HOURS` **The first visit.** `You, two people at most, and a glass of something. We pull five or six and you try them on. No pressure to buy on the day and no discount for doing so.`
- `SAME DAY OR LATER` **Choosing.** `If you want to sleep on it, sleep on it. We hold nothing back and we will not ring you.`
- `THREE FITTINGS` **The alterations.** `First at twelve weeks, second at six, last at two. Bring the shoes and the underwear you will actually wear.`
- `TWO WEEKS BEFORE` **Collection.** `Pressed, bagged, and shown to you on the hanger before it leaves.`

**Sizes and alterations** (label `004/ Plainly`)
- In store we hold: `UK 8 to UK 20 in the sample rails`, `A 22 and a 24 in four styles`, `Petite lengths in three houses`, `If we do not hold your size we will say so on the phone before you travel`
- Alterations: `Hem and bustle, 180 GBP` · `Bodice taken in or let out, 140 GBP` · `Straps or sleeves added, from 210 GBP` · `Full restructure, quoted at the first fitting` · `Allow twelve weeks, or tell us if you have less`

**Recently** (label `005/ Recently`)
Charlotte Simpson, June · Halfpenny, August · Savin, March · Andrea Hawkes, September · A hem, close up · A button back, finished

**Quote:** `I had been to two shops where they clipped me into things three sizes too small. Here they rang ahead and told me exactly what they had in a 20.`
Signature: `Rachel, married at Prior Park`

**Book a fitting panel**
- Line: `Two hours, two guests, eleven designers. Nothing is held back for later.`
- Actions: `Book a fitting`, `Ask about your size`
- Mono: `TUESDAY TO SATURDAY. ALLOW TWO HOURS. BRING SHOES IF YOU HAVE THEM.`

**Footer**
`IVORY & THREAD`, `9 Margaret's Buildings, Bath BA1 2LP`, `hello@ivoryandthread.co.uk`
Mono: `Tuesday to Saturday, 10:00 to 17:00. Appointment only.`
Links: `Designers`, `Alterations`, `Visit`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, sparkle effects, confetti, countdown timers, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
