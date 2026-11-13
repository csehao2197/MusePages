# Health SaaS Website — AI Prompt (MERIDIAN)

## Goal
Build a complete SaaS marketing website for **Meridian** — an AI-powered preventive health intelligence platform that connects blood work, wearables, and lifestyle data into one dashboard. Light mode, clean white foundation, and a single deep red accent. The design feels clinical-premium without being cold — think high-end health brand meets modern SaaS precision. Think Function Health, Levels, or AG1's website energy — but sharper and more data-forward.

---

## Tech Stack
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

---

## Design System — Colors

```css
:root {
  --white:        #ffffff;
  --off-white:    #fafaf9;
  --surface:      #f4f4f2;
  --border:       #e8e6e1;
  --border-hi:    #d4d0c8;
  --ink:          #111110;
  --ink-2:        #1c1c1a;
  --soft:         #72716d;
  --softer:       #a8a5a0;
  --red:          #c8102e;    /* primary accent — deep medical red */
  --red-light:    #fdf2f4;    /* tinted bg for badges, pills */
  --red-mid:      #f5c5cc;    /* border tint */
  --red-dark:     #9e0d24;    /* hover state */
}
```

Background: `--white` / `--off-white` alternating sections. Text: `--ink`. Accent: `--red` — used on primary CTAs, active states, chart highlights, stat numbers, hover indicators, and AI insight cards. All borders: `--border`. Cards: `--surface`. Zero shadows except one subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` on the dashboard mockup. Border-radius: 10–14px on cards, 6px on buttons/badges, 100px on pills.

---

## Typography

```
Google Fonts:
https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap
```

- **Display / headings**: `Plus Jakarta Sans`, weight 800, letter-spacing -0.04em
- **Sub-headings**: Plus Jakarta Sans 700, letter-spacing -0.02em
- **Body**: Plus Jakarta Sans 400, line-height 1.7
- **Labels / mono data / prices / timestamps**: `JetBrains Mono`, 10–12px, letter-spacing 0.06em, uppercase

```css
.mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--soft);
}
```

Hero headline: `clamp(52px, 6.5vw, 88px)`.
Section headings: `clamp(36px, 4vw, 56px)`.

---

## Visual Effects

### 1. Dashboard mockup — hero centerpiece
The hero's dominant visual is a browser-framed dashboard mockup:

```jsx
<div className="relative rounded-xl border border-[--border] shadow-[0_8px_48px_rgba(0,0,0,0.08)] overflow-hidden bg-white">
  {/* Browser chrome */}
  <div className="flex items-center gap-2 px-4 py-3 bg-[--surface] border-b border-[--border]">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[--border]" />
      <div className="w-3 h-3 rounded-full bg-[--border]" />
      <div className="w-3 h-3 rounded-full bg-[--border]" />
    </div>
    <div className="flex-1 mx-4 h-6 bg-[--border] rounded-md" />
  </div>
  {/* Dashboard content — see component breakdown */}
</div>
```

### 2. Staggered fade-up entrance
```js
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
```
Applied to hero text blocks, stat cards, feature cards on scroll.

### 3. Metric card pulse (AI insight)
The AI insight card has a subtle left border that pulses:
```css
@keyframes insight-pulse {
  0%, 100% { border-left-color: var(--red); }
  50%       { border-left-color: var(--red-mid); }
}
.insight-card {
  border-left: 3px solid var(--red);
  animation: insight-pulse 3s ease-in-out infinite;
}
```

### 4. Stat counter animation
Numbers count up from 0 using Framer Motion `useMotionValue` + `useSpring`:
```js
const spring = useSpring(0, { stiffness: 60, damping: 18 });
// On in-view: spring.set(targetValue)
// Display: Math.round(latest).toLocaleString()
```

### 5. Chart bar hover (red highlight)
```css
.chart-bar {
  background: var(--border);
  transition: background 0.15s ease;
  border-radius: 3px 3px 0 0;
}
.chart-bar:hover,
.chart-bar.active { background: var(--red); }
```

### 6. Feature card hover
```css
.feature-card {
  border: 1.5px solid var(--border);
  transition: border-color 0.2s, transform 0.2s;
}
.feature-card:hover {
  border-color: var(--red-mid);
  transform: translateY(-2px);
}
.feature-card:hover .feat-num { color: var(--red); }
```

### 7. Horizontal logo marquee
Continuous scroll of integration partner logos/names:
```css
@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track { animation: scroll 28s linear infinite; }
```

---

## Component Breakdown

### 1. Navbar (fixed, z-100)
White background `--white`, `--border` bottom, `backdrop-filter: blur(12px)`.

Layout: brand left · nav center · CTA right.
- Brand: `Meridian` in Plus Jakarta Sans 800, 18px, `--ink`. Small red dot `·` after the name: `<span style="color: var(--red)">.</span>`
- Nav links: Features · Integrations · Pricing · Science · Blog — Plus Jakarta Sans 500, 14px, `--soft`, `--ink` on hover
- Right: `Sign in` (ghost button) + `Start free →` (red fill button)
- Buttons: 8px padding vertical, 18px horizontal, 6px radius

Ghost: `border: 1.5px solid var(--border)`, `--soft` text.
Primary: `background: var(--red)`, white text, hover `--red-dark`.

Mobile: hamburger → full-screen white overlay, links stacked, large.

### 2. Hero (§ 01)
White background. Centered layout, max-width 1200px.

**Trust badge** (top, centered):
```jsx
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[--border] bg-[--surface] text-xs font-mono text-[--soft]">
  <span className="w-1.5 h-1.5 rounded-full bg-[--red] animate-pulse" />
  Trusted by 40,000+ members · HIPAA Compliant · SOC 2 Type II
</div>
```

**Headline** (centered, max-width 780px):
```
Your health data,
finally connected.
```
Plus Jakarta Sans 800, `clamp(52px, 6.5vw, 88px)`, `--ink`. Letter-spacing -0.04em. Line-height 1.05.
Second line `"finally connected."` — the word `connected` has a `--red` color.

**Subline** (centered, max-width 520px, `--soft`, 18px):
"Meridian combines your blood work, wearables, and lifestyle data into one intelligent dashboard — and uses AI to surface insights before they become symptoms."

**CTA row** (centered, gap 12px):
- `Start free — no card needed` — red fill, 52px tall, 24px h-padding, 8px radius, Plus Jakarta Sans 700 16px
- `Watch 2-min demo ▶` — ghost, same size

**Trust strip** (mono, centered, `--softer`, gap 24px with `·` separators):
`HIPAA compliant · SOC 2 Type II · 40+ lab integrations · Cancel anytime`

**Dashboard mockup** (full width below hero text, max-width 1000px, centered):

Browser chrome (as above) wrapping a two-panel dashboard layout:

Left panel — sidebar (200px wide, `--surface` bg, `--border` right border):
- Logo + user avatar row at top
- Nav items: Overview (active, `--red-light` bg, `--red` text) · Biomarkers · Sleep · Activity · AI Insights · Reports · Settings
- Each item: 10px 12px padding, 6px radius, mono 11px

Right panel — main dashboard:
- **Header row**: "Health Overview" Plus Jakarta Sans 700 16px + date in mono right + `Export PDF` ghost button

- **KPI row** (3 cards, gap 12px):
  ```
  HRV Score        Sleep Score      Ferritin
  68 ms            82 / 100         34 ng/mL
  ↑ +4 pts         7h 14m avg       ↓ Trending low
  [green]          [ink]            [amber #f59e0b]
  ```
  Each KPI card: `--surface` bg, `--border` border, 10px radius, 16px padding.
  Value: Plus Jakarta Sans 800 28px. Delta: JetBrains Mono 10px.

- **Chart** (full-width card below KPIs, `--surface` bg):
  Title: "HRV — 90-day trend" mono 10px.
  Bar chart: 14 bars, varying heights, 4 bars highlighted in `--red` (recent peak days), others `--border`.
  X-axis labels: mono 9px, `--softer`.

- **AI Insight card** (full-width, below chart):
  `background: var(--red-light)`, `border: 1.5px solid var(--red-mid)`, `border-left: 3px solid var(--red)`, pulsing animation.
  ```
  ⚡ AI Insight — action recommended
  Your ferritin dropped 18% over 6 weeks. Combined with your declining
  sleep quality and increased fatigue markers, this suggests early iron
  depletion. Review dietary iron sources or consider retesting in 4 weeks.
  [View recommendation →]
  ```
  Icon background: `--red-light`. Heading: Plus Jakarta Sans 700 13px `--red`. Body: 13px `--soft`. Link: `--red`, underline on hover.

### 3. Stats Bar (§ separator)
`--off-white` background, `--border` top and bottom. Four stats in a row, centered.

```
40,000+          94%           840+          48h
Active members   Lab accuracy  Correlations  First insight
```

Numbers: Plus Jakarta Sans 800, 44px, `--ink`. Red comma/symbol on highlighted number.
Labels: JetBrains Mono 10px, `--soft`.
Count-up animation on scroll-in.

Dividers: 1px `--border` vertical between each stat.

### 4. Integrations Marquee (§ separator)
`--white` background, `--border` top and bottom, 56px tall.
Mono label left: `INTEGRATES WITH` JetBrains Mono 10px `--softer`.
Marquee: `Apple Health · WHOOP · Oura Ring · Garmin · LabCorp · Quest Diagnostics · 23andMe · Fitbit · Samsung Health · Withings · ·` — duplicated for seamless loop. Plus Jakarta Sans 600 14px `--border-hi` color, `--soft` on hover.

### 5. Features (§ 02)
`--off-white` background.

Section header (centered):
- Red pill badge: `HOW IT WORKS` in JetBrains Mono 10px, `--red`, `--red-light` bg, `--red-mid` border
- H2: `Three steps to health clarity.`
- Sub: "No confusing reports. No manual data entry. Just patterns that matter." `--soft`.

Three cards in a row. Each card: white bg, `--border` 1.5px, 14px radius, 28px padding.
On hover: border `--red-mid`, `translateY(-2px)`.

Cards:
1. **Connect your labs** — `01 /` mono red label
   Upload blood test PDFs or connect directly with LabCorp, Quest, and 40+ lab partners. We parse and normalize every biomarker automatically — going back as far as your oldest test.
   Icon: 40×40 `--red-light` bg, 8px radius, red test tube icon (lucide `FlaskConical`)

2. **Sync your wearables** — `02 /` mono
   Integrate Apple Health, Garmin, Whoop, Oura, and Fitbit in one tap. Meridian overlays your biometric data — HRV, sleep stages, activity — directly onto your lab timeline.
   Icon: lucide `Watch`

3. **AI reads the full picture** — `03 /` mono
   Our model surfaces correlations across your complete health dataset — spotting trends months before they appear on a standard health report or annual check-up.
   Icon: lucide `BrainCircuit`

### 6. Deep Feature Split (§ 03)
White background. Alternating rows: image left/content right, then content left/image right.

**Row 1 — Longitudinal tracking:**
Left: annotated chart visual (described as image brief)
Right: eyebrow `BIOMARKER TRACKING` · H3: `See years of data, not just today's snapshot.` · Body: "Most health apps show you a number and a normal range. Meridian shows you your number across every test — so you can see drift over months, not just a moment in time." · Feature list: `✓ Automatic PDF parsing` `✓ Normalization across labs` `✓ Trend line with annotations` `✓ Sharable summary reports`
```
{/* Chart image: clean line graph showing a biomarker (ferritin) declining over 8 data points across 18 months, annotated with event markers, white background, red accent on trend line, clinical data visualization aesthetic */}
```

**Row 2 — AI Insights:**
Left: eyebrow `AI INTELLIGENCE` · H3: `Insights your doctor doesn't have time to find.` · Body: "Meridian's AI cross-references 840+ published health correlations against your personal dataset. It doesn't give you generic advice — it gives you your insight, based on your pattern." · Three insight pill examples shown inline: `↓ Ferritin × Fatigue pattern` / `↑ HRV × Sleep quality` / `⚡ Cortisol × Exercise timing`
Right: insight feed visual
```
{/* Insight feed image: clean card-based UI showing 4 AI-generated health insights, white background, red accent indicators, each card shows a correlation finding with a confidence score and recommendation — clinical but approachable design */}
```

**Row 3 — Wearable overlay:**
Left: wearable overlay chart visual
Right: eyebrow `WEARABLE INTEGRATION` · H3: `Your lab results, in the context of your life.` · Body: "Blood work is a snapshot. Your wearables are a film. Meridian places your lab results directly on your HRV, sleep, and activity timeline — so context is always visible."
Integration logos strip: Apple Health · WHOOP · Oura · Garmin · Fitbit
```
{/* Wearable overlay image: dashboard showing a biomarker timeline overlaid with sleep quality bars and HRV line, red and grey color system, white background, precise data visualization with clear legend */}
```

### 7. Testimonials (§ 04)
`--off-white` background.

Section header: H2 `What members say.` · sub `--soft`.

Three testimonial cards in a row. Each: white bg, `--border` border, 14px radius, 28px padding.
- Stars: `★★★★★` in `--red`
- Quote: Plus Jakarta Sans 400 15px, line-height 1.7
- Author: avatar circle (40px) + name Plus Jakarta Sans 600 14px + role JetBrains Mono 10px `--soft`

Three testimonials:
1. *"I've had unexplained fatigue for two years. Doctors kept saying my labs were 'normal'. Meridian showed me a slow downward ferritin trend across 4 tests that no one had flagged. Six months of iron supplementation later, I feel like a different person."*
   — **Sophie M.** · Product Designer, London · member since 2024

2. *"The HRV + sleep correlation feature alone is worth the subscription. I can see exactly which weeks my recovery was off — and trace it back to specific stress events or training load. It's like having a sports scientist for my desk job."*
   — **Marcus T.** · Software Engineer, Berlin · member since 2023

3. *"I work in oncology and I'm obsessed with preventive health. Meridian is the only consumer product I've found that actually does longitudinal analysis correctly. The AI reasoning is cited, cautious, and genuinely useful — not fear-mongering."*
   — **Dr. Priya K.** · Oncology Researcher, Boston · member since 2024

### 8. Pricing (§ 05)
White background.

Section header: H2 `Simple, honest pricing.` · sub: "No upsells. No data selling. No ads."

Three cards in a row. Middle card featured — `--ink` background, white text, red accent.

**Starter** (Free):
- $0 / month
- Up to 3 blood test uploads per year · Apple Health sync · Basic trend tracking · 5 AI insights / month · PDF export
- CTA: `Get started free` (outline)

**Core** (Most popular) — featured card:
- $19 / month · billed annually ($228/yr)
- Unlimited blood test uploads · All wearable integrations · Full AI insight engine · Unlimited correlations · Doctor-share PDF · Priority support
- CTA: `Start 14-day trial` (red fill → on dark card: white fill with ink text)
- Badge: `MOST POPULAR` JetBrains Mono 10px red above card

**Pro** (For health-forward professionals):
- $49 / month · billed annually
- Everything in Core · API access · Multi-profile (family) · Raw data export (CSV/JSON) · Dedicated health data analyst (1× monthly call)
- CTA: `Start 14-day trial` (outline)

Below pricing: `All plans include a 14-day free trial · No credit card required · Cancel anytime` — JetBrains Mono 11px `--soft`, centered.

### 9. FAQ (§ 06)
`--off-white` background.

Two-column: H2 left (`Before you ask.`) + accordion right (6 items).

Accordion: border-bottom `--border` between items. `+` → `×` toggle in `--red`. Panel slides open with max-height animation.

Questions and answers:
1. **Is my health data secure?** — Yes. Meridian is HIPAA compliant and SOC 2 Type II certified. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never sell or share your data. We never train models on your personal health data without your explicit opt-in.
2. **What lab formats do you support?** — We accept PDF uploads from all major US labs including LabCorp, Quest, BioReference, and Sonora Quest. We also support direct API connections with LabCorp and Quest for automatic result sync.
3. **Which wearables are supported?** — Apple Health, Garmin Connect, WHOOP, Oura Ring, Fitbit, Samsung Health, and Withings. We're adding Polar and Amazfit in Q3 2026.
4. **How accurate is the AI analysis?** — Meridian's correlation models achieve 94% accuracy against clinical reference standards in our validation study (n=2,400, published 2025). All AI insights include confidence scores and source citations. We flag when data is insufficient to draw a conclusion.
5. **Can I share my results with my doctor?** — Yes. Every report can be exported as a clean, one-page PDF formatted for clinical review. Core and Pro subscribers can also share a live read-only link directly with their provider.
6. **What's your data retention policy?** — Your data is retained for as long as your account is active. If you cancel, you have 90 days to export everything. After that, all personal data is permanently deleted. We never hold data hostage.

### 10. CTA Banner (§ 07)
`--red` background section. Centered.

H2: `Start understanding your health today.` — Plus Jakarta Sans 800, `clamp(40px, 5vw, 64px)`, white.
Sub: "Join 40,000+ members who get monthly insights from their own data." — white opacity 0.8.

Two buttons:
- `Start free — no card needed` — white bg, `--red` text, Plus Jakarta Sans 700
- `See a demo →` — white outline border, white text

Below: `HIPAA Compliant · SOC 2 Type II · 40+ integrations` — JetBrains Mono 10px white opacity 0.5.

### 11. Footer
`--off-white` background, `--border` top.

Logo + one-liner left: `Meridian·` + "AI-powered preventive health intelligence."

Four-column nav:
- **Product**: Features / Integrations / Pricing / Security / Changelog
- **Science**: How it works / Research / Accuracy / Clinical validation
- **Company**: About / Blog / Careers / Press
- **Legal**: Privacy Policy / Terms / HIPAA Notice / Data Export

Bottom bar: `© 2026 Meridian Health Inc.` left · `HIPAA · SOC 2 · Built with care in San Francisco` right. JetBrains Mono 10px `--softer`.

---

## Animations Summary

| Element | Animation | Timing |
|---|---|---|
| Hero text blocks | `opacity 0→1, y 24→0` stagger | 0.5s, 0.07s per block |
| Dashboard mockup | `opacity 0→1, y 40→0` | 0.7s delay 0.3s |
| Stats | count-up on scroll | `useSpring` stiffness 60 |
| Integration marquee | `translateX(-50%)` infinite | 28s linear |
| Feature cards | fade-up stagger | 0.5s, 0.1s per card |
| Feature row hover | `translateY(-2px)` + border | 0.2s ease |
| AI insight pulse | border-left color | 3s ease-in-out infinite |
| Chart bars hover | background `--red` | 0.15s ease |
| Testimonial cards | fade-up stagger | 0.5s, 0.1s per card |
| Accordion panel | `max-height` slide | 0.3s ease |
| CTA section | fade-up | 0.6s |

All scroll-triggered: `IntersectionObserver`, threshold 0.1, rootMargin `0px 0px -60px 0px`.

---

## Responsive

- **Desktop (≥1280px)**: Hero centered with dashboard below, features 3-col, pricing 3-col, testimonials 3-col.
- **Tablet (768–1279px)**: Hero single-column stacked (text → dashboard), features 2+1, pricing horizontal scroll with snap, testimonials 2+1.
- **Mobile (<768px)**: All single column. Hero CTA buttons full-width. Dashboard mockup simplified — show KPI cards only, no sidebar. Stats 2×2 grid. Pricing cards scroll horizontally with snap. Feature images hidden on mobile, content only.

---

## Full Copy Reference

**Brand**: Meridian
**Tagline**: Your health data, finally connected.
**Category**: Preventive health intelligence / Health SaaS
**Target user**: Health-conscious adults who get regular blood work, use wearables, and want to understand their data longitudinally
**Key differentiator**: Longitudinal AI analysis — spots trends across months of data, not just a single result
**Compliance**: HIPAA, SOC 2 Type II
**Location**: San Francisco, CA

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx",
  "@radix-ui/react-accordion": "^1.x",
  "@radix-ui/react-tabs": "^1.x"
}
```

---

## Quick Notes
- Brand name `Meridian` swaps to any health SaaS name — update the hero H1 and all copy accordingly.
- The red `#c8102e` is the single accent color — it works for health because it reads as clinical and authoritative rather than alarming. Swap to `#0ea5e9` (sky blue) or `#16a34a` (health green) if preferred.
- The dashboard mockup in the hero is a coded UI component — not a screenshot. This means the AI builder will actually render it, making it accurate and interactive from day one.
