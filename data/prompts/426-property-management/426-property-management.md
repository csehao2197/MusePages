# Keystone Property Group — Property Management Website Prompt

## 1. Goal Statement
Build a dual-audience property management website for **Keystone Property Group**, defined by clean white space, a confident forest green, and a hard split between two visitor types — owners looking for a manager, and tenants looking for a portal — resolved at the hero rather than buried in the nav.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(158, 22%, 13%);      /* #1a2a25 deep green-black */
  --primary: hsl(158, 44%, 24%);         /* #23583f forest green */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(158, 6%, 45%);
  --border: hsl(150, 14%, 89%);
  --card: hsl(150, 26%, 97%);            /* faint green-tinted card */
  --accent-tenant: hsl(206, 62%, 42%);   /* blue for tenant-side actions */
  --accent-gold: hsl(38, 72%, 52%);      /* highlight for stats */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- **H1 / hero:** `'Fraunces', serif;` weight 600, `font-optical-sizing: auto`, clamp(38px, 4.8vw, 66px), line-height: 1.08
- **H2:** Fraunces 600, 32–44px
- **H3:** Inter 600, 18–21px
- **Body:** Inter 300–400, 17px, line-height: 1.75
- **Eyebrows:** Inter 600, uppercase, letter-spacing: 0.16em, 11px
- **Numbers / fees / metrics:** Fraunces 600, tabular-nums

---

## 5. Visual Effects

### Effect 1 — Dual-Path Hero Split
```tsx
// Two large hover-responsive panels; on mobile they stack as full-width cards
const paths = [
  { key: 'owner',  label: 'I own a property',  sub: 'Get a free rent analysis', color: 'var(--primary)' },
  { key: 'tenant', label: 'I rent a home',     sub: 'Pay rent or submit a request', color: 'var(--accent-tenant)' },
];

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {paths.map((p, i) => (
    <motion.a
      key={p.key}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
      className="group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: 'var(--border)' }}
    >
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-400 group-hover:scale-x-100" style={{ background: p.color }} />
      <div className="font-serif text-2xl">{p.label}</div>
      <div className="mt-2 text-[var(--muted-foreground)]">{p.sub}</div>
      <div className="mt-6 inline-flex items-center gap-2 font-medium" style={{ color: p.color }}>
        Continue <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>
    </motion.a>
  ))}
</div>
```

### Effect 2 — Management Fee Calculator
```tsx
const [rent, setRent] = useState(2200);
const [units, setUnits] = useState(1);
const rate = units >= 5 ? 0.07 : units >= 2 ? 0.075 : 0.08;
const monthlyFee = Math.round(rent * units * rate);

<input
  type="range" min={800} max={6000} step={50}
  value={rent} onChange={e => setRent(Number(e.target.value))}
  className="w-full accent-[var(--primary)]"
/>
<div className="mt-6 rounded-xl bg-[var(--card)] p-6 text-center">
  <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Estimated monthly fee</div>
  <div className="font-serif text-5xl tabular-nums text-[var(--primary)]">${monthlyFee}</div>
  <div className="mt-2 text-sm text-[var(--muted-foreground)]">{(rate * 100).toFixed(1)}% of collected rent · no leasing fee on renewals</div>
</div>
```

### Effect 3 — Service Comparison Table (Us vs Self-Managing)
```
Two-column comparison with check and dash icons; our column has a green tint background
and a 2px green top border. Rows animate in with a 60ms stagger.
```

### Effect 4 — Fade-Up
```
initial={{ opacity: 0, y: 22 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 74px, `sticky top-0 z-40`, white, 1px bottom border always
- Left: keystone-shape SVG mark in green + "KEYSTONE" (Fraunces 600) + "PROPERTY GROUP" (Inter 600, 9px)
- Center: Services · Pricing · Areas We Serve · Owners · Tenants
- Right: `Tenant Login` (blue text link) + `Free Rent Analysis` (green filled button)
- Mobile: mark + hamburger; overlay menu with the two paths pinned to the top

### Section 2 — Hero (Dual Path)
- `min-h-[80vh]`, centered content, max-w-4xl, white background with a faint green radial wash top-right
- Eyebrow: `AUSTIN & CENTRAL TEXAS · MANAGING 1,100+ DOORS`
- H1: `Own the property.\nSkip the 11pm\nplumbing calls.`
- Subline: `Full-service residential property management for single-family homes, duplexes, and small multifamily across the Austin metro.`
- **Dual-path panels** (Effect 1) directly beneath the subline
- Trust strip below: `TREC Licensed #9008412` · `NARPM Member` · `Average 19 days to lease` · `98.2% rent collection`

### Section 3 — Owner Value Props
- `--card` background, eyebrow `FOR OWNERS` + H2 `What You Stop Doing`
- **3-col grid**, each card: green icon in a pale circle, title, 2-sentence description
- Tenant screening · Rent collection & accounting · Maintenance coordination

### Section 4 — Full Service List
- White, 2-col split: left sticky heading block, right a hairline-separated list of 10 services
- Each row: service name (Inter 600), one-line description, and a small `Included` badge in green

### Section 5 — Pricing + Calculator
- `--card`, eyebrow `PRICING` + H2 `Simple Percentage. No Surprises.`
- Left col: fee calculator (Effect 2) with rent slider and unit stepper
- Right col: three fee-structure cards — Single Home 8% · 2–4 Units 7.5% · 5+ Units 7% — each listing what is included and what costs extra
- Below: honest note about the one-time leasing fee

### Section 6 — Comparison
- White, eyebrow `THE MATH` + H2 `Managed vs Self-Managed`
- Comparison table (Effect 3): 10 rows across Keystone / Self-managing
- Below table: short paragraph on vacancy cost being the real expense

### Section 7 — Tenant Section
- Blue-tinted band (`--accent-tenant` at 6% opacity), eyebrow `FOR TENANTS` + H2 `Renting With Keystone`
- 3-col: **Pay Rent Online** · **Submit a Maintenance Request** · **24/7 Emergency Line**
- Each with blue icon and blue outline CTA
- Below: `Available rentals →` link to listings

### Section 8 — Areas We Serve
- White, 2-col: left a simple list of 12 neighbourhoods/suburbs in two columns with green bullet dots; right a muted map image
```jsx
{/* Image: stylised minimal map of a metro area with neighbourhood boundaries, muted green and grey palette, clean cartographic style */}
```

### Section 9 — Owner Testimonials
- `--card`, 3 quote cards with green quote mark, name, and a small line like `Owner since 2019 · 3 doors`

### Section 10 — FAQ
- White, centered max-w-3xl accordion, 6 questions

### Section 11 — Final CTA
- Full-bleed green, white text: H2 `Find out what your property should rent for.` + short line + white filled CTA `Get a Free Rent Analysis` + phone

### Section 12 — Footer
- Deep green-black, 4 columns: brand + license / Owners / Tenants / Contact
- Bottom strip: Equal Housing Opportunity logo text, TREC info link, © line

---

## 7. Animations

- **Hero:** H1 fades up 0.7s; subline 0.5s at +0.2s; dual-path panels stagger in at 0.5s and 0.62s
- **Path panels:** bottom 1px accent bar scales from 0 → 1 (originX left) over 0.4s on hover; card lifts `-4px`
- **Calculator:** fee number transitions with a spring on change, 0.35s; slider track fills green
- **Comparison rows:** stagger `i * 0.06`, fade-up; check icons pop with `scale 0.7 → 1`, 0.3s
- **Service list rows:** hairline dividers scale in from left, 0.5s, staggered
- **Testimonials:** fade-up 0.62s stagger 0.1s
- **Final CTA:** green background fades from `--card` to green as the section enters view, 0.8s

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: mark + hamburger; `Tenant Login` pinned inside the overlay menu top
- Hero: H1 clamps to 38px; dual-path panels stack full-width, owner panel first
- Trust strip: 2x2 grid
- Owner value props: 1-col
- Service list: heading stacks above list, list rows become 2-line
- Pricing: calculator first, fee cards below in 1-col
- Comparison table: becomes stacked cards, one per row, with both columns shown as labelled lines
- Areas: single list column, map below
- FAQ: full width

### Tablet (768–1024px)
- Dual-path panels stay 2-col · value props 3-col at tighter padding · comparison table retains 2 columns

### Desktop (> 1024px)
- Max width 1200px, `px-16`, generous `py-24`

---

## 9. Full Copy

### Brand
**KEYSTONE PROPERTY GROUP** — Austin, Texas

### Navbar
Services · Pricing · Areas We Serve · Owners · Tenants · `Tenant Login` · [Button] Free Rent Analysis

### Hero
- Eyebrow: `AUSTIN & CENTRAL TEXAS · MANAGING 1,100+ DOORS`
- H1: `Own the property. Skip the 11pm plumbing calls.`
- Subline: `Full-service residential property management for single-family homes, duplexes, and small multifamily across the Austin metro.`
- Path 1: `I own a property` — *Get a free rent analysis*
- Path 2: `I rent a home` — *Pay rent or submit a request*
- Trust strip: `TREC Licensed #9008412` · `NARPM Member` · `Average 19 days to lease` · `98.2% rent collection`

### Owner Value Props
Eyebrow: `FOR OWNERS` — H2: `What You Stop Doing`
1. **Screening tenants** (icon: `UserCheck`) — Credit, criminal, eviction history, income verification, and landlord references on every applicant. We decline more people than we approve, and that is the point.
2. **Chasing rent** (icon: `Wallet`) — Automated collection, clear late policy, and enforcement that does not require you to have an awkward conversation. Owner draws hit your account by the 10th.
3. **Coordinating maintenance** (icon: `Wrench`) — Licensed vendors, no markup on invoices, and a spend limit you set. You approve anything above it; below it, we just handle it.

### Full Service List
Eyebrow: `INCLUDED` — H2: `Everything in the Management Fee`
1. **Marketing & Listing Syndication** — Professional photos and distribution to 40+ rental sites within 48 hours of go-live.
2. **Tenant Screening** — Full background, credit, income, and rental history checks on every adult applicant.
3. **Lease Preparation & Execution** — Texas-compliant lease, digital signing, and all required disclosures.
4. **Rent Collection** — Online payments, automatic late fees, and clear escalation if rent is missed.
5. **Owner Accounting & Statements** — Monthly statements, year-end 1099, and downloadable ledgers any time.
6. **Maintenance Coordination** — Vetted licensed vendors, no invoice markup, and photo documentation on every job.
7. **24/7 Emergency Response** — A real person answers the emergency line, day or night.
8. **Property Inspections** — Move-in, move-out, and annual mid-lease inspections with photo reports.
9. **Lease Renewals** — Market-rate analysis and renewal negotiation. No fee when a tenant renews.
10. **Eviction Management** — Filing, coordination with counsel, and court attendance if it comes to that.

### Pricing
Eyebrow: `PRICING` — H2: `Simple Percentage. No Surprises.`
- **Single Home — 8% of collected rent** — All services included · One-time leasing fee of 50% of first month · No renewal fee · No markup on maintenance
- **2–4 Units — 7.5% of collected rent** — Everything above · Consolidated statements across units · Priority vendor scheduling
- **5+ Units — 7% of collected rent** — Everything above · Dedicated portfolio manager · Quarterly performance review
Note: `The only additional cost is the one-time leasing fee when we place a new tenant. We do not charge setup fees, technology fees, inspection fees, or a markup on any vendor invoice. If a fee is not on this page, it does not exist.`

### Comparison
Eyebrow: `THE MATH` — H2: `Managed vs Self-Managed`
| | Keystone | Self-managing |
| Listing on 40+ sites | Included | You post individually |
| Full applicant screening | Included | Usually credit only |
| 24/7 emergency line | Included | Your phone |
| Vetted licensed vendors | Included | Whoever answers |
| Vendor invoice markup | None | N/A |
| Texas-compliant lease | Included | Template you found online |
| Late rent enforcement | Automated | An awkward text |
| Annual inspections | Included | Rarely happen |
| Eviction handling | Managed | You in court |
| Average days to lease | 19 | 34 (market average) |

Paragraph: `A month of vacancy on a $2,200 home costs more than three months of management. Most owners who run the numbers are not comparing our fee to zero — they are comparing it to the vacancy, the turnover, and the weekend they lost to a water heater.`

### Tenant Section
Eyebrow: `FOR TENANTS` — H2: `Renting With Keystone`
1. **Pay Rent Online** (icon: `CreditCard`) — Card, bank transfer, or autopay through the tenant portal. Receipts are instant.
2. **Submit a Maintenance Request** (icon: `Wrench`) — Upload photos, track status, and get a vendor scheduled without a phone call.
3. **24/7 Emergency Line** (icon: `Phone`) — Burst pipe, no heat, no power, or a lockout — call `(512) 555-0188` any hour.
Link: `Available rentals →`

### Areas We Serve
Eyebrow: `COVERAGE` — H2: `Where We Manage`
`Central Austin` · `South Congress` · `East Austin` · `Mueller` · `Cedar Park` · `Round Rock` · `Pflugerville` · `Georgetown` · `Leander` · `Kyle` · `Buda` · `Dripping Springs`

### Testimonials
1. `I live in California and own three houses in Austin. I have not thought about any of them in four years. That is the entire review.` — **Priya N.**, Owner since 2019 · 3 doors
2. `They talked me out of a tenant I wanted to approve. That tenant was evicted from another property nine months later. I stopped second-guessing them after that.` — **Marcus H.**, Owner since 2021 · 1 door
3. `The monthly statement is genuinely readable, which sounds like a low bar until you have used a company where it is not.` — **Ellen R.**, Owner since 2017 · 6 doors

### FAQ
1. **How quickly can you lease my property?** — Our current average is 19 days from listing to signed lease, against a market average of 34. Homes priced above market analysis take longer, and we will tell you honestly when that is the case.
2. **Do you mark up maintenance invoices?** — No. You pay exactly what the vendor charges, and every invoice is attached to your monthly statement.
3. **What happens if a tenant stops paying?** — Late notices go out automatically on day four. If it escalates, we file, coordinate with counsel, and attend court on your behalf. You are kept informed but do not need to appear.
4. **Can I use my own contractor?** — Yes. Give us the contact and spend authority and we will schedule through them.
5. **Am I locked into a contract?** — The agreement is annual with a 30-day termination clause, and no termination penalty after the first 90 days.
6. **Do you manage short-term rentals?** — No. We only manage long-term residential leases of twelve months or more.

### Final CTA
H2: `Find out what your property should rent for.`
Subline: `A free rent analysis takes about ten minutes and includes comparable listings, a suggested rate, and an honest estimate of days on market.`
CTA: `Get a Free Rent Analysis` · Phone: `(512) 555-0188`

### Footer
- KEYSTONE PROPERTY GROUP · `Full-service residential property management, Austin metro.`
- Address: `2601 South Lamar Boulevard, Suite 210, Austin, TX 78704`
- TREC Licensed Broker #9008412 · Equal Housing Opportunity
- © 2026 Keystone Property Group. All rights reserved. · Privacy · TREC Consumer Protection Notice

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-slider": "^1.2.0",
  "@radix-ui/react-accordion": "^1.2.0",
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
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'ks-green': '#23583f',
        'ks-blue': '#2a72b8',
        'ks-ink': '#1a2a25',
      },
    },
  },
};
```
