# Ember & Ground — Coffee Shop Website Prompt
### websiteprompts.ai — Production-Ready for Lovable, Bolt, v0, Claude, Cursor

---

## 1. GOAL STATEMENT

Build a full-featured, moody specialty coffee shop website for **Ember & Ground** — an editorial, magazine-quality single-page experience that evokes warmth, craftsmanship, and the ritual of exceptional coffee, driving online orders and in-store visits.

---

## 2. TECH STACK

- **React 18 + Vite 5 + TypeScript**
- **Tailwind CSS v3** (JIT mode)
- **Framer Motion** — import exclusively from `motion/react`
- **shadcn/ui** — Tabs, Card, Badge components
- **lucide-react** — icons (Star, MapPin, Clock, Coffee, ChevronRight, Instagram)
- **Google Fonts** — Playfair Display + Plus Jakarta Sans

---

## 3. DESIGN SYSTEM

Add this to your global CSS (`index.css` or `globals.css`):

```css
:root {
  /* Core palette */
  --color-espresso:      12 9 7;        /* #0d0b09 — near-black background */
  --color-espresso-mid:  22 17 13;      /* #16110d — card backgrounds */
  --color-espresso-lift: 32 25 18;      /* #201912 — elevated surfaces */
  --color-amber:         212 137 42;    /* #d4892a — primary accent */
  --color-amber-light:   230 165 80;    /* #e6a550 — hover states */
  --color-amber-pale:    245 220 170;   /* #f5dcaa — muted amber */
  --color-cream:         245 237 224;   /* #f5ede0 — primary text on dark */
  --color-cream-muted:   200 185 165;   /* #c8b9a5 — secondary text */
  --color-cream-faint:   140 125 108;   /* #8c7d6c — placeholder text */

  /* Semantic tokens */
  --bg-page:             rgb(var(--color-espresso));
  --bg-card:             rgb(var(--color-espresso-mid));
  --bg-card-hover:       rgb(var(--color-espresso-lift));
  --text-primary:        rgb(var(--color-cream));
  --text-secondary:      rgb(var(--color-cream-muted));
  --text-muted:          rgb(var(--color-cream-faint));
  --accent:              rgb(var(--color-amber));
  --accent-hover:        rgb(var(--color-amber-light));
  --border-subtle:       rgba(var(--color-amber) / 0.15);
  --border-amber:        rgba(var(--color-amber) / 0.6);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-page);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}
```

---

## 4. TYPOGRAPHY

**Google Fonts import** — place in `<head>` or via `@import` at top of CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
```

**Usage rules:**

| Element | Font | Weight | Style | Size |
|---|---|---|---|---|
| All `<h1>` | Playfair Display | 700 | italic | clamp(48px, 7vw, 120px) |
| All `<h2>` | Playfair Display | 700 | italic | clamp(32px, 4vw, 64px) |
| `<h3>` subtitles | Playfair Display | 700 | italic | clamp(22px, 2.5vw, 36px) |
| Body copy | Plus Jakarta Sans | 300 | normal | 17px / 1.75 line-height |
| Labels, tags, nav | Plus Jakarta Sans | 600 | normal | 12–13px tracking-[0.1em] uppercase |
| Prices | Plus Jakarta Sans | 700 | normal | inherit size |
| Stats numbers | Playfair Display | 700 | italic | clamp(56px, 7vw, 96px) |
| Watermark | Playfair Display | 700 | italic | clamp(220px, 32vw, 480px) |

---

## 5. VISUAL EFFECTS

### Effect 1 — Animated SVG Steam (Signature Hero Element)

Three wavy vertical SVG paths rise above the headline in amber at 15% opacity. Each path uses `stroke` only (no fill), `strokeWidth="2"`, amplitude varies slightly per path. They animate upward with staggered timing using scaleY + translateY.

```tsx
// components/SteamAnimation.tsx
import { motion } from "motion/react";

const steamPaths = [
  "M0 60 Q8 45 0 30 Q-8 15 0 0",
  "M0 60 Q-6 45 0 30 Q6 15 0 0",
  "M0 60 Q10 45 0 30 Q-10 15 0 0",
];

export function SteamAnimation() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 flex gap-5 pointer-events-none">
      {steamPaths.map((d, i) => (
        <motion.svg
          key={i}
          width="20"
          height="64"
          viewBox="-12 -4 24 68"
          fill="none"
          initial={{ scaleY: 0.3, y: 20, opacity: 0 }}
          animate={{ scaleY: 1, y: -10, opacity: [0, 0.7, 0] }}
          transition={{
            duration: 2.4,
            delay: i * 0.4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
          style={{ originY: "bottom" }}
        >
          <path
            d={d}
            stroke="rgb(212 137 42)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      ))}
    </div>
  );
}
```

### Effect 2 — Background Watermark Text

Render "EMBER" in Playfair Display italic at `clamp(220px, 32vw, 480px)`, amber at 3% opacity, anchored to bottom-right of the hero section, bleeding off-screen to the right.

```tsx
<span
  aria-hidden="true"
  className="absolute bottom-0 right-0 select-none pointer-events-none font-playfair italic font-bold leading-none"
  style={{
    fontSize: "clamp(220px, 32vw, 480px)",
    color: "rgba(212, 137, 42, 0.03)",
    lineHeight: 0.85,
    transform: "translateX(15%)",
  }}
>
  EMBER
</span>
```

### Effect 3 — Staggered Entrance Blur

All section entry animations use a blur-and-fade pattern. Apply to section wrappers via `useInView` from `motion/react` + `motion.div`:

```tsx
const sectionVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};
```

### Effect 4 — Floating Specials Card (Hero Bottom-Left)

A glassmorphism card that scales in from 0.85 → 1 at 0.5s delay, positioned bottom-left of the hero:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.85, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
  className="absolute bottom-8 left-6 md:left-10 z-20"
>
  {/* Card content below */}
</motion.div>
```

### Effect 5 — Continuous Marquee

Info strip scrolls left at a constant speed. Use a doubled content block for seamless looping:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track {
  animation: marquee 40s linear infinite;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  width: max-content;
}
.marquee-track:hover {
  animation-play-state: paused;
}
```

### Effect 6 — Count-Up Stats on Scroll

Trigger once via `useInView`. Animate with a custom `useCountUp` hook using `requestAnimationFrame` and `easeOutCubic`:

```tsx
function useCountUp(target: number, duration = 1600, delay = 0): number {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}
```

---

## 6. COMPONENT BREAKDOWN

---

### SECTION 1 — NAVBAR

**Layout:** Fixed top, `backdrop-blur-md`, background `rgba(13, 11, 9, 0.85)`, border-bottom `rgba(212, 137, 42, 0.12)`. Height: 72px desktop / 64px mobile. z-50.

**Desktop structure (left → right):**
```
[Logo]   [spacer flex-1]   [Nav links × 4]   [gap-8]   [CTA Button]
```

**Logo:** "EMBER & GROUND" in Playfair Display italic, 22px, amber (`rgb(212,137,42)`). Track at 0.06em.

**Nav links** (Plus Jakarta Sans 600, 13px, tracking-[0.08em], uppercase, `var(--text-secondary)`, hover → amber, transition 200ms ease):
- Our Story
- Menu
- Drinks
- Find Us

**CTA Button:** "Order Online" — background amber, text espresso (#0d0b09), Plus Jakarta Sans 700, 13px uppercase tracking-[0.08em], px-5 py-2.5, border-radius 0 (sharp corners), hover: background `rgb(230,165,80)`, transition 200ms.

**Mobile:** Show hamburger icon (lucide `Menu`, 22px, cream). Drawer slides in from right, 100% viewport height, background `rgb(12,9,7)`, links stacked vertically at 18px each, py-5, border-b border-amber/10. Close icon (lucide `X`) top-right.

---

### SECTION 2 — HERO

**Container:** `relative min-h-screen overflow-hidden flex flex-col justify-end pb-20 px-6 md:px-20`

**Background image:**
```jsx
{/* Image: Moody specialty café interior — a barista's hands pouring latte art into a dark matte ceramic cup, steam rising visibly in warm golden morning light, dark atmospheric background, shallow depth of field, cinematic grain, amber and espresso tones, editorial photography */}
<img
  src=""
  alt="Barista pouring latte art at Ember & Ground café"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>
```

**Gradient overlays — two separate divs, both absolute inset-0:**
```tsx
{/* Layer 1: amber tint at top fading to transparent */}
<div className="absolute inset-0 z-[1]" style={{background: "linear-gradient(to bottom, rgba(120,70,10,0.35) 0%, transparent 45%)"}} />
{/* Layer 2: dark left-to-right + bottom overlay for text */}
<div className="absolute inset-0 z-[1]" style={{background: "linear-gradient(to bottom, transparent 30%, rgba(13,11,9,0.75) 65%, rgba(13,11,9,0.96) 100%)"}} />
```

**Content block (relative z-10, max-w-3xl):**
```
[SteamAnimation — positioned relative, inline above headline]
<h1 style={{ fontSize: "clamp(48px,7vw,120px)", fontFamily: "Playfair Display", fontStyle: "italic", fontWeight: 700, color: "rgb(245,237,224)", lineHeight: 1.05 }}>
  Coffee Worth Waking Up For.
</h1>
<p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 300, fontSize: "18px", lineHeight: "1.75", color: "rgb(200,185,165)", marginTop: "24px", maxWidth: "480px" }}>
  Specialty coffee, direct-trade beans, and craft drinks — served daily in the heart of Marlow.
</p>
[Button row, mt-10, gap-4, flex-wrap]:
  Button 1: "Explore Our Menu" — amber bg, espresso text, px-7 py-3.5, rounded-none, font-jakarta font-700 text-sm uppercase tracking-[0.08em]
  Button 2: "Visit Us" — transparent bg, border border-cream/40, cream text, same sizing, hover border-cream/80
```

**Floating "TODAY'S SPECIALS" card (absolute bottom-8 left-6 md:left-10, z-20):**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.85, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
  className="absolute bottom-8 left-6 md:left-10 z-20"
  style={{
    background: "rgba(13,11,9,0.72)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(212,137,42,0.3)",
    padding: "20px 24px",
    minWidth: "220px",
  }}
>
  <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 600, fontSize: "11px", letterSpacing: "0.12em", color: "rgb(212,137,42)", textTransform: "uppercase", marginBottom: "14px" }}>
    Today's Specials
  </p>
  {[
    { name: "Honey Lavender Latte", price: "£4.80" },
    { name: "Cold Brew Tonic",      price: "£4.20" },
    { name: "The Morning Cortado",  price: "£3.60" },
  ].map((item) => (
    <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
      <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: "13px", color: "rgb(245,237,224)" }}>
        {item.name}
      </span>
      <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: "13px", color: "rgb(212,137,42)", marginLeft: "16px" }}>
        {item.price}
      </span>
    </div>
  ))}
</motion.div>
```

**Watermark:** "EMBER" — `absolute bottom-0 right-0 pointer-events-none select-none`, z-[1], Playfair Display italic 700, `clamp(220px,32vw,480px)`, color `rgba(212,137,42,0.03)`, `translateX(15%)`, lineHeight 0.85.

---

### SECTION 3 — OUR STORY

**Layout:** Two-column CSS grid `grid-cols-1 md:grid-cols-2`, no gap, min-height 600px.

**Left column (text):** Background `rgb(22,17,13)`, padding `p-12 md:p-20`, flex flex-col justify-center.

```
Label: "SINCE 2019" — Plus Jakarta Sans 600, 11px, amber, uppercase, tracking-[0.12em], mb-4
H2: "Coffee Is Our Craft, Not Our Product." — Playfair Display 700 italic, clamp(32px,4vw,56px), cream
Divider line: width 40px, height 1px, background amber, mt-6 mb-8
P1 (font-jakarta font-300 text-[17px] leading-[1.75] text-cream-muted):
  "We started Ember & Ground with one conviction: great coffee requires obsessive attention at every step. From farm selection to final pour, nothing is left to chance."
P2 (same styles, mt-5):
  "Our beans travel from single-origin farms in Ethiopia, Colombia, and Guatemala — sourced through direct relationships with growers we've visited personally. Every roast is calibrated weekly. Every extraction is dialled in by hand."
CTA link (mt-8): "Read Our Full Story →" — font-jakarta font-600 text-sm text-amber hover:underline transition-all
```

Entry animation: x from -40 → 0, opacity 0→1, duration 800ms, delay 100ms, easeOut (triggered by scroll inView).

**Right column (image):** `relative overflow-hidden` — image fills full column.

```jsx
{/* Image: Aerial view of terraced coffee plantation — lush rows of deep green coffee plants curving across a steep hillside, morning mist rising from the valleys, warm golden sunlight catching the leaf tips, rich red-brown earth paths between rows, editorial travel photography, lush and cinematic */}
<img
  src=""
  alt="Single-origin coffee farm sourced by Ember & Ground"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>
<div className="absolute inset-0" style={{ background: "rgba(120,60,0,0.15)" }} />
```

Entry animation: x from +40 → 0, opacity 0→1, duration 800ms, delay 250ms, easeOut.

---

### SECTION 4 — COUNT-UP STATS STRIP

**Layout:** Full-width, background `rgb(22,17,13)`, border-y `1px solid rgba(212,137,42,0.12)`, py-16 px-6.

**4 stats in `flex flex-row justify-center flex-wrap gap-16 md:gap-24`:**

| Value | Suffix | Label |
|---|---|---|
| 12 | " Origins" | "Single-Origin Sources" |
| 3 | " Roasters" | "Partner Roasters" |
| 4.9 | "★" | "Google Rating" |
| — (static) | "Est. 2019" | "Founded" |

**Per-stat markup:**
```tsx
<div className="text-center">
  <p
    className="font-playfair italic font-bold leading-none"
    style={{ fontSize: "clamp(56px,7vw,96px)", color: "rgb(212,137,42)" }}
  >
    {countValue}{suffix}
  </p>
  <p className="mt-3 font-jakarta font-semibold text-xs uppercase tracking-[0.12em]"
     style={{ color: "rgb(200,185,165)" }}>
    {label}
  </p>
</div>
```

Count-up triggers once on scroll into view (use `useInView` with `once: true`). Stagger delays: 0ms, 200ms, 400ms, 600ms. Duration 1600ms each, easeOutCubic. "Est. 2019" renders static — no count-up.

Mobile: `grid grid-cols-2 gap-10`, py-12.

---

### SECTION 5 — THE MENU

**Layout:** Full-width, background `var(--bg-page)` (#0d0b09), pt-24 pb-20, px-6 md:px-20.

**Section header (centered, mb-14):**
```
Label: "WHAT WE SERVE" — 11px amber uppercase tracking-[0.12em] mb-4
H2: "The Menu." — Playfair Display 700 italic clamp(32px,4vw,64px) cream
Subline: "Seasonal. Considered. Worth the detour." — Jakarta Sans 300 17px cream-muted mt-3
```

**Tab navigation:** shadcn/ui `<Tabs defaultValue="espresso">`. Four triggers: `Espresso · Pour Over · Cold Brew · Food`.

Override shadcn Tabs styling with these Tailwind classes on `<TabsList>`:
```
className="bg-transparent border-b border-amber/15 rounded-none p-0 h-auto gap-0 w-full justify-start mb-10"
```

On each `<TabsTrigger>`:
```
className="rounded-none bg-transparent border-b-2 border-transparent pb-3 px-0 mr-10 font-jakarta font-semibold text-sm uppercase tracking-[0.1em] text-cream-muted data-[state=active]:text-amber data-[state=active]:border-amber data-[state=active]:bg-transparent shadow-none"
```

**Card grid per tab:** `grid grid-cols-1 md:grid-cols-2 gap-4`

**Per item card:**
```
background: rgb(22,17,13)
border: 1px solid rgba(212,137,42,0.1)
padding: p-6
border-radius: 0
Row: [name font-jakarta font-semibold text-base text-cream] [price font-jakarta font-bold text-base text-amber ml-auto]
Description: font-jakarta font-light text-sm text-cream-muted mt-2 leading-relaxed
```

Stagger entry animation on tab change + scroll inView: opacity 0→1, scale 0.95→1, y 20→0, 500ms, stagger 80ms each card.

**ESPRESSO (4 items):**
- Double Espresso · £2.80 · "Ristretto-style pull, 18g dose, 30ml extraction. Bright and syrupy."
- Flat White · £3.60 · "20cl, double ristretto, microfoam textured to silk. Our most-ordered drink."
- Cortado · £3.40 · "Equal parts espresso and steamed milk. Small, strong, precise."
- Cappuccino · £3.50 · "Third foam, third milk, third espresso. Dry or wet — just ask."

**POUR OVER (3 items):**
- Chemex Filter · £4.50 · "Single-origin Ethiopia Yirgacheffe. Floral, stone fruit, clean finish. Allow 6 minutes."
- V60 Seasonal · £4.20 · "Our rotating single-origin pick. Ask the bar what's pouring today."
- Aeropress Classic · £3.80 · "Full immersion, 2-minute steep. Rich body, low acidity, endlessly repeatable."

**COLD BREW (3 items):**
- 24-Hour Cold Brew · £4.20 · "Steeped 24 hours in filtered water. Served long over ice. Naturally sweet."
- Cold Brew Tonic · £4.60 · "Cold brew over tonic water and ice. Effervescent, refreshing, unexpected."
- Espresso Tonic · £4.40 · "Double espresso pulled over ice-cold tonic. Bittersweet and bright."

**FOOD (4 items):**
- Almond Croissant · £4.20 · "Twice-baked with frangipane. Flaky, buttery, genuinely dangerous."
- Avocado Toast · £7.50 · "Sourdough from Marlow Bakehouse, smashed avocado, lemon, chilli, sea salt."
- Seasonal Porridge · £5.80 · "Slow-cooked oats, seasonal fruit compote, toasted seeds, oat milk. Vegan."
- Cheese & Ham Toastie · £6.50 · "Comté and honey-glazed ham on sourdough. Pressed to order."

---

### SECTION 6 — SIGNATURE DRINKS

**Layout:** Background `rgb(22,17,13)`, py-24, px-6 md:px-20.

**Section header (left-aligned, max-w-lg, mb-14):**
```
Label: "CRAFT IN A CUP" — 11px amber uppercase tracking-[0.12em] mb-4
H2: "Our Signatures." — Playfair Display 700 italic clamp(32px,4vw,56px) cream
P: "Recipes developed in-house, refined over seasons, impossible to find elsewhere." — Jakarta Sans 300 17px cream-muted mt-4
```

**3 cards in `grid grid-cols-1 md:grid-cols-3 gap-6`:**

Each card structure:
```
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  style={{ background: "rgb(12,9,7)", border: "1px solid rgba(212,137,42,0.1)", borderRadius: 0 }}
>
  [Image container: aspect-ratio 4/3, overflow-hidden, relative]
    [On parent hover: border transitions to rgba(212,137,42,0.6), 300ms]
  [Content: p-6]
    [Badge chip: "SIGNATURE" or "SEASONAL" — font-jakarta font-semibold text-[10px] uppercase tracking-[0.1em], color amber, bg rgba(212,137,42,0.12), px-3 py-1, rounded-none, inline-block]
    [Name: font-jakarta font-bold text-lg cream mt-3]
    [Description: font-jakarta font-light text-sm cream-muted mt-2 leading-relaxed]
    [Price: font-jakarta font-bold text-base amber mt-4]
</motion.div>
```

**Card 1 — Honey Lavender Latte:**
```jsx
{/* Image: Close-up overhead shot of a honey lavender latte in a dark matte ceramic cup — pale golden honey drizzled in a spiral pattern over velvety microfoam, dried lavender sprig resting on the rim, dark slate background, soft directional side lighting, editorial food and beverage photography, warm tones */}
<img src="" alt="Honey Lavender Latte — Ember & Ground signature drink" className="w-full h-full object-cover object-center" />
```
- Badge: SIGNATURE
- Name: Honey Lavender Latte
- Desc: "House-infused lavender syrup, local wildflower honey, oat milk, double ristretto. Floral without being perfumey."
- Price: £4.80

**Card 2 — Cold Brew Tonic:**
```jsx
{/* Image: Overhead close-up of a cold brew tonic in a tall clear glass — deep amber cold brew layered below clear tonic water with visible effervescence rising, large clear ice cubes, thin lemon slice on the rim, dark textured background, studio-quality beverage photography, refreshing and editorial */}
<img src="" alt="Cold Brew Tonic — Ember & Ground seasonal drink" className="w-full h-full object-cover object-center" />
```
- Badge: SEASONAL
- Name: Cold Brew Tonic
- Desc: "24-hour cold brew concentrate cut with Fever-Tree Mediterranean tonic, fresh lemon, ice. Our summer bestseller."
- Price: £4.60

**Card 3 — The Morning Cortado:**
```jsx
{/* Image: Side-profile shot of an espresso being pulled — golden crema streaming into a white ceramic demitasse, dark moody background, motion blur on the liquid stream, warm amber studio lighting, shallow depth of field, dramatic and atmospheric coffee photography */}
<img src="" alt="The Morning Cortado — Ember & Ground espresso" className="w-full h-full object-cover object-center" />
```
- Badge: SIGNATURE
- Name: The Morning Cortado
- Desc: "Our house cortado — 20ml ristretto, 20ml steamed whole milk, no foam. Sharp. Focused. Essential."
- Price: £3.60

Entry animation (all 3 cards): opacity 0→1, y 40→0, 600ms, stagger 120ms, easeOut, triggered once on scroll inView.

---

### SECTION 7 — INFO MARQUEE STRIP

**Layout:** Full-width `overflow-hidden`, background `rgb(212,137,42)` (amber), py-5. No horizontal padding.

**Text style:** Plus Jakarta Sans 700, 13px, color `#0d0b09` (espresso), uppercase, tracking-[0.1em]. Separator " · " in espresso at 50% opacity.

**Implementation:** Render the string twice inside `.marquee-track` (inline-flex):

```tsx
const text = "Direct Trade Beans  ·  Seasonal Roasts  ·  Oat Milk Available  ·  Monday–Friday 7am–6pm  ·  Saturday 8am–5pm  ·  Sunday 9am–3pm  ·  Free WiFi  ·  Takeaway & Dine In  ·  ";

<div className="overflow-hidden py-5" style={{ background: "rgb(212,137,42)" }}>
  <div className="marquee-track">
    <span>{text}</span>
    <span aria-hidden="true">{text}</span>
  </div>
</div>
```

CSS:
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  animation: marquee 40s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
```

---

### SECTION 8 — TESTIMONIALS

**Layout:** Background `var(--bg-page)` (#0d0b09), py-24, px-6 md:px-20.

**Section header (centered, mb-16):**
```
Label: "WHAT PEOPLE SAY" — 11px amber uppercase tracking-[0.12em] mb-4
H2: "Regulars, Not Just Customers." — Playfair Display 700 italic clamp(28px,3.5vw,52px) cream
```

**3 cards in `grid grid-cols-1 md:grid-cols-3 gap-6`:**

Each card:
```
background: rgb(22,17,13)
border-left: 3px solid rgb(212,137,42)
padding: p-8
Stars row: flex gap-1, 5 × Star icon (lucide), size-3.5, fill amber stroke none, mb-5
Quote: font-jakarta font-light text-base cream italic leading-[1.75] mb-6
Author block:
  Name: font-jakarta font-semibold text-sm cream
  Detail: font-jakarta font-light text-xs cream-muted mt-1
```

Entry animation: opacity 0→1, y 32→0, 600ms, stagger 150ms each, easeOut, scroll inView once.

**Card 1:**
- Stars: 5
- Quote: "I've tried specialty coffee shops all over London and this is genuinely one of the best flat whites I've ever had. The oat milk game is on another level."
- Name: Rachel T.
- Detail: Regular since 2021

**Card 2:**
- Stars: 5
- Quote: "The Cold Brew Tonic is ridiculous. I came back three days in a row for it. The space is beautiful too — dark and warm and exactly what a coffee shop should feel like."
- Name: James K.
- Detail: Visited July 2024

**Card 3:**
- Stars: 5
- Quote: "They actually know where their beans come from. Asked the barista about the Ethiopia Yirgacheffe and got a five-minute lesson I didn't want to end. That's what specialty coffee is supposed to be."
- Name: Priya M.
- Detail: Local regular

---

### SECTION 9 — FOOTER

**Layout:** 4-column grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12`, background `rgb(12,9,7)`, border-top `1px solid rgba(212,137,42,0.12)`, pt-16 pb-10, px-6 md:px-20.

**Column 1 — Brand:**
```
Logo: "EMBER & GROUND" — Playfair Display italic 20px amber tracking-[0.06em]
P: "Specialty coffee, direct-trade beans, and craft drinks in Marlow, Buckinghamshire." — Jakarta Sans 300 14px cream-muted mt-4 max-w-xs leading-relaxed
Social row (mt-6, flex gap-4):
  Instagram icon (lucide, size-5, cream-muted, hover amber, transition 200ms)
  Twitter/X icon (lucide, size-5, same)
```

**Column 2 — Visit Us:**
```
Heading: "VISIT US" — Jakarta Sans 600 11px amber uppercase tracking-[0.12em] mb-4
Address block (Jakarta Sans 300 14px cream-muted leading-loose):
  14 West Street
  Marlow, SL7 2NB
  Buckinghamshire
Map placeholder (mt-5):
  div 200×120px, background rgb(22,17,13), border 1px solid rgba(212,137,42,0.2)
  Center text: "View on Google Maps →" — 12px amber Jakarta Sans 600
```

**Column 3 — Hours:**
```
Heading: "OPENING HOURS" — Jakarta Sans 600 11px amber uppercase tracking-[0.12em] mb-4
Mon–Fri:  7:00am – 6:00pm
Saturday: 8:00am – 5:00pm
Sunday:   9:00am – 3:00pm
Note: "Last orders 30 minutes before close" — 12px cream-faint italic mt-4
Font: Jakarta Sans 300 14px cream-muted leading-loose
```

**Column 4 — Explore:**
```
Heading: "EXPLORE" — Jakarta Sans 600 11px amber uppercase tracking-[0.12em] mb-4
Links (flex flex-col gap-3):
  Our Story / Full Menu / Signature Drinks / Order Online / Gift Cards / Careers
Font: Jakarta Sans 300 14px cream-muted hover:cream transition 200ms
```

**Footer bar (mt-12, pt-8, border-top rgba(212,137,42,0.08)):**
```
flex justify-between flex-wrap gap-4
Left: "© 2024 Ember & Ground. All rights reserved." — 12px cream-faint
Right: "Privacy Policy · Terms of Service" — 12px cream-faint hover:cream-muted
```

---

## 7. ANIMATIONS — COMPLETE SPECIFICATION

| Element | Initial | Final | Duration | Delay | Easing | Trigger |
|---|---|---|---|---|---|---|
| Navbar | opacity 0, y -10 | opacity 1, y 0 | 400ms | 0ms | easeOut | page load |
| Hero h1 | opacity 0, y 40, blur 12px | opacity 1, y 0, blur 0 | 900ms | 200ms | [0.25,0.1,0.25,1] | page load |
| Hero subline | opacity 0, y 24 | opacity 1, y 0 | 700ms | 500ms | easeOut | page load |
| Hero buttons | opacity 0, y 16 | opacity 1, y 0 | 600ms | 700ms | easeOut | page load |
| Steam path 1 | scaleY 0.3, y 20, opacity 0 | scaleY 1, y -10, opacity [0→0.7→0] | 2400ms | 0ms | easeInOut | infinite |
| Steam path 2 | scaleY 0.3, y 20, opacity 0 | scaleY 1, y -10, opacity [0→0.7→0] | 2400ms | 400ms | easeInOut | infinite |
| Steam path 3 | scaleY 0.3, y 20, opacity 0 | scaleY 1, y -10, opacity [0→0.7→0] | 2400ms | 800ms | easeInOut | infinite |
| Specials card | opacity 0, scale 0.85, y 20 | opacity 1, scale 1, y 0 | 600ms | 500ms | spring [0.34,1.56,0.64,1] | page load |
| Section headings | opacity 0, y 32, blur 8px | opacity 1, y 0, blur 0 | 700ms | 0ms | [0.25,0.1,0.25,1] | scroll inView once |
| Story left col | opacity 0, x -40 | opacity 1, x 0 | 800ms | 100ms | easeOut | scroll inView |
| Story right col | opacity 0, x +40 | opacity 1, x 0 | 800ms | 250ms | easeOut | scroll inView |
| Stats count-up | 0 | target | 1600ms | 0/200/400/600ms stagger | easeOutCubic | scroll inView once |
| Menu cards | opacity 0, scale 0.95, y 20 | opacity 1, scale 1, y 0 | 500ms | 80ms stagger | easeOut | tab change + inView |
| Signature cards | opacity 0, y 40 | opacity 1, y 0 | 600ms | 120ms stagger | easeOut | scroll inView |
| Signature hover | scale 1, border amber/10 | scale 1.02, border amber/60 | 300ms | — | easeOut | hover |
| Testimonial cards | opacity 0, y 32 | opacity 1, y 0 | 600ms | 150ms stagger | easeOut | scroll inView |
| Marquee | continuous | continuous | 40s | 0ms | linear | autoplay, pause on hover |
| Nav links | color cream-muted | color amber | 200ms | — | easeOut | hover |
| Buttons | — | brightness +8%, scale 1.02 | 200ms | — | easeOut | hover |

---

## 8. RESPONSIVE DESIGN

### Desktop (≥1280px)
- Container: max-w-7xl mx-auto px-6 md:px-12 lg:px-20
- Hero: min-h-screen, content bottom-aligned with pb-20
- Our Story: 50/50 two-column grid, no gap, min-h-600px
- Stats: 4-column flex row, gap-24
- Menu: 2×2 card grid per tab
- Signature Drinks: 3-column grid
- Testimonials: 3-column grid
- Footer: 4-column grid

### Tablet (768px–1279px)
- Our Story: single column, image 360px height comes first, text below
- Stats: 2×2 grid, gap-10
- Menu: 2-column grid
- Signature Drinks: keep 3-column, reduce internal padding to p-4
- Testimonials: 2-column + 1 centered below
- Footer: 2×2 grid

### Mobile (<768px)
- Navbar: logo + hamburger, drawer from right
- Hero: headline clamp floor at 48px; specials card becomes a full-width strip at bottom of hero (not floating card), 1-column item list
- Our Story: 1-column, image 280px fixed height
- Stats: 2×2 grid, stat number clamp floor 48px
- Menu tabs: `overflow-x-auto flex gap-6 pb-2 scrollbar-hide` (horizontal scroll)
- Menu cards: 1-column
- Signature Drinks: 1-column stack
- Testimonials: 1-column stack
- Footer: 1-column, gap-10

---

## 9. FULL COPY

### Brand & Core
- **Name:** Ember & Ground
- **Tagline:** Coffee Worth Waking Up For.
- **Location:** 14 West Street, Marlow, SL7 2NB, Buckinghamshire
- **Phone:** 01628 477 212
- **Email:** hello@emberandground.co.uk

### Navigation
Our Story · Menu · Drinks · Find Us · Order Online

### Hero
- **H1:** Coffee Worth Waking Up For.
- **Subline:** Specialty coffee, direct-trade beans, and craft drinks — served daily in the heart of Marlow.
- **CTA 1:** Explore Our Menu
- **CTA 2:** Visit Us

### Specials Card
- Header: TODAY'S SPECIALS
- Honey Lavender Latte · £4.80
- Cold Brew Tonic · £4.20
- The Morning Cortado · £3.60

### Our Story
- **Label:** SINCE 2019
- **H2:** Coffee Is Our Craft, Not Our Product.
- **P1:** We started Ember & Ground with one conviction: great coffee requires obsessive attention at every step. From farm selection to final pour, nothing is left to chance.
- **P2:** Our beans travel from single-origin farms in Ethiopia, Colombia, and Guatemala — sourced through direct relationships with growers we've visited personally. Every roast is calibrated weekly. Every extraction is dialled in by hand.
- **Link:** Read Our Full Story →

### Stats
- 12 Origins · Single-Origin Sources
- 3 Roasters · Partner Roasters
- 4.9★ · Google Rating
- Est. 2019 · Founded

### Marquee
Direct Trade Beans · Seasonal Roasts · Oat Milk Available · Monday–Friday 7am–6pm · Saturday 8am–5pm · Sunday 9am–3pm · Free WiFi · Takeaway & Dine In ·

### Testimonials Header
- **Label:** WHAT PEOPLE SAY
- **H2:** Regulars, Not Just Customers.

### Footer
- **Tagline:** Specialty coffee, direct-trade beans, and craft drinks in Marlow, Buckinghamshire.
- **Copyright:** © 2024 Ember & Ground. All rights reserved.
- **Legal links:** Privacy Policy · Terms of Service

---

## 10. KEY DEPENDENCIES

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "motion": "^11.11.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.460.0",
    "@shadcn/ui": "latest"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47"
  }
}
```

**shadcn/ui components to install:**
```bash
npx shadcn@latest add tabs card badge
```

**Tailwind `fontFamily` extension (`tailwind.config.ts`):**
```ts
theme: {
  extend: {
    fontFamily: {
      playfair: ['"Playfair Display"', 'serif'],
      jakarta:  ['"Plus Jakarta Sans"', 'sans-serif'],
    },
  },
}
```

**Framer Motion import — always use this, never `framer-motion`:**
```tsx
import { motion, useInView, useAnimation, AnimatePresence } from "motion/react";
```
