# Pine Hollow: Summer Camp Website Prompt

## 1. Goal
Build a warm, reassuring website for **Pine Hollow**, a residential summer camp in Vermont running two week sessions for eight to fifteen year olds. Oat paper, deep forest ink, one pine green accent, a friendly serif, and one signature: a length of rope that ties itself into a bowline. The child wants to see the lake. The parent wants to know who is watching their child at two in the morning. Both are on this page.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking system, no payment flow. Enrolment goes to an email link. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F5F2E8;
  --ink: #1E2318;
  --accent: #3F6B3A;           /* pine */
  --on-accent: #FFFFFF;
  --surface: #E7E3D4;
  --muted: #59604F;
  --line: rgba(30,35,24,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines instead of boxes.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page. Parents read this on a phone at night.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bitter:wght@300;600&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Bitter 300, clamp(44px, 6vw, 88px), line-height 1.02, letter-spacing -0.02em
- **Body:** Inter 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Dates, ages, ratios, fees, index labels.
- At most one italic word per headline, in pine green.

## 5. Signature element
**A rope ties itself.** One continuous 2px ink stroke drawn as a loose length of rope. On scroll into view it draws from the left over 1.6 seconds, then the free end crosses, passes through the loop and pulls to form a bowline, over a further 1.2 seconds. A mono caption names the knot.

It is two SVG paths with `pathLength` and one short transform, nothing simulated. It ties once and stays tied.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, oat, one hairline beneath. Wordmark left, four links right, pine pill with a round arrow circle, and a mono line with the next session date.
2. **Hero, corners**: a full bleed photograph of a lake at dawn, no headline block. Wordmark top left, nav top right, a mono line bottom left naming the camp and the state, one action bottom right. Min height `clamp(560px, 78vh, 840px)`.
3. **Statement**: light. One long Bitter paragraph from one third, label `001/ Two weeks` in the left column.
4. **The knot**: surface. The signature element (section 5) with a mono caption.
5. **A day at Pine Hollow, timed rows**: light. Six rows on hairlines with mono times: wake, breakfast, two activity blocks, free swim, supper, campfire, lights out.
6. **Who is awake at 2am**: dark ink ground, inset 16px, `--panel-radius`. Four short lines in paper colour about night staff, the nurse, the ratio and what happens if a child is homesick. This is the section the parent came for.
7. **Sessions and fees, ruled table**: light. Four rows: session, dates, ages, fee. Figures in mono, right aligned.
8. **What to pack, index**: light. Two ruled columns: bring this, leave that at home. Phones are addressed directly and without moralising.
9. **The camp, loose grid**: light. Six photographs at varied sizes with mono captions. *Photographs: a lake with a wooden dock, a cabin interior with bunks, a climbing wall, a canoe on the water, a campfire at dusk, the dining hall at breakfast.*
10. **One quote**: surface. A single centred quote in Bitter at 30px with a signature line in mono.
11. **Hold a place, accent panel**: pine ground, inset panel. One line, two actions, a mono note about the deposit and places left.
12. **Footer**: dark ink. Giant cropped `PINE HOLLOW` wordmark, address, accreditation line, three small links.

## 7. Motion
- Corner text fades in 0.4s after the hero photograph settles from `scale 1.03`.
- The rope draws and ties once, as described.
- Timed rows fade in with 0.05s stagger.
- Grid images settle from `scale 1.03`, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the knot already tied.

## 8. Responsive
- **Mobile under 768px:** hero corner items stack at the bottom. The rope scales to 280px wide and keeps both stages. The day becomes a simple stacked list with the time on its own line. Fee table becomes stacked rows. Grid one column. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1180px, gutters 40px, section padding 120px.

## 9. Full copy

**Wordmark:** PINE HOLLOW. Meta: `RESIDENTIAL SUMMER CAMP. AGES 8 TO 15. VERMONT.`

**Nav:** The day, Sessions, Packing, Safety. Button: `Hold a place`. Mono: `SESSION ONE OPENS 22 JUNE`

**Hero**
- Mono bottom left: `PINE HOLLOW, LAKE ELMORE, VERMONT. EST. 1974.`
- Action bottom right: `Hold a place`

**Statement** (label `001/ Two weeks`)
`Two weeks, no phones, forty children and eleven staff on a lake in northern Vermont. We have been running the same four sessions since 1974 and the biggest change in fifty years is that we now ring you on day three whether or not anything has happened, because we learned that silence is worse than news.`

**Knot caption:** `A bowline. Every camper learns it in the first week, because it is the one knot that will not slip and will still untie when it has been soaked.`

**A day at Pine Hollow** (label `002/ The day`)
- `07:15` **Wake.** `A bell, not a shout. Nobody is made to run before breakfast.`
- `08:00` **Breakfast in the hall.** `Everybody eats together. There is always something plain for the child who eats nothing.`
- `09:30` **First block.** `Canoeing, climbing, woodwork or art. Chosen on Monday, kept for the week.`
- `14:00` **Second block and free swim.** `Lifeguarded, two in the water, one on the dock, every time.`
- `18:00` **Supper, then campfire.** `Songs, badly. This is not optional and everybody secretly likes it.`
- `21:30` **Lights out.** `Eight to eleven year olds at nine, twelve and up at half past ten.`

**Who is awake at 2am** (label `003/ Safety`)
- `One counsellor sleeps in every cabin. Not nearby, in it.`
- `A qualified nurse lives on site for the whole session and holds every medication.`
- `Staff to camper ratio is one to four, and one to three on the water.`
- `If a child cannot settle, we ring you. We would rather wake you at midnight than have you hear about it on day fourteen.`

**Sessions and fees** (label `004/ Sessions`)
| Session | Dates | Ages | Fee |
|---|---|---|---|
| One | 22 June to 5 July | 8 to 11 | 2,450 USD |
| Two | 6 July to 19 July | 10 to 13 | 2,450 USD |
| Three | 20 July to 2 August | 12 to 15 | 2,600 USD |
| Four | 3 August to 16 August | 8 to 15, mixed | 2,600 USD |
Note: `Fee covers everything including the bus from Burlington. Fifteen places each session are funded, ask and we will tell you plainly whether you qualify.`

**What to pack** (label `005/ Packing`)
- Bring: `Sleeping bag and a pillow`, `Boots that are already worn in`, `A swimming costume and a towel, two of each`, `A warm layer, it drops to eight degrees at night`, `A torch`, `Letters and stamps if they like writing`
- Leave at home: `Phones, and we mean it, they go in a box on day one`, `Anything with a screen`, `Sweets, because of allergies in the cabins`, `Anything they would be heartbroken to lose`, `New trainers`

**The camp** (label `006/ The camp`)
The lake at six in the morning · Cabin four · The climbing wall · Canoes on the water · Campfire, last night of session two · The dining hall

**Quote:** `He came back filthy, sunburnt and able to tie three knots. He also rang us on the camp phone in week two to say he was fine and could he stay another session.`
Signature: `Marianne, parent, two summers`

**Hold a place panel**
- Line: `A place is held for ten days without a deposit. We will tell you how many are left in each session rather than making you ask.`
- Actions: `Hold a place`, `Ask about funding`
- Mono: `SESSION ONE 9 LEFT. SESSION TWO 3 LEFT. SESSION THREE FULL. SESSION FOUR 14 LEFT.`

**Footer**
`PINE HOLLOW`, `114 Hollow Road, Lake Elmore, VT 05657`, `camp@pinehollow.org`
Mono: `Accredited by the American Camp Association. Licensed by the Vermont Department of Health.`
Links: `The day`, `Sessions`, `Safety`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, countdown timers, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
