# Apex Motors — Car Dealership Website Prompt

## 1. Goal Statement
Build a high-gloss car dealership website for **Apex Motors**, defined by near-black surfaces, electric blue accents, and cinematic vehicle photography — with the two things buyers actually use up front: a filterable inventory grid and a monthly payment calculator that updates as they drag.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(220, 14%, 8%);        /* #12141a near-black */
  --foreground: hsl(210, 16%, 95%);       /* #eff1f4 */
  --primary: hsl(206, 100%, 52%);         /* #0a90ff electric blue */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(215, 10%, 58%);
  --border: hsl(220, 12%, 20%);
  --card: hsl(220, 13%, 12%);
  --card-elevated: hsl(220, 12%, 16%);
  --success: hsl(152, 62%, 44%);          /* availability badges */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- **H1 / hero:** `'Sora', sans-serif;` weight 800, clamp(40px, 5.6vw, 88px), letter-spacing: -0.035em, line-height: 1.0
- **H2:** Sora 700, 32–48px, letter-spacing: -0.025em
- **H3 / vehicle names:** Sora 600, 18–22px
- **Body:** Inter 300–400, 16px, line-height: 1.7
- **Eyebrows / labels:** Inter 600, uppercase, letter-spacing: 0.18em, 11px, blue
- **Prices / payments / specs:** Sora 700, tabular-nums

---

## 5. Visual Effects

### Effect 1 — Inventory Filter Grid
```tsx
const [filters, setFilters] = useState({ type: 'All', make: 'All', maxPrice: 90000 });
const filtered = useMemo(
  () => inventory.filter(v =>
    (filters.type === 'All' || v.type === filters.type) &&
    (filters.make === 'All' || v.make === filters.make) &&
    v.price <= filters.maxPrice
  ),
  [filters]
);

<div className="sticky top-[76px] z-30 border-y border-[var(--border)] bg-[var(--background)]/95 backdrop-blur py-4">
  <div className="flex flex-wrap items-center gap-3">
    {/* Select chips for type and make, plus a price range slider with a live label */}
    <span className="ml-auto text-sm text-[var(--muted-foreground)]">
      {filtered.length} vehicles
    </span>
  </div>
</div>

<motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <AnimatePresence mode="popLayout">
    {filtered.map(v => (
      <motion.article
        key={v.id}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* vehicle card */}
      </motion.article>
    ))}
  </AnimatePresence>
</motion.div>
```

### Effect 2 — Payment Calculator
```tsx
const [price, setPrice] = useState(42000);
const [down, setDown] = useState(5000);
const [term, setTerm] = useState(60);
const apr = 0.069;
const principal = Math.max(price - down, 0);
const r = apr / 12;
const monthly = Math.round((principal * r) / (1 - Math.pow(1 + r, -term)));

<div className="rounded-2xl border border-[var(--border)] bg-[var(--card-elevated)] p-8">
  {/* Three sliders: vehicle price, down payment, term (36/48/60/72) */}
  <div className="mt-8 text-center">
    <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Estimated monthly</span>
    <motion.div key={monthly} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className="font-display text-6xl tabular-nums text-[var(--primary)]">
      ${monthly}
    </motion.div>
    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
      {term} months at {(apr * 100).toFixed(1)}% APR · Estimate only, subject to credit approval
    </p>
  </div>
</div>
```

### Effect 3 — Vehicle Card Hover with Spec Reveal
```jsx
<div className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
  <div className="relative aspect-[16/10] overflow-hidden">
    {/* Image: modern car three-quarter front view on a clean dark studio floor, dramatic rim lighting, glossy reflective paint, high contrast automotive photography */}
    <img src="" alt="Vehicle exterior" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
    <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: 'var(--success)', color: '#04180f' }}>
      In stock
    </span>
  </div>
  <div className="p-5">
    <h3 className="font-display text-xl">2024 Aurora GT Line</h3>
    <div className="mt-1 text-sm text-[var(--muted-foreground)]">12,400 mi · AWD · Certified Pre-Owned</div>
    <div className="mt-4 flex items-end justify-between">
      <span className="font-display text-2xl tabular-nums">$42,900</span>
      <span className="text-sm text-[var(--primary)]">or $612/mo</span>
    </div>
  </div>
</div>
```

### Effect 4 — Blue Glow Fade-Up
```
initial={{ opacity: 0, y: 28 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 76px, `fixed top-0 z-40`, `rgba(18,20,26,0.92)` with blur, 1px bottom border
- Left: "APEX" (Sora 800) + blue chevron mark + "MOTORS" (Inter 600, 9px, letterspaced)
- Center: Inventory · Financing · Trade-In · Service · About
- Right: phone (Inter 600) + `Browse Inventory` (blue filled, rounded-full)
- Mobile: wordmark + hamburger; full-screen dark overlay menu

### Section 2 — Hero (Cinematic, Full-Bleed)
- `h-screen`, content centred-left, `pl-6 md:pl-16`
```jsx
{/* Image: sleek modern car on a wet city street at night, neon and streetlight reflections on the paint, cinematic automotive photography, deep blacks and electric blue highlights */}
<img src="" alt="Vehicle on a wet city street at night" className="absolute inset-0 h-full w-full object-cover object-center" />
<div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(18,20,26,0.95) 0%, rgba(18,20,26,0.6) 45%, rgba(18,20,26,0.25) 100%)' }} />
```
- Eyebrow: `MIAMI, FL · 340 VEHICLES IN STOCK · OPEN 7 DAYS`
- H1: `Find it. Finance it.\nDrive it home\ntoday.`
- Subline: `New and certified pre-owned across twelve makes, with transparent pricing and no four-hour finance office marathon.`
- CTA row: `Browse Inventory` (blue filled) + `Value My Trade` (white ghost)
- Quick-search bar (glassy card): Make · Model · Max payment · `Search` button

### Section 3 — Trust Strip
- `--card`, thin, 4 items with blue icons: `No-haggle pricing` · `7-day return policy` · `172-point inspection` · `4.8★ from 2,100+ reviews`

### Section 4 — Inventory
- `--background`, eyebrow `IN STOCK NOW` + H2 `Browse Inventory`
- **Sticky filter bar** (Effect 1) beneath the section heading
- **3-col vehicle grid** (Effect 3), 9 vehicles shown
- `Load more` button + `View all 340 vehicles →`

### Section 5 — Payment Calculator
- `--card` background, 2-col split
- Left: eyebrow `FINANCING`, H2 `Know the Payment Before You Come In`, short paragraph, 3 bullet trust points
- Right: calculator card (Effect 2)
- Below: `Get Pre-Qualified` button + `Soft credit check only — does not affect your score.`

### Section 6 — Trade-In
- `--background`, 2-col
- Left: full-bleed image
```jsx
{/* Image: car keys being handed across a counter, shallow depth of field, warm interior dealership lighting, candid moment */}
```
- Right: eyebrow `TRADE-IN`, H2 `Your Car Is Worth More Than You Think`, 3-step process, and a compact form — Year / Make / Model / Mileage / Condition → `Get My Offer`
- Note: `Offers are good for 7 days and 500 miles, whether or not you buy from us.`

### Section 7 — How Buying Works
- `--card`, 4-step horizontal timeline with blue connecting line
- Browse · Pre-qualify · Test drive · Sign and go
- Each: blue numbered circle, title, 2-sentence description, typical duration

### Section 8 — Service Department
- `--background`, 3-col cards: Scheduled Maintenance · Repairs & Diagnostics · Parts & Accessories
- Each: icon, title, description, `Schedule Service →`
- Below: service hours block

### Section 9 — Reviews
- `--card`, 3 review cards with star row, quote, name, and a `Purchased 2024 Aurora GT` line

### Section 10 — Final CTA
- Full-bleed blue gradient band (`linear-gradient(120deg, #0a90ff, #0b5ed7)`), white text
- H2 `340 vehicles. One afternoon.` + short line + white filled CTA `Browse Inventory` + large phone number

### Section 11 — Footer
- `hsl(220, 16%, 5%)`, 4 columns: brand + address / Inventory / Financing + Trade-In / Service + Contact
- Hours block, social icons
- Bottom strip: © line, `Dealer License #DL-0448210`, privacy, and financing disclaimer: `Advertised payments are estimates and exclude tax, title, and dealer fees. Subject to credit approval.`

---

## 7. Animations

- **Hero:** H1 lines fade-up staggered 0.1s, 0.75s each; quick-search card scales `0.97 → 1` with a soft blue glow, 0.6s at 0.5s delay
- **Navbar:** background opacity increases from 0.7 to 0.92 after `scrollY > 50`, 0.3s
- **Filter changes:** `motion.div layout` with `AnimatePresence mode="popLayout"` re-flows the grid, 0.32s per card
- **Vehicle cards:** image scales 1 → 1.05 over 0.7s on hover; card border transitions to blue at 30% opacity, 0.25s
- **Calculator:** monthly figure re-mounts with `key={monthly}` and fades up 0.25s on every change; slider tracks fill blue
- **Timeline:** blue connecting line scales from left, 0.9s; step circles pop `scale 0.8 → 1` staggered 0.12s
- **Trust strip icons:** subtle blue glow pulse on entry, once, 0.6s
- **Final CTA:** gradient shifts `background-position` slowly, 8s ease-in-out infinite alternate

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: wordmark + hamburger; tap-to-call button pinned in the overlay menu
- Hero: `h-[85vh]`, H1 clamps to 40px, quick-search collapses to a single `Search inventory` button that opens a sheet
- Trust strip: 2x2 grid
- Filter bar: horizontally scrollable chips, `Filters` button opens a bottom sheet with all options
- Inventory: 1-col cards
- Calculator: sliders full-width, monthly figure sticky at the bottom of the section while dragging
- Trade-in: image above form
- Timeline: vertical with left-side blue line
- Service: 1-col

### Tablet (768–1024px)
- Inventory 2-col · calculator stays 2-col at tighter padding · service 3-col

### Desktop (> 1024px)
- Max width 1320px, `px-16`, `py-24`

---

## 9. Full Copy

### Brand
**APEX MOTORS** — Miami, Florida

### Navbar
Inventory · Financing · Trade-In · Service · About · `(305) 555-0190` · [Button] Browse Inventory

### Hero
- Eyebrow: `MIAMI, FL · 340 VEHICLES IN STOCK · OPEN 7 DAYS`
- H1: `Find it. Finance it. Drive it home today.`
- Subline: `New and certified pre-owned across twelve makes, with transparent pricing and no four-hour finance office marathon.`
- CTA 1: `Browse Inventory` · CTA 2: `Value My Trade`
- Quick search: `Make` · `Model` · `Max monthly payment` · [Button] `Search`

### Trust Strip
`No-haggle pricing` · `7-day return policy` · `172-point inspection` · `4.8★ from 2,100+ reviews`

### Inventory
Eyebrow: `IN STOCK NOW` — H2: `Browse Inventory`
Filters: `Type` (All · SUV · Sedan · Truck · EV · Coupe) · `Make` (All · 12 makes) · `Max price` slider

1. **2024 Aurora GT Line** — 12,400 mi · AWD · Certified Pre-Owned — `$42,900` · *or $612/mo*
2. **2023 Vantage EX SUV** — 21,800 mi · AWD · Certified Pre-Owned — `$36,500` · *or $521/mo*
3. **2025 Nimbus EV Long Range** — 1,200 mi · RWD · New — `$51,200` · *or $731/mo*
4. **2022 Ridgeback 4x4 Crew** — 38,600 mi · 4WD · Certified Pre-Owned — `$39,750` · *or $567/mo*
5. **2024 Corsa Sport Coupe** — 8,900 mi · RWD · Certified Pre-Owned — `$47,300` · *or $675/mo*
6. **2023 Meridian Touring** — 26,100 mi · FWD · Certified Pre-Owned — `$28,400` · *or $405/mo*
7. **2025 Vantage Hybrid** — 400 mi · AWD · New — `$44,900` · *or $641/mo*
8. **2021 Aurora Base** — 52,300 mi · FWD · Pre-Owned — `$21,900` · *or $313/mo*
9. **2024 Ridgeback Trail Edition** — 14,700 mi · 4WD · Certified Pre-Owned — `$48,600` · *or $694/mo*

### Financing
Eyebrow: `FINANCING` — H2: `Know the Payment Before You Come In`
Paragraph: `Nobody enjoys discovering their real payment after three hours in a windowless office. Run the numbers here, get pre-qualified with a soft credit check, and arrive knowing exactly what you are signing.`
- `Soft credit check for pre-qualification — no impact on your score`
- `We work with 22 lenders, including credit unions`
- `Rates from 4.9% APR for qualified buyers`
CTA: `Get Pre-Qualified` · Note: `Soft credit check only — does not affect your score.`

### Trade-In
Eyebrow: `TRADE-IN` — H2: `Your Car Is Worth More Than You Think`
1. **Tell us about it** — Year, make, model, mileage, and honest condition. Two minutes.
2. **Get a real number** — Not a range. An actual offer, backed by our current auction and retail data.
3. **Bring it in** — We verify the condition, and if it matches, the offer stands. Apply it to a purchase or take a cheque.
Form: `Year` / `Make` / `Model` / `Mileage` / `Condition` → [Button] `Get My Offer`
Note: `Offers are good for 7 days and 500 miles, whether or not you buy from us.`

### How Buying Works
Eyebrow: `THE PROCESS` — H2: `How Buying Works Here`
1. **Browse** *(as long as you like)* — Filter by payment rather than sticker price if that is how you actually budget. Every listing shows both.
2. **Pre-qualify** *(2 minutes)* — Soft credit check gives you a real rate and a real budget before anyone shakes your hand.
3. **Test drive** *(30–45 minutes)* — Take it on the highway, not around the block. Bring your car seat and check that it fits.
4. **Sign and go** *(about an hour)* — Paperwork is prepared before you arrive. No surprise add-ons in the finance office, because we do not sell them there.

### Service
Eyebrow: `SERVICE DEPARTMENT` — H2: `We Keep It Running`
1. **Scheduled Maintenance** (icon: `Wrench`) — Factory-interval service by certified technicians, with a loaner car on any job over three hours.
2. **Repairs & Diagnostics** (icon: `Gauge`) — Full diagnostic bay, OEM parts, and a written estimate before any work begins.
3. **Parts & Accessories** (icon: `Package`) — Genuine parts, roof racks, tow packages, and winter sets, fitted while you wait.
Hours: `Service: Mon–Fri 7am–6pm · Sat 8am–4pm · Sun closed`

### Reviews
1. `I filtered by monthly payment instead of price, which is how I actually think about a car. Took twenty minutes to find three options in my range.` — **Andre W.** · Purchased 2024 Aurora GT
2. `The trade-in offer they gave me online was the same number they gave me in person. I had budgeted a whole afternoon for that argument.` — **Sofia D.** · Purchased 2023 Vantage EX
3. `Finance office took fifty minutes and nobody tried to sell me paint protection. I did not know that was possible.` — **Kevin O.** · Purchased 2025 Nimbus EV

### Final CTA
H2: `340 vehicles. One afternoon.`
Subline: `Open seven days. Pre-qualify online, test drive today, and drive home in the same visit if the numbers work.`
CTA: `Browse Inventory` · Phone: `(305) 555-0190`

### Footer
- APEX MOTORS · `New & certified pre-owned · Miami, Florida`
- Address: `8800 Biscayne Boulevard, Miami, FL 33138`
- Sales hours: `Mon–Sat 9am–8pm · Sun 11am–6pm`
- Dealer License #DL-0448210
- © 2026 Apex Motors LLC. All rights reserved. · Privacy Policy · Accessibility
- Disclaimer: `Advertised payments are estimates and exclude tax, title, and dealer fees. Subject to credit approval. Vehicle availability changes daily.`

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-slider": "^1.2.0",
  "@radix-ui/react-select": "^2.1.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

**Tailwind config additions:**
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'apex-black': '#12141a',
        'apex-blue': '#0a90ff',
        'apex-green': '#2bb673',
      },
    },
  },
};
```
