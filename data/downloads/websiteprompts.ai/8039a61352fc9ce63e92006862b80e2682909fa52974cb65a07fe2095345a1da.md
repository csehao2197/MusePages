# Cross Court Padel: Padel Club Website Prompt

## 1. Goal
Build a bright, energetic website for **Cross Court Padel**, an indoor padel club with eight courts in a converted warehouse in St Philips, Bristol. Big surfaces of court blue, ball yellow used as a loud highlight, off white paper between them and wide, heavy grotesk type. It should feel like the moment a rally gets fast: sharp corners, tight spacing, one huge action photograph.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no booking widget, no calendar, no map library. Every booking button links out to the club's booking page.

## 3. Design system
```css
:root {
  --paper: #F4F6F1;         /* off white, between the blue blocks */
  --ink: #0E1A2B;           /* deep navy ink */
  --accent: #DFF24B;        /* ball yellow, used as a fill */
  --on-accent: #0E1A2B;
  --court: #1D4FA0;         /* court blue, large surfaces */
  --on-court: #FFFFFF;
  --surface: #E6EBE3;
  --muted: #4E5A66;
  --line: rgba(14,26,43,0.18);
}
```
Court blue covers the hero, coaching and footer as full width blocks. Ball yellow is a background or a fill, never body text on paper (the contrast is far too low). On blue, text is white, and the yellow may be used for large headings on blue. Secondary text on blue is #C9D6EC. Every text colour, including muted text and labels, must reach at least 4.5 to 1 against the surface it sits on. No text under 14px. Corners are sharp everywhere: 0 radius on buttons, photographs and blocks.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap" rel="stylesheet" />
```
One family, used with its width axis.
- **Display:** Archivo, `font-stretch: 125%`, weight 900, uppercase, clamp(52px, 9vw, 150px), line-height 0.88, letter-spacing -0.02em
- **Section headings:** Archivo 125% width, 800, uppercase, clamp(34px, 4.6vw, 64px), line-height 0.95
- **Body:** Archivo 100% width, 400, 17px, line-height 1.55
- **Labels and prices:** Archivo 75% width, 700, 15px, uppercase, letter-spacing 0.06em, tabular numbers

## 5. Buttons
Solid, square and chunky, like a court marking:
- **Primary:** ball yellow fill, navy text, 0 radius, Archivo 125% width 800 uppercase 16px, padding 18px 28px, a 2px navy border. Hover: the button shifts 3px up and left and a hard 3px navy offset shadow appears behind it (a flat block, not a blur).
- **Secondary:** white fill, navy text, same shape and border. On blue backgrounds it stays white.
- No pills, no outlines without fill, no arrow circles.

## 6. Sections

1. **Navbar:** paper, 72px, 2px navy bottom border. Wordmark `CROSS COURT` in Archivo 125% width 900 left, links in the middle, primary `Book a court` right. Sticky, and the paper turns pure white once scrolled.
2. **Hero, asymmetric:** a court blue block spanning the left seven of twelve columns, min-height clamp(560px, 78vh, 820px). Faint white court lines (the service line, centre line and the back walls of a padel court seen from above) are drawn in SVG behind the text at 18% opacity. Inside: label, the huge three line heading, one sentence, both buttons. The photograph takes the right five columns, bleeds off the right edge of the screen and drops 64px lower than the blue block so the two overlap the next section. *Photograph: a padel player mid smash at the net of an indoor glass court, racket high, ball frozen above, blue court floor and bright arena lighting, shot low from the side, real motion and sweat, no logos.*
3. **Price strip:** ball yellow, full width, 2px navy borders top and bottom. Three prices in a single row in display type at 56px, separated by tall 2px navy rules, each with a small label under it.
4. **New to padel:** paper. Left: a top down diagram of one court drawn with navy 2px lines in SVG (glass walls thicker, the net as a dashed line, the service boxes marked). Right: a heading and six short rules as a numbered list with large outlined numbers. When the section enters view, the court lines draw themselves once over 1.2s.
5. **The courts:** ink background, white text. A wide photograph across the top (21:9, sharp corners), then a packed four column row of facts in big numbers with a label under each. *Photograph: a long row of indoor padel courts under a warehouse roof with steel trusses and skylights, blue turf, glass walls, a few players mid game.*
6. **Coaching:** court blue. Heading in ball yellow. A real table with four rows: session, who it is for, length, price. White text, rows split by 1px white lines at 30%. Primary button under the table.
7. **Membership:** paper. Two plans side by side, split by a single 2px navy vertical rule, not boxed in cards. Each with name, monthly price in display type, four short lines and a button. A small note under both.
8. **Leagues and socials:** surface. A weekly list of four rows: day, name, level, time. A second, smaller photograph sits to the right. *Photograph: four friends laughing on a padel court after a match, rackets under arms, sharing a bottle of water.*
9. **Footer:** court blue. Three quiet rows: wordmark and address, opening hours and phone, then socials and the small print.

## 7. Motion
- Hero heading lines slide in from the left, 0.5s each, 0.08s apart. The photograph slides in from the right by 40px.
- The court diagram draws once with `pathLength` from 0 to 1.
- Table and list rows fade up with a 0.04s stagger.
- Respect `prefers-reduced-motion`: show everything static.

## 8. Responsive
- **Mobile under 768px:** the hero blue block becomes full width, heading at 52px, the photograph follows below at 4:5 full width. The price strip stacks into three rows. The court diagram sits above the rules. Fact row becomes two by two. Coaching rows and membership plans stack. A yellow `Book a court` bar is fixed to the bottom of the screen with safe area padding.
- **Desktop:** max-width 1240px for content, blue and yellow blocks run full width. Section padding 88px, tighter than usual on purpose.

## 9. Full copy

**Name:** Cross Court Padel
**Nav:** Play, Courts, Coaching, Membership, Leagues. Button: `Book a court`

**Hero**
- Label: `EIGHT INDOOR COURTS, ST PHILIPS, BRISTOL`
- Heading: `PLAY` / `OFF THE` / `WALLS.`
- Text: `Padel is tennis with walls, squash with a net and the easiest racket sport to love in your first hour. Rackets and balls are free with every booking.`
- Buttons: `Book a court`, `Try a first session`

**Price strip**
- `£32` `Off peak court, 90 minutes`
- `£44` `Peak court, 90 minutes`
- `£8` `Each, split four ways off peak`

**New to padel**
- Heading: `The rules fit on a napkin`
- 1 `Always doubles. Four players, two a side.`
- 2 `Serve underarm, below the waist, into the box diagonally opposite.`
- 3 `The ball may bounce once, then hit the glass, and stay in play.`
- 4 `You can play it off your own back wall too.`
- 5 `Scoring is the same as tennis: 15, 30, 40, game.`
- 6 `Nobody in Bristol is any good yet. That is the point.`
- Link: `Book a first session for £15`

**The courts**
- Heading: `Eight courts under one roof`
- Facts: `8` `Panoramic glass courts` · `10m by 20m` `Regulation size` · `06:30` `First booking of the day` · `0` `Rained off sessions, ever`

**Coaching**
- Heading: `Get better, faster`
- `Padel in an hour` · `Total beginners` · `60 min` · `£15 per person`
- `Improvers group` · `Played five times or more` · `75 min` · `£18 per person`
- `Private lesson` · `Any level, one or two players` · `60 min` · `£55`
- `Junior academy` · `Ages 8 to 16, Saturday mornings` · `90 min` · `£12 per child`
- Button: `See coaching times`

**Membership**
- `Rally` `£19 a month`: `Book seven days ahead` · `10% off every court` · `Free racket hire` · `Member socials`
- `Smash` `£39 a month`: `Book fourteen days ahead` · `Two free off peak courts a month` · `20% off coaching` · `Entry to every league`
- Buttons: `Join Rally`, `Join Smash`
- Note: `No joining fee. Cancel any month with thirty days notice.`

**Leagues and socials**
- Heading: `Something on most nights`
- Monday, `Beginners mix in`, all levels, 19:00
- Tuesday, `Ladder league`, intermediate, 19:30
- Thursday, `Mixed doubles league`, intermediate and up, 19:30
- Friday, `Americano and a pint`, all levels, 18:30

**Footer**
- `CROSS COURT PADEL` · `Unit 4, Feeder Road, St Philips, Bristol BS2 0TH`
- `Open 06:30 to 22:30, every day` · `0117 496 0321` · `play@crosscourtpadel.co.uk`
- `Instagram`, `TikTok`, `Strava club` · `Cross Court Padel Ltd. Court prices include VAT.`

## 10. Never
Rounded corners, pills, yellow text on paper, gradients, glow, glassmorphism, neon, icon grids, emoji, a booking calendar, a real map, phrases like "elevate your game", dashes of any kind in the copy, lorem ipsum, `100vh` heroes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
