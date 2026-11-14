# Compound Search — SEO Agency Website Prompt

## 1. Goal Statement
Build a data-forward SEO agency website for **Compound Search**, defined by near-black, a sharp chartreuse accent, and monospace metrics — an agency site that leads with a real traffic chart and named client outcomes rather than a services grid.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(228, 16%, 9%);        /* #14151c */
  --foreground: hsl(220, 14%, 95%);       /* #f0f1f4 */
  --primary: hsl(72, 88%, 58%);           /* #d4ee32 chartreuse */
  --primary-foreground: hsl(228, 18%, 8%);
  --muted-foreground: hsl(222, 8%, 56%);
  --border: hsl(228, 12%, 19%);
  --card: hsl(228, 14%, 12%);
  --card-elevated: hsl(228, 12%, 16%);
  --loss: hsl(4, 72%, 58%);               /* used for competitor decline */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=General+Sans:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```
Fallback if General Sans is unavailable: `Satoshi`, then `Inter`.
- **H1:** General Sans 700, clamp(40px, 5.4vw, 78px), letter-spacing -0.035em
- **H2:** General Sans 600, 32–46px
- **H3:** General Sans 600, 18–20px
- **Body:** General Sans 500, 16px, line-height 1.7
- **Eyebrows / data labels:** JetBrains Mono 500, uppercase, letter-spacing 0.14em, 11px, chartreuse
- **Metrics:** General Sans 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Animated traffic growth chart.** An inline SVG line chart drawn with `pathLength` showing organic sessions over eighteen months, with a chartreuse line, a subtle gradient fill beneath, and month labels in monospace. The line draws itself over 1.8 seconds on scroll.

```tsx
<svg viewBox="0 0 600 220" className="w-full">
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
    </linearGradient>
  </defs>
  <motion.path d={areaPath} fill="url(#fill)"
    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 1.2 }} />
  <motion.path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round"
    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
    transition={{ duration: 1.8, ease: 'easeInOut' }} />
</svg>
```

**Effect 2 — Keyword position ladder.** A vertical list where each row shows a keyword, a before position and an after position, with a chartreuse bar whose length maps to the improvement. Rows animate in from the left with a stagger.

## 6. Component Breakdown

1. **Navbar** — 72px, fixed, near-black with blur, chartreuse 1px bottom border after scroll. Wordmark left, links centre, `Get a Free Audit` chartreuse button right.
2. **Hero** — 88vh, type-led with a faint dotted grid. Mono eyebrow, H1, subline, two CTAs, four client-type labels. No stock imagery.
3. **Growth chart** — the proof section (Effect 1) with a caption naming the client type and the period.
4. **Results** — four count-up metrics: average traffic increase, average months to result, clients retained, keywords in top three.
5. **Services** — 2x3 grid: technical SEO, content strategy, digital PR and links, local SEO, ecommerce SEO, AI search visibility.
6. **Keyword ladder** — position improvements for eight real-looking keywords (Effect 2), grouped by client.
7. **Case studies** — three cards with industry, starting position, what was done, and the outcome in a single number.
8. **How we work** — four phases across ninety days with monospace week labels.
9. **Pricing** — three retainers with what is included and an explicit statement about contract length and exit.
10. **What we do not do** — a short opinionated section listing four tactics the agency refuses, with reasons.
11. **Free audit** — split: form left, what you get right, with turnaround stated.
12. **Footer** — darkest slate, chartreuse top rule, four columns, company registration.

## 7. Animations
- Hero: dotted grid fades in 1.2s; H1 fades up 0.7s; labels stagger 0.06s
- Traffic chart: line draws over 1.8s, area fill fades in at 1.2s delay, axis labels fade in last
- Metrics: count-up 1700ms on `useInView`
- Keyword ladder rows: `x: -20 → 0` with 0.07s stagger; the improvement bar scales from left over 0.6s
- Service cards: chartreuse 1px border fades in on hover, 0.2s, no transform
- Phase timeline: chartreuse line scales from left, 0.9s; week labels type in at 40ms per character

## 8. Responsive
- **Mobile (<768px):** hamburger; H1 clamps to 40px; chart keeps full width at a shorter viewBox height with every other month label hidden; metrics 2x2; services 1-col; keyword ladder rows stack keyword above the before and after pair; pricing 1-col.
- **Tablet:** services 2-col, metrics 4-col at smaller type, case studies 3-col.
- **Desktop:** max width 1200px, `px-16`, `py-24`.

## 9. Full Copy

**Brand:** COMPOUND SEARCH · SEO agency · Lisbon and remote

**Navbar:** Results · Services · Case Studies · Pricing · About · [Button] Get a Free Audit

**Hero**
- Eyebrow: `SEO AGENCY · LISBON & REMOTE · B2B AND ECOMMERCE · SINCE 2018`
- H1: `SEO compounds. Most agencies bill before it does.`
- Subline: `We take on eight clients at a time and work on the two or three things that actually move a site. If we cannot see a path to a result in ninety days, we say so before you sign.`
- CTAs: `Get a Free Audit` · `See Case Studies`
- Labels: `B2B SAAS` · `ECOMMERCE` · `MARKETPLACES` · `PROFESSIONAL SERVICES`

**Growth chart** — Caption: `Organic sessions, B2B SaaS client, 18 months from engagement start. 4,100 to 61,400 monthly sessions.`

**Results** — `+412%` Average organic traffic at 12 months · `4.5` Average months to measurable result · `91%` Client retention past year one · `1,840` Client keywords in the top three

**Services**
1. **Technical SEO** — Crawl budget, indexation, rendering, Core Web Vitals and site architecture. Unglamorous, and usually where the first thirty percent comes from.
2. **Content Strategy** — Topic clusters built around fan-out coverage rather than one keyword per page, with briefs your writers can actually use.
3. **Digital PR & Links** — Earned links from data-led stories and expert commentary. No guest post networks, no paid placements, no private blog networks.
4. **Local SEO** — Multi-location profile management, review velocity, and location pages that are not the same page with a city name swapped in.
5. **Ecommerce SEO** — Category architecture, faceted navigation control, and product schema. Most ecommerce sites lose more to indexation bloat than to competition.
6. **AI Search Visibility** — Getting cited in AI Overviews, ChatGPT and Perplexity. It rests on classic SEO plus off-site mentions, and we will explain honestly why most GEO packages are theatre.

**Keyword ladder** — Eyebrow `POSITION MOVEMENT` — H2 `Twelve months of movement`
- `procurement software` — 34 → 3
- `vendor management platform` — 61 → 7
- `spend analysis tool` — 88 → 4
- `supplier onboarding software` — 27 → 2
- `contract lifecycle management` — 45 → 9
- `purchase order software` — 19 → 1
- `sourcing platform comparison` — 72 → 6
- `procurement automation` — 51 → 5

**Case studies**
1. **B2B SaaS, procurement** — Started at 4,100 monthly sessions with 90% branded. Rebuilt the site architecture, killed 340 thin pages, and built eight topic clusters. **61,400 sessions at 18 months, 71% non-branded.**
2. **Ecommerce, outdoor equipment** — Faceted navigation was generating 1.2 million indexable URLs. Controlled it, consolidated categories, fixed product schema. **Organic revenue up 2.8x in 11 months.**
3. **Professional services, 14 locations** — Location pages were duplicates with a city swapped. Rewrote each around genuinely local content and rebuilt the profile estate. **Local pack visibility up 340%, enquiries up 190%.**

**How we work**
- `WEEK 1–2` **Audit and prioritisation** — Full technical and content audit. You get a ranked list of what matters, with an honest note on what does not.
- `WEEK 3–6` **Foundations** — Technical fixes and architecture. Nothing else works properly until this does.
- `WEEK 7–12` **Content and links** — Clusters shipped and the first earned links landed. This is where the curve starts to bend.
- `MONTH 4+` **Compounding** — Monthly shipping, monthly reporting, quarterly strategy reset. Results accelerate because the foundation is already in.

**Pricing**
- **Foundation — €3,200 a month** — Technical SEO and architecture · Monthly reporting · Two strategy calls a month · Best for sites under 500 pages
- **Growth — €5,800 a month** *(most chosen)* — Everything in Foundation · Content strategy and briefs · Four earned links a month · Weekly reporting · Dedicated strategist
- **Compound — €9,500 a month** — Everything in Growth · Digital PR campaigns · Ecommerce or multi-location scope · Named team of three · On-site quarterly

Note: `Three-month minimum, then rolling monthly. No twelve-month lock-in, because an agency that needs one is telling you something.`

**What we do not do** — H2 `Four things we will not sell you`
1. `Guest post networks and paid links.` They work until an update, and then they do not, and you cannot undo them quickly.
2. `Publishing volume.` Correlation between page count and AI visibility is 0.19. Forty articles a month is a billing strategy, not an SEO one.
3. `llms.txt and schema sold as AI optimisation.` A study of 137,000 domains found 97% of llms.txt files were never fetched. Schema is for rich results, not AI citations.
4. `Rank reports as the deliverable.` We report traffic value, share of voice and conversions. Positions in an era of AI Overviews mean considerably less than they used to.

**Free audit** — Form: Name / Company / Website / Monthly organic sessions / What is the goal? → [Button] `Get a Free Audit`
What you get: `A twelve-page audit within five working days, a ranked list of fixes, and a thirty-minute call. No obligation, and we will tell you if you do not need us.`

**Footer** — COMPOUND SEARCH · `SEO that compounds. Lisbon and remote.` · `hello@compoundsearch.com` · Company registration PT 514882019 · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
