# Cornerstone Insurance — Independent Insurance Agency Website Prompt

## 1. Goal Statement
Build a trustworthy independent insurance brokerage website for **Cornerstone Insurance**, defined by warm oatmeal, deep navy, and a confident transitional serif — a site that leads with a coverage-gap checker rather than a quote form, because the sale is realising what you are not covered for.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(38, 30%, 96%);       /* #f8f4ed oatmeal */
  --foreground: hsl(216, 40%, 15%);      /* #17223a deep navy */
  --primary: hsl(216, 58%, 30%);         /* #204079 navy */
  --primary-foreground: hsl(38, 30%, 97%);
  --muted-foreground: hsl(216, 8%, 46%);
  --border: hsl(36, 16%, 86%);
  --card: hsl(38, 32%, 92%);
  --accent-gap: hsl(28, 82%, 54%);       /* coverage gap warning */
  --accent-ok: hsl(158, 46%, 38%);       /* covered */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **H1:** Spectral 600, clamp(36px, 4.5vw, 62px), letter-spacing -0.015em
- **H2:** Spectral 500, 30–42px
- **H3:** Inter 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.76
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.18em, 11px, navy
- **Coverage figures:** Spectral 600, tabular-nums

## 5. Visual Effects

**Effect 1 — Coverage gap checker.** Six toggle chips for what the visitor already has. As they toggle, an adjacent panel lists what is still uncovered, each gap appearing with an amber dot and a one-line consequence. This is the conversion engine of the page.

```tsx
const all = ['Home', 'Auto', 'Life', 'Umbrella', 'Disability', 'Flood'];
const consequence = {
  Umbrella: 'A judgment above your auto limit comes out of your savings.',
  Disability: 'A six-month injury means six months with no income.',
  Flood: 'Standard home policies exclude flood entirely. Not partially — entirely.',
  Life: 'Your mortgage does not stop when your income does.',
};
const [have, setHave] = useState(['Home', 'Auto']);
const gaps = all.filter(x => !have.includes(x) && consequence[x]);

<AnimatePresence>
  {gaps.map((g, i) => (
    <motion.li key={g} layout
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.28, delay: i * 0.06 }}
      className="flex gap-3 border-b border-[var(--border)] py-4">
      <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--accent-gap)' }} />
      <div><strong>{g}</strong><p className="text-sm text-[var(--muted-foreground)]">{consequence[g]}</p></div>
    </motion.li>
  ))}
</AnimatePresence>
```

**Effect 2 — Carrier logo marquee.** A slow infinite horizontal marquee of carrier names set as text badges, pausing on hover, demonstrating that an independent broker shops the market rather than selling one product.

## 6. Component Breakdown

1. **Navbar** — 74px, sticky, oatmeal, 1px bottom border. Wordmark left, links centre, phone and `Get a Quote` navy button right.
2. **Hero** — split, text left, image right. Eyebrow, serif H1, subline, two CTAs, four trust points. *Image: a family home exterior in warm late-afternoon light, established neighbourhood, reassuring and ordinary.*
3. **Carrier marquee** — the independence proof (Effect 2) directly under the hero.
4. **Coverage gap checker** — the primary interaction (Effect 1) with a `Talk to an agent about these gaps` CTA below the results.
5. **Personal lines** — 2x3 cards: home, auto, umbrella, life, renters, flood.
6. **Business lines** — 2x3 cards: general liability, commercial property, workers compensation, commercial auto, professional liability, cyber.
7. **Independent versus captive** — a two-column comparison explaining what an independent broker does differently, with a plain statement about commission.
8. **Claims support** — three steps describing what the agency does when a claim happens, which is the moment the relationship is actually tested.
9. **Meet the team** — 3 agent cards with name, licence number, specialism and a direct line.
10. **Reviews** — three quote cards, each naming the specific policy involved.
11. **Quote form** — split: form left, direct contact right, with an honest note about how long a quote takes.
12. **Footer** — navy, four columns, licence numbers by state, disclosures.

## 7. Animations
- Hero: text fades up 0.7s; image reveals with a rise and fade, 0.9s
- Carrier marquee: continuous translateX loop, 28s linear, pauses on hover, respects reduced motion
- Gap checker: chips toggle with a 0.2s background transition; gap rows enter with layout animation and a 0.06s stagger
- Coverage cards: fade-up stagger 0.07s; hover raises a 1px navy border
- Comparison rows: check and dash icons pop `scale 0.7 → 1`, staggered
- Claims steps: navy connecting line scales from left, 0.8s

## 8. Responsive
- **Mobile (<768px):** hamburger; image stacks above text; H1 clamps to 36px; gap checker chips wrap to two rows and the results panel sits beneath rather than beside; coverage cards 1-col; comparison becomes stacked labelled cards; `Get a Quote` pinned as a sticky bottom bar.
- **Tablet:** hero split retained, coverage 2-col, team 2-col.
- **Desktop:** max width 1160px, `px-16`, `py-22`.

## 9. Full Copy

**Brand:** CORNERSTONE INSURANCE · Independent agency · Raleigh, North Carolina

**Navbar:** Personal · Business · Claims · About · Contact · `(919) 555-0146` · [Button] Get a Quote

**Hero**
- Eyebrow: `RALEIGH, NC · INDEPENDENT AGENCY · 22 CARRIERS · SINCE 2003`
- H1: `We work for you, not for one carrier.`
- Subline: `An independent insurance agency covering North Carolina. We quote twenty-two carriers, explain what is actually excluded, and answer the phone when you have a claim.`
- CTAs: `Check My Coverage Gaps` · `Get a Quote`
- Trust points: `22 carriers quoted` · `Licensed in NC, SC and VA` · `Claims advocacy included` · `4.9 from 480+ reviews`

**Carrier marquee** — `Travelers` · `Nationwide` · `Safeco` · `Progressive` · `Chubb` · `Hanover` · `Cincinnati` · `Auto-Owners` · `Erie` · `Selective` · `Hartford` · `Kemper`

**Coverage gap checker** — Eyebrow `START HERE` — H2 `What are you not covered for?`
`Tick what you already have. We will show you the gaps that cost people the most, and what each one actually means when something goes wrong.`

Gaps and consequences:
- **Umbrella** — A judgment above your auto liability limit comes out of your savings and future wages.
- **Disability** — A six-month injury means six months with no income. It is the most commonly skipped policy and the most commonly needed.
- **Flood** — Standard home policies exclude flood entirely. Not partially, entirely. Twenty percent of flood claims come from outside mapped flood zones.
- **Life** — Your mortgage does not stop when your income does.
CTA: `Talk to an agent about these gaps`

**Personal lines**
1. **Homeowners** — Dwelling, contents, liability and loss of use, with replacement cost rather than actual cash value on anything that matters.
2. **Auto** — Liability, collision, comprehensive and uninsured motorist. We will tell you when your state minimum is dangerously low, which it usually is.
3. **Umbrella** — One to five million in liability above your home and auto policies, for roughly the price of a phone bill.
4. **Life** — Term and whole life. We are direct about which one you actually need, and it is usually term.
5. **Renters** — Contents and liability from around fifteen dollars a month. The most under-purchased policy there is.
6. **Flood** — Separate NFIP and private flood policies, with a thirty-day waiting period you need to know about before hurricane season.

**Business lines**
1. **General Liability** — Third-party bodily injury and property damage, plus products and completed operations.
2. **Commercial Property** — Building, contents, equipment and business interruption, which is the coverage most owners forget.
3. **Workers Compensation** — Required in North Carolina at three or more employees. We handle classification codes properly, which affects your premium more than anything else.
4. **Commercial Auto** — Owned, hired and non-owned vehicles, including employees driving their own cars on company business.
5. **Professional Liability** — Errors and omissions for consultants, agencies, contractors and licensed professionals.
6. **Cyber** — Breach response, notification costs, ransomware and business interruption. No longer optional for anyone holding customer data.

**Independent versus captive** — H2 `Why independent matters`
`A captive agent sells one company's policies. We quote twenty-two, which means when your carrier raises your premium twenty percent at renewal, we move you instead of explaining why you should accept it. We are paid a commission by whichever carrier you choose, and it does not vary enough to influence what we recommend. We will tell you when it does.`

**Claims support**
1. **Call us first, not the carrier** — We take the details, tell you what to document, and file it with you rather than for you.
2. **We advocate through the process** — If an adjuster undervalues something, we push back with the policy language. That is what the relationship is for.
3. **We follow it to close** — You get a weekly update until it is settled, whether or not there is news.

**Team**
1. **Ray Whitfield** — Principal Agent · NC Licence 8842019 — Twenty-two years in personal lines. Direct: (919) 555-0147.
2. **Dana Kessler** — Commercial Lines Agent · NC Licence 9120884 — Contractors, restaurants and professional services. Direct: (919) 555-0148.
3. **Marcus Obi** — Personal Lines Agent · NC Licence 9450112 — Auto, home and umbrella, and the person who reads every renewal notice.

**Reviews**
1. `They found a two hundred thousand dollar gap between my auto liability and my actual net worth. I had never thought about it once in twenty years of driving.` — **Sandra P.**, Umbrella policy
2. `Hurricane damage, adjuster came back low, Ray got on the phone with the policy in front of him and it went up by eleven thousand dollars.` — **Tom R.**, Homeowners claim
3. `My previous agent renewed me every year without a word. Cornerstone shopped it and saved me four hundred dollars on identical coverage.` — **Elena V.**, Auto and home

**Quote form** — Name / Email / Phone / What do you need covered? / Current carrier if any → [Button] `Get a Quote`
Note: `Personal quotes usually come back the same day. Commercial takes two to three, because we actually shop it.`

**Footer** — CORNERSTONE INSURANCE · `Independent agency, Raleigh NC` · `4210 Six Forks Road, Suite 200, Raleigh, NC 27609` · `(919) 555-0146` · Licensed in NC, SC and VA · NC Agency Licence 8842019 · © 2026

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
