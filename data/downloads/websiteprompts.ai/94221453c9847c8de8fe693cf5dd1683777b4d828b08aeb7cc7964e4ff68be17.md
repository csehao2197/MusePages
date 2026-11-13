# Haul Co. — Junk Removal Website Prompt

## 1. Goal Statement
Build a punchy, reassuring website for **Haul Co.**, a two-person junk removal crew — bright lime green on deep charcoal, heavy grotesk type, and a diagonal split before-and-after card that shows a cluttered garage becoming an empty one.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries, no drag sliders, no quote calculator. Prices are stated, and the call to action is a `tel:` link.

## 3. Design System — Colors
```css
:root {
  --background: hsl(160, 12%, 11%);      /* charcoal with a green cast */
  --foreground: hsl(150, 12%, 95%);
  --primary: hsl(84, 82%, 56%);          /* lime */
  --primary-foreground: hsl(160, 20%, 10%);
  --muted-foreground: hsl(150, 6%, 62%);
  --border: hsl(160, 10%, 20%);
  --card: hsl(160, 12%, 15%);
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&display=swap" rel="stylesheet" />
```
- **H1:** Archivo 900, uppercase, clamp(52px, 8vw, 118px), line-height 0.92, letter-spacing -0.03em
- **H2:** Archivo 900, uppercase, clamp(34px, 4.5vw, 64px)
- **Body:** Archivo 500, 17px, line-height 1.6
- **Labels and prices:** Archivo 700, 13px, uppercase, letter-spacing 0.1em

## 5. Visual Effects

**Effect 1 — Diagonal before and after.** One card holds two photographs split by a hard diagonal using clip-path, `BEFORE` labelled bottom-left and `AFTER` top-right in lime. No slider, no interaction — the split is the image.

```jsx
<div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
  {/* Image: cluttered garage full of old furniture and boxes, daylight, realistic */}
  <img src="" alt="Garage before clearance" className="absolute inset-0 h-full w-full object-cover object-center" />
  {/* Image: the same style of garage, completely empty and swept, daylight, realistic */}
  <img
    src="" alt="Garage after clearance"
    className="absolute inset-0 h-full w-full object-cover object-center"
    style={{ clipPath: "polygon(100% 0, 100% 100%, 22% 100%)" }}
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
</div>
```

**Effect 2 — Truck-load meter.** The pricing section shows four load sizes as a row of truck silhouettes filling with lime from the bottom: quarter, half, three-quarter and full. Pure CSS height, animated once when in view.

**Effect 3 — Lime underline sweep.** Every section heading has a lime bar that sweeps in from the left beneath it, `scaleX 0 → 1`, 0.6s.

## 6. Component Breakdown

1. **Top bar** — 40px lime, charcoal text: `Same-day pickup · Text a photo for a price in 10 minutes`.
2. **Navbar** — 78px, charcoal, wordmark left with a small truck icon, links centre, lime `Call 0800 118 2244` button right. Sticky.
3. **Hero** — split. Left: H1 in three lines, subline, two buttons, and three mono trust facts. Right: the before-and-after card (Effect 1).
4. **What we take** — a 4-column grid of twelve short items with small lucide icons: furniture, mattresses, appliances, garden waste, garage clutter, office clear-outs, sheds, hot tubs, builders' waste, electricals, carpets, general household.
5. **What we won't take** — three short lines in muted text under a thin border, honest and brief.
6. **Prices** — the load meter (Effect 2) with four prices beneath and a line about what is included.
7. **How it works** — three steps with big lime numerals.
8. **Where the stuff goes** — a short section with one statistic set huge and two sentences about donation and recycling.
9. **Areas** — a wrapped row of area pills.
10. **Reviews** — three reviews on `--card` with five lime stars, quote, name and job type.
11. **Final CTA** — lime section, charcoal text, H2 and the phone number set large.
12. **Footer** — charcoal, three columns, licence number and insurance line.

## 7. Animations
- Hero H1: each line slides up from `y: 70` inside overflow-hidden, 0.8s, stagger 0.09s
- Before-and-after card: `scale 0.96 → 1` and fade, 1s
- Section headings: Effect 3
- Truck meters: fill from 0 to their height, 1s, stagger 0.12s
- Grid items: fade up 16px, stagger 0.04s
- Buttons: lime brightens and the button lifts 2px on hover

## 8. Responsive
- **Mobile (<768px):** sticky lime call bar fixed to the bottom of the screen; hero stacks with the before-and-after card first; H1 at 52px; what-we-take becomes 2 columns; truck meters become a 2×2 grid; navbar shows wordmark and a lime phone button.
- **Tablet:** what-we-take 3 columns; hero stays split.
- **Desktop:** max-width 1280px, `px-8`, section spacing `py-24`.

## 9. Full Copy

**Top bar:** `Same-day pickup · Text a photo for a price in 10 minutes`

**Navbar:** What we take · Prices · How it works · Areas — Call 0800 118 2244

**Hero**
- Label: `JUNK REMOVAL · NOTTINGHAM & DERBY`
- H1: `You point. / We carry. / It's gone.`
- Subline: `Two people, one van, and no standing around. We load everything ourselves, sweep up after, and tell you the price before we start.`
- Buttons: `Call 0800 118 2244` · `Text a photo for a quote`
- Trust facts: `LICENSED WASTE CARRIER` · `SAME-DAY AVAILABLE` · `WE SWEEP UP`

**What we take** — H2 `If you can point at it, we can take it.`
Furniture · Mattresses · Fridges & appliances · Garden waste · Garage clear-outs · Office clear-outs · Sheds & decking · Hot tubs · Builders' waste · TVs & electricals · Carpets & flooring · General household

**What we won't take:** `Asbestos, paint tins with liquid paint still in them, and car tyres. We'll tell you who can, though.`

**Prices** — H2 `Priced by how much space it fills.`
- **Quarter load** — `£95` — `A few bags, a mattress, a couple of chairs.`
- **Half load** — `£165` — `A small bedroom or a cleared shed.`
- **Three-quarter load** — `£225` — `A garage, or a two-bed flat's worth of furniture.`
- **Full load** — `£290` — `A house clearance or a full office.`
Note: `Every price includes labour, loading, disposal fees and VAT. No surcharge for stairs.`

**How it works**
- **01 — Send a photo** — `Text or WhatsApp a picture. You get a fixed price back, usually inside ten minutes.`
- **02 — We turn up** — `Two-hour window, and we call when we set off. Same day if you catch us before noon.`
- **03 — We clear and sweep** — `You don't lift anything. We brush the space before we leave.`

**Where the stuff goes** — Statistic: `72%` — `of everything we collect is donated or recycled rather than landfilled. Usable furniture goes to two local reuse charities, metal and electricals go to a licensed recycler, and we keep the transfer notes so you have them if you ever need them.`

**Areas:** Nottingham · West Bridgford · Beeston · Arnold · Long Eaton · Ilkeston · Derby · Ripley · Mansfield · Newark · Hucknall · Stapleford

**Reviews**
- `"Quoted £165 from a photo, charged £165, and swept the garage floor. First time that's ever happened."` — *Ceri, West Bridgford* — `GARAGE CLEAR-OUT`
- `"They took a hot tub apart in the back garden and got it out in an hour."` — *Owen, Beeston* — `HOT TUB REMOVAL`
- `"Cleared my mum's flat the week we needed it, and found a charity for the sofa."` — *Rachel, Derby* — `HOUSE CLEARANCE`

**Final CTA** — `GOT A PILE? SEND US A PHOTO.` · `0800 118 2244` · `Text, WhatsApp or call. Seven days a week, 7am to 8pm.`

**Footer** — HAUL CO. · What we take · Prices · Areas · Reviews · Contact · `Licensed waste carrier CBDU482119 · Fully insured · Registered in England 13998421` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
