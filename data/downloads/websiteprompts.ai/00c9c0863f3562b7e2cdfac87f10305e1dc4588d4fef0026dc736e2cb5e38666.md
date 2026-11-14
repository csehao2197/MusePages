Build a full single-page tattoo studio website called **OMEN INK** — dark, editorial, and raw. The overall aesthetic is high-contrast black with cream type, one muted sage-green accent, polaroid-style artwork displays, condensed display typography mixed with serif italics, and a masonry gallery. The site should feel like a premium underground studio — not corporate, not tryhard.

---

## Global Layout Rule — Centering

**Every section must be horizontally centered on the page.** This is a hard rule — no section, form, or block should ever be flush-left or left-aligned to the viewport edge.

Apply this wrapper to every section without exception:

```jsx
<section className="w-full px-8 md:px-16">
  <div className="max-w-7xl mx-auto">
    {/* section content here */}
  </div>
</section>
```

Narrower content (text blocks, forms, FAQ) uses a tighter inner container:

```jsx
<div className="max-w-3xl mx-auto">
  {/* form, FAQ, text content */}
</div>
```

**Rules:**
- `mx-auto` is required on every content container — never omit it
- `max-w-*` must always pair with `mx-auto` — a max-width without `mx-auto` will left-align
- Forms, contact blocks, and CTA sections are especially prone to drifting left — always wrap in `max-w-3xl mx-auto` or `max-w-2xl mx-auto`
- Do NOT use `ml-0` or `mr-auto` — that left-aligns the block
- Text alignment within sections: use `text-center` for headings/labels where layout is centered, `text-left` for body/form fields

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```

---

## Design System

```css
:root {
  --background: 0 0% 4%;          /* near-black #0A0A0A */
  --foreground: 40 20% 92%;       /* warm cream #EDE8DE */
  --primary: 130 14% 43%;         /* muted sage green #5B7B5E */
  --primary-foreground: 0 0% 4%;
  --muted: 0 0% 10%;              /* dark card bg */
  --muted-foreground: 40 8% 58%;  /* warm mid-grey */
  --border: 0 0% 16%;
  --accent: 40 20% 92%;           /* cream — used for accent labels */
}
```

Texture overlay: fixed, full-screen, `z-50 pointer-events-none`, film grain PNG at `opacity-[0.035]` with `mix-blend-mode: overlay`.

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

| Role | Font | Style |
|------|------|-------|
| Display / hero H1 | Bebas Neue | uppercase, tracking-widest, 10vw–15vw |
| Section headings | Cormorant Garamond | italic 600, 3.5rem–5rem |
| Sub-labels / tags | Inter | 500, 0.65rem, tracking-[0.25em] uppercase |
| Body / FAQ | Inter | 300–400, 1rem |
| Stats | Bebas Neue | 5rem |
| Footer giant type | Bebas Neue | 18vw |

---

## Button System

Three explicit button sizes — always `inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap`:

```jsx
// Primary — sage green fill
<button className="h-12 px-8 inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-inter text-sm font-medium tracking-[0.15em] uppercase transition-opacity hover:opacity-80">
  Book a Session
</button>

// Ghost — cream outline
<button className="h-10 px-6 inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap border border-[hsl(var(--foreground))] text-[hsl(var(--foreground))] font-inter text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]">
  View Artists
</button>

// Text link
<button className="h-10 px-0 inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-[hsl(var(--muted-foreground))] font-inter text-sm tracking-[0.1em] uppercase hover:text-[hsl(var(--foreground))] transition-colors">
  Learn More <ArrowRight className="w-4 h-4 shrink-0" />
</button>
```

---

## Visual Effects

**Staggered word animation on hero:**
```
Each word: initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.08 }}
```

**Polaroid card tilt:**
```
Alternating slight rotations: rotate-[-2deg], rotate-[1.5deg], rotate-[-1deg], rotate-[2.5deg]
White border: border-[8px] border-white with shadow-[0_8px_32px_rgba(0,0,0,0.6)]
Card top: artwork image square-crop
Card bottom: handwritten-style caption, font-cormorant italic
```

**Masonry gallery hover:**
```
Each item: scale-[1.03] on hover, transition-transform duration-500 ease-out
Overlay: opacity-0 → opacity-100 on hover, bg-black/50 with sage-green label bottom-left
```

**Stat counter animation:**
```
useEffect with requestAnimationFrame, counting from 0 to target on IntersectionObserver trigger
Duration: 1800ms, easing: ease-out cubic
```

**FAQ accordion:**
```
AnimatePresence + motion.div with height: 0 → auto, opacity: 0 → 1
Toggle icon: + rotates to × (rotate-45 on open)
```

---

## Component Breakdown

### 1. Navbar
```
Position: fixed top-0 w-full z-40
Background: black/80 backdrop-blur-md border-b border-white/5
Padding: px-8 py-5
Layout: flex justify-between items-center

Left: Logo — "OMEN INK" in Bebas Neue text-xl tracking-[0.3em], cream
Center (desktop): nav links — Work | Artists | Process | FAQ — Inter 300 text-xs tracking-[0.2em] uppercase, muted-foreground, hover cream
Right: "Book Now" ghost button h-9 px-5

Mobile: hamburger icon → full-screen overlay menu, nav links stacked, large Cormorant italic style
```

### 2. Hero
```
Height: min-h-screen, relative overflow-hidden
Background: absolute inset-0 — full-bleed tattoo photography

[Media brief: image | dark studio environment — tattooist's hands working on a forearm, close-up, dim workshop lighting, black and grey palette, moody | any composition works — layout uses gradient overlay for legibility]

Gradient overlay: linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.15) 40%, rgba(10,10,10,0.75) 100%)

Hero content: absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 z-10

Top-left badge (absolute top-8 left-8):
  Inter 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--primary))] — "EST. 2009 — BROOKLYN, NY"

H1: Bebas Neue, split into words array, staggered blur-fade-up animation
  Line 1: text-[12vw] leading-none cream — "WHEN INK"
  Line 2: text-[12vw] leading-none cream — "BECOMES ART"

Subline: Cormorant Garamond italic 400, text-xl md:text-2xl muted-foreground, max-w-md, animate in after H1 with 0.5s delay
  "Custom tattoo studio. No flash. No shortcuts. Every piece is a collaboration."

CTA row: flex gap-4 mt-8 — "Book a Session" (primary button) + "View Our Work" (ghost button)

Scroll indicator: absolute bottom-8 right-8 — vertical line 60px + "SCROLL" rotated 90°, muted-foreground, Inter 300 text-[0.6rem] tracking-[0.3em]
```

### 3. Stats Bar
```
Section: bg-[hsl(var(--muted))] border-y border-[hsl(var(--border))] py-10 px-8
Layout: grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center

4 stats — counter animation triggers on scroll via IntersectionObserver:
  "1,250+" — "Tattoos completed"
  "15 Yrs" — "In the industry"
  "750+" — "Returning clients"
  "8" — "Artists on roster"

Each stat:
  Number: Bebas Neue text-5xl md:text-6xl cream
  Label: Inter 300 text-xs tracking-[0.2em] uppercase muted-foreground, mt-1

Thin vertical dividers between items on desktop: border-r border-[hsl(var(--border))] last:border-0
```

### 4. Process Steps — Polaroid Style
```
Section: py-24 px-8 md:px-16 max-w-7xl mx-auto

Section label: Inter 500 text-xs tracking-[0.25em] uppercase text-[hsl(var(--primary))] mb-4 — "HOW IT WORKS"
Section heading: Cormorant Garamond italic 600 text-4xl md:text-5xl cream — "The Process"

Cards grid: grid grid-cols-1 md:grid-cols-4 gap-6 mt-16

4 polaroid cards — alternating slight CSS rotations:
  Card 1 — rotate-[-2deg]:
    Image (square, object-cover): tattoo design sketches on paper, pencil drafts, dark surface
    White padding-bottom caption area: "01 — Share Your Idea"
    Body: Inter 300 text-sm text-gray-500 mt-1 — "Tell us what you want. Reference images, vibes, placement."

  Card 2 — rotate-[1.5deg]:
    Image: tattooist sketching on paper, detail close-up, ink pens, dark workspace
    Caption: "02 — Design Review"
    Body: "We draft your custom piece and refine until it's exactly right."

  Card 3 — rotate-[-1deg]:
    Image: tattooing in progress, needle on skin, black and grey work visible, studio setting
    Caption: "03 — Tattoo Session"
    Body: "Come in, relax. Our artists work with precision and care."

  Card 4 — rotate-[2deg]:
    Image: healed tattoo detail, sharp lines, close-up on arm or forearm
    Caption: "04 — Aftercare"
    Body: "We send you home with everything you need to protect your piece."

Polaroid styling:
  bg-white, border-[10px] border-white (top/sides/bottom more for caption)
  shadow-[0_12px_40px_rgba(0,0,0,0.7)]
  Image: aspect-square w-full object-cover object-center
  Caption area: bg-white p-3 pt-2
  Number + title: font-cormorant italic text-gray-800 text-base
  Body: font-inter text-xs text-gray-400
```

### 5. Artist Profiles
```
Section: py-24 px-8 md:px-16 bg-[hsl(var(--muted))]

Section label + heading:
  "OUR ARTISTS" / "The Roster"

Grid: grid grid-cols-2 md:grid-cols-4 gap-px (gap-px with bg-[hsl(var(--border))] for grid lines)

4 artist cards — hover reveals social + booking link:
  Card: relative overflow-hidden aspect-[3/4] bg-[hsl(var(--muted))]

  Image (fill): portrait of tattoo artist in studio
    Card 1 — [Media brief: image | tattoo artist portrait, dark studio, arms visible with tattoos, serious expression, dim overhead light, black and grey palette]
    Card 2 — [Media brief: image | female tattoo artist at her station, tattoo machine in hand, dark background, confident posture]
    Card 3 — [Media brief: image | male tattoo artist with sleeve tattoos, dark clothing, studio mirror reflection visible]
    Card 4 — [Media brief: image | tattoo artist close-up, focused expression, tools visible, moody low-key lighting]

  Bottom info bar (always visible):
    bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 inset-x-0 p-4
    Artist name: Bebas Neue text-2xl cream tracking-[0.1em]
    Specialty: Inter 300 text-xs tracking-[0.2em] uppercase text-[hsl(var(--primary))]

  Hover overlay (opacity-0 → opacity-100 via group-hover):
    bg-black/60 absolute inset-0 flex items-center justify-center
    "View Portfolio" ghost button

Artists:
  "MARCUS COLE" — "Japanese & Neo-Traditional"
  "ELENA VOSS" — "Fine Line & Botanical"
  "DAYO OKAFOR" — "Black & Grey Realism"
  "IZZY PARK" — "Geometric & Blackwork"
```

### 6. Artwork Gallery — Masonry
```
Section: py-24 px-8 md:px-16 max-w-7xl mx-auto

Section label + heading:
  "RECENT WORK" / "The Portfolio"

Tab row: 5 filter tabs — All | Black & Grey | Fine Line | Japanese | Geometric
  Inter 500 text-xs tracking-[0.2em] uppercase
  Active: cream + border-b-2 border-[hsl(var(--primary))]
  Inactive: muted-foreground

Masonry grid: columns-2 md:columns-3 lg:columns-4 gap-2 mt-10

12 artwork images with break-inside-avoid mb-2:
  Mix of tall and wide aspect ratios to create masonry variation
  All: group relative overflow-hidden

  Image briefs (mood only — no composition requirements):
  [Media brief: image | black and grey sleeve tattoo detail, flowers and skull motif, high contrast, skin close-up]
  [Media brief: image | fine line botanical tattoo on forearm, delicate linework, light skin background]
  [Media brief: image | japanese dragon tattoo on upper arm, bold lines, traditional palette]
  [Media brief: image | geometric mandala tattoo on shoulder, precise black lines, overhead lighting]
  [Media brief: image | blackwork abstract tattoo on ribcage, ornamental patterns]
  [Media brief: image | realism portrait tattoo, face detail, black and grey shading, photographic quality]
  [Media brief: image | minimalist single-needle tattoo, thin lines, small placement on wrist]
  [Media brief: image | neo-traditional rose tattoo, bold outline, limited color palette]
  [Media brief: image | dotwork geometric tattoo closeup, stippling texture, black ink]
  [Media brief: image | large back piece in progress, full coverage, dark studio, tattooist hands visible]
  [Media brief: image | healed fine line tattoo, snake motif, clean linework on forearm]
  [Media brief: image | ornamental chest piece tattoo, symmetrical design, dark moody photography]

  Hover state: scale-[1.04] + sage-green label bottom-left
    "Fine Line" / "Black & Grey" etc — Inter 500 text-[0.6rem] tracking-[0.2em] uppercase, bg-[hsl(var(--primary))] px-2 py-1
```

### 7. Values
```
Section: py-24 px-8 md:px-16 border-y border-[hsl(var(--border))]

3-column grid: grid grid-cols-1 md:grid-cols-3 divide-x divide-[hsl(var(--border))]

Each column: px-10 first:pl-0 last:pr-0

Ornamental icon: thin SVG line ornament (asterisk or cross motif), text-[hsl(var(--primary))] text-3xl mb-6

Heading: Cormorant Garamond italic 600 text-3xl cream
Body: Inter 300 text-sm leading-relaxed muted-foreground mt-4 max-w-xs

Value 1 — "Artistry"
  "Every tattoo is an original. We don't copy, trace, or compromise on craft."

Value 2 — "Devotion"
  "We give your piece the time it deserves. No rush. No assembly line."

Value 3 — "Permanence"
  "You carry this forever. We take that seriously — from the first sketch to the last line."
```

### 8. FAQ Accordion
```
Section: py-24 px-8 md:px-16 max-w-3xl mx-auto

Section label + heading:
  "FAQ" / "Common Questions"

6 accordion items — AnimatePresence, height animation on open:

  Each item:
    border-b border-[hsl(var(--border))] py-5
    Question row: flex justify-between items-center cursor-pointer
      Question: Cormorant Garamond italic 600 text-xl cream
      Icon: "+" → "×" (rotate-45 or swap) in text-[hsl(var(--primary))]
    Answer: motion.div with overflow-hidden, Inter 300 text-sm leading-relaxed muted-foreground mt-3

  Q1: "Do you take walk-ins?"
  A1: "We occasionally have walk-in availability, but most of our artists book out 2–4 weeks in advance. Reach out via our booking form and we'll let you know current wait times."

  Q2: "How much does a custom tattoo cost?"
  A2: "Pricing depends on size, complexity, and placement. Our minimum is $150. Most custom pieces range from $300–$800+. We'll give you a proper quote after reviewing your concept."

  Q3: "Can I bring my own reference design?"
  A3: "Absolutely. Bring whatever inspires you — photos, artwork, sketches. Our artists will redesign it into something custom and unique to you."

  Q4: "How should I prepare for my session?"
  A4: "Eat a full meal beforehand, stay hydrated, wear comfortable clothing that gives easy access to the placement area. Avoid alcohol 24 hours before your appointment."

  Q5: "What styles do your artists specialize in?"
  A5: "Our roster covers black & grey realism, fine line, botanical, Japanese traditional, geometric and blackwork, and neo-traditional. Check each artist's profile to find your match."

  Q6: "Do you do cover-ups?"
  A6: "Yes, but not all pieces are coverable. Send us a photo of your existing tattoo and we'll give you an honest assessment before booking anything."
```

### 9. Booking CTA
```
Section: py-32 px-8 md:px-16 relative overflow-hidden

Background: absolute inset-0 — tattoo studio photography with strong gradient overlay
[Media brief: image | tattoo studio interior, tools laid out on tray, dark dramatic lighting, equipment detail]
Gradient overlay: absolute inset-0 bg-gradient-to-r from-[hsl(var(--background))]/95 via-[hsl(var(--background))]/70 to-transparent

Content: relative z-10 max-w-2xl

Eyebrow: "READY TO GET TATTOOED?" — Inter 500 text-xs tracking-[0.3em] uppercase text-[hsl(var(--primary))]
Heading: Cormorant Garamond italic 600 text-5xl md:text-6xl cream leading-tight mt-3
  "Start your collaboration."
Body: Inter 300 text-base muted-foreground mt-6 max-w-lg
  "Fill out the form below and we'll reach out within 48 hours to discuss your idea, timeline, and which artist is the best fit."

Contact form (mt-10):
  grid grid-cols-1 md:grid-cols-2 gap-4

  Inputs: bg-[hsl(var(--muted))] border border-[hsl(var(--border))] h-12 px-4 text-sm text-cream placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] outline-none transition-colors

  Name (full width), Email, Phone, Placement (text: "Where on the body?"), Style Preference (select: Black & Grey / Fine Line / Japanese / Geometric / Other), Message (textarea, h-32, col-span-2), File upload (col-span-2, dashed border, "Attach reference images — JPG or PNG, max 10MB")

  Submit: "Send Enquiry" primary button h-12 px-10 mt-2 w-full md:w-auto
```

### 10. Footer
```
Section: pt-24 pb-12 px-8 md:px-16 border-t border-[hsl(var(--border))]

Giant type: Bebas Neue text-[18vw] leading-none cream opacity-10 select-none overflow-hidden
  "OMEN INK"

Info row (overlaps the giant text visually via negative margin or relative positioning):
  mt-[-4rem] relative z-10
  grid grid-cols-1 md:grid-cols-4 gap-8

  Col 1:
    "OMEN INK" Bebas Neue text-lg tracking-[0.3em] cream
    "Custom Tattoo Studio" Inter 300 text-xs muted-foreground mt-1
    "Brooklyn, New York" text-xs muted-foreground

  Col 2 — "Studio":
    Label: Inter 500 text-xs tracking-[0.25em] uppercase text-[hsl(var(--primary))] mb-4
    Links: Work, Artists, Process, FAQ — Inter 300 text-sm muted-foreground hover:text-cream block mb-2

  Col 3 — "Contact":
    Email: studio@omenink.com
    Phone: +1 (347) 555-0182
    Hours: Mon–Sat, 11am–8pm

  Col 4 — "Follow":
    @omenink — Instagram
    @omenink — TikTok
    Omen Ink — Pinterest

  Bottom bar: mt-16 flex justify-between items-center border-t border-[hsl(var(--border))] pt-6
    "© 2026 Omen Ink. All rights reserved." Inter 300 text-xs muted-foreground
    "Brooklyn, New York" — same style
```

---

## Animations Summary

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero H1 words | blur + fade-up, staggered 0.08s per word | on load |
| Hero subline + CTA | fade-up, delay 0.6s | on load |
| Stats counters | count 0 → target, 1800ms ease-out | IntersectionObserver |
| Polaroid cards | fade-up + slight tilt settle, staggered | IntersectionObserver |
| Artist cards hover | overlay fade, scale | hover |
| Gallery items hover | scale 1.04 + label fade | hover |
| FAQ accordion | height + opacity expand | click |
| Section headings | opacity 0 → 1, y 20 → 0 | IntersectionObserver |

---

## Responsive

**Mobile (< 768px):**
- Hero H1: text-[18vw] → 2 lines
- Stats: 2×2 grid
- Polaroid cards: single column, centered, no rotation
- Artist grid: 2-column
- Gallery masonry: 2 columns
- Values: stacked, no dividers
- Footer columns: stacked

**Desktop (≥ 768px):**
- All grids as specified
- Polaroid rotations active
- Stats 4-column
- Masonry 4 columns

---

## All Copy

**Brand:** OMEN INK — Custom Tattoo Studio
**Tagline:** "When ink becomes art."
**Subline:** "Custom tattoo studio. No flash. No shortcuts. Every piece is a collaboration."
**Location badge:** EST. 2009 — BROOKLYN, NY

**Nav:** Work · Artists · Process · FAQ · Book Now

**Stats:** 1,250+ Tattoos completed · 15 Yrs In the industry · 750+ Returning clients · 8 Artists on roster

**Process:** Share Your Idea · Design Review · Tattoo Session · Aftercare

**Artists:** Marcus Cole — Japanese & Neo-Traditional · Elena Voss — Fine Line & Botanical · Dayo Okafor — Black & Grey Realism · Izzy Park — Geometric & Blackwork

**Gallery tabs:** All · Black & Grey · Fine Line · Japanese · Geometric

**Values:** Artistry · Devotion · Permanence

**Booking CTA:** "READY TO GET TATTOOED?" / "Start your collaboration."
Body: "Fill out the form below and we'll reach out within 48 hours to discuss your idea, timeline, and which artist is the best fit."

**Footer socials:** @omenink — Instagram · @omenink — TikTok · Omen Ink — Pinterest

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx"
}
```

---

*Quick notes:*
- *Polaroid card rotations use inline `style={{ transform: 'rotate(-2deg)' }}` rather than Tailwind arbitrary values — more reliable across builders*
- *Masonry is CSS `columns-` based, no external library needed*
- *Gallery filter tabs currently static — add `useState` to toggle visibility per category if builder supports it*
