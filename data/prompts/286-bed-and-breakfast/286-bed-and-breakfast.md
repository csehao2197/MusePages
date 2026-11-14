# The Wrenhouse — Bed & Breakfast Website Prompt

## 1. Goal Statement
Build a warm, quietly confident bed and breakfast website for **The Wrenhouse**, defined by soft plaster, deep heritage green, and a fine transitional serif — a five-room B&B site built around a room chooser and honest detail about the house rather than stock hospitality language.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(38, 26%, 95%);       /* #f6f1e9 plaster */
  --foreground: hsl(156, 22%, 15%);      /* #1e2f28 heritage ink */
  --primary: hsl(156, 30%, 26%);         /* #2f5647 heritage green */
  --primary-foreground: hsl(38, 26%, 97%);
  --muted-foreground: hsl(156, 6%, 45%);
  --border: hsl(36, 16%, 86%);
  --card: hsl(38, 28%, 91%);
  --accent-brass: hsl(38, 44%, 56%);     /* brass fittings */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Fraunces 400, clamp(38px, 4.8vw, 66px), line-height 1.1
- **H2:** Fraunces 400, 30–44px
- **H3 / room names:** Fraunces 600, 20–24px
- **Body:** Inter 300, 17px, line-height 1.8
- **Eyebrows:** Inter 500, uppercase, letter-spacing 0.22em, 11px, brass
- **Prices / room sizes:** Fraunces 600, tabular-nums

## 5. Visual Effects

**Effect 1 — Room chooser with cross-fading imagery.** Five room names in a serif list. Hovering or tapping one dims the others and cross-fades a full-height room photograph beside it, with the rate, bed type, bathroom arrangement and view swapping beneath.

```tsx
const rooms = [
  { id: 'wren',    name: 'The Wren',    rate: 145, bed: 'King',       bath: 'Ensuite shower',  view: 'Over the orchard' },
  { id: 'swift',   name: 'The Swift',   rate: 165, bed: 'Super king', bath: 'Ensuite bath',    view: 'South, over the valley' },
  { id: 'martin',  name: 'The Martin',  rate: 135, bed: 'Double',     bath: 'Private, across the hall', view: 'The kitchen garden' },
  { id: 'linnet',  name: 'The Linnet',  rate: 125, bed: 'Twin',       bath: 'Ensuite shower',  view: 'The courtyard' },
  { id: 'kestrel', name: 'The Kestrel', rate: 195, bed: 'King, sofa', bath: 'Ensuite bath and shower', view: 'Two aspects, west' },
];
const [sel, setSel] = useState('wren');
const r = rooms.find(x => x.id === sel);

<AnimatePresence mode="wait">
  <motion.img
    key={sel}
    src=""
    alt="Guest room at the bed and breakfast"
    initial={{ opacity: 0, scale: 1.03 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="absolute inset-0 h-full w-full object-cover object-center"
  />
</AnimatePresence>
```
Media brief for each room image: warm country guest bedroom with natural daylight, linen bedding, wooden furniture, uncluttered and inviting.

**Effect 2 — Brass rule reveal.** A hairline brass rule beneath every section heading, scaling from the left over 0.8 seconds on scroll entry.

## 6. Component Breakdown

1. **Navbar** — 80px, sticky, plaster with 1px bottom border on scroll. Centred serif wordmark with the nav split left and right, `Check Availability` brass outline button far right.
2. **Hero** — 88vh, full-bleed house exterior with a bottom plaster gradient. Eyebrow, serif H1, subline, two CTAs. *Image: a stone country house exterior in late afternoon light, climbing roses, gravel drive, warm and lived-in.*
3. **Welcome statement** — a single centred paragraph in Fraunces at 26px, signed by the owners.
4. **Rooms** — the primary interaction (Effect 1) with a book CTA per room.
5. **Breakfast** — the section a B&B lives or dies on: what is actually served, where the eggs come from, service times, and dietary handling.
6. **The house** — three short blocks on the sitting room, the garden and the honesty bar, each with an image.
7. **What is nearby** — four walks and four places to eat with distances and honest one-line opinions.
8. **Practical information** — check-in window, parking, dogs, children, wifi strength, and stair access, all stated plainly.
9. **Rates and minimum stays** — a table by room and season with the two-night weekend rule stated openly.
10. **Reviews** — three quotes naming the room stayed in.
11. **Booking** — date picker, room selector, and a note that booking direct is cheaper than the platforms.
12. **Footer** — heritage green, three columns, address, what3words, and the owners' names.

## 7. Animations
- Hero: image scales 1.05 to 1 over 14s; H1 fades up 0.85s
- Brass rules: scaleX 0 to 1, 0.8s, originX left
- Room list: name colour transitions 0.3s; image cross-fades with a 1.03 scale, 0.6s
- Detail lines under the room list swap with AnimatePresence, 0.28s
- House blocks: images slide in from alternating sides, 0.85s
- Nearby rows: fade in staggered 0.06s
- Motion is slow and unhurried throughout

## 8. Responsive
- **Mobile (<768px):** hamburger; centred wordmark retained; H1 clamps to 38px; room chooser becomes stacked cards with the image above each set of details, since hover does not exist on touch; rates table becomes stacked rows; `Check Availability` pinned as a sticky bottom bar.
- **Tablet:** room chooser keeps the split layout at reduced image height; house blocks 2-col.
- **Desktop:** max width 1160px, `px-16`, `py-24`.

## 9. Full Copy

**Brand:** THE WRENHOUSE · Bed and breakfast · Near Hay-on-Wye, Herefordshire

**Navbar:** Rooms · Breakfast · The House · Nearby · Rates · [Button] Check Availability

**Hero**
- Eyebrow: `HEREFORDSHIRE · FIVE ROOMS · ADULTS AND OVER-12s · NO SINGLE NIGHT SATURDAYS`
- H1: `Five rooms, one very good breakfast.`
- Subline: `A small bed and breakfast in a seventeenth-century stone house four miles from Hay-on-Wye. Five rooms, a proper sitting room fire, and eggs from the eleven hens at the end of the garden.`
- CTAs: `Check Availability` · `See the Rooms`

**Welcome** — `We bought the house in 2011 with no intention of running a bed and breakfast, and then spent four years restoring it and realised it was far too big for two people. Fourteen years later we still cook every breakfast ourselves.`
Signed: `— Ruth and Alec Warrender`

**Rooms** — Eyebrow `THE ROOMS` — H2 `Five, all different`
1. **The Wren** — £145 a night — King bed · Ensuite shower · Over the orchard — The smallest of the doubles, and the one with the best morning light. Low beam at the door, which we mention because tall guests appreciate the warning.
2. **The Swift** — £165 a night — Super king · Ensuite with a roll-top bath · South, over the valley — The room most people book twice. Sloped ceiling, deep window seat, and the bath is under the window.
3. **The Martin** — £135 a night — Double · Private bathroom across the hall · The kitchen garden — The bathroom is not ensuite, which is why it is the cheapest room. It is also entirely yours and nobody else passes the door.
4. **The Linnet** — £125 a night — Twin · Ensuite shower · The courtyard — Two proper single beds rather than a zip-and-link. Popular with friends travelling together and with walkers who snore.
5. **The Kestrel** — £195 a night — King with a sofa · Ensuite bath and separate shower — The largest room, on the corner with two aspects. Room enough for a third person on the sofa bed at £30.

**Breakfast** — Eyebrow `BREAKFAST` — H2 `Served between eight and half nine`
`Eggs from our own hens, sausages and bacon from the butcher in Hay, bread baked here the morning you eat it, and tomatoes from the greenhouse between June and September. There is a cooked breakfast, a smoked haddock, a vegetarian version that is not an afterthought, and porridge with whatever is in the orchard.`
`Tell us about allergies and preferences when you book rather than at the table and we will genuinely sort it out. We do not do a buffet, because a buffet at five rooms is just food sitting out getting cold.`

**The house**
1. **The sitting room** — Open fire from October, two sofas, a lot of books, and no television. Guests use it more than we expected them to.
2. **The garden** — An acre, mostly walled, with the kitchen garden at the back and the hens beyond that. There are chairs out from April.
3. **The honesty bar** — Local cider, a short wine list, and a decent gin. Write what you take in the book and settle at the end.

**Nearby**
Walks: `Offa's Dyke path, from the gate, 2 hours` · `Hay Bluff, 15 min drive, 3 hours` · `The river at Glasbury, 10 min drive, an easy hour` · `Arthur's Stone, 20 min drive, 40 minutes`
Eating: `The Bull at Craswall, 12 min, worth the drive` · `Chapters in Hay, 15 min, book ahead` · `The Bridge at Michaelchurch, 9 min, good pub food` · `The Old Electric Shop, Hay, 15 min, lunch and coffee`

**Practical information**
`Check-in 4pm to 7pm, or later by arrangement · Check-out 10:30am · Free parking for six cars · Dogs in The Linnet only, £15 a stay · Children over 12 welcome · Wifi is good in the house and poor in the garden · Two flights of stairs, no lift, and we will tell you honestly if that is a problem · No smoking anywhere including the garden`

**Rates**
| Room | Low season | High season | Min stay |
|---|---|---|---|
| The Martin | £125 | £145 | 1 night, 2 at weekends |
| The Linnet | £125 | £140 | 1 night, 2 at weekends |
| The Wren | £145 | £165 | 1 night, 2 at weekends |
| The Swift | £165 | £185 | 2 nights at weekends |
| The Kestrel | £195 | £220 | 2 nights at weekends |

Note: `All rates include breakfast for two. High season is April to September plus the Hay Festival. We do not take single-night Saturday bookings, which we know is annoying, and which is the only way five rooms works.`

**Reviews**
1. `Ruth asked at booking about my wheat thing and then produced, unprompted, four mornings of entirely different breakfasts. I have stayed in hotels that could not manage one.` — **Fiona T.**, The Swift
2. `We took the cheap room with the bathroom across the hall expecting a compromise. It is a better room than most ensuites I have paid double for.` — **Dan H.**, The Martin
3. `No television in the sitting room is the best decision anyone has made about a guest house. We talked to strangers. It was lovely.` — **Marek and Ola**, The Kestrel

**Booking** — `Booking direct is cheaper than the platforms, because they take between fifteen and eighteen percent and we would rather you had it. Use the form, or ring us — someone answers.`

**Footer** — THE WRENHOUSE · `Five rooms, one very good breakfast.` · `Bacton, near Hay-on-Wye, Herefordshire HR2 0AP` · what3words: `orchard.hens.kettle` · `01981 555 0129` · Ruth and Alec Warrender · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "react-day-picker": "^9.0.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
