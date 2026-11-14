# Personal Trainer Website — FORGE

Build a cinematic single-page personal trainer website called "FORGE" — dark black background, orange accent (#FF4D00), bold condensed uppercase typography, gym photography throughout. Aggressive, motivational, premium fitness aesthetic.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```

---

## Design System

```css
:root {
  --background: 0 0% 3%;
  --foreground: 0 0% 97%;
  --primary: 18 100% 50%;          /* #FF4D00 orange */
  --primary-foreground: 0 0% 0%;
  --muted: 0 0% 8%;
  --muted-foreground: 0 0% 55%;
  --border: 0 0% 14%;
  --card: 0 0% 6%;
}
```

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

- **Headings**: Barlow Condensed 900, uppercase, tracking-tight
- **Sub-headings / labels**: Barlow Condensed 700, uppercase, tracking-[0.15em]
- **Body / UI**: Inter 400–500
- **Stats / numbers**: Barlow Condensed 800, text-primary

---

## Visual Effects

### 1. Grain texture overlay (fixed, full-screen)
```tsx



```

### 2. Glassmorphism navbar
```css
background: rgba(5, 5, 5, 0.75);
backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(255, 255, 255, 0.06);
```

### 3. Orange glow CTA
```css
.cta-primary {
  background: #FF4D00;
  box-shadow: 0 0 32px rgba(255, 77, 0, 0.4), 0 0 64px rgba(255, 77, 0, 0.15);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}
.cta-primary:hover {
  box-shadow: 0 0 48px rgba(255, 77, 0, 0.6), 0 0 96px rgba(255, 77, 0, 0.25);
  transform: translateY(-2px);
}
```

### 4. Staggered entrance animations (Framer Motion)
```tsx
initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
// Triggered by useInView with once: true, margin: "-80px"
```

### 5. Before/After transformation slider
```tsx
// Horizontal clip reveal — drag handle controls clip-path of "after" image
// after image: clipPath: `inset(0 0 0 ${100 - sliderPos}%)`
// drag handle: absolute, left: `${sliderPos}%`, cursor grab
```

---

## Component Breakdown

### 1 — Navbar

- Fixed top, h-[68px], z-50, full width
- Glass background (see above)
- max-w-[1120px] mx-auto px-6, flex justify-between items-center
- Left: logo mark (orange square 20×20 + "FORGE" in Barlow Condensed 800 tracking-widest)
- Center (desktop only): nav links — "Services" · "Results" · "About" · "Contact"
  - `text-sm font-medium text-muted-foreground hover:text-white transition-colors`
- Right: `h-10 px-6 rounded-lg bg-primary text-black text-sm font-semibold hover:opacity-90` — "Book a Session"
- Mobile: hamburger icon (lucide Menu), hide center nav

---

### 2 — Hero

- `min-h-screen relative flex items-end overflow-hidden`
- Full-screen background image, gradient overlay for text legibility

```tsx
{/* Image: male personal trainer in black compression shirt, powerful physique, dramatic gym lighting, dark cinematic background with bokeh orange light streaks, high contrast, professional athletic photography */}

```

- Gradient overlay: `absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 z-[1]`
- Orange side glow: `absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(255,77,0,0.12)] z-[2]`
- Content: `relative z-10 max-w-[1120px] mx-auto px-6 pb-16 md:pb-24 w-full`

**Label:** `text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4` — "Personal Training & Coaching"

**H1:**
```tsx



  YOUR TRUSTED
PERSONAL

  TRAINER



```

**Sub:** `text-base text-muted-foreground mt-6 max-w-[420px] leading-relaxed` — "Professional personal training and online coaching. Real programs. Real results."

**CTAs:** `flex gap-3 mt-8 flex-wrap`
- Primary: `cta-primary h-12 px-8 rounded-lg text-black font-semibold text-sm` — "Book a Session →"
- Secondary: `h-12 px-8 rounded-lg border border-border text-white text-sm font-medium hover:border-primary/40 transition-colors` — "View Results"

**Stats row:** `flex gap-8 mt-12 pt-8 border-t border-border`
```
200+          10 yrs          5×
Clients       Experience      Champion
```
Each stat: number in `font-['Barlow_Condensed'] text-4xl font-black text-primary`, label in `text-xs text-muted-foreground uppercase tracking-widest mt-1`

---

### 3 — Services

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- Label: `text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4` — "What I Offer"
- H2: `font-['Barlow_Condensed'] font-black uppercase text-5xl md:text-6xl text-white` — "PROGRAMS BUILT FOR RESULTS"
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-5 mt-16`

**Card pattern:** `rounded-2xl p-7 bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:border-primary/30 transition-all duration-300 group`

| Icon (lucide) | Title | Description |
|---|---|---|
| `Dumbbell` | 1-ON-1 TRAINING | Fully personalized programs designed around your goals, schedule, and current fitness level. In-person sessions in Prague or online. |
| `Laptop` | ONLINE COACHING | Custom training + nutrition plan, weekly check-ins, and direct access to me via app. Train from anywhere in the world. |
| `Apple` | NUTRITION PLANS | Science-backed meal plans tailored to your body, your goals, and your lifestyle. No fads, no restrictions — just results. |

Card internals:
- Icon: `w-10 h-10 text-primary mb-5 group-hover:scale-110 transition-transform`
- Title: `font-['Barlow_Condensed'] font-bold uppercase text-xl text-white tracking-wide mb-3`
- Body: `text-sm text-muted-foreground leading-relaxed`
- Bottom: orange bottom border `h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 mt-6`

---

### 4 — Client Results (Transformations)

- `py-24 md:py-32 bg-[hsl(var(--muted))]`
- max-w-[1120px] mx-auto px-6
- Label: `text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4` — "Results Speak for Themselves"
- H2: `font-['Barlow_Condensed'] font-black uppercase text-5xl md:text-6xl text-white` — "CLIENT TRANSFORMATIONS"
- Sub: `text-sm text-muted-foreground mt-4 max-w-[480px]` — "Every transformation started with one session. These are real clients with real results — no photoshop, no shortcuts."
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6 mt-16`

**Transformation card (3 cards):**
```tsx



  {/* Before/after image pair */}
  


    {/* Image: male fitness transformation — before photo left half, after photo right half, split panel format, gym environment, dramatic lighting */}
    
    {/* BEFORE / AFTER labels */}
    Before
    After


    

PHILIP'S HARD WORK PAID OFF


    

12-Month Transformation


    

Philip aimed to lose fat and build muscle. With determination and a solid plan, he succeeded remarkably.


```

Transformation data (3 cards):

| Name/Headline | Duration | Tagline |
|---|---|---|
| PHILIP'S HARD WORK PAID OFF | 12-Month Transformation | Philip aimed to lose fat and build muscle. With determination and a solid plan, he succeeded remarkably. |
| ANNA FOUND HER CONFIDENCE | 6-Month Transformation | Anna wanted to feel strong again. She came in uncertain — she left unstoppable. |
| MARCUS WENT ALL IN | 8-Month Transformation | Marcus had tried every program. This was the last one he ever needed. |

---

### 5 — Testimonials

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- H2: `font-['Barlow_Condensed'] font-black uppercase text-4xl md:text-5xl text-white` — "WHAT CLIENTS SAY"
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-5 mt-14`

**Testimonial card:** `rounded-2xl p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))]`
- Stars: 5× `★` in `text-primary text-sm`
- Quote: `text-sm text-foreground leading-relaxed mt-4 italic` — full quote text
- Author: `text-xs font-semibold text-primary uppercase tracking-widest mt-5` — name + duration

| Quote | Author |
|---|---|
| "Peter is really an awesome coach. The results we achieved in just 2 months are beyond what I thought possible. He keeps you accountable every single day." | Mark D. — 2 months |
| "My progress has been astonishing. I feel empowered and motivated like never before. The program was tailored exactly to my life." | Sarah T. — 4 months |
| "This journey has been incredibly rewarding. I am so thankful for the structure, the guidance, and the genuine care Peter puts into every session." | James R. — 6 months |

---

### 6 — About

- `py-24 md:py-32 bg-[hsl(var(--muted))]`
- max-w-[1120px] mx-auto px-6
- `grid grid-cols-1 md:grid-cols-2 gap-16 items-center`

**Left — image:**
```tsx



  {/* Image: male personal trainer, confident pose, arms crossed, gym environment with training equipment, dramatic side lighting, orange warm tones, dark moody background */}
  
  {/* Floating stat badge */}
  


    

10+


    

Years of Experience


```

**Right — text:**
- Label: `text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4` — "About Me"
- H2: `font-['Barlow_Condensed'] font-black uppercase text-5xl text-white leading-none` — "FAVORITE CERTIFIED PERSONAL TRAINER!"
- Body: `text-sm text-muted-foreground leading-relaxed mt-6`
  > "The ultimate line between your dreams and reality is called Action."
  > I've spent over a decade helping people transform their bodies and their confidence. My methods combine science-based training, honest nutrition, and the kind of accountability that actually sticks. Whether you're starting from zero or pushing past a plateau — I'm here to get you there.
- Certs: `flex flex-wrap gap-2 mt-8`
  - Each: `text-xs border border-border px-3 py-1.5 rounded-full text-muted-foreground`
  - "NASM Certified" · "Precision Nutrition" · "Olympic Lifting" · "Online Coaching"
- CTA: `mt-8 h-12 px-8 rounded-lg bg-primary text-black font-semibold text-sm inline-flex items-center gap-2 cta-primary` — "Work With Me →"

---

### 7 — Book a Session (Full-width CTA)

- `relative py-24 md:py-32 overflow-hidden`
- Background:
```tsx
{/* Image: dramatic gym interior — squat racks, barbell plates, moody low lighting, empty floor, cinematic depth of field, dark orange atmospheric glow */}



```
- Content: `relative z-10 max-w-[720px] mx-auto px-6 text-center`
- Label: `text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4` — "Limited Spots Available"
- H2: `font-['Barlow_Condensed'] font-black uppercase text-[clamp(3rem,8vw,6rem)] leading-none text-white`
  ```
  LET'S GET YOU
  YOUR DREAM BODY!
  ```
- Sub: `text-sm text-muted-foreground mt-6` — "Book your first free consultation call. No commitment. Just a conversation about your goals."
- CTA: `mt-10 h-14 px-12 rounded-lg bg-primary text-black font-bold text-base inline-flex items-center gap-2 cta-primary` — "Let's Schedule Your First Session →"

---

### 8 — Footer

- `py-12 border-t border-[hsl(var(--border))]`
- max-w-[1120px] mx-auto px-6
- `flex flex-col md:flex-row justify-between items-start md:items-center gap-6`
- Left: logo + `text-xs text-muted-foreground mt-2` — "© 2025 Peter Cooper — Personal Trainer & Coach"
- Center (desktop): `flex gap-6 text-xs text-muted-foreground` — "Services" · "Results" · "About" · "Contact"
- Right: social icons (lucide Instagram, Youtube, Twitter/X) — `w-4 h-4 text-muted-foreground hover:text-white transition-colors`

---

## Animations

```
Navbar: opacity 0 → 1, delay 0, duration 0.4s
Hero label: opacity 0, y 16 → 0, blur 6px → 0, delay 0.1s
Hero H1 words: stagger per word, delay 0.2s + index*0.08, duration 0.55s
Hero sub: delay 0.55s, duration 0.5s
Hero CTAs: delay 0.7s, duration 0.5s
Hero stats: stagger per stat, delay 0.85s + index*0.1
All sections: useInView once:true, margin "-80px" → stagger children 0.1s
Service cards: y 40 → 0, opacity 0 → 1, stagger 0.08s per card
Transformation cards: y 40 → 0, opacity 0 → 1, stagger 0.1s
Testimonial cards: y 30 → 0, opacity 0 → 1, stagger 0.08s
About section: left col slideInLeft (x -40 → 0), right col fade up, simultaneous
CTA section: scale 0.95 → 1, opacity 0 → 1, duration 0.6s
```

---

## Responsive

```
Navbar: desktop → full nav links + CTA; mobile → logo + hamburger only, links hidden
Hero H1: clamp(4.5rem, 12vw, 10rem) — scales naturally
Hero CTAs: flex-row desktop → flex-col w-full max-w-[320px] mx-auto mobile
Hero stats: flex-wrap, gap reduced on mobile
Services grid: 3-col desktop → 1-col mobile
Transformations grid: 3-col desktop → 1-col mobile
Testimonials grid: 3-col desktop → 1-col mobile
About: 2-col desktop → 1-col mobile (image first, text below), image h-[400px] mobile
CTA H2: clamp(3rem, 8vw, 6rem) — scales naturally
Footer: row desktop → column mobile
```

---

## Full Copy

| Element | Copy |
|---------|------|
| Logo | FORGE |
| Nav links | Services · Results · About · Contact |
| Nav CTA | Book a Session |
| Hero label | Personal Training & Coaching |
| Hero H1 | YOUR TRUSTED / PERSONAL / TRAINER |
| Hero sub | Professional personal training and online coaching. Real programs. Real results. |
| Hero CTA primary | Book a Session → |
| Hero CTA secondary | View Results |
| Stats | 200+ Clients · 10 yrs Experience · 5× Champion |
| Services label | What I Offer |
| Services H2 | PROGRAMS BUILT FOR RESULTS |
| Service 1 | 1-ON-1 TRAINING — Fully personalized programs designed around your goals, schedule, and current fitness level. In-person or online. |
| Service 2 | ONLINE COACHING — Custom training + nutrition plan, weekly check-ins, and direct access via app. Train from anywhere. |
| Service 3 | NUTRITION PLANS — Science-backed meal plans tailored to your body and your goals. No fads, no restrictions — just results. |
| Transformations label | Results Speak for Themselves |
| Transformations H2 | CLIENT TRANSFORMATIONS |
| Transformations sub | Every transformation started with one session. Real clients, real results — no photoshop, no shortcuts. |
| About label | About Me |
| About H2 | FAVORITE CERTIFIED PERSONAL TRAINER! |
| About quote | "The ultimate line between your dreams and reality is called Action." |
| About body | I've spent over a decade helping people transform their bodies and their confidence. My methods combine science-based training, honest nutrition, and the kind of accountability that actually sticks. Whether you're starting from zero or pushing past a plateau — I'm here to get you there. |
| CTA label | Limited Spots Available |
| CTA H2 | LET'S GET YOU / YOUR DREAM BODY! |
| CTA sub | Book your first free consultation call. No commitment. Just a conversation about your goals. |
| CTA button | Let's Schedule Your First Session → |
| Footer | © 2025 Peter Cooper — Personal Trainer & Coach |

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx"
}
```
