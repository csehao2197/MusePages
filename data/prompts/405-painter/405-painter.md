# Brushwork — Painting Company Website Prompt

## 1. Goal Statement
Build a calm, craft-led website for **Brushwork**, a residential painting and decorating company — chalky off-white, a deep forest green, and real paint swatch cards as the organising visual, so the whole page feels like choosing a colour rather than hiring a trade.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries and no quote calculator. The swatch row changes one accent colour on the page and nothing else.

## 3. Design System — Colors
```css
:root {
  --background: hsl(42, 22%, 95%);       /* chalk */
  --foreground: hsl(150, 14%, 14%);
  --primary: hsl(154, 30%, 26%);         /* forest green */
  --primary-foreground: hsl(42, 22%, 96%);
  --muted-foreground: hsl(150, 6%, 44%);
  --border: hsl(42, 14%, 86%);
  --card: hsl(42, 18%, 91%);
  --swatch: var(--primary);              /* changed by the swatch picker */
}
```
Swatch palette used by the picker: `hsl(154,30%,26%)` Fern · `hsl(18,44%,52%)` Terracotta · `hsl(210,34%,38%)` Slate Blue · `hsl(38,48%,62%)` Ochre · `hsl(348,26%,40%)` Claret · `hsl(28,12%,32%)` Charcoal Brown

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;600&family=Karla:wght@300;400;600&display=swap" rel="stylesheet" />
```
- **H1:** Bitter 600, clamp(42px, 5.4vw, 80px), line-height 1.06, letter-spacing -0.02em
- **H2:** Bitter 600, clamp(28px, 3.4vw, 48px)
- **Body:** Karla 300, 17px, line-height 1.7
- **Labels and colour names:** Karla 600, 12px, uppercase, letter-spacing 0.12em

## 5. Visual Effects

**Effect 1 — Swatch picker.** A row of six paint swatch cards, each a rounded rectangle of solid colour with the colour name and a paint code beneath, tilted very slightly at alternating angles between -2 and 2 degrees. Clicking one sets `--swatch` on `:root`, so the hero accent underline, the buttons and the section rules all change colour. That is the entire interaction.

```jsx
<button
  onClick={() => document.documentElement.style.setProperty("--swatch", c.hsl)}
  style={{ background: c.hsl, rotate: `${c.tilt}deg` }}
  className="h-28 w-24 rounded-lg shadow-md transition-transform duration-200 hover:-translate-y-2 hover:rotate-0"
  aria-label={`Preview ${c.name}`}
/>
```

**Effect 2 — Brush-stroke underline.** The accent word in the H1 sits over a hand-painted stroke drawn as an inline SVG path in `--swatch`, with a rough edge. It draws itself left to right on load using `pathLength`, over 1.1 seconds.

**Effect 3 — Paper texture.** A fixed SVG noise overlay at 4% opacity with `mix-blend-mode: multiply`, so the chalky background reads as matt emulsion rather than flat white.

## 6. Component Breakdown

1. **Navbar** — 82px, chalk, thin bottom rule. Wordmark left in Bitter, links right, an outlined `Get a quote` button in `--swatch`.
2. **Hero** — split 55/45. Left: label, H1 with the brush-stroke underline (Effect 2), subline, two buttons, and a small line of credentials. Right: a tall photograph of a freshly painted room. *Image: sunlit living room with deep green painted walls, white woodwork, one armchair, natural shadows, editorial interior photography.*
3. **Swatch picker** — Effect 1, six swatches with a short line of copy explaining that they mix and match on site.
4. **Services** — four rows separated by rules: interior painting, exterior painting, wallpapering, woodwork and restoration. Each with a heading, two sentences and a small price-from figure.
5. **Recent work** — a three-column gallery of six rooms with a colour name caption beneath each, styled like the swatch labels. *Image briefs: painted interiors — a terracotta hallway, a navy dining room, a white kitchen with green cabinetry, a claret bedroom, a pale study, a repainted Victorian exterior.*
6. **How a job runs** — five steps down a vertical line with dates like `Day 1`, `Day 2`, written so people know exactly what happens in their house.
7. **What it costs** — three typical jobs with real prices and what is included.
8. **The tidy promise** — a short panel: dust sheets, end-of-day tidy, no radio, no smoking, shoes off.
9. **Reviews** — three quotes in a row with name, town and job.
10. **Areas and contact** — towns covered, plus phone, email and hours.
11. **Footer** — chalk, thin rule, three columns, insurance and registration line.

## 7. Animations
- Hero text: fade up 18px, stagger 0.08s, 0.8s
- Brush stroke: Effect 2 on load
- Swatches: drop in from `y: -18` with a small spring, stagger 0.06s; lift and straighten on hover
- Gallery images: fade and `scale 1.03 → 1`, stagger 0.08s; caption underline in `--swatch` on hover
- Timeline line: `scaleY 0 → 1`, 1.2s, as the section enters view
- Colour transitions when a swatch is picked: 400ms ease on every element that uses `--swatch`

## 8. Responsive
- **Mobile (<768px):** hero stacks with the photograph first at 54vh; H1 at 42px; swatches become a horizontal snap-scroll row; gallery becomes 2 columns; timeline stays vertical with smaller type; navbar shows wordmark and a `Quote` button.
- **Tablet:** gallery 2 columns; hero stays split.
- **Desktop:** max-width 1240px, `px-10`, section spacing `py-28`.

## 9. Full Copy

**Brand:** BRUSHWORK · Painters & decorators · Edinburgh

**Navbar:** Services · Our work · Prices · Areas · Contact — Get a quote

**Hero**
- Label: `PAINTERS & DECORATORS IN EDINBURGH`
- H1: `Rooms that look *finished*, not just painted.`
- Subline: `Two decorators, eighteen years, and a dislike of poorly cut-in edges. We paint homes across Edinburgh and the Lothians, and we leave them cleaner than we found them.`
- Buttons: `Get a free quote` · `See recent work`
- Credentials: `Dulux Select Decorator · Fully insured · SELECT-registered trade`

**Swatch picker** — H2 `Pick a colour. Watch the page change.`
`We mix and match to any brand — Farrow & Ball, Little Greene, Dulux Trade — and bring sample pots to the quote so you can see it on your own wall, in your own light.`
- **Fern** — `Little Greene 295`
- **Terracotta** — `F&B 64`
- **Slate Blue** — `F&B 30`
- **Ochre** — `Little Greene 74`
- **Claret** — `F&B 43`
- **Charcoal Brown** — `Dulux Trade 22`

**Services** — H2 `What we do.`
- **Interior painting** — `Walls, ceilings, woodwork and doors, with proper preparation: filling, sanding, caulking and two full coats.` — `from £280 a room`
- **Exterior painting** — `Render, masonry, sash windows and front doors, weather permitting and scaffolded where needed.` — `from £1,400`
- **Wallpapering** — `Hanging, lining and pattern matching, including heavy and delicate papers.` — `from £180 a wall`
- **Woodwork & restoration** — `Sash window repair, stripping, knotting and repainting period joinery.` — `quoted per job`

**Recent work** — H2 `Recently *finished*.`
Hallway in Terracotta · Dining room in Slate Blue · Kitchen in Fern · Bedroom in Claret · Study in Chalk · Victorian exterior in Charcoal Brown

**How a job runs** — H2 `What actually happens in your house.`
- **Day 0 — The quote** — `We come round, measure, bring sample pots, and email a fixed price within two days.`
- **Day 1 — Protect and prepare** — `Furniture moved and covered, floors sheeted, then filling, sanding and caulking. Most of the work is here.`
- **Day 2 — First coats** — `Ceilings, then walls, then woodwork, in that order, every time.`
- **Day 3 — Second coats** — `Cut in by hand. We don't tape, because a steady hand gives a sharper line.`
- **Day 4 — Snag and tidy** — `We walk round with you, fix anything you spot, and take every dust sheet away.`

**What it costs** — H2 `Real prices from recent jobs.`
- **A bedroom, walls and ceiling** — `£340` — `Two coats, minor filling, woodwork touched up. One and a half days.`
- **A hallway, stairs and landing** — `£890` — `Full prep, two coats throughout, banister and spindles by hand. Three days.`
- **A three-bed flat, throughout** — `£2,650` — `Every room, ceilings, woodwork and doors, paint included. Nine days.`

**The tidy promise** — H2 `We're in your home, and we know it.`
`Dust sheets on everything, tidied at the end of every day, shoes off upstairs, no radio unless you want one, and no smoking anywhere near the job. You get a text the night before with our arrival time.`

**Reviews**
- `"They filled and sanded for a whole day before a drop of paint went on. You can see the difference on the cornice."` — *Katie, Marchmont*
- `"Quoted £890, charged £890, finished a day early and hoovered the stairs."` — *Douglas, Corstorphine*
- `"Our sash windows were rotten at the bottom. They repaired rather than replaced and saved us thousands."` — *Fiona, Leith*

**Areas and contact:** Edinburgh · Leith · Morningside · Corstorphine · Portobello · Musselburgh · Dalkeith · Livingston · Linlithgow · South Queensferry
`0131 460 7712` · `hello@brushwork.scot` · `Monday to Friday 7:30am – 5pm, quotes in the evening by arrangement`

**Footer** — BRUSHWORK · Services · Our work · Prices · Areas · Contact · `Brushwork Decorating Ltd, registered in Scotland SC712804 · £5m public liability insurance` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
