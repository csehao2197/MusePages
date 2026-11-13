# Crimp: Climbing Gym Website Prompt

## 1. Goal
Build a direct, unintimidating website for **Crimp**, a bouldering gym in Sheffield. Pale grey paper, near black ink, one burnt orange accent, a heavy grotesk, and one signature: a bouldering problem where the holds light up in sequence, the way a climber reads a route from the floor. Half the visitors have never climbed and are worried about looking stupid. Say so.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking engine, no class calendar feed. The holds are positioned divs. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F0F0EE;
  --ink: #121314;
  --accent: #C2410C;           /* burnt orange */
  --on-accent: #FFFFFF;
  --surface: #E2E2DF;
  --muted: #585A58;
  --line: rgba(18,19,20,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, surface, light, dark, light, accent, dark footer. Hairlines do the structuring.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Archivo 800, clamp(48px, 7vw, 104px), line-height 0.94, letter-spacing -0.04em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Grades, prices, opening times, index labels.
- No italics. Emphasis is a whole line in burnt orange.

## 5. Signature element
**Reading the route.** A wall drawn as a plain rectangle in `--surface`, with fourteen holds placed on it as small rounded shapes in hairline outline. On scroll into view, seven of them fill with burnt orange one after another from the bottom left to the top right, 180ms apart, tracing a single problem. A mono label beside it reads the grade. The seven that light are the route. The other seven stay outlined, because that is what a wall actually looks like.

It lights once. No climber figure, no animation loop, no hover.

## 6. Sections, each a different skeleton

1. **Navbar**: 70px, paper, one hairline beneath. Wordmark left, four links right, orange pill with a round arrow circle, and a mono line reading how busy it is right now.
2. **Hero, signature word**: the word `CRIMP` set across the full width along the bottom edge of a full bleed photograph, with a short sentence and two actions in the upper left. Min height `clamp(560px, 80vh, 860px)`. *Photograph: a bouldering wall from floor level, bright matting, one climber mid move, shot from behind so no face is identifiable.*
3. **The route**: surface. The signature element (section 5) with a mono caption about reading a problem before you touch it.
4. **Never climbed before**: light. One long paragraph at 22px from one third with the label `001/ First time`, written directly to the nervous beginner. No jargon, no encouragement that sounds like a poster.
5. **Prices, ruled table**: light. Five rows: entry, what it includes, price. Figures in mono, right aligned.
6. **What to expect in your first hour, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Four rows in paper colour with mono markers: arriving, the safety brief, the easy wall, falling off.
7. **Grades, index**: light. Two ruled columns. Left: our colour grades, from the ones everybody can do to the ones almost nobody can. Right: what each one actually feels like, in plain words.
8. **Classes and coaching, Swiss list**: light. Label `002/ Coaching`, four stacked offerings from one third, each with one line and a mono note on night and price.
9. **The gym, loose grid**: light. Five photographs at varied sizes with mono captions. *Photographs: the main bouldering wall, the slab, the training board, the cafe counter, the mats from above.*
10. **One quote**: surface. A single centred quote in Archivo at 30px with a signature line in mono.
11. **First session, accent panel**: orange ground, inset panel. One line, two actions, a mono note about what a first session costs with shoes.
12. **Footer**: dark ink. Giant cropped `CRIMP` wordmark, address, opening hours, three small links.

## 7. Motion
- Hero word rises 24px into place once, photograph settles from `scale 1.03`.
- Holds light in sequence once, as described.
- Table rows fade in with 0.04s stagger.
- Grid images settle from `scale 1.03`, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the route already lit.

## 8. Responsive
- **Mobile under 768px:** hero word scales to fit the width and the sentence moves above it. The wall keeps its proportions and shrinks to 300px tall. Price table becomes stacked rows. Grades become one column. Grid one column. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1200px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** CRIMP. Meta: `BOULDERING. NO ROPES. SHEFFIELD.`

**Nav:** First time, Prices, Coaching, Visit. Button: `First session`. Mono: `BUSY: QUIET UNTIL 17:00`

**Hero**
- Sentence: `Bouldering is climbing without ropes, four metres up, onto a very thick mat. That is the whole thing.`
- Actions: `First session`, `Prices`

**Route caption:** `Grade 4, the orange holds only. Climbers stand and stare at a wall for five minutes before they touch it, and that is most of the sport.`

**Never climbed before** (label `001/ First time`)
`Nobody is watching you. This is the single thing beginners get wrong about a climbing wall. Everybody there is staring at their own problem, failing at it repeatedly, and feeling mildly embarrassed about it. You do not need upper body strength, you do not need to be thin, and you do not need to come with somebody who already climbs. You need trainers you can take off and about ninety minutes.`

**Prices** (label `002/ Prices`)
| Entry | Includes | Price |
|---|---|---|
| First session | Entry, shoe hire, the safety brief | 16 GBP |
| Adult entry | All day, in and out | 13 GBP |
| Under 18 | All day, in and out | 9 GBP |
| Shoe hire | Any session | 4 GBP |
| Monthly, rolling | Any time we are open, no contract | 48 GBP |
Note: `No joining fee, no induction fee and no annual contract. Cancel the monthly whenever you like, by email, in one line.`

**Your first hour** (label `003/ What happens`)
- `MINUTE 0` **Arriving.** `Sign the form at the desk. It asks you to confirm you understand you can fall off, because you can.`
- `MINUTE 10` **The brief.** `Fifteen minutes with a member of staff, in a group of up to six. How to fall, where not to stand, how to read the colours.`
- `MINUTE 25` **The easy wall.** `Start on the slab at the far end. It leans backwards, which means your feet do the work and your arms do not get tired.`
- `MINUTE 40` **Falling off.** `You will. Everybody does, constantly. The mat is thirty centimetres thick and the whole sport is built around it.`

**Grades** (label `004/ Grades`)
- Our colours: `Yellow, 1 to 2` · `Green, 3` · `Blue, 4` · `Orange, 5` · `Red, 6` · `Black, 7 and up`
- What they feel like: `Yellow: a ladder with lumps.` · `Green: your first real problem, big holds, obvious moves.` · `Blue: you have to think about your feet.` · `Orange: you will need more than one attempt and that is the point.` · `Red: strong fingers, after a year or two.` · `Black: there are four people in this city who do these.`

**Classes and coaching** (label `005/ Coaching`)
- **Beginner course.** `Four weeks, one evening a week, same six people.` `TUESDAYS, 68 GBP`
- **Technique for improvers.** `For the plateau at grade 4, which is where almost everybody sticks.` `THURSDAYS, 20 GBP`
- **Youth club.** `Ages 8 to 15, coached, parents welcome to leave.` `SATURDAY MORNINGS, 12 GBP`
- **One to one.** `An hour with a coach on whatever is stopping you.` `BY ARRANGEMENT, 45 GBP`

**The gym** (label `006/ The gym`)
Main wall · The slab · The board · The counter · Mats from the gantry

**Quote:** `I put off going for two years because I thought I would be the worst person there. I was the worst person there. Nobody noticed and I went back on Thursday.`
Signature: `Tom Ellery, member since March`

**First session panel**
- Line: `Sixteen pounds, shoes included, no booking needed. Turn up and somebody will show you where to start.`
- Actions: `First session`, `See the beginner course`
- Mono: `OPEN 07:00 TO 22:00 WEEKDAYS, 09:00 TO 20:00 WEEKENDS. QUIETEST BEFORE 16:00.`

**Footer**
`CRIMP`, `Unit 7, Harleston Works, Sheffield S9 2LR`, `hello@crimp.climbing`
Mono: `Open 07:00 to 22:00 weekdays, 09:00 to 20:00 weekends. Under 14s must be with an adult.`
Links: `First time`, `Prices`, `Coaching`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, motivational quotes about mountains, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
