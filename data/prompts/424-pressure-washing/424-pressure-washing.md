# Fairweather Cleaning: Pressure Washing Website Prompt

## 1. Goal
Build a plain, convincing website for **Fairweather Cleaning**, a soft wash and pressure washing firm in Kent. Cool grey paper, near black ink, one deep teal accent, a sturdy grotesk, and one signature: a clean stripe that travels across a dirty surface. The whole trade sells on one thing, the before and after, so the page should show it rather than talk about it.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no draggable before and after slider, no quote calculator. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #EFF2F3;
  --ink: #12191C;
  --accent: #1C6E8C;           /* deep teal */
  --on-accent: #FFFFFF;
  --surface: #E0E5E7;
  --muted: #54605F;
  --line: rgba(18,25,28,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, surface, light, dark, light, accent, dark footer. Hairlines do the structuring.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Archivo 700, clamp(42px, 5.6vw, 80px), line-height 1.0, letter-spacing -0.035em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Prices, square metres, times on site, index labels.
- No italics. Emphasis is a whole line in teal.

## 5. Signature element
**The clean stripe.** One wide photograph of a dirty surface, a block paved driveway green with algae. A vertical band travels across it from left to right over 2 seconds on scroll, and everything behind the band is the cleaned version of the same photograph. The band itself is a 3px teal line. It crosses once and stops, leaving the whole image clean.

Built with two images stacked and a `clip-path` inset animated on one of them. No drag handle, no hover, no repeat.

## 6. Sections, each a different skeleton

1. **Navbar**: 70px, paper, one hairline beneath. Wordmark left, four links right, teal pill with a round arrow circle, and a mono line with the phone number.
2. **Hero, corners**: a full bleed photograph of a half cleaned patio, no headline block. Wordmark top left, nav top right, a mono line bottom left naming the job, a small action bottom right. Min height `clamp(540px, 78vh, 820px)`.
3. **The stripe**: surface. The signature element (section 5) with a mono caption giving the square metres and the time it took.
4. **What we clean, Swiss list**: light. Label `001/ Surfaces`, five stacked surface types from one third, each with one line about the method and a mono note on pressure.
5. **Prices, ruled table**: light. Five rows: job, typical size, from price, time on site. Figures in mono, right aligned.
6. **Soft wash, not blasting, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Three rows in paper colour explaining why a render or a roof gets chemicals and low pressure, and what high pressure would do to it.
7. **Before we arrive, index**: light. Two ruled columns: what the customer needs to do, and what we bring. Practical, short.
8. **Recent jobs, loose grid**: light. Six photographs at varied sizes, each a finished surface with a mono caption giving the town and the surface. *Photographs: a cleaned block paved drive, a render wall half done, a patio, a roof from a ladder, a decked area, a commercial forecourt.*
9. **One quote**: surface. A single centred quote in Archivo at 28px with a signature line in mono.
10. **Get a price, accent panel**: teal ground, inset panel. One line, the phone number set large, a mono note about sending a photograph for a quote.
11. **Footer**: dark ink. Giant cropped `FAIRWEATHER` wordmark, coverage area, insurance and water licence line, three small links.

## 7. Motion
- Corner text fades in 0.4s after the hero photograph settles from `scale 1.03`.
- The stripe crosses once, as described.
- Table rows fade in with 0.04s stagger.
- Grid images settle from `scale 1.03`, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the cleaned image with no band.

## 8. Responsive
- **Mobile under 768px:** hero corner items stack into one column at the bottom. The stripe keeps full width and crosses faster. Price table becomes stacked rows with the price on the same line as the job. Grid one column. A teal call bar fixes to the bottom of the screen, respecting the safe area inset. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1200px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** FAIRWEATHER CLEANING. Meta: `SOFT WASH AND PRESSURE WASHING. KENT AND EAST SUSSEX.`

**Nav:** Surfaces, Prices, Method, Contact. Button: `Get a price`. Mono: `01892 555 0173`

**Hero**
- Mono bottom left: `BLOCK PAVED DRIVE, TONBRIDGE. 78 SQ M, FOUR HOURS.`
- Action bottom right: `Get a price`

**Stripe caption:** `Same drive, same afternoon. 78 square metres, four hours, re sanded the next morning.`

**What we clean** (label `001/ Surfaces`)
- **Block paving and drives.** `Lifted, cleaned, re sanded and sealed if you want it.` `HIGH PRESSURE, ROTARY HEAD`
- **Patios and natural stone.** `Gentler. Sandstone and limestone scar easily and we will not risk it.` `MEDIUM PRESSURE`
- **Render and painted walls.** `Soft wash only. Chemicals do the work and the pressure stays low.` `LOW PRESSURE, UNDER 200 PSI`
- **Roofs.** `Moss scraped, then a biocide that keeps working for months. No walking on tiles that cannot take it.` `LOW PRESSURE, FROM A LADDER OR TOWER`
- **Decking and fencing.** `Cleaned and left to dry, then treated if you have asked for it.` `LOW TO MEDIUM`

**Prices** (label `002/ Prices`)
| Job | Typical size | From | On site |
|---|---|---|---|
| Driveway, block paved | 60 to 90 sq m | 280 GBP | Half a day |
| Driveway with re sanding | 60 to 90 sq m | 360 GBP | Half a day plus a return |
| Patio | 25 to 40 sq m | 180 GBP | Three hours |
| Render, two storey semi | 90 sq m of wall | 420 GBP | A full day |
| Roof, soft wash | A three bed semi | 650 GBP | A full day |
Note: `Prices include water, power and all chemicals. We do not charge extra for a tap you do not have.`

**Soft wash, not blasting** (label `003/ Method`)
- **01 Render is not stone.** `A pressure washer will strip render, blow the seal on a window and force water behind the wall. We use a chemical soft wash at under 200 psi and let it work for twenty minutes.`
- **02 A roof is worse.** `High pressure on tiles removes the surface granules and shortens the life of the roof. We scrape, treat and leave it. The colour keeps improving for about six weeks.`
- **03 Where pressure is right.** `Concrete, block paving and tarmac can take it, and that is where the rotary head comes out. Nowhere else.`

**Before we arrive** (label `004/ Practical`)
- You: `Move cars off the drive`, `Close the windows on that side`, `Point out any loose pointing or cracked slabs`, `Tell us if a neighbour shares the drive`, `Keep pets in for the afternoon`
- We bring: `Our own water, 1,000 litres on the van`, `Our own power`, `Sheeting for plants and doors`, `Sand for the re sanding if booked`, `A hoover for the mess at the end`

**Recent jobs** (label `005/ Recently`)
Block drive, Tonbridge · Render, Tunbridge Wells · Patio, Cranbrook · Roof, Paddock Wood · Decking, Hawkhurst · Forecourt, Ashford

**Quote:** `He talked me out of jet washing the render and did a soft wash instead. Cost less and the wall is still intact two winters later.`
Signature: `Peter Lamb, Tunbridge Wells`

**Get a price panel**
- Line: `Send a photograph of the surface and we will price it the same day.`
- Phone set large: `01892 555 0173`
- Mono: `PHOTOGRAPH BY TEXT OR EMAIL. NO SURVEY NEEDED FOR MOST JOBS.`

**Footer**
`FAIRWEATHER CLEANING`, `Covering Kent and East Sussex`, `hello@fairweathercleaning.co.uk`, `01892 555 0173`
Mono: `Public liability to 5 million GBP. Water abstraction and waste disposal compliant.`
Links: `Surfaces`, `Prices`, `Method`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, draggable before and after sliders, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
