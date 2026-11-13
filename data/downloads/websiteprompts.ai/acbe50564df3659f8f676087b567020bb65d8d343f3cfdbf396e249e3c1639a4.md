# Sumi Counter: Sushi Restaurant Website Prompt

## 1. Goal
Build a dark, quiet, precise website for **Sumi Counter**, a ten seat omakase sushi counter in Stockbridge, Edinburgh, run by chef Daisuke Ono. Ink black throughout, rice white type and one vermilion accent, the colour of a lacquer bowl or a seal stamp. A big photograph of nigiri fills the hero edge to edge. It should feel like a hinoki counter at night: dim, calm, every piece placed by hand. Lots of black space, few words.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no booking widget, no date picker, no map library. Reservations link out.

## 3. Design system
```css
:root {
  --paper: #0D0C0B;         /* ink black, main background */
  --ink: #F2ECE2;           /* rice white */
  --accent: #EC4E36;        /* vermilion: labels, the seal, underlines */
  --on-accent: #0D0C0B;
  --surface: #171513;       /* lifted black for alternate sections */
  --muted: #A79F94;
  --line: rgba(242,236,226,0.16);
}
```
Checked: rice white on black 16.6 to 1, muted 7.4 to 1 on paper and 6.8 to 1 on surface, vermilion 5.3 to 1 on paper and 4.9 to 1 on surface. Never set rice white text on a vermilion fill. Every text colour must reach at least 4.5 to 1 against the surface it sits on, labels included, and no text is smaller than 14px.

Corners are sharp: 0 radius on photos, buttons and panels. 1px hairlines in `--line`. No cards, no shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet" />
```
- **Headings:** Shippori Mincho 500, clamp(40px, 5.6vw, 88px), line-height 1.08. A sharp, high contrast mincho serif. No italics anywhere.
- **Course names:** Shippori Mincho 700, 24px.
- **Body:** Manrope 400, 17px, line-height 1.7.
- **Labels:** Manrope 600, 14px, uppercase, letter-spacing 0.22em, vermilion.
- **Prices and times:** Manrope 500, tabular numbers.

## 5. Buttons
Thin and square, like a line drawn with a brush tip:
- **Primary:** transparent, 1px rice white border, 0 radius, Manrope 600 15px uppercase, letter-spacing 0.16em, padding 16px 30px. Hover: fills rice white, text turns ink black, 0.25s.
- **Secondary:** Manrope 500 text with a 1px vermilion underline offset 6px.
- No pills, no solid blocks, no arrow icons.

## 6. Sections

1. **Navbar:** over the hero, transparent, 84px. Wordmark `SUMI` in Shippori Mincho 700, letter-spacing 0.3em, left. Links and a ghost `Reserve` button right. After 80px of scroll it becomes solid paper with a hairline.

2. **Hero, full bleed photograph:** full width, `min-height: clamp(600px, 88vh, 940px)`, object-fit cover. The photo keeps deep black space on the left, where the text block sits bottom left (max-width 560px): label, heading, one sentence, one ghost button. Behind the text only, a flat rgba(13,12,11,0.55) panel with 32px padding so contrast always holds. *Photograph: three pieces of nigiri on a matte black slate, otoro, sea bream and scallop, glistening rice, a stroke of soy beside them, the edge of a hinoki counter, low warm light from the right, the rest falling into black.*

3. **The counter:** paper, 160px padding. Two columns: one large paragraph in Shippori Mincho 32px on the left. On the right, two short paragraphs in muted text and three facts as lines between hairlines.

4. **Omakase:** surface. The heading, and beside it the **signature element**: a 72px square vermilion seal with the character 墨 (sumi) cut out in ink black, like a hanko pressed on paper. It is the only decorative mark on the site. Below, the course as a numbered list: vermilion number, course name in mincho, one line in muted text, hairline under each. Then the price line and a secondary link.

5. **Hands at work:** a second full bleed photograph, 21:9, no text on it, a small vermilion caption under it. *Photograph: the chef's hands pressing nigiri, a wooden hangiri of rice, a damp cloth, light only on the hands.*

6. **Lunch:** paper. One centred column, max-width 640px. Dish left, price right, a dotted leader in `--line` between. Five lines and a muted note.

7. **Where the fish comes from:** surface. Four suppliers as a ruled list: name in mincho 24px, place in vermilion label style, one muted sentence.

8. **Reserve:** paper, centred. Heading, two lines of text, ghost button, phone as a secondary link, address in muted text.

9. **Footer:** one quiet line with a hairline above: wordmark, address, Instagram and Email. No giant wordmark.

## 7. Motion
One idea: things settle into place slowly, like a piece set on the counter.
- Hero photo scales from 1.04 to 1 over 1.8s. Hero text fades up 12px, 0.7s, after 0.3s.
- The seal presses in once when Omakase enters view: scale 1.15 to 1, opacity 0 to 1, 0.35s, settling from a 2 degree rotation.
- Course rows fade up with a 0.06s stagger. Nothing loops.
- Respect `prefers-reduced-motion`: fades only.

## 8. Responsive
- **Mobile under 768px:** hero min-height clamp(520px, 80vh, 720px), text block full width with 20px gutters at the bottom of the photo. The counter stacks, large paragraph at 24px. The second photo becomes 4:3. Navbar shows the wordmark and a `Menu` text button opening a full screen black panel with links in mincho 32px. A slim fixed bar at the bottom holds `Reserve a seat` as a ghost button, with safe area padding.
- **Desktop:** content max-width 1200px, section padding 140px, photographs full width.

## 9. Full copy

**Name:** Sumi Counter
**Nav:** Omakase, Lunch, Sourcing, Reserve. Button: `Reserve`

**Hero**
- Label: `OMAKASE IN STOCKBRIDGE`
- Heading: `Ten seats, one counter, the fish of the day.`
- Text: `Chef Daisuke Ono serves a nine course omakase twice each evening, piece by piece, across a single hinoki counter.`
- Button: `Reserve a seat`

**The counter**
- Large paragraph: `There is no menu to read at Sumi. You sit, the chef looks at what came in from the boats that morning, and the evening begins.`
- Text: `Daisuke trained for eleven years in Fukuoka and Tokyo before opening Sumi in 2023. The rice is seasoned with red vinegar and served at body temperature.`
- Text: `Please arrive on time. The first piece is served to everyone at once.`
- Facts: `10 seats at the counter` · `2 sittings each evening` · `Tuesday to Saturday`

**Omakase**
- Label: `THE EVENING COURSE` · Heading: `Omakase`
- 01 `Sakizuke` `A small opening plate, seasonal greens with sesame.`
- 02 `Owan` `Clear dashi broth with a piece of white fish.`
- 03 `Madai` `Sea bream nigiri with a brush of nikiri soy.`
- 04 `Hotate` `Hand dived Orkney scallop, a squeeze of sudachi.`
- 05 `Saba` `Mackerel cured with kombu for two days.`
- 06 `Akami` `Lean bluefin, marinated in soy for ten minutes.`
- 07 `Otoro` `The fattiest cut of the belly, lightly seared.`
- 08 `Temaki` `A hand roll passed from the chef's hand to yours.`
- 09 `Tamago` `Sweet layered omelette to finish.`
- Line: `£125 per guest · Sittings at 18:00 and 20:30 · Sake pairing £65`
- Link: `See the sake list`

**Hands at work**
- Caption: `Rice pressed by hand, served within seconds.`

**Lunch**
- Label: `FRIDAY AND SATURDAY, 12:30 TO 14:30` · Heading: `Lunch`
- `Chirashi bowl, chef's selection £32` · `Six piece nigiri set, miso soup £28` · `Salmon and ikura don £24` · `Negitoro hand roll £9` · `Black sesame ice cream £7`
- Note: `Walk in only. When the rice runs out, we close the counter.`

**Where the fish comes from**
- `Scrabster Seafoods` `CAITHNESS` `Day boat mackerel and sea bream, landed the night before.`
- `Orkney Hand Dived` `KIRKWALL` `Scallops collected by divers, never dredged.`
- `Loch Duart` `SUTHERLAND` `Salmon raised at low density in cold sea lochs.`
- `Toyosu, Tokyo` `JAPAN` `Bluefin and uni flown in twice a week from one trusted buyer.`

**Reserve**
- Heading: `Take a seat at the counter.`
- Text: `Bookings open on the first of each month for the month after.`
- Text: `We can adapt the course for pregnancy and shellfish allergies with three days notice.`
- Button: `Reserve a seat` · Link: `0131 555 0418`
- Address: `14 Raeburn Place, Stockbridge, Edinburgh EH4 1HN`

**Footer**
`SUMI` · `14 Raeburn Place, Edinburgh` · `Instagram`, `Email`

## 10. Never
Rice white text on vermilion, gradients, glow, neon, glassmorphism, rounded corners, shadowed cards, pill buttons, arrow circles, icon grids, cherry blossom or wave clip art, fake brush fonts, emoji, dashes of any kind in the copy, lorem ipsum, `100vh` heroes, a real embedded map, phrases like "culinary journey".

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
