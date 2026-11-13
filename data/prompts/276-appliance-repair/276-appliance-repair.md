# Fixwell — Appliance Repair Website Prompt

## 1. Goal Statement
Build a clean, trustworthy website for **Fixwell**, a local appliance repair service — bright white with a strong cobalt blue, soft rounded cards, a friendly engineer photograph, and an appliance picker that makes it obvious in two seconds that they fix the thing that just broke.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries and no booking system. The appliance picker is presentational: selecting one highlights the card and scrolls to the matching price row.

## 3. Design System — Colors
```css
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(218, 28%, 14%);
  --primary: hsl(222, 84%, 50%);         /* cobalt */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(218, 10%, 46%);
  --border: hsl(218, 18%, 90%);
  --card: hsl(216, 38%, 97%);            /* pale blue panel */
  --success: hsl(152, 58%, 40%);         /* used only for the availability dot */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;800&display=swap" rel="stylesheet" />
```
- **H1:** Figtree 800, clamp(40px, 5.2vw, 76px), line-height 1.05, letter-spacing -0.03em
- **H2:** Figtree 800, clamp(28px, 3.4vw, 46px)
- **Body:** Figtree 400, 17px, line-height 1.65
- **Labels and prices:** Figtree 600, 13px, uppercase, letter-spacing 0.08em

## 5. Visual Effects

**Effect 1 — Appliance picker.** A row of eight rounded cards, each with a large lucide icon and a name. The selected card gets a cobalt border, a pale blue fill and a slightly raised shadow; the others dim to 55% opacity. Selecting scrolls the page to the matching row in the price table and briefly highlights it.

```jsx
<button
  onClick={() => setSelected(item.id)}
  className={clsx(
    "rounded-2xl border p-6 text-left transition-all duration-200",
    selected === item.id
      ? "border-[var(--primary)] bg-[var(--card)] shadow-lg -translate-y-1"
      : "border-[var(--border)] bg-white opacity-55 hover:opacity-100"
  )}
>
```

**Effect 2 — Today's availability.** A small pill in the navbar and hero with a pulsing green dot reading `3 slots left today`. The ring around the dot scales 1 → 2.2 and fades every 2 seconds.

**Effect 3 — Soft depth.** All cards use large radii (16–24px) and soft layered shadows rather than borders alone, so the page feels friendly rather than technical.

## 6. Component Breakdown

1. **Navbar** — 80px, white, subtle bottom shadow on scroll. Wordmark left, links centre, availability pill and cobalt `Book a repair` button right. Sticky.
2. **Hero** — split. Left: H1, subline, two buttons, four short trust bullets with check icons. Right: a rounded photograph of an engineer at a kitchen appliance, with a small floating card overlaid showing a five-star rating. *Image: friendly repair engineer in a clean uniform working on an open washing machine in a bright home kitchen, natural light.*
3. **Appliance picker** — Effect 1, eight cards in two rows.
4. **Prices** — a clean table: appliance, common faults, diagnostic fee and typical repair range. Eight rows matching the picker.
5. **How it works** — four steps in a row with cobalt numerals in pale circles.
6. **Guarantee** — a pale blue panel with a large heading, a twelve-month guarantee statement and three supporting lines.
7. **Brands we service** — a plain wrapped row of brand wordmarks in muted grey.
8. **Why not replace it** — a short two-column section with a statistic and a paragraph about repair versus replacement.
9. **Reviews** — three cards with five cobalt stars, quote, name, town and the appliance repaired.
10. **Service area** — a list of towns as soft pills plus opening hours.
11. **FAQ** — six native `<details>` elements in one column.
12. **Final CTA** — cobalt section, white text, H2, phone number and button.
13. **Footer** — white, four columns, company registration line.

## 7. Animations
- Hero content: fade up 20px, stagger 0.08s
- Hero image: `scale 0.97 → 1` with fade, 0.9s
- Picker cards: fade up 16px, stagger 0.05s; selection transitions in 200ms
- Price row highlight: background flashes pale blue for 1.2s then fades
- Availability dot: Effect 2, always running
- Step numerals: pop in with a small spring, stagger 0.1s

## 8. Responsive
- **Mobile (<768px):** sticky cobalt call bar at the bottom; hero stacks with the photograph first; H1 at 40px; picker becomes a 2×4 grid with smaller icons; the price table becomes stacked cards showing appliance, fee and range; navbar keeps only the wordmark, availability dot and a phone icon.
- **Tablet:** picker 4 across; hero stays split 50/50.
- **Desktop:** max-width 1200px, `px-8`, section spacing `py-24`.

## 9. Full Copy

**Brand:** FIXWELL · Appliance repair in Leeds & Harrogate

**Navbar:** Appliances · Prices · Guarantee · Areas — `● 3 slots left today` — Book a repair

**Hero**
- H1: `Your washing machine is fixable. Usually today.`
- Subline: `Independent appliance engineers covering Leeds and Harrogate. We carry the common parts on the van, so most repairs are finished on the first visit.`
- Buttons: `Book a repair` · `Call 0113 460 2288`
- Bullets: `Fixed £49 diagnostic, refunded if we repair` · `12-month guarantee on every repair` · `Most parts carried on the van` · `Evening and Saturday slots`
- Floating card: `4.9 out of 5 · 480 reviews`

**Appliance picker** — H2 `What's broken?`
Washing machine · Tumble dryer · Dishwasher · Fridge freezer · Oven · Hob · Microwave · Washer dryer

**Prices** — H2 `A fixed call-out, then a price before we start.`
| Appliance | Common faults | Diagnostic | Typical repair |
|---|---|---|---|
| Washing machine | Won't spin, leaking, drum bearings | £49 | £95 – £210 |
| Tumble dryer | Not heating, thermostat, belt | £49 | £85 – £165 |
| Dishwasher | Not draining, not heating, leaks | £49 | £90 – £180 |
| Fridge freezer | Not cooling, icing up, noisy fan | £49 | £110 – £240 |
| Oven | No heat, fan, door seal, element | £49 | £85 – £190 |
| Hob | Ignition, single zone dead, controls | £49 | £80 – £175 |
| Microwave | No heat, turntable, door switch | £49 | £70 – £140 |
| Washer dryer | Not drying, spin faults, pump | £49 | £105 – £230 |
Note: `The £49 diagnostic covers the visit and the diagnosis, and comes off the bill if you go ahead with the repair. We never fit a part without telling you the total first.`

**How it works**
1. **Book a slot** — `Online or by phone. Morning, afternoon or evening, and we text when we're twenty minutes away.`
2. **We diagnose it** — `Usually inside half an hour, with the fault explained in plain English.`
3. **You get a price** — `The full cost, parts included, before anything is fitted.`
4. **We fix it** — `Eight repairs in ten are finished on the first visit, from stock on the van.`

**Guarantee** — H2 `Twelve months on parts and labour.` `If the same fault comes back within a year, we return and fix it for free. No proration, no small print, no argument about whether it is the same fault.`
- `All engineers are Gas Safe and Part P registered where required`
- `We're insured to £5m and DBS checked`
- `If we can't fix it, the diagnostic is all you pay`

**Brands we service:** Bosch · Miele · Samsung · LG · Beko · Hotpoint · AEG · Siemens · Zanussi · Indesit · Whirlpool · Candy

**Why not replace it** — Statistic: `£240` — `is the average repair on an appliance that costs £620 to replace. A ten-year-old Miele washing machine with new bearings will usually outlast a new budget one. We'll tell you honestly when a repair isn't worth it, because we'd rather you call us next time.`

**Reviews**
- `"Diagnosed the bearings in ten minutes, had the part on the van, done in an hour and a half."` — *Helen, Chapel Allerton* — `WASHING MACHINE`
- `"Told me my oven wasn't worth fixing and only charged the call-out. Honest is rare."` — *Raj, Harrogate* — `OVEN`
- `"Booked at 8am, fixed by lunchtime, and he took the old part away."` — *Gemma, Horsforth* — `DISHWASHER`

**Service area:** Leeds · Harrogate · Horsforth · Wetherby · Otley · Guiseley · Pudsey · Garforth · Morley · Knaresborough · Ilkley · Yeadon
Hours: `Monday to Friday 8am – 8pm · Saturday 8am – 4pm · Closed Sundays`

**FAQ**
- **Do you charge if you can't fix it?** `Only the £49 diagnostic. Nothing else.`
- **How quickly can you come?** `Most bookings are same or next day. We keep three slots free every morning for emergencies.`
- **Do you fit parts I've bought myself?** `Yes, though the twelve-month guarantee then covers our labour only.`
- **Is the appliance covered by its own warranty?** `If it's under two years old, check with the manufacturer first — we'll tell you if we think it's covered.`
- **Do you work on integrated appliances?** `Yes, including removing and refitting units in fitted kitchens.`
- **Can I pay by card?** `Card, cash or bank transfer, after the repair is done.`

**Final CTA** — H2 `Book a repair for today.` `0113 460 2288` · Button `Book a repair`

**Footer** — FIXWELL · Appliances · Prices · Guarantee · Areas · Reviews · Contact · `Fixwell Repairs Ltd, registered in England 11208743 · Gas Safe 662214 · Fully insured` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
