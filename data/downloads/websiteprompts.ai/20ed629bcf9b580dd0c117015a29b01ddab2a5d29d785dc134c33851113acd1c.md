# Wexford Links — Golf Club Website Prompt

## 1. Goal Statement
Build a heritage private golf club website for **Wexford Links**, defined by deep fairway green, warm cream, and a restrained engraved-crest aesthetic that signals a club founded in 1926 rather than a driving range.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(42, 34%, 95%);      /* #f7f2e8 cream */
  --foreground: hsl(150, 26%, 14%);     /* #1a2e24 fairway ink */
  --primary: hsl(150, 38%, 22%);        /* #23503c deep green */
  --primary-foreground: hsl(42, 34%, 96%);
  --muted-foreground: hsl(150, 8%, 44%);
  --border: hsl(40, 18%, 85%);
  --card: hsl(42, 36%, 91%);
  --accent-brass: hsl(38, 46%, 52%);    /* engraved brass */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **H1:** Cormorant Garamond 300, clamp(40px, 5vw, 72px), letter-spacing 0.01em
- **H2:** Cormorant Garamond 400, 32–46px
- **H3 / card titles:** Inter 600, 17–20px
- **Body:** Inter 300, 17px, line-height 1.78
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, brass
- **Hole numbers / yardages:** Cormorant Garamond 600, tabular-nums

## 5. Visual Effects

**Effect 1 — Interactive course scorecard.** An 18-row table where hovering a row expands a short hole description and highlights the row in pale green. Front nine and back nine split by a brass rule with running totals.

```tsx
<tr
  onMouseEnter={() => setActive(h.number)}
  className="border-b border-[var(--border)] transition-colors duration-200"
  style={{ background: active === h.number ? 'var(--card)' : 'transparent' }}
>
  <td className="py-4 font-serif text-2xl tabular-nums">{h.number}</td>
  <td className="py-4 tabular-nums">{h.yards}</td>
  <td className="py-4 tabular-nums">{h.par}</td>
  <td className="py-4 text-sm text-[var(--muted-foreground)]">{h.handicap}</td>
</tr>
```

**Effect 2 — Brass rule reveal.** Every section heading is followed by a 1px brass line that scales from the left (`scaleX 0 → 1`, originX 0, 0.8s) on scroll entry.

## 6. Component Breakdown

1. **Navbar** — 80px, sticky, cream with 1px bottom border. Centred engraved-style crest wordmark, links split left and right, `Enquire About Membership` brass outline button right.
2. **Hero** — 92vh, full-bleed course photograph with a bottom-weighted cream gradient. Eyebrow, serif H1, subline, two CTAs. *Image: wide golf course fairway at early morning, low mist over manicured grass, mature trees framing the shot, soft warm light, landscape photography.*
3. **Club stats band** — four figures on `--card`: founded, holes, par, course rating.
4. **The Course** — 2-col: left sticky heading and description, right the 18-row scorecard (Effect 1).
5. **Signature holes** — 3 cards with images, hole number in large serif, yardage, par, and a two-sentence description.
6. **Membership** — three tiers (Full, Weekday, Junior) in bordered cream cards with joining fee, annual dues, and four benefit lines each.
7. **Practice & Coaching** — 3-col: driving range, short game area, PGA lessons, each with hours and pricing.
8. **Clubhouse & Dining** — split image and text with opening hours and dress code note.
9. **Events & Societies** — corporate days and society packages with an enquiry CTA.
10. **Visitor information** — green times, guest fees, handicap requirement, directions.
11. **Footer** — deep green, four columns, crest, address, affiliations.

## 7. Animations
- Hero: image scales `1.06 → 1` over 12s linear; H1 fades up 0.85s
- Brass rules under headings: `scaleX 0 → 1`, 0.8s, originX left
- Scorecard rows: fade in staggered `i * 0.03`; hover tints row 0.2s
- Signature hole cards: `y: 30 → 0`, stagger 0.12s; image scales 1.04 on hover over 0.6s
- Stats: count-up 1600ms on `useInView`
- Membership cards: lift `-4px` with a brass 1px border appearing on hover

## 8. Responsive
- **Mobile (<768px):** hamburger menu; H1 clamps to 40px; stats become 2x2; scorecard becomes stacked cards showing hole, par, yards on one line and description below; membership tiers stack; signature holes 1-col.
- **Tablet:** scorecard keeps table form with the handicap column hidden; signature holes 2-col.
- **Desktop:** max width 1180px, `px-16`, sections `py-24`.

## 9. Full Copy

**Brand:** WEXFORD LINKS · Est. 1926 · County Wexford

**Navbar:** The Course · Membership · Coaching · Clubhouse · Events · Visitors · [Button] Enquire About Membership

**Hero**
- Eyebrow: `FOUNDED 1926 · PARKLAND · 18 HOLES · PAR 72`
- H1: `A course that has never needed to shout.`
- Subline: `Ninety-nine years of parkland golf on the same stretch of land, with a members' waiting list we are honest about and a clubhouse that still serves a proper lunch.`
- CTAs: `Enquire About Membership` · `View the Course`

**Stats:** `1926` Founded · `18` Holes · `72` Par · `71.4` Course rating

**The Course** — Eyebrow `THE COURSE` — H2 `Eighteen holes, four of them memorable and one you will complain about.`
Description: `Mature parkland laid over gently rolling ground, with tree-lined fairways, small fast greens, and a stretch from the eleventh to the fourteenth that decides most club competitions. The course plays 6,412 yards from the whites and considerably longer into a westerly.`

**Signature holes**
1. **The 7th — 168 yards, par 3** — Downhill across water to a green that slopes away from you. Club selection is a guess and everyone claims otherwise.
2. **The 12th — 441 yards, par 4** — The hardest hole on the card. A blind drive over the ridge, then a long approach into a green guarded left by bunkers cut in 1931.
3. **The 18th — 512 yards, par 5** — Reachable in two with a following wind, which is roughly one day in nine. The clubhouse windows watch every approach.

**Membership**
- **Full Membership** — Joining fee £1,200 · Annual dues £1,850 — Unrestricted play seven days · Full competition eligibility · Guest rate of £30 · Reciprocal access to eleven partner clubs
- **Weekday Membership** — Joining fee £600 · Annual dues £1,050 — Play Monday to Friday · Weekday competitions · Guest rate of £35 · Full clubhouse rights
- **Junior Membership** — No joining fee · Annual dues £180 — Under 18 · Free group coaching · Supervised weekend play · Progression to full membership at reduced entry

Note: `Full membership currently has a waiting list of approximately fourteen months. We will tell you honestly where you sit on it.`

**Coaching** — `Driving Range` 24 covered bays, £6 per 60 balls · `Short Game Area` free to members, two practice greens and three bunkers · `PGA Lessons` £45 per half hour with Head Professional Alan Reid, video analysis included

**Clubhouse** — `The dining room serves lunch from noon to three and dinner Thursday to Sunday. Jackets are not required, but denim and trainers are not welcome after six.`

**Events** — `Corporate days from £68 per head including coffee, eighteen holes, and a two-course meal. Society packages available Monday to Thursday.`

**Visitors** — `Green fees £75 weekday, £95 weekend. Handicap certificate required. Visitor tee times from 10:30am. Book by phone on 053 555 0142.`

**Footer** — WEXFORD LINKS · `Ballymore Road, County Wexford` · Affiliated to Golf Ireland · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
