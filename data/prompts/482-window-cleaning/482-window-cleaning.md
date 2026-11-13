# Clearview Window Cleaning — Window Cleaning Website Prompt

## 1. Goal Statement
Build a bright, instantly bookable window cleaning website for **Clearview**, defined by sky white, a clean glass blue, and a friendly geometric sans — built around an instant quote calculator that gives a real price from bedrooms and property type rather than a callback form.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(200, 40%, 98%);      /* #f7fbfd sky white */
  --foreground: hsl(210, 28%, 17%);      /* #1f2b37 */
  --primary: hsl(202, 88%, 44%);         /* #0d8ed3 glass blue */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(210, 8%, 47%);
  --border: hsl(202, 22%, 88%);
  --card: hsl(200, 44%, 94%);
  --accent-sun: hsl(46, 96%, 56%);       /* sunlight yellow */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Outfit 800, clamp(36px, 4.8vw, 66px), letter-spacing -0.03em
- **H2:** Outfit 700, 30–44px
- **H3:** Outfit 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.72
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.18em, 11px, blue
- **Prices:** Outfit 800, tabular-nums

## 5. Visual Effects

**Effect 1 — Instant quote calculator.** Property type, number of bedrooms and a conservatory toggle produce a real price for a single clean and for the four-weekly plan, updating live. It replaces the callback form that loses most of this category's leads.

```tsx
const base = { terraced: 12, semi: 15, detached: 20, bungalow: 14, flat: 10 };
const [type, setType] = useState('semi');
const [beds, setBeds] = useState(3);
const [conservatory, setConservatory] = useState(false);

const oneOff = base[type] + Math.max(0, beds - 2) * 3 + (conservatory ? 6 : 0);
const plan = Math.round(oneOff * 0.85);

<motion.div key={oneOff} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
  <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Your price</p>
  <p className="font-display text-6xl tabular-nums text-[var(--primary)]">£{plan}</p>
  <p className="mt-2 text-[var(--muted-foreground)]">every four weeks · £{oneOff} as a one-off</p>
</motion.div>
```

**Effect 2 — Squeegee wipe reveal.** Section images are revealed with a diagonal clip-path wipe that travels bottom-left to top-right over 0.9 seconds, mimicking a squeegee stroke across glass. Used on the hero image and the before-and-after block only, so it stays a signature rather than a tic.

## 6. Component Breakdown

1. **Navbar** — 70px, sticky, sky white, 1px bottom border. Wordmark left, links centre, phone and `Get My Price` blue pill right.
2. **Hero** — split, text and quote calculator left, image right with a squeegee wipe reveal. Eyebrow, H1, subline, four trust points. *Image: a cleaner using a water-fed pole on a two-storey house exterior, bright clear day, blue sky, professional and tidy.*
3. **Quote calculator** — the primary conversion element (Effect 1), sitting inside the hero rather than below the fold.
4. **What is included** — 2x3 icon grid: frames and sills, front and back, conservatory roof option, gutter clearing, fascias and soffits, solar panels.
5. **How the water-fed pole works** — a short explainer on purified water and why the windows dry without streaks, which is the objection every customer raises.
6. **Before and after** — a drag-slider comparison with the squeegee wipe on first reveal.
7. **Plans and pricing** — three columns: four-weekly, eight-weekly, and one-off, with the discount structure and no-contract statement.
8. **Coverage area** — a list of twelve postcodes with a note on which days each is cleaned.
9. **What happens on the day** — five short points including whether you need to be home and how gates and dogs are handled.
10. **Payment** — GoCardless, card, or bank transfer, with an explicit no-cash-needed line and text-before-arrival option.
11. **Reviews** — three quotes with the property type and how long they have been a customer.
12. **Footer** — deep slate, three columns, public liability cover amount, coverage postcodes, contact.

## 7. Animations
- Hero: text fades up 0.6s; image revealed with the diagonal squeegee wipe, 0.9s
- Quote price: re-mounts and fades up on every input change, 0.25s
- Bedroom stepper and toggle: 0.15s background transitions, snappy
- Included icons: pop scale 0.8 to 1 staggered 0.05s
- Before and after: drag handle with a spring, plus the wipe on first entry
- Plan cards: middle plan sits at scale 1.03 at rest; all lift 4px on hover
- Coverage postcodes: fade in staggered 0.03s

## 8. Responsive
- **Mobile (<768px):** hamburger with a tap-to-call button; image drops below the calculator, since the calculator is the reason people are here; H1 clamps to 36px; included grid 2-col; plans 1-col with four-weekly first; `Get My Price` scrolls to the calculator rather than opening a form.
- **Tablet:** hero stays split, included 3-col, plans 3-col.
- **Desktop:** max width 1140px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** CLEARVIEW WINDOW CLEANING · Norwich and Norfolk

**Navbar:** Get a Price · What's Included · Plans · Coverage · Reviews · `01603 555 0148` · [Button] Get My Price

**Hero**
- Eyebrow: `NORWICH & NORFOLK · WATER-FED POLE · FULLY INSURED · SINCE 2014`
- H1: `Get a real price in ten seconds. No callback.`
- Subline: `Exterior window cleaning across Norwich and the surrounding villages. Purified water, frames and sills included, and a price on the screen rather than a form that promises someone will be in touch.`
- Trust points: `£5m public liability` · `No contract` · `Text before arrival` · `Pay after, not before`

**Quote calculator**
Property types: `Flat` · `Terraced` · `Semi-detached` · `Detached` · `Bungalow`
Inputs: bedrooms stepper, conservatory toggle
Output: `£X every four weeks · £Y as a one-off`

**What is included** — Eyebrow `INCLUDED` — H2 `Frames and sills, every time`
1. **Frames, sills and doors** — Cleaned on every visit, not as an extra. A window with a filthy frame is not a clean window.
2. **Front, back and sides** — All accessible glass on the property, including any you cannot see from the road.
3. **Conservatory roof** — Add it to any plan for £6 a clean. Panels, bars and finials.
4. **Gutter clearing** — Vacuum clearing from the ground with camera confirmation, £45 to £75 by property size.
5. **Fascias and soffits** — Cleaned rather than just rinsed, £40 to £70.
6. **Solar panels** — Purified water only, no detergent, £3 a panel with a minimum of £30.

**How it works** — H2 `Why we use purified water and no cleaning fluid`
`We filter the water down to nearly zero dissolved solids, which means when it dries there is nothing left behind to leave a mark. No detergent, no squeegee marks in the corners, and no ladder against your gutters. It also means the windows stay clean noticeably longer, because there is no soap residue for dust to stick to.`
`They look slightly wet when we leave. That is normal and correct, and they dry clear within an hour.`

**Plans and pricing** — Eyebrow `PLANS` — H2 `No contract, cancel by text`
- **Four-weekly — 15% off** — Our most popular. Same cleaner, same week each month, text the evening before.
- **Eight-weekly — 8% off** — For sheltered properties or anyone who does not mind them getting a bit grubby.
- **One-off — full price** — Move-in, move-out, or before an event. No obligation to continue.
Note: `There is no contract, no joining fee, and no cancellation charge. Text us and it stops. We would rather keep you because the windows are clean than because leaving is annoying.`

**Coverage** — `NR1` · `NR2` · `NR3` · `NR4` · `NR5` · `NR6` · `NR7` · `NR8` · `NR9` · `NR13` · `NR14` · `NR18`
Note: `We run city postcodes Monday to Wednesday and villages Thursday and Friday. If you are just outside these, ring us — we sometimes have a gap.`

**What happens on the day**
1. **You do not need to be home** — We work outside only. If we can reach the gate, we can do the job.
2. **We text the evening before** — So you can unlock the side gate or move the car off the drive.
3. **Gates and dogs** — Tell us once and we remember. If the gate is locked we do the front and only charge for the front.
4. **We work quietly** — No radios, no shouting, and the pole is quieter than a ladder.
5. **If we miss something** — Tell us within forty-eight hours and we come back. It happens occasionally and we do not argue about it.

**Payment** — `GoCardless direct debit taken the day after the clean, or card, or bank transfer. No cash needed and nobody knocks on your door asking for it. You pay after the work, never before.`

**Reviews**
1. `Four years, same cleaner, never once had to chase him. He texts the night before and the windows are done by the time I get home.` — **Helen R.**, Semi-detached, customer since 2022
2. `I was sceptical about the no-detergent thing until I watched them dry. Genuinely no marks, and they stay clean about twice as long as the last lot.` — **Tomasz W.**, Detached, customer since 2024
3. `Asked them to do the conservatory roof as a one-off and they told me honestly it did not need doing yet. Booked them permanently after that.` — **Sandra P.**, Bungalow, customer since 2023

**Footer** — CLEARVIEW WINDOW CLEANING · `Get a real price in ten seconds.` · `01603 555 0148` · £5m public liability insurance · Covering NR1–NR9, NR13, NR14, NR18 · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-slider": "^1.2.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
