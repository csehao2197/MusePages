# Run Out Records: Record Store Website Prompt

## 1. Goal
Build a loud, packed, genuinely dark website for **Run Out Records**, an independent vinyl shop on Stokes Croft in Bristol that sells new releases, used crates and reissues, and runs a listening bar at the back. Near black ground, off white type and the flat colours of old record labels: tangerine, mustard, cobalt and pink. Huge condensed capitals carry the page. It should feel like flicking through a crate under a bare bulb.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries, no audio player, no cart. Buy links go to Discogs.

## 3. Design system
```css
:root {
  --paper: #0D0D0D;          /* near black, main background */
  --ink: #F1ECE2;            /* off white */
  --surface: #1A1A1A;        /* crate panels */
  --muted: #A7A29A;          /* 7.6 to 1 on paper, 6.9 to 1 on surface */
  --line: rgba(241,236,226,0.18);
  --label-orange: #F06522;
  --label-yellow: #F4C13D;
  --label-blue: #5B86F2;
  --label-pink: #F29BB8;
  --on-label: #0D0D0D;
}
```
The four label colours are flat fills for blocks, discs and buttons. Text on any label colour is always `--on-label` black (all four clear 5.6 to 1). Every text colour, including muted captions and catalogue numbers, must reach at least 4.5 to 1 against the surface it sits on, and nothing is set under 14px. Corners are sharp everywhere: 0px radius on buttons, sleeves and panels. The only round things on the site are the record labels.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```
- **Display:** Anton 400, uppercase, clamp(72px, 15vw, 240px), line-height 0.84, letter-spacing -0.01em
- **Section headings:** Anton, uppercase, clamp(44px, 6vw, 96px), line-height 0.9
- **Body:** Archivo 400, 17px, line-height 1.55
- **Artist and title in lists:** Archivo 700, 18px
- **Catalogue numbers, prices, formats:** JetBrains Mono 400, 14px, uppercase, letter-spacing 0.04em

## 5. Buttons
Square and solid, like a price sticker:
- **Primary:** label orange fill, black text, 0 radius, Archivo 700 uppercase 15px, letter-spacing 0.08em, padding 16px 26px. Hover: fill swaps to mustard, no movement.
- **Secondary:** off white fill, black text, same shape. Hover: off white turns label pink.
- No pills, no outlines, no arrow icons, no rounded corners.

## 6. Sections

1. **Top strip:** a 40px mustard bar above the navbar with one mono line of black text: today's opening hours and the new stock day.
2. **Navbar:** black, 72px, 1px `--line` bottom border. `RUN OUT` in Anton left, links in Archivo 500, the secondary button `Shop on Discogs` right. Sticky, no blur.
3. **Hero, the poster:** type led, no photograph. `NEW IN` `USED` `REISSUED` stacked over three lines at full display size, filling the width, each line in off white. Between the second and third line, pushed to the right, sits the signature element: a round record centre label 220px across, in label orange, with a small black spindle hole, the shop name set around the top edge in mono and `33⅓ RPM STOKES CROFT` across the bottom. Under the stack, a single line of body text and the primary button. Clamp min-height 560px to 760px, never full viewport.
4. **In the racks this week:** surface panel. Section heading left, mono date right. A dense list of five records as rows separated by hairlines: square sleeve thumbnail 72px, artist and title, label and catalogue number in mono, format, condition for used copies, price. Hairlines turn a label colour on hover. *Sleeves: five square album covers generated as plain abstract or photographic artwork, no real band names or real artwork: a blurred neon tram at night; a hand drawn sun in red and black; a grainy black and white trumpet player; flat blue geometric shapes; a cracked desert road.*
5. **The crates:** black. Five genre crates shown as tall full width bars, each a label colour block with the genre in Anton 64px black on the left and the count of records in mono on the right. One bar is off white, so the rhythm is orange, mustard, cobalt, pink, off white. Hover pushes the text 12px right.
6. **Sleeve wall:** a tight grid of twelve square sleeves with 4px gaps, six across on desktop, no captions, no radius. One mono caption and a secondary button below. *Twelve invented square sleeves shot flat: jazz, soul, post punk, reggae, techno, folk.*
7. **Listening bar:** split. Left half a photograph cropped tight at 4:5. Right half heading, two sentences and four mono lines. *Photograph: the back room of a record shop at dusk, a long plywood counter with three turntables and headphones, a pint of pale ale, warm bulb light, crates on the floor.*
8. **We buy records:** a full width cobalt block, black text. Heading, one paragraph, three numbered steps in a row and the primary button.
9. **Visit:** surface. Address and hours left, a short travel paragraph right, one mono line under both.
10. **Footer:** three quiet lines in muted text: shop name and address, three links, the company line. No giant wordmark.

## 7. Motion
- Hero lines slide in from the left one after another, 0.5s each, 0.08s apart.
- The centre label turns slowly once on page load, a single 360 degree turn over 2.4s, then stops. It turns again only on hover. It never loops.
- Rack rows fade up with a 0.04s stagger.
- Respect `prefers-reduced-motion`: no rotation, no slides.

## 8. Responsive
- **Mobile under 768px:** hero lines at 72px, the label shrinks to 140px and sits under the stack, left aligned. Rack details wrap under the artist. Crate bars drop to 40px type. The sleeve wall goes three across. Listening bar stacks with the photo first. The navbar keeps `RUN OUT` and a `Menu` button opening a full screen black panel with Anton links at 48px.
- **Desktop:** max-width 1320px, hero and coloured blocks run full width. Section padding 88px, deliberately tighter than usual so the page feels packed.

## 9. Full copy

**Top strip:** `OPEN TODAY 11:00 TO 19:00 · NEW STOCK OUT EVERY THURSDAY AT NOON`
**Name:** Run Out Records
**Nav:** New In, Crates, Listening Bar, We Buy, Visit. Button: `Shop on Discogs`

**Hero**
- Stack: `NEW IN` `USED` `REISSUED`
- Label text: `RUN OUT RECORDS` around the top, `33⅓ RPM STOKES CROFT` along the bottom
- Line: `Eleven thousand records in a former bakery on Stokes Croft. Every used copy is cleaned, graded and played before it goes in the rack.`
- Button: `See what came in`

**In the racks this week** (date: `WEEK OF 3 NOVEMBER`)
- `Halcyon Tram` `Night Service` · `Low Road LRR014` · `LP` · `New` · `£24.99`
- `The Marigold Unit` `Sun Machine` · `Cassowary CAS7` · `12 inch` · `New` · `£13.50`
- `Ezra Fennimore Quartet` `Late Set at the Colston` · `Blue Kettle BK2201` · `LP` · `Used, VG+` · `£18.00`
- `Pale Heron` `Geometry for Beginners` · `Ferro 009` · `LP` · `Reissue` · `£27.00`
- `Dust Choir` `Interstate Hymns` · `Wireline WL33` · `2LP` · `Used, NM` · `£32.00`
- Link under list: `All new stock on Discogs`

**The crates**
- `SOUL AND FUNK` `1,840 records`
- `JAZZ` `1,210 records`
- `DUB AND REGGAE` `960 records`
- `TECHNO AND HOUSE` `2,300 records`
- `FOLK AND ODDITIES` `730 records`

**Sleeve wall**
- Caption: `A few from the used racks, priced and graded on the sticker.`
- Button: `Browse the used crates`

**Listening bar**
- Heading: `PLAY BEFORE YOU PAY`
- Text: `Three turntables at the back, all free. Pull anything from the racks, put it on, and only buy it if it earns its place on your shelf.`
- List: `Coffee from Little Victories £3` · `Two beers on tap from Left Handed Giant` · `One side per person when busy`

**We buy records**
- Heading: `WE BUY RECORDS`
- Text: `Single records or a whole loft. Cash, or twenty percent more in shop credit, and we collect anything over two hundred records.`
- Steps: `01` `Send us a photo of the spines and a rough count.` · `02` `We reply within two working days with a range.` · `03` `Bring them in or we collect, and you are paid on the spot.`
- Button: `Get a valuation`

**Visit**
- `Run Out Records, 96 Stokes Croft, Bristol BS1 3RJ`
- `0117 555 0148` · `crates@runoutrecords.co.uk`
- Hours: `Mon closed` · `Tue to Sat 11:00 to 19:00` · `Sun 12:00 to 17:00`
- Text: `Buses 72 and 75 stop outside. No parking on the Croft, use Cabot Circus.`
- Mono line: `STEP FREE ENTRANCE · CARD AND CASH`

**Footer**
`Run Out Records, 96 Stokes Croft, Bristol` · `Instagram`, `Discogs`, `Newsletter` · `Run Out Records Ltd, company no. 10928374`

## 10. Never
Rounded corners other than the record label, gradients, glow, neon, glassmorphism, an audio player, a cart, emoji, icon grids, off white text on a label colour, dashes of any kind in the copy, lorem ipsum, real band artwork, `100vh` heroes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
