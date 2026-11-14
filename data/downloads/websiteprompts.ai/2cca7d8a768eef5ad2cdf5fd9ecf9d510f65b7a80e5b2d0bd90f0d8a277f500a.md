# Marlow Hill: Farm Website Prompt

## 1. Goal
Build an editorial, calm, premium website for **Marlow Hill**, a 140 acre mixed farm in Herefordshire with a farm shop and a weekly veg box. It should feel like a good food magazine: soft green ground, warm brass accent, large serif headlines, real photographs of fields and produce given room, and small precise facts set in mono.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries. `lucide-react` only for arrow glyphs. No icon grids, no decorative icons, no checkout.

## 3. Design system
```css
:root {
  --paper: #E9E6D8;              /* light ground */
  --ink: #1E3A2E;                /* deep green, text and dark ground */
  --accent: #B8893F;             /* brass */
  --on-accent: #FFFFFF;
  --surface: #E1DECF;            /* tinted ground */
  --muted: #5A6B60;              /* secondary text */
  --line: rgba(30,58,46,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines and tints instead of boxes and shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&family=Manrope:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Newsreader 300, letter-spacing -0.02em, line-height 1.0. Hero 88 to 140px, section titles 44 to 72px.
- **Body:** Manrope 300, 16px, line-height 1.55.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Only for acreage, months, weights, prices, index labels.
- One italic word per headline at most, in brass.

## 5. Signature element
**A season wheel.** A circle drawn in a single 1.5px brass stroke, divided into twelve segments by hairline spokes, each segment labelled with a month in mono around the outside. Inside the circle, the name of what is being picked in the current month is set in Newsreader at 40px. The wheel has a thin brass arc that sweeps from January round to the current month when the section enters view, drawn with `pathLength`, taking 1.2 seconds.

The current month comes from the visitor's own clock, so the page is always right. Hovering any month segment swaps the produce name inside, and moving away returns it to today. No fill, no glow.

## 6. Sections, each a different skeleton

1. **Navbar**: 78px, paper, one hairline beneath. Wordmark left, five links centre, a brass pill button with a round arrow circle right.
2. **Hero, signature word**: full bleed landscape photograph with the farm name set across the full width along the bottom edge in Newsreader, letters almost touching the margins. Place and season in mono top right. Min height `clamp(540px, 78vh, 820px)`. *Photograph: rolling Herefordshire fields at the end of summer, hedgerows, long shadows, a single oak.*
3. **Letter from the farm**: light. A narrow centred column, three short paragraphs signed with an italic name, with a small square portrait above. *Photograph: a farmer in their fifties leaning on a gate, working clothes, natural light.*
4. **The season wheel**: surface. The signature element (section 5) centred, with a mono caption beneath.
5. **The veg box, hairline rows**: dark green ground. Four full width rows separated by hairlines: box size, what is usually in it, how often, price. Price right aligned in mono. One brass line beneath about collection days.
6. **The farm shop, passepartout**: light. A single photograph framed in a wide tinted mat like a print on a wall, with a small centred title above and a museum label caption beneath. *Photograph: a farm shop counter with crates of vegetables, brown paper bags and a chalkboard, daylight from a doorway.*
7. **What we grow, index**: light. Three ruled columns on hairlines: vegetables, orchard, meat. Plain rows, mono for months in season. Dense on purpose.
8. **Loose grid of the year**: surface. Six photographs at different sizes and vertical offsets, each with a mono caption naming the month and the field. *Photographs: bare ploughed earth, blossom, a full hedgerow, harvest, a frosted gate, lambs.*
9. **One quote**: light. A single centred quote in Newsreader at 38px, signature line in mono beneath.
10. **Visit, accent panel**: brass ground, inset 16px, `--panel-radius`. Big serif line, opening hours with today highlighted, address, and two actions.
11. **Footer**: dark green. Giant cropped `MARLOW HILL` wordmark, address, telephone, a mono line about the bus, four small links.

## 7. Motion
- Hero wordmark fades up 16px over 0.9s.
- Photographs settle from `scale 1.03` to `1` over 1.1s.
- Season wheel arc draws once, as described.
- Veg box rows fade in with 0.05s stagger.
- Hover: photographs zoom to 1.03, links underline from the left, arrow circles slide 4px.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion` by showing final states.

## 8. Responsive
- **Mobile under 768px:** hero wordmark drops to 56px on two lines, min height `clamp(420px, 66vh, 600px)`. Season wheel scales to 280px and the month labels shrink to 9px. Index becomes one column. Loose grid becomes a single column with offsets removed. Nav keeps wordmark and button, links behind a `Menu` toggle. No horizontal page scroll.
- **Tablet:** index two columns, loose grid two columns.
- **Desktop:** 1200px content width, gutters 40px, section padding 120px.

## 9. Full copy

**Wordmark:** MARLOW HILL. Meta: `HEREFORDSHIRE. 140 ACRES. FARMING SINCE 1946.`

**Nav:** Veg boxes, Farm shop, What we grow, The year, Visit. Button: `Order a box`

**Hero**
- Wordmark across the bottom: `MARLOW HILL`
- Mono, top right: `EARDISLAND, HEREFORDSHIRE. LATE SUMMER.`

**Letter from the farm**
`My grandfather took this land on in 1946 with two horses and a debt. We have 140 acres now, about a third of it hedgerow, orchard and rough ground that grows nothing and matters anyway.`
`We sell nearly everything within twenty miles of the gate. A box on a Thursday, the shop at weekends, and whatever the kitchen at the Green Man takes off us in between. No supermarkets, which means we grow for flavour and for keeping rather than for a specification sheet.`
`If you want to know how something was grown, ask. We will tell you honestly, including the year the carrots were a disaster.`
Signature: *Tom Marlow*

**Season wheel caption:** `Picked this month, from the field nearest the house.`
Produce by month: January `Leeks`, February `Purple sprouting`, March `Forced rhubarb`, April `Asparagus`, May `Broad beans`, June `Strawberries`, July `New potatoes`, August `Sweetcorn`, September `Plums`, October `Squash`, November `Cavolo nero`, December `Parsnips`

**Veg box** (label `003/ Boxes`)
- `Small, feeds two` ... `Six or seven kinds, always a root, a leaf and a herb` ... `Weekly or fortnightly` ... `14 GBP`
- `Large, feeds four` ... `Nine or ten kinds, with fruit in season` ... `Weekly or fortnightly` ... `22 GBP`
- `Fruit only` ... `Orchard fruit from August to January` ... `Weekly` ... `9 GBP`
- `Meat box, quarterly` ... `Mutton, hogget and pork, butchered to order` ... `Four times a year` ... `65 GBP`
Brass line: `Collection from the shop on Thursday, or delivery within twelve miles on Friday mornings.`

**Farm shop caption:** `The shop, in the old milking parlour. Open Friday to Sunday.`

**What we grow** (label `004/ Ground`)
- Vegetables: `Potatoes, May to October`, `Leeks, October to March`, `Squash, September to December`, `Broad beans, May to July`, `Kale, November to March`, `Asparagus, April to June`
- Orchard: `Cider apples, September`, `Eating apples, October`, `Plums, August`, `Damsons, September`, `Pears, October`
- Meat: `Ryeland hogget, autumn`, `Tamworth pork, year round`, `Mutton, winter`

**The year** (label `005/ The year`)
Captions: `February, Long Field`, `April, the orchard`, `June, the top hedge`, `August, Nine Acre`, `November, the gate`, `March, the lambing shed`

**Quote:** `The plums taste like the ones I remember, which I had assumed was just me getting older.`
Signature: `Ceri Hughes, Leominster`

**Visit panel**
- Line: `The shop is open, the kettle usually is too.`
- Hours: `Friday 10:00 to 17:00. Saturday 9:00 to 17:00. Sunday 10:00 to 14:00. Closed Monday to Thursday except for box collection.`
- Address: `Marlow Hill Farm, Eardisland, Herefordshire HR6 9BT`
- Actions: `Order a box`, `Directions`

**Footer**
`MARLOW HILL`, `Eardisland, Herefordshire HR6 9BT`, `01544 555 0117`, `shop@marlowhill.farm`
Mono line: `The 461 bus stops at the end of the lane, four times a day.`
Links: `Veg boxes`, `Farm shop`, `What we grow`, `Instagram`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, stat soup, fake precise data, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical full width stripes.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
