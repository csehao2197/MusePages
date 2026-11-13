# Blocklane Storage — Self Storage Website Prompt

## 1. Goal Statement
Build a utilitarian, conversion-focused self storage website for **Blocklane Storage**, defined by concrete grey, steel white, and a single high-visibility orange — where the entire page exists to answer one question: which unit size do I need and what does it cost.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(210, 16%, 97%);      /* #f5f7f8 steel white */
  --foreground: hsl(214, 22%, 15%);      /* #1e262e */
  --primary: hsl(24, 94%, 52%);          /* #f9700f high-vis orange */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(214, 8%, 45%);
  --border: hsl(210, 14%, 87%);
  --card: hsl(210, 18%, 93%);
  --steel: hsl(214, 20%, 26%);           /* dark bands */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **H1:** Barlow Condensed 700, uppercase, clamp(42px, 6vw, 88px), letter-spacing 0.01em
- **H2:** Barlow Condensed 600, uppercase, 32–50px
- **H3 / unit sizes:** Barlow Condensed 600, 20–24px
- **Body:** Inter 300–400, 16px, line-height 1.7
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.18em, 11px, orange
- **Prices / dimensions:** Barlow Condensed 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Unit size selector with visual comparison.** A row of size cards where selecting one swaps an illustration and a plain-English comparison — a garden shed, a single garage, a transit van load. This is the core interaction of the page.

```tsx
const sizes = [
  { id: 25,  label: '25 sq ft', fits: 'A garden shed. Boxes, a bike, seasonal things.',       price: 22 },
  { id: 50,  label: '50 sq ft', fits: 'A single room of furniture, or a small flat move.',    price: 38 },
  { id: 100, label: '100 sq ft', fits: 'A one-bedroom flat, or a single garage worth.',       price: 62 },
  { id: 200, label: '200 sq ft', fits: 'A three-bedroom house, or a transit van and a half.', price: 108 },
];
const [sel, setSel] = useState(50);
const unit = sizes.find(s => s.id === sel)!;

<AnimatePresence mode="wait">
  <motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
    <p className="text-lg">{unit.fits}</p>
    <p className="mt-3 font-display text-5xl tabular-nums">£{unit.price}<span className="text-base"> /week</span></p>
  </motion.div>
</AnimatePresence>
```

**Effect 2 — Diagonal hazard corner.** Each pricing card carries a small 45-degree orange and steel striped triangle in its top-right corner, drawn with a repeating linear gradient and clipped with `clip-path: polygon(100% 0, 0 0, 100% 100%)`.

## 6. Component Breakdown

1. **Navbar** — 72px, sticky, steel white, 1px bottom border. Blocky wordmark left, links centre, phone number and `Reserve a Unit` orange square button right.
2. **Hero** — 76vh, split. Text left, facility photograph right with a slight orange colour cast. Eyebrow, condensed H1, subline, two CTAs, four trust points. *Image: clean modern self storage facility corridor, roller doors in a row, bright even lighting, wide angle.*
3. **Size selector** — the primary section, immediately under the hero (Effect 1). Four size cards, a comparison line, a weekly price, and a `Reserve this size` CTA.
4. **All sizes table** — every unit size with dimensions, weekly and monthly price, availability badge, and a reserve link.
5. **What you get** — 2x3 grid: 24/7 access, individual alarms, CCTV, drive-up loading, free trolleys, no deposit.
6. **How it works** — four numbered steps from reserving online to moving in the same day.
7. **Business storage** — split band on `--steel`: stock overflow, archive, and trade tool storage, with a note on delivery acceptance.
8. **Packing supplies** — a compact price list of boxes, tape, bubble wrap, and covers.
9. **FAQ** — accordion, six questions on notice periods, insurance, access hours, and what cannot be stored.
10. **Find us** — address, access hours, office hours, map, and directions from the ring road.
11. **Footer** — steel dark, four columns, orange top rule, company registration.

## 7. Animations
- Hero: H1 reveals with a `clipPath` line wipe, 0.7s; trust points stagger 0.05s
- Size cards: selected card gets a 3px orange border and lifts `-3px`, 0.2s; the comparison text swaps with `AnimatePresence`, 0.25s
- Price figure: re-mounts on change and fades up 0.25s
- Table rows: fade in staggered 0.03s; availability badge pulses once on entry
- Steps: orange connecting line `scaleX 0 → 1`, 0.8s
- Everything is fast and mechanical — no easing longer than 0.4s anywhere on this site

## 8. Responsive
- **Mobile (<768px):** hamburger; H1 clamps to 42px; size selector becomes a horizontally scrollable chip row with the comparison and price beneath; all-sizes table becomes stacked cards; `Reserve a Unit` pinned as a sticky bottom bar; steps vertical.
- **Tablet:** size cards 2x2, features 3-col, table keeps full form.
- **Desktop:** max width 1200px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** BLOCKLANE STORAGE · Leeds

**Navbar:** Sizes & Prices · What You Get · Business · Supplies · Find Us · `0113 555 0155` · [Button] Reserve a Unit

**Hero**
- Eyebrow: `LEEDS · 24/7 ACCESS · NO DEPOSIT · FIRST MONTH HALF PRICE`
- H1: `PICK A SIZE. MOVE IN TODAY.`
- Subline: `Clean, alarmed, drive-up storage units off the A61. Reserve online in two minutes, no deposit, and cancel with a week's notice.`
- CTAs: `See Sizes & Prices` · `Reserve a Unit`
- Trust points: `No deposit` · `One week notice` · `24/7 gate access` · `Free trolleys and parking`

**Size selector** — Eyebrow `FIND YOUR SIZE` — H2 `HOW MUCH SPACE DO YOU ACTUALLY NEED?`
- **25 sq ft** — A garden shed. Boxes, a bike, seasonal things. — £22/week
- **50 sq ft** — A single room of furniture, or a small flat move. — £38/week
- **100 sq ft** — A one-bedroom flat, or a single garage worth. — £62/week
- **200 sq ft** — A three-bedroom house, or a transit van and a half. — £108/week

Note: `Not sure? Reserve one size up. Moving between units is free and takes ten minutes.`

**All sizes**
| Size | Dimensions | Weekly | Monthly | Availability |
|---|---|---|---|---|
| 10 sq ft | 5' × 2' × 8' | £12 | £48 | Available |
| 25 sq ft | 5' × 5' × 8' | £22 | £88 | Available |
| 35 sq ft | 5' × 7' × 8' | £29 | £116 | 2 left |
| 50 sq ft | 10' × 5' × 8' | £38 | £152 | Available |
| 75 sq ft | 10' × 7.5' × 8' | £49 | £196 | Available |
| 100 sq ft | 10' × 10' × 8' | £62 | £248 | 1 left |
| 150 sq ft | 15' × 10' × 8' | £85 | £340 | Available |
| 200 sq ft | 20' × 10' × 8' | £108 | £432 | Available |

**What you get**
1. **24/7 gate access** (icon: `KeyRound`) — Your own PIN, any hour, every day of the year including Christmas.
2. **Individually alarmed units** (icon: `BellRing`) — Every unit has its own alarm linked to the site system, not just a perimeter fence.
3. **CCTV throughout** (icon: `Cctv`) — Recorded and retained for thirty days, covering every corridor and both gates.
4. **Drive-up loading** (icon: `Truck`) — Park within a few metres of most ground-floor units. No long corridors with a wardrobe.
5. **Free trolleys and pallet trucks** (icon: `ShoppingCart`) — Available at both entrances, no booking, no charge.
6. **No deposit** (icon: `Wallet`) — Pay for the first period and move in. Leave with a week's notice and we refund the remainder.

**How it works**
1. **Pick a size** — Use the comparison above, or call and describe what you are storing.
2. **Reserve online** — Two minutes, no card details required to hold a unit for 48 hours.
3. **Sign and pay on arrival** — Bring photo ID and proof of address. Takes about ten minutes.
4. **Move in the same day** — Get your PIN, get your key, and start unloading.

**Business storage** — `Stock overflow, document archive, and trade tool storage from 25 sq ft up. We accept and sign for deliveries during office hours at no extra cost, and you can access your unit before the office opens.`

**Supplies** — Small box £1.60 · Large box £2.40 · Wardrobe box £6.50 · Packing tape £2.20 · Bubble wrap 10m £6 · Mattress cover £4.50 · Sofa cover £6

**FAQ**
1. **What is the minimum stay?** — One week. After that you can leave any time with seven days notice.
2. **Do I need insurance?** — Yes, and you can either use your own contents policy or take ours from £3.50 a week.
3. **What are the access hours?** — Gate access is 24/7 with your PIN. The office is staffed Mon–Fri 8:30–17:30 and Sat 9:00–16:00.
4. **What cannot be stored?** — Anything living, perishable, flammable, explosive, or illegal. No fuel, gas bottles, or paint. If you are unsure, call and ask.
5. **Can I change unit size later?** — Yes, free, and usually the same day if we have the size available.
6. **Is there parking?** — Free, and you can park directly outside most ground-floor units.

**Find us** — `Blocklane Storage, Kirkstall Road, Leeds LS4 2AX` · Gate 24/7 · Office Mon–Fri 8:30–17:30, Sat 9:00–16:00 · `Two minutes off the A61 ring road, follow signs for Kirkstall Retail Park.`

**Footer** — BLOCKLANE STORAGE · `Pick a size. Move in today.` · `0113 555 0155` · Company registration 08842019 · © 2026

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
