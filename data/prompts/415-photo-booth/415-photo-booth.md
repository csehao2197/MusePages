# Four Frames: Photo Booth Website Prompt

## 1. Goal
Build a warm, playful but still editorial website for **Four Frames**, a hire company with three restored 1970s photo booths. Butter yellow ground, near black ink, a tomato red accent, big confident serif headlines and real photo strips given room. Fun comes from the object itself, not from effects.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking calendar. Enquiry buttons link to email or telephone.

## 3. Design system
```css
:root {
  --paper: #F2E2A0;              /* butter ground */
  --ink: #2A2618;                /* near black, text and dark ground */
  --accent: #D8472B;             /* tomato */
  --on-accent: #F2E2A0;
  --surface: #EAD794;            /* tinted ground */
  --muted: #6B6448;              /* secondary text */
  --line: rgba(42,38,24,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines and tints, never boxes with shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Figtree:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Fraunces 600, optical size 144, letter-spacing -0.02em, line-height 0.98. Hero 90 to 145px, section titles 44 to 70px.
- **Body:** Figtree 300, 16px, line-height 1.55.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Only for dates, prices, hire lengths, index labels.
- One italic word per headline at most, in tomato.

## 5. Signature element
**A strip that develops.** A vertical photo strip of four frames with a white border and a small mono caption at the foot, tilted 2 degrees. When it enters view the frames appear one after the other, 400ms apart, each fading from the paper colour to the photograph, the way a print comes up in a tray. It happens once.

The strip is used twice at most: once in the hero, once in the closing panel. Nothing else animates near it.

## 6. Sections, each a different skeleton

1. **Navbar**: 74px, butter, one hairline beneath. Wordmark left, four links right, tomato pill with a round arrow circle.
2. **Hero, inline pill**: a giant two line headline with a small rounded photograph set between two of the words, plus the developing strip (section 5) pinned to the right at a 2 degree tilt. Min height `clamp(540px, 78vh, 820px)`. *Inline photograph: two people laughing inside a curtained photo booth, warm flash light.*
3. **Statement**: light. One long serif paragraph starting at one third, label `001/ The booths` in the left column. No image.
4. **The three booths, peek list**: surface. Three large serif rows, one per booth, each with a year, a film type and a capacity in mono on the right. Hovering a row shows a small photograph card beside the name. *Photographs: a chrome and enamel booth, a wood panelled booth, a small white booth, all photographed straight on.*
5. **Signature panel**: dark ink ground, inset 16px, `--panel-radius`. A wall of nine photo strips at slight angles, and a mono caption. One of them develops as described.
6. **What you get, hairline rows**: light. Five full width rows separated by hairlines: attendant, unlimited strips, guest book, props box, digital copies. Each with one short sentence. No icons.
7. **Prices, ruled table**: light. Three hire lengths with what is included and the price in mono, right aligned. Dense on purpose.
8. **Where it has been, loose grid**: surface. Six photographs at different sizes and vertical offsets, captioned in mono with the venue and month. *Photographs: a village hall wedding, a warehouse party, a museum late, a garden marquee, an office Christmas do, a birthday in a pub.*
9. **One quote**: light. A single centred quote in Fraunces at 36px with a signature line in mono.
10. **Enquiry, accent panel**: tomato ground, inset panel. A big serif line, two actions, and the developing strip again, smaller, rising from the bottom edge.
11. **Footer**: dark ink. Giant cropped `FOUR FRAMES` wordmark, coverage area, telephone, four small links.

## 7. Motion
- Hero headline fades up 20px once, the inline photograph settles from `scale 1.04`.
- The strip develops frame by frame, once per appearance.
- Peek list photographs crossfade over 0.25s.
- Loose grid images settle from `scale 1.03` over 1.1s.
- Hover: images zoom to 1.03, arrow circles slide 4px.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** the hero strip moves beneath the headline and sits straight, the inline photograph drops to its own line. Headline at 46px. Peek list loses hover and shows a thumbnail in each row. The strip wall becomes three strips. Loose grid one column, offsets removed. No horizontal page scroll, though the strip wall may scroll inside itself.
- **Tablet:** strip wall six strips, loose grid two columns.
- **Desktop:** 1200px content width, gutters 40px, section padding 110 to 130px.

## 9. Full copy

**Wordmark:** FOUR FRAMES. Meta: `THREE RESTORED BOOTHS. REAL FILM. YORKSHIRE AND THE NORTH.`

**Nav:** The booths, What you get, Prices, Enquire. Button: `Check your date`

**Hero**
- Headline with the inline photograph between `four` and `minutes`: `Four people, four *minutes*, four frames.`
- Sentence: `Proper chemical photo booths from the seventies, restored and driven to your wedding, party or launch. Black and white film, developed on the spot.`
- CTA: `Check your date`

**Statement** (label `001/ The booths`)
`A digital booth prints a picture. A chemical booth makes one, in a tray, in the dark, while four people stand outside arguing about who blinked. The waiting is the point. Our three machines were built between 1972 and 1979, and they still use the same silver based paper and the same four flashes, eight seconds apart.`

**The three booths** (label `002/ The machines`)
- **Marlene.** `Chrome and cream enamel, the loudest shutter of the three.` `1972. BLACK AND WHITE. FITS FOUR.`
- **Sid.** `Wood panelled, from a station in Leeds, still smells faintly of it.` `1976. BLACK AND WHITE. FITS THREE.`
- **Dot.** `Small, white, easy up stairs. The one for tight rooms.` `1979. BLACK AND WHITE. FITS TWO.`

**Signature caption:** `Strips from one Saturday in June. Nobody is looking at the camera in the fourth frame, they never are.`

**What you get** (label `003/ Included`)
- **An attendant all night.** `One of us stays with the booth, loads the film and fixes the jams.`
- **Unlimited strips.** `Every group gets one. Nobody counts.`
- **A guest book.** `A second strip goes in the book with a note beside it. This is the thing couples keep.`
- **A props box.** `Hats, glasses and one questionable wig. Left in the van if you would rather.`
- **Digital copies.** `Every strip scanned at 1200dpi and sent within a week.`

**Prices** (label `004/ Hire`)
- `Three hours` ... `Attendant, unlimited strips, digital copies` ... `595 GBP`
- `Four hours` ... `Everything above, plus the guest book` ... `695 GBP`
- `All evening, six hours` ... `Everything, plus a second props box and late collection` ... `845 GBP`
Mono note: `Prices include travel within fifty miles of Leeds. Beyond that, 1 GBP a mile.`

**Where it has been** (label `005/ Recently`)
Captions: `Hepworth Wakefield, June`, `A barn near Otley, August`, `Belgrave Music Hall, May`, `A garden in Ilkley, July`, `Leeds Corn Exchange, December`, `The Adelphi, March`

**Quote:** `The queue for the booth was longer than the queue for the bar, which my father in law still brings up.`
Signature: `Nadia and Tom, married in August`

**Enquiry panel**
- Line: `Tell us the date and the room.`
- Actions: `Check your date`, `Call 0113 555 0182`
- Mono: `WE TAKE ONE BOOKING A NIGHT PER BOOTH.`

**Footer**
`FOUR FRAMES`, `Based in Leeds, travelling across Yorkshire and the north`, `hello@fourframes.co.uk`, `0113 555 0182`
Links: `The booths`, `Prices`, `Weddings`, `Instagram`

## 10. Never
Glassmorphism, gradients, glow, neon, drop shadowed cards, icon grids, emoji, confetti animations, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
