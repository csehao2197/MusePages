# Northline: Video Production Website Prompt

## 1. Goal
Build a quiet, architectural website for **Northline**, a four person video production company in Manchester. Stone ground, warm charcoal ink, an olive accent, uppercase grotesk headlines, a visible column grid, and frames from their own work given room. It should look like a well made portfolio, not a showreel site.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no video player library, no autoplaying showreel. Work is shown as stills, and a play link opens the film elsewhere.

## 3. Design system
```css
:root {
  --paper: #E6E2DA;              /* stone ground */
  --ink: #2A2624;                /* warm charcoal */
  --accent: #6B6A33;             /* olive */
  --on-accent: #E6E2DA;
  --surface: #DCD8CF;            /* tinted ground */
  --muted: #6E6862;              /* secondary text */
  --line: rgba(42,38,36,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, surface, light, dark, light, accent, dark footer. Hairlines and a faint column grid do the structuring.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700&family=DM+Sans:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Archivo 700, uppercase, letter-spacing -0.04em, line-height 0.92. Hero 78 to 130px, section titles 40 to 64px.
- **Body:** DM Sans 300, 16px, line-height 1.55.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Client, year, format, runtime, index labels like `002/ Work`.
- No italics. Emphasis by a line set in olive.

## 5. Signature element
**A film strip of four stills.** A horizontal strip with sprocket holes drawn as small rounded rectangles along the top and bottom edges in the ink colour, holding four frames from one shoot. It sits on a hairline baseline, and when it enters view the strip slides 40px to the left and settles, as if pulled through a gate. Frames are still photographs, nothing plays.

Used once, in an inset panel on the dark ground, with a mono caption naming the shoot. On a phone it scrolls inside itself.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, stone, one hairline beneath. Wordmark left, four links right in mono, an olive pill button with a round arrow circle.
2. **Hero, Swiss sheet**: faint vertical gridlines visible across the section, mono index `000/ Northline` in the left column, an uppercase three line headline starting at the first third, and a single sentence beneath. No hero photograph. Min height `clamp(520px, 74vh, 760px)`.
3. **A frame, photo led**: surface. One full bleed still, no text over it, with a mono caption beneath naming the client and the year. *Still: a cinematographer's frame of a factory floor, shafts of daylight, one worker small in a wide shot.*
4. **What we make, Swiss list**: light. Label column `001/ What we make`, four stacked service names from one third of the width, each with a runtime range and a price band in mono on the right, and one line of description.
5. **Work, loose editorial grid**: light. Six projects at different sizes and vertical offsets, each a still with client, year and runtime in mono beneath. Hovering brings a small olive `Watch` label. *Stills: a brewery in low light, a hospital corridor, a mountain road from a car, a chef plating, a wind turbine from below, a dance rehearsal.*
6. **Film strip panel**: dark charcoal, inset 16px, `--panel-radius`. The signature element (section 5) with a mono caption.
7. **How a film gets made, numbered rows**: light. Five rows on hairlines: a mono week marker, a title in Archivo at 28px, one sentence. Honest about how long things take.
8. **The four of us, credits list**: surface. Four names in large uppercase rows with tiny roles on the right. Hovering a row makes a small portrait follow the cursor. *Portraits: four crew members photographed plainly against a wall.*
9. **One quote**: light. A single centred quote in Archivo at 30px with a signature line in mono.
10. **Budgets, accent panel**: olive ground, inset panel. Three honest price bands with one line each, and two actions.
11. **Footer**: dark charcoal. Giant cropped `NORTHLINE` wordmark, studio address, telephone, four small links.

## 7. Motion
- Headline lines rise 22px with 0.08s stagger, once.
- Gridlines fade in over 0.8s on load, then stay still.
- Stills settle from `scale 1.03` to `1` over 1.1s.
- The film strip slides and settles once.
- Credits portraits follow the cursor with a soft spring and fade in over 0.2s.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** gridlines hidden, headline at 44px from the left margin. Work grid one column with offsets removed. Credits list loses the cursor portrait and shows a small thumbnail on the left. Film strip scrolls inside itself. No horizontal page scroll.
- **Tablet:** work grid two columns, gridlines visible.
- **Desktop:** 1200px content width, gutters 40px, section padding 110 to 130px.

## 9. Full copy

**Wordmark:** NORTHLINE. Meta: `MANCHESTER. FOUR PEOPLE. FILMS FOR PEOPLE WHO MAKE THINGS.`

**Nav:** Work, What we make, The team, Budgets. Button: `Start a project`

**Hero** (index `000/ Northline`)
- Headline: `WE FILM / THE PART / NOBODY SEES.`
- Sentence: `Factories, kitchens, laboratories and the people in them. Four of us, one camera most days, and a preference for the quiet shot over the drone one.`

**First frame caption:** `Bolton, for Hartley Engineering. 2026.`

**What we make** (label `001/ What we make`)
- **Brand films.** `One film that explains who you are, made to last three years rather than three weeks.` `2 TO 4 MIN. 8 TO 18K GBP`
- **Documentary shorts.** `A person, a place and a real story. Usually the work people actually watch to the end.` `5 TO 12 MIN. 12 TO 30K GBP`
- **Product films.** `Close, slow and properly lit. Made for a website rather than a feed.` `30 TO 90 SEC. 4 TO 9K GBP`
- **Event coverage.** `A conference or a launch, cut in three days rather than three weeks.` `2 TO 5 MIN. 3 TO 6K GBP`

**Work** (label `002/ Work`)
- **Hartley Engineering** `2026. 4 min.`
- **Pennine NHS Trust** `2026. 9 min.`
- **Ordnance Survey** `2025. 3 min.`
- **Erst Restaurant** `2025. 90 sec.`
- **Scout Moor Wind Farm** `2025. 6 min.`
- **Company Chameleon** `2024. 5 min.`

**Film strip caption:** `Four frames from the Pennine shoot. Third one made the cut.`

**How a film gets made** (label `003/ Process`)
- `WEEK 1` **We come and look.** `A day on site with no camera, talking to the people who will be in it.`
- `WEEK 2` **A treatment, in writing.** `Two pages: what the film is, who speaks, and what it will cost. No mood boards.`
- `WEEK 3` **Shoot.** `Usually two days. We work around your shifts rather than the other way round.`
- `WEEK 5` **First cut.** `One round of notes included, a second if the first changes the shape.`
- `WEEK 7` **Delivered.** `Master, subtitled version, social crops and the raw files if you want them.`

**The four of us** (label `004/ Team`)
- `ROSA ELLIOTT` ... `Director`
- `SAM OKOYE` ... `Cinematographer`
- `HANNAH BRUCE` ... `Producer`
- `DAN FIELD` ... `Editor and colour`

**Quote:** `They spent the first day not filming, which I thought was a waste of money until I saw what they came back with.`
Signature: `Paul Hartley, Hartley Engineering`

**Budgets panel** (label `005/ Budgets`)
- `Under 5,000 GBP` ... `One shoot day, one deliverable, a tight cut.`
- `5,000 to 15,000 GBP` ... `Most brand films. Two days, a proper grade and a sound mix.`
- `Above 15,000 GBP` ... `Documentary work, multiple locations, original music.`
- Actions: `Start a project`, `See a full rate card`

**Footer**
`NORTHLINE`, `Unit 4, Hope Mill, Pollard Street, Manchester M4 7JA`, `hello@northline.film`, `0161 555 0144`
Links: `Work`, `Budgets`, `Rate card`, `Vimeo`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, autoplaying background showreels, stat soup like "200+ films delivered", lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
