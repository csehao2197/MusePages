# Forno Rosso — Pizzeria Website Prompt

## 1. Goal Statement
Build a warm, wood-fired neighbourhood pizzeria website for **Forno Rosso**, defined by charred cream, tomato red, and a heavy condensed display face — a site that smells like an oven and gets people to book a table or order for collection in two taps.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: hsl(38, 32%, 94%);      /* #f4efe6 charred cream */
  --foreground: hsl(20, 22%, 15%);      /* #2f251f */
  --primary: hsl(6, 68%, 46%);          /* #c53127 tomato red */
  --primary-foreground: hsl(38, 32%, 97%);
  --muted-foreground: hsl(20, 10%, 44%);
  --border: hsl(34, 18%, 84%);
  --card: hsl(38, 34%, 90%);
  --accent-basil: hsl(96, 26%, 36%);    /* basil green */
  --char: hsl(20, 14%, 12%);            /* dark bands */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- **H1:** Anton 400, uppercase, clamp(48px, 7vw, 110px), letter-spacing -0.01em, line-height 0.9
- **H2:** Anton 400, uppercase, 34–56px
- **H3 / pizza names:** Inter 600, 18–21px
- **Body:** Inter 300–400, 17px, line-height 1.7
- **Eyebrows:** Inter 600, uppercase, letter-spacing 0.2em, 11px, red
- **Prices:** Inter 500, tabular-nums

## 5. Visual Effects

**Effect 1 — Menu with dietary filter chips.** Chips for All, Vegetarian, Vegan, Gluten-free filter the menu list with a layout animation. Each pizza row shows name, Italian-language ingredient list, price, and small dietary badges.

```tsx
<motion.div layout className="divide-y divide-[var(--border)]">
  <AnimatePresence mode="popLayout">
    {filtered.map(p => (
      <motion.div key={p.slug} layout
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        className="flex items-baseline justify-between gap-6 py-5">
        <div>
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-sm text-[var(--muted-foreground)]">{p.ingredients}</p>
        </div>
        <span className="tabular-nums font-medium">£{p.price}</span>
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
```

**Effect 2 — Oven-glow hero scrim.** A radial warm-orange gradient at 22% opacity sits over the bottom-left of the hero image, mimicking oven light spill, with the headline sitting inside it.

## 6. Component Breakdown

1. **Navbar** — 72px, sticky, cream with blur. Wordmark left, links centre, `Book a Table` red filled button and a phone number right.
2. **Hero** — 90vh, full-bleed oven photograph with a bottom scrim and oven glow (Effect 2). Eyebrow, huge Anton H1, subline, two CTAs. *Image: wood-fired pizza oven with flames visible, dark interior, warm orange light spilling onto a marble counter, atmospheric restaurant photography.*
3. **Today strip** — dark char band with today's opening hours, a `Collection in 20 min` line, and a phone link.
4. **The menu** — the main section. Filter chips plus grouped lists: Rosse, Bianche, Sides, Dolci (Effect 1).
5. **The dough** — split image and text explaining the 48-hour ferment and the flour. *Image: hands stretching pizza dough on a floured marble surface, close-up, warm kitchen light.*
6. **Gallery strip** — four-image horizontal scroll of pizzas and room shots.
7. **Book a table** — 2-col: form on the left (date, time, party size, name, phone), practical notes on the right about walk-ins and large groups.
8. **Collection & delivery** — three cards: collection, delivery radius, and the third-party apps they are on, with an honest note about which is cheapest.
9. **Reviews** — three quote cards with a red opening quote mark.
10. **Find us** — address, hours table, parking note, map.
11. **Footer** — char background, cream text, three columns and socials.

## 7. Animations
- Hero: H1 lines reveal with `clipPath: inset(0 0 100% 0) → inset(0 0 0 0)`, 0.8s, stagger 0.1s
- Oven glow: subtle opacity oscillation 0.18 ↔ 0.26 over 5s, respects `prefers-reduced-motion`
- Menu filter: `motion.div layout` with popLayout, 0.28s per row
- Dough section: image slides `x: -30 → 0` while text fades up
- Gallery: horizontal `scroll-snap-type: x mandatory`
- Review cards: stagger 0.1s, `y: 24 → 0`
- Book button: subtle scale 1.03 on hover, 0.2s

## 8. Responsive
- **Mobile (<768px):** hamburger; H1 clamps to 48px; today strip becomes two stacked lines; filter chips horizontally scrollable; menu rows keep name and price on one line with ingredients below; booking form full-width; a sticky bottom bar with `Book` and `Call`.
- **Tablet:** menu 2-col grouped, gallery 3 visible.
- **Desktop:** max width 1140px, `px-16`, `py-20`.

## 9. Full Copy

**Brand:** FORNO ROSSO · Bristol

**Navbar:** Menu · The Dough · Book · Collection · Find Us · `0117 555 0164` · [Button] Book a Table

**Hero**
- Eyebrow: `BRISTOL · WOOD-FIRED · 48-HOUR DOUGH`
- H1: `SIXTY SECONDS IN A 450 DEGREE OVEN.`
- Subline: `A small Neapolitan pizzeria on Gloucester Road. Twelve pizzas, four wines, and no pasta — because we would rather do one thing properly.`
- CTAs: `Book a Table` · `See the Menu`

**Today strip:** `Open today 17:00 – 22:30 · Collection ready in about 20 minutes · Call 0117 555 0164`

**Menu**
Eyebrow `THE MENU` — H2 `TWELVE PIZZAS. THAT IS THE WHOLE LIST.`

*Rosse*
- **Marinara** — pomodoro San Marzano, aglio, origano, olio EVO — £9 *(vegan)*
- **Margherita** — pomodoro, fiordilatte, basilico — £11 *(vegetarian)*
- **Diavola** — pomodoro, fiordilatte, salame piccante, miele — £14
- **Napoli** — pomodoro, fiordilatte, acciughe, capperi, olive — £14
- **Capricciosa** — pomodoro, fiordilatte, prosciutto cotto, funghi, carciofi — £15
- **Bufala e Datterini** — datterini gialli, mozzarella di bufala, basilico — £15 *(vegetarian)*

*Bianche*
- **Quattro Formaggi** — fiordilatte, gorgonzola, pecorino, parmigiano — £15 *(vegetarian)*
- **Patate e Rosmarino** — patate, rosmarino, fiordilatte, pepe nero — £13 *(vegetarian)*
- **Salsiccia e Friarielli** — salsiccia, friarielli, fiordilatte — £16
- **Zucca e Nocciole** — zucca arrostita, nocciole, ricotta — £14 *(vegetarian)*
- **Tartufo** — funghi, crema di tartufo, fiordilatte — £17 *(vegetarian)*
- **Ortolana** — verdure grigliate, pomodoro, senza formaggio — £13 *(vegan)*

*Sides* — Olive ascolane £6 · Burrata e pomodorini £9 · Insalata tricolore £7 · Focaccia all'aglio £5
*Dolci* — Tiramisù £7 · Affogato £6 · Cannolo siciliano £5

Note: `Gluten-free bases available on any pizza for £2. We prepare them in the same kitchen, so we cannot promise zero cross-contamination.`

**The dough** — Eyebrow `THE DOUGH` — H2 `FORTY-EIGHT HOURS BEFORE YOU ORDER IT`
`We mix with Caputo 00, sea salt, water and a small amount of yeast, then leave it alone for two days at a controlled temperature. Long fermentation is why the crust is light, why it blisters, and why it does not sit in your stomach like a brick. It also means we sometimes run out on a Saturday, and we would rather do that than rush it.`

**Booking** — `Tables for up to six can be booked online. Groups of seven or more, please call. We keep a third of the room for walk-ins every night, so if you have not booked, come early and try your luck at the counter.`

**Collection & delivery**
- **Collection** — Order by phone, ready in about twenty minutes. Ten percent off every collection order.
- **Delivery** — We deliver ourselves within two miles, Tuesday to Sunday, until 21:45. £3 flat.
- **Apps** — We are on the usual apps, but they charge us around thirty percent. Ordering direct is cheaper for you and considerably better for us.

**Reviews**
1. `The Diavola with the honey is a genuinely stupid combination that works perfectly and I think about it at odd hours.` — **Ben H.**
2. `We turned up at six on a Friday with no booking and got the last two counter seats. Sat next to the oven, watched every pizza go in. Best seats in the place.` — **Priya S.**
3. `Twelve pizzas on the menu and no pasta. You can taste the confidence.` — **Marek L.**

**Find us** — `184 Gloucester Road, Bristol BS7 8NT` · Tue–Thu 17:00–22:00 · Fri–Sat 12:00–23:00 · Sun 12:00–21:00 · Mon closed · `Street parking after 18:00, and the 75 stops outside.`

**Footer** — FORNO ROSSO · `Sixty seconds in a 450 degree oven.` · © 2026

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```
