# Abbey Square Market: Farmers Market Website Prompt

## 1. Goal
Build a warm, useful website for **Abbey Square Market**, a Saturday farmers market with twenty four traders. Pale green ground, deep forest ink, a rust accent, a serif display face, and one signature: a drawn plan of the square where hovering a stall tells you who is in it this week. Editorial rather than municipal.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no map library, no trader login. The stall plan is an inline SVG with hover state.

## 3. Design system
```css
:root {
  --paper: #DCE5C8;              /* pale green ground */
  --ink: #1F2A1A;                /* deep forest, text and dark ground */
  --accent: #B85A34;             /* rust */
  --on-accent: #FFFFFF;
  --surface: #D2DCBC;            /* tinted ground */
  --muted: #566049;              /* secondary text */
  --line: rgba(31,42,26,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** EB Garamond 500, letter-spacing -0.02em, line-height 1.0. Hero 88 to 140px, section titles 44 to 70px.
- **Body:** Manrope 300, 16px, line-height 1.55.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Stall numbers, times, counts, index labels.
- One italic word per headline at most, in rust.

## 5. Signature element
**A plan of the square.** The market square drawn in 1.5px ink hairlines: the abbey wall along the top, the fountain in the middle, and twenty four numbered stall rectangles around it. Each stall carries its number in mono. Hovering a stall fills it with a flat rust tint at 15 per cent and shows the trader's name and what they sell in a small label beside the plan. Tapping does the same on a phone.

One flat tint, no glow, no shadow, no pins. It is the most useful thing on the page, which is why it is the signature.

## 6. Sections, each a different skeleton

1. **Navbar**: 74px, pale green, one hairline beneath. Wordmark left, four links right, rust pill with a round arrow circle, and a mono line reading the next market date.
2. **Hero, passepartout**: a photograph framed in a wide tinted mat like a print on a wall, with a small centred title above it and a museum label caption beneath. Min height `clamp(540px, 78vh, 820px)`. *Photograph: a busy outdoor market square on a bright Saturday morning, striped awnings, crates of vegetables, an abbey wall behind.*
3. **This Saturday, hairline row**: light. One full width row: the date in the display face on the left, hours in mono in the middle, and a line about parking on the right. Rules above and below, nothing else.
4. **The plan, signature panel**: surface, inset 16px, `--panel-radius`. The square plan (section 5) with a mono caption and the trader label area beside it.
5. **Traders, ruled index**: dark forest ground. Twenty four rows on hairlines in three columns: stall number in mono, trader name in EB Garamond at 22px, what they sell in body text. Dense on purpose.
6. **What is good this week, statement**: light. One long serif paragraph starting at one third, written by the market manager, with the label `002/ This week` in the left column.
7. **Loose grid, photo led**: light. Six photographs at different sizes and vertical offsets, each with a mono caption naming the trader. *Photographs: a cheese counter, bread in crates, muddy carrots, cut flowers in buckets, a fishmonger's ice bed, apples in a wooden tray.*
8. **Becoming a trader, numbered rows**: surface. Four rows on hairlines: what it costs, what you need, how to apply, when you will hear back.
9. **One quote**: light. A single centred quote in EB Garamond at 36px with a signature line in mono.
10. **Getting here, accent panel**: rust ground, inset panel. Address, the two car parks with walking times, the bus routes, and one line about dogs.
11. **Footer**: dark forest. Giant cropped `ABBEY SQUARE` wordmark, the market's charity number, contact, four small links.

## 7. Motion
- Hero photograph settles from `scale 1.03` to `1` over 1.1s inside its mat.
- The plan draws its hairlines once over 1.2s using `pathLength`, then sits still.
- Trader rows fade in with 0.03s stagger.
- Loose grid images settle from `scale 1.03`, 0.08s apart.
- Hover: stall tint fades in over 0.15s, images zoom to 1.03, arrow circles slide 4px.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** the mat around the hero photograph narrows to 16px. The plan scales to fit the width and the trader label appears beneath it rather than beside it. The trader index becomes one column. The loose grid stacks with offsets removed. Nav keeps the wordmark and the next market date. No horizontal page scroll.
- **Tablet:** trader index two columns, loose grid two columns.
- **Desktop:** 1200px content width, gutters 40px, section padding 120px.

## 9. Full copy

**Wordmark:** ABBEY SQUARE MARKET. Meta: `EVERY SATURDAY. TWENTY FOUR TRADERS. SINCE 1998.`

**Nav:** The plan, Traders, This week, Getting here. Button: `Become a trader`. Mono: `NEXT MARKET: SATURDAY 3 OCTOBER.`

**Hero**
- Title above the mat: `Abbey Square Market`
- Caption beneath: `The square at half past nine, before the bread goes.`

**This Saturday**
- Date: `Saturday 3 October`
- Mono: `08:00 TO 14:00. RAIN OR OTHERWISE.`
- Line: `Free parking at Priory Street after 08:00, four minutes on foot.`

**Plan caption:** `Twenty four stalls. Hover one to see who is in it this week.`

**Traders** (label `001/ Traders`)
- `01` **Hollow Lane Dairy** `Raw milk cheese, butter, cream`
- `02` **Cross Oak Bakery** `Sourdough, rye, pastries until they go`
- `03` **Marlow Hill** `Vegetables, orchard fruit, hogget`
- `04` **The Fish Van** `Day boat fish from Brixham, Friday landed`
- `05` **Bell and Bramble** `Preserves, chutney, honey`
- `06` **Nettlebed Growers** `Salad, herbs, tomatoes in season`
- `07` **Coombe Farm Eggs** `Eggs, duck eggs, occasional geese`
- `08` **Weavers Butchers** `Beef, pork, sausages made on Thursday`
- `09` **The Flower Cart** `Cut flowers, seasonal, British grown`
- `10` **Ash Tree Cider** `Cider, perry, apple juice`
- `11` **Ground Coffee Co** `Coffee to drink and beans to take`
- `12` **Pickle Street** `Kimchi, kraut, hot sauce`
- `13` **Old Mill Flour** `Stoneground flour, oats, pulses`
- `14` **Two Fields Lamb** `Lamb, mutton, sheepskins in winter`
- `15` **The Cake Table** `Whole cakes, tray bakes, gluten free on request`
- `16` **Severn Smokery** `Smoked salmon, trout, mackerel`
- `17` **Wild Yeast** `Bagels and focaccia, sells out by eleven`
- `18` **Green Man Kitchen** `Hot food, soup from October`
- `19` **Hedgerow Herbals** `Teas, tinctures, dried herbs`
- `20` **Blackdown Charcuterie** `Salami, coppa, pancetta`
- `21` **The Olive Stall** `Olives, oils, preserved lemons`
- `22` **Cotswold Mushrooms** `Oyster, shiitake, seasonal wild`
- `23` **Sourwood Chocolate** `Bean to bar, made twelve miles away`
- `24` **Knife and Steel** `Knife sharpening while you shop`

**This week** (label `002/ This week`)
`The plums are finished and the first proper squash arrived on Marlow Hill's stall this morning, which means autumn whatever the weather says. Cross Oak has doubled the rye because it sold out by ten for three weeks running. The Fish Van is not here on the 10th, they are on the boat. Knife and Steel takes about fifteen minutes a blade, so hand it in early and shop while you wait.`
Signed: *Marta Reeve, market manager*

**Loose grid captions:** `Hollow Lane Dairy`, `Cross Oak Bakery`, `Marlow Hill`, `The Flower Cart`, `The Fish Van`, `Ash Tree Cider`

**Becoming a trader** (label `003/ Traders wanted`)
- **What it costs.** `32 GBP a stall for a 3 metre pitch, 48 GBP for 6 metres. Paid on the day.`
- **What you need.** `Public liability insurance, food registration with your own council, and your own gazebo and weights.`
- **How to apply.** `Send an email with what you make, where you make it and two photographs of your stall.`
- **When you will hear back.** `Within two weeks. We hold a waiting list for cheese, bread and vegetables because those are full.`

**Quote:** `I have bought the same bread from the same man for eleven years and we have never once talked about anything but the weather.`
Signature: `Bridget Lawler, market shopper since 1999`

**Getting here panel**
- Address: `Abbey Square, Pershore, Worcestershire WR10 1AB`
- Parking: `Priory Street car park, free from 08:00, four minutes on foot. Bridge Street car park, 1 GBP, seven minutes.`
- Buses: `The 553 and the 382 stop on High Street, two minutes away.`
- Line: `Dogs are welcome everywhere except the hot food stall.`

**Footer**
`ABBEY SQUARE`, `Abbey Square Market is run by a community interest company, number 11428805`, `hello@abbeysquaremarket.co.uk`
Links: `Traders`, `Become a trader`, `This week`, `Instagram`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, embedded maps, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
