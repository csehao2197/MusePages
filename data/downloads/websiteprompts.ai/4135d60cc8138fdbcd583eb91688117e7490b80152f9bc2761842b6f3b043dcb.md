# Fold & Temper: Chocolate Shop Website Prompt

## 1. Goal
Build a restrained, appetising website for **Fold & Temper**, a bean to bar chocolate maker with one shop in Bristol. Warm ivory paper, dark cocoa ink, one burnt umber accent, a fine serif, and one signature: a bar that snaps into squares. Chocolate sites are usually gold foil and swirling liquid. This one is paper, type and one good snap.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no cart, no checkout. Buying links go to the shop address and an email. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F7F3EC;
  --ink: #241A12;
  --accent: #8A4B2A;           /* burnt umber */
  --on-accent: #FFFFFF;
  --surface: #EBE4D8;
  --muted: #60564C;
  --line: rgba(36,26,18,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines instead of boxes, no shadows anywhere.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Fraunces 300, clamp(46px, 6.4vw, 98px), line-height 1.0, letter-spacing -0.02em
- **Body:** Inter 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Origins, percentages, weights, prices, index labels.
- At most one italic word per headline, in burnt umber.

## 5. Signature element
**The snap.** A bar drawn flat on, as a rounded rectangle in a 1.5px ink stroke with a 4 by 6 grid of scored squares. On scroll into view, a hairline crack travels down the third score line over 0.5 seconds, then the right hand portion rotates 4 degrees and shifts 10px away from the left, as if snapped. Three small umber crumbs appear beneath.

It snaps once. No melting, no gloss, no particles falling continuously.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, ivory, one hairline beneath. Wordmark left, four links right, umber pill with a round arrow circle.
2. **Hero, inline pill**: a two line Fraunces headline with a small rounded photograph of a broken bar set between two of the words, a sentence and one action beneath. Min height `clamp(520px, 74vh, 800px)`. *Photograph: a dark chocolate bar snapped in half on a plain stone surface, raking light, crumbs visible, no styling props.*
3. **Statement**: light. One long Fraunces paragraph from one third, label `001/ Bean to bar` in the left column.
4. **The bar**: surface. The signature element (section 5) with a mono caption about temper.
5. **Origins, Swiss list**: light. Label `002/ Origins`, five stacked origins from one third, each with what it tastes of and a mono note on the percentage and the harvest.
6. **How a bar is made, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Five rows in paper colour with mono durations: sorting, roasting, cracking and winnowing, conching, tempering.
7. **Prices, ruled table**: light. Four rows: product, weight, price. Figures in mono, right aligned.
8. **What we will not do, index**: light. Two ruled columns: what goes in the chocolate and what never does. This is the section that separates a maker from a repackager.
9. **The shop, loose grid**: light. Five photographs at varied sizes with mono captions. *Photographs: the shop counter with bars laid in rows, a stone melanger running, cocoa beans in a sack, a slab being tempered on marble, the shopfront on a Bristol street.*
10. **One quote**: surface. A single centred quote in Fraunces at 30px with a signature line in mono.
11. **Visit or order, accent panel**: umber ground, inset panel. One line, two actions, a mono note about the tasting on the first Saturday.
12. **Footer**: dark ink. Giant cropped `FOLD & TEMPER` wordmark, shop address, hygiene rating line, three small links.

## 7. Motion
- Headline fades up 18px once, inline photograph settles from `scale 1.04`.
- The bar snaps once, as described.
- Origin rows fade in with 0.05s stagger.
- Grid images settle from `scale 1.03`, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the bar already snapped.

## 8. Responsive
- **Mobile under 768px:** inline photograph drops to its own line above the headline, headline at 40px. The bar scales to 260px wide and still snaps. Origins stack with the percentage on its own line. Price table becomes stacked rows. Grid one column. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1160px, gutters 40px, section padding 120px.

## 9. Full copy

**Wordmark:** FOLD & TEMPER. Meta: `BEAN TO BAR CHOCOLATE. ONE SHOP. BRISTOL.`

**Nav:** Origins, How, Prices, Visit. Button: `Visit the shop`

**Hero**
- Headline with the inline photograph between `is` and `a`: `Chocolate is *a* fruit product.`
- Sentence: `Cocoa is a fruit seed, and it tastes of where it grew, which is why our Madagascar is sharp with raspberry and our Peru is not.`
- Action: `Visit the shop`

**Statement** (label `001/ Bean to bar`)
`We buy beans by the sack from six farms, roast them in the back of the shop, and the only other things that go in are cane sugar and sometimes cocoa butter. No lecithin, no vanilla to cover a bad roast, no milk powder standing in for milk. A hundred grams takes four days, most of which is a granite wheel grinding very slowly while we do something else.`

**Bar caption:** `A properly tempered bar snaps rather than bends, and the break is matt rather than shiny. That is the only test worth knowing.`

**Origins** (label `002/ Origins`)
- **Madagascar, Sambirano.** `Sharp. Raspberry, lemon peel, almost no bitterness.` `72 %, 2026 HARVEST`
- **Peru, Piura.** `Soft and nutty. Cashew, brown sugar, a long finish.` `70 %, 2025 HARVEST`
- **Tanzania, Kokoa Kamili.** `Fruity and odd in a good way. Plum, red wine, a little tannin.` `75 %, 2026 HARVEST`
- **Vietnam, Ben Tre.** `Dark and spiced. Tobacco, dried fig, a touch of smoke.` `73 %, 2025 HARVEST`
- **Dominican Republic, Oko Caribe.** `The friendly one. Banana, honey, the bar we give to people who think they dislike dark chocolate.` `68 %, 2026 HARVEST`

**How a bar is made** (label `003/ Process`)
- `TWO HOURS` **Sorting.** `By hand, on a tray. Flat beans, mouldy beans and stones come out. Nobody enjoys this part.`
- `25 MINUTES` **Roasting.** `Low and slow, different for every origin. Too hot and everything tastes the same, which is how most chocolate is made.`
- `40 MINUTES` **Cracking and winnowing.** `The shell blows off in a draught and what is left is nib.`
- `THREE DAYS` **Conching.** `A granite wheel grinds nib and sugar until the grit is gone. Three days, running day and night.`
- `ONE HOUR` **Tempering.** `Heated, cooled and worked on marble so the fat sets in the right crystal. This is the part that makes it snap.`

**Prices** (label `004/ Prices`)
| Product | Weight | Price |
|---|---|---|
| Single origin bar | 70 g | 6.50 GBP |
| Three bar set, your choice | 210 g | 18.00 GBP |
| Drinking chocolate flakes | 250 g | 11.00 GBP |
| Cocoa nibs, roasted | 200 g | 7.50 GBP |
Note: `We post within the UK from October to April only. In summer it arrives as a puddle and we will not pretend otherwise.`

**What we will not do** (label `005/ Honest`)
- In our chocolate: `Cocoa beans`, `Cane sugar`, `Cocoa butter, in the milk bars only`, `Whole milk powder, in the milk bars only`
- Never: `Vanilla, which is almost always covering a bad roast`, `Soy lecithin`, `Vegetable fat in place of cocoa butter`, `Beans we cannot name the farm for`, `Flavours added to hide the origin`

**The shop** (label `006/ The shop`)
The counter on a Saturday · The melanger, day two · A sack from Piura · Tempering on marble · The shopfront, Picton Street

**Quote:** `I came in for a present and left with a bar of the Tanzania, which tasted so much like red wine that I made my husband try it with his eyes shut.`
Signature: `Ruth Enfield, Bristol`

**Visit or order panel**
- Line: `Come and taste five origins before you buy any of them. That is the whole point of having a shop.`
- Actions: `Visit the shop`, `Ask about posting`
- Mono: `FIRST SATURDAY OF THE MONTH, FREE TASTING AT 11:00. NO BOOKING.`

**Footer**
`FOLD & TEMPER`, `18 Picton Street, Bristol BS6 5QA`, `hello@foldandtemper.co.uk`
Mono: `Wednesday to Saturday, 10:00 to 17:00. Food hygiene rating 5.`
Links: `Origins`, `How a bar is made`, `Visit`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, melting chocolate animations, gold foil textures, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
