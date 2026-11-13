# Margin: Virtual Assistant Website Prompt

## 1. Goal
Build a calm, precise website for **Margin**, a virtual assistant working with founders of small companies. Warm paper, ink black, one ink-blue accent, a quiet serif and a week grid that fills in to show how many hours a client gets back. It should feel like a well kept notebook, not an agency pitch.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no booking system, no calculator. `lucide-react` only for the arrow glyph in buttons.

## 3. Design system
```css
:root {
  --paper: #F3F1EC;
  --ink: #1A1A18;
  --accent: #2F4B7C;          /* ink blue, the only accent */
  --on-accent: #F3F1EC;
  --surface: #E9E6DF;
  --muted: #6E6B64;
  --line: rgba(26,26,24,0.15);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines and tints instead of boxes and shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Fraunces 300, opsz 144, clamp(44px, 6vw, 92px), line-height 1.0, letter-spacing -0.02em
- **Body:** Inter 300, 16px, line-height 1.6
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Only hours, prices, days and index labels.
- At most one italic word per headline, in the accent colour.

## 5. Signature element
**A week that fills in.** A grid of five columns (Monday to Friday) and ten rows (one per working hour), drawn only with hairlines. When the section enters view, the cells that Margin takes over fill with the accent colour at 18 per cent opacity, one by one, 60ms apart, from Monday morning onward. A mono caption counts them up as they fill and settles on the total.

Flat tint, no glow, no icons in the cells. It shows the offer without a single adjective.

## 6. Sections, each a different skeleton

1. **Navbar**: 72px, paper, one hairline beneath. Wordmark left, three links right, an accent pill with a round arrow circle.
2. **Hero, statement**: no photograph. One long serif sentence starting at one third of the width, mono label `000/ Margin` in the left column, then a short paragraph and two actions. Min height `clamp(480px, 70vh, 700px)`.
3. **The week**: surface. The signature grid (section 5) with a mono caption.
4. **What I take on, Swiss list**: light. Label column `001/ The work`, four stacked names from one third, each with a one line description and a mono note about how it is handed over.
5. **How it runs, numbered rows**: light. Four rows on hairlines with mono markers: first week, every morning, every Friday, every quarter.
6. **Who this suits, index**: surface. Two ruled columns: suits and does not suit. Honest and short.
7. **Portrait and letter**: dark ink ground, inset 16px, `--panel-radius`. A square portrait left, three short paragraphs right in paper colour, signed in italic. *Photograph: a person at a tidy desk beside a window with a paper notebook open, daylight, calm.*
8. **Rates, hairline rows**: light. Three rows: hours a month, what it covers, price. Prices right aligned in mono.
9. **One quote**: light. A single centred quote in Fraunces at 32px with a signature line in mono.
10. **Start, accent panel**: ink blue ground, inset panel. One line, two actions and a mono note about the trial fortnight.
11. **Footer**: dark ink. Giant cropped `MARGIN` wordmark, email, working hours, three small links.

## 7. Motion
- Hero sentence fades up 16px once, 0.9s.
- Week grid fills as described, once.
- Rows fade in with 0.05s stagger.
- Hover: arrow circles slide 4px, links underline from the left.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** hero sentence at 40px, aligned to the left margin. The week grid turns to five rows and ten columns with the caption beneath. Index columns stack. Portrait sits above the letter. No horizontal page scroll.
- **Tablet:** grid unchanged, index two columns.
- **Desktop:** content max-width 1200px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** MARGIN. Meta: `ONE ASSISTANT. SIX CLIENTS. NO AGENCY.`

**Nav:** The work, Rates, About. Button: `Book a call`

**Hero** (label `000/ Margin`)
- Sentence: `I give founders back the *eleven* hours a week they spend on things nobody hired them to do.`
- Paragraph: `I am Ilona. I work with six companies at a time, mostly founders of five to twenty people, and I do the admin that quietly eats their week. Inbox, diary, invoices, travel, suppliers.`
- Actions: `Book a call`, `See what I take on`

**The week**: caption: `A typical client week. Filled cells are mine. Eleven hours, every week, from the second Monday.`

**What I take on** (label `001/ The work`)
- **Inbox and diary.** `I read everything, answer what I can, and leave you a list of six things that actually need you.` `HANDOVER: SHARED INBOX AND CALENDAR`
- **Invoices and chasing.** `Raised on time, chased politely, reconciled before your accountant asks.` `HANDOVER: ACCOUNTING LOGIN, READ AND WRITE`
- **Travel and logistics.** `Flights, hotels, visas, the taxi that actually turns up. Itinerary in your calendar by the evening before.` `HANDOVER: CARD ON FILE`
- **Suppliers and renewals.** `Contracts, quotes, the software subscriptions nobody remembers signing up for.` `HANDOVER: A SHARED FOLDER`

**How it runs** (label `002/ Rhythm`)
- `WEEK ONE` **We map it.** `Two calls and a shared document. I write down how you like things done, so you only say it once.`
- `EVERY MORNING` **One message.** `What I handled, what needs you, what is coming. Before nine.`
- `EVERY FRIDAY` **A short note.** `What took the most time, and one suggestion for removing it permanently.`
- `EVERY QUARTER` **We cut something.** `We find one recurring task and delete it rather than doing it faster.`

**Who this suits** (label `003/ Honest`)
- Suits: `Founders of five to twenty people`, `Anyone who answers email at eleven at night`, `Companies with one person doing three jobs`, `People who can hand over a password without flinching`
- Does not suit: `Teams who need someone in the office`, `Work that needs a phone answered live all day`, `Anyone wanting a bookkeeper, I work with yours`, `Projects with no decision maker`

**Portrait and letter**
`I spent nine years as an executive assistant in two law firms and one very chaotic agency. The chaos taught me more.`
`I work with six clients because that is the number where I still know what is happening in each of them. When someone leaves, I take one more. I do not have a team and I am not building one.`
`Everything I do is written down in your own shared document, so if I am ill or on holiday, someone else could pick it up and you would barely notice.`
Signature: *Ilona Reyes*

**Rates** (label `004/ Rates`)
- `20 hours a month` ... `Inbox, diary and invoices` ... `640 GBP`
- `40 hours a month` ... `The above plus travel, suppliers and renewals` ... `1,180 GBP`
- `Project, one off` ... `A move, a launch, a funding round` ... `42 GBP an hour`
Mono: `No setup fee. One month notice, both ways.`

**Quote:** `I stopped opening my laptop after dinner. That is the whole review.`
Signature: `Marek D, founder of an eleven person studio`

**Start panel**
- Line: `The first fortnight is free, both ways.`
- Actions: `Book a call`, `Email me first`
- Mono: `IF IT IS NOT WORKING AFTER TWO WEEKS, WE SHAKE HANDS AND STOP.`

**Footer**
`MARGIN`, `ilona@margin.work`, `Monday to Friday, 8:00 to 16:00 UK time`, links `The work`, `Rates`, `Privacy`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
