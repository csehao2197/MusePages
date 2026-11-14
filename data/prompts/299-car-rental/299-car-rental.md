# Roadline Rentals — Car Rental Website Prompt

## 1. Goal Statement
Build a fast, no-nonsense car rental website for **Roadline Rentals**, defined by clean white, a confident cobalt, and a tight geometric sans — built around a search bar and a fleet grid, with the excess and fuel policy stated on the page instead of in a PDF nobody opens.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(210, 22%, 98%);      /* #f9fbfc */
  --foreground: hsl(220, 30%, 14%);      /* #19202e */
  --primary: hsl(222, 84%, 48%);         /* #1450e0 cobalt */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(220, 8%, 46%);
  --border: hsl(212, 18%, 89%);
  --card: hsl(210, 26%, 95%);
  --accent-go: hsl(150, 58%, 40%);       /* available */
  --accent-warn: hsl(32, 90%, 52%);      /* last one */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Plus Jakarta Sans 800, clamp(36px, 4.6vw, 64px), letter-spacing -0.03em
- **H2:** Plus Jakarta Sans 700, 30–42px
- **H3 / model names:** Plus Jakarta Sans 700, 18–21px
- **Body:** Inter 300–400, 16px, line-height 1.7
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.16em, 11px, cobalt
- **Prices / seats / doors:** Plus Jakarta Sans 800, tabular-nums

## 5. Visual Effects

**Effect 1 — Search bar with live daily rate.** A pickup location, dates and driver age bar that computes the number of days and shows an estimated total beneath as the dates change, before anyone reaches the fleet.

```tsx
const [from, setFrom] = useState(null);
const [to, setTo] = useState(null);
const days = from && to ? Math.max(1, Math.round((to - from) / 86400000)) : 0;
const cheapest = 29;

{days > 0 && (
  <motion.p
    key={days}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="mt-4 text-sm text-[var(--muted-foreground)]"
  >
    {days} days · from <span className="font-bold text-[var(--foreground)] tabular-nums">£{days * cheapest}</span> total, all inclusive
  </motion.p>
)}
```

**Effect 2 — Fleet card with spec reveal.** Vehicle cards where hovering lifts the card, scales the image slightly, and fades in a four-item spec row of seats, doors, luggage and transmission beneath the price.

## 6. Component Breakdown

1. **Navbar** — 70px, sticky, white, 1px bottom border. Wordmark left, links centre, phone and `Book Now` cobalt button right.
2. **Hero** — 78vh, split. Text and search bar left, vehicle image right. Eyebrow, H1, subline, search bar, four trust points. *Image: a clean modern hatchback three-quarter view on a bright neutral background, crisp daylight, product photography.*
3. **Trust strip** — free cancellation, no card fee, unlimited mileage, fuel policy stated in four words.
4. **Fleet** — the main section. Category filter chips across, then a grid of eight vehicle cards (Effect 2), each with class, daily rate, spec row and availability badge.
5. **What is included** — six items that are actually included, each with a tick, and three that are not, each with a cross. This honesty block is the differentiator in a category built on hidden fees.
6. **Excess and insurance** — a plain table of the three cover levels with excess amount, daily cost and what each covers.
7. **Fuel and mileage policy** — two short paragraphs stating the like-for-like fuel policy and the unlimited mileage exceptions.
8. **How it works** — four steps from booking to return, including what documents to bring.
9. **Locations** — three branches with addresses, hours, and an out-of-hours return note.
10. **Long-term hire** — monthly rates for one to six months, aimed at contractors and people between cars.
11. **FAQ** — accordion, six questions on young drivers, additional drivers, one-way hire, deposits, damage and cross-border travel.
12. **Footer** — deep navy, four columns, company registration, insurance underwriter, terms link.

## 7. Animations
- Hero: text fades up 0.6s; search bar scales 0.98 to 1 with a soft shadow, 0.5s
- Estimated total: re-mounts and fades up on date change, 0.25s
- Filter chips: background transition 0.2s; grid re-flows with motion layout, 0.32s
- Fleet cards: lift 4px, image scales 1.03, spec row fades in over 0.25s on hover
- Included and excluded lists: tick and cross icons pop scale 0.7 to 1, staggered 0.05s
- Step numbers: pop staggered 0.1s
- Everything is fast — this is a transactional site, not an editorial one

## 8. Responsive
- **Mobile (<768px):** hamburger; hero image drops below the search bar; H1 clamps to 36px; search bar stacks into four full-width fields with a sticky `Search` button; fleet 1-col; excess table becomes stacked cards; filter chips horizontally scrollable.
- **Tablet:** fleet 2-col, hero stays split, excess table retained.
- **Desktop:** fleet 4-col, max width 1240px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** ROADLINE RENTALS · Car hire · Manchester, Leeds and Liverpool

**Navbar:** Fleet · Included · Insurance · Locations · Long-term · `0161 555 0192` · [Button] Book Now

**Hero**
- Eyebrow: `MANCHESTER · LEEDS · LIVERPOOL · FROM £29 A DAY, ALL IN`
- H1: `The price you see is the price you pay.`
- Subline: `Independent car hire across the North West. Unlimited mileage, like-for-like fuel, and an excess you can actually see before you book rather than at the desk.`
- Search bar: `Pick-up location` · `From` · `To` · `Driver age` · [Button] `Search`
- Trust points: `Free cancellation to 24h` · `No card fee` · `Unlimited mileage` · `Full-to-full fuel`

**Fleet** — Eyebrow `THE FLEET` — H2 `Eight cars, no surprises`
Filters: `All` · `Small` · `Estate` · `SUV` · `Van` · `Electric`

1. **Economy — Vauxhall Corsa or similar** — £29 a day — 5 seats · 5 doors · 1 large bag · Manual — *Available*
2. **Compact — Ford Focus or similar** — £34 a day — 5 seats · 5 doors · 2 large bags · Manual — *Available*
3. **Compact Automatic — Toyota Corolla or similar** — £42 a day — 5 seats · 5 doors · 2 large bags · Automatic — *Available*
4. **Estate — Skoda Octavia Estate or similar** — £48 a day — 5 seats · 5 doors · 4 large bags · Manual — *2 left*
5. **SUV — Nissan Qashqai or similar** — £55 a day — 5 seats · 5 doors · 3 large bags · Automatic — *Available*
6. **7-Seat — Peugeot 5008 or similar** — £72 a day — 7 seats · 5 doors · 3 large bags · Automatic — *1 left*
7. **Electric — MG4 or similar** — £52 a day — 5 seats · 5 doors · 2 large bags · Automatic, 280 mile range — *Available*
8. **Small Van — Ford Transit Custom** — £58 a day — 3 seats · 6.8 cubic metres · Manual — *Available*

**What is included** — H2 `What the daily rate actually covers`
Included: `Unlimited mileage` · `Third party, fire and theft` · `Collision damage waiver with the standard excess` · `Breakdown cover, UK-wide` · `One named additional driver` · `VAT`
Not included: `Excess reduction, which is optional and priced below` · `Child seats, £6 a day` · `Additional drivers beyond the first, £8 a day`

**Excess and insurance**
| Cover level | Excess | Daily cost | Covers |
|---|---|---|---|
| Standard | £1,200 | Included | Bodywork and third party |
| Reduced | £350 | £11 a day | Bodywork, third party, glass and mirrors |
| Zero | £0 | £19 a day | Everything above plus tyres, undercarriage and roof |

Note: `We take a pre-authorisation of the excess amount on a credit card at pickup, released within five working days of return. We do not take cash deposits and we do not accept prepaid cards, which is standard across the industry and worth knowing before you drive to the branch.`

**Fuel and mileage** — `Full-to-full. You collect it full, you bring it back full, and if you do not we charge the pump price plus a £15 refuelling fee rather than an invented rate. There is a petrol station four hundred metres from every branch.`
`Mileage is unlimited on every vehicle for UK hires. The only exception is one-way hires over three hundred miles, where a relocation fee applies and is quoted before you confirm.`

**How it works**
1. **Book** — Online in about two minutes. Free cancellation up to twenty-four hours before pickup.
2. **Bring** — Your driving licence, a credit card in the main driver's name, and a DVLA check code if your licence is UK-issued.
3. **Collect** — Fifteen minutes at the desk including the walk-round. We photograph the car with you and email you the images.
4. **Return** — Drop the keys at the desk, or in the out-of-hours box. We inspect within twenty-four hours and email you the result either way.

**Locations**
- **Manchester** — `Unit 3, Ashton Old Road, Manchester M11 2DP` · Mon–Fri 7:30–19:00, Sat 8:00–17:00, Sun 9:00–15:00
- **Leeds** — `440 Kirkstall Road, Leeds LS4 2HQ` · Mon–Fri 8:00–18:30, Sat 8:30–16:00, Sun closed
- **Liverpool** — `12 Great Howard Street, Liverpool L3 7HS` · Mon–Fri 8:00–18:00, Sat 9:00–15:00, Sun closed
Note: `Out-of-hours return at all three branches via the key box. The hire ends when the key drops, not the next morning.`

**Long-term hire** — `One month £680 · Two months £1,290 · Three months £1,850 · Six months £3,400, on a compact automatic. Includes servicing, tyres and breakdown cover. Popular with contractors, people between cars, and anyone waiting eleven months for a delivery slot.`

**FAQ**
1. **Can I hire at 21?** — Yes, on the economy and compact classes only, with a £14 a day young driver surcharge. Under 21 we cannot insure.
2. **Can I add another driver?** — One is included. Additional drivers are £8 a day each and must be present at pickup with their licence.
3. **Do you do one-way hires?** — Between our three branches, yes, for a £45 relocation fee. Elsewhere, no.
4. **What deposit do you take?** — A pre-authorisation equal to your excess, on a credit card in the main driver's name. Released within five working days.
5. **What happens if I damage it?** — We show you the photographs from pickup, quote the repair, and charge up to your excess. No admin fee beyond the repair itself.
6. **Can I take it abroad?** — To Ireland yes, with fourteen days notice and a £60 documentation fee. Continental Europe, no.

**Footer** — ROADLINE RENTALS · `The price you see is the price you pay.` · `0161 555 0192` · Company registration 09442018 · Insurance underwritten by Northbridge Motor · Terms and conditions · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "react-day-picker": "^9.0.0",
  "@radix-ui/react-accordion": "^1.2.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
