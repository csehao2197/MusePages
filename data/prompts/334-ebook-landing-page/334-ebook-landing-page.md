# The Quiet Portfolio — Ebook Landing Page Website Prompt

## 1. Goal Statement
Build a focused, bookish landing page for **The Quiet Portfolio**, a self-published ebook for freelance designers — cream paper, ink black, one oxblood accent, a single narrow column, and a 3D book cover built in CSS that turns slightly as the page loads.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries, no checkout, no email capture backend. The buy button is a link.

## 3. Design System — Colors
```css
:root {
  --background: hsl(42, 36%, 94%);       /* cream paper */
  --foreground: hsl(30, 12%, 13%);       /* ink */
  --primary: hsl(356, 48%, 36%);         /* oxblood */
  --primary-foreground: hsl(42, 36%, 96%);
  --muted-foreground: hsl(30, 6%, 42%);
  --border: hsl(38, 16%, 84%);
  --card: hsl(40, 30%, 90%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,500;1,300&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
```
- **H1:** Spectral 500, clamp(40px, 5vw, 72px), line-height 1.1, letter-spacing -0.02em
- **H2:** Spectral 500, clamp(26px, 3vw, 40px)
- **Body:** Spectral 300, 19px, line-height 1.8 — this is a page about a book, so the body text is the design
- **Labels, price, UI:** Inter 500, 12px, uppercase, letter-spacing 0.12em

## 5. Visual Effects

**Effect 1 — CSS 3D book.** The cover is built from three divs in a 1200px perspective: the front face, a 26px spine rotated on the Y axis, and a soft shadow beneath. It starts turned at 28 degrees and settles to 14 on load. On hover it turns back to 24 degrees. No image of a mockup — the book is real geometry.

```jsx
<motion.div
  style={{ transformStyle: "preserve-3d", perspective: 1200 }}
  initial={{ rotateY: 28, y: 20, opacity: 0 }}
  animate={{ rotateY: 14, y: 0, opacity: 1 }}
  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
  className="relative h-[420px] w-[300px]"
>
  <div className="absolute inset-0 rounded-r-md bg-[var(--foreground)] p-8 text-[var(--background)] shadow-2xl">
    {/* cover title set in Spectral, author name at the bottom */}
  </div>
  <div
    className="absolute left-0 top-0 h-full w-[26px] origin-left bg-[hsl(30,12%,8%)]"
    style={{ transform: "rotateY(-90deg) translateZ(0)" }}
  />
</motion.div>
```

**Effect 2 — Reading progress rule.** A 2px oxblood bar fixed to the top of the viewport that fills as the visitor scrolls. It is the only piece of chrome on the page.

**Effect 3 — Marginalia.** Short notes in the left margin beside certain paragraphs on desktop, set in Inter 12px uppercase and muted, like pencil notes in a book. They fade in when their paragraph is in view. Hidden below 1024px.

## 6. Component Breakdown

1. **Progress rule** — Effect 2.
2. **Navbar** — 64px, transparent, no links. Just the book title small on the left and the price with a `Buy` text link on the right.
3. **Hero** — two columns. Left: label, H1, subline, price line, buy button and a line of reassurance. Right: the 3D book (Effect 1).
4. **The problem** — a narrow single column of three short paragraphs, with marginalia (Effect 3).
5. **What's inside** — a table of contents: seven chapters as numbered rows with a title and one line each, separated by thin rules.
6. **Sample pages** — two page spreads shown as cream cards with real body text and a small `SAMPLE` label, slightly rotated.
7. **Who it's for** — three short columns with a check icon each.
8. **About the author** — a small round portrait, three sentences, and a credential line. *Image: friendly portrait of a designer in their forties at a desk, soft daylight, muted colours.*
9. **Praise** — three quotes with name and role, set in italic Spectral.
10. **Pricing** — a single centred card: price, what you get, format list, and the buy button. One option only, deliberately.
11. **Guarantee** — one sentence in a bordered panel about refunds.
12. **FAQ** — five native `<details>` elements.
13. **Final push** — a centred H2, the book turned smaller, and a last buy button.
14. **Footer** — one line: author name, email and copyright.

## 7. Animations
- Book: Effect 1 on load, turn on hover
- Text: fade up 14px with 0.08s stagger, only once
- Marginalia: fade in from `x: -8`, 0.5s
- Chapter rows: fade in with 0.04s stagger; the row number turns oxblood on hover
- Sample cards: lift 4px and straighten on hover
- Progress rule: Effect 2

## 8. Responsive
- **Mobile (<768px):** hero stacks with the book first at 300px tall; H1 at 40px; marginalia hidden; sample spreads become a horizontal snap-scroll row; the buy button becomes sticky at the bottom of the screen after the hero scrolls out.
- **Tablet:** hero stays split 55/45; marginalia hidden.
- **Desktop:** content column max-width 720px, marginalia in a 200px left gutter, section spacing `py-24`.

## 9. Full Copy

**Book:** THE QUIET PORTFOLIO · by Marek Halloran

**Hero**
- Label: `A SHORT BOOK FOR FREELANCE DESIGNERS`
- H1: `Your portfolio is loud and it isn't working.`
- Subline: `Ninety-four pages on why the best-looking portfolios lose the best clients, and how to rebuild yours around the three projects that actually sell your work.`
- Price line: `£19 · PDF and EPUB · Read it in an evening`
- Button: `Buy the book — £19`
- Reassurance: `Instant download · Read on anything · Refund within 30 days, no questions`

**The problem** — H2 `Nobody reads a portfolio. They scan it.`
- `Most designers build a portfolio for other designers. Thirty projects, animated transitions, a case study for a logo that took a day. It looks accomplished and it converts terribly.`
- `The person hiring you is not a designer. They have eleven tabs open, six minutes, and one question: has this person solved my problem before?`
- `This book is about answering that question in twelve seconds, which is roughly how long you actually get.`
Marginalia: `The average portfolio visit lasts 47 seconds.` · `Three projects beats thirty. Every time.` · `Write for the client, not the peer.`

**What's inside** — H2 `Seven chapters, ninety-four pages.`
1. **Why thirty projects is worse than three** — `The maths of attention, and what scanning actually looks like.`
2. **Choosing the three** — `A simple test for which work to show and which to delete.`
3. **Writing the case study** — `A six-part structure you can fill in for any project in forty minutes.`
4. **The first screen** — `What to put above the fold so the wrong clients leave immediately.`
5. **Pricing on the page** — `When to show numbers, and what happens when you do.`
6. **The about page nobody writes** — `Why this is the second most visited page and usually the worst.`
7. **Sending it out** — `Cold outreach that references the work rather than describing it.`

**Sample pages** — Label `SAMPLE`
- `"Delete every project you would not want to be hired to do again. You are advertising for more of the same work, so advertise for the work you want."`
- `"A case study is not a story about you. It is evidence, arranged in the order a sceptical person needs it: problem, constraint, decision, result."`

**Who it's for**
- **Freelancers who are busy but underpaid** — `You get work, it just isn't the work you want.`
- **Designers leaving an agency** — `You have great projects you can't show and need to fix that fast.`
- **Anyone rebuilding a site this month** — `Read this before you open Figma, not after.`

**About the author** — H2 `Written by someone who got this wrong for years.`
`Marek Halloran has been a freelance designer for fourteen years, first in Dublin and now in Berlin. He rebuilt his own portfolio four times before he understood why the third version, the ugliest one, brought in three times the work.`
Credential: `Clients have included Monzo, Patagonia and two companies that no longer exist.`

**Praise**
- `"I cut twenty-two projects and doubled my rate in the same month. The book is basically a permission slip."` — **Anya Ruiz**, brand designer
- `"The case study structure alone is worth the price. I use it as a template now."` — **Tom Greening**, product designer
- `"Short, blunt, and it doesn't waste your evening."` — **Sofia Lind**, illustrator

**Pricing** — H2 `One price. One book.`
- `£19`
- `94-page PDF, formatted for reading on a laptop`
- `EPUB for e-readers`
- `The case study template as a separate file`
- `Free updates forever — version 2.1, September 2026`
- Button: `Buy the book — £19`

**Guarantee:** `If it doesn't change how you think about your portfolio, email me within thirty days and I'll refund it. You keep the files.`

**FAQ**
- **Is it a print book?** `No. PDF and EPUB only, which is why it costs £19 and not £39.`
- **How long does it take to read?** `About ninety minutes. It is deliberately short.`
- **Is this only for designers?** `Mostly. Photographers and copywriters have told me chapters two to four apply directly.`
- **Do I get updates?** `Yes, free, forever. You'll get an email when a new version goes out.`
- **Can I expense it?** `There's a proper invoice with your details on the download page.`

**Final push** — H2 `Read it tonight. Rebuild it this weekend.` Button `Buy the book — £19`

**Footer** — The Quiet Portfolio · marek@quietportfolio.com · © 2026 Marek Halloran

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
