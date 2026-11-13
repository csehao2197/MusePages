# Overhead & Co: Garage Door Website Prompt

## 1. Goal
Build a direct, practical website for **Overhead & Co**, a garage door firm in Essex that fits, services and repairs. Light grey paper, near black ink, one amber accent, a sturdy grotesk, and one signature: a roller door that rolls up to reveal the hero. The emergency repair customer needs a phone number in two seconds. Everyone else wants to know what a door costs.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no door configurator, no booking engine. The rolling door is one element with an animated `clip-path`. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F1F1F0;
  --ink: #141414;
  --accent: #B45309;           /* amber */
  --on-accent: #FFFFFF;
  --surface: #E3E3E1;
  --muted: #5B5B59;
  --line: rgba(20,20,20,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, surface, light, dark, light, accent, dark footer. Hairlines instead of shadowed cards.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Archivo 700, clamp(44px, 5.8vw, 86px), line-height 0.98, letter-spacing -0.035em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Prices, widths, call out times, index labels.
- No italics. Emphasis is a whole line in amber.

## 5. Signature element
**The door goes up.** On load, the hero section is covered by a flat panel in `--surface` with four horizontal hairlines across it, drawn to read as a sectional garage door. Over 1.4 seconds it lifts from the bottom, revealing the hero beneath, using an animated `clip-path` inset. A thin amber line marks the bottom edge as it travels.

It happens once on load. It does not come back down, it does not repeat on scroll, and it never blocks the page for more than a second and a half. If `prefers-reduced-motion` is set, the hero is simply visible from the start.

## 6. Sections, each a different skeleton

1. **Navbar**: 70px, paper, one hairline beneath. Wordmark left, four links right, amber pill with a round arrow circle, and a mono line reading the current call out time.
2. **Hero, split portrait**: a two line Archivo headline left, a tall photograph of a fitted sectional door right, mono facts beneath and two actions. Min height `clamp(540px, 76vh, 820px)`. *Photograph: a modern anthracite sectional garage door on a brick house, straight on, daylight, no car.*
3. **Doors we fit, Swiss list**: surface. Label `001/ Doors`, four stacked door types from one third, each with two lines and a mono note about the opening it suits.
4. **Prices, ruled table**: light. Five rows: door type, typical width, supplied and fitted from, time on site. Figures in mono, right aligned.
5. **Repairs, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Four rows in paper colour with mono markers: broken spring, cable off the drum, motor failure, door off its track. Each says what it usually costs and whether it is safe to use the door meanwhile.
6. **Why a spring is dangerous**: light. One long paragraph at 22px from one third with the label `002/ Safety`. Plain, not dramatic.
7. **What is included, index**: light. Two ruled columns: what the price covers and what costs extra. The disposal of the old door is the one everyone forgets.
8. **Recent fits, loose grid**: light. Five photographs at varied sizes with mono captions giving the town and the door type. *Photographs: a white up and over door, an anthracite sectional, a timber side hinged pair, a roller door in a narrow opening, an automated door with a remote.*
9. **One quote**: surface. A single centred quote in Archivo at 28px with a signature line in mono.
10. **Call us, accent panel**: amber ground, inset panel. One line, the phone number set large, a mono note about same day call outs.
11. **Footer**: dark ink. Giant cropped `OVERHEAD & CO` wordmark, coverage area, insurance line, three small links.

## 7. Motion
- The door lifts once on load, as described.
- Headline fades up 18px behind it, photograph settles from `scale 1.03`.
- Table rows fade in with 0.04s stagger.
- Grid images settle from `scale 1.03`, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`.

## 8. Responsive
- **Mobile under 768px:** the door lift is kept but shortened to 0.9 seconds. Hero photograph moves above the headline, headline at 40px. Price table becomes stacked rows. Grid one column. An amber call bar fixes to the bottom of the screen, respecting the safe area inset. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1200px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** OVERHEAD & CO. Meta: `GARAGE DOORS. SUPPLIED, FITTED, REPAIRED. ESSEX.`

**Nav:** Doors, Prices, Repairs, Contact. Button: `Call us`. Mono: `CALL OUTS TODAY: YES`

**Hero**
- Headline: `A door that opens every time you press the button.`
- Facts: `FITTED IN A DAY` · `10 YEAR DOOR WARRANTY` · `SAME DAY REPAIRS`
- Paragraph: `Sectional, roller, up and over and side hinged. Fitted across Essex and east London by two people who have done nothing else since 2009.`
- Actions: `Call us`, `See prices`

**Doors we fit** (label `001/ Doors`)
- **Sectional.** `Panels that fold up and back along the ceiling. Nothing swings out, so you can park right up to it.` `SUITS: A SHORT DRIVE`
- **Roller.** `Rolls into a box above the opening. Takes the least room of any door.` `SUITS: A NARROW OR LOW OPENING`
- **Up and over.** `One panel that tilts. The cheapest to buy and the simplest to repair.` `SUITS: A LONG DRIVE AND A TIGHT BUDGET`
- **Side hinged.** `Two doors on hinges, like a shed. Good if the garage is also a workshop you walk into.` `SUITS: DAILY WALK IN ACCESS`

**Prices** (label `002/ Prices`)
| Door | Typical width | Supplied and fitted from | On site |
|---|---|---|---|
| Up and over, steel | 2.1 m | 890 GBP | Half a day |
| Sectional, insulated | 2.4 m | 1,780 GBP | A day |
| Roller, insulated | 2.4 m | 1,640 GBP | A day |
| Side hinged, timber | 2.1 m | 2,100 GBP | A day |
| Automation added to an existing door | Any | 540 GBP | Two hours |
Note: `Prices include removal and disposal of the old door, two remotes and setting the limits. VAT included, no survey fee.`

**Repairs** (label `003/ Repairs`)
- **01 Broken spring.** `The door suddenly weighs seventy kilos. Usually 180 to 240 GBP for a pair.` `DO NOT USE THE DOOR`
- **02 Cable off the drum.** `The door hangs crooked and jams. Usually 120 to 160 GBP.` `DO NOT USE THE DOOR`
- **03 Motor failure.** `The door is fine, the opener is not. Usually 220 to 390 GBP depending on the unit.` `SAFE TO OPEN BY HAND`
- **04 Off its track.** `Nearly always a bent roller or a knock from a car. Usually 140 GBP.` `SAFE IF IT IS CLOSED, LEAVE IT CLOSED`

**Why a spring is dangerous** (label `004/ Safety`)
`A garage door spring holds enough tension to lift seventy kilos, and it releases all of it at once when it goes. Every year people lose fingers trying to change one with a pair of mole grips and a YouTube video. There is no part of this job we would tell you to attempt yourself, and that is the only thing on this website we will be dramatic about.`

**What is included** (label `005/ Included`)
- In the price: `Removal of the old door`, `Disposal and the tip run`, `New frame if the old one is rotten`, `Two remotes and setting the limits`, `Making good around the opening`
- Extra: `A new lintel if the opening needs structural work`, `Electrical supply if there is no socket in the garage`, `Widening the opening`, `A third remote or a keypad`

**Recent fits** (label `006/ Recently`)
Up and over, Billericay · Sectional, Chelmsford · Side hinged, Maldon · Roller, Basildon · Automation, Brentwood

**Quote:** `Spring went on a Sunday with the car locked inside. He came out that afternoon and did not charge a weekend rate.`
Signature: `Sam Doughty, Chelmsford`

**Call us panel**
- Line: `If the door will not open and the car is behind it, ring. We keep two slots a day free for that.`
- Phone set large: `01245 555 0188`
- Mono: `SEVEN DAYS. SAME DAY CALL OUT FOR SPRINGS AND CABLES.`

**Footer**
`OVERHEAD & CO`, `Covering Essex and east London`, `hello@overheadandco.co.uk`, `01245 555 0188`
Mono: `Public liability to 2 million GBP. Doors carry a 10 year manufacturer warranty, fitting carries 2 years.`
Links: `Doors`, `Prices`, `Repairs`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, a door that opens and closes on a loop, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
