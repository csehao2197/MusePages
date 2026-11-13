# Odd Jobs Co. — Handyman Website Prompt

## 1. Goal Statement
Build a friendly, immediately bookable handyman website for **Odd Jobs Co.**, defined by warm paper, a confident signal orange, and a rounded practical sans — built around a job picker with real hourly and fixed-price rates, because the whole category loses customers to "contact us for a quote".

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(40, 30%, 97%);       /* #faf7f1 warm paper */
  --foreground: hsl(220, 22%, 17%);      /* #222834 */
  --primary: hsl(22, 90%, 52%);          /* #f56717 signal orange */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(220, 8%, 46%);
  --border: hsl(38, 16%, 88%);
  --card: hsl(40, 32%, 93%);
  --accent-blue: hsl(210, 62%, 42%);     /* trust marker */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Figtree 800, clamp(36px, 4.8vw, 64px), letter-spacing -0.03em
- **H2:** Figtree 700, 30–42px
- **H3:** Figtree 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.74
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.18em, 11px, orange
- **Prices and durations:** Figtree 800, tabular-nums

## 5. Visual Effects

**Effect 1 — Job picker with running total.** A grid of common jobs as toggleable cards, each with a fixed price and typical duration. Selecting several builds a running total and an estimated visit length, so a customer can assemble a morning of work and see the cost before contacting anyone.

```tsx
const jobs = [
  { id: 'tv',     label: 'Mount a TV',            price: 65,  mins: 60 },
  { id: 'shelf',  label: 'Put up shelves',        price: 45,  mins: 45 },
  { id: 'flat',   label: 'Flat-pack furniture',   price: 55,  mins: 60 },
  { id: 'tap',    label: 'Replace a tap',         price: 70,  mins: 60 },
  { id: 'door',   label: 'Ease a sticking door',  price: 40,  mins: 30 },
  { id: 'seal',   label: 'Reseal a bath',         price: 60,  mins: 60 },
];
const [picked, setPicked] = useState([]);
const total = picked.reduce((s, id) => s + jobs.find(j => j.id === id).price, 0);
const mins = picked.reduce((s, id) => s + jobs.find(j => j.id === id).mins, 0);

<motion.div layout className="sticky bottom-4 rounded-2xl bg-[var(--foreground)] px-6 py-4 text-white">
  <motion.span key={total} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
    {picked.length} jobs · about {Math.round(mins / 60 * 10) / 10} hours · <strong className="tabular-nums">£{total}</strong>
  </motion.span>
</motion.div>
```

**Effect 2 — Toolbox icon pop.** Each job card carries a small line icon that scales from 0.7 to 1 with a light overshoot spring when the card enters view, staggered across the grid — enough personality to feel human without becoming cartoonish.

## 6. Component Breakdown

1. **Navbar** — 70px, sticky, warm paper, 1px bottom border. Wordmark left, links centre, phone and `Book a Slot` orange pill right.
2. **Hero** — split, text left, image right. Eyebrow, H1, subline, two CTAs, four trust points. *Image: a handyman in work clothes fixing a cupboard hinge in a bright domestic kitchen, natural light, candid and competent.*
3. **Availability strip** — the next three available slots with dates and half-day windows, which converts far better than a generic contact form.
4. **Job picker** — the primary interaction (Effect 1) with a sticky running total and a `Book these jobs` CTA.
5. **Rates** — hourly, half-day and full-day rates stated plainly, plus the call-out minimum and what counts as materials.
6. **What we do and do not do** — two honest columns. The second column, listing gas, notifiable electrics and structural work, builds more trust than any badge.
7. **How booking works** — four steps including the text-the-day-before confirmation and how payment is taken.
8. **Coverage** — a list of areas with travel included and a note on the small charge beyond it.
9. **Materials** — how materials are handled: cost plus nothing, receipts provided, or supply your own.
10. **Reviews** — three quotes each naming the actual job done.
11. **Booking form** — job description, preferred half-day, address, and a photo upload note.
12. **Footer** — dark slate, three columns, public liability figure, DBS note, contact.

## 7. Animations
- Hero: text fades up 0.6s; image rises and fades, 0.8s
- Availability slots: fade in staggered 0.08s
- Job cards: icons pop with an overshoot spring staggered 0.04s; selected card gets an orange 2px border and lifts 3px
- Running total: re-mounts and fades up on every change, 0.22s; the bar itself uses layout animation as it grows
- Do and do-not lists: tick and cross icons pop staggered 0.05s
- Everything is quick and friendly — springs rather than long eases

## 8. Responsive
- **Mobile (<768px):** hamburger with a tap-to-call button; image drops below the text; H1 clamps to 36px; job picker 2-col with the running total pinned as a bottom bar; rates table becomes stacked rows; do and do-not columns stack with the do-not list second.
- **Tablet:** job picker 3-col, hero stays split.
- **Desktop:** job picker 3-col at wider cards, max width 1120px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** ODD JOBS CO. · Handyman services · Bristol and Bath

**Navbar:** Jobs & Prices · Rates · What We Do · Coverage · Reviews · `0117 555 0157` · [Button] Book a Slot

**Hero**
- Eyebrow: `BRISTOL & BATH · FIXED PRICES · DBS CHECKED · £2M INSURED`
- H1: `The list on the fridge. Done by Thursday.`
- Subline: `One person, a full van, and fixed prices for the jobs everybody puts off. Pick what you need, see the total, book a half-day. No quotes, no callbacks, no waiting in for someone who does not turn up.`
- CTAs: `Pick My Jobs` · `See Rates`
- Trust points: `Fixed prices` · `DBS checked` · `£2m public liability` · `Text before arrival`

**Availability strip:** `Next slots: Thursday morning · Thursday afternoon · Monday morning`

**Job picker** — Eyebrow `PICK YOUR JOBS` — H2 `Fixed prices for the usual suspects`
- **Mount a TV** — £65 · about 1 hour — Up to 65 inch on a solid or stud wall, cables tidied into trunking.
- **Put up shelves** — £45 · about 45 mins — Per run up to 2 metres, includes finding the studs properly.
- **Flat-pack furniture** — £55 · about 1 hour — Per item up to a double wardrobe. Bring the instructions, I will ignore them politely.
- **Replace a tap** — £70 · about 1 hour — Kitchen or basin, like-for-like swap, isolation valves fitted if missing.
- **Ease a sticking door** — £40 · about 30 mins — Planed, rehung or hinges adjusted, whichever it actually needs.
- **Reseal a bath or shower** — £60 · about 1 hour — Old silicone stripped properly, which is why it lasts.
- **Hang a door** — £95 · about 2 hours — Including hinges, handle and latch.
- **Fit blinds or curtain poles** — £45 · about 45 mins — Per window.
- **Fill and touch up plaster** — £50 · about 1 hour — Small holes and cracks, ready for you to paint.
- **Fit a smoke alarm** — £35 · about 20 mins — Battery type, correctly positioned rather than wherever is convenient.
- **Clear a blocked waste** — £55 · about 45 mins — Sink, basin or bath. Not drains outside.
- **Assemble a bed** — £65 · about 1 hour — Including the slats nobody can face.

**Rates** — Eyebrow `RATES` — H2 `If your job is not on the list`
`Hourly £42, minimum one hour · Half day, four hours £145 · Full day, eight hours £270 · Call-out is included within the coverage area, not added on top.`
`If it takes less time than quoted, you pay less. That is unusual in this trade and it is deliberate.`

**What we do and do not do**
Do: `Carpentry and joinery repairs` · `Furniture assembly` · `Shelving, mounting and hanging` · `Basic plumbing — taps, traps, seals, isolation valves` · `Basic electrics — like-for-like sockets, switches and light fittings` · `Filling, sanding and small plaster repairs` · `Fitting locks, handles and hinges` · `Flat-pack, blinds, poles and rails` · `Small tiling and grout renewal` · `Fence panel and gate repairs`
Do not: `Gas work of any kind — you need a Gas Safe engineer and I am not one` · `Notifiable electrical work — new circuits, consumer units, anything in a bathroom zone` · `Structural work — removing walls, lintels, load-bearing anything` · `Roof work above single-storey height` · `Asbestos, in any form, ever`
Note: `The second list is longer than most handymen admit to. Doing work you are not qualified for is how people get hurt and how insurance claims get refused.`

**How booking works**
1. **Pick your jobs** — Use the list above, or describe it in the form if it is unusual.
2. **Choose a half-day** — Morning is 8am to 12:30pm, afternoon is 1pm to 5:30pm. You get a half-day window, not a nine-hour one.
3. **I text the day before** — Confirming the slot and roughly what time within it, so you are not sat waiting from eight.
4. **Pay after** — Card, bank transfer or cash, on the day, once you have seen the work. No deposit for domestic jobs.

**Coverage** — `Bristol BS1 to BS16, Bath BA1 and BA2, Keynsham, Portishead, Nailsea and Thornbury. Travel is included in those. Beyond them, £0.45 a mile from BS5, and I will tell you the figure before you book rather than adding it to the invoice.`

**Materials** — `I carry the usual consumables — screws, fixings, silicone, filler, rawlplugs — and those are included. Anything bigger, I buy at cost and hand you the receipt with no markup, or you buy it yourself and I fit it. Both are fine and neither costs you more.`

**Reviews**
1. `Four things on the list that had been there since March. All done in one morning, and he took the packaging away with him.` — **Rachel M.**, Bristol BS6 — TV mount, two shelves, a sticking door and a bath reseal
2. `Told me straight that the socket I wanted moving was a notifiable job and gave me the number of a sparky. Then did the other five things.` — **Ade O.**, Bath BA2 — Various
3. `Quoted a half day, finished in three hours, charged me three hours. I did not even ask.` — **Kirsty L.**, Keynsham — Flat-pack and blinds

**Booking form** — Name / Address or postcode / Phone / Which jobs, or describe it / Preferred half-day / Photo upload → [Button] `Book This Slot`
Note: `Photos genuinely help, especially for anything plumbing or door related. It means I turn up with the right part rather than making a second trip.`

**Footer** — ODD JOBS CO. · `The list on the fridge. Done by Thursday.` · `0117 555 0157` · £2m public liability · Enhanced DBS checked · Covering Bristol, Bath and surrounding · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
