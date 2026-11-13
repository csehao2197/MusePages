# Oda Skin — Skincare Brand Website Prompt

## 1. Goal Statement
Build a soft, tactile website for **Oda**, an independent skincare brand making five products from clay, oat and cold-pressed oils — a warm clay-and-cream palette, oversized product photography, a sticky product image that stays in place while ingredients scroll past, and a quiet confidence that sells through restraint.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries and no cart logic. Buttons link to product pages; nothing needs state beyond the mobile menu.

## 3. Design System — Colors
```css
:root {
  --background: hsl(30, 33%, 95%);       /* cream */
  --foreground: hsl(20, 18%, 18%);       /* deep cocoa */
  --primary: hsl(16, 38%, 58%);          /* terracotta clay */
  --primary-foreground: hsl(30, 33%, 97%);
  --muted-foreground: hsl(20, 10%, 46%);
  --border: hsl(26, 20%, 85%);
  --card: hsl(24, 32%, 89%);             /* blush clay panel */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **H1:** Instrument Serif 400, clamp(56px, 9vw, 140px), line-height 0.92, letter-spacing -0.03em
- **H2:** Instrument Serif 400, clamp(40px, 5vw, 72px), line-height 1
- **Italic:** Instrument Serif italic for one word per heading
- **Body:** DM Sans 300, 17px, line-height 1.7
- **Labels and prices:** DM Sans 500, 12px, uppercase, letter-spacing 0.12em

## 5. Visual Effects

**Effect 1 — Sticky product, scrolling ingredients.** In the ingredients section the product image sits in a sticky left column (`position: sticky; top: 96px; height: calc(100vh - 128px)`) while four ingredient blocks scroll past on the right. As each block reaches the centre of the viewport, it goes from 30% to 100% opacity. Use `whileInView` with `viewport={{ amount: 0.6 }}` — no scroll maths.

**Effect 2 — Clay blob shapes.** Behind the hero product image, a large soft organic blob in `--card` colour, drawn as an inline SVG path with a 12-second slow morph between two path shapes (animate the `d` attribute with Framer Motion, `repeat: Infinity, repeatType: "mirror"`). One blob only. It should read as a pebble, not a lava lamp.

## 6. Component Breakdown

1. **Announcement bar** — 36px, terracotta background, one centred line of small cream text.
2. **Navbar** — 76px, cream, wordmark centred in Instrument Serif 32px, links left, `Account` and `Bag (0)` text links right. Sticky.
3. **Hero** — two columns. Left: label, giant H1 set across three lines, subline, button. Right: the blob (Effect 2) with a tall product bottle image centred on top of it. *Image: amber glass skincare bottle with a cream label, on a warm clay-coloured stone, soft window light, minimal styling.*
4. **Marquee strip** — a single slow horizontal marquee of values separated by small asterisks, 40s loop, pauses on hover.
5. **The five products** — a horizontal row of five tall product tiles (4:5 ratio) on `--card`, each with image, name in Instrument Serif, one-line description, size and price. Horizontal scroll with snap on mobile.
6. **Ingredients** — Effect 1. Sticky image left, four ingredient blocks right, each with a large italic ingredient name, where it comes from, and what it does.
7. **Before you buy** — three short columns: `How to use`, `Skin types`, `What we leave out`.
8. **Full-bleed image** — a 70vh texture photograph with one short sentence overlaid in cream on a bottom gradient. *Image: close-up of pale pink clay being mixed with water in a ceramic bowl, soft natural light, tactile texture.*
9. **Reviews** — three reviews in plain columns: five small stars, quote, name and skin type.
10. **Journal** — two editorial cards with image, category, and title.
11. **Newsletter** — terracotta panel, H2 and a single email input with a text button.
12. **Footer** — cream, four columns, giant `oda` wordmark across the full width at the very bottom in Instrument Serif at 22vw, cropped slightly by the viewport bottom.

## 7. Animations
- Hero H1 lines: each line reveals from `y: 100%` inside an `overflow-hidden` wrapper, 0.9s, ease `[0.22, 1, 0.36, 1]`, stagger 0.12s
- Hero image: `opacity 0 → 1`, `scale 0.96 → 1`, 1.2s, delay 0.3s
- Product tiles: fade up 24px, stagger 0.08s
- Product image on hover: scale 1.04 over 0.8s
- Marquee: CSS keyframes `translateX(0) → translateX(-50%)`, 40s linear infinite
- Blob morph as in Effect 2

## 8. Responsive
- **Mobile (<768px):** hero stacks, image and blob first at 60vh; H1 at 56px; products become a horizontal snap-scroll row showing 1.3 tiles; ingredients section drops the sticky behaviour and shows image above each ingredient block instead; navbar shows wordmark centre, menu icon left, bag icon right.
- **Tablet:** products show 2.5 tiles in the scroll row; sticky ingredients remain.
- **Desktop:** max-width 1360px, `px-8`, section spacing `py-32`.

## 9. Full Copy

**Announcement bar:** `Free delivery over £40 · Refills now available for every product`

**Navbar:** Shop · Ingredients · Journal — ODA — Account · Bag (0)

**Hero**
- Label: `CLAY · OAT · COLD-PRESSED OILS`
- H1: `Less, / but *better* / for skin.`
- Subline: `Five products. No fragrance, no fillers, no twelve-step routine. Made in small batches in the Peak District.`
- Button: `Shop the five`

**Marquee:** `Fragrance-free * Refillable glass * Vegan * Made in small batches * Nothing you can't pronounce *`

**The five products** — H2 `The *whole* range.`
1. **Clay Cleanser** — `A pink clay gel that lifts the day without stripping.` — 150ml — £22
2. **Oat Milk Toner** — `Calms redness and preps skin in one step.` — 150ml — £19
3. **Daily Serum** — `Niacinamide and squalane, light enough for mornings.` — 30ml — £34
4. **Barrier Cream** — `A rich, unscented moisturiser for dry and reactive skin.` — 50ml — £29
5. **Night Oil** — `Rosehip and camellia, pressed cold, used sparingly.` — 30ml — £31

**Ingredients** — H2 `Four things *doing* the work.`
- ***Pink kaolin*** — `From Brittany.` `The gentlest clay there is. It absorbs excess oil without drawing moisture out of the skin.`
- ***Colloidal oat*** — `From Scottish farms.` `Soothes itching and redness, and forms a light protective film that helps skin hold water.`
- ***Squalane*** — `From olives.` `Mimics the oils skin makes itself, so it sinks in without residue.`
- ***Rosehip oil*** — `From Chile, cold-pressed.` `Rich in vitamin A and fatty acids. Brightens slowly, the honest way.`

**Before you buy**
- **How to use** — `Cleanse and tone morning and night. Serum in the morning, oil at night, cream whenever skin feels tight.`
- **Skin types** — `Formulated for sensitive, dry and combination skin. Patch test first if you react easily.`
- **What we leave out** — `Fragrance, essential oils, alcohol, sulphates, silicones and parabens.`

**Full-bleed image line:** `Skin doesn't need more. It needs *fewer, better* things.`

**Reviews** — Label `FROM PEOPLE WHO USE IT`
- `"The first cleanser that doesn't leave my rosacea angry. I've finished three bottles."` — *Hannah, sensitive skin*
- `"I replaced a shelf of products with four of these. My bathroom looks better too."` — *Jamal, combination skin*
- `"The barrier cream got me through a Yorkshire winter. Nothing else has."` — *Priya, dry skin*

**Journal**
- `ROUTINE` — *Why we only make five products*
- `INGREDIENTS` — *Clay, explained without the marketing*

**Newsletter** — H2 `One email a *month*.` `New batches, refill dates and nothing else.` Input placeholder `Your email` · Button `Subscribe`

**Footer** — Shop · Ingredients · Refills · Journal · Delivery · Returns · Contact · Instagram · `Oda Skin Ltd, Hathersage, Derbyshire` · © 2026 — giant `oda` wordmark

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
