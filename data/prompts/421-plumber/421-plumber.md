# Plumber Website — SWIFT Plumbing

Build a modern, trustworthy plumbing company website called "SWIFT Plumbing" — dark charcoal background, electric blue accent (#0EA5E9), clean sans-serif typography. Phone number and emergency availability front and center. Looks nothing like a typical plumber site.

---

## Tech Stack

```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```

---

## Design System

```css
:root {
  --background: 220 25% 7%;
  --foreground: 210 20% 96%;
  --primary: 199 89% 48%;          /* #0EA5E9 electric blue */
  --primary-foreground: 0 0% 100%;
  --muted: 220 20% 12%;
  --muted-foreground: 215 15% 55%;
  --border: 220 18% 18%;
  --card: 220 22% 10%;
}
```

---

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

- **Display headings**: Plus Jakarta Sans 800, tight tracking
- **Section headings**: 700
- **Body / UI**: 400–500
- **Labels**: 600, uppercase, tracking-[0.14em], text-xs

---

## Button System — Apply to every button, no exceptions

```tsx
// Small — navbar, secondary links
className="h-10 px-5 rounded-lg inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-sm font-semibold transition-all duration-200"

// Default CTA — section buttons
className="h-12 px-7 rounded-xl inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-sm font-bold transition-all duration-200"

// Large CTA — hero, emergency sections
className="h-14 px-10 rounded-xl inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-base font-bold transition-all duration-200"
```

**Non-negotiable rules:**
- `h-{n}` explicit height on every button — never rely on padding alone
- `inline-flex items-center justify-center` — never `flex`, never block
- `shrink-0` — button never compresses inside flex parent
- `whitespace-nowrap` — text never wraps inside button
- Icons inside buttons: always `w-4 h-4 shrink-0`

---

## Visual Effects

### 1. Blue glow — CTA buttons + phone

```css
.glow-blue {
  box-shadow: 0 0 24px rgba(14,165,233,0.35), 0 0 48px rgba(14,165,233,0.12);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}
.glow-blue:hover {
  box-shadow: 0 0 36px rgba(14,165,233,0.55), 0 0 72px rgba(14,165,233,0.2);
  transform: translateY(-2px);
}
```

### 2. Animated stat counters

```tsx
function useCounter(target: number, duration = 1800, inView: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])
  return count
}
// Trigger via useInView({ once: true })
```

### 3. Glassmorphism — navbar + cards

```css
/* Navbar */
background: rgba(14, 20, 32, 0.82);
backdrop-filter: blur(14px);
border-bottom: 1px solid rgba(255,255,255,0.06);

/* Cards */
background: rgba(255,255,255,0.03);
backdrop-filter: blur(6px);
border: 1px solid rgba(255,255,255,0.07);
box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
```

### 4. Staggered entrance (Framer Motion)

```tsx
initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.09 }}
viewport={{ once: true, margin: "-60px" }}
```

### 5. Grain texture overlay

```tsx
<div
  className="fixed inset-0 z-50 pointer-events-none opacity-[0.25]"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    mixBlendMode: "overlay",
  }}
/>
```

---

## Component Breakdown

### 1 — Navbar

- Fixed top, h-[68px], z-50, glass background
- max-w-[1120px] mx-auto px-6, flex justify-between items-center
- Left: `<span className="text-lg font-extrabold tracking-tight">SWIFT <span className="text-primary">Plumbing</span></span>`
- Center (desktop only): nav links `text-sm font-medium text-muted-foreground hover:text-white transition-colors` — "Services · About · Areas · Contact"
- Right: phone CTA button
  ```tsx
  <a href="tel:5550123456"
    className="h-10 px-5 rounded-lg inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-primary text-white text-sm font-bold glow-blue">
    <Phone className="w-4 h-4 shrink-0" />
    (555) 012-3456
  </a>
  ```
- Mobile: logo left + same phone button right, center nav hidden

---

### 2 — Hero

- `min-h-screen relative flex items-center overflow-hidden`

```tsx
{/* Image: plumber in professional uniform working under kitchen sink, tools in hand, warm home interior, soft natural light, documentary photography style */}
<img src="" alt="Professional plumber at work" className="absolute inset-0 w-full h-full object-cover object-center" />
<div className="absolute inset-0 bg-gradient-to-r from-[rgba(14,20,32,0.97)] via-[rgba(14,20,32,0.80)] to-[rgba(14,20,32,0.25)]" />
<div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[rgba(14,165,233,0.05)] to-transparent" />
```

- Content: `relative z-10 max-w-[1120px] mx-auto px-6 w-full`
- Inner content: `max-w-[580px]`

**Label:** `text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-5 flex items-center gap-2`
- `<span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />` + "Available 24/7 · Emergency Service"

**H1:** `text-[clamp(2.8rem,6vw,5.2rem)] font-extrabold leading-[1.06] tracking-tight text-white mt-0`
```
Fast, Reliable
Plumbing You
Can Count On.
```

**Sub:** `text-base text-muted-foreground mt-6 leading-relaxed` — "Licensed and insured plumbers serving the greater metro area. We show up on time, fix it right, and leave your home cleaner than we found it."

**CTAs:** `flex flex-wrap gap-3 mt-9`
```tsx
{/* Primary */}
<a href="tel:5550123456"
  className="h-12 px-8 rounded-xl inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap bg-primary text-white text-sm font-bold glow-blue">
  <Phone className="w-4 h-4 shrink-0" />
  Call Now — (555) 012-3456
</a>

{/* Secondary */}
<button
  className="h-12 px-8 rounded-xl inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap border border-border text-white text-sm font-medium hover:border-primary/50 transition-colors">
  <ClipboardList className="w-4 h-4 shrink-0" />
  Get a Free Quote
</button>
```

**Trust badges:** `flex flex-wrap gap-x-6 gap-y-3 mt-10 pt-8 border-t border-border`
Each: `flex items-center gap-2 text-sm text-muted-foreground shrink-0`
- `<ShieldCheck className="w-4 h-4 text-primary shrink-0" />` + "Licensed & Insured"
- `<Clock className="w-4 h-4 text-primary shrink-0" />` + "60-Min Response"
- `<Star className="w-4 h-4 text-primary shrink-0" />` + "5-Star Rated"
- `<Wrench className="w-4 h-4 text-primary shrink-0" />` + "15 Years Experience"

---

### 3 — Services

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- Label: `text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4` — "What We Fix"
- H2: `text-4xl md:text-5xl font-extrabold tracking-tight text-white` — "Every plumbing problem. One call."
- Sub: `text-sm text-muted-foreground mt-4 max-w-[480px]` — "From dripping taps to full pipe replacements — residential and commercial, across the metro area."
- Grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-14`

**Card:** `rounded-2xl p-6 border group hover:border-primary/30 transition-all duration-300` + glass CSS
- Icon: `w-9 h-9 text-primary mb-5 group-hover:scale-110 transition-transform shrink-0`
- Title: `text-base font-bold text-white mb-2`
- Body: `text-sm text-muted-foreground leading-relaxed`
- Bottom bar: `h-px w-0 bg-primary group-hover:w-full transition-all duration-500 mt-5`

| Icon | Title | Description |
|---|---|---|
| `Droplets` | Emergency Repairs | Burst pipes, major leaks, no water at all — on call 24/7, typically on-site within the hour. |
| `Thermometer` | Water Heater | Installation, repair, and replacement of tank and tankless water heaters. Hot water restored fast. |
| `Waves` | Drain Cleaning | Blocked sinks, showers, or toilets cleared with professional-grade equipment. No mess left behind. |
| `Bath` | Bathroom Fitting | Full bathroom plumbing installs — baths, showers, basins, and toilets fitted to the highest standard. |
| `GitBranch` | Pipe Repair | Leaking, corroded, or cracked pipes repaired or relined without unnecessary excavation. |
| `Building2` | Commercial | Offices, restaurants, and multi-unit buildings. Scheduled maintenance and reactive call-outs. |

---

### 4 — Stats

- `py-20 bg-[hsl(var(--muted))]`
- max-w-[1120px] mx-auto px-6
- `grid grid-cols-2 md:grid-cols-4 gap-8 text-center`

| Target | Suffix | Label |
|---|---|---|
| 2400 | + | Jobs Completed |
| 15 | yrs | In Business |
| 60 | min | Avg. Response |
| 98 | % | Happy Customers |

Each block:
- Number+suffix: `text-5xl font-extrabold text-primary tabular-nums` — animated counter
- Label: `text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mt-2`
- Desktop: right border `border-r border-border` on first 3, removed on mobile

---

### 5 — How It Works

- `py-24 md:py-32 bg-[hsl(var(--background))]`
- max-w-[1120px] mx-auto px-6
- Label: "Our Process" · H2: `text-4xl md:text-5xl font-extrabold tracking-tight text-white` — "Fixed in three simple steps."
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 relative`
- Connecting dashed line (desktop only): `absolute top-7 left-[20%] right-[20%] h-px border-t border-dashed border-border hidden md:block`

**Step:**
- Number box: `w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 inline-flex items-center justify-center text-xl font-extrabold text-primary mb-6 shrink-0`
- Title: `text-lg font-bold text-white mb-3`
- Body: `text-sm text-muted-foreground leading-relaxed`

| # | Title | Body |
|---|---|---|
| 01 | Call or Book Online | Call us directly or fill in the quick form. Tell us what's wrong — we'll give you an honest estimate over the phone. |
| 02 | We Show Up Fast | A licensed plumber arrives at your door, on time, with everything needed to diagnose and fix the problem. |
| 03 | Problem Solved | We fix it right the first time, clean up after ourselves, and follow up to make sure everything's working perfectly. |

---

### 6 — Testimonials

- `py-24 md:py-32 bg-[hsl(var(--muted))]`
- max-w-[1120px] mx-auto px-6
- H2: `text-4xl font-extrabold tracking-tight text-white mb-14` — "Don't take our word for it."
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-5`

**Card:** `rounded-2xl p-6` + glass CSS
- Stars: `flex gap-0.5 mb-4` — 5× `<Star className="w-4 h-4 text-primary fill-primary" />`
- Quote: `text-sm text-foreground leading-relaxed`
- Author row: `flex items-center gap-3 mt-5`
  - Avatar: `w-9 h-9 rounded-full bg-primary/20 inline-flex items-center justify-center text-primary text-xs font-bold shrink-0` — initials
  - `<div><p className="text-sm font-semibold text-white">Name</p><p className="text-xs text-muted-foreground">Service</p></div>`

| Quote | Author | Service |
|---|---|---|
| "Showed up within 45 minutes on a Sunday morning. Fixed a burst pipe under the kitchen sink quickly and cleanly. Will always use SWIFT." | Mark T. | Emergency Repair |
| "Very professional and honest. Gave me a clear quote upfront, stuck to it, and finished ahead of schedule. Highly recommend." | Lisa R. | Bathroom Fitting |
| "Had a blocked drain two other plumbers couldn't fix. SWIFT sorted it in under an hour. Brilliant service, fair price." | James K. | Drain Cleaning |

---

### 7 — Emergency CTA

- `relative py-24 md:py-32 overflow-hidden`

```tsx
{/* Image: close-up of dripping water pipe, dramatic dark background, high contrast, urgent mood */}
<img src="" alt="Emergency plumbing" className="absolute inset-0 w-full h-full object-cover object-center" />
<div className="absolute inset-0 bg-[rgba(14,20,32,0.92)]" />
<div className="absolute inset-0 bg-gradient-to-r from-primary/8 to-transparent" />
```

- Content: `relative z-10 max-w-[720px] mx-auto px-6 text-center`
- Label: `text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 inline-flex items-center justify-center gap-2`
  - `<span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />` + "24/7 Emergency Line"
- H2: `text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold tracking-tight leading-tight text-white` — "Plumbing emergency? We'll be there."
- Sub: `text-sm text-muted-foreground mt-5` — "No call-out fees after hours. Licensed plumbers available around the clock for urgent repairs."

```tsx
<a href="tel:5550123456"
  className="mt-10 h-14 px-12 rounded-xl inline-flex items-center justify-center gap-3 shrink-0 whitespace-nowrap bg-primary text-white text-base font-bold glow-blue">
  <Phone className="w-4 h-4 shrink-0" />
  Call (555) 012-3456 Now
</a>
```

- Fine print: `text-xs text-muted-foreground/50 mt-5` — "Average on-site arrival: 60 minutes or less"

---

### 8 — Footer

- `py-14 border-t border-[hsl(var(--border))]`
- max-w-[1120px] mx-auto px-6
- `grid grid-cols-1 md:grid-cols-3 gap-10 items-start`
- Col 1: Logo + tagline `text-sm text-muted-foreground mt-3 leading-relaxed` — "Licensed and insured plumbers serving the greater metro area since 2010." + `text-xs text-muted-foreground mt-4` — "© 2025 SWIFT Plumbing"
- Col 2: heading "Services" + links list `text-sm text-muted-foreground hover:text-white transition-colors` — Emergency · Water Heater · Drain Cleaning · Bathroom · Pipe Repair · Commercial
- Col 3: heading "Contact" + `flex items-center gap-2 text-sm text-muted-foreground` rows:
  - `<Phone className="w-4 h-4 shrink-0 text-primary" />` + "(555) 012-3456"
  - `<Mail className="w-4 h-4 shrink-0 text-primary" />` + "hello@swiftplumbing.com"
  - `<MapPin className="w-4 h-4 shrink-0 text-primary" />` + "Serving the greater metro area"

---

## Animations

```
Navbar: opacity 0 → 1, duration 0.4s
Hero label + pulse: opacity 0, y 12 → 0, delay 0.1s, duration 0.45s
Hero H1 (per line): delay 0.2s + index*0.1, duration 0.6s, blur 8px → 0
Hero sub: delay 0.5s, duration 0.5s
Hero CTAs: delay 0.65s, y 16 → 0, opacity 0 → 1
Hero trust badges: stagger delay 0.8s + index*0.08
Hero image: scale 1.06 → 1.0, duration 1.4s ease easeOut on load
Services cards: whileInView, stagger 0.08s, y 32 → 0, opacity 0 → 1
Stats: whileInView once → trigger counters + y 20 → 0, stagger 0.1s
Process steps: whileInView, stagger 0.12s, y 28 → 0
Testimonials: whileInView, stagger 0.09s, y 24 → 0
Emergency CTA block: scale 0.97 → 1, opacity 0 → 1, duration 0.65s
```

---

## Responsive

```
Navbar: full links desktop → logo + phone button only mobile
Hero H1: clamp(2.8rem, 6vw, 5.2rem) auto-scales
Hero CTAs: flex-row desktop → flex-col w-full max-w-[320px] mx-auto mobile
Hero trust badges: flex-wrap, 2-per-row mobile
Services: 3-col → 2-col tablet → 1-col mobile
Stats: 4-col → 2×2 grid mobile, remove right borders mobile
Process: 3-col → 1-col mobile, dashed line hidden mobile
Testimonials: 3-col → 1-col mobile
Emergency H2: clamp(2.4rem, 6vw, 4.5rem) auto-scales
Footer: 3-col → stacked 1-col mobile
```

---

## Full Copy

| Element | Copy |
|---|---|
| Brand | SWIFT Plumbing |
| Nav links | Services · About · Areas · Contact |
| Nav CTA | (555) 012-3456 |
| Hero label | Available 24/7 · Emergency Service |
| Hero H1 | Fast, Reliable / Plumbing You / Can Count On. |
| Hero sub | Licensed and insured plumbers serving the greater metro area. We show up on time, fix it right, and leave your home cleaner than we found it. |
| Hero CTA primary | Call Now — (555) 012-3456 |
| Hero CTA secondary | Get a Free Quote |
| Trust badges | Licensed & Insured · 60-Min Response · 5-Star Rated · 15 Years Experience |
| Services label | What We Fix |
| Services H2 | Every plumbing problem. One call. |
| Stats | 2400+ Jobs · 15 yrs In Business · 60 min Response · 98% Satisfaction |
| Process label | Our Process |
| Process H2 | Fixed in three simple steps. |
| Testimonials H2 | Don't take our word for it. |
| Emergency label | 24/7 Emergency Line |
| Emergency H2 | Plumbing emergency? We'll be there. |
| Emergency sub | No call-out fees after hours. Licensed plumbers available around the clock for urgent repairs. |
| Emergency CTA | Call (555) 012-3456 Now |
| Emergency fine print | Average on-site arrival: 60 minutes or less |
| Footer tagline | Licensed and insured plumbers serving the greater metro area since 2010. |
| Footer © | © 2025 SWIFT Plumbing |

---

## Key Dependencies

```json
{
  "motion": "^12.x",
  "lucide-react": "^0.4xx"
}
```
