# Northfield Partners — Management Consulting Firm Website Prompt

## 1. Goal Statement
Build a restrained, Swiss-grid management consulting website for **Northfield Partners**, defined by pure white space, a single deep navy, and a strict 12-column typographic system — confidence expressed through precision rather than decoration.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(0, 0%, 100%);        /* pure white */
  --foreground: hsl(218, 30%, 12%);      /* #161d28 near-black navy */
  --primary: hsl(218, 62%, 26%);         /* #19396b deep navy */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(218, 8%, 46%);
  --border: hsl(218, 14%, 90%);
  --card: hsl(218, 22%, 97%);
  --accent-rule: hsl(218, 62%, 26%);     /* hairline rules */
  --highlight: hsl(28, 88%, 54%);        /* single warm accent, used sparingly */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

- **H1 / hero:** Inter 600, clamp(40px, 5.2vw, 76px), letter-spacing: -0.03em, line-height: 1.05
- **H2:** Inter 600, 34–46px, letter-spacing: -0.02em
- **H3 / card titles:** Inter 500, 19–22px
- **Body:** Inter 300–400, 17px, line-height: 1.72
- **Eyebrows / section numbers:** `'IBM Plex Mono', monospace;` 500, uppercase, letter-spacing: 0.14em, 11px
- **Data / metrics:** Inter 700, tabular-nums, clamp(40px, 5vw, 72px)

---

## 5. Visual Effects

### Effect 1 — Hairline Grid System (visible structure)
```jsx
{/* Every major section is bounded by 1px hairlines; columns are divided by vertical rules on desktop */}
<section className="border-t border-[var(--border)]">
  <div className="mx-auto max-w-[1240px] grid grid-cols-1 md:grid-cols-12">
    <div className="md:col-span-4 md:border-r border-[var(--border)] px-6 md:px-10 py-16">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">01 / Capabilities</span>
    </div>
    <div className="md:col-span-8 px-6 md:px-10 py-16">{/* content */}</div>
  </div>
</section>
```

### Effect 2 — Metric Count-Up
```tsx
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';

function Metric({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1800, bounce: 0 });
  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => spring.on('change', v => {
    if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
  }), [spring, suffix]);
  return <span ref={ref} className="tabular-nums font-bold">0{suffix}</span>;
}
```

### Effect 3 — Case Study Row with Reveal-on-Hover Detail
```tsx
<a className="group grid grid-cols-12 items-baseline gap-4 border-b border-[var(--border)] py-8 transition-colors hover:bg-[var(--card)]">
  <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">2025</span>
  <span className="col-span-6 text-xl font-medium">Post-merger operating model, industrial manufacturer</span>
  <span className="col-span-3 text-sm text-[var(--muted-foreground)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    18% SG&A reduction in 11 months
  </span>
  <span className="col-span-1 text-right transition-transform duration-300 group-hover:translate-x-1">→</span>
</a>
```

### Effect 4 — Precise Fade-Up (no blur, no bounce)
```
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 72px, `fixed top-0 z-40`, white with 1px bottom hairline at all times
- Left: "NORTHFIELD" (Inter 600, tracking -0.01em) + mono superscript "PARTNERS"
- Center-right links: Capabilities · Industries · Our Work · Insights · About
- Far right: `Start a Conversation` — navy filled, 2px radius only
- Mobile: wordmark + hamburger; menu slides down as a white panel with hairline-separated rows

### Section 2 — Hero (Type-Dominant, No Image)
- `min-h-[88vh]`, 12-col grid, content in cols 1–9, top-aligned with `pt-40`
- Mono eyebrow: `MANAGEMENT CONSULTING · CHICAGO · SINCE 2004`
- H1: `We help operators\nmake the decision\nthey have been\ncircling for months.`
- Subline in col 1–6: `Northfield Partners works with mid-market industrial, healthcare, and financial services companies on the problems that do not fit neatly into a functional org chart.`
- CTA row: `Start a Conversation` (navy) + `See Our Work` (text link with arrow)
- Bottom of hero: hairline rule + 4 client-type labels in mono

### Section 3 — Metrics Band
- `--card` background, 4-col grid divided by vertical hairlines
- Each: large count-up number + mono label beneath
- `210+` Engagements delivered · `$4.1B` Client revenue influenced · `11` Average months to measurable impact · `84%` Repeat client rate

### Section 4 — Capabilities
- Hairline grid layout (Effect 1): left col mono label `01 / Capabilities`, right col content
- H2: `What We Are Actually Good At`
- **2-col list** of 6 capabilities, each with a number, title, and 2-sentence description, separated by hairlines
- No icons — numbers and type only

### Section 5 — Industries
- White, hairline top; left mono `02 / Industries`
- 4 industry blocks in a row on desktop, each with a short paragraph and a mono `→ View work` link
- Industrial Manufacturing · Healthcare Services · Financial Services · Private Equity Portfolio Ops

### Section 6 — Our Work
- `--card` background; left mono `03 / Selected Work`
- H2: `Selected Engagements`
- **Case study rows** (Effect 3), 6 rows, each: year, engagement title, outcome on hover, arrow
- Below: `Full case studies available under NDA on request.`

### Section 7 — Approach
- White, 12-col; left mono `04 / Approach`
- H2: `Four Weeks to a Point of View`
- 4-step horizontal process with hairline connectors, each step numbered in mono, title in Inter 500, 2-sentence description
- Right-aligned pull quote in Inter 300 italic, 24px, spanning cols 8–12

### Section 8 — People
- `--card`; left mono `05 / People`
- 4-col grid of partners
```jsx
{/* Image: corporate portrait, business attire, neutral seamless background, even soft lighting, composed and direct expression, editorial business photography */}
<img src="" alt="Partner portrait" className="w-full aspect-[4/5] object-cover object-center grayscale" />
```
- Each: name (Inter 500), mono role line, 1-sentence focus, `LinkedIn ↗` mono link

### Section 9 — Insights
- White; left mono `06 / Insights`
- 3 article rows with hairlines: mono date + category, Inter 500 title, 1-line excerpt, arrow

### Section 10 — Contact
- Navy full-bleed section, white text, 12-col
- Left cols 1–6: H2 `Tell us what is not working.` + short paragraph + direct email and phone
- Right cols 7–12: compact form — Name / Company / Email / What are you working on? (textarea) / `Send` button in `--highlight` orange (the only warm accent on the site)

### Section 11 — Footer
- White with hairline top, 4 columns of mono links + address
- Bottom strip: © line, `Chicago · New York · Toronto`, privacy link

---

## 7. Animations

- Deliberately restrained — this design signals seriousness, so no blur, bounce, or parallax
- **Hero:** H1 lines fade-up individually, 0.6s, stagger 0.08s; subline and CTAs follow at 0.35s
- **Hairline rules:** `scaleX 0 → 1`, originX 0, 0.7s on scroll entry
- **Metrics:** count-up 1800ms with spring `bounce: 0` (Effect 2)
- **Capability rows:** fade-up stagger `i * 0.06` (Effect 4)
- **Case study rows:** hover reveals outcome text (opacity 0 → 1, 0.3s) and nudges arrow `translateX(4px)`
- **Partner portraits:** stay grayscale; only a 1px navy bottom border animates in on hover
- **Navbar:** no transform on scroll — static and stable by design

---

## 8. Responsive

### Mobile (< 768px)
- All 12-col grids collapse to single column; vertical hairlines removed, horizontal hairlines retained
- Hero H1 clamps to 40px, subline full width, CTAs stacked
- Metrics: 2x2 grid with hairline cross
- Capabilities: 1-col, numbers inline before titles
- Case study rows: year and title on row one, outcome always visible (not hover-gated) on row two
- People: 2-col grid
- Contact: form stacks below heading block

### Tablet (768–1024px)
- 12-col grid becomes 8-col; Industries 2x2; People 2-col; case rows keep hover behaviour

### Desktop (> 1024px)
- Full 12-col grid, max-width 1240px, hairlines on all column gutters

---

## 9. Full Copy

### Brand
**NORTHFIELD PARTNERS** — Chicago, Illinois

### Navbar
Capabilities · Industries · Our Work · Insights · About · [Button] Start a Conversation

### Hero
- Eyebrow: `MANAGEMENT CONSULTING · CHICAGO · SINCE 2004`
- H1: `We help operators make the decision they have been circling for months.`
- Subline: `Northfield Partners works with mid-market industrial, healthcare, and financial services companies on the problems that do not fit neatly into a functional org chart.`
- CTA 1: `Start a Conversation` · CTA 2: `See Our Work →`
- Client-type labels: `MID-MARKET` · `PE-BACKED` · `FAMILY-HELD` · `POST-MERGER`

### Metrics
- `210+` — Engagements delivered
- `$4.1B` — Client revenue influenced
- `11` — Average months to measurable impact
- `84%` — Repeat client rate

### Capabilities
Mono label: `01 / CAPABILITIES` — H2: `What We Are Actually Good At`

1. **Operating Model Design** — We redraw how decisions, budgets, and accountability actually move through a company. Usually this means fewer committees and clearer owners.
2. **Post-Merger Integration** — The first 180 days decide whether a deal creates value or quietly destroys it. We run the integration office and force the hard sequencing calls early.
3. **Cost Transformation** — Not a hiring freeze and a travel policy. We find structural cost in procurement, footprint, and span-of-control, then hold the line on delivery.
4. **Commercial Strategy** — Pricing architecture, segment prioritisation, and sales coverage models for companies whose growth has flattened without an obvious cause.
5. **Supply Chain Resilience** — Network design, supplier concentration, and inventory policy — modelled against the disruptions that are actually likely, not every theoretical one.
6. **Performance Turnaround** — For businesses with a covenant problem and a short runway. We stabilise cash first, then fix the thing that caused it.

### Industries
Mono label: `02 / INDUSTRIES`

- **Industrial Manufacturing** — Plant footprint, throughput, and the operating discipline required when volume assumptions stop holding.
- **Healthcare Services** — Multi-site provider groups navigating payer pressure, staffing economics, and consolidation.
- **Financial Services** — Regional banks, insurers, and asset managers under cost and regulatory strain.
- **Private Equity Portfolio Ops** — Diligence support, value creation plans, and hands-on execution during the hold period.

### Selected Work
Mono label: `03 / SELECTED WORK` — H2: `Selected Engagements`

- `2025` — Post-merger operating model, industrial manufacturer — *18% SG&A reduction in 11 months*
- `2025` — Pricing architecture rebuild, specialty distributor — *420bps gross margin recovery*
- `2024` — Multi-site staffing model, regional health system — *$31M annualised labour savings*
- `2024` — Supply base consolidation, automotive supplier — *Tier-1 count reduced from 340 to 96*
- `2023` — Cash stabilisation and turnaround, family-held manufacturer — *Covenant compliance restored in two quarters*
- `2023` — Value creation plan, PE-backed services platform — *Adjusted EBITDA up 2.4x over hold*

Note: `Full case studies available under NDA on request.`

### Approach
Mono label: `04 / APPROACH` — H2: `Four Weeks to a Point of View`

1. **Week 1 — Framing** — We agree what question we are answering and what evidence would change our minds. Most engagements go wrong here, not later.
2. **Week 2 — Evidence** — Interviews, data pulls, and site visits. We prefer the plant floor to the data room, and we go to both.
3. **Week 3 — Synthesis** — We form a position and test it against the people who will have to live with it. Disagreement at this stage is cheap; disagreement at month six is not.
4. **Week 4 — Decision** — You get a recommendation, the reasoning behind it, and an honest assessment of what could go wrong. Then we help you execute it, or we hand it over cleanly.

Pull quote: `Most of our work is not discovering something nobody knew. It is making it impossible to keep avoiding something everybody suspected.`

### People
Mono label: `05 / PEOPLE`

1. **Margaret Ellison** — Managing Partner — Operating model and turnaround work for industrial and family-held businesses.
2. **David Osei** — Partner — Post-merger integration and PE portfolio operations across services platforms.
3. **Hana Petrova** — Partner — Commercial strategy and pricing for distribution and specialty manufacturing.
4. **Ryan Callahan** — Partner — Supply chain network design and procurement transformation.

### Insights
Mono label: `06 / INSIGHTS`
- `Feb 2026 · Operating Model` — **Span of control is a symptom, not a cause** — Why flattening the org chart rarely survives contact with the budget cycle.
- `Dec 2025 · Integration` — **The first ninety days of an integration are mostly about sequencing** — And almost nobody sequences aggressively enough.
- `Oct 2025 · Pricing` — **Your discount policy is your real pricing strategy** — What list price says versus what the deal desk actually approves.

### Contact
H2: `Tell us what is not working.`
Subline: `A first conversation is thirty minutes, costs nothing, and usually ends with a clearer question than the one you came in with.`
Email: `hello@northfieldpartners.com` · Phone: `+1 312 555 0177`
Form: Name / Company / Email / What are you working on? / [Button] `Send`

### Footer
- NORTHFIELD PARTNERS · `Chicago · New York · Toronto`
- Address: `225 North Wacker Drive, Suite 2100, Chicago, IL 60606`
- © 2026 Northfield Partners LLC. All rights reserved. · Privacy · Terms

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        'nf-navy': '#19396b',
        'nf-ink': '#161d28',
        'nf-accent': '#f28c2b',
      },
      borderRadius: { DEFAULT: '2px' },
    },
  },
};
```
