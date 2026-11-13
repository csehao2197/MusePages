# Sugar & Salt: Wedding Cake Website Prompt

## 1. Goal
Build a soft, editorial website for **Sugar & Salt**, a baker who makes eight wedding cakes a month and nothing else. Chalk white, warm brown ink, one dusty rose accent, a fine serif, and one signature: a three tier cake that stacks itself, drawn in a single line. Restraint, not ruffles.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking system, no cake builder. Enquiry buttons link to email. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F6F3EF;
  --ink: #3A2F2A;
  --accent: #B98B86;           /* dusty rose */
  --on-accent: #FFFFFF;
  --surface: #EDE7E1;
  --muted: #7B6E67;
  --line: rgba(58,47,42,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines and tints, no shadowed cards.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,500;1,300&family=Jost:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Cormorant 300, clamp(48px, 7vw, 112px), line-height 1.0, letter-spacing -0.015em
- **Body:** Jost 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Servings, prices, dates, index labels.
- At most one italic word per headline, in dusty rose.

## 5. Signature element
**A cake that stacks.** Three tiers drawn as three rounded rectangles in a single 1.5px ink stroke, plus a small drawn cake board. On scroll into view the bottom tier draws first, then the middle, then the top, 300ms apart, and a few dusty rose dots settle on the top as figs. Nothing wobbles and nothing bounces.

Drawn with `pathLength`, no fill, no shadow, once only.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, chalk, one hairline beneath. Wordmark left, four links right, rose pill with a round arrow circle.
2. **Hero, inline pill**: a two line serif headline with a small rounded photograph of a cut cake set between two of the words. Sentence and action beneath. Min height `clamp(520px, 76vh, 800px)`. *Photograph: a slice cut from a naked sponge cake showing the crumb and a thin layer of jam, natural light, plain plate.*
3. **Statement**: light. One long serif paragraph from one third, label `001/ Eight a month` in the left column.
4. **The cake**: surface. The stacking cake (section 5), centred, with a mono caption about sizes.
5. **Flavours, Swiss list**: light. Label `002/ Flavours`, six stacked flavour names from one third, each with what is inside and a mono note about which season it suits.
6. **Sizes and prices, ruled table**: light. Four rows: tiers, servings, from price, notes. Figures in mono, right aligned.
7. **Tasting box**: dark ink ground, inset 16px, `--panel-radius`. Three short lines in paper colour about what arrives in the post, and a price in mono.
8. **Recent cakes, loose grid**: light. Six cakes at different sizes and vertical offsets, each captioned in mono with the venue and month. *Photographs: understated wedding cakes, mostly white and cream, some with fruit or foliage, photographed at the venue in daylight.*
9. **One quote**: surface. A single centred quote in Cormorant at 32px with a signature line in mono.
10. **Dates left, accent panel**: rose ground, inset panel. The next four months with how many slots remain in mono, one line about deposits, two actions.
11. **Footer**: dark ink. Giant cropped `SUGAR & SALT` wordmark, kitchen address, hygiene rating line, three small links.

## 7. Motion
- Headline fades up 18px once, inline photograph settles from `scale 1.04`.
- Cake stacks once, as described.
- Grid images settle from `scale 1.03` with 0.07s stagger, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the cake fully drawn.

## 8. Responsive
- **Mobile under 768px:** inline photograph drops to its own line above the headline, headline at 44px. The drawn cake scales to 240px. Price table becomes stacked rows. Grid one column with offsets removed. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1180px, gutters 40px, section padding 120px.

## 9. Full copy

**Wordmark:** SUGAR & SALT. Meta: `WEDDING CAKES. EIGHT A MONTH. NORFOLK AND SUFFOLK.`

**Nav:** Flavours, Sizes, Tasting, Dates. Button: `Ask about your date`

**Hero**
- Headline with the inline photograph between `is` and `the`: `The cake is *the* last course.`
- Sentence: `Not a centrepiece, not a photograph opportunity. Something eight tables actually want a second slice of.`
- Action: `Ask about your date`

**Statement** (label `001/ Eight a month`)
`I make eight wedding cakes a month and nothing else, which is the only way to bake everything the week of the wedding rather than the month before. No fondant, no dowel forests, no sugar flowers that nobody eats. Sponge, buttercream, fruit, and a bit of foliage from whoever is doing your flowers.`

**Flavours** (label `002/ Flavours`)
- **Lemon and elderflower.** `Lemon sponge, elderflower syrup, mascarpone buttercream.` `SPRING AND SUMMER`
- **Rhubarb and custard.** `Vanilla sponge, roasted rhubarb, crème pâtissière.` `LATE SPRING`
- **Salted caramel.** `Brown sugar sponge, caramel, a good pinch of salt.` `ALL YEAR, ALWAYS FIRST TO GO`
- **Fig and honey.** `Almond sponge, fig jam, honey buttercream.` `LATE SUMMER AND AUTUMN`
- **Chocolate and sour cherry.** `Dark chocolate sponge, kirsch cherries, ganache.` `AUTUMN AND WINTER`
- **The proper fruit cake.** `Fed for three months, marzipan, no icing unless you want it.` `WINTER, AND FOR KEEPING A TIER`

**Sizes and prices** (label `003/ Sizes`)
| Tiers | Serves | From | Notes |
|---|---|---|---|
| One, 8 inch | 20 | 180 GBP | Registry offices and small dinners |
| Two | 60 | 340 GBP | The most common by far |
| Three | 110 | 520 GBP | Add a cutting cake if you are over 120 |
| Three plus cutting cake | 160 | 620 GBP | Cutting cake stays in the kitchen |
Note: `Prices include delivery within 40 miles, setting up at the venue and taking the stand away the next morning.`

**Tasting box**: `Five flavours, two slices of each, in a box by post.` · `A card with what is in each and which season it suits.` · `The cost comes off your final bill if you book.` · Mono: `28 GBP, POSTED SECOND CLASS ON A MONDAY`

**Recent cakes** (label `004/ Recently`)
Elms Barn, June · Hales Hall, August · Cley village hall, May · Voewood, September · A garden in Southwold, July · Norwich registry office, March

**Quote:** `Three people asked for the recipe and my aunt asked for the leftovers. There were no leftovers.`
Signature: `Hannah and Joss, married at Hales Hall`

**Dates left panel**
- Months: `MAY 2027, 3 LEFT` · `JUNE 2027, 1 LEFT` · `JULY 2027, 5 LEFT` · `AUGUST 2027, 6 LEFT`
- Line: `A date is held for two weeks without a deposit. After that it goes to whoever asks next, and the deposit is a third.`
- Actions: `Ask about your date`, `Order a tasting box`

**Footer**
`SUGAR & SALT`, `Unit 3, Old Dairy, Reepham, Norfolk NR10 4JW`, `hello@sugarandsalt.cake`
Mono: `Registered with Broadland District Council. Food hygiene rating 5.`
Links: `Flavours`, `Sizes`, `Tasting box`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
