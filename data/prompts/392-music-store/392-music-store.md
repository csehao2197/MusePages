# Wolfram Guitars — Music Store Website Prompt

## 1. Goal Statement
Build a dark, gear-obsessive music instrument store website for **Wolfram Guitars**, defined by near-black, warm amber, and a heavy grotesk — a shop site built around a filterable used-gear wall and a repair workshop, because that is where an independent instrument shop actually competes.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(24, 10%, 9%);        /* #191614 near-black warm */
  --foreground: hsl(36, 20%, 92%);       /* #eee8e0 */
  --primary: hsl(34, 88%, 56%);          /* #f0951f amber */
  --primary-foreground: hsl(24, 12%, 8%);
  --muted-foreground: hsl(30, 6%, 56%);
  --border: hsl(24, 8%, 20%);
  --card: hsl(24, 9%, 13%);
  --card-elevated: hsl(24, 8%, 17%);
  --sold: hsl(4, 60%, 52%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Chakra Petch 700, uppercase, clamp(40px, 5.6vw, 84px), letter-spacing -0.01em
- **H2:** Chakra Petch 600, uppercase, 30–48px
- **H3 / model names:** Chakra Petch 600, 18–21px
- **Body:** Inter 300–400, 16px, line-height 1.7
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, amber
- **Prices / years / serial numbers:** Chakra Petch 700, tabular-nums

## 5. Visual Effects

**Effect 1 — Used gear wall with multi-filter.** A filterable grid of used and vintage instruments with chips for type, decade, price band and condition. Each card shows the year, model, condition grade, price, and a sold badge where relevant, re-flowing with a layout animation.

```tsx
const [filters, setFilters] = useState({ type: 'All', decade: 'All', max: 4000 });
const shown = useMemo(
  () => stock.filter(g =>
    (filters.type === 'All' || g.type === filters.type) &&
    (filters.decade === 'All' || g.decade === filters.decade) &&
    g.price <= filters.max
  ),
  [filters]
);

<motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
  <AnimatePresence mode="popLayout">
    {shown.map(g => (
      <motion.article
        key={g.id}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* gear card */}
      </motion.article>
    ))}
  </AnimatePresence>
</motion.div>
```

**Effect 2 — Amber string pluck divider.** A thin horizontal amber line between sections that, on scroll entry, oscillates once with a damped sine wave using an animated SVG path before settling flat. Respects reduced motion by simply fading in.

## 6. Component Breakdown

1. **Navbar** — 72px, fixed, near-black with blur, amber 1px bottom border after scroll. Wordmark left, links centre, `Book a Setup` amber button right.
2. **Hero** — 88vh, full-bleed shop-wall photograph with a left gradient. Eyebrow, uppercase H1, subline, two CTAs, four shop facts. *Image: a wall of electric guitars hanging in a dimly lit shop, warm spotlights, rich wood and chrome, atmospheric retail photography.*
3. **Just in strip** — a horizontally scrolling row of the four newest arrivals with price and year.
4. **Used gear wall** — the main section (Effect 1) with filter chips and twelve instruments.
5. **The workshop** — setups, refrets, electronics, and restoration, each with a price and turnaround. This is the section that separates a shop from a website.
6. **Setup explainer** — what a setup actually involves and why a £55 setup makes more difference than a £500 upgrade.
7. **Part exchange** — how the shop values trade-ins, what it does and does not take, and a valuation form.
8. **New stock brands** — a text-badge row of the brands carried, with an honest note about what the shop deliberately does not stock.
9. **Try before you buy** — the in-store proposition: amp rooms, no time limit, and no hovering.
10. **Lessons** — three tutors with instrument, level and hourly rate.
11. **Visit** — address, hours, parking, and a line about the shop dog.
12. **Footer** — darkest brown, amber top rule, four columns, finance provider, contact.

## 7. Animations
- Hero: image scales 1.04 to 1 over 12s; H1 reveals with a clipPath line wipe, 0.8s
- Just in strip: horizontal scroll snap, cards scale 1.02 when centred
- Filter changes: layout re-flow with popLayout, 0.3s per card
- Gear cards: image scales 1.04 on hover over 0.6s; sold badge stays static
- String pluck dividers: one damped oscillation on entry, 0.9s, reduced-motion safe
- Workshop rows: fade in staggered 0.06s
- Brand badges: fade in staggered 0.04s

## 8. Responsive
- **Mobile (<768px):** hamburger with a full-screen dark overlay; H1 clamps to 40px; filter chips horizontally scrollable with a `Filters` sheet for price and decade; gear wall 1-col; workshop rows keep job and price on one line; `Book a Setup` pinned as a sticky bottom bar.
- **Tablet:** gear wall 3-col, workshop 2-col, just-in strip 3 visible.
- **Desktop:** gear wall 4-col, max width 1280px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** WOLFRAM GUITARS · Instruments, amps and repairs · Glasgow

**Navbar:** Used Gear · Workshop · Part Exchange · Lessons · Visit · [Button] Book a Setup

**Hero**
- Eyebrow: `GLASGOW · SINCE 1998 · USED, VINTAGE AND NEW · FULL REPAIR WORKSHOP`
- H1: `EVERY GUITAR ON THIS WALL HAS BEEN SET UP BY HAND.`
- Subline: `An independent instrument shop in Finnieston. Around two hundred used and vintage guitars, a full repair bench, and staff who will talk you out of a more expensive one if the cheaper one is right.`
- CTAs: `See the Used Wall` · `Book a Setup`
- Facts: `~200 used in stock` · `Full repair workshop` · `Part exchange welcome` · `Try anything, no pressure`

**Just in** — `1978 Fender Stratocaster, £2,850` · `2019 Gibson Les Paul Standard, £1,690` · `1965 Vox AC30 Top Boost, £2,200` · `2021 Martin D-28, £1,950`

**Used gear wall** — Eyebrow `USED & VINTAGE` — H2 `WHAT IS ON THE WALL TODAY`
Filters: `All` · `Electric` · `Acoustic` · `Bass` · `Amps` · `Effects` — Decade: `All` · `1960s` · `1970s` · `1980s` · `1990s` · `2000s+`

1. **1978 Fender Stratocaster** — Electric · Excellent · £2,850 — Original pickups, refinished in the 1990s, plays beautifully. Refin is why it is not £4,500.
2. **1965 Vox AC30 Top Boost** — Amp · Very good · £2,200 — Serviced last month, original speakers, one replaced valve. Sounds like it should.
3. **2019 Gibson Les Paul Standard** — Electric · Mint · £1,690 — Two years old, barely played, original case and paperwork.
4. **2021 Martin D-28** — Acoustic · Excellent · £1,950 — A few belt marks on the back, otherwise as new. Sounds better than it did in 2021.
5. **1972 Fender Precision Bass** — Bass · Good · £1,780 — Heavily played, tuners replaced, neck is straight and the tone is exactly what you want.
6. **1990 Marshall JCM800 2203** — Amp · Very good · £1,150 — Later JCM800, fully serviced, no mods.
7. **2016 Fender Telecaster American Pro** — Electric · Excellent · £890 — Honest workhorse. Small ding on the lower bout, priced accordingly.
8. **1968 Framus Texan** — Acoustic · Good · £640 — Odd, characterful, and cheaper than it deserves to be because nobody knows the brand.
9. **2020 Rickenbacker 4003** — Bass · Excellent · £1,590 — Fireglo, original case, one owner.
10. **1980 Roland Jazz Chorus JC-120** — Amp · Good · £780 — Loud, clean, heavy. Bring a friend to carry it.
11. **2018 PRS SE Custom 24** — Electric · Very good · £480 — Best-value guitar in the shop by some distance.
12. **1976 Yamaha FG-180** — Acoustic · Good · £390 — *Sold*

**The workshop** — Eyebrow `THE WORKSHOP` — H2 `THREE BENCHES, TWO LUTHIERS`
`Standard setup £55 · 3–4 days` · `Setup with new strings £68 · 3–4 days` · `Fret dress and polish £145 · 1 week` · `Full refret £340 · 2–3 weeks` · `Nut replacement, bone £75 · 1 week` · `Electronics rewire £95 · 1 week` · `Pickup fitting £45 per pickup · 3 days` · `Acoustic bridge reglue £160 · 2 weeks` · `Amp service and retube £120 plus valves · 1–2 weeks` · `Structural crack repair from £180 · quoted after inspection`

**Setup explainer** — H2 `A £55 SETUP BEATS A £500 UPGRADE`
`Most guitars that feel wrong are not badly made, they are badly adjusted. A setup means truss rod, action, intonation, nut slots and pickup height, done properly for the strings you actually use and the way you actually play. It is the single biggest improvement available to almost every instrument in the country, and people spend years buying pedals instead.`
`Bring the guitar in and tell us what annoys you about it. If a setup will not fix it, we will say so rather than take your money.`

**Part exchange** — `We take guitars, basses, amps and interesting effects. We do not take digital modelling amps, budget beginner packs, or anything with a cracked neck we cannot certify. We pay roughly sixty percent of what we will retail it for, we tell you the retail figure to your face, and you can always take cash instead of credit at a lower rate.`

**New stock** — `Fender` · `Gibson` · `Martin` · `Gretsch` · `PRS` · `Rickenbacker` · `Vox` · `Orange` · `Blackstar` · `Boss` · `Strymon` · `Universal Audio`
Note: `We deliberately do not stock beginner packs. There are shops that do it better and cheaper, and we would rather send you there than sell you something we do not believe in.`

**Try before you buy** — `Two amp rooms, both properly isolated, both with a decent amp and a chair. Take anything off the wall, plug in, and play for as long as you want. Nobody will stand behind you. If you want to be left alone entirely, say so and we will genuinely leave you alone.`

**Lessons**
1. **Callum Reid** — Electric guitar, all levels — £32 an hour, Tuesdays and Thursdays
2. **Ana Ferreira** — Acoustic and fingerstyle, beginner to intermediate — £30 an hour, Mondays and Wednesdays
3. **Josh Mbeki** — Bass, all levels, including theory — £30 an hour, Fridays and Saturdays

**Visit** — `184 Argyle Street, Finnieston, Glasgow G3 8TE` · Mon–Sat 10:00–18:00 · Sun 12:00–16:00
`Parking on Minerva Street after 6pm and all day Sunday. The shop dog is called Bear, he is fourteen, and he will not move for you.`

**Footer** — WOLFRAM GUITARS · `Every guitar on this wall has been set up by hand.` · `0141 555 0166` · Finance available through Novuna · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-slider": "^1.2.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
