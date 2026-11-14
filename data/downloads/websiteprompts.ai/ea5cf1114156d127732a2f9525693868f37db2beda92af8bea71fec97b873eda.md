# Ridgeway Tree Care — Tree Service & Arborist Website Prompt

## 1. Goal Statement
Build a credible, safety-led arboriculture website for **Ridgeway Tree Care**, defined by deep canopy green, bark brown, and a sturdy humanist sans — a tree surgery site that leads with qualifications and TPO knowledge rather than a photograph of a man in a cherry picker.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(60, 20%, 96%);       /* #f7f7f1 pale bark */
  --foreground: hsl(140, 24%, 14%);      /* #1b2e21 canopy ink */
  --primary: hsl(140, 36%, 26%);         /* #2a5a3b canopy green */
  --primary-foreground: hsl(60, 20%, 97%);
  --muted-foreground: hsl(140, 6%, 44%);
  --border: hsl(56, 14%, 86%);
  --card: hsl(60, 22%, 92%);
  --accent-bark: hsl(26, 34%, 38%);      /* bark brown */
  --accent-hivis: hsl(72, 88%, 52%);     /* safety hi-vis */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Signika:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Signika 700, clamp(38px, 5vw, 68px), letter-spacing -0.02em
- **H2:** Signika 600, 30–44px
- **H3:** Signika 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.74
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.18em, 11px, canopy green
- **Prices / heights / diameters:** Signika 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Tree work selector with a growing SVG tree.** Five work types — crown reduction, crown lift, thinning, pollarding, felling — where selecting one morphs a simple SVG tree diagram to show the result, alongside a description of when it is appropriate and the typical price band. It teaches the customer the vocabulary they need to describe the job.

```tsx
const works = [
  { id: 'reduction', name: 'Crown reduction', path: TREE_REDUCED,  when: 'Tree is outgrowing its space but is healthy',      price: '£450–£900' },
  { id: 'lift',      name: 'Crown lift',      path: TREE_LIFTED,   when: 'Low branches blocking light, a path or a driveway', price: '£280–£550' },
  { id: 'thin',      name: 'Crown thinning',  path: TREE_THINNED,  when: 'Dense canopy casting heavy shade',                  price: '£380–£750' },
  { id: 'pollard',   name: 'Pollarding',      path: TREE_POLLARD,  when: 'Established pollard being maintained on cycle',     price: '£350–£700' },
  { id: 'fell',      name: 'Felling',         path: TREE_STUMP,    when: 'Dead, dangerous, or genuinely no alternative',      price: '£600–£1,800' },
];
const [sel, setSel] = useState('reduction');
const w = works.find(x => x.id === sel);

<motion.path
  d={w.path}
  fill="var(--primary)"
  animate={{ d: w.path }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
/>
```

**Effect 2 — Hi-vis credential chips.** Qualification chips (NPTC units, Arb Association, insurance) drawn as small hi-vis-outlined pills that pop in with a slight overshoot spring, the only saturated colour on an otherwise natural palette.

## 6. Component Breakdown

1. **Navbar** — 74px, sticky, pale bark, 1px bottom border. Tree-mark wordmark left, links centre, phone and `Free Quote` green button right.
2. **Hero** — 84vh, full-bleed canopy photograph with a bottom gradient. Eyebrow, H1, subline, two CTAs, four credential chips. *Image: a mature oak in a large garden photographed from below through the canopy, dappled light, deep greens.*
3. **Emergency strip** — a thin band for storm damage and dangerous trees, with a 24-hour number, styled in bark brown rather than red so it does not feel like a scare tactic.
4. **Tree work selector** — the educational centrepiece (Effect 1).
5. **All services** — 2x4 grid: crown work, felling and dismantling, stump grinding, hedge cutting, deadwooding, planting, emergency callout, and tree surveys.
6. **Qualifications and insurance** — the trust section: NPTC units held, Arb Association membership, public liability figure, employer liability, and a note that certificates are shown on request.
7. **TPOs and conservation areas** — the section that proves expertise: what a Tree Preservation Order means, the six-week notice period, and an explicit statement that the firm handles applications.
8. **What happens on the day** — five points covering access, protection of lawns, noise hours, and what happens to the arisings.
9. **Wood and woodchip** — seasoned logs for sale and free woodchip for gardeners, which is both a revenue line and a reason to be liked locally.
10. **Recent work** — three jobs with the species, the work done, and how long it took.
11. **Quote request** — form with address, tree species if known, and a photo upload note.
12. **Footer** — canopy green, four columns, Arb Association number, insurance details, coverage area.

## 7. Animations
- Hero: image scales 1.05 to 1 over 13s; H1 fades up 0.8s; credential chips pop staggered 0.08s with a spring
- Tree diagram: SVG path morphs over 0.6s on selection; description and price fade-swap 0.25s
- Service cards: fade-up staggered 0.07s; hover raises a green 1px border
- TPO section: the notice-period figure counts up from zero
- Recent work rows: fade in staggered 0.08s
- Motion is restrained — this is a safety-critical trade and should not feel playful

## 8. Responsive
- **Mobile (<768px):** hamburger with a tap-to-call button; H1 clamps to 38px; work selector becomes a horizontally scrollable chip row with the diagram and description beneath; services 1-col; credential chips wrap to two rows; `Free Quote` pinned as a sticky bottom bar.
- **Tablet:** services 2-col, work selector keeps the side-by-side diagram.
- **Desktop:** max width 1160px, `px-16`, `py-22`.

## 9. Full Copy

**Brand:** RIDGEWAY TREE CARE · Arboriculture · Surrey and West Sussex

**Navbar:** Tree Work · Services · Qualifications · TPOs · Recent Work · `01483 555 0171` · [Button] Free Quote

**Hero**
- Eyebrow: `SURREY & WEST SUSSEX · NPTC QUALIFIED · ARB ASSOCIATION APPROVED · SINCE 2009`
- H1: `We would rather prune it than take it down.`
- Subline: `Qualified arborists covering Surrey and West Sussex. Crown work, felling, stump grinding and tree surveys, with the paperwork for Tree Preservation Orders handled by us rather than left with you.`
- CTAs: `Get a Free Quote` · `Understand the Work`
- Chips: `NPTC CS30/31/38/39` · `Arb Association Approved` · `£10m public liability` · `£10m employer liability`

**Emergency strip:** `Storm damage or a tree you are worried about? 24-hour callout on 01483 555 0171.`

**Tree work selector** — Eyebrow `THE WORK` — H2 `What the different jobs actually mean`
1. **Crown reduction — £450 to £900** — Reducing the overall size of the canopy while keeping the tree's natural shape. Appropriate when a healthy tree is outgrowing its space. Never more than about thirty percent in one go.
2. **Crown lift — £280 to £550** — Removing the lowest branches to raise the canopy. For light into a garden, clearance over a path, or a driveway. Usually the cheapest way to fix a shading complaint.
3. **Crown thinning — £380 to £750** — Selectively removing branches within the canopy to let light and wind through without changing the outline. Good for dense species like sycamore and lime.
4. **Pollarding — £350 to £700** — Cutting back to a previous pollard point on an established cycle. We will not start a new pollard on a mature tree that has never had one, because it usually kills it.
5. **Felling — £600 to £1,800** — Dead, dangerous, or genuinely no alternative. Priced by size, access and what has to happen to the timber. Always the last option and we will say so if we think reduction would do.

**All services**
1. **Crown work** — Reduction, lifting, thinning and reshaping to BS3998 standard.
2. **Felling and dismantling** — Sectional dismantling where there is no safe drop zone, with rigging and lowering.
3. **Stump grinding** — Ground to 200 to 300mm below grade, backfilled with the grindings or removed for £60.
4. **Hedge cutting** — Trimming, reshaping and reduction, with a nesting-season check between March and August.
5. **Deadwooding** — Removing dead, dying and crossing branches. Often the only work a mature tree needs.
6. **Tree planting** — Species selection for the actual site, supply, planting and three years of formative pruning.
7. **Emergency callout** — Storm damage and dangerous trees, twenty-four hours, with make-safe first and tidy-up arranged after.
8. **Tree surveys** — BS5837 surveys for planning applications, and mortgage or insurance reports on subsidence claims.

**Qualifications and insurance** — H2 `The bits people should ask about and usually do not`
`Every climber holds NPTC CS30, CS31, CS38 and CS39 as a minimum. Two of the team hold the Level 4 Diploma in Arboriculture. We are Arb Association Approved Contractors, which requires a full audit every three years covering work quality, safety systems and business practice.`
`Public liability £10 million, employer liability £10 million. We will email you both certificates with your quote without being asked, and if any tree firm hesitates when you ask for theirs, that tells you what you need to know.`

**TPOs and conservation areas** — H2 `If the tree is protected, we handle it`
`A Tree Preservation Order means you need written council consent before any work, and doing it anyway carries an unlimited fine. Conservation areas are different: no consent needed, but six weeks written notice to the council, during which they can serve a TPO.`
`We check the designation before we quote, prepare and submit the application or notice, and deal with the tree officer directly. It adds six to eight weeks to the timeline and nothing to your bill.`

**What happens on the day**
1. **Access** — We need a route for chippers and a place to park the truck. If access is tight we will have seen it at the quote and priced it.
2. **Protecting the garden** — Ground protection boards on lawns, and anything fragile moved before we start rather than worked around.
3. **Noise** — Chainsaws and chippers between 8am and 5pm weekdays, 8am and 1pm Saturdays. We knock on neighbours' doors first.
4. **The arisings** — Chipped and taken away as standard. Say the word and we leave the chip for your beds, or cut the timber into rounds for your log store.
5. **Tidy-up** — Blown and raked before we leave. You should not be able to tell where the chipper stood.

**Wood and woodchip** — `Seasoned hardwood logs, £95 a cubic metre delivered within ten miles, moisture tested under twenty percent. Free woodchip to anyone who wants it — bring a trailer or we will drop a load locally for the cost of the run.`

**Recent work**
1. **Mature beech, crown reduction** — Godalming — 25% reduction over two days, TPO consent obtained in five weeks.
2. **Two Leylandii, felling and stump grinding** — Horsham — Sectional dismantle over a conservatory, one day, stumps ground the same afternoon.
3. **Veteran oak, deadwooding and survey** — Cranleigh — BS5837 survey for a planning application plus deadwooding, half a day.

**Quote request** — Form: Name / Address or postcode / Phone / What is the tree and what is the concern? / Photo upload → [Button] `Request a Free Quote`
Note: `Photographs help enormously. Include one from a distance showing the whole tree and one of the base. Most quotes come back within two working days, and we visit before quoting anything over £500.`

**Footer** — RIDGEWAY TREE CARE · `We would rather prune it than take it down.` · `01483 555 0171` · Arb Association Approved Contractor 4210 · £10m public and employer liability · Covering Surrey and West Sussex · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
