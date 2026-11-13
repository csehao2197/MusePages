# Ember & Stone — Fine Dining Restaurant Website Prompt

## 1. Goal Statement
Build a dark, editorial fine dining restaurant website for **Ember & Stone**, a premium steakhouse brand defined by cinematic warmth, artisanal craft, and a confident, no-fluff aesthetic.

---

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react
```

---

## 3. Design System — Colors

```css
:root {
  --background: hsl(24, 30%, 4%);         /* #0d0905 deep espresso */
  --foreground: hsl(40, 33%, 91%);        /* #f5f0e8 off-white */
  --primary: hsl(37, 55%, 51%);           /* #c9973e warm amber/gold */
  --primary-foreground: hsl(24, 30%, 4%); /* #0d0905 */
  --muted-foreground: hsl(40, 15%, 60%);  /* muted warm grey */
  --border: hsl(37, 40%, 25%);            /* dark amber border */
  --card: hsl(24, 28%, 7%);               /* slightly lighter card bg */
  --accent: hsl(37, 55%, 51%);            /* same as primary — gold */
}
```

---

## 4. Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap" rel="stylesheet" />
```

- **H1 / H2 headings:** `font-family: 'Cormorant Garamond', serif;` weight 300–600, letter-spacing: 0.04em
- **H3 / subheadings:** `font-family: 'Cormorant Garamond', serif;` italic, weight 400
- **Body / paragraphs:** `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;` weight 300–400, letter-spacing: 0.01em, line-height: 1.7
- **Navigation / UI labels:** `font-family: 'Helvetica Neue', sans-serif;` uppercase, letter-spacing: 0.15em, size: 11–12px, weight 400
- **Menu prices / accent text:** Cormorant Garamond italic, gold color (#c9973e)

---

## 5. Visual Effects

### Effect 1 — Full-Screen Looping Video Hero
```jsx
<section className="relative h-screen w-full overflow-hidden">
  {/* Video: chef hands plating a steak dish in cinematic slow motion, warm amber kitchen lighting, bokeh background, dark steakhouse kitchen atmosphere */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover object-center z-0 scale-110"
  />
  {/* Top gradient fade */}
  <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(13,9,5,0.6) 0%, transparent 30%, transparent 60%, rgba(13,9,5,0.95) 100%)' }} />
  {/* Left-side text gradient */}
  <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(13,9,5,0.85) 0%, rgba(13,9,5,0.4) 50%, transparent 100%)' }} />
  {/* Hero content sits at z-20 */}
</section>
```

### Effect 2 — Fine Grain Paper Texture Overlay
```jsx
{/* Fixed texture overlay — grain paper, mix-blend-mode overlay */}
<div
  className="fixed inset-0 z-50 pointer-events-none"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
    opacity: 0.4,
    mixBlendMode: 'overlay',
  }}
/>
```

### Effect 3 — Animated Gold Underline on Section Headers
```tsx
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

function GoldUnderlineHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <div ref={ref} className="relative inline-block">
      <h2 className="text-4xl md:text-6xl font-light tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--foreground)' }}>
        {children}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ originX: 0, backgroundColor: 'var(--primary)', height: '1px', width: '100%', marginTop: '8px' }}
      />
    </div>
  );
}
```

### Effect 4 — Staggered Menu Item Reveal on Scroll
```tsx
const menuItems = [...]; // array of menu items

function MenuGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-px border border-[var(--border)]">
      {menuItems.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="p-8 border-b border-[var(--border)] hover:-translate-y-0.5 transition-transform duration-300 cursor-default"
        >
          {/* card content */}
        </motion.div>
      ))}
    </div>
  );
}
```

### Effect 5 — Glassmorphism Reservation Card
```tsx
<div
  className="relative rounded-sm overflow-hidden p-px"
  style={{
    background: 'linear-gradient(135deg, rgba(201,151,62,0.5), rgba(201,151,62,0.05) 50%, rgba(201,151,62,0.2))',
  }}
>
  <div
    className="rounded-sm p-8 md:p-12"
    style={{
      background: 'rgba(13,9,5,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}
  >
    {/* Reservation form content */}
  </div>
</div>
```

---

## 6. Component Breakdown

### Section 1 — Navbar
- **Height:** 80px desktop / 64px mobile
- **Position:** `fixed top-0 left-0 right-0 z-40`
- **Default state:** fully transparent, logo in off-white, nav links in small-caps gold
- **Scrolled state (>80px):** `background: rgba(13,9,5,0.95)`, `backdrop-filter: blur(12px)`, thin gold bottom border (1px)
- **Left:** Wordmark "EMBER & STONE" in Cormorant Garamond, size 18px, letter-spacing 0.2em
- **Center (desktop):** Nav links — "Menu" / "Philosophy" / "Private Dining" / "Reserve"
- **Right:** "Reserve a Table" — gold outlined button, 11px uppercase, letter-spacing 0.15em
- **Mobile:** hamburger icon (3 lines, gold), full-screen overlay menu with staggered link entrance

### Section 2 — Hero
- **Height:** 100vh
- **Background:** Full-screen looping video (see Effect 1) + texture overlay
- **Layout:** Content centered bottom-left, `absolute bottom-16 left-8 md:left-16 z-20`
- **Content:**
  - Eyebrow label: "EST. 2019 — CHICAGO, IL" in tiny caps, gold, letter-spacing 0.3em
  - H1: "Where Fire\nMeets Finesse" — Cormorant Garamond light, size 72px–120px responsive, off-white, italic on "Meets Finesse"
  - Subline: "A steakhouse built on craft, fire, and a reverence for the ingredient."
  - CTA buttons row: Primary — "Reserve Your Table" (gold filled), Secondary — "View the Menu" (ghost border off-white)
- **Scroll indicator:** animated downward arrow in gold at bottom-center

### Section 3 — Philosophy
- **Layout:** 2-col split, `grid grid-cols-1 md:grid-cols-2 gap-0`
- **Left col:** Dark background, padding 80px 64px, text content
- **Right col:** Full-bleed image, no padding
  ```jsx
  {/* Image: aged cast iron skillet with dry-aged ribeye steak searing, dramatic side lighting, smoke rising, dark moody kitchen background, food photography editorial style */}
  <img src="" alt="Dry-aged ribeye steak searing in cast iron, moody kitchen lighting" className="w-full h-full object-cover object-center" />
  ```
- **Text content:** GoldUnderlineHeading "Our Philosophy", paragraph copy below

### Section 4 — Menu
- **Padding:** `py-24 px-6 md:px-16`
- **Background:** `--background`
- **Structure:** Tab navigation (Starters / Mains / Desserts / Drinks) in gold small-caps, content grid below
- **Grid:** 2-column on desktop, 1-column on mobile
- **Cards:** borderless, each item = `flex justify-between items-start py-5 border-b border-[var(--border)]`
- **Each menu item:** name (Cormorant, 20px) + description (Helvetica Neue 300, muted, 14px) left, price (Cormorant italic gold, 18px) right
- **Hover:** subtle `-translate-y-0.5` lift, 300ms ease

### Section 5 — Chef Feature
- **Layout:** Full-bleed image, `h-[70vh]` relative, content overlaid bottom-left
- **Image:**
  ```jsx
  {/* Image: executive chef in pristine white coat, standing in professional kitchen, arms crossed, confident expression, warm amber overhead lighting, bokeh kitchen background, editorial portrait photography */}
  <img src="" alt="Executive chef portrait in professional kitchen" className="w-full h-full object-cover object-center" />
  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,9,5,0.92) 0%, rgba(13,9,5,0.75) 45%, transparent 100%)' }} />
  ```
- **Content:** positioned `absolute bottom-16 left-8 md:left-16 z-10`
  - Label: "EXECUTIVE CHEF"
  - Name: "Marcus DeLeon" (large, Cormorant)
  - 2-sentence bio

### Section 6 — Private Dining
- **Background:** dark card `--card`
- **Border:** 1px `--border` (gold-tinted dark)
- **Layout:** centered text, max-width 700px, with full-bleed background image dimmed
  ```jsx
  {/* Image: private dining room with long dark wood table set for 10, white taper candles, crystal glassware, warm amber ceiling lighting, intimate upscale atmosphere */}
  <img src="" alt="Private dining room with candlelit long table" className="w-full h-full object-cover object-center" />
  ```
- **Gradient overlay:** `background: linear-gradient(to right, rgba(13,9,5,0.92) 0%, rgba(13,9,5,0.75) 45%, transparent 100%);`
- **CTA:** gold filled button "Inquire About Private Dining"

### Section 7 — Testimonials
- **Layout:** single centered column, max-width 640px, auto-advancing quote slider (5s interval)
- **Quote style:** Cormorant Garamond italic, 28px, off-white
- **Attribution:** small-caps Helvetica Neue, gold, 11px
- **Dot navigation:** 3 small gold dots below

### Section 8 — Reservations
- **Background:** Very dark bg with subtle noise texture
- **Card:** glassmorphism (see Effect 5), max-width 600px, centered
- **Form fields:** Date picker, Time (dropdown), Party size (dropdown), Name, Phone, Email
- **Field style:** `background: rgba(255,255,255,0.04)`, gold bottom border 1px, label in small-caps 10px gold
- **Submit:** Full-width gold button "Confirm Reservation"
- **Note below button:** "Reservations are confirmed via phone. Walk-ins welcome at the bar."

### Section 9 — Footer
- **Background:** near-black `hsl(24,32%,3%)`
- **Top border:** 1px gold
- **Layout:** 4-col grid (desktop), stacked (mobile)
  - Col 1: Wordmark + tagline
  - Col 2: Navigation links
  - Col 3: Hours (Mon–Thu 5pm–10pm, Fri–Sat 5pm–11pm, Sun 5pm–9pm)
  - Col 4: Address + social icons (Instagram, Facebook)
- **Bottom strip:** copyright + "Crafted with care in Chicago"

---

## 7. Animations

### Navbar Transition
- `useEffect` scroll listener: add class `scrolled` at 80px
- CSS transition: `transition: background 0.4s ease, box-shadow 0.4s ease`

### Hero Entrance (staggered, on mount)
```tsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
};
```

### Menu Tab Switch
- `AnimatePresence` with `mode="wait"`, fade + slight Y shift (10px), duration 0.25s

### Chef Section Parallax
- `useScroll` + `useTransform` to shift image `y` from 0 to -60px as section scrolls through viewport

### Scroll-triggered reveals (all secondary sections)
- `useInView({ once: true, margin: '-100px' })`
- `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}`
- duration: 0.7s, ease: `[0.22, 1, 0.36, 1]`

### Quote Slider
- `setInterval` 5000ms auto-advance
- `AnimatePresence mode="wait"`: fade out (opacity 0, x -20) → fade in (opacity 1, x 0), duration 0.4s

### Hover States
- Menu cards: `transition: transform 0.3s ease` → `transform: translateY(-2px)`
- CTA buttons: `transition: background 0.2s ease, box-shadow 0.2s ease`; gold glow on hover: `box-shadow: 0 0 24px rgba(201,151,62,0.3)`

---

## 8. Responsive

### Mobile (< 768px)
- Navbar: hamburger icon, full-screen overlay menu, all links centered, font-size 32px Cormorant
- Hero: H1 font-size 52px, content `bottom-12 left-6`, CTA buttons stacked vertically
- Philosophy: single column, image on top (h-64), text below
- Menu: 1-column, tab scrolls horizontally with overflow-x
- Chef Feature: image height 50vh, content at bottom
- Private Dining: text overlaid bottom
- Reservations: form full-width, padding 24px
- Footer: stacked 1-column

### Tablet (768px–1024px)
- Navbar: full nav visible, smaller padding
- Hero: H1 72px
- Philosophy: 2-col maintained
- Menu: 2-col maintained

### Desktop (> 1024px)
- Hero: H1 96px–120px
- All grids at full width
- Footer 4-col

---

## 9. Full Copy

### Brand Name
**EMBER & STONE**

### Tagline
"Where Fire Meets Finesse"

### Navbar
- Menu
- Philosophy
- Private Dining
- Reserve
- [Button] Reserve a Table

### Hero Section
- Eyebrow: `EST. 2019 — CHICAGO, IL`
- H1: `Where Fire\nMeets Finesse`
- Subline: `A steakhouse built on craft, fire, and a reverence for the ingredient.`
- CTA Primary: `Reserve Your Table`
- CTA Secondary: `View the Menu`
- Scroll label: `Scroll to explore`

### Philosophy Section
- Heading: `Our Philosophy`
- Body paragraph 1: `Every dish that leaves our kitchen begins with a single question: does this do justice to what the land provided? We source exclusively from family-owned ranches, farms, and fisheries — partners we visit, not vendors we email.`
- Body paragraph 2: `Our wood-fired hearth burns white oak and cherry, chosen for the smoke profile they lend to each cut. Every dish is a conversation between heat, time, and restraint.`
- Body paragraph 3: `We don't over-garnish. We don't over-explain. We trust the ingredient — and we trust you.`

### Menu Section
- Section heading: `The Menu`
- Tab 1: `Starters`
- Tab 2: `Mains`
- Tab 3: `Desserts`
- Tab 4: `Drinks`

**Starters:**
1. Oysters on the Half Shell — *Six Pacific oysters, champagne mignonette, horseradish* — $22
2. Bone Marrow Custard — *Roasted marrow, brioche soldiers, micro herbs, fleur de sel* — $18
3. Wagyu Beef Tartare — *Hand-cut A5 wagyu, cured egg yolk, black truffle, grissini* — $28
4. Seared Foie Gras — *Brioche, sour cherry, candied walnut, aged balsamic* — $32
5. Lobster Bisque — *Maine lobster, brandy cream, tarragon oil, sourdough croutons* — $24
6. Ember Charcuterie Board — *House-cured meats, aged cheeses, pickles, honeycomb, grilled bread* — $38

**Mains:**
1. 40-Day Dry-Aged Ribeye (16oz) — *White oak-grilled, bone marrow butter, roasted garlic jus* — $78
2. Prime New York Strip (14oz) — *Truffle compound butter, crispy shallots, herb oil* — $68
3. Tomahawk for Two (32oz) — *Dry-aged 30 days, table-side carving, three sauces* — $155
4. Whole Roasted Duck — *Cherry gastrique, duck fat fingerlings, braised endive* — $62
5. Pan-Seared Halibut — *Champagne beurre blanc, saffron oil, charred leek, caperberries* — $54
6. Filet Mignon (8oz) — *Béarnaise, pomme purée, haricots verts* — $74

**Desserts:**
1. Valrhona Chocolate Fondant — *Salted caramel, vanilla bean ice cream* — $16
2. Crème Brûlée — *Classic Madagascar vanilla, caramelized sugar, seasonal berries* — $14
3. Cheese Selection — *Three aged cheeses, honeycomb, quince paste, walnut bread* — $22
4. Ember Apple Tarte Tatin — *Calvados caramel, crème fraîche, toasted almond* — $15

**Drinks:**
1. Old Fashioned — *Maker's Mark 46, Angostura, orange peel, Luxardo cherry* — $18
2. Ember Negroni — *Mancino Secco, Campari, Sipsmith gin, black walnut bitters* — $19
3. The Vine Sauvignon Blanc — *Marlborough, New Zealand, crisp, citrus-forward* — $16/glass
4. Château Pichon Baron 2016 — *Pauillac, Bordeaux — full-bodied, classic structure* — $28/glass

### Chef Feature Section
- Label: `EXECUTIVE CHEF`
- Name: `Marcus DeLeon`
- Bio: `Chef Marcus has spent two decades in Michelin-starred kitchens across Paris, Copenhagen, and New York before bringing his fire-forward philosophy to Chicago. At Ember & Stone, he leads a kitchen that believes cooking is an act of devotion — not decoration.`
- Quote: `"I cook the way I want to eat — honestly, without apology."`

### Private Dining Section
- Heading: `An Evening All Your Own`
- Subheading: `Private Dining at Ember & Stone`
- Body: `Our private dining room accommodates up to 22 guests, with a dedicated sommelier, custom menu development, and a team committed to making your event unforgettable. Available for corporate dinners, celebrations, and intimate gatherings.`
- CTA: `Inquire About Private Dining`
- Detail: `Capacity: 8–22 guests · Full AV available · Custom menus from $95pp`

### Testimonials Section
- Heading: `What Our Guests Say`

**Quote 1:**
> "The dry-aged ribeye was the best piece of beef I have eaten in this city — full stop. The service matched it every step of the way."
> — *James R., Chicago Tribune dining column*

**Quote 2:**
> "Ember & Stone walks the line between reverence and approachability perfectly. Not precious, not casual — just exactly right."
> — *Mariana V., Google Reviews, 5★*

**Quote 3:**
> "We hosted our entire board dinner here. Marcus himself came to the table, explained the menu, and made our guests feel like the only people in the room."
> — *Alicia W., Private Dining Guest*

### Reservations Section
- Heading: `Reserve Your Table`
- Subline: `We look forward to welcoming you.`
- Form labels: Date / Time / Party Size / Full Name / Phone Number / Email Address
- Time options: 5:00 PM / 5:30 PM / 6:00 PM / 6:30 PM / 7:00 PM / 7:30 PM / 8:00 PM / 8:30 PM / 9:00 PM
- CTA: `Confirm Reservation`
- Note: `Reservations confirmed via email and phone. Walk-ins always welcome at the bar.`

### Footer
- Col 1: EMBER & STONE / "Craft. Fire. Finesse." / Chicago, IL
- Col 2: Menu · Philosophy · Private Dining · Gift Cards · Careers
- Col 3: Hours: Mon–Thu 5pm–10pm / Fri–Sat 5pm–11pm / Sun 5pm–9pm / Bar opens at 4:30pm daily
- Col 4: 742 W Randolph Street, Chicago, IL 60661 / +1 312 555 0182 / info@emberandstone.com
- Bottom: © 2024 Ember & Stone. All rights reserved.

---

## 10. Key Dependencies

```json
{
  "motion": "^12.0.0",
  "lucide-react": "^0.460.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-select": "^2.1.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0"
}
```

**Tailwind config additions:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'ember-gold': '#c9973e',
        'ember-dark': '#0d0905',
        'ember-cream': '#f5f0e8',
      },
    },
  },
};
```
