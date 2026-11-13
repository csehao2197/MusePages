# Field Day Weekend: Festival Website Prompt

## 1. Goal
Build a loud, poster style website for **Field Day Weekend**, a two day independent music festival in a riverside park in Leeds. Off white paper, black ink and big blocks of tomato red. Huge type, few photos, the lineup does the talking. It should feel like a screen printed gig poster, not a ticketing platform.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no ticketing widget, no countdown library. Tickets link out.

## 3. Design system
```css
:root {
  --paper: #F5F1E8;
  --ink: #121212;
  --accent: #FF4F2E;        /* tomato red, used as a background only */
  --on-accent: #121212;
  --surface: #E9E3D6;
  --muted: #575249;
  --line: #121212;
}
```
Important: the red is a background colour. Never set red text on the paper background, the contrast is too low. On red, text is always black. Lines on this site are solid black 2px, not hairlines. Every text colour must reach at least 4.5 to 1 against its background, no text under 14px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&display=swap" rel="stylesheet" />
```
One family only, used at two weights.
- **Display:** Bricolage Grotesque 800, uppercase, clamp(64px, 12vw, 200px), line-height 0.86, letter-spacing -0.03em
- **Lineup names:** Bricolage Grotesque 800, uppercase, sizes step down by billing: headliners 64px, second line 40px, third line 26px
- **Body:** Bricolage Grotesque 500, 18px, line-height 1.5

## 5. Buttons
Big and chunky, like a stamp:
- **Primary:** black 2px border, fully rounded pill, black fill, paper coloured text, Bricolage 800 uppercase 18px, padding 18px 34px. Hover: fill turns red, text stays black, border stays black.
- **Secondary:** same pill shape with a black 2px border and transparent fill.
- No arrow icons, no circles inside the button.

## 6. Sections

1. **Navbar:** paper, black 2px bottom border. Festival name left in 800 weight, links in the middle, primary pill `Get tickets` right. Not sticky on desktop.
2. **Hero, the poster:** full red block. The festival name stacked over three lines at maximum size, black. Under it in a row: dates, place and a short line. Both buttons below. A single photograph in a rounded 24px frame tucked into the bottom right corner, overlapping the edge of the red block by 40px. *Photograph: a festival crowd in front of an outdoor stage at golden hour, hands in the air, confetti in the light.*
3. **Lineup:** paper. The whole lineup centred like a poster: two headliners per day at the top size, then smaller rows. Day headings `SATURDAY` and `SUNDAY` sit in black pill labels. Artist names are separated by a small black dot.
4. **Tickets:** surface background. Three ticket cards side by side, each with a black 2px border and 20px radius: name, price large, three short lines about what is included, and the primary pill. The middle card has a red background.
5. **The site:** paper. A simple two column block. Left: four short facts in big type (stages, food stalls, river, curfew). Right: a site map drawn as a simple illustration with rounded shapes and labels, done in SVG with black lines on surface colour. Keep it schematic, not a real map.
6. **Getting there:** red block. Three columns: by train, by bike, by car, each two sentences. Black text.
7. **Questions:** paper. An accordion of six questions. Each row has a black 2px top border and a plus sign that rotates into a cross when open.
8. **Footer:** black background, paper text. Festival name very large across the full width, dates under it, and a row of links: Instagram, accessibility info, contact, lost property.

## 7. Motion
- Hero title letters drop in line by line, 0.5s each, 0.1s apart.
- Lineup rows fade up with a 0.05s stagger.
- Ticket cards lift 6px on hover.
- Accordion opens with a height animation of 0.3s.
- Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero title at 64px, photo moves below the buttons at full width. Lineup headliners drop to 40px. Ticket cards stack. Getting there columns stack. A slim black bar fixed at the bottom with `Get tickets`, respecting the safe area inset.
- **Desktop:** max-width 1280px for content, hero and red blocks run full width. Section padding 110px.

## 9. Full copy

**Name:** Field Day Weekend
**Nav:** Lineup, Tickets, The Site, Getting There, FAQ. Button: `Get tickets`

**Hero**
- Title: `FIELD DAY WEEKEND`
- Row: `11 AND 12 JULY 2026` · `KIRKSTALL RIVERSIDE, LEEDS` · `TWO DAYS, THREE STAGES, ONE RIVER`
- Buttons: `Get tickets`, `See the lineup`

**Lineup**
- SATURDAY: headliners `THE SOFT HOURS` · `MARLO VANE`. Second line: `Paper Kites Club` · `Junebug Static` · `Odessa Grey`. Third line: `Hollow Pines` · `The Tin Lanterns` · `Kiko Mars` · `Bramble and Ash` · `Sun Coast Radio`
- SUNDAY: headliners `NIGHT SWIMMERS` · `ADA OKONKWO`. Second line: `Velvet Static` · `The Lowland Choir` · `Rae Sterling`. Third line: `Copper Moth` · `Little Gale` · `Fen Wolves` · `The Marigolds` · `Dusk Patrol`

**Tickets**
- `Day ticket` £59. `Saturday or Sunday`, `All three stages`, `Re-entry until 6 pm`
- `Weekend ticket` £99. `Both days`, `All three stages`, `Free river shuttle from the station`
- `Under 16` £25. `With a paying adult`, `Both days`, `Ear defenders at the gate`
Note under the cards: `No booking fees. Tickets are named and can be transferred for free until 1 July.`

**The site**
- `3 stages`
- `40 food stalls, half of them local`
- `A river you can paddle in at the shallow end`
- `Music stops at 22:30, the trains do not`

**Getting there**
- By train: `Kirkstall Forge station is a seven minute walk. Extra trains run until midnight both nights.`
- By bike: `There is guarded bike parking for 1,200 bikes at the east gate, free all weekend.`
- By car: `There is no public parking on site. Use the park and ride at Bodington, £8 return.`

**Questions**
1. `Can I bring a chair?` `Low camping chairs are fine. Gazebos and large umbrellas are not.`
2. `Is it accessible?` `Yes. There is a raised viewing platform at every stage, accessible toilets and a quiet tent. Book a free carer ticket with your own.`
3. `Can I bring food?` `Yes, for your own group. No glass and no alcohol.`
4. `Is there cash?` `The site is card only. There are two cash to card points at the gates.`
5. `What if it rains?` `It goes ahead. Bring a coat, the river is wet anyway.`
6. `Can I leave and come back?` `Yes, until 6 pm. After that it is one way out.`

**Footer**
`FIELD DAY WEEKEND` · `11 AND 12 JULY 2026, LEEDS` · Links: `Instagram`, `Accessibility`, `Contact`, `Lost property`

## 10. Never
Red text on the paper background, gradients, glow, glassmorphism, neon, stock icons, a countdown timer, emoji, dashes of any kind in the copy, lorem ipsum, more than one font family.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
