# Wild Bloom Co. — Florist Website Prompt

## 1. Goal Statement
Build a romantic, lush e-commerce-adjacent website for Wild Bloom Co., a luxury floral studio brand with a botanical editorial aesthetic — blush whites, deep forest greens, and dusty rose tones that feel like a luxury garden meets magazine spread.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

## 3. Design System — Colors
```css
:root {
  --background: 14 75% 97%;          /* blush white #fdf0ec */
  --foreground: 145 30% 15%;         /* deep forest #1f3a28 */
  --primary: 145 32% 26%;            /* forest green #2d5a3d */
  --primary-foreground: 0 0% 100%;
  --secondary: 14 47% 65%;           /* dusty rose #d4907a */
  --secondary-foreground: 0 0% 100%;
  --muted-foreground: 20 15% 48%;    /* warm mid-tone */
  --border: 14 35% 88%;              /* blush border */
  --card: 15 60% 99%;                /* near-white blush card */
  --accent: 145 32% 26%;             /* forest green */
}
```

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
```
- **Display headings (H1, H2):** Cormorant Garamond, 400–600, italic variant for primary hero text
- **Body / navigation / buttons / labels / prices:** Jost, 300–500
- **Price / number emphasis:** Cormorant Garamond 500, 1.5–2rem
- **Uppercase eyebrows / tags:** Jost 500, 0.7rem, letter-spacing 0.2em, uppercase
- **Body copy:** Jost 300–400, 1rem, line-height 1.85, color: var(--muted-foreground)
- **Product names:** Cormorant Garamond 500, 1.2rem

## 5. Visual Effects

### Effect 1 — Hero Close-Up Bouquet with Petal Particle Animation
```tsx
// FloatingPetals.tsx
import { motion } from 'motion/react'

// SVG petal shape (simple organic oval/teardrop)
const PetalSVG = () => (
  <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2 C16 6 18 12 14 20 C12 24 8 26 6 24 C2 20 2 14 4 8 C6 4 8 0 10 2Z" fill="rgba(212,144,122,0.5)" />
  </svg>
)

interface Petal {
  id: number
  left: string
  delay: number
  duration: number
  size: number
  opacity: number
}

const petals: Petal[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 90 + 5}%`,
  delay: Math.random() * 4,
  duration: 6 + Math.random() * 4,
  size: 0.6 + Math.random() * 0.8,
  opacity: 0.3 + Math.random() * 0.5,
}))

export function FloatingPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{ left: petal.left, top: '-40px', opacity: petal.opacity, scale: petal.size }}
          animate={{
            y: ['0px', '110vh'],
            rotate: [0, 180 + Math.random() * 180],
            x: [0, (Math.random() - 0.5) * 80],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <PetalSVG />
        </motion.div>
      ))}
    </div>
  )
}

// Hero section:
<section className="relative w-full min-h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
  {/* Image: extremely lush and full close-up bouquet — peony, ranunculus, eucalyptus sprigs, garden roses, soft blush and cream petals, morning light filtering through petals creating translucent glow, arranged on pale blush surface, romantic botanical editorial style */}
  <img src="" alt="Wild Bloom Co. signature bouquet" className="w-full h-full object-cover object-center absolute inset-0" />
  {/* Overlay */}
  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(31,58,40,0.85) 0%, rgba(31,58,40,0.5) 45%, transparent 100%)' }} />
  {/* Petal particles */}
  <FloatingPetals />
  {/* Content */}
  <div className="relative z-20 px-8 md:px-16 flex flex-col justify-center min-h-screen max-w-2xl">
    ...hero text...
  </div>
</section>
```

### Effect 2 — Product Card Hover Box-Shadow Bloom
```tsx
import { motion } from 'motion/react'

<motion.div
  className="group bg-card rounded-sm overflow-hidden cursor-pointer"
  whileHover={{
    boxShadow: '0 8px 40px rgba(212,144,122,0.35)',
    y: -4,
  }}
  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
>
  <div className="overflow-hidden aspect-[3/4]">
    <motion.img
      className="w-full h-full object-cover object-center"
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
  <div className="p-5">
    {/* product info */}
  </div>
</motion.div>
```

### Effect 3 — Staggered Collection Card Entrance on Scroll
```tsx
import { motion } from 'motion/react'

{collections.map((collection, index) => (
  <motion.div
    key={collection.id}
    initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{
      duration: 0.7,
      delay: index * 0.12,
      ease: [0.22, 1, 0.36, 1]
    }}
  >
```

### Effect 4 — Full-Bleed Wedding Photo with Forest Overlay
```tsx
<section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">
  {/* Image: breathtaking floral arch installation at a wedding ceremony — lush white and blush florals, greenery cascading down, golden hour light, romantic venue, couple in soft focus background */}
  <img src="" alt="Wild Bloom Co. wedding floral arch" className="w-full h-full object-cover object-center absolute inset-0" />
  <div
    className="absolute inset-0"
    style={{ background: 'linear-gradient(to right, rgba(45,90,61,0.88) 0%, rgba(45,90,61,0.6) 50%, transparent 100%)' }}
  />
  <div className="relative z-10 px-8 md:px-16 max-w-xl">
    {/* Wedding inquiry content */}
  </div>
</section>
```

### Effect 5 — Fixed Subtle Texture Overlay
```tsx
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
        opacity: 0.03,
      }}
    />
  )
}
```

## 6. Component Breakdown

### 6.1 Navbar
```tsx
// Fixed, top-0, z-40, w-full
// Height: h-18 (72px)
// Background: transparent → var(--background)/95 backdrop-blur-sm after 60px scroll
// Layout: px-8 md:px-16, flex items-center justify-between
// Left: leaf icon + "WILD BLOOM CO." — Jost 500, letter-spacing 0.2em, uppercase, 0.875rem, text-primary
// Center (desktop): nav links ["Shop", "Collections", "Weddings", "About", "Contact"]
//   Jost 400, 0.85rem, gap-8, text-foreground/60, hover text-primary, transition 0.2s
// Right: "Shop Now" button — bg-primary, text-white, px-5 py-2.5, Jost 500, 0.8rem, rounded-none (sharp, editorial)
// Mobile: hide links, show hamburger icon (Leaf + wordmark stays)
```

### 6.2 Hero Section
```tsx
// min-h-screen, relative, overflow-hidden
// Full-bleed lush bouquet photo
// Forest green gradient overlay on left
// Floating petal animation (above image, below content)
// Content: left side, z-20, flex flex-col justify-center, max-w-xl
//   - Eyebrow: "LUXURY FLORAL STUDIO" — Jost 500, 0.7rem, letter-spacing 0.3em, uppercase, text-white/60, mb-5
//   - H1: Cormorant Garamond Italic, clamp(3rem, 6vw, 5.5rem), text-white, line-height 1.02, mb-6
//   - Subtext: Jost 300, 1.1rem, text-white/75, line-height 1.8, mb-8, max-w-md
//   - CTA buttons: flex gap-4
//     Primary: "Shop the Collection" — bg-secondary (dusty rose), text-white, px-8 py-4, Jost 500, 0.875rem
//     Secondary: "Book Wedding Florals" — border border-white/60, text-white, px-8 py-4, Jost 400
```

### 6.3 Collections Section
```tsx
// py-24 px-8 md:px-16
// Centered header:
//   - Eyebrow: "EXPLORE" — Jost 500, 0.7rem, letter-spacing 0.3em, text-secondary
//   - H2: Cormorant Garamond, 3rem, text-foreground, mb-4
//   - Subtext: Jost 300, 1rem, text-muted-foreground, mb-16
// Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4, gap-6
// Each collection card (stagger entrance):
//   - Image: full-width, aspect-[4/5], object-cover, overflow-hidden
//   - Image overlay on hover: forest green tint 0→0.4, transition 0.4s
//   - Below image: collection name, Cormorant Garamond 500, 1.3rem + desc line + "Shop Now →" link
// Collection image descriptions:
// {/* Image: stunning bridal bouquet — white garden roses, lily of the valley, trailing greenery, white ribbon, bridal hands holding */}
// {/* Image: everyday mixed bouquet — colorful seasonal flowers, cheerful arrangement, kraft paper wrap, bright studio light */}
// {/* Image: seasonal autumn arrangement — dahlias, dried grasses, deep rust and burgundy tones, moody editorial lighting */}
// {/* Image: custom luxury flower arrangement in ceramic vase — bespoke, architectural, award-winning florist style */}
```

### 6.4 Bestsellers / Product Grid
```tsx
// py-24 px-8 md:px-16, bg-card (very light blush-white)
// Header: flex justify-between items-end, mb-12
//   H2: Cormorant Garamond, 2.5rem + "View All →" dusty rose link
// Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-6, gap-6
// Wait — 6 products but 6 columns on lg is too tight. Use: grid-cols-2 md:grid-cols-3 lg:grid-cols-3, gap-8 (6 products = 2 rows)
// Each product card (see Effect 2 — box shadow bloom):
//   - Image: aspect-[3/4], object-cover, object-center
//   - Product name: Cormorant Garamond 500, 1.1rem, mt-4, mb-1
//   - Desc: Jost 300, 0.85rem, text-muted-foreground, mb-3
//   - Price: Cormorant Garamond 400, 1.3rem, text-foreground
//   - "Add to Cart" button: border border-primary text-primary hover:bg-primary hover:text-white, px-4 py-2, Jost 500, 0.75rem, mt-3, transition 0.2s

// Product image descriptions:
// {/* Image: classic round peony bouquet — blush pink, cream, soft green filler, white paper wrap, overhead flat-lay perspective */}
// {/* Image: garden-gathered wildflower bunch — sweet peas, cosmos, clematis vine, loose and romantic, tied with twine */}
// {/* Image: elegant lily and eucalyptus arrangement in forest green vase, minimal and architectural, white studio bg */}
// {/* Image: subscription mystery box of seasonal blooms — wrapped in tissue, ribbon, with handwritten note card */}
// {/* Image: single long-stem garden rose — deep blush/dusty pink, dew drops on petals, black background, editorial close-up */}
// {/* Image: dried flower crown — pampas grass, everlasting, strawflower, lavender, laid flat on linen */}
```

### 6.5 How It Works
```tsx
// py-24 px-8 md:px-16
// Centered heading: "How It Works" — Cormorant Garamond, 2.5rem, mb-16
// 3 steps: grid-cols-1 md:grid-cols-3, gap-12, items-start
// Each step:
//   - Step number: "01" "02" "03" — Cormorant Garamond Italic, 4rem, text-secondary/30, mb-2
//   - Icon: lucide, 28px, text-primary, mb-4
//   - Title: Cormorant Garamond 600, 1.4rem, text-foreground, mb-3
//   - Desc: Jost 300, 0.95rem, text-muted-foreground, line-height 1.8
// Dividers between steps (desktop): vertical hairlines, border-secondary/20
```

### 6.6 About Section
```tsx
// py-24 px-8 md:px-16
// Layout: grid grid-cols-1 lg:grid-cols-2, gap-20, items-center
// Left (text):
//   - Eyebrow: "OUR STORY"
//   - H2: Cormorant Garamond Italic, 3rem, mb-6
//   - Body: 2 paragraphs, Jost 300, 1rem, line-height 1.85, text-muted-foreground
//   - Pull quote: Cormorant Garamond Italic, 1.3rem, border-l-4 border-secondary, pl-5, my-8
//   - Stats: 3 stats — Jost 500, large number + label
// Right (photo):
//   {/* Image: florist founder at workbench arranging flowers — close-up of hands working with stems and blooms, morning light streaming through window, warm and artisanal atmosphere, soft editorial style */}
//   <img src="" alt="Wild Bloom Co. founder arranging flowers" className="w-full h-[580px] object-cover object-center rounded-sm" />
```

### 6.7 Weddings Section
```tsx
// Full-bleed wedding photo section (see Effect 4)
// min-h-[65vh], relative, overflow-hidden
// Forest green gradient left overlay
// Left content (max-w-lg):
//   - Eyebrow: "WEDDING FLORALS" — Jost 500, 0.7rem, letter-spacing 0.3em, text-white/60, mb-4
//   - H2: Cormorant Garamond Italic, clamp(2.5rem, 5vw, 4rem), text-white, mb-5
//   - Body: Jost 300, 1rem, text-white/75, mb-8
//   - CTA: "Start Your Wedding Inquiry" — bg-secondary text-white, px-8 py-4, Jost 500, 0.875rem
//   - Secondary: "See Wedding Portfolio →" link, text-white/70
```

### 6.8 Testimonials
```tsx
// py-24 px-8 md:px-16, bg-card
// Centered heading: Cormorant Garamond Italic, 2.5rem, mb-16
// Grid: grid-cols-1 md:grid-cols-3, gap-8
// Each card: bg-white, p-8, rounded-sm
//   - Quotation mark: Cormorant Garamond, 5rem, text-secondary/25, leading-none, mb-2
//   - Quote: Cormorant Garamond Italic, 1.05rem, line-height 1.85, text-foreground/80, mb-6
//   - Stars: 5 × ★, text-secondary, mb-4, font-size 0.9rem
//   - Author: Jost 500, 0.9rem + event/occasion: Jost 300, 0.8rem, text-muted-foreground
```

### 6.9 Local Delivery Section
```tsx
// py-24 px-8 md:px-16
// Layout: grid grid-cols-1 lg:grid-cols-2, gap-16, items-center
// Left (card):
//   - bg-primary (forest green), text-white, p-10, rounded-sm
//   - Icon: MapPin, 32px, white/70, mb-4
//   - H3: Cormorant Garamond, 2rem, text-white, mb-4
//   - Coverage list: Jost 300, 0.9rem, text-white/75, line-height 2.2 — list of neighbourhoods
//   - CTA: bg-white text-primary, mt-6, px-6 py-3, Jost 500
// Right (info):
//   - H3: "Order Deadlines" — Cormorant Garamond, 2rem, mb-6
//   - Info rows: icon + info line, Jost 300, 0.95rem, text-foreground, line-height 2.5
//   - Note: Jost 300, 0.85rem, text-muted-foreground, italic, mt-4
```

### 6.10 Footer
```tsx
// py-16 px-8 md:px-16, bg-foreground (#1f3a28 — deep forest), text-white
// Top: grid grid-cols-2 md:grid-cols-4, gap-10, pb-12, border-b border-white/10
//   Col 1: Logo leaf + wordmark + "Flowers Rooted in Intention" tagline + social icons
//   Col 2: Shop — All Flowers, Bouquets, Arrangements, Subscriptions, Gifts, Dried Flowers
//   Col 3: Services — Weddings, Events, Same-Day Delivery, Custom Orders, Corporate
//   Col 4: Info — About, Delivery Coverage, Order Deadlines, Care Guide, Contact
// Bottom: pt-8, flex justify-between
//   Copyright: Jost 300, 0.75rem, text-white/30
//   Links: Privacy · Terms · Instagram
```

## 7. Animations

### Petal particles
```tsx
// y: '0px' → '110vh', rotate 0 → 180-360°, x: slight sway
// duration: 6–10s per petal (random)
// delay: 0–4s (random stagger)
// repeat: Infinity, ease: 'linear'
// 14 petals total
```

### Hero text entrance
```tsx
// Eyebrow: delay 0.2s, opacity 0→1, y 10→0
// H1: delay 0.4s, opacity 0→1, y 40→0, filter blur(10px)→blur(0)
// Subtext: delay 0.65s, opacity 0→1
// CTAs: delay 0.85s, opacity 0→1, y 15→0
// All: duration 0.8s, ease [0.22, 1, 0.36, 1]
```

### Collection cards scroll entrance
```tsx
// stagger index * 0.12s
// initial: opacity 0, y 50, filter blur(8px)
// whileInView: opacity 1, y 0, filter blur(0)
// viewport: once true, margin -60px
```

### Product card hover
```tsx
// boxShadow: 0 8px 40px rgba(212,144,122,0.35)
// y: 0 → -4
// Image inside: scale 1 → 1.06
// transition: 0.35s ease [0.22, 1, 0.36, 1]
```

### How It Works step numbers
```tsx
initial={{ opacity: 0, x: -20 }}
whileInView={{ opacity: 1, x: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, delay: index * 0.2 }}
```

### Testimonial cards
```tsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, delay: index * 0.15 }}
```

### Navbar scroll
```tsx
// 60px threshold: bg-transparent → bg-[#fdf0ec]/95 backdrop-blur-sm
// transition: all 300ms ease
```

## 8. Responsive

### Mobile (< 768px)
- Navbar: leaf + wordmark (small), hamburger; full-screen forest green overlay
- Hero: H1 clamp(2.8rem, 8vw, 3.5rem), single column; petals still float (reduce count to 8)
- CTAs: stacked, full-width on mobile
- Collections: 1 column (2 on sm), stacked
- Bestsellers: 2 columns on mobile, 3 on md
- How It Works: single column, step numbers left-aligned
- About: photo top (full-width), text below
- Weddings: centered text over dark overlay, CTAs full-width
- Testimonials: 1 column, stacked
- Local delivery: stacked, card first
- Footer: 2 column top, single bottom

### Desktop (>= 1024px)
- Navbar: full horizontal nav + CTA
- Hero: 2 implied zones (text left, photo right; single full-bleed with overlay)
- Collections: 4 columns
- Bestsellers: 3 columns × 2 rows
- How It Works: 3 columns horizontal
- About: 2 equal columns
- Weddings: full-bleed with left text content
- Testimonials: 3 columns
- Local delivery: 2 columns
- Footer: 4 columns

## 9. Full Copy

### Brand Name
Wild Bloom Co.

### Navbar
- Logo text: WILD BLOOM CO.
- Links: Shop · Collections · Weddings · About · Contact
- CTA: Shop Now

### Hero
- Eyebrow: LUXURY FLORAL STUDIO
- H1: Flowers Rooted in Intention.
- Subtext: Arrangements for moments that matter. Every stem is chosen with care. Every bouquet is made to move you.
- Primary CTA: Shop the Collection
- Secondary CTA: Book Wedding Florals

### Collections Section
- Eyebrow: EXPLORE
- H2: Arrangements for Every Moment
- Subtext: From intimate everyday gestures to breathtaking wedding installations — find the perfect arrangement.
- **Collection 1 — Wedding**
  - Desc: Bespoke bridal bouquets, ceremony arches, and reception florals designed for the most important day of your life.
  - CTA: Explore Wedding →
- **Collection 2 — Everyday**
  - Desc: Seasonal, thoughtfully arranged blooms to brighten any space or become the perfect same-day gift.
  - CTA: Shop Everyday →
- **Collection 3 — Seasonal**
  - Desc: Limited-edition arrangements built around what's fresh, local, and in peak season — never generic, always alive.
  - CTA: Shop Seasonal →
- **Collection 4 — Custom**
  - Desc: Your vision, our hands. Tell us the occasion, the palette, the feeling — we'll create something entirely your own.
  - CTA: Inquire Custom →

### Bestsellers Section
- H2: Our Bestsellers
- Link: View All →
- **Product 1 — Blush Garden Peony Bouquet**
  - Desc: Lush blush peonies with soft greenery, wrapped in tissue
  - Price: £65
- **Product 2 — Wild Gathered Wildflower Bunch**
  - Desc: Loose, romantic seasonal wildflowers tied with natural twine
  - Price: £38
- **Product 3 — Lily & Eucalyptus Arrangement**
  - Desc: Minimal yet striking — in your choice of forest green or white vase
  - Price: £75
- **Product 4 — The Bloom Box**
  - Desc: Monthly or seasonal subscription — curated, seasonal, delivered to your door
  - Price: From £52 / delivery
- **Product 5 — Single-Stem Garden Rose**
  - Desc: One perfect stem. Ideal for a note, a moment, an apology, or a Tuesday.
  - Price: £12
- **Product 6 — Dried Flower Crown**
  - Desc: Pampas, strawflower, lavender — an heirloom piece for weddings, shoots, or home décor
  - Price: £45

### How It Works
- Heading: How It Works
- **Step 1 — Order**
  - Icon: ShoppingBag
  - Title: Choose Your Arrangement
  - Desc: Browse our collections, select your occasion, and choose your preferred delivery date. Ordering takes under two minutes.
- **Step 2 — We Arrange**
  - Icon: Scissors
  - Title: We Hand-Craft Your Bouquet
  - Desc: Every arrangement is made fresh by our studio team on the morning of your delivery. No pre-made batches. Ever.
- **Step 3 — We Deliver**
  - Icon: Truck
  - Title: Delivered to Your Door
  - Desc: Same-day delivery across our coverage area for orders placed before 11am. Next-day slots available seven days a week.

### About Section
- Eyebrow: OUR STORY
- H2: Born from a love of flowers — and the moments they belong to.
- Para 1: Wild Bloom Co. started in a small studio on the edge of the market district, with a borrowed van, a wholesale flower account, and an obsession with making arrangements that actually felt like something.
- Para 2: We don't do generic. Every bouquet we make is built around a feeling — the right stems, the right palette, the right proportions. We source locally where we can, seasonally always.
- Pull quote: "Every stem is chosen with care. Every bouquet is made to move you."
- Stats: 6 Years · 4,200+ Bouquets Made · 98% Same-Day Delivery Rate

### Weddings Section
- Eyebrow: WEDDING FLORALS
- H2: Your Most Beautiful Day, in Flowers.
- Body: From bridal bouquets and ceremony arches to reception centrepieces and flower walls — we design wedding florals that feel personal, lush, and entirely yours. We take on a limited number of weddings per season to ensure every bride gets our full attention.
- Primary CTA: Start Your Wedding Inquiry
- Secondary: See Wedding Portfolio →

### Testimonials Section
- Heading: Made with Care. Received with Joy.
- **Quote 1**
  - Text: "I've ordered from Wild Bloom for every birthday, anniversary, and apology in my relationship for the last three years. They have never once disappointed. The peonies especially are extraordinary."
  - Author: Charlotte R. · Regular customer
- **Quote 2**
  - Text: "Our wedding florals were beyond what I could have imagined. The ceremony arch alone made our guests gasp. Wild Bloom understood our aesthetic immediately and brought it to life perfectly."
  - Author: Sophie & James · Wedding, June 2024
- **Quote 3**
  - Text: "I ordered a last-minute sympathy bouquet and it arrived within hours, beautifully arranged and with a handwritten note included. The care in this business is real. You can feel it."
  - Author: Amelia W. · London

### Local Delivery Section
- Card heading: We Deliver to Your Door
- Coverage list: Marylebone · Notting Hill · Chelsea · Mayfair · Kensington · Fulham · Clapham · Battersea · Brixton · Peckham · Borough · Bermondsey · Shoreditch · Islington · Hackney
- Card CTA: Check Your Postcode
- Info heading: Order Deadlines
- Info rows:
  - Same-Day Delivery: Order before 11:00am, Monday–Saturday
  - Next-Day Delivery: Order by 4:00pm any day of the week
  - Wedding Orders: Minimum 6 weeks in advance for full service
  - Custom Arrangements: 5 days advance notice requested
- Note: "Not in our coverage area? We can arrange courier delivery for an additional fee — contact us to discuss."

### Footer
- Tagline: Flowers Rooted in Intention
- Shop: All Flowers · Bouquets · Arrangements · Subscriptions · Gifts · Dried Flowers
- Services: Weddings · Events · Same-Day Delivery · Custom Orders · Corporate
- Info: About · Delivery Coverage · Order Deadlines · Care Guide · Contact
- Visit: Studio — 7 Market Lane, London SE1 (walk-in by appointment only) · Mon–Sat 8am–6pm · hello@wildbloomco.com
- Copyright: © 2025 Wild Bloom Co. All rights reserved.

## 10. Key Dependencies
```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.462.0",
  "@radix-ui/react-dialog": "^1.1.0",
  "@radix-ui/react-select": "^2.1.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.3.0"
}
```
