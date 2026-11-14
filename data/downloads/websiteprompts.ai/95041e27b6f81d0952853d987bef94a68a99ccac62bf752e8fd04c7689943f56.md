# Good Boy Supply — Pet Store Website Prompt

## 1. Goal Statement
Build a bright, joyful website for **Good Boy Supply Co.**, an independent neighbourhood pet store — sunny yellow and cobalt blue, chunky rounded type, sticker-style rotated badges, cut-out pet photography, and a playful energy that makes people smile before they have read a word.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
No component libraries and no cart. Product buttons are links to the shop.

## 3. Design System — Colors
```css
:root {
  --background: hsl(48, 100%, 96%);      /* warm cream */
  --foreground: hsl(228, 40%, 14%);      /* ink navy */
  --primary: hsl(46, 100%, 58%);         /* sunny yellow */
  --primary-foreground: hsl(228, 40%, 14%);
  --blue: hsl(226, 80%, 52%);            /* cobalt */
  --pink: hsl(346, 88%, 72%);            /* bubblegum, sticker accents only */
  --muted-foreground: hsl(228, 12%, 40%);
  --border: hsl(228, 40%, 14%);          /* thick ink outlines */
}
```
All cards and buttons use a **2px ink border** and a hard offset shadow `4px 4px 0 var(--border)`. No soft shadows anywhere.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=Nunito:wght@400;600;800&display=swap" rel="stylesheet" />
```
- **H1:** Bricolage Grotesque 800, clamp(56px, 10vw, 150px), line-height 0.9, letter-spacing -0.04em
- **H2:** Bricolage Grotesque 800, clamp(40px, 5vw, 72px), line-height 0.95
- **Body:** Nunito 400, 17px, line-height 1.6
- **Buttons and labels:** Nunito 800, 15px

## 5. Visual Effects

**Effect 1 — Sticker badges.** Round and star-shaped badges rotated between -12 and 12 degrees, pink or blue fill with ink border, placed overlapping the edges of images and headings. They wobble on hover: `rotate: [r, r - 6, r + 6, r]` over 0.5s.

**Effect 2 — Pressable buttons.** Every button has the hard offset shadow. On hover it moves `translate(-2px, -2px)` and the shadow grows to `6px 6px 0`; on press it moves `translate(4px, 4px)` and the shadow disappears. Pure CSS transitions, 120ms.

**Effect 3 — Wavy section edges.** Coloured sections start and end with an SVG wave edge (a single cubic path, full width, 60px tall) instead of a straight line.

## 6. Component Breakdown

1. **Ticker bar** — 40px, cobalt background, cream text, a looping marquee of offers.
2. **Navbar** — 84px, cream, wordmark left in Bricolage 800 with a small bone icon, links centre, yellow `Visit the shop` pressable button right.
3. **Hero** — yellow background with wavy bottom edge (Effect 3). Left: H1 across three lines, subline, two buttons. Right: a large pet photograph in a rounded 32px frame with ink border, with two sticker badges (Effect 1) overlapping its corners. *Image: happy golden retriever tilting its head, bright studio background, joyful expression, colourful and crisp.*
4. **Shop by pet** — four chunky cards in a row (Dogs, Cats, Small pets, Birds), each a different colour fill with a pet photo, name and item count. Cards lift on hover.
5. **Staff picks** — a 4-column product grid on cream, each card with ink border, product image on a pale colour tile, name, short description, price, and a small sticker on one of them reading `Staff fave`.
6. **The self-wash** — cobalt section with wavy edges, split layout: text and prices left, photo right with a sticker `No mess at home!`. *Image: small scruffy dog in a stainless steel dog bath covered in bubbles, happy and funny, bright light.*
7. **Why local** — three colourful rounded panels, each with a big emoji-free icon from lucide, a heading and two lines.
8. **Pet of the month** — a playful polaroid-style photo rotated -3deg with a handwritten-feel caption, next to a short story.
9. **Reviews** — three speech-bubble cards with a tail, alternating yellow, pink and blue fills.
10. **Visit us** — address, hours in a simple two-column list, and a note about dogs being welcome inside.
11. **Footer** — ink navy background, cream text, giant wordmark `GOOD BOY` in yellow at 18vw, links beneath.

## 7. Animations
- Hero H1 words pop in: `scale 0.6 → 1`, `opacity 0 → 1`, spring (stiffness 300, damping 18), stagger 0.08s
- Hero image: `rotate: -6 → 0`, `scale 0.9 → 1`, spring
- Stickers: drop in `y: -30 → 0`, `rotate` to their final angle, spring, delay 0.6s
- Shop cards and product cards: fade up 24px with 0.07s stagger; hover `y: -6`
- Ticker marquee: 30s linear infinite
- Buttons: Effect 2

## 8. Responsive
- **Mobile (<768px):** hero stacks with text first then image; H1 at 56px; shop-by-pet becomes a 2×2 grid; staff picks become 2 columns; self-wash stacks; stickers scale to 75%; navbar shows wordmark and a yellow menu button opening a full-screen yellow overlay with huge links.
- **Tablet:** staff picks 3 columns; shop-by-pet stays 4 across at smaller size.
- **Desktop:** max-width 1280px, `px-8`, section spacing `py-24`.

## 9. Full Copy

**Ticker:** `Free local delivery over £30 · Self-wash open 7 days · Loyalty card: 10th bag of food free · Dogs welcome inside ·`

**Navbar:** Dogs · Cats · Small pets · Self-wash · About — Visit the shop

**Hero**
- H1: `Everything / for the *good* / boys & girls.`
- Subline: `An independent pet shop in Bristol with real food, sturdy toys and people who actually know your dog's name.`
- Buttons: `Shop online` · `Find the shop`
- Stickers: `Since 2014` · `Treats at the till!`

**Shop by pet**
- **Dogs** — 420 products
- **Cats** — 310 products
- **Small pets** — 140 products
- **Birds** — 85 products

**Staff picks** — H2 `What we'd buy (and do).`
1. **Tough Tug Rope** — `Recycled cotton, survives the terriers.` — £9
2. **Grain-Free Salmon Kibble** — `Made in Somerset, 2kg bag.` — £18
3. **Feather Wand Teaser** — `The one cats actually chase.` — £6
4. **Waxed Canvas Lead** — `Brass clip, lasts for years.` — £24

**The self-wash** — H2 `Muddy dog? *We've got a bath for that.*` `Raised tubs, warm water, dog shampoo, towels and a blow dryer. You wash, we clean up.` Prices: `Small dog £10` · `Medium dog £13` · `Large dog £16` — Button `See opening times`

**Why local**
- **We know the food** — `Every food on our shelves has been checked by our team, and we'll help you switch slowly.`
- **Free delivery nearby** — `Heavy bags delivered free within three miles of the shop.`
- **Loyalty that adds up** — `Your tenth bag of food is on us. No app, just a stamp card.`

**Pet of the month** — Caption `Biscuit, 4, professional sock thief` — `Biscuit comes in every Saturday for a chew and a fuss. This month he helped us test eleven new toys and destroyed nine of them. The two survivors are now on the shelves.`

**Reviews**
- `"They remembered my cat's allergy after one visit. Proper service."` — *Sophie, Bedminster*
- `"The self-wash has saved my bathroom and my marriage."` — *Tom, Southville*
- `"My spaniel drags me here. Probably the free treats."` — *Leah, Totterdown*

**Visit us** — H2 `Come say hi. Bring the dog.` `Good Boy Supply Co., 88 North Street, Bristol BS3 1HJ` · `Mon – Sat 9am – 6pm` · `Sunday 10am – 4pm` · `Dogs on leads always welcome inside.`

**Footer** — GOOD BOY · Shop · Self-wash · Delivery · Loyalty card · About · Contact · Instagram · © 2026 Good Boy Supply Co.

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "clsx": "^2.1.0"
}
```
