# Stride and Co: Shoe Store Website Prompt

## 1. Goal
Build a clean, product led online shop homepage for **Stride and Co**, an independent shoe shop in Manchester selling everyday trainers, running shoes and leather boots from small makers. White and pale grey, black type, product photography on soft grey backgrounds, a precise grotesk. It should feel like a well run modern shop: lots of products visible, easy to scan, nothing in the way of the shoes.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Homepage only, products in a `products.ts` file. A simple bag counter in React state. No checkout, no component libraries, no carousel library.

## 3. Design system
```css
:root {
  --paper: #FFFFFF;
  --ink: #0F0F0F;
  --accent: #0F0F0F;        /* black buttons */
  --on-accent: #FFFFFF;
  --sale: #B42318;          /* only for sale prices, used as text on white */
  --surface: #F2F2F0;       /* product photo backgrounds */
  --muted: #5E5E5E;
  --line: #E4E4E2;
}
```
Every text colour must reach at least 4.5 to 1 against its background. No text under 14px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
```
One family.
- **Hero heading:** Hanken Grotesk 700, clamp(40px, 6vw, 88px), line-height 0.98, letter-spacing -0.035em
- **Section headings:** Hanken Grotesk 600, 28px
- **Product name:** Hanken Grotesk 500, 16px
- **Price:** Hanken Grotesk 600, 16px, tabular numbers
- **Body:** Hanken Grotesk 400, 16px, line-height 1.6

## 5. Buttons
Shop style, rectangular:
- **Primary:** solid black rectangle, white text, 0 radius, Hanken Grotesk 600 15px, padding 15px 26px. Hover: background changes to #2B2B2B.
- **Add to bag:** a full width black rectangle that slides up from the bottom of each product image on hover (desktop). On mobile a small round `+` button sits in the corner of the image instead.
- **Text links:** underlined, black, used for `Shop all` and filters.
- No pills except the small size chips.

## 6. Sections

1. **Announcement bar:** black strip, white text, one centred line about free delivery and returns.
2. **Navbar:** white, 72px. Logo `STRIDE & CO` left in 700 weight, category links centred, on the right a search icon, an account icon and a bag icon with a small black count bubble. Sticky.
3. **Hero, split:** two images side by side at full width, each 50%, square on desktop, on the surface colour. The heading sits over the left image in a white box anchored to the bottom left corner with the primary button. *Product photographs: a pair of off white leather trainers on a pale grey background, soft studio light; a pair of tan suede chelsea boots on the same grey background.*
4. **Shop by category:** three tall tiles (3:4) with a photo and the category name under it, plus a count of styles. *Photographs: running shoes in motion on a track; plain leather trainers on a wooden floor; brown leather boots on a stone step.*
5. **New in:** heading with `Shop all` link on the right. A grid of eight product cards (4 by 2). Each card: square image on surface colour, product name, colour name in muted text, price. Two products show a sale price in red with the old price struck through. Hover on desktop shows the second image (the shoe from the side) and the add to bag bar.
6. **Find your fit:** surface band. Three short columns: size guide, width options, free returns. Each with a heading, two sentences and a text link.
7. **Made by small makers:** two columns. A wide photo left, on the right a short text about the three workshops they buy from, with names and towns as a simple list. *Photograph: a cobbler's workbench with leather offcuts, tools and a half finished boot, warm light.*
8. **Our shop:** a photo of the physical shop with its address and opening hours next to it, and a text link `Get directions`. *Photograph: a bright minimal shoe shop interior with shoes on long wooden shelves and a big street window.*
9. **Newsletter:** a centred block with one line, an email input with a 1px black bottom border and the primary button.
10. **Footer:** white with a top line. Four columns of links (Shop, Help, About, Follow), payment method names as small text, copyright.

## 7. Motion
- Product images swap to the side view with a 0.3s crossfade on hover.
- The add to bag bar slides up 100% to 0 in 0.25s.
- When a product is added, the bag count bubble pops (scale 1 to 1.3 to 1) and a small toast appears top right for 2 seconds: `Added to bag`.
- Respect `prefers-reduced-motion`.

## 8. Responsive
- **Mobile under 768px:** announcement bar text shortens. Navbar shows a menu icon, the logo centred and the bag. Hero images stack, heading box sits under the first image. Categories become a horizontal scroll row. Product grid 2 columns. Fit columns stack.
- **Tablet:** product grid 3 columns.
- **Desktop:** full width layout with 32px side padding, max-width 1440px.

## 9. Full copy

**Announcement:** `Free delivery over £60 and free returns within 30 days.`
**Logo:** STRIDE & CO
**Nav:** New In, Trainers, Running, Boots, Sale

**Hero**
- Heading: `Good shoes, made to last.`
- Text: `Everyday trainers, running shoes and boots from small makers we know by name.`
- Button: `Shop new in`

**Shop by category**
- `Running` 24 styles · `Everyday` 38 styles · `Boots` 19 styles

**New in**
1. `Court Low` Off white leather, £120
2. `Court Low` Black leather, £120
3. `Trail Runner 2` Moss green, £135
4. `Road Runner` Slate blue, £125
5. `Chelsea Boot` Tan suede, £165
6. `Derby Boot` Dark brown leather, £180
7. `Canvas Plimsoll` Natural, sale £45, was £65
8. `Merino Runner` Light grey, sale £79, was £110
Link: `Shop all`

**Find your fit**
- `Size guide` `Our shoes run true to size. If you are between sizes, go up half.` Link `See the size guide`
- `Wide fits` `Twelve styles come in a wide fit, marked W in the size list.` Link `Shop wide fits`
- `Free returns` `Try them at home for 30 days. If they are not right, send them back for free.` Link `How returns work`

**Made by small makers**
- Heading: `Three workshops, no factories.`
- Text: `Every pair we sell is made by one of three small workshops. We visit them every year and pay what they ask.`
- List: `Calder Footwear, Hebden Bridge, boots and derbies` · `Oficina Lume, Porto, leather trainers` · `Kettle Run Co, Leicester, running shoes`

**Our shop**
- `Stride & Co, 42 Tib Street, Manchester M4 1LA`
- `Mon to Sat 10:00 to 18:00` · `Sun 11:00 to 17:00`
- Link: `Get directions`

**Newsletter**
- Line: `New styles first, no spam. About two emails a month.`
- Placeholder: `Email address` · Button: `Sign up`

**Footer**
Shop (New In, Trainers, Running, Boots, Sale) · Help (Delivery, Returns, Size guide, Contact) · About (Our makers, Our shop, Careers) · Follow (Instagram, TikTok) · `Visa, Mastercard, Amex, Apple Pay, PayPal` · `© 2026 Stride and Co Ltd`

## 10. Never
Product cards with shadows, rounded product images, gradients, glow, glassmorphism, emoji, a hero carousel, pop up discount modals, countdown timers, dashes of any kind in the copy, lorem ipsum.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
