# Pressed & Co. — Dry Cleaner Website Prompt

## 1. Goal Statement
Build a crisp, service-led dry cleaning website for **Pressed & Co.**, defined by paper white, a deep ink blue, and generous white space — a garment care site that leads with turnaround times and pickup scheduling rather than a price list nobody reads.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(210, 20%, 99%);      /* #fbfcfd paper white */
  --foreground: hsl(218, 34%, 16%);      /* #1b2536 ink */
  --primary: hsl(218, 62%, 34%);         /* #21508c deep blue */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(218, 10%, 48%);
  --border: hsl(212, 18%, 90%);
  --card: hsl(212, 26%, 96%);
  --accent-fresh: hsl(162, 52%, 44%);    /* fresh green, used for ready status */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Sora 700, clamp(36px, 4.6vw, 64px), letter-spacing -0.03em
- **H2:** Sora 600, 30–42px
- **H3:** Sora 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.75
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.18em, 11px, blue
- **Prices / turnaround:** Sora 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Turnaround selector.** Three service speed cards — standard, express, same day — where selecting one updates a live delivery-day line computed from the current date and a price multiplier applied across the whole price table below.

```tsx
const speeds = [
  { id: 'standard', label: 'Standard', days: 3, mult: 1,    note: 'In by 9am, back in three days' },
  { id: 'express',  label: 'Express',  days: 1, mult: 1.4,  note: 'In by 9am, back tomorrow' },
  { id: 'sameday',  label: 'Same day', days: 0, mult: 1.9,  note: 'In by 9am, back by 6pm' },
];
const [sel, setSel] = useState('standard');
const s = speeds.find(x => x.id === sel);

<p className="mt-4 text-lg">
  Drop off today, ready <span className="font-semibold text-[var(--primary)]">
    {s.days === 0 ? 'this evening' : s.days === 1 ? 'tomorrow' : `in ${s.days} days`}
  </span>. {s.note}.
</p>
{/* Every price in the table below multiplies by s.mult and re-renders */}
```

**Effect 2 — Garment icon row with stroke draw.** Six SVG garment outlines (shirt, suit, dress, coat, curtain, duvet) whose stroke paths draw themselves left to right using `pathLength` on scroll entry, at 0.9s with a 0.08s stagger.

## 6. Component Breakdown

1. **Navbar** — 72px, sticky, paper white, 1px bottom border. Wordmark left, links centre, phone and `Book a Pickup` blue button right.
2. **Hero** — split, text left, image right with rounded corners. Eyebrow, H1, subline, two CTAs, four trust points. *Image: neatly pressed shirts hanging in a row on a rail, clean bright interior, soft daylight, orderly and calm.*
3. **Turnaround selector** — the primary interaction (Effect 1), directly under the hero.
4. **Price list** — a clean two-column table of garment types and prices that recalculates with the selected speed. Grouped into everyday, formalwear, outerwear and household.
5. **Free pickup and delivery** — split band on `--card`: coverage postcodes, minimum order, collection windows, and a scheduling CTA.
6. **What we do** — garment icon row (Effect 2) with six services: dry cleaning, laundered shirts, alterations, leather and suede, wedding dress cleaning, household items.
7. **How it works** — four steps from booking to delivery, with expected timings.
8. **Care and guarantees** — three cards: hand-finished pressing, eco solvent, and a re-clean guarantee stated plainly.
9. **Business accounts** — hotels, restaurants and offices, with a monthly invoicing note.
10. **FAQ** — accordion, six questions on stains, timing, damage policy and what cannot be cleaned.
11. **Find us** — two shop addresses, opening hours, and the pickup coverage map.
12. **Footer** — ink blue, four columns, company registration, environmental accreditation.

## 7. Animations
- Hero: text fades up 0.7s; image reveals with a clipPath wipe from the right, 1s
- Speed cards: selected card gets a 2px blue border and lifts `-3px`, 0.2s; the delivery line swaps with AnimatePresence, 0.25s
- Price figures: each cell fades and re-mounts on multiplier change, 0.2s, staggered 0.01s
- Garment icons: stroke `pathLength 0 → 1`, 0.9s, stagger 0.08s
- Step numbers: pop `scale 0.85 → 1` staggered 0.12s
- Everything is quick and precise — the visual language is pressed, not soft

## 8. Responsive
- **Mobile (<768px):** hamburger; image stacks above text; H1 clamps to 36px; speed cards become a horizontally scrollable chip row; price table becomes two-column stacked rows; `Book a Pickup` pinned as a sticky bottom bar.
- **Tablet:** hero stays split, prices 2-col, services 3-col.
- **Desktop:** max width 1140px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** PRESSED & CO. · Est. 1996 · Reading

**Navbar:** Prices · Pickup · Services · How It Works · Business · Find Us · `0118 555 0140` · [Button] Book a Pickup

**Hero**
- Eyebrow: `READING & WOKINGHAM · FREE PICKUP AND DELIVERY · SINCE 1996`
- H1: `Dropped off Monday. Back Thursday. Pressed properly.`
- Subline: `Independent dry cleaning with free collection across Reading. Hand-finished pressing, GreenEarth solvent, and a re-clean guarantee if anything comes back less than right.`
- CTAs: `Book a Free Pickup` · `See Prices`
- Trust points: `Free pickup and delivery` · `Hand-finished pressing` · `Eco solvent` · `Re-clean guarantee`

**Turnaround**
- **Standard** — 3 days · In by 9am, back in three days
- **Express** — Next day · In by 9am, back tomorrow · +40%
- **Same day** — Today · In by 9am, back by 6pm · +90%

**Prices** — Eyebrow `PRICES` — H2 `Everything, plainly listed`

*Everyday* — Shirt, laundered and pressed £3.20 · Trousers £7.50 · Skirt £7.00 · Jumper £8.00 · Blouse £7.50 · Tie £4.00
*Formalwear* — Two-piece suit £16.00 · Three-piece suit £21.00 · Dinner jacket £11.00 · Evening dress £18.00 · Waistcoat £6.50
*Outerwear* — Coat £14.00 · Wool overcoat £17.00 · Padded jacket £16.00 · Leather jacket £45.00 · Suede coat £58.00
*Household* — Duvet, single £18.00 · Duvet, double £22.00 · Curtains, per metre drop £9.00 · Tablecloth £12.00 · Cushion cover £5.50

**Pickup and delivery** — H2 `We come to you, free`
`Free collection and delivery on orders over £20 across RG1, RG2, RG4, RG6, RG30 and RG41. Choose a two-hour window, leave your bag with a neighbour or in a safe place, and we text you when it is on its way back.`
Windows: `Mon–Fri 8–10am · 12–2pm · 5–7pm` · `Sat 9–11am · 2–4pm`

**Services**
1. **Dry Cleaning** — Suits, dresses, coats and delicates in GreenEarth silicone solvent, which is gentler on fabric than traditional perc and does not leave a smell.
2. **Laundered Shirts** — Washed, starched to your preference and hand-finished on a shirt press. Folded or on a hanger, your choice, no extra charge.
3. **Alterations** — In-house seamstress. Hems, taking in, zips, and full resizing. Most alterations back within four days.
4. **Leather & Suede** — Specialist cleaning and recolouring, sent to a dedicated partner. Allow two weeks and expect an honest assessment first.
5. **Wedding Dress Cleaning** — Clean, hand-finish, and acid-free boxing for storage. Twelve working days, and we photograph the dress before and after.
6. **Household Items** — Duvets, curtains, tablecloths and covers. We take curtains down and rehang them for a fee if you cannot manage it.

**How it works**
1. **Book** — Online in a minute, or call. Pick a two-hour collection window.
2. **We collect** — Driver texts fifteen minutes ahead. Leave the bag out if you are not in.
3. **We clean** — Every item is inspected and spot-treated before it goes anywhere near a machine.
4. **We deliver** — On hangers, covered, at a time you choose. Pay on delivery or on account.

**Care and guarantees**
1. **Hand-finished pressing** — Every garment is finished by a person on a press, not pulled through a tunnel. It is slower and it is why the collar sits properly.
2. **GreenEarth solvent** — Silicone-based, non-toxic, and biodegradable. Better for the fabric, considerably better for the people who work here.
3. **Re-clean guarantee** — If something comes back and you are not happy, bring it in within seven days and we clean it again free. No form, no argument.

**Business accounts** — `Hotels, restaurants and offices across Reading. Scheduled collections, itemised monthly invoicing, and a named contact. Linen, uniforms, aprons and table covers at account rates.`

**FAQ**
1. **Can you get this stain out?** — Usually, and we will tell you honestly when we cannot. Tell us what caused it and how long ago — that changes the treatment more than anything.
2. **What if I miss my delivery window?** — We leave it with a neighbour or in your safe place if you have set one, or rebook free of charge.
3. **Do you clean wedding dresses?** — Yes, including boxing for storage. Allow twelve working days and bring it in as soon after the day as you can.
4. **What cannot be cleaned?** — Anything with a do-not-clean label, some heavily beaded pieces, and most fake leather. We will check before we take it.
5. **What happens if you damage something?** — We are insured and we settle fairly against the item's age and value. It is rare, and we do not argue about it when it happens.
6. **Do I have to be in for collection?** — No. Leave the bag in a safe place and tell us where when you book.

**Find us** — `Shop 1: 44 Kings Road, Reading RG1 3BJ` · `Shop 2: 12 Peach Street, Wokingham RG40 1XJ`
Mon–Fri 7:30–18:30 · Sat 8:30–16:00 · Sun closed

**Footer** — PRESSED & CO. · `Dropped off Monday. Back Thursday.` · `0118 555 0140` · GreenEarth accredited cleaner · Company registration 03219884 · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-accordion": "^1.2.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
