# Mara Lindqvist: Author Website Prompt

## 1. Goal
Build a quiet, bookish website for **Mara Lindqvist**, a novelist with three published books and a fourth on the way. Warm cream paper, near black ink, one oxblood accent, a classic book serif. It should feel like the inside cover of a good hardback: calm, generous margins, nothing flashy. The book covers are the colour on the page.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page with anchor links. No component libraries, no carousel library, no CMS.

## 3. Design system
```css
:root {
  --paper: #F7F3EA;
  --ink: #1F1B16;
  --accent: #7A2E2A;        /* oxblood */
  --on-accent: #FFFFFF;
  --surface: #EDE6D8;
  --muted: #5C554B;
  --line: rgba(31,27,22,0.14);
}
```
Every text colour must reach at least 4.5 to 1 against the surface it sits on. No text smaller than 14px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Karla:wght@400;500&display=swap" rel="stylesheet" />
```
- **Headings:** Libre Caslon Text 400, clamp(38px, 5vw, 72px), line-height 1.08, letter-spacing -0.01em. Italic is allowed for one word per heading.
- **Body:** Karla 400, 18px, line-height 1.7, max 62 characters per line.
- **Labels:** Karla 500, 14px, uppercase, letter-spacing 0.12em.

## 5. Buttons and links
This site has almost no buttons. Links are the main action style:
- **Text link:** Karla 500, ink colour, 1px underline offset 4px, underline turns oxblood on hover.
- **One real button,** used only for buying a book: a rectangle with square corners, 1.5px ink border, transparent fill, padding 14px 26px, label in Karla 500. On hover it fills with ink and the text turns paper colour.
- No pills, no arrow circles, no icons inside buttons.

## 6. Sections

1. **Navbar:** centred. Her name in Libre Caslon at 26px on the first line, four links in small caps Karla beneath it, a thin rule under the whole bar. On scroll the bar compresses to a single line with the name left and links right.
2. **Hero, the new book:** two columns. Left: label `NEW NOVEL, MARCH 2027`, the title as the main heading, a two sentence pitch, and two links: the buy button and a text link `Read the first chapter`. Right: the book cover standing on a surface coloured panel with generous padding, slightly rotated by 2 degrees. *Book cover: a literary hardback cover in deep teal with a single white heron silhouette and the title in an elegant serif.*
3. **Praise:** three short quotes set in italic Libre Caslon at 24px, each followed by the source in small caps. Separated by thin rules, not cards.
4. **Books:** the three earlier novels as a vertical list. Each row: cover on the left at 180px wide, title, year, a three line description and a text link `Buy` with the shop names after it. Rows separated by a rule.
5. **About:** surface coloured section. A portrait photo on the left at 4:5, three paragraphs of biography on the right, and a small line `Represented by` with the agency name. *Portrait: a woman in her forties with short grey hair, in a wool jumper, natural window light, seated by a bookshelf, calm expression.*
6. **Events:** a simple table style list of five upcoming readings: date, city, venue and a text link `Tickets`. Past events are not shown.
7. **Newsletter:** a centred block on paper. One heading, one sentence promising one letter a season, an email field with a single underline instead of a box, and a submit link styled as the buy button.
8. **Footer:** two lines. Left: name and copyright. Right: links to agent, press kit and Instagram. No giant wordmark.

## 7. Motion
Gentle and rare. Headings and covers fade in 12px upward once when they enter the viewport, 0.6s, ease out. The hero cover settles from 4 degrees to 2 degrees on load. Nothing loops. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero becomes one column with the cover first at 70% width, centred. Book rows stack: cover above text. Events become stacked blocks. Navbar shows the name and a `Menu` text button opening a full width list.
- **Desktop:** content max-width 1080px, section padding 120px vertical.

## 9. Full copy

**Name:** Mara Lindqvist
**Nav:** Books, About, Events, Newsletter

**Hero**
- Label: `NEW NOVEL, MARCH 2027`
- Title: `The Heron Year`
- Pitch: `A ferry captain on the Firth of Forth keeps a logbook of every bird she sees for one year after her brother disappears. The entries start to answer back.`
- Button: `Pre-order the book`
- Link: `Read the first chapter`

**Praise**
- `Quiet, strange and completely gripping. I missed my stop twice.` The Scotsman
- `Lindqvist writes water better than anyone working today.` Books of the Month, BBC Radio 4
- `A ghost story with no ghost in it. Superb.` The Observer

**Books**
- *Salt Ledger* (2025). `Two sisters inherit a failing smokehouse and a debt nobody will explain. Shortlisted for the Saltire Fiction Award.` Buy from: Waterstones, Bookshop.org, your local shop.
- *Low Tide Hours* (2022). `A night porter at a seaside hotel starts finding letters addressed to guests who checked out forty years ago.` Buy from: Waterstones, Bookshop.org, your local shop.
- *The Orchard Accounts* (2019). `A debut about a family orchard, one bad harvest and the summer everyone stopped talking.` Buy from: Waterstones, Bookshop.org, your local shop.

**About**
`Mara Lindqvist grew up in Leith, worked for eleven years as a ferry deckhand and wrote her first novel on night shifts. She now lives in Edinburgh with a partner, a lurcher and far too many tide tables.`
`Her books have been translated into nine languages. Salt Ledger was shortlisted for the Saltire Fiction Award and adapted for BBC Radio 4.`
`She teaches a summer fiction workshop in Orkney every June and answers every letter, eventually.`
Line: `Represented by Hollis and Kerr Literary Agency.`

**Events**
- 14 March 2027, Edinburgh, Topping and Company, launch reading
- 22 March 2027, Glasgow, Waterstones Sauchiehall Street
- 3 April 2027, London, Daunt Books Marylebone
- 18 April 2027, Bath, Mr B's Emporium
- 9 May 2027, Hay-on-Wye, Hay Festival
Each with link `Tickets`.

**Newsletter**
- Heading: `One letter a season.`
- Text: `Four times a year: what I am writing, what I am reading and where I will be. Nothing else, and never sold on.`
- Field placeholder: `Your email`
- Button: `Subscribe`

**Footer**
`Mara Lindqvist, 2027` and links `Agent`, `Press kit`, `Instagram`.

## 10. Never
Gradients, glow, drop shadows on cards, icon grids, emoji, carousels, pill buttons, giant cropped wordmarks, stock phrases like "bestselling sensation", dashes of any kind in the copy, lorem ipsum, `100vh` heroes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
