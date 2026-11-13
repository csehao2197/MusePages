# Halden and Rowe: Real Estate Developer Website Prompt

## 1. Goal
Build an elegant, architectural website for **Halden and Rowe**, a boutique residential developer building small collections of homes on the Sussex coast. Dark charcoal background, warm off white text, a muted bronze accent, a refined display serif and a light geometric sans. Big architectural images, lots of space, very little decoration. It should feel considered and expensive without shouting.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no map library. The register interest form only shows a thank you message.

## 3. Design system
```css
:root {
  --paper: #141413;         /* charcoal, main background */
  --ink: #EDEAE4;           /* warm off white */
  --accent: #B8A27A;        /* bronze */
  --on-accent: #141413;
  --surface: #1E1D1B;
  --muted: #A39E95;
  --line: rgba(237,234,228,0.14);
}
```
One light section near the end (the approach) flips to a stone background #EDEAE4 with charcoal text for contrast. Every text colour must reach at least 4.5 to 1 against its background. No text under 14px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **Headings:** Marcellus 400, clamp(40px, 5.6vw, 92px), line-height 1.04, letter-spacing 0.005em
- **Body:** Jost 300, 18px, line-height 1.7
- **Labels and buttons:** Jost 500, 14px, uppercase, letter-spacing 0.22em
- **Figures:** Marcellus 400, 56px

## 5. Buttons
Thin and restrained:
- **Primary:** transparent rectangle, 1px bronze border, bronze uppercase letterspaced text, padding 16px 30px, 2px radius. Hover: fills bronze, text turns charcoal, 0.3s.
- **Text link:** uppercase letterspaced with a 32px thin line before the text that extends to 48px on hover.
- No solid buttons anywhere else, no pills, no icons in buttons.

## 6. Sections

1. **Navbar:** transparent over the hero, 88px. Logo `HALDEN & ROWE` in Marcellus letterspaced left, links right, primary button `Register interest`. After scrolling the bar turns charcoal with a thin line beneath.
2. **Hero:** full width image with a gradient overlay from charcoal at the bottom left (90%) to transparent at the top right. Text block bottom left inside its own padding: label, heading, one sentence, primary button and text link. Min height `clamp(620px, 88vh, 940px)`. *Photograph: a contemporary coastal house with timber cladding and large glass walls at dusk, warm interior light, dune grasses in the foreground.*
3. **Intro:** a single large paragraph in Marcellus at 34px, max 22 words per line, centred with lots of space around it.
4. **Current developments:** three large cards in a column, each a full width row: image on one side (alternating left and right), on the other side the label with status, name, location, a short description, a line of facts (homes, bedrooms, price from) and a text link. *Photographs: a terrace of four modern brick townhouses beside a harbour; a single storey courtyard house among pine trees; a converted Victorian school building with new glass extensions.*
5. **Numbers:** a row of three figures in Marcellus with bronze thin rules above them: homes completed, years, awards. Short caption under each.
6. **Our approach:** the stone light section. Two columns: a tall image left, on the right a heading and three short principles with Roman numerals in bronze (I, II, III). *Photograph: an architect's model of a small housing scheme in pale wood, on a table with drawings.*
7. **Completed:** charcoal. A simple list of five completed schemes as rows: name, town, year, number of homes, with a thin line between. Each row reveals a small image on hover that follows the cursor (desktop only).
8. **Register interest:** surface. Heading and a sentence on the left; on the right a form with underline only inputs: name, email, phone, a select for the development, and the primary button. After submit: `Thank you. Our sales team will be in touch within one working day.`
9. **Footer:** charcoal. Logo, office address, two contact lines, links, and a short legal line.

## 7. Motion
Slow and confident.
- Hero image starts at scale 1.06 and settles to 1 over 2.4s. Heading fades up 24px.
- Development rows: image reveals with a clip path from bottom to top, 1.1s, text fades in after it.
- Numbers count up once.
- Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero text block full width at the bottom, heading 40px. Development rows stack with the image first. Numbers stack. Approach section stacks. Completed list rows show name and year only, no hover images. Navbar collapses to logo and a `Menu` text button opening a full screen charcoal menu with large Marcellus links.
- **Desktop:** max-width 1320px, section padding 140px.

## 9. Full copy

**Logo:** HALDEN & ROWE
**Nav:** Developments, Approach, Completed, Contact. Button: `Register interest`

**Hero**
- Label: `RESIDENTIAL DEVELOPMENT, SUSSEX COAST`
- Heading: `Fewer homes, built better.`
- Text: `Small collections of architect designed homes in places people actually want to live.`
- Button: `Register interest` · Link: `View developments`

**Intro**
`We build between four and twenty homes at a time, with the same architects, the same builders and the same obsession with light, materials and how a street feels in ten years.`

**Current developments**
1. Label `SELLING NOW` · `Harbour Row` · `Shoreham-by-Sea` · `Four brick townhouses on the edge of the harbour, each with a roof terrace looking over the boats.` · Facts: `4 homes · 3 bedrooms · from £785,000` · Link `View Harbour Row`
2. Label `COMING SPRING 2027` · `The Pines` · `West Wittering` · `Six single storey courtyard houses set among existing pine trees, five minutes on foot from the beach.` · Facts: `6 homes · 2 to 4 bedrooms · from £950,000` · Link `Register for The Pines`
3. Label `IN PLANNING` · `The Old School` · `Lewes` · `A Victorian school turned into twelve apartments, with new glass wings in the old playground.` · Facts: `12 homes · 1 to 3 bedrooms · prices to be announced` · Link `Follow The Old School`

**Numbers**
- `118` homes completed since 2011
- `15` years building on the Sussex coast
- `6` RIBA and Sussex Heritage awards

**Our approach**
- Heading: `How we build`
- `I. Small on purpose.` `We never build more than twenty homes in one place. It keeps the scale human and the quality high.`
- `II. Materials that age well.` `Brick, timber, lime and flint. Things that look better in twenty years, not worse.`
- `III. The same team every time.` `One architect practice and two builders we have worked with for over a decade.`

**Completed**
- `Saltings` · Bosham · 2025 · 8 homes
- `Chapel Yard` · Arundel · 2023 · 14 homes
- `The Ropewalk` · Rye · 2021 · 10 homes
- `Downs View` · Ditchling · 2019 · 6 homes
- `Marine Terrace` · Hove · 2016 · 18 homes

**Register interest**
- Heading: `Be the first to know.`
- Text: `Register for early access to plans, prices and private viewings before homes go on general sale.`
- Fields: `Name`, `Email`, `Phone`, `Development` (options: Harbour Row, The Pines, The Old School, Any future development)
- Button: `Register interest`

**Footer**
`HALDEN & ROWE` · `14 Pavilion Parade, Brighton BN2 1RA` · `sales@haldenrowe.co.uk` · `01273 555 0148` · Links `Instagram`, `LinkedIn`, `Privacy` · `Halden and Rowe Developments Ltd. Registered in England 07654321.`

## 10. Never
Bright colours, gradients other than the hero overlay, glow, glassmorphism, emoji, icon grids, stock phrases like "luxury living redefined", dashes of any kind in the copy, lorem ipsum, a real embedded map.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
