# Spin City — Laundromat Website Prompt

## 1. Goal Statement
Build a bright, cheerfully utilitarian laundromat website for **Spin City**, defined by soft white tile, electric blue, and a bold geometric sans — built around a live machine availability board and prices anyone can read from their phone in the doorway.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(200, 24%, 97%);      /* #f4f8fa tile white */
  --foreground: hsl(216, 30%, 16%);      /* #1c2434 */
  --primary: hsl(212, 92%, 50%);         /* #0a84f5 electric blue */
  --primary-foreground: hsl(0, 0%, 100%);
  --muted-foreground: hsl(216, 8%, 46%);
  --border: hsl(206, 20%, 88%);
  --card: hsl(202, 30%, 93%);
  --accent-warm: hsl(38, 94%, 56%);      /* dryer amber */
  --free: hsl(150, 58%, 42%);            /* machine free */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
Fallback if Archivo Expanded is unavailable: `Archivo` with `font-stretch: expanded`.
- **H1:** Archivo Expanded 800, uppercase, clamp(38px, 5.4vw, 76px), letter-spacing -0.02em
- **H2:** Archivo Expanded 700, uppercase, 30–46px
- **H3:** Archivo Expanded 600, 18–20px
- **Body:** Inter 300–400, 17px, line-height 1.72
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, blue
- **Prices / machine numbers / timers:** Archivo Expanded 800, tabular-nums

## 5. Visual Effects

**Effect 1 — Live machine board.** A grid of washer and dryer tiles showing status: green for free, amber with a countdown for in use, grey for out of order. Countdown timers tick down every second, and a summary line above states how many of each are free right now.

```tsx
const [now, setNow] = useState(Date.now());
useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

const remaining = m => Math.max(0, Math.ceil((m.finishesAt - now) / 60000));

<div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
  {machines.map(m => {
    const mins = remaining(m);
    const free = m.status === 'free' || mins === 0;
    return (
      <div key={m.id}
        className="aspect-square rounded-xl p-2 text-center transition-colors duration-300"
        style={{ background: m.status === 'broken' ? 'var(--border)' : free ? 'var(--free)' : 'var(--accent-warm)' }}>
        <div className="font-display text-xs text-white/80">{m.type === 'washer' ? 'W' : 'D'}{m.id}</div>
        <div className="font-display text-lg tabular-nums text-white">
          {m.status === 'broken' ? '—' : free ? 'FREE' : `${mins}m`}
        </div>
      </div>
    );
  })}
</div>
```

**Effect 2 — Drum spin loader.** The section marker beside each H2 is a small circle with three dots that rotates 360 degrees once when the heading enters view, a 0.8s ease-in-out — a subtle washing drum reference.

## 6. Component Breakdown

1. **Navbar** — 70px, sticky, tile white, 1px bottom border. Bold wordmark left, links centre, `Machines Free Now` blue pill showing a live count right.
2. **Hero** — split, text left, image right. Eyebrow, uppercase H1, subline, two CTAs, four practical points. *Image: bright clean laundromat interior with a row of front-loading machines, large windows, colourful and orderly.*
3. **Live board** — the primary feature (Effect 1) with a summary line and a last-updated timestamp.
4. **Prices** — a bold, large-type price list for wash sizes, dry cycles, and soap, readable at arm's length.
5. **Service wash** — drop-off laundry by weight with turnaround and a same-day cut-off.
6. **How it works** — four steps for first-timers, including how the payment app works and what to do if a machine eats your money.
7. **Machines** — what is available: small, medium and large washers, capacity in kilos, and which take duvets.
8. **Opening times and staffing** — attended and unattended hours stated clearly, plus the last wash time.
9. **Commercial accounts** — airbnb hosts, salons and restaurants, with collection options.
10. **House rules** — a short, friendly list about trolleys, timers and not leaving washing unattended for two hours.
11. **Find us** — address, parking, bus routes, and step-free access.
12. **Footer** — deep navy, three columns, contact, refund policy for machine faults.

## 7. Animations
- Hero: text fades up 0.6s; image rises and fades, 0.8s
- Machine tiles: fade in with a 0.02s stagger; status colour transitions over 0.3s; timers update every second without re-animating
- Drum markers: 360-degree rotation once on heading entry, 0.8s
- Price rows: fade-up staggered 0.05s
- Step numbers: pop `scale 0.85 → 1` staggered 0.1s
- Live count pill in the navbar: number swaps with a 0.2s vertical slide when it changes

## 8. Responsive
- **Mobile (<768px):** hamburger; live count pill stays visible in the navbar because it is the reason people open the site; image stacks above text; H1 clamps to 38px; machine board becomes 4 columns; price list stays large and bold; `Machines Free Now` scrolls to the board.
- **Tablet:** machine board 6 columns, prices 2-col.
- **Desktop:** machine board 8 columns, max width 1120px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** SPIN CITY · Laundromat · Bristol

**Navbar:** Machines · Prices · Service Wash · How It Works · Find Us · [Button] Machines Free Now

**Hero**
- Eyebrow: `BRISTOL · OPEN 6AM TO 11PM · CARD AND APP · FREE WIFI`
- H1: `CHECK BEFORE YOU CARRY IT DOWN THE HILL.`
- Subline: `A clean, bright laundromat on Gloucester Road with twenty-four washers and eighteen dryers. See what is free before you leave the house.`
- CTAs: `See Live Machines` · `Prices`
- Points: `Open 6am–11pm` · `Card, app and coin` · `Free wifi` · `Attended 8am–6pm`

**Live board** — Eyebrow `RIGHT NOW` — H2 `WHAT IS FREE THIS SECOND`
Summary line: `9 washers and 6 dryers free · Updated 12 seconds ago`
Note: `Timers show minutes remaining. If a machine says FREE and someone's washing is still in it, give it five minutes before you move it — that is the unwritten rule and we would rather you kept it.`

**Prices** — Eyebrow `PRICES` — H2 `SIMPLE, AND ON THE WALL TOO`

*Washers* — Small, 8kg — £4.50 · Medium, 12kg — £6.00 · Large, 18kg — £8.50 · Extra large, 25kg — £11.00
*Dryers* — £1.00 for 10 minutes · £4.50 for a full hour · Most loads need 40 to 50 minutes
*Extras* — Soap pod £1.20 · Fabric softener £1.00 · Colour catcher £0.80 · Laundry bag £3.50

**Service wash** — H2 `DROP IT OFF, WE DO IT`
`£2.40 per kilo, minimum six kilos. Washed, dried, and folded. Drop off before 10am and it is ready the same day by 5pm. After 10am it is ready the next morning. We do not iron, and we will tell you which items we would not put in a dryer.`

**How it works**
1. **Check the board** — See what is free from your phone or the screen by the door.
2. **Load and pay** — Card, contactless, or the Spin City app. Coins still work in machines 1 to 8.
3. **Set a timer** — The app texts you five minutes before your cycle ends, so you do not lose your machine.
4. **If something goes wrong** — Press the help button by the change machine or call the number on the wall. Faults are refunded the same day, no form.

**Machines** — `Twenty-four washers: eight small at 8kg, ten medium at 12kg, four large at 18kg and two extra large at 25kg. The extra large take a king-size duvet comfortably, and the large take a double. Eighteen dryers, all vented, all with a delicate setting that people forget exists.`

**Opening times** — `Open 6:00 to 23:00, seven days · Attended 8:00 to 18:00 weekdays, 9:00 to 17:00 weekends · Last wash 22:00, last dry 22:30`

**Commercial accounts** — `Airbnb hosts, salons, restaurants and small hotels. Weekly collection and delivery within three miles, monthly invoicing, and a fixed per-kilo rate. Around forty local businesses use us, mostly for linen and towels.`

**House rules** — `Trolleys stay in the shop · Set a timer, your machine may be moved after fifteen minutes · Nothing greasy, oily or paint-covered, it damages the drums for everyone · Under-16s with an adult please · Please take your soap bottles home with you`

**Find us** — `288 Gloucester Road, Bristol BS7 8PD` · `Two-hour free parking on Egerton Road, and the 75 and 76 stop outside` · `Step-free entrance, and the wide door is the one on the left`

**Footer** — SPIN CITY · `Check before you carry it down the hill.` · `0117 555 0182` · Faults refunded same day · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
