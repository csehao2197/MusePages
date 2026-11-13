# Star Lanes — Bowling Alley Website Prompt

## 1. Goal Statement
Build a loud retro-Americana bowling alley website for **Star Lanes**, defined by midnight teal, hot coral, and a chrome-effect script logotype — a 1958 bowling centre rendered with modern motion, built to sell lane bookings and birthday parties.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(196, 42%, 11%);      /* #0f2229 midnight teal */
  --foreground: hsl(42, 44%, 94%);       /* #f6efe1 cream */
  --primary: hsl(4, 84%, 62%);           /* #f45549 hot coral */
  --primary-foreground: hsl(196, 44%, 9%);
  --muted-foreground: hsl(196, 12%, 62%);
  --border: hsl(196, 28%, 20%);
  --card: hsl(196, 38%, 15%);
  --accent-mustard: hsl(42, 88%, 58%);   /* neon mustard */
  --accent-mint: hsl(168, 56%, 56%);     /* mint neon */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
```
- **H1:** Alfa Slab One 400, uppercase, clamp(44px, 6.5vw, 100px), letter-spacing -0.01em, line-height 0.94
- **H2:** Alfa Slab One 400, uppercase, 32–52px
- **H3:** Space Grotesk 700, 18–22px
- **Body:** Space Grotesk 400, 16px, line-height 1.7
- **Eyebrows:** Space Grotesk 500, uppercase, letter-spacing 0.22em, 11px, mustard
- **Scores / prices / lane numbers:** Alfa Slab One, tabular-nums

## 5. Visual Effects

**Effect 1 — Neon sign flicker on the wordmark.** The Star Lanes logotype has a coral text-shadow glow that briefly stutters on load, then settles — the classic dying-neon effect, done once so it charms rather than annoys.

```css
@keyframes neon-settle {
  0%, 6%, 10%, 16% { opacity: 0.35; text-shadow: none; }
  8%, 13%, 100%    { opacity: 1; text-shadow: 0 0 8px var(--primary), 0 0 22px rgba(244,85,73,0.55); }
}
.neon { animation: neon-settle 1.6s ease-out 1 both; }
@media (prefers-reduced-motion: reduce) { .neon { animation: none; opacity: 1; } }
```

**Effect 2 — Live lane availability grid.** Twelve lane tiles for the selected time slot, each coloured mint for free, coral for taken. Selecting a time re-flows the grid with a stagger, and picking free lanes adds them to a booking summary.

## 6. Component Breakdown

1. **Navbar** — 76px, sticky, midnight teal with blur, mustard 2px bottom border. Neon wordmark left, links centre, `Book a Lane` coral pill right.
2. **Hero** — 92vh, full-bleed alley photograph with a heavy teal duotone and bottom gradient. Eyebrow, huge slab H1, subline, two CTAs, an open-late strip. *Image: retro bowling alley interior at night, lanes receding, neon signage, warm and moody with strong colour, cinematic.*
3. **Lane booking** — the primary conversion block (Effect 2): date picker, time slot chips, lane grid, price summary, `Book these lanes` CTA.
4. **Prices** — three cards: per lane per hour off-peak, peak, and shoe hire, with a note about groups.
5. **Leagues & events** — 2x2: Monday league, Thursday doubles, kids club, and corporate nights, each with day, time, and price.
6. **Birthday parties** — split band: three party packages with headcount, duration, food, and price per child.
7. **The bar & diner** — inverted lighter section on `--card`: burgers, wings, shakes, draught list, with an honest line about the food being better than it needs to be.
8. **Arcade** — a compact row of six arcade cabinet names with a token pricing line.
9. **Gallery** — four-image horizontal snap row of the lanes, bar, and party room.
10. **Find us** — address, hours per day, parking, and an accessibility note about ramped lanes and lightweight balls.
11. **Footer** — darkest teal, mustard top rule, three columns, `Est. 1958` line, socials.

## 7. Animations
- Wordmark: neon flicker on load, once (Effect 1)
- Hero: H1 lines drop in with `y: -30 → 0` and a slight overshoot spring, staggered 0.1s
- Lane tiles: stagger `i * 0.03` on time change; selected tile scales 1.06 with a coral ring
- Price cards: 3D tilt of up to 4 degrees following the cursor on desktop
- Party packages: mustard confetti-free — a simple lift and a coral border on hover
- Gallery: `scroll-snap-type: x mandatory` with slight scale on the centred item
- All entrance easing uses a light spring rather than a flat cubic-bezier, matching the era

## 8. Responsive
- **Mobile (<768px):** hamburger with a full-screen teal overlay; H1 clamps to 44px; lane grid becomes 3 columns of 4 with smaller tiles; time chips horizontally scrollable; booking summary pins as a sticky bottom bar showing lane count and total; prices 1-col; gallery keeps snap scroll.
- **Tablet:** lane grid 6x2, prices 3-col, parties 3-col.
- **Desktop:** max width 1200px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** STAR LANES · Est. 1958 · Akron, Ohio

**Navbar:** Book a Lane · Prices · Leagues · Parties · Bar & Diner · Find Us · [Button] Book a Lane

**Hero**
- Eyebrow: `AKRON, OHIO · TWELVE LANES · OPEN SINCE 1958`
- H1: `TWELVE LANES. ZERO ATTITUDE.`
- Subline: `Real wood lanes, a diner that still makes its own patties, and the same neon sign we hung in 1958. Book online, turn up, bowl badly with your friends.`
- CTAs: `Book a Lane` · `See Prices`
- Strip: `Open until midnight Friday and Saturday · Kitchen until 11pm`

**Lane booking** — Eyebrow `BOOK` — H2 `PICK A TIME, PICK YOUR LANES`
Time slots: `4:00 PM` · `5:00 PM` · `6:00 PM` · `7:00 PM` · `8:00 PM` · `9:00 PM` · `10:00 PM`
Note: `Each lane takes up to six people. Shoes are three dollars and yes, you have to wear them.`

**Prices**
- **Off-peak — $24 per lane / hour** — Mon–Thu before 5pm — Up to six bowlers · Free lane bumpers for kids · No booking fee
- **Peak — $38 per lane / hour** — Fri–Sun and after 5pm — Up to six bowlers · Priority lane requests · No booking fee
- **Shoe hire — $3 per person** — All sizes from kids 10 to men's 16 — Sanitised between every use · Bring your own if you have them

Group note: `Six lanes or more, call us — we will do you a rate and hold the back half of the room.`

**Leagues & events**
- **Monday Night League** — Mondays 7:30pm · $18 per week · Sixteen-week season, handicap scored, all abilities. There is a trophy and people take it seriously.
- **Thursday Doubles** — Thursdays 8:00pm · $22 per pair · Drop-in, no season commitment, drink included.
- **Star Cadets Kids Club** — Saturdays 10:00am · $12 per child · Ages 6–14, coaching, bumpers up, ninety minutes.
- **Corporate Nights** — By arrangement · From $32 per head · Two hours, shoes, a lane per eight people, and a food platter.

**Birthday parties**
- **The Strike — $18 per child** — Ten children minimum · 90 minutes · One lane per six kids, shoes, unlimited soda, and a slice each.
- **The Turkey — $26 per child** — Ten children minimum · 2 hours · Everything above plus hot food, arcade tokens, and a private table.
- **The Perfect Game — $34 per child** — Twelve children minimum · 3 hours · Everything above plus the party room to yourselves, a host, cake service, and a photo print for every kid.

**Bar & diner** — H2 `THE FOOD IS BETTER THAN IT HAS TO BE`
`Star Lanes Burger $12 · Double Chili Cheeseburger $15 · Buffalo Wings, 10pc $13 · Chicken Tenders & Fries $11 · Loaded Fries $9 · Grilled Cheese $8 · Malted Shake $7 · Root Beer Float $6`
`Six taps, four of them local. Bottled beer, a short cocktail list, and a house old fashioned that people order twice.`

**Arcade** — `Skee-Ball` · `Air Hockey` · `Galaga` · `Pinball (three tables)` · `Basketball Hoops` · `Claw Machine` — `Tokens 4 for $1, or $20 for a hundred.`

**Find us** — `1402 Kenmore Boulevard, Akron, OH 44314`
Mon–Thu 3:00pm–11:00pm · Fri 3:00pm–12:00am · Sat 11:00am–12:00am · Sun 11:00am–10:00pm
`Free lot with sixty spaces. Two lanes have ramps, and we keep six-pound balls behind the counter — just ask.`

**Footer** — STAR LANES · `Est. 1958` · `Twelve lanes. Zero attitude.` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-popover": "^1.1.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
