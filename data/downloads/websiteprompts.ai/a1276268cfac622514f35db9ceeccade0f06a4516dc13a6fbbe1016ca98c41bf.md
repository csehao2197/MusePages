# Marginalia Books — Independent Bookstore Website Prompt

## 1. Goal Statement
Build a warm, opinionated independent bookshop website for **Marginalia Books**, defined by aged paper, ink navy, and a bookish serif — built around staff recommendations and events rather than pretending to compete with a warehouse on price.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(40, 30%, 94%);      /* #f3eee3 aged paper */
  --foreground: hsl(220, 30%, 16%);     /* #1c2435 ink navy */
  --primary: hsl(352, 46%, 38%);        /* #8e3244 cloth-bound red */
  --primary-foreground: hsl(40, 30%, 96%);
  --muted-foreground: hsl(220, 8%, 44%);
  --border: hsl(38, 16%, 84%);
  --card: hsl(40, 32%, 90%);
  --accent-ink: hsl(220, 30%, 16%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **H1:** Libre Baskerville 400, clamp(34px, 4.2vw, 58px), line-height 1.18
- **H2:** Libre Baskerville 400, 28–40px
- **H3 / book titles:** Libre Baskerville italic 400, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.8
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, cloth red
- **Prices / dates:** Inter 500, tabular-nums

## 5. Visual Effects

**Effect 1 — Staff pick cards with handwritten shelf-talker.** Each recommendation is a book cover beside a rotated card styled like a paper shelf-talker, with the staff member's name and a two-sentence note.

```jsx
<div className="relative flex gap-6">
  {/* Image: book cover standing upright on a wooden shelf, soft window light, shallow depth of field */}
  <img src="" alt="Staff pick book cover" className="h-56 w-36 object-cover object-center shadow-lg" />
  <div className="relative -rotate-1 self-start border border-[var(--border)] bg-white/70 p-5 shadow-sm">
    <p className="font-serif italic text-lg">Piranesi</p>
    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Picked by Rosa</p>
    <p className="mt-3 text-sm leading-relaxed">I have sold ninety copies of this and had one person come back unhappy. Those are good odds.</p>
  </div>
</div>
```

**Effect 2 — Section headings with a hand-drawn underline.** An inline SVG path with a slightly irregular stroke sits under each H2 and draws itself using `pathLength` from 0 to 1 over 0.9s on scroll entry.

## 6. Component Breakdown

1. **Navbar** — 76px, sticky, paper background, 1px bottom border. Serif wordmark left, links centre, search icon and `What's On` red outline button right.
2. **Hero** — 78vh, split. Text left, full-bleed shop interior right. Eyebrow, serif H1, subline, two CTAs. *Image: independent bookshop interior, floor-to-ceiling wooden shelves, warm lamp light, a reading chair, cosy and lived-in.*
3. **Opening strip** — thin band with today's hours, address, and a `We are a five-minute walk from the station` line.
4. **Staff picks** — the primary section. Four recommendation cards (Effect 1), each with a different staff member.
5. **Browse by section** — 2x4 grid of category tiles: fiction, non-fiction, poetry, children's, translated, secondhand, local interest, gifts.
6. **Events** — list of five upcoming events with a date block, title, author, ticket price, and a booking link.
7. **Book club** — split panel on `--card`: current title, meeting date, how to join, and the last six months of reads.
8. **Order from us** — three cards: reserve and collect, order anything in print, and a note on why buying here matters, with honest pricing language.
9. **Secondhand & rare** — a short section on what they buy, with a valuation enquiry CTA.
10. **Newsletter** — cloth red band, single field, `A short letter every second Thursday.`
11. **Footer** — ink navy, four columns, address, hours, socials, and an accessibility note.

## 7. Animations
- Hero: text fades up 0.75s; image reveals with a `clipPath` wipe from the right, 1.1s
- Hand-drawn underline: SVG `pathLength 0 → 1`, 0.9s, ease-out
- Staff pick cards: stagger `i * 0.1`, `y: 26 → 0`; shelf-talker rotates from `-3deg → -1deg` as it enters
- Category tiles: background darkens slightly and the label shifts 4px right on hover, 0.25s
- Event rows: fade in staggered 0.06s
- Newsletter band: colour fades in as the section enters view, 0.7s

## 8. Responsive
- **Mobile (<768px):** hamburger; hero image stacks above text; H1 clamps to 34px; staff picks become 1-col with the cover above the shelf-talker; categories 2-col; events stack with the date block inline above the title; book club stacks.
- **Tablet:** staff picks 2-col, categories 4-col, hero stays split.
- **Desktop:** max width 1160px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** MARGINALIA BOOKS · Est. 2011 · Sheffield

**Navbar:** Staff Picks · Browse · Events · Book Club · Order · Visit · [Button] What's On

**Hero**
- Eyebrow: `SHEFFIELD · INDEPENDENT SINCE 2011`
- H1: `We have read most of these. Ask us.`
- Subline: `A general bookshop with strong opinions, on Sharrow Vale Road. Around nine thousand titles, four booksellers, and a policy of never recommending something none of us has finished.`
- CTAs: `See This Month's Picks` · `What's On`

**Opening strip:** `Open today 9:30 – 18:00 · 142 Sharrow Vale Road · Five minutes from the station`

**Staff picks** — Eyebrow `THIS MONTH` — H2 `Four books we keep pressing on people`
1. **Piranesi** by Susanna Clarke — *Picked by Rosa* — I have sold ninety copies of this and had one person come back unhappy. Those are good odds.
2. **The Overstory** by Richard Powers — *Picked by Dev* — Six hundred pages about trees, which sounds like a threat and turns out to be the best novel I read last year.
3. **Small Things Like These** by Claire Keegan — *Picked by Marion* — A hundred and sixteen pages. You will read it in one sitting and think about it for a month.
4. **The Hare with Amber Eyes** by Edmund de Waal — *Picked by Rosa* — A family history told through two hundred and sixty-four tiny Japanese carvings. It should not work. It absolutely does.

**Browse** — `Fiction` · `Non-fiction` · `Poetry` · `Children's` · `Translated` · `Secondhand` · `Local Interest` · `Gifts & Cards`

**Events** — Eyebrow `WHAT'S ON` — H2 `Events at the shop`
- `12 SEP` **Claire Keegan in conversation** — 19:00 · £8, redeemable against the book
- `19 SEP` **Poetry open mic** — 19:30 · Free, sign up on the door
- `26 SEP` **Children's story hour** — 10:30 · Free, ages 3–7
- `03 OCT` **Translated fiction evening** — 19:00 · £6, wine included
- `10 OCT` **Local history talk: the Sheffield floods** — 18:30 · £5

**Book club** — H2 `Second Tuesday, upstairs, seven o'clock`
`Twelve to eighteen of us, no obligation to have finished it, and nobody is graded. Ten percent off the title if you buy it here.`
Currently reading: **Klara and the Sun** by Kazuo Ishiguro
Recently read: `Trust` · `Small Things Like These` · `Demon Copperhead` · `The Bee Sting` · `Orbital` · `Cold Enough for Snow`

**Order from us**
1. **Reserve and collect** — Tell us the title, we hold it behind the counter for a week. No payment upfront.
2. **We can order anything in print** — Usually here within two working days. Same price as it says on the cover.
3. **Why bother** — We are not cheaper than the warehouse and we will not pretend to be. What you get instead is four people who read, a shop that hosts fifty free events a year, and a high street with a bookshop on it.

**Secondhand & rare** — `We buy secondhand fiction, poetry, and local history in good condition. Bring a box in any weekday before four, or email photographs of the spines for larger collections.`

**Newsletter** — `A short letter every second Thursday.` — What we are reading, what is coming to the shop, and nothing else.

**Footer** — MARGINALIA BOOKS · `142 Sharrow Vale Road, Sheffield S11 8ZH` · `0114 555 0177` · Mon–Sat 9:30–18:00, Sun 11:00–16:00 · `Step-free access via the side door on Hickmott Road.` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
