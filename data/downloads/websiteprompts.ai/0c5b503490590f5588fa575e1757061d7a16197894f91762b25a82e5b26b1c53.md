# Long Lead: Dog Walking Website Prompt

## 1. Goal
Build a warm, unfussy website for **Long Lead**, a dog walker who takes small groups out for proper walks. Oat paper, dark moss ink, one rust accent, a friendly serif, and a single drawn lead that runs down the page and ties the sections together.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking system. Buttons link to a phone number or email. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #EFE9DC;
  --ink: #23301F;
  --accent: #A9512B;
  --on-accent: #EFE9DC;
  --surface: #E5DED0;
  --muted: #5F6A59;
  --line: rgba(35,48,31,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines and tints instead of boxes and shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,600;1,400&family=Karla:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Bitter 600, clamp(46px, 6.5vw, 96px), line-height 1.02, letter-spacing -0.02em
- **Body:** Karla 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Only times, prices, group sizes and index labels.
- At most one italic word per headline, in the accent colour.

## 5. Signature element
**One lead, drawn down the page.** A single rust coloured SVG stroke, 2px, that starts at a clip in the hero and meanders down the left third of the page, passing each section and ending at a loop in the footer. It draws itself as the visitor scrolls, using `pathLength` tied to scroll progress, so the lead is paid out as you go. It never crosses text and has a small drawn clip at the top and a loop at the bottom.

Below 1024px the lead is hidden entirely. It is decoration with a job, not a puzzle.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, paper, one hairline beneath. Wordmark left with a small drawn clip, three links right, rust pill with a round arrow circle.
2. **Hero, split portrait**: headline left over a hairline rule, tall photograph bleeding off the right edge, one sentence and two actions beneath the headline. Min height `clamp(520px, 76vh, 780px)`. *Photograph: three dogs of different sizes walking together on a muddy path, low winter sun, handler's legs just in frame.*
3. **The walk, numbered rows**: light. Four rows on hairlines with mono time markers: pickup, the walk itself, the tidy up, the message home.
4. **Groups, Swiss list**: surface. Label column `001/ Groups`, three stacked group names from one third, each with a size, a pace note and a price in mono.
5. **Today's pack, photo grid**: light. Six square photographs of dogs at different vertical offsets, each with a name and breed in mono beneath. *Photographs: individual dogs looking at the camera on a walk, natural light, no studio backgrounds.*
6. **What you get after every walk**: dark moss ground, inset 16px, `--panel-radius`. Three short lines in paper colour: a photograph, a note about how they were, and the route distance.
7. **Insurance and keys, index**: light. Two ruled columns: what is covered, how keys are handled. Plain, factual, reassuring.
8. **Prices, hairline rows**: light. Four rows: single walk, block of ten, puppy visit, solo walk. Prices right aligned in mono.
9. **One quote**: surface. A single centred quote in Bitter at 30px with a signature line in mono.
10. **Meet first, accent panel**: rust ground, inset panel. One line, two actions and a mono note about the free meet and greet.
11. **Footer**: dark moss. Giant cropped `LONG LEAD` wordmark, area covered, phone, three small links.

## 7. Motion
- Headline fades up 18px once.
- Photographs settle from `scale 1.03` over 1.1s.
- The lead draws with scroll as described.
- Dog photographs lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the lead fully drawn.

## 8. Responsive
- **Mobile under 768px:** the lead is hidden. Hero photograph moves above the headline at 46vh, headline at 46px. The pack grid becomes two columns with offsets removed. Index columns stack. Nav keeps the wordmark and the pill. No horizontal page scroll.
- **Tablet:** pack grid three columns, lead hidden.
- **Desktop:** content max-width 1180px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** LONG LEAD. Meta: `DOG WALKING IN SHEFFIELD. GROUPS OF FOUR, NEVER MORE.`

**Nav:** The walk, Groups, Prices. Button: `Meet first`

**Hero**
- Headline: `An hour out, properly *tired*, home again.`
- Sentence: `Small group walks on the moor edge and in the woods, never more than four dogs, always the same face at the door.`
- Actions: `Meet first`, `Call 0114 555 0180`

**The walk** (label `000/ The hour`)
- `08:40` **Pickup.** `I let myself in, say hello properly, and check water and the back door before we go.`
- `09:00` **The walk.** `Sixty minutes on the moor edge, in the woods or by the river, depending on weather and who is in the group.`
- `10:05` **Towels and paws.** `Everyone gets dried in the van. Muddy dogs do not come back into clean hallways.`
- `10:20` **A message.** `A photograph, a line about how they were, and the distance we covered.`

**Groups** (label `001/ Groups`)
- **The Steady Four.** `Older dogs and gentle walkers. Plenty of sniffing, no sprinting.` `MAX 4 DOGS. 60 MIN. 16 GBP`
- **The Long Ones.** `Young, fit dogs who need real distance. Moor edge, hills, two rivers.` `MAX 4 DOGS. 90 MIN. 22 GBP`
- **Solo.** `Dogs who find groups hard, or who are recovering from something.` `ONE DOG. 45 MIN. 24 GBP`

**Today's pack** (label `002/ The pack`)
Mabel, lurcher · Otto, cocker spaniel · Sid, staffie cross · Winnie, border terrier · Bruno, labrador · Peg, whippet

**After every walk**: `A photograph from the walk.` · `A line about how they were, honestly, including the day they rolled in something.` · `The route and the distance, so you know what they have had.`

**Insurance and keys** (label `003/ The dull but important bit`)
- Covered: `Full public liability to 5m GBP`, `Care, custody and control cover`, `Canine first aid trained, certificate on request`, `DBS checked, happy to show it`
- Keys: `Kept in a locked box, tagged with a code and never an address`, `Returned the day you ask`, `Never copied`, `Alarm codes stored separately from keys`

**Prices** (label `004/ Prices`)
- `Single group walk` ... `16 GBP`
- `Block of ten walks` ... `145 GBP`
- `Puppy visit, 30 minutes` ... `12 GBP`
- `Solo walk` ... `24 GBP`
Mono: `Prices include pickup and drop off within four miles. No charge for bank holidays you cancel.`

**Quote:** `He comes home muddy, exhausted and slightly smug. Exactly what we wanted.`
Signature: `Rachel, Nether Edge`

**Meet first panel**
- Line: `Come on a walk with us before you book anything.`
- Actions: `Arrange a meet`, `Call 0114 555 0180`
- Mono: `THE FIRST MEET AND A SHORT WALK TOGETHER ARE FREE.`

**Footer**
`LONG LEAD`, `Sheffield S7, S8, S11 and S17`, `hello@longlead.dog`, `0114 555 0180`, links `The walk`, `Prices`, `Insurance`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
