# Maison Solenne — Perfume Brand Website Prompt

## 1. Goal Statement
Build a sensual, luxurious website for **Maison Solenne**, a niche Parisian perfume house — deep charcoal and warm champagne, cinematic slow blur reveals, a delicate thin serif, fragrance notes set as a typographic pyramid, and full-bleed photography of glass and light that makes scent feel visible.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries and no cart logic. Buttons link to product pages.

## 3. Design System — Colors
```css
:root {
  --background: hsl(30, 6%, 8%);         /* warm charcoal */
  --foreground: hsl(38, 30%, 90%);       /* champagne cream */
  --primary: hsl(38, 42%, 66%);          /* champagne gold */
  --primary-foreground: hsl(30, 6%, 8%);
  --muted-foreground: hsl(34, 10%, 58%);
  --border: hsl(36, 12%, 20%);
  --light: hsl(38, 32%, 94%);            /* ivory, used for one light section */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400&display=swap" rel="stylesheet" />
```
- **H1:** Italiana 400, clamp(56px, 10vw, 170px), line-height 0.9, letter-spacing 0.02em, uppercase
- **H2:** Cormorant 300, clamp(38px, 5vw, 76px), line-height 1
- **Italic accent:** Cormorant 300 italic, champagne
- **Body:** Jost 300, 16px, line-height 1.8, letter-spacing 0.01em
- **Labels:** Jost 400, 11px, uppercase, letter-spacing 0.3em

## 5. Visual Effects

**Effect 1 — Blur reveal.** All headlines and images enter from `filter: blur(20px)`, `opacity 0`, `scale 1.04` to sharp and full, over 1.6s with ease `[0.16, 1, 0.3, 1]`. Slow enough to feel like scent arriving.

**Effect 2 — Notes pyramid.** Each fragrance's notes are set as a typographic pyramid, centred: top notes on one short line in small caps, heart notes on a wider line, base notes on the widest line in larger italic. Thin champagne horizontal hairlines between tiers, each drawing outward from the centre (`scaleX 0 → 1`) as it enters view.

**Effect 3 — Light leak.** A very soft, slowly drifting warm radial glow (`hsla(38, 60%, 60%, 0.08)`, 900px) moves across the hero on a 20-second loop between two positions, like light moving through a glass bottle.

## 6. Component Breakdown

1. **Navbar** — 88px, transparent over the hero, wordmark centred in Italiana with wide letter-spacing, links split left and right. Charcoal with blur after scrolling.
2. **Hero** — full viewport, full-bleed image with a dark gradient at the bottom and light leak (Effect 3). H1 centred bottom third, a short italic line below, and a text button with a thin underline. *Image: elegant faceted perfume bottle with amber liquid, dramatic side light through the glass casting golden caustics on a dark stone surface, cinematic.*
3. **Manifesto** — centred, very generous whitespace, one short paragraph in Cormorant 32px.
4. **The collection** — four fragrances in a horizontal row of tall 2:3 image tiles, each with name, olfactory family label and price. On hover the image slowly zooms and a thin champagne line appears under the name.
5. **Featured fragrance** — split layout: full-height image left, right side with name, story paragraph, notes pyramid (Effect 2), size options as plain text, and a button. *Image: close-up of fig leaves and dark wood with morning dew, rich green and brown, moody macro photography.*
6. **Ingredients** — full-bleed image band 80vh with three ingredient names placed across it as large italic words over a dark gradient. *Image: fields of Grasse jasmine at dawn, soft haze, warm golden light.*
7. **The perfumer** — ivory light section (the only light section), portrait left, quote and short biography right, charcoal text.
8. **Discovery set** — centred panel with image, name, description, price and button.
9. **Boutique** — address in Paris, hours, and an appointment line.
10. **Footer** — charcoal, minimal, wordmark centred, links in a single row, newsletter line.

## 7. Animations
- Effect 1 on every heading and image as it enters view (once)
- Hero H1: letters reveal with blur and a 0.04s stagger
- Collection tiles: stagger 0.15s; hover image scale 1 → 1.06 over 1.4s
- Notes pyramid tiers: Effect 2, tier by tier with 0.3s stagger
- Ingredients words: each fades and drifts `x: -20 → 0` with 0.25s stagger
- Light leak: Effect 3, infinite

## 8. Responsive
- **Mobile (<768px):** H1 at 56px; navbar becomes wordmark centred with menu icon left and bag icon right; collection becomes a horizontal snap-scroll row with tiles at 70% width; featured fragrance stacks image first at 70vh; ingredient words stack vertically; perfumer section stacks portrait first.
- **Tablet:** collection 2×2 grid; featured stays split 50/50.
- **Desktop:** full-bleed imagery, text max-width 1280px, `px-10`, section spacing `py-36`.

## 9. Full Copy

**Brand:** MAISON SOLENNE · Paris

**Navbar:** Fragrances · Discovery · — SOLENNE — · The House · Boutique

**Hero**
- H1: `SOLENNE`
- Line: `*Perfumes composed slowly, in small editions, in Paris.*`
- Button: `Discover the collection`

**Manifesto:** `We make four perfumes. Each took more than two years to finish, uses natural materials wherever they are better, and is bottled by hand in editions of eight hundred. We will make a fifth when it is ready, and not before.`

**The collection** — Label `THE COLLECTION`
1. **Figue Noire** — `WOODY · GREEN` — 50ml — €185
2. **Lumière d'Ambre** — `AMBER · RESINOUS` — 50ml — €195
3. **Jasmin de Nuit** — `WHITE FLORAL` — 50ml — €185
4. **Pluie Minérale** — `FRESH · MINERAL` — 50ml — €175

**Featured fragrance** — Label `FEATURED`
- H2: `Figue *Noire*`
- Story: `An evening in a walled garden in Provence, after the heat of the day has gone. Crushed fig leaves, the milky sap of unripe fruit, and the dark wood of an old bench still warm from the sun.`
- Notes pyramid:
  - Top: `BERGAMOT · FIG LEAF · BLACK PEPPER`
  - Heart: `fig milk · iris · violet leaf`
  - Base: *cedar · tonka · smoked vetiver*
- Sizes: `50ml €185 · 100ml €260`
- Button: `Discover Figue Noire`

**Ingredients** — Label `SOURCED BY HAND` · Words: *Jasmine from Grasse* · *Iris from Florence* · *Vetiver from Haiti*

**The perfumer** — Label `THE NOSE` · Quote: `"A perfume should feel like a memory you did not know you had."` · `Camille Arnaud trained in Grasse and spent twelve years composing for the great houses before founding Maison Solenne in 2019. She works alone, in a small studio above the boutique.`

**Discovery set** — H2 `Begin *with all four*.` `Four 2ml vials in a linen-bound case. The full price is refunded when you buy a 50ml bottle within three months.` — €32 — Button `Order the discovery set`

**Boutique** — H2 `Visit the *boutique*.` `14 rue de Poitou, 75003 Paris` · `Tuesday – Saturday, 11h – 19h` · `Private consultations by appointment, with Camille when she is in the studio.`

**Footer** — SOLENNE · Fragrances · Discovery set · The House · Boutique · Delivery · Contact · `Letters from the studio, four times a year.` Input `Your email` · © 2026 Maison Solenne

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
