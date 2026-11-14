# Quiet Skin: Esthetician Website Prompt

## 1. Goal
Build a soft, editorial website for **Quiet Skin**, a one room facial studio in Bath run by a single esthetician. Blush ground, deep oxblood text, a serif that reads like a good beauty magazine, and photographs of hands, linen and light given plenty of room. Calm, unhurried, clearly not a chain.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking engine. Buttons link to a booking page or a telephone number.

## 3. Design system
```css
:root {
  --paper: #F1D8D0;              /* blush ground */
  --ink: #3A1D1F;                /* deep oxblood, text and dark ground */
  --accent: #5B1B1F;             /* darker claret, the one accent */
  --on-accent: #F1D8D0;
  --surface: #EACBC2;            /* tinted ground */
  --muted: #7A5A58;              /* secondary text */
  --line: rgba(58,29,31,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines and tints, no boxes, no shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Cormorant Garamond 300, letter-spacing -0.02em, line-height 1.0. Hero 96 to 150px, section titles 44 to 72px.
- **Body:** Jost 300, 16px, line-height 1.6.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Only for durations, prices, index labels like `002/ Treatments`.
- One italic word per headline at most, in the accent colour.

## 5. Signature element
**A face drawn in one line.** A single continuous 1.5px stroke in the accent colour describing a face in profile: forehead, nose, lips, chin, throat. It draws itself once over 1.6 seconds when it enters view, using `pathLength` from 0 to 1, then stays still. Nothing fills, nothing glows, nothing repeats.

It appears once, in an inset panel on the surface ground, with a short caption beneath. On a phone it draws at 220px wide.

## 6. Sections, each a different skeleton

1. **Navbar**: 78px, blush, one hairline beneath. Wordmark left in Cormorant, four links right, one accent pill with a round arrow circle.
2. **Hero, arch window**: a photograph in an arch topped frame in the centre of the section, with the two headline words set either side of it, one on the left and one on the right, aligned to the arch's middle. Min height `clamp(560px, 80vh, 840px)`. *Photograph: a facial treatment room with a linen covered bed, a small brass lamp and a vase of dried flowers, morning light through a sash window.*
3. **Statement**: light. One long serif paragraph starting at one third of the width, label `001/ The studio` in the left column.
4. **Treatments, Swiss list**: surface. Label column reading `002/ Treatments`, four large stacked treatment names from one third of the width, each with a duration and price in mono on the right, and one line of description. Hovering a row reveals a small photograph beside it.
5. **Signature panel**: dark oxblood ground, inset 16px, `--panel-radius`. The single line face (section 5) drawn in blush on the dark ground, with a mono caption.
6. **What happens in an hour, numbered rows**: light. Five rows on hairlines: a mono time marker, a title in Cormorant at 30px, one sentence. Reads like a schedule, not a feature list.
7. **The products, index**: light. Two ruled columns: what is used and what is deliberately not used. Plain rows on hairlines, honest and short.
8. **Loose grid, photo led**: surface. Five photographs at different sizes and vertical offsets, each with a small mono caption. *Photographs: hands resting on a linen towel, a glass bottle catching light, a folded flannel, steam over a bowl, the treatment bed from the doorway.*
9. **One quote**: light. A single centred quote in Cormorant at 38px, signature line in mono.
10. **Booking, accent panel**: claret ground, inset panel. A big serif line, two actions, and a mono line about how appointments are held.
11. **Footer**: dark oxblood. Giant cropped `QUIET SKIN` wordmark, address, hours with today highlighted, four small links.

## 7. Motion
- Hero words fade up 18px, 0.1s apart.
- Photographs settle from `scale 1.03` to `1` over 1.1s.
- The line face draws once, as described.
- Treatment row photographs crossfade over 0.25s on hover.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion` by showing the final state.

## 8. Responsive
- **Mobile under 768px:** the arch photograph moves above the headline, which stacks to two lines at 54px. Min height drops to `clamp(440px, 68vh, 620px)`. Treatment rows lose the hover photograph and show a thumbnail on the left. Loose grid becomes one column with offsets removed. Nav keeps wordmark and the pill, other links behind a `Menu` toggle. No horizontal page scroll.
- **Tablet:** loose grid two columns, treatments keep the hover photograph.
- **Desktop:** 1200px content width, gutters 40px, section padding 120 to 140px.

## 9. Full copy

**Wordmark:** QUIET SKIN. Meta: `BATH. ONE ROOM. ONE PAIR OF HANDS.`

**Nav:** Treatments, The hour, Products, Visit. Button: `Book a first facial`

**Hero**
- Words either side of the arch: `Quiet` and `Skin`
- Mono beneath the arch: `FACIALS IN BATH, BY APPOINTMENT ONLY.`

**Statement** (label `001/ The studio`)
`One room above a bookshop on Walcot Street, one treatment at a time, and no music unless you want it. I trained in Bristol, spent six years in a clinic that ran fifteen minute turnarounds, and left to do the opposite. Nothing here is sold to you on the bed. If your skin is fine, I will tell you it is fine.`

**Treatments** (label `002/ Treatments`)
- **The First Facial.** `Ninety minutes, mostly spent looking and asking. You leave with a plan and no products you did not ask for.` `90 MIN. 95 GBP`
- **The Quiet Hour.** `A deep cleanse, gentle exfoliation and a long massage. The one most people come back for.` `60 MIN. 75 GBP`
- **Resurfacing.** `A measured acid peel for texture and pigmentation, in a course of three or six.` `45 MIN. 85 GBP`
- **Back Treatment.** `The same care, for the part nobody reaches.` `60 MIN. 80 GBP`

**Signature caption:** `Every face is read before it is touched.`

**What happens in an hour** (label `003/ The hour`)
- `00:00` **We talk first.** `Ten minutes on sleep, water, stress and what changed recently, because skin usually answers those.`
- `00:10` **Cleanse, twice.** `Once to take the day off, once to actually clean.`
- `00:20` **Whatever your skin needs today.** `Steam, extraction, an acid or none of it. Decided in the room, not in advance.`
- `00:35` **The long massage.** `Face, neck, shoulders and scalp. This is the part you will remember.`
- `00:55` **Sunscreen and out.** `No sales pitch. A written note if there is anything worth trying.`

**Products** (label `004/ What I use`)
- Used: `Barrier repair creams`, `Mandelic and lactic acids`, `Vitamin C in low, tolerable doses`, `Mineral sunscreen`, `Plain hot flannels`
- Not used: `Fragrance`, `Essential oils on compromised skin`, `Extraction as a default`, `Anything sold on the bed`, `Before and after photographs`

**Loose grid captions:** `Hands, after`, `The bottle on the sill`, `Flannels, boiled every night`, `Steam, two minutes`, `The room from the door`

**Quote:** `She told me my routine was too complicated and took four things out of it. My skin has been calm since.`
Signature: `Alice R, Larkhall`

**Booking panel**
- Line: `Start with the ninety minute one.`
- Actions: `Book a first facial`, `Ask a question first`
- Mono: `APPOINTMENTS HELD FOR TEN MINUTES. LATE IS FINE, JUST TEXT.`

**Footer**
`QUIET SKIN`, `First floor, 42 Walcot Street, Bath BA1 5BD`, `hello@quietskin.co.uk`, `07700 900 118`
Hours: `Tuesday to Friday 9:30 to 18:00. Saturday 9:30 to 14:00. Closed Sunday and Monday.` Today is highlighted.
Links: `Treatments`, `Products`, `Gift vouchers`, `Instagram`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, before and after sliders, stat soup like "2000+ happy clients", lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical full width stripes.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
