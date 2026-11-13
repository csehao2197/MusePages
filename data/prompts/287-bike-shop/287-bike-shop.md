# Cog & Chain — Bike Shop Website Prompt

## 1. Goal Statement
Build a workshop-first bike shop website for **Cog & Chain**, defined by graphite, a hi-vis chartreuse, and a mechanical condensed sans — leading with a service booking and a live workshop turnaround rather than a product catalogue nobody buys from.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(220, 12%, 11%);      /* #191b1f graphite */
  --foreground: hsl(210, 14%, 94%);      /* #edeff2 */
  --primary: hsl(74, 92%, 54%);          /* #cbf01c hi-vis chartreuse */
  --primary-foreground: hsl(220, 14%, 9%);
  --muted-foreground: hsl(214, 8%, 56%);
  --border: hsl(220, 10%, 21%);
  --card: hsl(220, 11%, 14%);
  --card-elevated: hsl(220, 10%, 18%);
  --steel: hsl(200, 12%, 62%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Saira Condensed 800, uppercase, clamp(44px, 6.4vw, 96px), letter-spacing 0.005em, line-height 0.94
- **H2:** Saira Condensed 700, uppercase, 32–52px
- **H3:** Saira Condensed 600, 19–22px
- **Body:** Inter 300–400, 16px, line-height 1.7
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, chartreuse
- **Prices / turnaround / gear ratios:** Saira Condensed 800, tabular-nums

## 5. Visual Effects

**Effect 1 — Service tier selector with live turnaround.** Four service tiers where selecting one shows what is included, the price, and a live turnaround line computed from the current workshop queue. The queue number is a variable at the top of the file so the shop can update it daily.

```tsx
const QUEUE_DAYS = 4; // shop updates this daily
const tiers = [
  { id: 'safety',  name: 'Safety check',   price: 25,  hours: 0.5, items: ['Brakes', 'Gears', 'Tyres', 'Bolt torque check'] },
  { id: 'minor',   name: 'Minor service',  price: 65,  hours: 1.5, items: ['Everything in safety check', 'Gear and brake adjust', 'Drivetrain clean', 'Wheel true'] },
  { id: 'major',   name: 'Major service',  price: 130, hours: 3,   items: ['Everything in minor', 'Full strip and rebuild', 'New cables and housing', 'Bearing service'] },
  { id: 'custom',  name: 'Custom build',   price: 260, hours: 6,   items: ['Frame prep and facing', 'Full build from parts', 'Bearing prep and torque log', 'Two free follow-ups'] },
];
const [sel, setSel] = useState('minor');
const t = tiers.find(x => x.id === sel);

<p className="mt-4 font-display text-2xl">
  £{t.price} · ready in about <span className="text-[var(--primary)]">{QUEUE_DAYS + Math.ceil(t.hours / 6)} days</span>
</p>
```

**Effect 2 — Chartreuse chain-link divider.** A repeating SVG pattern of simplified chain links running horizontally between major sections, animating its `background-position` slowly to suggest a chain moving, with a reduced-motion fallback that holds it static.

## 6. Component Breakdown

1. **Navbar** — 72px, fixed, graphite with blur, chartreuse 2px bottom border after scroll. Wordmark left, links centre, `Book a Service` chartreuse square button right.
2. **Hero** — 88vh, full-bleed workshop photograph with a left gradient. Eyebrow, condensed uppercase H1, subline, two CTAs, four shop facts. *Image: bike workshop with a bike in a repair stand, tools on a pegboard wall, focused low light with one strong work lamp, mechanical and detailed.*
3. **Workshop status strip** — current turnaround in days, whether same-day repairs are available today, and the number in the queue.
4. **Service tiers** — the primary interaction (Effect 1) with a booking CTA.
5. **Individual repairs** — a price list of common jobs: puncture, brake bleed, gear cable, wheel true, bottom bracket, headset, tubeless setup, hydraulic hose.
6. **Bikes we sell** — three categories with price ranges rather than a product grid: commuter, gravel, and second-hand refurbished.
7. **Second-hand programme** — the differentiator: what the shop does to every used bike before selling it, with a warranty statement.
8. **Bike fitting** — two levels, duration and price, with what is measured.
9. **Workshop philosophy** — a short opinionated section on what the shop will and will not do, including refusing unsafe repairs.
10. **Club rides** — Saturday shop ride details, pace groups and the route board.
11. **Find us** — address, hours, whether you can drop in without booking, and bike parking.
12. **Footer** — near-black, chartreuse top rule, three columns, Cytech accreditation.

## 7. Animations
- Hero: H1 reveals with a clipPath line wipe, 0.75s, staggered 0.08s
- Chain divider: `background-position` shifts continuously, 20s linear, reduced-motion safe
- Service tiers: selected tier gets a chartreuse 2px border and lifts `-3px`; included list swaps with AnimatePresence, 0.25s
- Turnaround figure: re-mounts and fades up on change, 0.2s
- Repair price rows: fade in staggered 0.03s; hover shifts the price 4px left
- Everything is fast and mechanical — no easing above 0.4s except the hero

## 8. Responsive
- **Mobile (<768px):** hamburger; H1 clamps to 44px; status strip becomes two stacked lines; service tiers become a horizontally scrollable card row with the detail beneath; repair list keeps two columns of job and price; `Book a Service` pinned as a sticky bottom bar.
- **Tablet:** tiers 2x2, repairs 2-col, bikes 3-col.
- **Desktop:** max width 1200px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** COG & CHAIN · Bike shop and workshop · Manchester

**Navbar:** Workshop · Repairs · Bikes · Second-hand · Fitting · Find Us · [Button] Book a Service

**Hero**
- Eyebrow: `MANCHESTER · WORKSHOP FIRST · CYTECH ACCREDITED · SINCE 2011`
- H1: `WE FIX BIKES. WE ALSO SELL THEM.`
- Subline: `A workshop with a shop attached rather than the other way round. Three Cytech mechanics, honest turnaround times, and we will tell you when a repair is not worth the money.`
- CTAs: `Book a Service` · `See Repair Prices`
- Facts: `3 Cytech mechanics` · `Same-day punctures` · `Second-hand warrantied` · `Free first check-up`

**Workshop status:** `Current turnaround: 4 days · Same-day punctures and brake fixes until 4pm · 11 bikes in the queue`

**Service tiers**
- **Safety check — £25** — Brakes, gears, tyres and a bolt torque check. Thirty minutes, usually while you wait.
- **Minor service — £65** — Everything in the safety check, plus gear and brake adjustment, drivetrain clean, and wheel truing.
- **Major service — £130** — Everything in the minor, plus a full strip and rebuild, new cables and housing, and bearing service throughout.
- **Custom build — from £260** — Frame prep and facing, full build from your parts, bearing prep with a torque log, and two free follow-up adjustments.

**Individual repairs**
`Puncture repair £12` · `Tube replacement £15` · `Brake pad replacement, per wheel £18` · `Hydraulic brake bleed, per brake £30` · `Gear cable and housing £22` · `Brake cable and housing £20` · `Wheel true £20` · `Spoke replacement £8 each` · `Bottom bracket replacement £35 plus part` · `Headset service £40` · `Tubeless setup, per wheel £25` · `Hydraulic hose shorten £28` · `Chain and cassette fit £30 plus parts` · `Bike box packing £45`

**Bikes we sell**
1. **Commuter — £480 to £1,400** — Hub gears, mudguards, dynamo lighting and a rack. Built for four seasons of getting to work rather than for a spec sheet.
2. **Gravel and adventure — £1,200 to £4,200** — Steel and aluminium frames, clearance for 45mm, mounts for everything. Built to your fit before it leaves.
3. **Second-hand refurbished — £220 to £900** — Fully serviced, warrantied, and honestly described. Usually the best value in the shop.

**Second-hand programme** — H2 `EVERY USED BIKE GETS THE SAME TREATMENT`
`Stripped to the frame, bearings replaced or repacked, new cables and housing, new chain, new bar tape or grips, and a safety check signed off by a Cytech mechanic. We list the frame's age, the parts we replaced and the parts we did not. Every second-hand bike carries a six-month warranty on the work and a free service at six weeks.`

**Bike fitting**
- **Basic fit — £60, 60 minutes** — Saddle height and setback, bar height and reach, cleat position. Best for commuters and anyone with a new bike.
- **Full fit — £150, 2.5 hours** — Everything in the basic, plus flexibility and pelvic assessment, video analysis in three planes, and a written report with the numbers so you can replicate it on another bike.

**Workshop philosophy** — H2 `THINGS WE WILL AND WILL NOT DO`
1. `We will tell you when a repair costs more than the bike is worth.` It happens weekly and we would rather lose the job.
2. `We will not release a bike we consider unsafe.` If a frame is cracked, we will show you where and refuse to build it back up.
3. `We service bikes we did not sell, at the same price.` A shop that charges more for other people's bikes is telling you something.
4. `We show you the old part.` Every replaced component goes in a tray with your name on it so you can see what you paid for.

**Club rides** — `Saturday shop ride, leaves 8:30am from outside the shop. Three pace groups: 15mph social, 17mph steady, and a fast group that we take no responsibility for. Route board in the window every Thursday, café stop always included, and nobody gets left behind in the first two groups.`

**Find us** — `44 Chapel Street, Salford, Manchester M3 5DF` · Tue–Fri 9:00–18:00 · Sat 9:00–17:00 · Sun and Mon closed
`Drop in without booking for punctures, brake adjustments and anything under fifteen minutes. Everything else, book — it saves you a wasted trip. Covered bike parking in the yard round the back.`

**Footer** — COG & CHAIN · `We fix bikes. We also sell them.` · `0161 555 0173` · Cytech Level 3 accredited workshop · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
