# Ashgill Canvas: Glamping Website Prompt

## 1. Goal
Build a calm, photo led website for **Ashgill Canvas**, five canvas bell tents and one shepherd's hut in a larch wood above the River Rede in Northumberland, on the edge of the dark sky park. Canvas coloured paper, forest green ink and big photographs at dusk. It should feel like unzipping the door in the morning, not like a booking portal. Visual quality matters more than features.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page, no component libraries, date pickers or maps. Booking links out.

## 3. Design system
```css
:root {
  --paper: #EEE7DA;         /* canvas, main background */
  --ink: #1C2A21;           /* forest black, text */
  --accent: #2F4A36;        /* forest green, used as a section ground */
  --on-accent: #EEE7DA;     /* canvas text on forest */
  --surface: #E3DACA;       /* darker canvas for alternate sections */
  --muted: #5B5A4E;         /* 5.6 to 1 on paper, 5.0 on surface */
  --muted-on-accent: #C9C3B2; /* 5.5 to 1 on forest */
  --line: rgba(28,42,33,0.18);
}
```
Every text colour, including muted text and captions, must reach at least 4.5 to 1 against the surface it sits on. No text under 14px. Corners are nearly sharp: 2px on buttons and images, nothing rounder. Hairlines instead of boxes, no shadows. Forest green grounds two sections only.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
```
- **Headings:** Young Serif 400, clamp(44px, 6.4vw, 104px), line-height 1.02, letter-spacing -0.01em. Sentence case. No italics.
- **Body:** Instrument Sans 400, 17px, line-height 1.65, max 62 characters per line.
- **Labels:** Instrument Sans 600, 14px, uppercase, letter-spacing 0.12em, one per section at most.
- **Prices:** Instrument Sans 500 with tabular numbers.

## 5. Buttons
Solid and square, like a canvas tag:
- **Primary:** forest fill, canvas text, 2px radius, Instrument Sans 600 16px, padding 16px 26px. Hover: fill turns `#1C2A21`. No icon.
- **Secondary:** text with a 1px underline offset 6px, thickening to 2px on hover. No box.
- On the forest sections the primary flips: canvas fill, forest text.
- No pills, no arrow circles, no outline boxes.

## 6. Sections

1. **Navbar:** transparent over the hero photo, canvas text. Wordmark in Young Serif left, four links right, then a primary button `Check dates`. After the hero it turns solid paper with a hairline and forest text.
2. **Hero, full bleed photograph:** the photo fills the whole width with `min-height: clamp(560px, 88vh, 900px)`. A forest scrim at 55% opacity over the bottom 40% only, so the text reads. Bottom left: a label, the heading on two lines and one sentence, all in canvas. Bottom right: the primary button and the secondary link. Nothing else. *Photograph: five canvas bell tents among tall larch trees at dusk, warm lantern light glowing through the canvas walls, a thin blue mist between the trunks, a fire pit with embers in the foreground, deep blue sky above.*
3. **Intro statement:** paper. A large Young Serif paragraph (36px) starting at one third of the width, with a label in the left column. Three plain facts under it, split by hairlines.
4. **The tents:** surface. Four rows, alternating photo left and photo right. Photo 4:5 at 46% width. Beside it: name, two sentences, a muted facts line and the price.
5. **What is in the tent:** paper. A long two column inventory list, set like a packing list: item left, short note right, hairline between rows. This replaces any icon grid.
6. **The wood through the year:** surface. Three photographs in a loose row at different vertical offsets (the middle one starts 80px lower), each with a season caption. *Photographs: frost on the canvas and the guy ropes at sunrise in January; bluebells under the larches in May; a child paddling in the shallow river in August.*
7. **Dark skies, forest section:** full width forest green, canvas text. Tall night photo left, heading, paragraph and three things to look for right. *Photograph: the Milky Way over a single glowing bell tent at the edge of a wood, long exposure, no people.*
8. **Prices and booking:** surface. A plain four row table, a note on minimum stays, one primary button. No cards.
9. **Getting here:** paper. Paragraph left, address, phone and email right.
10. **Footer:** forest green, three quiet lines in canvas: wordmark and a short line, address, and small links. No giant wordmark.

## 7. Motion
- Hero photograph settles from scale 1.04 to 1 over 1.6s. Text fades up 16px, 0.1s stagger.
- Tent rows: the photo fades in and moves 24px towards the centre as the row enters the view.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero heading 44px, actions stack. Tent rows, season photos and dark skies stack with the photo first, no offsets. The inventory becomes one column. The table keeps four columns at 14px. Navbar shows the wordmark and a `Menu` button opening a full screen canvas panel.
- **Desktop:** max-width 1240px, photos may run full width. Section padding 120px.

## 9. Full copy

**Name:** Ashgill Canvas
**Nav:** The Tents, Inside, Dark Skies, Prices, Getting Here. Button: `Check dates`

**Hero**
- Label: `REDESDALE, NORTHUMBERLAND`
- Heading: `Five tents in a larch wood. No signal, plenty of sky.`
- Sentence: `Wood stoves, proper beds and a river at the bottom of the field, under the darkest skies in England.`
- Button: `Check dates` · Link: `See the tents`

**Intro**
- Label: `SINCE 2017`
- Paragraph: `Ashgill is a hill farm that grew a wood. Tom and Ellen Ridley planted the larches in 1994. The six pitches are far enough apart that you hear the river before your neighbours.`
- Facts: `Open March to October` · `Dogs welcome in two tents` · `Firewood included`

**The tents**
- `Larch` `Our biggest bell tent, under the oldest trees. A double, two singles and a stove that warms it in ten minutes.` Facts: `Sleeps 4 · Private fire pit · Dogs welcome` Price: `from £135 a night`
- `Curlew` `On the edge of the wood, the whole valley in front of the door. Booked again for the sunrise.` Facts: `Sleeps 2 · Wood fired hot tub · Adults only` Price: `from £165 a night`
- `Rede` `Closest to the river, with a path to a shallow pool children love. Bunks behind a canvas wall.` Facts: `Sleeps 5 · Private fire pit · Dogs welcome` Price: `from £140 a night`
- `The Hut` `A shepherd's hut on iron wheels with a tiny kitchen and a window over the bed.` Facts: `Sleeps 2 · Kitchenette · Wood stove` Price: `from £150 a night`

**Inside every tent**
- `Real beds` `Sprung mattresses, cotton sheets, wool blankets`
- `Wood burning stove` `With a basket of dry logs, refilled daily`
- `Kitchen box` `Two ring gas hob, pans, kettle, a cafetière`
- `Red torch` `So your eyes stay used to the dark`
- `Hot showers` `In the barn, two minutes walk, always hot`
- `Breakfast hamper` `Eggs, bacon and bread from Bellingham, £18`

**The wood through the year**
- `January: frost on the guy ropes` (the hut only, the tents open in March)
- `May: bluebells under the larches`
- `August: the river at its warmest`

**Dark skies**
- Heading: `Turn the lantern off and look up.`
- Paragraph: `We sit inside the Northumberland International Dark Sky Park. On a clear night the Milky Way is visible from your door. Binoculars and a star chart are in the barn.`
- This season: `The Perseids, peaking around 12 August` · `Saturn low in the south after ten` · `The Andromeda galaxy, a smudge with the naked eye`

**Prices**
- Table head: `Tent` · `Sleeps` · `Sunday to Thursday` · `Friday and Saturday`
- `Larch` · `4` · `£135` · `£160`
- `Curlew` · `2` · `£165` · `£190`
- `Rede` · `5` · `£140` · `£170`
- `The Hut` · `2` · `£150` · `£175`
- Note: `Two night minimum, three nights over bank holidays. Prices are per tent per night, firewood included. Dogs £15 per stay.`
- Button: `Check dates`

**Getting here**
- Paragraph: `Ashgill is two miles off the A68, the last half mile on a farm track that any car can manage slowly. Hexham station is forty minutes away, Friday pickups at 17:00 for £25.`
- `Ashgill Farm, Rochester, Redesdale, Northumberland NE19 1TQ`
- `01830 555 0147` · `stay@ashgillcanvas.co.uk`

**Footer**
- `Ashgill Canvas` · `Five tents, one hut, a lot of sky.`
- `Ashgill Farm, Rochester, Northumberland NE19 1TQ`
- `Instagram` · `House rules` · `Accessibility` · `Gift vouchers`

## 10. Never
Gradients beyond the hero scrim, glow, glassmorphism, neon, emoji, icon grids, pill buttons, rounded corners above 2px, drop shadows, a date picker or calendar widget, a real embedded map, `100vh` heroes, phrases like "reconnect with nature", dashes of any kind in the copy, lorem ipsum.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
