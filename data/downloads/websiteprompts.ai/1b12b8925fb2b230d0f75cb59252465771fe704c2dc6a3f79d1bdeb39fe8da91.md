# Riverbend Foundation — Nonprofit Organization Website Prompt

## 1. Goal Statement
Build a warm, evidence-led nonprofit website for **Riverbend Foundation**, a clean-water and watershed organisation — defined by soft ivory, deep teal, and humanist type, with an impact section built on real numbers and a donation flow that never loses the reader.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(42, 40%, 97%);       /* #fbf8f2 warm ivory */
  --foreground: hsl(196, 32%, 15%);      /* #1a2f33 deep slate-teal */
  --primary: hsl(186, 58%, 26%);         /* #1c6a6f deep teal */
  --primary-foreground: hsl(42, 40%, 98%);
  --muted-foreground: hsl(196, 10%, 44%);
  --border: hsl(40, 20%, 87%);
  --card: hsl(42, 42%, 94%);
  --accent-warm: hsl(24, 82%, 56%);      /* donate / urgency accent */
  --accent-soft: hsl(186, 34%, 88%);     /* pale teal wash */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- **H1 / hero:** `'Source Serif 4', serif;` weight 600, clamp(38px, 5vw, 68px), line-height: 1.1
- **H2:** Source Serif 4 600, 32–44px
- **H3 / card titles:** Inter 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height: 1.78
- **Eyebrows:** Inter 600, uppercase, letter-spacing: 0.16em, 11px, teal
- **Impact numbers:** Source Serif 4 600, tabular, clamp(44px, 6vw, 84px)

---

## 5. Visual Effects

### Effect 1 — Donation Amount Selector with Impact Translation
```tsx
const tiers = [
  { amount: 25,  impact: 'provides a household water filter for one year' },
  { amount: 60,  impact: 'funds one week of river-quality monitoring' },
  { amount: 150, impact: 'trains a volunteer steward for a full season' },
  { amount: 400, impact: 'restores 100 feet of eroded streambank' },
];
const [selected, setSelected] = useState(60);
const [custom, setCustom] = useState('');

<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {tiers.map(t => (
    <button
      key={t.amount}
      onClick={() => { setSelected(t.amount); setCustom(''); }}
      className="rounded-lg border-2 py-4 font-serif text-2xl transition-all duration-200"
      style={{
        borderColor: selected === t.amount ? 'var(--primary)' : 'var(--border)',
        background: selected === t.amount ? 'var(--accent-soft)' : 'transparent',
      }}
    >
      ${t.amount}
    </button>
  ))}
</div>
<AnimatePresence mode="wait">
  <motion.p
    key={selected}
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.28 }}
    className="mt-4 text-center text-[var(--muted-foreground)]"
  >
    Your ${selected} {tiers.find(t => t.amount === selected)?.impact}.
  </motion.p>
</AnimatePresence>
```

### Effect 2 — Impact Counter Row
```
Numbers count up from 0 on useInView, 2000ms, ease-out
Each number sits above a thin teal rule that scales in from the left
```

### Effect 3 — Story Card with Image Duotone Wash
```jsx
<div className="group relative overflow-hidden rounded-xl">
  {/* Image: community volunteers planting native grasses along a riverbank, natural daylight, candid documentary photography, warm and hopeful mood */}
  <img src="" alt="Volunteers restoring a riverbank" className="w-full aspect-[4/3] object-cover object-center transition-transform duration-700 group-hover:scale-105" />
  <div className="absolute inset-0 mix-blend-multiply opacity-30 transition-opacity duration-500 group-hover:opacity-0" style={{ background: 'var(--primary)' }} />
  <div className="absolute inset-x-0 bottom-0 p-6" style={{ background: 'linear-gradient(to top, rgba(26,47,51,0.92), transparent)' }}>
    <span className="text-xs uppercase tracking-[0.16em] text-white/80">Field Story</span>
    <h3 className="mt-2 font-serif text-2xl text-white">Bringing the Muddy Fork back</h3>
  </div>
</div>
```

### Effect 4 — Gentle Fade-Up
```
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 76px, `sticky top-0 z-40`, ivory with `backdrop-blur` and 1px bottom border after scroll
- Left: teal river-bend mark (simple SVG curve) + "RIVERBEND" (Source Serif 600) + "FOUNDATION" (Inter 600, 9px, letterspaced)
- Center: Our Work · Impact · Get Involved · About · News
- Right: `Donate` — warm orange filled, `rounded-full`, always visible
- Mobile: mark + `Donate` pill + hamburger

### Section 2 — Hero (Split, Image Right)
- `min-h-[86vh]`, 12-col: text cols 1–6, image cols 7–12 (full-bleed right edge)
- Eyebrow: `PROTECTING THE RIVERBEND WATERSHED SINCE 1997`
- H1: `Clean water is not\na cause. It is\ninfrastructure.`
- Subline: `We monitor, restore, and defend 340 miles of river across three counties — with volunteers, science, and a very small staff.`
- CTA row: `Donate` (orange) + `See Our Impact` (teal outline)
- Trust line: `Charity Navigator 4-Star · 89 cents of every dollar goes to programs`
```jsx
{/* Image: wide river bend framed by green banks in soft morning light, mist on the water, calm and hopeful, natural landscape photography */}
<img src="" alt="River bend at sunrise" className="w-full h-full object-cover object-center" />
<div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, rgba(251,248,242,0.96), rgba(251,248,242,0.5))' }} />
```

### Section 3 — Impact Counters
- `--card` background, `py-20`, 4-col grid divided by hairlines (Effect 2)
- `340` Miles of river monitored · `1,240` Volunteers active this year · `86` Restoration projects completed · `12,400` Households with cleaner water

### Section 4 — Our Work
- Ivory, eyebrow `WHAT WE DO` + H2 `Four Programs, One Watershed`
- **2x2 grid** of program cards: rounded-xl, `--card` background, teal icon in a pale teal circle, title, 3-sentence description, `Learn more →`

### Section 5 — Donate Block
- Full-bleed teal background, ivory text, `py-24`
- Centered max-w-2xl: eyebrow `GIVE`, H2 `Choose an amount. See what it does.`
- Donation selector (Effect 1) with custom amount input
- Monthly / one-time toggle above the tiers
- CTA: `Donate $60 Monthly` (orange, full-width, label updates live with selection)
- Below: `Riverbend Foundation is a registered 501(c)(3). EIN 45-2810394. All gifts are tax-deductible.`

### Section 6 — Field Stories
- Ivory, eyebrow `FROM THE FIELD` + H2 `What It Looks Like on the Ground`
- 3-col grid of story cards (Effect 3), first card spans 2 cols on desktop
- Each: image with duotone wash lifting on hover, category eyebrow, serif title, `Read the story →`

### Section 7 — Get Involved
- `--accent-soft` pale teal background, 3-col
- Three routes with icons: **Volunteer** (monthly cleanups and monitoring), **Become a Steward** (adopt a river segment), **Give Monthly** (join the Current)
- Each: icon, title, 2-sentence description, outline CTA

### Section 8 — Transparency
- Ivory, 2-col split
- Left: H2 `Where the Money Goes` + horizontal stacked bar (89% Programs / 7% Fundraising / 4% Admin) with animated widths + short paragraph
- Right: document links list with hairlines — Annual Report 2025 · Form 990 · Audited Financials · Board Roster, each with a download icon

### Section 9 — Partners
- `--card`, single row of 6 partner name badges (text-only, muted), centered, eyebrow `WITH SUPPORT FROM`

### Section 10 — Newsletter + Final CTA
- Teal band: H2 `Two emails a month. Both worth opening.` + inline email input + `Subscribe` button

### Section 11 — Footer
- Deep slate-teal background, ivory text, 4 columns
- Brand + mission line / Programs / Get Involved / Contact + address
- Bottom strip: EIN, © line, privacy, and a `Report a pollution incident` link in orange

---

## 7. Animations

- **Hero:** H1 fades up 0.8s; image reveals with `clipPath: inset(0 0 0 100%) → inset(0 0 0 0%)` over 1.2s
- **Impact counters:** count-up 2000ms on `useInView`; teal rule beneath each scales in from left, 0.6s, delayed 0.3s
- **Program cards:** stagger `i * 0.08`, fade-up 0.7s; hover lifts card `-4px` and deepens shadow
- **Donation tiers:** border and background cross-fade 0.2s on select; impact sentence swaps with `AnimatePresence`, 0.28s
- **Story cards:** duotone overlay opacity 0.3 → 0 and image scale 1 → 1.05 on hover, 0.5–0.7s
- **Transparency bar:** three segments animate width from 0 sequentially, 0.9s total, stagger 0.15s
- **All headings:** fade-up 0.7s, ease `[0.22, 1, 0.36, 1]`

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: mark + `Donate` pill + hamburger; overlay menu full-screen ivory
- Hero: image becomes a background layer behind text with ivory gradient scrim; H1 clamps to 38px; CTAs stacked full-width
- Impact counters: 2x2 grid
- Programs: 1-col
- Donation selector: 2x2 tier grid, CTA full-width and sticky to bottom on this section
- Field stories: 1-col, all cards equal size
- Transparency: bar stacks above document list
- Footer: 1-col accordion-style groups

### Tablet (768–1024px)
- Hero stays split at 50/50 · Programs 2x2 · Stories 2-col with the feature card full-width on top

### Desktop (> 1024px)
- Max width 1200px, `px-16`, section padding `py-24`

---

## 9. Full Copy

### Brand
**RIVERBEND FOUNDATION** — Watershed protection across three counties

### Navbar
Our Work · Impact · Get Involved · About · News · [Button] Donate

### Hero
- Eyebrow: `PROTECTING THE RIVERBEND WATERSHED SINCE 1997`
- H1: `Clean water is not a cause. It is infrastructure.`
- Subline: `We monitor, restore, and defend 340 miles of river across three counties — with volunteers, science, and a very small staff.`
- CTA 1: `Donate` · CTA 2: `See Our Impact`
- Trust line: `Charity Navigator 4-Star · 89 cents of every dollar goes to programs`

### Impact Counters
- `340` — Miles of river monitored
- `1,240` — Volunteers active this year
- `86` — Restoration projects completed
- `12,400` — Households with cleaner water

### Our Work
Eyebrow: `WHAT WE DO` — H2: `Four Programs, One Watershed`

1. **Water Quality Monitoring** (icon: `FlaskConical`) — Volunteers collect samples at 62 fixed sites every month, year-round. The data goes into a public database and into regulatory filings. When a number moves the wrong way, we know within weeks rather than years.
2. **Streambank Restoration** (icon: `Sprout`) — We stabilise eroding banks with native plantings and engineered log structures. Restored segments hold sediment, cool the water, and bring back the insects that everything else eats. Eighty-six projects completed since 2004.
3. **Advocacy & Permits** (icon: `Scale`) — We read every discharge permit application in the watershed, and we comment on the ones that matter. It is unglamorous work that has prevented more pollution than any cleanup we have ever run.
4. **Watershed Education** (icon: `GraduationCap`) — Field programs for 4,000 students a year, plus landowner workshops on riparian buffers and septic maintenance. The next generation of stewards is currently in sixth grade.

### Donate Block
Eyebrow: `GIVE` — H2: `Choose an amount. See what it does.`
- `$25` — provides a household water filter for one year
- `$60` — funds one week of river-quality monitoring
- `$150` — trains a volunteer steward for a full season
- `$400` — restores 100 feet of eroded streambank
Toggle: `One-time` / `Monthly`
Legal: `Riverbend Foundation is a registered 501(c)(3). EIN 45-2810394. All gifts are tax-deductible to the extent allowed by law.`

### Field Stories
Eyebrow: `FROM THE FIELD` — H2: `What It Looks Like on the Ground`
1. **Bringing the Muddy Fork back** — Four years, 1,800 native plants, and one very patient landowner. The trout returned in year three.
2. **The permit nobody else read** — How a routine-looking discharge application turned into an eighteen-month fight, and why we won it.
3. **Sixty-two volunteers, one Saturday** — Our largest single cleanup pulled 3.4 tons out of a two-mile stretch. Here is what we found.

### Get Involved
Eyebrow: `JOIN US` — H2: `Three Ways to Help`
1. **Volunteer** (icon: `Users`) — Monthly cleanups, monitoring runs, and planting days. No experience needed, and we always feed you.
2. **Become a Steward** (icon: `MapPin`) — Adopt a half-mile segment and walk it four times a year. Stewards are our early-warning system.
3. **Give Monthly** (icon: `Heart`) — Join The Current, our monthly giving circle. Predictable funding is what lets us commit to multi-year restoration.

### Transparency
H2: `Where the Money Goes`
Paragraph: `We publish our financials in full because we ask you to trust us with money. Eighty-nine cents of every dollar goes directly to programs — monitoring, restoration, advocacy, and education. The rest keeps the lights on and the grants coming.`
Bar: `Programs 89%` · `Fundraising 7%` · `Administration 4%`
Documents: `Annual Report 2025` · `IRS Form 990` · `Audited Financials 2025` · `Board of Directors`

### Partners
Eyebrow: `WITH SUPPORT FROM`
`State Water Trust` · `Fairhaven Community Fund` · `Northern Counties Coalition` · `Ridgeline Outdoor Co.` · `University Watershed Lab` · `Anonymous Family Foundation`

### Newsletter
H2: `Two emails a month. Both worth opening.`
Subline: `Field updates, water quality results, and the occasional call to show up somewhere.`
CTA: `Subscribe`

### Footer
- RIVERBEND FOUNDATION · `Monitor. Restore. Defend.`
- Address: `118 Mill Race Road, Fairhaven, VT 05743`
- Phone: `(802) 555-0119` · Email: `hello@riverbendfoundation.org`
- EIN 45-2810394 · © 2026 Riverbend Foundation. All rights reserved. · Privacy Policy
- Orange link: `Report a pollution incident →`

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-toggle-group": "^1.1.0",
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
        serif: ['Source Serif 4', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'rb-ivory': '#fbf8f2',
        'rb-teal': '#1c6a6f',
        'rb-orange': '#ef7c2b',
      },
    },
  },
};
```
