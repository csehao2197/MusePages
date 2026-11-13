# Oakline Furniture — Furniture Store Website Prompt

## 1. Goal Statement
Build an editorial, catalogue-quality furniture retail website for **Oakline Furniture**, defined by oat-white space, walnut brown, and oversized product photography — a store site that reads like a design magazine while still doing the retail jobs: browse by room, compare materials, and book a showroom visit.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(38, 28%, 95%);        /* #f5f1ea oat */
  --foreground: hsl(28, 18%, 16%);        /* #2f2822 walnut ink */
  --primary: hsl(26, 32%, 32%);           /* #6b4f38 walnut */
  --primary-foreground: hsl(38, 28%, 97%);
  --muted-foreground: hsl(28, 8%, 46%);
  --border: hsl(36, 16%, 86%);
  --card: hsl(38, 30%, 91%);
  --accent-sage: hsl(96, 12%, 52%);       /* muted sage for tags */
  --sale: hsl(8, 62%, 48%);               /* used sparingly */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- **H1 / hero:** `'Instrument Serif', serif;` weight 400, clamp(42px, 6vw, 86px), line-height: 1.02, letter-spacing: -0.015em
- **H2:** Instrument Serif 400, 36–52px
- **H3 / product names:** Inter 500, 17–20px
- **Body:** Inter 300–400, 16px, line-height: 1.75
- **Eyebrows / labels:** Inter 600, uppercase, letter-spacing: 0.2em, 10px
- **Prices:** Inter 500, tabular-nums, 16px
- **Pull quotes / material notes:** Instrument Serif italic 400, 22–28px

---

## 5. Visual Effects

### Effect 1 — Shop-by-Room Hover Reveal
```tsx
const rooms = ['Living', 'Dining', 'Bedroom', 'Workspace'];
const [active, setActive] = useState(0);

<div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-center">
  <ul>
    {rooms.map((r, i) => (
      <li key={r} onMouseEnter={() => setActive(i)} className="border-b border-[var(--border)]">
        <button className="group flex w-full items-baseline justify-between py-6 text-left">
          <span
            className="font-serif text-4xl md:text-5xl transition-colors duration-300"
            style={{ color: active === i ? 'var(--foreground)' : 'var(--muted-foreground)' }}
          >
            {r}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Shop →
          </span>
        </button>
      </li>
    ))}
  </ul>
  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
    <AnimatePresence mode="wait">
      <motion.img
        key={active}
        src=""
        alt={`${rooms[active]} room setting`}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </AnimatePresence>
  </div>
</div>
{/* Image (per room): styled interior room setting with furniture in warm natural daylight, editorial interiors photography, calm neutral palette, lived-in but uncluttered */}
```

### Effect 2 — Product Card with Swatch Switcher
```tsx
<div className="group">
  <div className="relative aspect-square overflow-hidden bg-[var(--card)]">
    {/* Image: single furniture piece on a plain warm backdrop, soft directional daylight, gentle shadow, product photography */}
    <img src="" alt="Lounge chair in oak and boucle" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]" />
    <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-label="Save">
      <Heart size={16} />
    </button>
  </div>
  <div className="mt-4 flex items-start justify-between gap-4">
    <div>
      <h3 className="font-medium">Alden Lounge Chair</h3>
      <p className="text-sm text-[var(--muted-foreground)]">White oak · Boucle</p>
    </div>
    <span className="tabular-nums">$1,290</span>
  </div>
  <div className="mt-3 flex gap-2">
    {['#c8b89a', '#6b4f38', '#3a3a38', '#8f9a86'].map(c => (
      <button key={c} className="h-4 w-4 rounded-full ring-1 ring-black/10 transition-transform hover:scale-125" style={{ background: c }} aria-label="Colour option" />
    ))}
  </div>
</div>
```

### Effect 3 — Editorial Split Rows (alternating)
```
Full-bleed image on one side, text block on the other, alternating direction each row.
Image reveals with clipPath wipe from its outer edge; text fades up with 0.15s delay.
```

### Effect 4 — Fade-Up
```
initial={{ opacity: 0, y: 26 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- 80px, `sticky top-0 z-40`, oat background, 1px bottom border on scroll
- Left: "OAKLINE" (Instrument Serif 400, tracking 0.08em)
- Center: Living · Dining · Bedroom · Workspace · Lighting · Sale
- Right: search icon · saved (heart) icon · cart icon with count badge · `Visit Showroom` (walnut outline, hidden below `lg`)
- Announcement bar above navbar: `Free delivery on orders over $999 · Made-to-order pieces ship in 6–8 weeks`
- Mobile: hamburger + wordmark + cart

### Section 2 — Hero (Full-Bleed Editorial)
- `h-[88vh]`, image full-bleed, text block bottom-left in a semi-opaque oat panel
```jsx
{/* Image: warm minimal living room with a linen sofa and oak coffee table, late afternoon light across the floor, editorial interiors photography, calm neutral palette */}
<img src="" alt="Living room in afternoon light" className="absolute inset-0 h-full w-full object-cover object-center" />
<div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(47,40,34,0.5) 0%, transparent 50%)' }} />
```
- Text panel (`bg-[var(--background)]/92 backdrop-blur-sm p-10 max-w-xl rounded-sm`):
  - Eyebrow: `THE SPRING COLLECTION`
  - H1: `Furniture built\nto outlive\nthe trend.`
  - Subline: `Solid hardwood, natural fibres, and joinery you can see. Designed in Brooklyn, made in North Carolina.`
  - CTA row: `Shop the Collection` (walnut filled) + `Book a Showroom Visit` (text link with arrow)

### Section 3 — Shop by Room
- `--background`, `py-24`
- Eyebrow `SHOP BY ROOM` + hover-reveal room list (Effect 1)

### Section 4 — New Arrivals
- `--background`, eyebrow `NEW THIS SEASON` + H2 `Just Arrived`
- **4-col product grid** (Effect 2), 8 products
- Horizontal scroll on mobile with `snap-x`
- `View all new arrivals →`

### Section 5 — Materials Story (Editorial Split)
- Alternating rows (Effect 3), `--card` background
- Three rows: **The Wood** · **The Fabric** · **The Joinery**
- Each: full-bleed image one side, eyebrow + H2 + 2 paragraphs + a small spec list the other
```jsx
{/* Image: close-up of white oak grain with a hand plane resting on it, warm workshop light, tactile and detailed */}
{/* Image: stacked folded upholstery fabrics in neutral tones, natural daylight, textile detail */}
{/* Image: exposed mortise and tenon joint on a table leg, macro detail, warm workshop lighting */}
```

### Section 6 — Best Sellers
- `--background`, eyebrow `MOST LOVED` + H2 `Best Sellers`
- 4-col product grid, 4 products, each with a small `Best seller` sage tag

### Section 7 — Room Inspiration Gallery
- Full-bleed 3-column masonry of styled room shots with `Shop this room →` overlay on hover
- Eyebrow `INSPIRATION` + H2 `Rooms We Would Live In`

### Section 8 — Showroom
- `--card`, 2-col split
- Left: eyebrow `VISIT US`, H2 `Sit on It First`, paragraph, address, hours, `Book a Design Consultation` button
- Right: showroom interior image
```jsx
{/* Image: bright furniture showroom interior with styled vignettes, large windows, warm wood floors, uncrowded and calm */}
```

### Section 9 — Delivery & Care
- `--background`, 3-col info cards with outlined icons
- White-glove delivery · 6–8 week made-to-order lead time · 10-year structural warranty
- Below: `Read our care guide →`

### Section 10 — Reviews
- `--card`, 3 review cards: 5-star row, quote, name, and a small `Verified buyer · Alden Sofa` line

### Section 11 — Newsletter
- Walnut full-bleed band, oat text, centered
- H2 `New pieces, first look.` + inline email input + `Sign Up` button + `One email a month. Unsubscribe whenever.`

### Section 12 — Footer
- `--background` with 1px top border, 5 columns: brand + address / Shop / About / Support / Newsletter recap
- Bottom strip: © line, payment method text badges, privacy, accessibility

---

## 7. Animations

- **Hero:** image scales `1.06 → 1` over 10s linear (very slow drift); text panel fades up 0.85s at 0.2s
- **Room list:** active room name colour transitions 0.3s; image cross-fades with `AnimatePresence`, `scale 1.04 → 1`, 0.55s
- **Product cards:** stagger `i * 0.07`; image scales 1 → 1.03 over 0.7s on hover; save-heart fades in 0.3s; swatches scale 1.25 on hover
- **Editorial rows:** image `clipPath: inset(0 0 0 100%) → inset(0 0 0 0)` (direction alternates per row), 1.05s; text fades up 0.15s later
- **Gallery masonry:** `Shop this room →` overlay fades in with a dark scrim, 0.35s
- **Newsletter band:** background colour fades in as the section enters view, 0.7s
- **All headings:** fade-up 0.7s, ease `[0.22, 1, 0.36, 1]`

---

## 8. Responsive

### Mobile (< 768px)
- Announcement bar: text shortens to `Free delivery over $999`
- Navbar: hamburger + wordmark + cart; full-screen oat overlay menu with serif category links
- Hero: `h-[70vh]`, text panel becomes full-width at the bottom with no blur, H1 clamps to 42px
- Shop by room: list becomes 2x2 image tiles with the room name overlaid (hover reveal does not work on touch)
- Product grids: horizontal scroll with `snap-x`, cards at 72vw
- Editorial rows: image always above text, no alternation
- Gallery: 2-col masonry
- Showroom: image above text
- Footer: accordion-style collapsible column groups

### Tablet (768–1024px)
- Product grids 3-col · editorial rows keep alternating · gallery 2-col · room list retains hover reveal

### Desktop (> 1024px)
- Max width 1360px (wide, catalogue-like), `px-16`, `py-24`

---

## 9. Full Copy

### Brand
**OAKLINE FURNITURE** — Brooklyn, New York

### Announcement Bar
`Free delivery on orders over $999 · Made-to-order pieces ship in 6–8 weeks`

### Navbar
Living · Dining · Bedroom · Workspace · Lighting · Sale · [Button] Visit Showroom

### Hero
- Eyebrow: `THE SPRING COLLECTION`
- H1: `Furniture built to outlive the trend.`
- Subline: `Solid hardwood, natural fibres, and joinery you can see. Designed in Brooklyn, made in North Carolina.`
- CTA 1: `Shop the Collection` · CTA 2: `Book a Showroom Visit →`

### Shop by Room
Eyebrow: `SHOP BY ROOM`
`Living` · `Dining` · `Bedroom` · `Workspace`

### New Arrivals
Eyebrow: `NEW THIS SEASON` — H2: `Just Arrived`
1. **Alden Lounge Chair** — White oak · Boucle — `$1,290`
2. **Marlow Sofa, 3-Seat** — Walnut base · Belgian linen — `$3,450`
3. **Fennimore Dining Table** — Solid white oak · Seats 8 — `$2,780`
4. **Ridge Sideboard** — Walnut · Brass pulls — `$2,190`
5. **Copse Bed Frame, Queen** — Ash · Cane headboard — `$1,940`
6. **Halden Desk** — White oak · Blackened steel — `$1,480`
7. **Yarrow Armchair** — Ash · Wool flannel — `$980`
8. **Bramble Bookcase** — Solid oak · Adjustable shelving — `$1,620`

### Materials Story
1. **The Wood** — Eyebrow `MATERIALS` — `We use solid hardwood, not veneer over particleboard. Our oak and walnut come from FSC-certified forests in Appalachia, milled within 200 miles of our workshop.` / `Solid wood moves with the seasons. A hairline gap in a tabletop in February that closes by July is not a defect — it is the reason the piece will still be standing in fifty years.` — Specs: `FSC-certified hardwood` · `Kiln-dried to 7% moisture` · `Water-based low-VOC finish`
2. **The Fabric** — `Belgian linen, wool flannel, and boucle woven in mills we have visited. No performance coatings, no microplastic-shedding blends, and no fabric we would not put in our own homes.` / `Every upholstered piece comes with removable covers, and replacement covers are available for ten years after purchase — because sofas usually outlive their fabric.` — Specs: `Belgian linen & wool` · `Removable covers` · `100,000+ double rubs`
3. **The Joinery** — `Mortise and tenon, dovetails, and dowels. No cam locks, no plastic brackets, and no glue holding a structure together on its own.` / `You can see the joinery on every piece we make, because we think the way something is built should be visible rather than hidden under a laminate cap.` — Specs: `Mortise & tenon frames` · `Dovetailed drawers` · `10-year structural warranty`

### Best Sellers
Eyebrow: `MOST LOVED` — H2: `Best Sellers`
1. **Marlow Sofa, 3-Seat** — `$3,450` · *Best seller*
2. **Fennimore Dining Table** — `$2,780` · *Best seller*
3. **Alden Lounge Chair** — `$1,290` · *Best seller*
4. **Ridge Sideboard** — `$2,190` · *Best seller*

### Inspiration
Eyebrow: `INSPIRATION` — H2: `Rooms We Would Live In`
Captions: `A small living room that does not feel small` · `Dining for eight in 140 square feet` · `The workspace corner` · `A bedroom with nothing extra` · `Open plan, defined by furniture` · `Entryway, done properly`

### Showroom
Eyebrow: `VISIT US` — H2: `Sit on It First`
Paragraph: `Photographs are useful for shape and terrible for comfort. Our Brooklyn showroom has every current piece on the floor, and nobody will follow you around. Bring your floor plan and a coffee — design consultations are free and take about an hour.`
- Address: `184 Wythe Avenue, Brooklyn, NY 11249`
- Hours: `Mon–Sat 10am–7pm · Sun 11am–5pm`
- CTA: `Book a Design Consultation`

### Delivery & Care
1. **White-Glove Delivery** (icon: `Truck`) — We bring it in, assemble it, place it where you want it, and take the packaging away with us. Free on orders over $999.
2. **Made to Order** (icon: `Hammer`) — Most pieces are built after you order them, which takes six to eight weeks. In-stock items ship within a week.
3. **10-Year Structural Warranty** (icon: `ShieldCheck`) — Frames, joinery, and hardware for ten years. Fabric and finish wear are covered for three.
Link: `Read our care guide →`

### Reviews
1. `The Marlow arrived and my partner sat on it and said nothing for about a minute, which from him is a standing ovation.` — **Devon L.** · Verified buyer · Marlow Sofa
2. `I ordered the dining table expecting to be disappointed by something at that price. Three years and two house moves later there is not a single wobble in it.` — **Priya M.** · Verified buyer · Fennimore Dining Table
3. `Delivery team took the old sofa away, assembled the new one, and vacuumed the room. I did not ask them to do the last part.` — **Tomás R.** · Verified buyer · Alden Lounge Chair

### Newsletter
H2: `New pieces, first look.`
Subline: `One email a month. Unsubscribe whenever.`
CTA: `Sign Up`

### Footer
- OAKLINE FURNITURE · `Designed in Brooklyn. Made in North Carolina.`
- Address: `184 Wythe Avenue, Brooklyn, NY 11249` · `(718) 555-0172`
- Shop: Living · Dining · Bedroom · Workspace · Lighting · Sale
- About: Our Story · Materials · Sustainability · Showroom · Careers
- Support: Delivery · Returns · Care Guide · Warranty · Trade Program · Contact
- © 2026 Oakline Furniture. All rights reserved. · Privacy · Accessibility

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "embla-carousel-react": "^8.3.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

**Tailwind config additions:**
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'ok-oat': '#f5f1ea',
        'ok-walnut': '#6b4f38',
        'ok-sage': '#818f79',
      },
      borderRadius: { DEFAULT: '2px' },
    },
  },
};
```
