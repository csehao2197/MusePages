# The Bindery: Coworking Space Website Prompt

## 1. Goal
Build a calm, architectural website for **The Bindery**, a coworking space in a former bookbinding works in Leeds. Near white paper, near black ink, one slate blue accent, a clean grotesk, and one signature: a floor plan where the desks fill up through the working day. Sell the room and the quiet, not the beanbags.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking engine, no live occupancy API. The floor plan is a grid of small divs. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F7F6F3;
  --ink: #17181A;
  --accent: #3B5BA5;           /* slate blue */
  --on-accent: #FFFFFF;
  --surface: #EAE8E3;
  --muted: #5E605F;
  --line: rgba(23,24,26,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, surface, light, dark, light, accent, dark footer. Hairlines instead of cards, no shadows.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Schibsted Grotesk 700, clamp(42px, 5.6vw, 82px), line-height 1.0, letter-spacing -0.035em
- **Body:** Inter 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Desk counts, prices, opening times, index labels.
- No italics. Emphasis is a whole line in slate blue.

## 5. Signature element
**The floor fills up.** A plan of the main room drawn in hairlines: the walls, the two meeting rooms, the kitchen, and forty two small squares for the desks. As the section scrolls into view, desks fill with slate blue one by one in a staggered sequence over 2 seconds while a monospaced clock runs from 08:00 to 11:00 beside it and settles. It stops at thirty one of forty two filled.

It fills once. No live data, no hover tooltips, no numbers counting on a loop.

## 6. Sections, each a different skeleton

1. **Navbar**: 70px, paper, one hairline beneath. Wordmark left, four links right, slate pill with a round arrow circle, and a mono line with the desks free today.
2. **Hero, passepartout**: a photograph of the main room framed in a wide mat, headline above, one sentence and two actions below. Min height `clamp(540px, 76vh, 820px)`. *Photograph: a long room with cast iron columns, north facing windows, plain oak desks, two people working, nobody looking at the camera.*
3. **The floor**: surface. The signature element (section 5) with a mono caption about the quietest hours.
4. **What you get, Swiss list**: light. Label `001/ Memberships`, four stacked membership names from one third, each with two lines and a mono price.
5. **The building**: light. One long paragraph at 22px from one third with the label `002/ The building`, about the bindery, the floor, the columns and the light.
6. **House rules, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Four rows in paper colour: calls, music, the long table, guests. Written as plain agreements, not as a list of prohibitions.
7. **Meeting rooms, ruled table**: light. Three rows: room, seats, kit, hourly rate for members and non members. Figures in mono, right aligned.
8. **Who works here, index**: light. Two ruled columns: the trades represented, and the three things members most often ask each other for. A quiet way of selling the network without saying the word community.
9. **The space, loose grid**: light. Five photographs at varied sizes with mono captions. *Photographs: the long room from the far end, a meeting room with a glass partition, the kitchen, a phone booth, the entrance from the street.*
10. **One quote**: surface. A single centred quote in Schibsted Grotesk at 28px with a signature line in mono.
11. **Come and work a day, accent panel**: slate ground, inset panel. One line, two actions, a mono note about the free trial day.
12. **Footer**: dark ink. Giant cropped `THE BINDERY` wordmark, address, opening hours, three small links.

## 7. Motion
- Headline fades up 18px once, framed photograph settles from `scale 1.03`.
- Desks fill once with a 0.04s stagger, clock runs with them.
- Table rows fade in with 0.04s stagger.
- Grid images settle from `scale 1.03`, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the plan already filled and the clock at 11:00.

## 8. Responsive
- **Mobile under 768px:** passepartout mat narrows to 16px, headline at 38px. The floor plan scales to fit the width and keeps the clock beneath it rather than beside it. Meeting room table becomes stacked rows. Grid one column. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1200px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** THE BINDERY. Meta: `COWORKING IN A FORMER BOOKBINDING WORKS. LEEDS.`

**Nav:** Memberships, Rooms, The building, Visit. Button: `Book a day`. Mono: `11 DESKS FREE TODAY`

**Hero**
- Headline: `A quiet room with good light and forty two desks.`
- Sentence: `No phone booths disguised as pods, no table football, no scented candles. A long Victorian workshop floor, decent chairs and a kitchen that gets cleaned.`
- Actions: `Book a day`, `See memberships`

**Floor caption:** `A normal Tuesday. Thirty one of forty two by eleven, and it rarely goes past thirty six. The quietest hours are before half nine and after four.`

**What you get** (label `001/ Memberships`)
- **Day pass.** `Any free desk, from eight until seven. Includes the kitchen and the wifi, obviously.` `28 GBP A DAY`
- **Part time.** `Eight days a month, used whenever you like, rolling over for one month only.` `180 GBP A MONTH`
- **Full time.** `Any free desk, every day, with a locker and a postal address.` `295 GBP A MONTH`
- **Fixed desk.** `The same desk, your own monitor and drawers, keys to the building.` `395 GBP A MONTH`

**The building** (label `002/ The building`)
`The Bindery was a bookbinding works from 1891 until 1987, and the floor still has the bolt holes where the sewing frames stood. The windows face north, which is why the bookbinders chose it and why the light is even all day with no glare on a screen. We have added heating, wiring and better chairs. We have not added a mezzanine, a slide, or a wall with a neon sign about hustling.`

**House rules** (label `003/ How it works`)
- **01 Calls.** `Take them in a booth or the kitchen, not at your desk. There are four booths and they are never all busy.`
- **02 Music.** `Headphones. The room is one long space and it carries further than you think.`
- **03 The long table.** `The twelve seats by the window are for quiet work only. If you need to talk, the other end of the room is for talking.`
- **04 Guests.** `Bring one, free, for a day. Tell us first so the kitchen is not caught short at lunch.`

**Meeting rooms** (label `004/ Rooms`)
| Room | Seats | Kit | Members / others |
|---|---|---|---|
| The Press | 8 | Screen, whiteboard wall, a window | 18 / 32 GBP an hour |
| The Folio | 4 | Screen, round table | 12 / 22 GBP an hour |
| Booths, four of them | 1 | Power, a shelf, a door that shuts | Free / not available |
Note: `Members get two free hours of meeting room time a month. We do not roll it over and we do not make you ask.`

**Who works here** (label `005/ The floor`)
- Trades: `Developers and designers, about half`, `Two accountants and a bookkeeper`, `Three therapists who use The Folio`, `A translator`, `Two people who will not say what they do`
- Most asked for: `Somebody to look at a contract` · `A second opinion on a price` · `Help carrying something up the stairs`

**The space** (label `006/ The space`)
The long room from the north end · The Press · The kitchen at half twelve · A booth · The door on Mabgate

**Quote:** `I moved here from a place with a ping pong table and a juice bar. This has better chairs, better light and nobody has ever tried to organise a social.`
Signature: `Priya Raval, freelance developer`

**Come and work a day panel**
- Line: `Work a full day free before you decide. No tour, no pitch, just take a desk.`
- Actions: `Book a day`, `Ask about a fixed desk`
- Mono: `MONDAY TO FRIDAY 08:00 TO 19:00. FIXED DESK MEMBERS HAVE A KEY.`

**Footer**
`THE BINDERY`, `44 Mabgate, Leeds LS9 7DZ`, `hello@thebindery.works`
Mono: `Monday to Friday 08:00 to 19:00. Closed weekends except for fixed desk members.`
Links: `Memberships`, `Rooms`, `Visit`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, the word community, stock photographs of people high fiving, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
