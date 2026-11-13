# Beacon Towing — Towing Company Website Prompt

## 1. Goal Statement
Build a fast, reassuring website for **Beacon Towing**, a 24-hour roadside recovery service — near-black with amber warning-light orange, a slowly rotating beacon glow behind the hero, chevron hazard edges, and a phone number that is impossible to miss at three in the morning.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries, no maps, no booking form. Every action is a `tel:` link.

## 3. Design System — Colors
```css
:root {
  --background: hsl(220, 16%, 8%);       /* asphalt black */
  --foreground: hsl(30, 20%, 95%);
  --primary: hsl(28, 96%, 54%);          /* beacon amber */
  --primary-foreground: hsl(220, 20%, 8%);
  --muted-foreground: hsl(220, 8%, 60%);
  --border: hsl(220, 12%, 18%);
  --card: hsl(220, 14%, 12%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
```
- **H1 and phone number:** Barlow Condensed 700, uppercase, clamp(58px, 10vw, 170px), line-height 0.88
- **H2:** Barlow Condensed 600, uppercase, clamp(36px, 5vw, 70px)
- **Body:** Barlow 400, 17px, line-height 1.6
- **Labels and times:** Barlow 600, 12px, uppercase, letter-spacing 0.14em, amber

## 5. Visual Effects

**Effect 1 — Beacon sweep.** Behind the hero headline, a wide amber radial glow rotates slowly like a recovery truck's light bar: a 900px blurred ellipse at 18% opacity, rotating 360 degrees every 9 seconds around a point below the viewport, so the light washes across the text rather than spinning visibly.

```jsx
<motion.div
  aria-hidden
  className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(28,96%,54%)] opacity-[0.18] blur-[150px]"
  animate={{ rotate: 360 }}
  style={{ transformOrigin: "50% 80%" }}
  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
/>
```

**Effect 2 — Chevron edges.** Sections are separated by a 16px band of amber and black chevrons, drawn with `repeating-linear-gradient(115deg, ...)`, exactly like the back of a recovery truck.

**Effect 3 — Arrival clock.** The response-time figure sits inside a thin amber ring that draws itself from 0 to 100% over 1.2 seconds when it scrolls into view, using an SVG circle with `pathLength`.

## 6. Component Breakdown

1. **Chevron band** — Effect 2, across the very top.
2. **Navbar** — 76px, black, wordmark left with a small beacon icon, links centre, amber `Call 0800 555 0199` button right. Sticky.
3. **Hero** — full viewport. Amber label, H1 in two lines, the beacon sweep (Effect 1), one line of subline, then the phone number set enormous as a tap-to-call link. Beneath: three facts in a row. A dark night photograph sits behind at 22% opacity. *Image: tow truck with amber lights on a wet motorway at night, headlights and reflections, cinematic and dark.*
4. **Response strip** — amber band, black text, four figures: average arrival, hours, coverage radius, years in business, with the arrival figure in the ring (Effect 3).
5. **Services** — a 2×3 grid of dark cards with amber lucide icons: breakdown recovery, accident recovery, jump starts, flat tyres, keys locked in, fuel drain or top-up.
6. **What it costs** — a simple price board: five lines with dotted leaders and amber figures.
7. **Chevron band** divider.
8. **What to do while you wait** — four short safety steps in a row with big outlined numerals, written calmly.
9. **Coverage** — motorways and towns as amber-bordered pills, plus a line about the radius.
10. **Fleet** — three cards with a photo, vehicle type and what it is for. *Image briefs: flatbed recovery truck, light commercial tow van, heavy-duty wrecker, all clean and photographed at dusk.*
11. **Reviews** — three reviews with five amber stars, quote, name and job type.
12. **Final call** — amber full-width section, black text: `BROKEN DOWN?` and the phone number.
13. **Footer** — black, small print, licence and insurance details.

## 7. Animations
- Hero H1: slams up from `y: 60`, spring (stiffness 420, damping 28), lines stagger 0.1s
- Phone number: fades in at 0.5s, and on hover the amber brightens
- Beacon: Effect 1, always running
- Response ring: Effect 3
- Service cards: fade up 18px, stagger 0.06s; border turns amber on hover
- Numerals in the safety section use `-webkit-text-stroke: 2px var(--primary)` with transparent fill

## 8. Responsive
- **Mobile (<768px):** amber call bar fixed to the bottom of the screen at all times; H1 at 58px; hero phone number at 46px; response strip becomes 2×2; services 1 column; fleet becomes a horizontal snap-scroll row; navbar shows wordmark and an amber phone icon button.
- **Tablet:** services 2 columns; response strip stays 4 across.
- **Desktop:** max-width 1300px, `px-8`, section spacing `py-24`.

## 9. Full Copy

**Brand:** BEACON TOWING · 24-hour recovery · Bristol & the M4/M5

**Navbar:** Services · Prices · Coverage · Reviews — Call 0800 555 0199

**Hero**
- Label: `24-HOUR RECOVERY · BRISTOL, M4 & M5`
- H1: `BROKEN DOWN? / WE'RE ALREADY MOVING.`
- Subline: `A real person answers, tells you what it will cost, and gives you a time. Then we come and get you, whatever the hour.`
- Phone: `0800 555 0199`
- Facts: `AVERAGE 34 MINUTES` · `FIXED PRICE ON THE PHONE` · `FULLY INSURED RECOVERY`

**Response strip:** `34 MIN` average arrival · `24/7` every day of the year · `40 MILES` coverage radius · `19 YRS` recovering vehicles

**Services** — H2 `WHAT WE COME OUT FOR`
- **Breakdown recovery** — `Home, roadside or motorway. Taken to your garage or your driveway, your choice.`
- **Accident recovery** — `Damaged and non-driveable vehicles, including insurance work.`
- **Jump starts** — `Flat battery at the supermarket or on your drive. Often fixed without a tow.`
- **Flat tyres** — `Spare fitted at the roadside, or recovered if there isn't one.`
- **Keys locked in** — `Non-destructive entry where we can, locksmith called where we can't.`
- **Wrong fuel or empty** — `Fuel drained and flushed on site, or ten litres brought to you.`

**What it costs** — H2 `PRICES, SAID OUT LOUD.`
- Local tow, up to 10 miles ........ `£85`
- Each additional mile ........ `£2.40`
- Jump start ........ `£55`
- Roadside tyre change ........ `£65`
- Wrong fuel drain ........ `from £185`
Note: `Prices include VAT and are quoted in full on the phone before we set off. Motorway recovery is priced per job — ask when you call.`

**What to do while you wait** — H2 `WHILE WE'RE ON OUR WAY`
- **01 — Get off the carriageway** — `Pull as far left as you can and turn the wheels away from the road.`
- **02 — Everyone out, behind the barrier** — `Leave by the passenger doors and stand up the bank, not beside the car.`
- **03 — Hazards on, headlights on** — `In the dark or in rain, leave sidelights on too so we spot you sooner.`
- **04 — Tell us the marker post** — `The small blue post at the roadside has a number. It gets us to you faster than any postcode.`

**Coverage:** Bristol · Bath · M4 J15–J22 · M5 J14–J22 · Portishead · Clevedon · Keynsham · Thornbury · Chippenham · Weston-super-Mare · Yate · Nailsea
Line: `Anything further, call anyway. We run long-distance recovery across the South West most days.`

**Fleet** — H2 `THREE TRUCKS, ALWAYS ONE FREE`
- **Flatbed recovery** — `For modern cars, EVs and anything that must not be towed on its wheels.`
- **Light commercial tow van** — `Quick jobs, jump starts and roadside fixes.`
- **Heavy-duty wrecker** — `Vans, motorhomes and recoveries off soft ground.`

**Reviews**
- `"Blew a tyre on the M5 at 11pm with two kids in the car. He was there in twenty-five minutes and stayed calm the whole time."` — *Sarah, Portishead* — `MOTORWAY RECOVERY`
- `"Quoted £85 on the phone and that was the price, even though it took him longer than he thought."` — *Michael, Bath* — `LOCAL TOW`
- `"Put diesel in a petrol car. Drained it on my driveway and I drove it the next morning."` — *Tomas, Bristol* — `WRONG FUEL`

**Final call** — `BROKEN DOWN?` · `0800 555 0199` · `Answered by a recovery driver, day or night.`

**Footer** — BEACON TOWING · Services · Prices · Coverage · Reviews · Contact · `Licensed recovery operator · £2m goods-in-transit insurance · Beacon Recovery Ltd, company no. 07742115` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
