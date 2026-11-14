# Wrenbury House: Care Home Website Prompt

## 1. Goal
Build a calm, honest website for **Wrenbury House**, a 32 bed residential care home in Shropshire. Warm cream paper, soft black ink, one olive gold accent, a quiet serif, and one signature: a window where the light moves from morning to evening as you scroll. The visitor is usually an adult daughter at eleven at night, worried and tired. Everything on the page should make the next step smaller.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking system, no virtual tour embed. Actions are a phone link and an email link. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F6F2EA;
  --ink: #23201B;
  --accent: #7A6A3E;           /* olive gold */
  --on-accent: #FFFFFF;
  --surface: #EAE4D7;
  --muted: #5F5A4E;
  --line: rgba(35,32,27,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Structure from hairlines, never from shadowed cards.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page. This audience is older and reading on a phone in a hurry.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,600&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Source Serif 4 300, clamp(40px, 5.2vw, 76px), line-height 1.06, letter-spacing -0.015em
- **Body:** Inter 300, 17px, line-height 1.7. Slightly larger than usual, on purpose.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Room counts, fees, inspection ratings, index labels.
- At most one italic word per headline, in olive gold.

## 5. Signature element
**A window, through one day.** A simple drawn window frame, four panes, in a 1.5px ink stroke. Behind it a soft wash of colour shifts as the section scrolls: cool blue at the top of the section, warm cream in the middle, low amber at the bottom. A small monospaced label changes with it: `07:00`, `13:00`, `19:00`.

It is a colour transition tied to scroll progress, nothing more. No sun sprite, no clouds, no animation loop.

## 6. Sections, each a different skeleton

1. **Navbar**: 74px, cream, one hairline beneath. Wordmark left, four links right, olive pill with a round arrow circle, and a mono line with the phone number.
2. **Hero, statement**: one long serif sentence starting at one third, mono label `000/ Wrenbury House` in the left column, a short paragraph, two actions and three mono facts. No photograph. Min height `clamp(500px, 72vh, 740px)`.
3. **A day here**: surface. The window (section 5) with three short lines of copy beside it describing morning, afternoon and evening.
4. **What we provide, Swiss list**: light. Label `001/ Care`, four stacked care types from one third, each with two lines and a mono note about who it suits.
5. **The rooms, ruled table**: light. Four rows: room type, size, what is in it, weekly fee from. Figures in mono, right aligned.
6. **The people**: dark ink ground, inset 16px, `--panel-radius`. Three portraits in paper colour with names, years at Wrenbury and one line each. *Photographs: a manager in her fifties, a senior carer, a cook, all in a plain warm interior, natural light, no uniforms styled for camera.*
7. **Visiting and questions, index**: light. Two ruled columns. Left: what visiting is actually like, no appointment needed, no set hours. Right: the four questions families ask first, answered in one line each.
8. **The house, loose grid**: light. Five photographs at varied sizes with mono captions. *Photographs: a bedroom with a resident's own furniture, the garden room, the dining room laid for lunch, the garden, the front of a red brick Victorian house.*
9. **One quote**: surface. A single centred quote in Source Serif at 30px with a signature line in mono.
10. **Come and see it, accent panel**: olive ground, inset panel. One line, the phone number set large, a mono note that you can turn up unannounced.
11. **Footer**: dark ink. Giant cropped `WRENBURY HOUSE` wordmark, address, CQC rating line, three small links.

## 7. Motion
- Hero sentence fades up 16px once.
- Window light shifts with scroll progress, as described.
- Portraits settle from `scale 1.02` with 0.08s stagger.
- Grid images settle from `scale 1.03`, lift 4px on hover.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by holding the window at its midday state.

## 8. Responsive
- **Mobile under 768px:** hero at 36px from the left margin. The window scales to 260px and keeps its three labels. Fee table becomes stacked rows with the fee on the same line as the room type. Portraits stack. An olive call bar fixes to the bottom of the screen, respecting the safe area inset. No horizontal page scroll.
- **Tablet:** grid two columns.
- **Desktop:** content max-width 1160px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** WRENBURY HOUSE. Meta: `RESIDENTIAL AND DEMENTIA CARE. 32 ROOMS. SHROPSHIRE.`

**Nav:** Care, Rooms, Visiting, About. Button: `Arrange a visit`. Mono: `01743 555 0119`

**Hero** (label `000/ Wrenbury House`)
- Sentence: `A small home where the staff have been here longer than *most* of the residents.`
- Paragraph: `Thirty two rooms in a Victorian house outside Shrewsbury. Residential and dementia care, run by the same family since 2004. You are welcome to turn up and look round without ringing first.`
- Actions: `Arrange a visit`, `See the rooms`
- Facts: `32 ROOMS` · `CQC GOOD, MARCH 2026` · `STAFF TURNOVER 9 %`

**A day here** (label `001/ A day`)
- `07:00` **Morning.** `Breakfast when you wake up, not when the trolley arrives. Some people are up at six, some at ten.`
- `13:00` **Afternoon.** `Lunch in the dining room or your own room. The garden is open and the gate is not locked.`
- `19:00` **Evening.** `Supper, then whatever you like. The lounge television goes off at nine unless somebody is watching it.`

**What we provide** (label `002/ Care`)
- **Residential care.** `Help with washing, dressing and medication, in your own room with your own things.` `SUITS: NO LONGER SAFE AT HOME ALONE`
- **Dementia care.** `A separate wing of ten rooms, staffed day and night, laid out so nobody gets lost.` `SUITS: WANDERING, DISORIENTATION`
- **Respite.** `One to four weeks, same room and same care, so a carer at home can have a break.` `SUITS: A FAMILY CARER WHO IS EXHAUSTED`
- **End of life care.** `We work with the district nurses so nobody has to move at the end.` `SUITS: STAYING PUT`

**The rooms** (label `003/ Rooms`)
| Room | Size | Includes | From |
|---|---|---|---|
| Standard single | 14 sq m | Bed, wardrobe, basin, call point | 1,150 GBP a week |
| Large single | 18 sq m | As above with an armchair and a view of the garden | 1,290 GBP a week |
| En suite single | 18 sq m | As above with a wet room | 1,380 GBP a week |
| Garden room | 22 sq m | Ground floor, double doors onto the lawn | 1,450 GBP a week |
Note: `Fees include everything except hairdressing and chiropody. Bring your own furniture if you want to, most people do.`

**The people** (label `004/ Staff`)
- **Alison Wren.** `Manager, 21 years. Her mother was a resident here before she ran it.`
- **Marta Kowalczyk.** `Senior carer, 12 years. Runs the dementia wing and the handover that keeps it steady.`
- **Ray Collins.** `Cook, 9 years. Knows who hates fish and who wants two puddings.`

**Visiting and questions** (label `005/ Visiting`)
- Visiting: `No appointment needed`, `No set hours, including evenings`, `Children and dogs welcome`, `You can eat with your relative, tell the kitchen that morning`
- Asked first: `Can I bring my own bed? Yes.` · `Will the same carer come each day? Mostly, we roster for that.` · `What happens if the money runs out? We talk to the council with you, and nobody is asked to leave.` · `Can I see the inspection report? It is linked in the footer.`

**The house** (label `006/ The house`)
A room with its own furniture · The garden room · Lunch, laid at half twelve · The garden in May · The front of the house

**Quote:** `I rang four homes that week. This was the only one that said come today and see it rather than booking me in for a tour.`
Signature: `Helen, daughter of a resident`

**Come and see it panel**
- Line: `Come without ringing first. If we are not ready for you, that tells you something too.`
- Phone set large: `01743 555 0119`
- Mono: `SOMEBODY ANSWERS THIS NUMBER 24 HOURS A DAY.`

**Footer**
`WRENBURY HOUSE`, `Wrenbury Lane, Bicton, Shrewsbury SY3 8EN`, `hello@wrenburyhouse.co.uk`
Mono: `Registered with the Care Quality Commission, provider 1-2049183. Rated Good, March 2026.`
Links: `Care`, `Rooms`, `Inspection report`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, stock photographs of hands being held, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
