# Clearpane: Auto Glass Website Prompt

## 1. Goal
Build a calm, precise website for **Clearpane**, a mobile windscreen repair and replacement service. Cool pale ground, deep slate ink, a single teal accent, a grotesk display face and one signature drawing: a chip that spreads into a crack and then repairs itself. Reassuring rather than shouty, because the visitor has just found a crack in their windscreen.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking engine, no registration lookup. Actions are a telephone link and an email link.

## 3. Design system
```css
:root {
  --paper: #EEF2F3;              /* cool pale ground */
  --ink: #17242B;                /* deep slate, text and dark ground */
  --accent: #0F6E86;             /* teal */
  --on-accent: #FFFFFF;
  --surface: #E3E9EB;            /* tinted ground */
  --muted: #5B6B72;              /* secondary text */
  --line: rgba(23,36,43,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines and tints, no boxes, no shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Schibsted Grotesk 700, letter-spacing -0.035em, line-height 0.96. Hero 76 to 124px, section titles 40 to 62px.
- **Body:** Inter 300, 16px, line-height 1.55.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Times, prices, chip sizes, index labels.
- No italics. Emphasis by one line set in teal.

## 5. Signature element
**A crack that repairs itself.** An SVG drawing of a windscreen chip: a small central star with four branching lines running outward, all in one 1.5px stroke. When it enters view the crack draws outward from the centre over 1.4 seconds using `pathLength`. It holds for one second, then draws back in over 0.8 seconds while the stroke shifts from slate to teal, leaving only the small star. That is the whole service, shown once, without a word.

No glow, no fill, no repeat. Under `prefers-reduced-motion` it shows the repaired state.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, pale, one hairline beneath. Wordmark left, four links right, teal pill button with a round arrow circle, plus a mono line reading today's availability.
2. **Hero, split portrait**: a grotesk three line headline on the left over a hairline rule, with a tall photograph bleeding off the right edge. Beneath the headline, one sentence and two actions. Min height `clamp(520px, 76vh, 780px)`. *Photograph: a technician in a clean uniform working on a car windscreen on a driveway, overcast daylight, no branding.*
3. **Chip or crack, statement**: light. One long paragraph at 26px in the display face starting at one third, with the label `001/ Which is it` in the left column. Explains plainly when a chip can be filled and when the glass has to go.
4. **The repair, signature panel**: dark slate, inset 16px, `--panel-radius`. The self repairing crack (section 5), centred, with a mono caption.
5. **What it costs, ruled table**: surface. Four rows on hairlines: service, how long it takes, what it costs, whether insurance usually covers it. Prices in mono, right aligned.
6. **How the visit works, numbered rows**: light. Four rows on hairlines with mono time markers: call, arrival window, the work itself, the cure time before you drive.
7. **What we work on, index**: light. Two ruled columns: glass types on the left, extras on the right, each a plain hairline row. Includes the modern ones people worry about, such as heated screens and camera recalibration.
8. **Where we come to you, area list**: surface. Towns set as plain text rows on hairlines with a mono travel time beside each. No map.
9. **One quote**: light. A single centred quote in Schibsted Grotesk at 30px with a signature line in mono.
10. **Call, accent panel**: teal ground, inset panel. One short line, the telephone number set large, and a mono line about same day slots.
11. **Footer**: dark slate. Giant cropped `CLEARPANE` wordmark, company registration, insurance approvals, four small links.

## 7. Motion
- Headline lines rise 20px with 0.08s stagger, once.
- The photograph settles from `scale 1.03` to `1` over 1.1s.
- The crack draws and repairs once, as described.
- Table rows fade in with 0.04s stagger.
- Hover: arrow circles slide 4px, rows lighten their hairline.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** a teal call bar is fixed to the bottom of the screen, with padding that adds `env(safe-area-inset-bottom)`. The hero photograph moves above the headline at 40vh, headline at 42px. The cost table becomes stacked rows with the price on the same line as the service. No horizontal page scroll.
- **Tablet:** hero stays split, index two columns.
- **Desktop:** 1200px content width, gutters 40px, section padding 110 to 130px.

## 9. Full copy

**Wordmark:** CLEARPANE. Meta: `MOBILE WINDSCREEN REPAIR. NOTTINGHAMSHIRE AND DERBYSHIRE.`

**Nav:** Repairs, Prices, Areas, Insurance. Button: `Call 0800 118 4411`. Mono: `THREE SLOTS LEFT TODAY.`

**Hero**
- Headline: `A CHIP TODAY / IS A WINDSCREEN / IN FEBRUARY.`
- Sentence: `We come to your drive or your office car park, fill the chip in about forty minutes, and you drive away the same hour. Most insurers cover it with no excess.`
- Actions: `Call 0800 118 4411`, `Send a photo of the damage`

**Chip or crack** (label `001/ Which is it`)
`If the damage is smaller than a two pound coin and not directly in front of the driver, it can almost always be filled with resin and left alone for years. Once a chip has legs longer than about three centimetres, or it sits in the driver's line of sight, the glass has to be replaced. The honest answer is that cold weather decides for you. A chip that survived November usually does not survive the first frost.`

**Signature caption:** `Resin, vacuum, cure. Forty minutes on your drive.`

**What it costs** (label `002/ Prices`)
- `Chip repair, one chip` ... `40 MIN` ... `65 GBP` ... `Usually covered, no excess`
- `Each additional chip` ... `15 MIN` ... `20 GBP` ... `Usually covered`
- `Windscreen replacement` ... `2 TO 3 HRS` ... `From 280 GBP` ... `Covered, excess applies`
- `Camera recalibration` ... `1 HR` ... `95 GBP` ... `Covered with replacement`
Mono note: `Prices include VAT and the call out. We tell you the total on the phone before we set off.`

**How the visit works** (label `003/ The visit`)
- `00:00` **You call or send a photograph.** `A photograph with a coin beside the damage tells us everything we need.`
- `SAME DAY` **A two hour arrival window.** `We text when we set off, and we are usually early rather than late.`
- `00:40` **The work.** `Done on your drive, in a car park or outside the office. You do not need to be there once we start.`
- `+60 MIN` **Cure time.** `An hour before you drive after a replacement. Repairs you can drive away from immediately.`

**What we work on** (label `004/ Glass`)
- Glass: `Laminated windscreens`, `Heated windscreens`, `Acoustic and solar glass`, `Side and door glass`, `Rear screens`, `Panoramic roof glass`
- Extras: `Rain and light sensors`, `Forward facing camera recalibration`, `Heads up display screens`, `Wiper blades replaced`, `Trim and seals`, `Glass disposal and recycling`

**Where we come to you** (label `005/ Areas`)
`Nottingham` ... `20 MIN` · `West Bridgford` ... `25 MIN` · `Beeston` ... `25 MIN` · `Derby` ... `35 MIN` · `Mansfield` ... `35 MIN` · `Newark` ... `40 MIN` · `Long Eaton` ... `30 MIN` · `Ilkeston` ... `30 MIN` · `Ripley` ... `40 MIN` · `Hucknall` ... `25 MIN`

**Quote:** `He filled two chips in the office car park while I was in a meeting and sent the invoice straight to the insurer.`
Signature: `Priya, Beeston`

**Call panel**
- Line: `Send us a photograph and we will tell you which it is.`
- Telephone set large: `0800 118 4411`
- Mono: `OPEN 7AM TO 8PM, SEVEN DAYS. SAME DAY SLOTS MOST DAYS.`

**Footer**
`CLEARPANE`, `Clearpane Auto Glass Ltd, registered in England 09918224`, `Approved by the major insurers, work guaranteed for as long as you own the vehicle`, `hello@clearpane.co.uk`
Links: `Repairs`, `Prices`, `Areas`, `Insurance claims`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, countdown timers, stat soup like "50,000 windscreens fixed", lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
