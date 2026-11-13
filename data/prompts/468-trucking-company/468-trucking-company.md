# Halloran Haulage: Trucking Company Website Prompt

## 1. Goal
Build a plain, dependable website for **Halloran Haulage**, a family haulage firm running eighteen trucks out of the Midlands. Warm grey paper, near black ink, one burnt orange accent, a tight grotesk, and one signature: a route drawn across the page while the mileage counts up. Nothing here should feel like a startup. It should feel like a firm that has moved pallets since 1978.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no map library, no quote calculator, no tracking portal. The route is an SVG path. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F2F1EE;
  --ink: #16181A;
  --accent: #C2410C;           /* burnt orange */
  --on-accent: #FFFFFF;
  --surface: #E4E3DE;
  --muted: #5E5F5C;
  --line: rgba(22,24,26,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, surface, light, dark, light, accent, dark footer. Hairlines and tints do the structuring, never shadowed cards.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Archivo 700, clamp(42px, 5.6vw, 82px), line-height 1.0, letter-spacing -0.035em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Mileage, tonnage, licence numbers, index labels.
- No italics. Emphasis is a whole line set in burnt orange.

## 5. Signature element
**A route, drawn.** A simplified outline of the trunk road network sits across the section as a hairline. When it scrolls into view, a burnt orange line traces one route from the depot to a drop, drawing over 1.8 seconds with `pathLength`. Three small square markers appear along it in sequence: depot, overnight, delivery. Beneath the drawing a monospaced counter runs from 0 to the mileage and stops.

It draws once. No looping, no vehicle icon sliding along, no map tiles.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, paper, one hairline beneath. Wordmark left, four links right, orange pill with a round arrow circle, and a mono line with the traffic office number.
2. **Hero, split portrait**: a two line Archivo headline left, a tall photograph of a tractor unit right, mono facts beneath the headline and two actions. Min height `clamp(540px, 76vh, 820px)`. *Photograph: a clean curtainside tractor unit parked at a depot in early morning light, three quarter view, no motion blur.*
3. **The route**: surface. The signature element (section 5) with a mono caption naming the run.
4. **What we carry, Swiss list**: light. Label `001/ Work`, four stacked service names from one third, each with two lines and a mono note about the trailer type it needs.
5. **The fleet, ruled table**: light. Five rows: vehicle, payload, bed type, number in service. Figures in mono, right aligned.
6. **How a job runs, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Four rows in paper colour with mono timestamps: the call, the load, the run, the paperwork.
7. **Compliance, index**: light. Two ruled columns of the dull facts that win the contract: operator licence, insurance, tacho policy, FORS level, what we will not carry.
8. **The yard, loose grid**: light. Four photographs at different sizes with mono captions. *Photographs: a loading bay at dawn, a driver doing a walk round check, a stacked pallet load, the yard gate.*
9. **One quote**: surface. A single centred quote in Archivo at 28px with a signature line in mono.
10. **Book a load, accent panel**: orange ground, inset panel. One line, the traffic office number set large, and a mono note about out of hours.
11. **Footer**: dark ink. Giant cropped `HALLORAN` wordmark, depot address, operator licence line, three small links.

## 7. Motion
- Headline fades up 18px once, photograph settles from `scale 1.03`.
- Route draws once, counter ticks with it and stops.
- Table rows fade in with 0.04s stagger.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the route already drawn and the final mileage.

## 8. Responsive
- **Mobile under 768px:** hero photograph moves above the headline, headline at 38px. The route keeps full width but drops to two markers. Fleet table becomes stacked rows. Grid one column. An orange call bar fixes to the bottom of the screen, respecting the safe area inset. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1220px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** HALLORAN HAULAGE. Meta: `PALLETS AND FULL LOADS. MIDLANDS. SINCE 1978.`

**Nav:** Work, Fleet, Compliance, Contact. Button: `Book a load`. Mono: `TRAFFIC OFFICE 01827 555 0140`

**Hero**
- Headline: `Eighteen trucks and a phone that gets answered.`
- Facts: `18 VEHICLES` · `FORS SILVER` · `O LICENCE OB1024518`
- Paragraph: `Full loads and pallet work across the Midlands and down to the south coast. Family run, third generation, and still the same traffic office number.`
- Actions: `Book a load`, `See the fleet`

**Route caption:** `Tamworth to Exeter, overnight at Bristol. 212 miles. A run we do four times a week.`

**What we carry** (label `001/ Work`)
- **Full loads.** `One customer, one trailer, straight through.` `CURTAINSIDE OR BOX`
- **Pallet work.** `One to twelve pallets on a shared run, next day to most postcodes.` `NETWORK MEMBER`
- **Temperature controlled.** `Chilled at two to eight degrees, logged the whole way.` `FOUR FRIDGE TRAILERS`
- **Abnormal and heavy.** `Up to 44 tonnes with notification. We will tell you if it needs an escort.` `LOW LOADER, BY ARRANGEMENT`

**The fleet** (label `002/ Fleet`)
| Vehicle | Payload | Bed | In service |
|---|---|---|---|
| Tractor unit, 44t | 26 tonnes | Curtainside | 11 |
| Tractor unit, 44t | 24 tonnes | Fridge | 4 |
| Rigid, 18t | 9 tonnes | Box with tail lift | 2 |
| Low loader | 32 tonnes | Step frame | 1 |
Note: `Every vehicle is Euro 6, tracked, and inspected every six weeks whether it needs it or not.`

**How a job runs** (label `003/ Process`)
- `BY 16:00` **The call.** `Collection postcode, delivery postcode, what it is and what it weighs. Two minutes.`
- `SAME DAY` **The load.** `We confirm the vehicle and the driver by name, with a collection window, not a vague morning.`
- `OVERNIGHT` **The run.** `Tracked the whole way. If it is going to be late you hear it from us first.`
- `WITHIN 24 HOURS` **The paperwork.** `Signed POD scanned and emailed. No chasing.`

**Compliance** (label `004/ The dull part`)
- We hold: `Operator licence OB1024518`, `Goods in transit cover to 250,000 GBP`, `Public liability to 5 million GBP`, `FORS Silver, audited annually`, `Six weekly inspections at our own workshop`
- We will not carry: `Anything hazardous without a signed dangerous goods note`, `Livestock`, `Loads we cannot legally secure`, `Work that needs a driver to break their hours`

**The yard** (label `005/ The yard`)
Loading bay, 05:40 · Walk round check before every shift · A full deck of 26 pallets · The gate, Tamworth

**Quote:** `They rang me before I noticed the delay. In fourteen years of hauliers that has happened twice, and both times it was this lot.`
Signature: `Dan Whitlock, warehouse manager, Exeter`

**Book a load panel**
- Line: `Tell us the two postcodes and what it weighs. We will tell you if we can do it today.`
- Phone set large: `01827 555 0140`
- Mono: `TRAFFIC OFFICE 06:00 TO 18:00. OUT OF HOURS GOES TO THE DUTY PHONE.`

**Footer**
`HALLORAN HAULAGE`, `Bitterscote Depot, Tamworth B78 3HL`, `traffic@halloranhaulage.co.uk`
Mono: `Operator licence OB1024518. Member of a national pallet network.`
Links: `Work`, `Fleet`, `Compliance`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, map tiles, a lorry icon sliding along the route, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
