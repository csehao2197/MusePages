## Goal

Build a full multi-page portrait photography website for **LUNA VOSS** — dark editorial aesthetic, split collage hero with overlapping portraits, warm near-black tones, Cormorant Garamond serif, and a light body with asymmetric photo grids. Feels like a high-end editorial magazine, not a generic photography template.

---

## Global Layout Rule — Centering

Every section's content must be wrapped in a centered container:
```jsx



  {/* section content */}



```
Never let content stretch full-width or sit flush to the left. The `max-w-[1120px]` and `mx-auto` must be on every section's inner wrapper. On mobile, reduce to `px-6`.

---

## Tech Stack

React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + shadcn/ui + lucide-react

---

## Design System — Colors

```css
:root {
  --background: 25 8% 5%;           /* warm near-black #0D0B09 */
  --foreground: 0 0% 98%;           /* white */
  --surface: 25 6% 9%;              /* slightly lighter warm dark #171310 */
  --surface-light: 35 14% 97%;      /* warm white for body sections #FAF8F5 */
  --primary: 35 18% 82%;            /* warm cream #DDD4C6 — accent on dark */
  --primary-foreground: 25 8% 5%;   /* dark bg color */
  --muted-foreground: 35 8% 55%;    /* warm muted text rgba approx */
  --border-dark: 35 8% 18%;         /* subtle warm border on dark bg */
  --border-light: 35 12% 88%;       /* subtle warm border on light bg */
}
```

**Usage:**
- `bg-[hsl(var(--background))]` — hero, navbar, dark sections
- `bg-[hsl(var(--surface-light))]` — about, testimonials, contact
- `text-[hsl(var(--primary))]` — cream accent on dark
- `border-[hsl(var(--border-dark))]` — nav links dividers, dark section borders
- `border-[hsl(var(--border-light))]` — card outlines, framed photo borders on light bg

---

## Typography

**Import:**
```html
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap
```

**Usage:**
- **Section labels / UI text:** `font-['Inter'] font-[300] text-[0.62rem] tracking-[0.22em] uppercase` — warm muted color
- **Body paragraphs:** `font-['Inter'] font-[300] text-[0.85rem] leading-[1.9]`
- **Nav links:** `font-['Inter'] font-[300] text-[0.68rem] tracking-[0.12em]`
- **Headings — upright:** `font-['Cormorant_Garamond'] font-[300] leading-[0.92]` — e.g. "PHOTO"
- **Headings — italic:** `font-['Cormorant_Garamond'] font-[300] italic leading-[0.92]` — e.g. "About You"
- **Stats / large numbers:** `font-['Cormorant_Garamond'] font-[300] text-[2.4rem]`
- **Ghost watermark text:** `font-['Cormorant_Garamond'] font-[200] text-[10rem] opacity-[0.03] select-none pointer-events-none`

**Type scale:**
- Hero H1: `text-[clamp(3.8rem,6vw,6.5rem)]` — Cormorant Garamond 300
- Section H2: `text-[clamp(2.2rem,3.5vw,3.4rem)]` — Cormorant Garamond 300 italic
- Overline label: `text-[0.6rem] tracking-[0.24em]` — Inter 500 uppercase
- Body: `text-[0.83rem] leading-[1.9]` — Inter 300

---

## Visual Effects

### 1. Subtle grain texture overlay
```jsx
{/* Fixed full-screen grain overlay — makes everything feel more crafted */}



```
If `/noise.png` is unavailable, generate it with a CSS radial-gradient repeating pattern. Subtle film grain feel.

### 2. Staggered blur-up entrance animations (Framer Motion)
```jsx
const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: 'easeOut', delay: i * 0.1 }
  })
}
// Each element uses: custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
```
Apply to: hero headline lines (each word gets its own delay), about text, portfolio cards, testimonial quotes.

### 3. Ghost watermark text behind sections
On every dark section: absolute positioned oversized Cormorant Garamond text at `opacity-[0.03]`, `font-[200]`, `tracking-[-0.03em]`. E.g. "PHOTOGRAPHY" behind hero, "PORTFOLIO" behind gallery section. Adds depth.

### 4. Thin bottom-of-hero gradient fade to section
```jsx



```

### 5. Hover parallax on portfolio photos
```jsx

```

---

## Component Breakdown

### 01 — Navbar

**Layout:** `position: absolute; top: 0; left: 0; right: 0; z-index: 30;` — transparent over hero. `padding: 30px 56px;` `display: flex; justify-content: space-between; align-items: center;`

**Left:** Brand name `LUNA VOSS` — Cormorant Garamond 400, `tracking-[0.2em]`, white, `text-[1rem]`

**Right:** Nav links — Inter 300, `text-[0.68rem] tracking-[0.12em]` — `PORTFOLIO · ABOUT · PRICING · CONTACTS`

**No background, no blur** — purely transparent. Sits on top of dark hero image naturally.

**Mobile:** Hamburger menu (3 lines, top-right). Full-screen overlay menu with stacked links, Cormorant Garamond serif, white on dark background.

---

### 02 — Hero (Dark Editorial Split)

**Layout:** `min-height: 100vh; display: grid; grid-template-columns: 55% 45%; overflow: hidden;` No max-width — full bleed hero intentionally.

**Left photo panel (55%):**
- `position: relative; overflow: hidden;`
- Main portrait photo fills entire left panel: `absolute inset-0 w-full h-full object-cover object-center`
- Overlay: `absolute inset-0 bg-gradient-to-br from-[rgba(0,0,0,0.15)] to-[rgba(0,0,0,0.55)]` — ensures legibility of overlapping headline
- **Second smaller portrait:** positioned `absolute top-[80px] right-[24px] w-[175px] h-[240px] overflow-hidden` — a separate portrait photo layered on top, no border-radius
- **Ghost watermark:** `absolute bottom-12 left-12 font-['Cormorant_Garamond'] text-[8rem] font-[200] text-white/[0.05] leading-[0.85] select-none` — text: "PORTRAIT\nPHOTOGRAPHY"
- **Social indicator:** `absolute left-5 top-1/2 -translate-y-1/2` — vertical line (1px × 48px, white/20) + `@LUNAVOSS` text in `writing-mode: vertical-rl; transform: rotate(180deg)` + another line below
- **Bottom fade:** `absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(var(--background))] to-transparent`
- **Hero headline overlaps the split:** `absolute bottom-[80px] left-[56px] z-20` —
  ```
  PHOTO          ← Cormorant Garamond 300, normal, text-[clamp(4rem,6.5vw,6.5rem)]
  About You      ← Cormorant Garamond 300, italic, same size
  ```
  White text, `leading-[0.92]`

```jsx
{/* Image 1: portrait photography — woman, dramatic moody lighting, close-up face and shoulders, high contrast, dark warm tones, editorial fashion style, black and white */}


{/* Image 2 (small overlay): portrait photography — hands detail, or side profile, dark background, editorial black and white */}

```

**Right text panel (45%):**
- `background: hsl(var(--background))` — solid dark, no photo
- `display: flex; flex-direction: column; justify-content: flex-end; padding: 120px 56px 80px 48px`
- Ghost monogram: `absolute right-4 top-1/2 -translate-y-1/2 font-['Cormorant_Garamond'] text-[16rem] font-[200] text-white/[0.02] select-none` — text: "LV"
- Content (all z-10):
  - Overline: `PORTRAIT PHOTOGRAPHER · LONDON, UK` — Inter 300, `text-[0.6rem] tracking-[0.2em]` white/35, `mb-4`
  - Body: "Timeless photography that captures who you truly are. Candid, elegant, and deeply personal portrait sessions." — Inter 300, `text-[0.82rem] leading-[1.9]` white/45, `max-w-[280px] mb-10`
  - CTAs:
    ```jsx
     PORTFOLIO →    {/* border-bottom: 1px solid white/30, text-[0.68rem] tracking-[0.14em] white */}
     GET IN TOUCH →  {/* same style, white/40 */}
    ```
  - `gap-6 flex`
- Location: `absolute bottom-6 right-6` — SVG map pin + `LONDON, UK` — Inter 300, `text-[0.58rem] tracking-[0.1em]` white/30
- Dot/slider indicator: `absolute bottom-8 left-12` — row of 3 lines: `w-5 h-[1px] bg-white`, `w-2 h-[1px] bg-white/25`, `w-2 h-[1px] bg-white/25`

**Mobile:** Stack vertically — photo first (60vw height), text panel below on dark bg.

---

### 03 — About Me (Light)

**Background:** `bg-[hsl(var(--surface-light))]` — warm white `#FAF8F5`

**Padding:** `py-24 px-14`

**Layout:** 2-column grid `grid-cols-[1fr_1.05fr] gap-20 items-start`

**Left — text:**
- Overline: `ABOUT ME` — Inter 500, `text-[0.58rem] tracking-[0.22em]` warm muted `text-[#C0B0A0]`, `mb-4`
- H2: Cormorant Garamond 300 italic, `text-[clamp(2.2rem,3.5vw,3.2rem)] leading-[1.15]` — dark warm `#1A1210`:
  ```
  My goal is to capture you,
  your character, your story,
  your special essence.
  ```
- Body paragraph 1 (mb-6): "Hello, I'm Luna Voss. As long as I can remember, photography has always been in my life. I tried many types of photography and understood that portrait photography was my passion — because it is the most honest and frank one." — Inter 300, `text-[0.82rem] leading-[1.9]` warm dark muted `#6A5A50`, `max-w-[380px]`
- Body paragraph 2: "My photographs are candid but elegant and sophisticated. I want to take really stylish, natural, and timeless photos of you. Looking forward to working with you." — same style, slightly lighter
- Signature: Cormorant Garamond italic, `text-[1.1rem]` `#6A5A50` — "Photo, Luna →"
- `mt-10`

**Right — asymmetric photo collage:**
```
Position: relative
Top photo: margin-left: 64px, aspect-ratio 3/4
Bottom two: display grid, grid-template-columns: 1fr 1fr, gap-3, margin-right: 64px, margin-top: -16px
  Left small: aspect-ratio 1/1
  Right small: aspect-ratio 1/1, margin-top: 24px
```
```jsx
{/* Image 3: portrait photography — woman, elegant pose, soft natural lighting, dark warm background, editorial */}


{/* Image 4: portrait close-up — hands or jewelry detail, warm moody studio light, dark tones */}


{/* Image 5: portrait photography — profile or three-quarter view, clean dark background, editorial black and white */}

```

**Mobile:** Single column — text first, photos below in 2-column grid.

---

### 04 — Portfolio Gallery

**Background:** `bg-[hsl(var(--background))]` — dark again

**Padding:** `py-24 px-14`

**Ghost watermark:** `absolute right-0 top-0 text-[10rem] font-[200] text-white/[0.03]` — "PORTFOLIO"

**Header:**
- Overline: `SELECTED WORK`
- H2: Cormorant Garamond 300, white: "Portfolio"
- Right: `MORE PHOTOS →` — `text-[0.68rem] tracking-[0.14em]` cream/70, `border-b border-white/30`
- `flex justify-between items-end mb-14`

**Category tabs:**
```jsx
['All', 'Portrait', 'Editorial', 'Fashion', 'Couples']
// Active tab: white text + border-b border-white
// Inactive: white/40 text, no border
// Inter 300, text-[0.62rem] tracking-[0.14em] uppercase, flex gap-8 mb-12
```

**Masonry grid:**
- `display: grid; grid-template-columns: 1.15fr 0.85fr 1fr; gap: 16px; align-items: start;`
- Column 1: one tall photo, `aspect-ratio 3/4` + category label below in `text-[0.58rem] tracking-[0.18em] uppercase text-white/40 mt-3`
- Column 2: photo starting `padding-top: 40px`, `aspect-ratio 3/4`
- Column 3: photo starting `padding-top: 80px`, `aspect-ratio 4/5`
- All photos: hover scale effect (see visual effects section)

```jsx
{/* Images 6–8: portrait photography — editorial B&W, moody lighting, different poses and crops — mix of tight face crops, full body, and three-quarter views */}

```

**Mobile:** 2 columns, equal width, no vertical offset.

---

### 05 — Services / Pricing

**Background:** `bg-[hsl(var(--surface-light))]`

**Padding:** `py-24 px-14`

**Header:**
- Overline: `SESSIONS & PRICING`
- H2: Cormorant Garamond 300 italic, dark: "Every session,\ntailored to you."
- `flex justify-between items-end mb-16`

**3-column pricing cards:**
```
grid-cols-3 gap-6
```

**Card structure:**
```jsx



    

MINI SESSION


    

$150


    

1 hour · outdoor or studio


    

15 edited photos delivered


    

Online private gallery


    

1 location

BOOK THIS SESSION →  {/* border-b, Inter 300 */}



```

**Three tiers:**
- **MINI** — $150 — 1 hour · 15 edited photos · 1 location · private online gallery
- **SIGNATURE** — $350 — 2–3 hours · 40 edited photos · 2 locations · private gallery · outfit change
- **EDITORIAL** — $600 — 5 hours · 80 edited photos · 3 locations · hair & makeup coordination · printed lookbook

Middle card (Signature): slight shadow `shadow-lg` + darker border to indicate recommended.

**Mobile:** Single column stack.

---

### 06 — Process (How It Works)

**Background:** `bg-[hsl(var(--background))]` — dark

**Padding:** `py-24 px-14`

**Header:**
- Overline: `THE PROCESS`
- H2: Cormorant Garamond 300, white: "What to expect."

**4-step row:** `grid-cols-4 gap-8 mt-16`

Each step:
```jsx


01

BOOK


    Fill in the booking form. I'll get back within 24 hours to confirm your date and discuss your vision.
  


```

Steps:
1. **BOOK** — "Fill in the booking form. I'll confirm your date within 24 hours and we'll discuss your vision."
2. **PLAN** — "We'll talk about locations, outfits, and the mood you want. I'll guide you through every detail."
3. **SHOOT** — "The session itself — relaxed, candid, and directed. Most people are surprised by how natural it feels."
4. **RECEIVE** — "Your gallery arrives within 2 weeks. Fully edited, color-graded, and ready to download or print."

**Divider lines between steps:** `1px solid white/10` vertical, `h-full` — on desktop only.

**Mobile:** 2 × 2 grid.

---

### 07 — Full-Width Photo CTA Banner

**Layout:** Full bleed (no max-width container), `min-height: 520px; position: relative; overflow: hidden;`

**Background photo:** `absolute inset-0 w-full h-full object-cover object-center z-0`
```jsx
{/* Image 9: portrait photography — behind-the-scenes of a photoshoot, camera and subject, dark warm studio atmosphere, cinematic */}

```

**Overlay:** `absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75 z-[1]`

**Content:** `relative z-10 flex flex-col items-center justify-center text-center h-full py-24 px-14`
- H2: Cormorant Garamond 300 italic, white, `text-[clamp(2.5rem,4.5vw,4.5rem)]`:
  "Ready to be photographed?"
- Body: "Book your portrait session in London. Available weekdays and weekends." — Inter 300, white/60, `text-[0.85rem] mb-10`
- CTA button: outlined — `border border-white/40 text-white text-[0.7rem] tracking-[0.16em] px-10 py-4 hover:bg-white hover:text-black transition-colors duration-300`
  Text: `BOOK YOUR SESSION`

---

### 08 — Testimonials

**Background:** `bg-[hsl(var(--surface-light))]`

**Padding:** `py-24 px-14`

**Layout:** centered single column, `max-w-[780px] mx-auto text-center`

**Overline:** `WHAT CLIENTS SAY`

**Large opening quote mark:** Cormorant Garamond italic, `text-[7rem] text-[#C8B8A8]/50 leading-[0] mb-4`

**Quote:** Cormorant Garamond 300 italic, `text-[clamp(1.5rem,2.5vw,2.2rem)] leading-[1.45] text-[#1A1210] mb-8`:
"Luna made me feel completely at ease. I don't usually love photos of myself, but these are the most beautiful I've ever had taken. She has a rare ability to capture who you actually are."

**Attribution:** `— Sarah M., London` — Inter 300, `text-[0.75rem] tracking-[0.14em] text-[#9A8A78]`

**Below: 3 review chips in a row (centered, `flex gap-6 justify-center mt-16`):**
```jsx


★★★★★

Google Reviews

4.9 · 84 reviews


```
Three cards: Google Reviews · Instagram · Testimonials

---

### 09 — Instagram Strip

**Background:** `bg-[hsl(var(--background))]` — dark

**Padding:** `py-16 px-14`

**Header:** `flex justify-between items-center mb-8`
- Left: `@LUNAVOSS` — Cormorant Garamond 300 italic, white, `text-[1.4rem]`
- Right: `FOLLOW ON INSTAGRAM →` — Inter 300, `text-[0.65rem] tracking-[0.16em]` white/40

**Photo strip:** `grid grid-cols-6 gap-2`
- 6 square photos, `aspect-ratio 1/1`, no border-radius, hover: `opacity-80 transition-opacity`
```jsx
{/* Images 10–15: portrait photography Instagram feed — mix of face close-ups, hands, editorial poses, outdoor and studio, dark and light tones, editorial B&W and warm film style */}
<img src="" alt="Instagram portrait photography feed" className="w-full h-full object-cover object-center" />
```

**Mobile:** `grid-cols-3 gap-1` — 6 photos in 2 rows.

---

### 10 — Booking / Contact

**Background:** `bg-[hsl(var(--surface-light))]`

**Padding:** `py-24 px-14`

**Layout:** `grid grid-cols-[1fr_1.1fr] gap-20 items-start`

**Left — text:**
- Overline: `BOOK A SESSION`
- H2: Cormorant Garamond 300 italic, dark: "Let's create something beautiful together."
- Body: "I'm currently booking portrait, editorial, and couples sessions in London and available for travel worldwide. Fill in the form and I'll get back to you within 24 hours." — Inter 300, `text-[0.82rem] leading-[1.9]` warm muted, `max-w-[340px] mb-10`
- Contact details (small, `flex flex-col gap-3`):
  - `hello@lunavoss.com`
  - `+44 (0) 7700 900 461`
  - `London, UK — worldwide travel available`
  - Each: Inter 300, `text-[0.78rem]` warm muted

**Right — form:**
```jsx



    Session type
    Mini Session · $150
    Signature Session · $350
    Editorial Session · $600
    Custom / other  <button type="submit">SEND REQUEST →</button>
</form>
```
**Input style:** `border-b border-[hsl(var(--border-light))] bg-transparent py-3 text-[0.82rem] font-[300] placeholder:text-[#B0A098] focus:outline-none focus:border-[#6A5A50] w-full` — no border-radius, no box. Underline-only inputs.

**Submit button:** `border border-[#1A1210] text-[#1A1210] text-[0.68rem] tracking-[0.16em] py-4 px-10 hover:bg-[#1A1210] hover:text-white transition-colors duration-300 mt-2`

**Mobile:** Single column, form below text.

---

### 11 — Footer

**Background:** `bg-[hsl(var(--background))]` — dark

**Padding:** `py-16 px-14`

**Top row:** `flex justify-between items-start pb-12 border-b border-white/10`
- Left: `LUNA VOSS` — Cormorant Garamond 300, `text-[1.2rem] tracking-[0.2em]` white + tagline below: `Portrait Photography · London` — Inter 300, `text-[0.65rem] tracking-[0.14em]` white/35 `mt-2`
- Right: Nav links in 2 columns — same style as navbar links, white/45

**Bottom row:** `flex justify-between items-center pt-8`
- `© 2025 Luna Voss. All rights reserved.` — Inter 300, `text-[0.62rem]` white/30
- Right: social links — `INSTAGRAM · BEHANCE · PINTEREST` — Inter 300, `text-[0.62rem] tracking-[0.12em]` white/35

---

## Animations

```
Navbar: no entrance animation — static absolute position
Hero headline lines:
  "PHOTO" → delay 0.1s, blur-up from y:30 blur:8px
  "About You" → delay 0.25s, same
Hero subtext block → delay 0.4s, opacity 0 → 1, y: 20 → 0
Hero CTAs → delay 0.55s
Small portrait overlay → delay 0.6s, opacity 0 → 1 (fade only, no y movement)
Social icons vertical → delay 0.7s, opacity 0 → 1

All scroll sections: IntersectionObserver (once: true, threshold: 0.12)
Section headers: stagger, first element delay 0, each +0.1s
Portfolio grid items: stagger 0.08s per card
Process steps: stagger 0.12s per step
Testimonial quote: single blur-up, duration 0.8s

Photo hover:
  Outer container: scale(1.0) → scale(1.03), 0.5s easeOut
  Inner img: scale(1.0) → scale(1.06), 0.5s easeOut
  Independent transforms create parallax effect
```

---

## Responsive

**Breakpoints:** `sm: 640px · md: 768px · lg: 1024px · xl: 1280px`

```
Desktop (lg+):
  Hero: grid-cols-[55%_45%], min-h-screen
  About: grid-cols-2
  Portfolio: grid-cols-3 with vertical offsets
  Pricing: grid-cols-3
  Process: grid-cols-4
  Booking: grid-cols-2

Tablet (md–lg):
  Hero: grid-cols-[52%_48%]
  About: grid-cols-2, gap reduced
  Portfolio: grid-cols-2, remove vertical offsets
  Pricing: grid-cols-2 (3rd card below, full width)
  Process: grid-cols-2
  Booking: grid-cols-1

Mobile (< md):
  Hero: single column — photo 60vh height, then dark panel below with text
  All grids: single column
  Portfolio: 2-column grid, equal heights, no offsets
  Instagram: 3-column grid
  Padding: px-6 everywhere
  Headline size: clamp bottom value (e.g. 3rem)
  Vertical social icons: hidden
```

---

## All Copy

**Brand:** LUNA VOSS

**Nav:** `Portfolio · About · Pricing · Contacts`

**Hero:**
- Label: `PORTRAIT PHOTOGRAPHER · LONDON, UK`
- H1 line 1: `PHOTO`
- H1 line 2 (italic): `About You`
- Body: `Timeless photography that captures who you truly are. Candid, elegant, and deeply personal portrait sessions in London.`
- CTA 1: `PORTFOLIO →`
- CTA 2: `GET IN TOUCH →`
- Social: `</body>@LUNAVOSS`
- Location: `LONDON, UK`

**About:**
- Label: `ABOUT ME`
- H2: `My goal is to capture you, your character, your story, your special essence.`
- P1: `Hello, I'm Luna Voss. As long as I can remember, photography has always been in my life. I tried many types of photography and understood that portrait photography was my passion — because it is the most honest and frank one.`
- P2: `My photographs are candid but elegant and sophisticated. I want to take really stylish, natural, and timeless photos of you. Looking forward to working with you.`
- Signature: `Photo, Luna →`

**Portfolio:**
- Label: `SELECTED WORK`
- H2: `Portfolio`
- Link: `MORE PHOTOS →`
- Category labels (below photos): `PORTRAIT SERIES · EDITORIAL · FASHION`
- Tabs: `All · Portrait · Editorial · Fashion · Couples`

**Pricing:**
- Label: `SESSIONS & PRICING`
- H2: `Every session, tailored to you.`
- Mini: `MINI SESSION · $150 · 1 hour · 15 edited photos · Online private gallery · 1 location`
- Signature: `SIGNATURE SESSION · $350 · 2–3 hours · 40 edited photos · 2 locations · Outfit change · Private gallery`
- Editorial: `EDITORIAL SESSION · $600 · 5 hours · 80 edited photos · 3 locations · Hair & makeup coordination · Printed lookbook`
- Card CTAs: `BOOK THIS SESSION →`

**Process:**
- Label: `THE PROCESS`
- H2: `What to expect.`
- Step 1: `01 · BOOK · Fill in the booking form. I'll confirm your date within 24 hours and we'll discuss your vision.`
- Step 2: `02 · PLAN · We'll talk about locations, outfits, and the mood you want. I'll guide you through every detail.`
- Step 3: `03 · SHOOT · The session itself — relaxed, candid, and directed. Most people are surprised by how natural it feels.`
- Step 4: `04 · RECEIVE · Your gallery arrives within 2 weeks. Fully edited, color-graded, and ready to download or print.`

**Photo CTA Banner:**
- H2: `Ready to be photographed?`
- Body: `Book your portrait session in London. Available weekdays and weekends.`
- CTA: `BOOK YOUR SESSION`

**Testimonials:**
- Label: `WHAT CLIENTS SAY`
- Quote: `"Luna made me feel completely at ease. I don't usually love photos of myself, but these are the most beautiful I've ever had taken. She has a rare ability to capture who you actually are."`
- Attribution: `— Sarah M., London`
- Chips: `Google Reviews · 4.9 · 84 reviews | Instagram · @lunavoss | 5-star rated`

**Instagram:**
- Handle: `@LUNAVOSS`
- Link: `FOLLOW ON INSTAGRAM →`

**Booking:**
- Label: `BOOK A SESSION`
- H2: `Let's create something beautiful together.`
- Body: `I'm currently booking portrait, editorial, and couples sessions in London and available for travel worldwide. Fill in the form and I'll get back to you within 24 hours.`
- Email: `hello@lunavoss.com`
- Phone: `+44 (0) 7700 900 461`
- Location: `London, UK — worldwide travel available`
- Form placeholders: `Your name · Email address · Phone number (optional) · Session type · Preferred date · Tell me about your vision...`
- Submit: `SEND REQUEST →`

**Footer:**
- Brand: `LUNA VOSS`
- Tagline: `Portrait Photography · London`
- Nav: `Portfolio · About · Pricing · Contacts · Instagram · Behance`
- Copyright: `© 2025 Luna Voss. All rights reserved.`
- Socials: `INSTAGRAM · BEHANCE · PINTEREST`

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.469.0",
  "@radix-ui/react-select": "latest"
}
```

---

## Quick Notes

- **Brand name** is "LUNA VOSS" — swap to your photographer's actual name before publishing.
- **Currency + pricing** ($150 / $350 / $600) — adjust to match real market rates for your region.
- **All images** are generated from descriptions — for a premium look, replace with actual portfolio shots. The prompt generates B&W editorial-style portraits automatically.
