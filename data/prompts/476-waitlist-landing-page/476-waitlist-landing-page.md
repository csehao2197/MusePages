# Ledger: Waitlist Landing Page Website Prompt

## 1. Goal
Build a crisp, confident waitlist page for **Ledger**, an unreleased expenses app for small studios. White ground, near black text, one electric blue accent, a Swiss grid you can see, and a single email field that matters more than anything else on the page. Everything else exists to make that field worth filling in.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no backend, no analytics. The form holds one piece of state and shows a confirmed state after submit.

## 3. Design system
```css
:root {
  --paper: #FFFFFF;              /* light ground */
  --ink: #111111;                /* text and dark ground */
  --accent: #2743CF;             /* electric blue */
  --on-accent: #FFFFFF;
  --surface: #F4F4F5;            /* tinted ground */
  --muted: #6B6B70;              /* secondary text */
  --line: rgba(17,17,17,0.15);   /* hairlines */
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, light footer. Structure comes from hairlines and a visible column grid, never from boxes or shadows.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Instrument Sans 600, letter-spacing -0.04em, line-height 0.98. Hero 80 to 132px, section titles 40 to 64px.
- **Body:** Inter 300, 16px, line-height 1.55.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Only for dates, counts, index labels like `001/ Why`.
- No italics in this one. Emphasis comes from a whole line set in the accent colour.

## 5. Signature element
**A queue ticket.** A cloakroom style ticket drawn in SVG: a rectangle with a perforated edge down one side rendered as a dashed hairline, a mono label reading `LEDGER EARLY ACCESS`, and a large number in Instrument Sans. Before submitting, the number sits as four grey dashes. After submitting, each digit rolls into place from below, one after the other, 60ms apart, and a thin blue line draws along the perforation.

The number is the visitor's place in the queue, held in local state. It is the only moment of delight on the page and it happens once.

## 6. Sections, each a different skeleton

1. **Navbar**: 68px, transparent, no links. Wordmark left, one mono line right reading the launch window.
2. **Hero, Swiss sheet**: visible faint vertical gridlines running the full height of the section. Mono index `000/ Ledger` in the left column, then a three line headline starting at one third of the width. Beneath it one sentence and the email field with a solid square button. Min height `clamp(520px, 76vh, 780px)`.
3. **The ticket**: light, centred. The signature element (section 5) with a mono caption beneath.
4. **The problem, statement**: light. One long paragraph at 28px in the display face, starting at one third, with `001/ Why` in the left column. No image.
5. **Three things, ruled rows**: surface. Three numbered rows on hairlines: number in mono, title in the display face at 32px, one sentence. No icons, no cards.
6. **A look at it, photo led**: dark ground. One wide product screenshot inset 16px with `--panel-radius`, a mono caption top left inside the panel. *Screenshot: a clean light expenses interface, a list of transactions with categories and a total, blue accents, no chart.*
7. **Who it is for, index swap**: light. Four kinds of team listed large on the left. Hovering a line swaps a small photograph on the right. *Photographs: a two person design studio, a small architecture office, a film production desk, a recording studio office.*
8. **Honest timeline, hairline rows**: light. Four rows: what is built, what is next, what is not coming, when. Mono dates right aligned.
9. **From the build, quote**: surface. One quote from the founder, centred, at 34px, signed in mono.
10. **Second ask, accent panel**: accent ground, inset panel. One line, the email field again, and a mono line about how often you will hear from them.
11. **Footer**: light. Wordmark, one line about who is building it, three small links, and the mono launch window again.

## 7. Motion
- Headline lines rise 24px with 0.08s stagger, once.
- Gridlines fade in from 0 to full over 0.8s on load, then stay still.
- Ticket digits roll as described, only after submit.
- Index swap photographs crossfade over 0.2s.
- Buttons: fill wipes from left to right on hover over 0.2s.
- Ease `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** gridlines hidden. Headline at 44px starting at the left margin. Email field full width with the button stacked beneath. Ticket scales to 260px wide. Index swap loses the hover photograph and shows a small thumbnail inside each row. No horizontal page scroll.
- **Tablet:** headline at 72px, gridlines visible, index swap keeps the photograph.
- **Desktop:** 1200px content width, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** LEDGER. Mono, top right: `PRIVATE BETA. FIRST INVITES IN NOVEMBER.`

**Hero** (index `000/ Ledger`)
- Headline: `Expenses, finally sized for a studio of four.`
- Sentence: `Ledger reads your bank feed, sorts it the way an accountant would, and produces the one report your bookkeeper actually asks for.`
- Field placeholder: `you@studio.com` Button: `Join the waitlist`
- Mono beneath: `NO SPAM. ONE EMAIL A MONTH AT MOST.`

**Ticket caption:** `Your place in the queue. Invites go out in the order they were taken.`

**The problem** (label `001/ Why`)
`Every expenses tool is built either for one freelancer or for a company with a finance department. In between sits a studio of four people, one of whom does the books on a Sunday, and none of the tools fit. Ledger is for that Sunday.`

**Three things**
- `01` **Reads the feed, not the receipts.** `Connect a business account and transactions arrive already sorted. Receipts are for the ones that need proof.`
- `02` **Knows what a studio buys.** `Software, contractors, travel, hardware, and the eleven ways a coffee becomes a client expense.`
- `03` **One report, the right one.** `A quarterly export your bookkeeper opens without emailing you a question.`

**Screenshot caption:** `September, sorted. Fourteen seconds of work.`

**Who it is for**
- `Design studios of two to eight`
- `Architecture practices`
- `Production companies`
- `Anyone whose accountant sighs`

**Honest timeline** (label `002/ Where it is`)
- `Bank feed and sorting` ... `Built and in daily use` ... `NOW`
- `Quarterly export` ... `Built, being tested with four bookkeepers` ... `OCTOBER`
- `Receipt capture` ... `Next, once the export is stable` ... `DECEMBER`
- `Payroll` ... `Not coming. Use something built for it.` ... `NEVER`

**Quote:** `I built this because I spent nine hundred pounds on tools that were either too small or too big, and then did it in a spreadsheet anyway.`
Signature: `Mara Teller, building Ledger`

**Second ask**
- Line: `Four hundred and eleven studios are ahead of you. It moves quickly.`
- Field placeholder: `you@studio.com` Button: `Join the waitlist`
- Mono: `WE WILL EMAIL YOU WHEN IT IS YOUR TURN, AND NOT BEFORE.`

**Footer**
`LEDGER`, `Built in Bristol by two people.`, links `Privacy`, `What we store`, `mara@ledger.app`, mono `PRIVATE BETA. FIRST INVITES IN NOVEMBER.`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, fake counters that tick up, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, a pricing table for a product that does not exist yet.

## 11. Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
