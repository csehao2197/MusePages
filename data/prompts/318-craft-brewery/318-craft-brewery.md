# FORGE & GRAIN BREWING CO. — Craft Brewery Website Prompt

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS + Framer Motion (`motion/react`) + shadcn/ui + lucide-react  
**Niche:** Craft Brewery with Taproom — Sheffield

---

## Design System

### Colors (HSL in :root CSS custom properties)

```css
:root {
  --background: 30 7% 7%;           /* dark charcoal #141210 */
  --foreground: 40 70% 87%;         /* wheat cream #F0E6C8 */
  --primary: 32 62% 47%;            /* amber #C47D2E */
  --primary-foreground: 30 7% 7%;
  --secondary: 30 68% 31%;          /* deep copper #8A5A1A */
  --card: 30 7% 11%;                /* dark card #1D1B18 */
  --card-foreground: 40 70% 87%;
  --muted-foreground: 40 20% 55%;
  --border: 30 10% 18%;
  --muted: 30 7% 9%;
}
```

### Design Rationale

The colour system is intentionally warm rather than neutral-dark. The background at `30 7% 7%` is a near-black with a faint brown hue — the kind of colour you associate with old copper, scorched oak, or a well-seasoned cast iron pan. It is not the sterile black of a tech product. It is the dark of a converted forge at the end of the day. The amber primary at `32 62% 47%` is pulled directly from the colour of a well-poured pale ale held up to a tungsten bulb. The wheat cream foreground `40 70% 87%` was chosen to read cleanly against the dark background while still feeling warm — never the blue-white of a standard off-white.

The border colour `30 10% 18%` is subtle — just enough to separate cards from their background without competing visually. The muted foreground `40 20% 55%` is used for secondary text, labels, and metadata — it sits comfortably between full foreground and invisible, allowing a clear three-tier typographic hierarchy on every section.

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400&display=swap');

/* Display headings: Playfair Display 700/900 */
/* Body: Source Sans 3 300/400 */
```

Apply globally:
```css
body {
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 300;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 {
  font-family: 'Playfair Display', serif;
}
```

### Typography Rationale

Playfair Display is a high-contrast serif designed for editorial use at large sizes — it carries the weight and character of traditional print media, referencing old brewery labels, 19th-century newspaper mastheads, and the general aesthetic of something made with craft rather than software. At `font-weight: 900` in the hero, it reads as authoritative and uncompromising. At `font-weight: 700` in section headings, it is elegant and clear. Source Sans 3 at `300` (light) is the opposite — airy, modern, and neutral. The contrast between the two typefaces is the primary visual tension of the design: heritage and restraint side by side. Source Sans 3 `300` carries all descriptive body copy, tasting notes, and section descriptions. Source Sans 3 `400` is reserved for interactive labels — prices, CTA text, form fields — anything the user is expected to act on.

### Spacing and Layout Conventions

- Section padding: `py-24` throughout (96px top and bottom). Never reduce this — the generous whitespace is what gives the sections room to breathe and lets each heading land with weight.
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` on all sections. Consistent horizontal margins at every breakpoint.
- Card borders use `rounded-xl` (12px radius) on image containers, card wrappers, and info blocks. The only exception is CTA buttons — these use `rounded-none` (zero radius) as a deliberate industrial design signal.
- Section background alternates between `bg-[hsl(var(--background))]` and `bg-[hsl(var(--card))]`. The card background at `30 7% 11%` is only 4 lightness points lighter than the base background — barely perceptible as a colour difference but enough to register a section boundary when the eye scans the page.

---

## Tailwind Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

---

## Signature Animations

### Animation 1: Beer Card Flip (3D Hover)

Each beer card in the "On Tap Today" section flips 180° on hover to reveal tasting notes on the back. This is a pure CSS animation — no Framer Motion required — using the CSS 3D transform properties `perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, and `rotateY(180deg)`.

The perspective value of `1000px` creates a mild, realistic-feeling 3D depth. Lower values (e.g. `400px`) produce a more exaggerated, carnival-style flip that would clash with the restrained brewery aesthetic. Higher values (e.g. `2000px`) make the flip too flat to register clearly. `1000px` is the calibrated sweet spot for this card size.

```tsx
// CSS required in index.css:
.flip-card { perspective: 1000px; }
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.flip-card-back {
  transform: rotateY(180deg);
}

// USAGE in JSX:
<div className="flip-card h-64 cursor-pointer">
  <div className="flip-card-inner rounded-xl overflow-hidden">
    <div className="flip-card-front bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl p-6 flex flex-col justify-between h-full">
      {/* Beer name, style, ABV */}
    </div>
    <div className="flip-card-back bg-[hsl(var(--primary)/0.12)] border border-[hsl(var(--primary)/0.3)] rounded-xl p-6 flex flex-col justify-between h-full">
      {/* Tasting notes, IBU, availability */}
    </div>
  </div>
</div>
```

The back face uses a very low-opacity amber background `hsl(var(--primary)/0.12)` — subtle enough to avoid overwhelming the text, but present enough to signal that you are looking at the "other side" of the card. The border shifts from the standard `--border` colour on the front to an amber-tinted `hsl(var(--primary)/0.3)` on the back — a small detail that reinforces the flip has occurred.

### Animation 2: Amber Pour Bar

On page load, a horizontal amber bar animates from `width: 0%` to `width: 100%` over 2 seconds at the bottom of the hero section. The bar is 3px tall, uses a left-to-right gradient from deep copper to amber to transparent amber, and is preceded by a short gradient fade above it that eases the visual transition between the dark hero content and the bar itself.

```tsx
// Component: AmberPourBar
// Position: at the bottom of the hero content area, within the left column

<div className="mt-12 overflow-hidden">
  {/* Gradient fade above the bar */}
  <div className="h-12 bg-gradient-to-t from-[hsl(var(--primary)/0.06)] to-transparent mb-0" />
  
  {/* The animated bar */}
  <motion.div
    className="h-[3px] bg-gradient-to-r from-[hsl(var(--secondary))] via-[hsl(var(--primary))] to-[hsl(var(--primary)/0.4)]"
    initial={{ width: '0%' }}
    animate={{ width: '100%' }}
    transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
  />
</div>

// This simulates an amber liquid "pouring" from left to right beneath the hero content.
```

The 0.5s delay allows the hero text fade-in to settle before the pour begins. The `easeInOut` easing curve gives the bar a natural poured-liquid quality — it starts slowly (beer emerging from the tap), accelerates in the middle (the pour at full flow), and decelerates gently at the end (the glass filling). This is one of those small animations that most visitors will not consciously notice, but which makes the overall page feel crafted rather than assembled.

### Animation 3: Scroll-Triggered Fade Up (Reused Across Sections)

Multiple sections use the same base scroll animation pattern via Framer Motion's `whileInView`. Apply this to brewing process steps, event rows, and section headings:

```tsx
// Base pattern (add viewport={{ once: true }} to trigger only on first view):
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.15 }}
>
  {/* content */}
</motion.div>

// For right-side image reveals (Taproom section):
<motion.div
  initial={{ opacity: 0, x: 40 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, ease: 'easeOut' }}
>
  {/* image */}
</motion.div>
```

---

## Section 1: Navbar

```tsx
// Fixed top: fixed top-0 left-0 right-0 z-50
// bg-[hsl(var(--background)/0.96)]
// border-b border-[hsl(var(--border))]
// backdrop-blur-sm (subtle blur — reinforces the dark glass-panel feel)
// Height: h-20 (80px — slightly taller for logo breathing room)

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Layout: flex items-center justify-between h-full

// Logo: flex flex-col items-start
//   Row 1: flex items-center gap-2
//     [Inline SVG hop icon: circle outline with small leaf details, ~20px, text-[hsl(var(--primary))]]
//     "FORGE & GRAIN" — Playfair Display 700 text-xl text-[hsl(var(--foreground))] tracking-wide
//   Row 2: "BREWING CO." — Source Sans 3 300 text-xs tracking-widest text-[hsl(var(--muted-foreground))] pl-8

// Desktop nav (hidden on mobile, lg:flex gap-8):
// "On Tap" | "Taproom" | "Our Story" | "Events" | "Visit"
// Source Sans 3 400 text-sm text-[hsl(var(--muted-foreground))]
// Hover: text-[hsl(var(--foreground))] transition-colors duration-150

// "Visit Us" CTA button (ml-8):
// bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
// Source Sans 3 400 text-sm px-6 py-2
// rounded-none (square edges — industrial)
// hover:opacity-85 transition-opacity

// Mobile hamburger (lg:hidden):
// Menu icon from lucide-react, w-5 h-5 text-[hsl(var(--foreground))]
// onClick toggles isOpen state
// Mobile nav panel (when isOpen):
//   absolute top-20 left-0 right-0 bg-[hsl(var(--background))]
//   border-b border-[hsl(var(--border))] px-6 py-6
//   flex flex-col gap-4
//   Same links as desktop, text-base
//   "Visit Us" button full-width at bottom of mobile panel
```

---

## Section 2: Hero

```tsx
// Height: 100dvh
// Background: bg-[hsl(var(--background))]
// Layout: flex items-center

// Subtle texture overlay:
// absolute inset-0 pointer-events-none z-0 opacity-[0.03]
{/* Background texture: subtle dark concrete or stone grain texture, adds industrial depth to solid dark background */}

// Grid: grid lg:grid-cols-[60%_40%] items-stretch min-h-screen

// LEFT COLUMN (z-10 relative):
// px-8 lg:px-16 py-32 flex flex-col justify-center

// Label: "EST. 2018 · SHEFFIELD"
// Source Sans 3 300 text-xs tracking-[0.4em] text-[hsl(var(--muted-foreground))] uppercase mb-6
// Motion: initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}

// Headline: "Brewed with purpose. Poured with pride."
// Playfair Display 900
// text-[80px] leading-[1.05] (desktop) → text-5xl leading-tight (mobile)
// text-[hsl(var(--foreground))]
// Framer Motion: initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}

// Subtext paragraph:
// "Independent craft brewery making real beer for real people. We brew in small batches, use locally sourced malt wherever possible, and we never compromise on flavour. We're based in Sheffield and proud of it."
// Source Sans 3 300 text-lg text-[hsl(var(--muted-foreground))] leading-relaxed mt-6 max-w-lg
// Motion: same pattern, delay 0.25s

// CTAs (flex gap-4 mt-10 flex-wrap):
// Primary button: "See What's On Tap"
//   bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
//   px-8 py-3 rounded-none Source Sans 3 400 text-sm
//   hover:opacity-85 transition-opacity
//   cursor-pointer
// Ghost button: "Plan Your Visit"
//   border border-[hsl(var(--foreground)/0.3)] text-[hsl(var(--foreground))]
//   px-8 py-3 rounded-none Source Sans 3 400 text-sm
//   hover:border-[hsl(var(--foreground))] transition-colors
//   cursor-pointer

// AmberPourBar component placed below CTAs (see Animation 2)

// RIGHT COLUMN:
// relative overflow-hidden lg:h-full h-80 mt-16 lg:mt-0
{/* Image: craft brewery interior with large copper brew kettles gleaming under industrial pendant lights, exposed red brick walls, authentic Sheffield brewery atmosphere, warm amber and copper tones, dramatic lighting with steam wisps rising from the mash tun */}
<img src="" alt="Forge & Grain brewery copper kettles" className="absolute inset-0 w-full h-full object-cover" />
// Left gradient overlay: absolute inset-y-0 left-0 w-32 z-10
//   bg-gradient-to-r from-[hsl(var(--background))] to-transparent
//   (blends the image into the dark left column on desktop)
// Bottom gradient overlay (mobile only): absolute bottom-0 inset-x-0 h-24 lg:hidden
//   bg-gradient-to-t from-[hsl(var(--background))] to-transparent
```

---

## Section 3: On Tap Today (3D Flip Cards)

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Section header (flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12):
// Left:
//   Label: "ON TAP TODAY" — Source Sans 3 300 text-xs tracking-[0.4em] uppercase text-[hsl(var(--primary))] mb-3
//   Heading: "What's On Tap."
//   Playfair Display 700 text-[64px] leading-none text-[hsl(var(--foreground))]
// Right:
//   Sub: "Brewed fresh in Sheffield. Rotating seasonal selection."
//   Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))] max-w-xs text-right (sm)

// Grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4

// Each card height: h-64 (256px). The fixed height ensures the card grid stays uniform even when beer names vary in length.

// FRONT FACE structure:
// bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl p-6
// flex flex-col justify-between h-full
//
// Top block:
//   Beer name: Playfair Display 700 text-2xl text-[hsl(var(--foreground))] mb-1 leading-tight
//   Style tag: Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider
//
// Middle block:
//   ABV value: Source Sans 3 700 text-4xl text-[hsl(var(--primary))] leading-none
//   "ABV" label: Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mt-1
//
// Bottom:
//   "Flip for tasting notes →"
//   Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))] italic

// BACK FACE structure:
// bg-[hsl(var(--primary)/0.12)] border border-[hsl(var(--primary)/0.3)] rounded-xl p-6
// flex flex-col justify-between h-full
//
// Top:
//   "TASTING NOTES" — Source Sans 3 300 text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3
//
// Middle:
//   Description: Source Sans 3 300 text-sm text-[hsl(var(--foreground)/0.85)] italic leading-relaxed
//
// Bottom:
//   Stats row: flex gap-6 mb-3
//     IBU stat: flex flex-col
//       Value: Source Sans 3 700 text-lg text-[hsl(var(--primary))] leading-none
//       Label: Source Sans 3 300 text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]
//     ABV stat: same pattern
//   "Available at the bar ✓" Source Sans 3 300 text-xs text-[hsl(var(--primary))]

// BEER DATA ARRAY (map over this to render cards):
const beers = [
  {
    name: 'Ironside Pale Ale',
    style: 'American Pale',
    abv: '4.8%',
    ibu: 35,
    notes: 'Tropical citrus and pine resin on the nose, refreshingly bitter finish with soft stone fruit undertones. Our best-selling pale since day one.',
  },
  {
    name: 'Coal Face Porter',
    style: 'English Porter',
    abv: '5.6%',
    ibu: 28,
    notes: 'Rich roasted malt, dark chocolate bitterness, subtle vanilla on the finish. Sheffield\'s favourite winter warmer — dark enough to make you feel warm before you\'ve even taken a sip.',
  },
  {
    name: 'Golden Anvil Lager',
    style: 'Czech Pilsner Style',
    abv: '4.2%',
    ibu: 22,
    notes: 'Clean, crisp, and refreshing. Light floral hops with a smooth malt backbone — the session lager that converted half our porter drinkers. Perfect from the first sip to the last.',
  },
  {
    name: 'Ember Wheat',
    style: 'Hefeweizen',
    abv: '4.5%',
    ibu: 15,
    notes: 'Classic banana and clove esters from our Bavarian yeast strain. Hazy golden pour, smooth and naturally cloudy. Brewed in the traditional Hefeweizen style — no shortcuts, no filtration.',
  },
  {
    name: 'Copper Run IPA',
    style: 'West Coast IPA',
    abv: '6.2%',
    ibu: 65,
    notes: 'Punch of grapefruit, mango, and resinous pine. Big hops, dry and assertive, with a clean bitter finish. Our most divisive beer — you either love it completely or you don\'t order a second. No fence-sitters.',
  },
  {
    name: 'Session Saison',
    style: 'Belgian Saison',
    abv: '3.8%',
    ibu: 20,
    notes: 'Spicy farmhouse character, light and effervescent, with notes of white pepper, lemon zest, and fresh hay. Our lowest ABV beer and arguably our most complex. Proof that restraint and flavour are not opposites.',
  },
]
```

---

## Section 4: Taproom

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Grid: grid grid-cols-1 lg:grid-cols-2 gap-16 items-center

// LEFT — Text column:
// Label: "THE TAPROOM"
// Source Sans 3 300 text-xs tracking-[0.4em] uppercase text-[hsl(var(--primary))] mb-4

// Heading: "The Taproom."
// Playfair Display 700 text-6xl text-[hsl(var(--foreground))] leading-tight mb-6

// Body paragraph 1:
// "Set in a converted Victorian forge in the heart of Sheffield, our taproom is everything a great local should be — honest, welcoming, and smelling faintly of something excellent in the tank. Pull up a stool at the long bar, grab a flight of four to explore the range, or settle into one of the alcoves with a pint and some good company."
// Source Sans 3 300 text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-4

// Body paragraph 2:
// "We've got no Wi-Fi password, no background music playlist managed by an algorithm, and no menu that changes every three months to chase trends. We've got six taps, six great beers, and all the time in the world to talk about them."
// Source Sans 3 300 text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-8

// Opening hours card:
// bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))] mb-8
// "OPENING HOURS" — Source Sans 3 300 text-xs tracking-wider uppercase text-[hsl(var(--muted-foreground))] mb-4
// Hours table (divide-y divide-[hsl(var(--border))]):
// Each row: flex justify-between items-center py-2.5
//   Day range: Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))]
//   Time: Source Sans 3 400 text-sm text-[hsl(var(--foreground))]
const hours = [
  { days: 'Tuesday – Thursday', time: '4:00pm – 10:00pm' },
  { days: 'Friday', time: '3:00pm – 11:00pm' },
  { days: 'Saturday', time: '12:00pm – 11:00pm' },
  { days: 'Sunday', time: '12:00pm – 8:00pm' },
  { days: 'Monday', time: 'Closed' },
]
// Monday's "Closed" time: text-[hsl(var(--muted-foreground))] italic

// CTA: "Get Directions →"
// bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
// px-8 py-3 rounded-none Source Sans 3 400 text-sm
// inline-block hover:opacity-85 transition-opacity

// RIGHT — Image column:
// h-[520px] rounded-xl overflow-hidden
// Framer Motion: whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 40 }}
//   viewport={{ once: true }} transition={{ duration: 0.7 }}
{/* Image: warm taproom interior with exposed brick walls, long wooden bar with brass beer taps, low amber pendant lighting, industrial wooden bar stools, groups of people enjoying drinks in the background, authentic Sheffield local pub atmosphere, evening golden hour scene */}
<img src="" alt="Forge & Grain taproom interior" className="w-full h-full object-cover" />
```

---

## Section 5: Our Story

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-5xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "OUR STORY"
// Source Sans 3 300 text-xs tracking-[0.4em] uppercase text-[hsl(var(--primary))] mb-4

// Heading: "Sheffield steel meets Sheffield beer."
// Playfair Display 700 text-5xl text-[hsl(var(--foreground))] leading-tight mb-12

// Pull quote block:
// bg-[hsl(var(--background)/0.6)] rounded-xl p-8 border-l-4 border-[hsl(var(--primary))] my-12
// '"We wanted to make the kind of beer we actually wanted to drink."'
// Playfair Display 700 italic text-3xl text-[hsl(var(--foreground))] leading-snug
// Attribution below: "— Tom & Dan, co-founders"
//   Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))] mt-4 uppercase tracking-wider

// Story paragraph 1:
// "Forge & Grain was started in 2018 by two friends — a former steelworker and a homebrewer — who shared a belief that Sheffield deserved great local beer. The city had always made things with its hands. We thought beer should be on that list."
// Source Sans 3 300 text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-4

// Story paragraph 2:
// "Armed with a 5-barrel system, a converted forge unit in S3, and an obsessive attention to process, they brewed their first batch of Ironside Pale Ale on a freezing January morning. Two hundred batches later, the commitment to small-batch quality remains unchanged. The 5-barrel system is still the same one."
// Source Sans 3 300 text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-4

// Story paragraph 3:
// "We don't brew to maximise volume. We brew to maximise flavour. Every recipe is developed in-house, every ingredient is chosen with reason, and every beer that leaves this building has been tasted by the team and declared ready. We're slow by design."
// Source Sans 3 300 text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-12

// Founders image:
// rounded-xl overflow-hidden h-72 w-full
{/* Image: two brewery founders standing together inspecting a pint glass held up to light, warm smiles in authentic brewery environment, documentary-style portrait, warm natural backlighting, genuine and approachable */}
<img src="" alt="Forge & Grain brewery founders" className="w-full h-full object-cover" />
```

---

## Section 6: Brewing Process

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Section label: "THE PROCESS"
// Source Sans 3 300 text-xs tracking-[0.4em] uppercase text-[hsl(var(--primary))] mb-4

// Heading: "How we brew."
// Playfair Display 700 text-5xl text-[hsl(var(--foreground))] mb-16

// Steps wrapper: relative grid grid-cols-1 md:grid-cols-3 gap-8

// Connector line (desktop only):
// hidden md:block absolute top-8 left-[calc(1/6*100%)] right-[calc(1/6*100%)] h-px
// bg-[hsl(var(--border))] z-0
// (This horizontal line sits behind the step circles, connecting them visually)

// STEP COMPONENT (relative z-10 text-center):

// Step circle: w-16 h-16 rounded-full border-2 border-[hsl(var(--border))]
//   bg-[hsl(var(--card))] flex items-center justify-center mx-auto mb-6

// Step label: Source Sans 3 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--primary))] mb-2

// Step heading: Playfair Display 700 italic text-2xl text-[hsl(var(--foreground))] mb-4

// Step body: Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs mx-auto

// Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
//   viewport={{ once: true }} transition={{ delay: index * 0.2, duration: 0.6 }}

const steps = [
  {
    icon: 'Wheat',         // lucide-react Wheat icon
    label: 'STEP ONE',
    heading: 'Malt',
    body: 'We source our malt from Yorkshire maltsters. Locally grown barley, kilned to the profile each recipe demands. The foundation of every great pint starts here — long before the kettle is hot.',
  },
  {
    icon: 'FlaskConical',  // lucide-react FlaskConical icon
    label: 'STEP TWO',
    heading: 'Brew',
    body: 'Our 5-barrel copper kettle has brewed every single batch since January 2018. Same equipment, same care, same approach. We hit our gravity numbers or we don\'t package the beer. No exceptions.',
  },
  {
    icon: 'Droplets',      // lucide-react Droplets icon
    label: 'STEP THREE',
    heading: 'Ferment',
    body: 'Patient fermentation at precise temperatures in our temperature-controlled fermentation vessels. We never rush the process. Every beer conditions for exactly as long as it needs — no shortcuts, no forced carbonation in tank.',
  },
]
// Icons: text-[hsl(var(--primary))] w-6 h-6 inside the step circle
```

---

## Section 7: Events

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-5xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "COMING UP"
// Source Sans 3 300 text-xs tracking-[0.4em] uppercase text-[hsl(var(--primary))] mb-4

// Heading: "Coming Up."
// Playfair Display 700 text-5xl text-[hsl(var(--foreground))] mb-12

// Events list: space-y-0 divide-y divide-[hsl(var(--border))]

// EVENT COMPONENT:
// py-8 flex flex-col sm:flex-row gap-6 sm:items-center
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
//   viewport={{ once: true }} transition={{ delay: index * 0.1 }}

// Date column (flex-shrink-0 sm:w-24):
//   Day number: Playfair Display 700 text-3xl text-[hsl(var(--primary))] leading-none
//   Month/Year: Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mt-1

// Details column (flex-1):
//   Event name: Playfair Display 700 text-xl text-[hsl(var(--foreground))] mb-2
//   Description: Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-3
//   Meta row (flex gap-3 flex-wrap items-center):
//     Price badge: bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]
//       text-xs px-3 py-1 Source Sans 3 400
//     Spaces badge (if applicable): same style but bg-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]

// CTA (sm:ml-auto flex-shrink-0):
//   border border-[hsl(var(--primary))] text-[hsl(var(--primary))]
//   px-5 py-2 rounded-none Source Sans 3 400 text-sm
//   hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors

const events = [
  {
    day: '15',
    month: 'FEB 2025',
    name: 'Brewery Tour + Guided Tasting',
    description: '45-minute guided tour of the full brewery floor — fermentation vessels, copper kettle, conditioning tanks — followed by a guided tasting of all six beers currently on tap. Hosted by our head brewer. Limited to 12 people per session for a genuinely personal experience.',
    price: '£18 / person',
    spaces: '8 spaces left',
    cta: 'Book Now →',
  },
  {
    day: '7',
    month: 'MAR 2025',
    name: 'Beer & Cheese Pairing Evening',
    description: 'Six Forge & Grain beers matched with six artisan Yorkshire cheeses sourced from Courtyard Dairy. Hosted by our head brewer and a cheesemonger, with tasting notes and pairing logic explained for each match. One of our most popular recurring events — sells out fast.',
    price: '£28 / person',
    spaces: '4 spaces left',
    cta: 'Book Now →',
  },
  {
    day: '12',
    month: 'APR 2025',
    name: 'Northern Collective Tap Takeover',
    description: 'We hand over four of our six taps to other independent Northern craft breweries for a single Saturday evening. Free to enter, no booking required. A chance to try something new, discover breweries you might not know, and join a room full of people who take beer as seriously as we do.',
    price: 'Free Entry',
    spaces: null,
    cta: 'Add to Calendar →',
  },
]
```

---

## Section 8: Merch

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "THE SHOP"
// Source Sans 3 300 text-xs tracking-[0.4em] uppercase text-[hsl(var(--primary))] mb-4

// Heading: "Take it home."
// Playfair Display 700 text-5xl text-[hsl(var(--foreground))] mb-12

// Grid: grid grid-cols-1 md:grid-cols-3 gap-6

// MERCH CARD COMPONENT:
// bg-[hsl(var(--card))] rounded-xl overflow-hidden
// border border-[hsl(var(--border))]
// hover:border-[hsl(var(--primary)/0.4)] transition-colors
// group cursor-pointer

// Image container: h-56 overflow-hidden
//   img: w-full h-full object-cover
//   group-hover:scale-105 transition-transform duration-500 ease-out

// Card body: p-6
//   Product name: Playfair Display 700 text-xl text-[hsl(var(--foreground))] mb-1
//   Price: Source Sans 3 400 text-[hsl(var(--primary))] text-sm mb-3
//   Description: Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed

// "Add to Bag →" link:
// Source Sans 3 400 text-sm text-[hsl(var(--primary))]
// hover:underline mt-4 inline-flex items-center gap-1

const merch = [
  {
    name: 'Mixed Case — 12 Cans',
    price: '£32',
    description: 'Two cans of each of our six core beers — the ideal introduction to the full Forge & Grain range. Arrives in a branded gift-ready box. Delivery included on orders over £30.',
    imageAlt: 'Forge & Grain 12-can mixed case',
    // Image: 12-can craft beer mixed case box with amber label design displaying Forge & Grain brewery branding, arranged on dark weathered wooden surface, warm product photography with natural side lighting
  },
  {
    name: 'Forge & Grain Pint Glasses — Set of 2',
    price: '£14',
    description: 'Our core pint glass with the Forge & Grain logo etched near the base. Dishwasher safe, nucleated for a better head. Available in classic pint and conical shapes.',
    imageAlt: 'Forge & Grain branded pint glasses',
    // Image: pair of branded craft beer pint glasses with Forge & Grain logo etched near the base, one filled with amber ale showing perfect foam head, dark moody background, lifestyle product photography
  },
  {
    name: 'Forge & Grain Hoodie',
    price: '£45',
    description: 'Heavyweight charcoal hoodie with amber embroidered logo on the chest. 350gsm cotton blend. Sizes S–3XL. The hoodie we wear ourselves.',
    imageAlt: 'Forge & Grain branded hoodie',
    // Image: dark charcoal heavyweight hoodie with small Forge & Grain amber embroidery on the left chest, folded neatly on dark surface, minimal flat-lay product photography, one corner of the embroidery detail visible
  },
]
```

---

## Section 9: Visit + Address

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "FIND US"
// Source Sans 3 300 text-xs tracking-[0.4em] uppercase text-[hsl(var(--primary))] mb-4

// Heading: "Find Us."
// Playfair Display 700 text-5xl text-[hsl(var(--foreground))] mb-12

// Grid: grid grid-cols-1 lg:grid-cols-2 gap-12

// LEFT — Visit Info:

// Address block (mb-8):
//   "ADDRESS" — Source Sans 3 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--primary))] mb-3
//   "12 Forge Street" — Source Sans 3 300 text-base text-[hsl(var(--foreground)/0.8)]
//   "Sheffield S3 8LR" — same style

// Getting Here block (mb-8):
//   "GETTING HERE" — Source Sans 3 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--primary))] mb-3
//   ul space-y-2:
//   "🚊 Tram: Cathedral stop, 8 min walk"
//   "🚌 Bus: Routes 7, 8, 52 — Moorfoot stop"
//   "🅿️ Moorfoot multi-storey, 5 min walk"
//   Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))]

// Amenity pills (flex flex-wrap gap-3 mb-8):
// Each pill: bg-[hsl(var(--background))] border border-[hsl(var(--border))]
//   Source Sans 3 300 text-xs px-3 py-1.5 text-[hsl(var(--muted-foreground))] rounded-full
// "Dog friendly ✓" | "Wheelchair accessible ✓" | "Card payments only ✓" | "Outdoor seating ✓"

// Note (Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))] italic):
// "Please note: we are a cashless venue. Card or contactless only at the bar."

// RIGHT — Map placeholder:
// h-80 lg:h-full min-h-[320px] rounded-xl overflow-hidden
// bg-[hsl(var(--background))] border border-[hsl(var(--border))]
// flex flex-col items-center justify-center gap-4
//
// MapPin icon: w-10 h-10 text-[hsl(var(--primary))]
// Address: Playfair Display 700 text-lg text-[hsl(var(--foreground))] text-center
//   "12 Forge Street" / "Sheffield S3 8LR"
// "Get directions on Google Maps →"
//   Source Sans 3 300 text-sm text-[hsl(var(--primary))] hover:underline cursor-pointer
// Comment in JSX: {/* Replace with <iframe> Google Maps embed for production */}
```

---

## Section 10: Footer

```tsx
// Background: bg-[hsl(var(--background))]
// Border top: border-t border-[hsl(var(--border))]
// Padding: py-16

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Grid: grid grid-cols-1 md:grid-cols-3 gap-12

// Column 1 — Logo + mission statement:
// Logo (same structure as navbar: hop SVG + FORGE & GRAIN + BREWING CO.)
// "Brewed with purpose. Poured with pride."
//   Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))] mt-4
// "Small batch. Sheffield made. Since 2018."
//   Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground)/0.5)] mt-2

// Column 2 — Navigation:
// "NAVIGATE" — label style (text-xs tracking-[0.3em] uppercase text-[hsl(var(--primary))] mb-4)
// Links (nav space-y-2 flex flex-col):
// On Tap | Taproom | Our Story | Events | Merch | Visit Us
// Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))]
// hover:text-[hsl(var(--foreground))] transition-colors

// Column 3 — Contact + socials:
// "FIND US" — label
// "12 Forge Street, Sheffield S3 8LR"
//   Source Sans 3 300 text-sm text-[hsl(var(--muted-foreground))]
// Hours summary (mt-2 Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed):
// "Tue–Thu 4–10pm  ·  Fri 3–11pm  ·  Sat 12–11pm  ·  Sun 12–8pm  ·  Mon Closed"
//
// Socials row (flex gap-4 mt-4):
// Instagram, ExternalLink (Untappd placeholder), Facebook
// All: text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors
// Icons: w-5 h-5

// Footer bottom bar:
// mt-12 pt-8 border-t border-[hsl(var(--border))]
// flex flex-col sm:flex-row sm:justify-between gap-2
// "© 2025 Forge & Grain Brewing Co. All rights reserved."
//   Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground))]
// "Independently owned. Never compromised."
//   Source Sans 3 300 text-xs text-[hsl(var(--muted-foreground)/0.5)] italic
```

---

## App Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css                # CSS variables, flip card styles, font import
├── components/
│   ├── Navbar.tsx           # Fixed header with mobile menu
│   ├── HeroSection.tsx      # Split layout, amber pour bar animation
│   ├── OnTapSection.tsx     # 6 × 3D flip beer cards
│   ├── TaproomSection.tsx   # Split layout with opening hours table
│   ├── OurStorySection.tsx  # Pull quote, story copy, founders image
│   ├── BrewingProcess.tsx   # 3-step horizontal with connector line
│   ├── EventsSection.tsx    # 3 event rows with date column + CTA
│   ├── MerchSection.tsx     # 3 product cards with hover zoom
│   ├── VisitSection.tsx     # Address, transport, amenity pills, map
│   └── Footer.tsx           # 3-column grid + bottom bar
└── components/ui/           # shadcn/ui components (if used)
```

---

## Full index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@300;400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 30 7% 7%;
    --foreground: 40 70% 87%;
    --primary: 32 62% 47%;
    --primary-foreground: 30 7% 7%;
    --secondary: 30 68% 31%;
    --card: 30 7% 11%;
    --card-foreground: 40 70% 87%;
    --muted-foreground: 40 20% 55%;
    --border: 30 10% 18%;
    --muted: 30 7% 9%;
  }

  * {
    border-color: hsl(var(--border));
    box-sizing: border-box;
  }

  body {
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 300;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4 {
    font-family: 'Playfair Display', serif;
  }
}

/* ─── Flip card CSS ─── */
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Mobile: tap to flip via JS toggle — add .is-flipped class */
.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
```

---

## Setup Commands

```bash
npm create vite@latest forge-and-grain -- --template react-ts
cd forge-and-grain
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init
npm install motion
npm install lucide-react
```

---

## Key Implementation Notes

1. **Flip Cards on Mobile**: The CSS `hover:` states don't trigger on touch devices. For mobile, either add a `onClick` toggle state in React that adds the `.is-flipped` class (defined in the CSS above), or add a small "Tap to reveal" instruction label on the front face. The `.is-flipped` class approach is already defined in the CSS — you only need to wire it up with `useState` and `onClick` in the component. Recommend checking `window.matchMedia('(hover: none)')` to conditionally enable touch-flip behaviour.

2. **Amber Pour Bar**: The Framer Motion `initial={{ width: '0%' }} animate={{ width: '100%' }}` animation requires the parent container to have a defined width (not `auto`). Ensure the parent div has `w-full` applied explicitly. The `overflow-hidden` wrapper above it is essential — without it, the bar will appear to start from the left edge of the viewport rather than the component boundary. The bar should be visually subtle — it is an ambient animation, not a progress indicator.

3. **Dark Backgrounds**: The `--background` at HSL `30 7% 7%` is very dark but not pure black — it carries a slight warm brown undertone that references the brewery aesthetic. Never replace with `#000000` or `hsl(0 0% 0%)`. The warmth is load-bearing for the identity. Similarly, the card background at `30 7% 11%` is intentionally close to the base background — the section alternation is a whisper, not a shout.

4. **Source Sans 3 vs Source Sans Pro**: Google Fonts has renamed the font family. Use `Source+Sans+3` in the import URL and `'Source Sans 3'` in CSS `font-family`. Both `300` and `400` weights are imported. Use `300` (light) for body text, descriptions, and tasting notes. Use `400` (regular) for prices, CTA labels, badge text, and anything the user is expected to interact with.

5. **Playfair Display 900**: The hero headline uses `font-weight: 900` (Playfair Display Black). This is the heaviest weight available and creates maximum contrast between the headline and the body text. The italic variant is used in the pull quote (Our Story) and the step headings (Brewing Process) — ensure the Google Fonts import includes `ital,wght@0,700;0,900;1,700` to access the italic cut.

6. **Events Section Layout**: On very small screens, the date column and the details column stack vertically. The date should appear first (above the title) on mobile. Use `flex-col sm:flex-row` to control this. On mobile the CTA button should be full-width below the event description: add `w-full sm:w-auto` to the button class and `sm:ml-auto` only on `sm:` breakpoint.

7. **Merch Image Zoom**: The `group-hover:scale-105` effect on the product image requires `group` on the parent card wrapper and `overflow-hidden` on the image container — without `overflow-hidden`, the scaled image will bleed outside its boundaries. The `transition-transform duration-500 ease-out` gives a smooth, unhurried zoom that reads as premium rather than snappy.

8. **Framer Motion Import**: This prompt uses Framer Motion via the `motion/react` package (version 11+). Import as `import { motion } from 'motion/react'` — not `import { motion } from 'framer-motion'`. Both work but `motion/react` is the correct import for the current package name after the Motion rebranding.

9. **shadcn/ui Usage**: This design is primarily custom-built using Tailwind utility classes. The shadcn/ui init is included in the setup for the CSS variable scaffolding it provides. Individual shadcn components (Button, Card, etc.) can be optionally added but are not required for this design — the custom classes cover everything needed.

10. **Section Scroll Targets**: Add `id` attributes to each section wrapper to enable smooth scrolling from the navbar links. Recommended IDs: `#on-tap`, `#taproom`, `#our-story`, `#events`, `#visit`. Apply `scroll-behavior: smooth` to `html` in `index.css` or use `scrollIntoView({ behavior: 'smooth' })` in the nav click handlers.

11. **Accessibility**: All interactive flip cards should include `role="button"` and `tabIndex={0}` with `onKeyDown` handling for Enter/Space to trigger the flip via keyboard. The amber pour bar is purely decorative — add `aria-hidden="true"` so screen readers skip it. All images must have meaningful `alt` text (supplied inline in each section above). Opening hours should use a `<table>` element with `<caption>` for semantic correctness if accessibility is a priority.

12. **Performance**: The Google Fonts import loads two families, each in two weights. For production, consider hosting fonts locally with `@font-face` using the WOFF2 format to eliminate the third-party request and improve CLS scores. The flip card CSS animation is GPU-accelerated via `transform` and `backface-visibility` — it will not cause layout thrashing even at 60fps on low-power devices. Framer Motion's `whileInView` uses `IntersectionObserver` internally, which is efficient and does not poll.

---

## Niche Fit Notes

This design is calibrated specifically for small-batch, independent craft breweries with a physical taproom. The copy tone is direct and Northern English — confident without being boastful, knowledgeable without being snobbish. The "no Wi-Fi password" line in the taproom section and the "no fence-sitters" line in the Copper Run IPA tasting note are examples of this voice: they signal a brewery that knows exactly who it is and does not need to perform craft credibility because it has the actual craft. If adapting this prompt for a different brewery, keep the directness of the copy and resist softening lines that have a point of view — that specificity is what makes the site feel like a real place rather than a template.
