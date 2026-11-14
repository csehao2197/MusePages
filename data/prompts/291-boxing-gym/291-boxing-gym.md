# IRON DISTRICT — Boxing Gym Website Prompt

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS + Framer Motion (`motion/react`) + shadcn/ui + lucide-react
**Niche:** Boxing Gym / Martial Arts Studio

---

## Design System

### Colors (HSL in :root CSS custom properties)

```css
:root {
  --background: 0 0% 4%;           /* near-black #090909 */
  --foreground: 30 13% 93%;        /* off-white #F0EDE8 */
  --primary: 0 100% 43%;           /* electric red #D90000 */
  --primary-foreground: 0 0% 100%;
  --card: 0 0% 10%;                /* dark grey #1A1A1A */
  --card-foreground: 30 13% 93%;
  --muted-foreground: 0 0% 55%;
  --border: 0 0% 16%;
  --muted: 0 0% 8%;
}
```

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

/* Display headings: Bebas Neue 400 — ALL CAPS, condensed, large */
/* Body / stats / mono details: Space Mono 400/700 */
```

Apply globally:
```css
body {
  font-family: 'Space Mono', monospace;
  font-weight: 400;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  -webkit-font-smoothing: antialiased;
}
```

---

## Signature Animations

### Animation 1: Hero Text — Per-Word Blur + Slide In

Each word of the main headline is a separate `<motion.span>` that animates independently:

```tsx
// Each word in "WHERE CHAMPIONS ARE MADE" is wrapped:
const words = ['WHERE', 'CHAMPIONS', 'ARE', 'MADE']

{words.map((word, index) => (
  <motion.span
    key={word}
    className="inline-block mr-[0.2em]"
    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{ duration: 0.5, delay: 0.1 + index * 0.12, ease: 'easeOut' }}
  >
    {word}
  </motion.span>
))}
```

### Animation 2: CTA Ripple Effect on Hover

Primary CTA button uses a CSS keyframe ripple effect — a circular ring expands from the button's center and fades out on hover:

```css
/* Add to index.css */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.ripple-btn {
  position: relative;
  overflow: hidden;
}

.ripple-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at center, hsl(var(--primary-foreground) / 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.1s;
}

.ripple-btn:hover::after {
  animation: ripple 0.5s ease-out forwards;
}
```

---

## Section 1: Navbar

```tsx
// Fixed top, z-50
// bg-[hsl(var(--background)/0.95)]
// border-b border-[hsl(var(--border))]
// height: h-16 (64px)

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Layout: flex items-center justify-between h-full

// Logo:
// "IRON DISTRICT" — font-family Bebas Neue, text-3xl, tracking-wider, text-[hsl(var(--foreground))]
// No icon (typography-only for maximum impact)

// Desktop Nav links (hidden below lg, lg:flex gap-8):
// "Classes" | "Coaches" | "Schedule" | "Membership"
// Font: Space Mono 400 text-sm text-[hsl(var(--muted-foreground))]
// Hover: text-[hsl(var(--foreground))] transition-colors

// "JOIN NOW" CTA:
// bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
// font-family Space Mono text-sm
// px-5 py-2
// hover:opacity-80 transition-opacity
// No border-radius (square edges: rounded-none) — industrial aesthetic

// Mobile hamburger:
// Menu icon from lucide-react (24px)
// Shown below lg (lg:hidden)
// Mobile menu: fixed top-16 left-0 right-0
// bg-[hsl(var(--background))] border-b border-[hsl(var(--border))]
// Framer Motion: initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
// transition: duration 0.25s ease
// Nav links stacked: py-3 px-6 border-b border-[hsl(var(--border))]
// Space Mono 400 text-sm text-[hsl(var(--foreground))]
// Last item: "JOIN NOW" button full-width mt-4 mb-2
```

---

## Section 2: Hero

```tsx
// Full viewport: h-[100dvh]
// Position: relative overflow-hidden
// Background: bg-[hsl(var(--background))]

// Video background:
{/* Video background: underground boxing gym at night, fighter hitting heavy bag in dramatic spotlight, sweat and motion blur, cinematic slow-motion quality, very dark with focused red and white lighting accents */}
<video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover scale-105"
  style={{ filter: 'brightness(0.4) contrast(1.1)' }}
/>

// Dark overlay (gradient):
// absolute inset-0 z-[1]
// background: linear-gradient(to bottom, hsl(0 0% 4% / 0.7) 0%, hsl(0 0% 4% / 0.4) 50%, hsl(0 0% 4% / 1) 100%)

// Content wrapper:
// absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6

// Content inner: max-w-4xl mx-auto

// Pre-headline:
// "EAST LONDON · FOUNDED 2019"
// Font: Space Mono 400
// Size: text-xs tracking-[0.4em]
// Color: text-[hsl(var(--primary))]
// Margin: mb-6

// Main headline: "WHERE CHAMPIONS ARE MADE"
// Each word wrapped in motion.span (see Animation 1 above)
// Font: Bebas Neue
// Size: text-[10rem] (desktop) → text-[4.5rem] (mobile: text-7xl)
// Color: text-[hsl(var(--foreground))]
// Line height: leading-none
// Letter spacing: tracking-[0.02em]
// Margin: mb-6

// Body paragraph:
// "No excuses. No egos. Just the work. Whether you're a total beginner or a seasoned fighter, Iron District is where serious people train."
// Font: Space Mono 400 text-base
// Color: text-[hsl(var(--muted-foreground))]
// Max-w: max-w-lg mx-auto leading-relaxed
// Margin: mb-8
// Motion: initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}

// CTA Row (flex flex-wrap gap-4 justify-center):
// Primary: "BOOK FREE TRIAL"
//   bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
//   font-family Space Mono py-4 px-8 rounded-none
//   className="ripple-btn" (for the ripple hover effect)
//   hover:opacity-80 transition-opacity
// Ghost: "VIEW SCHEDULE"
//   border border-[hsl(var(--foreground))] text-[hsl(var(--foreground))]
//   py-4 px-8 rounded-none
//   hover:bg-[hsl(var(--foreground)/0.05)] transition-colors
//   font-family Space Mono

// Bottom stats bar:
// absolute bottom-0 left-0 right-0
// bg-[hsl(var(--background)/0.8)] backdrop-blur-sm
// border-t border-[hsl(var(--border))]
// py-4
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// flex flex-col sm:flex-row items-center justify-center sm:gap-16 gap-2

// Each stat: text-center
// Value: "850+" font-family Space Mono font-weight 700 text-[hsl(var(--primary))] text-lg tracking-wider
// Label: "ACTIVE MEMBERS" font-family Space Mono 400 text-[hsl(var(--muted-foreground))] text-xs tracking-wider
// Dividers: hidden sm:block w-px h-8 bg-[hsl(var(--border))]

// Stats: "850+ MEMBERS" | "120 FIGHT WINS" | "OPEN 7 DAYS"
```

---

## Section 3: Classes

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Section heading: "TRAIN HARDER."
// Font: Bebas Neue
// Size: text-[96px] leading-none (desktop) → text-6xl (mobile)
// Color: text-[hsl(var(--foreground))]
// Style: full width — let it be massive

// Subheading: "Four disciplines. One community."
// Font: Space Mono 400 text-sm text-[hsl(var(--muted-foreground))] tracking-wide mt-2 mb-12

// Grid: grid grid-cols-1 md:grid-cols-2 gap-4

// On mobile: horizontal scroll container is an option but the grid is preferred

// CLASS CARD COMPONENT:
// Wrapper: bg-[hsl(var(--card))] rounded-xl overflow-hidden border border-[hsl(var(--border))]
// hover:border-[hsl(var(--primary))] transition-colors duration-300
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
//   viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.12 }}

// Image container: h-48 w-full relative overflow-hidden
// Image: absolute inset-0 w-full h-full object-cover
// Hover overlay: absolute inset-0 bg-[hsl(var(--primary)/0.15)] opacity-0 hover:opacity-100 transition-opacity

// Card body: p-6

// Label tag:
// Space Mono 400 text-xs text-[hsl(var(--primary))] tracking-wider uppercase mb-2

// Class name:
// Bebas Neue text-4xl text-[hsl(var(--foreground))] mb-3

// Description:
// Space Mono 400 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4

// Schedule pills (flex flex-wrap gap-2):
// Each: bg-[hsl(var(--card))] border border-[hsl(var(--border))]
//   text-[hsl(var(--muted-foreground))] text-xs px-3 py-1 rounded-sm
//   Space Mono 400

// CARD 1: Boxing Fundamentals
{/* Image: boxing class with beginners learning stance and jab technique, boxing coach demonstrating proper form, bright well-lit gym, motivating and energetic atmosphere, group training setting */}
<img src="" alt="Boxing Fundamentals class at Iron District" className="absolute inset-0 w-full h-full object-cover" />
// Label: "BEGINNER FRIENDLY"
// Name: "Boxing Fundamentals"
// Description: "Master the sweet science from the ground up. Stance, footwork, jabs, crosses, hooks, and defensive movement — every session builds genuine boxing skill on solid foundations. No experience needed, no assumptions made. This is where every Iron District member starts."
// Schedule: Mon/Wed/Fri · 6:00am | Mon/Wed/Fri · 7:00pm

// CARD 2: Kickboxing
{/* Image: kickboxing class in action, multiple students practicing roundhouse kicks in synchronised form, high-energy colourful pads, coach counting out the drill, dynamic gym environment */}
<img src="" alt="Kickboxing class at Iron District" className="absolute inset-0 w-full h-full object-cover" />
// Label: "ALL LEVELS"
// Name: "Kickboxing"
// Description: "Add powerful kicks to your arsenal. Kickboxing combines the technical precision of boxing fundamentals with Muay Thai–inspired leg work for a devastating, full-body workout that conditions you inside and out. Pad work and bag work alternate every session for maximum skill development."
// Schedule: Tue/Thu · 6:30pm | Sat · 9:00am

// CARD 3: Muay Thai
{/* Image: muay thai training with focus pads, trainer holding thai pads while student throws a knee strike, authentic martial arts gym setting, authentic atmosphere, dramatic lighting */}
<img src="" alt="Muay Thai class at Iron District" className="absolute inset-0 w-full h-full object-cover" />
// Label: "STRIKING ART"
// Name: "Muay Thai"
// Description: "The Art of Eight Limbs. Learn to use your fists, elbows, knees, and shins with precision and power in one of the most effective and complete striking arts in the world. Our Muay Thai classes are taught by Jade Santos, 3× National Champion, and follow authentic Thai training methodology."
// Schedule: Sat · 10:00am | Sun · 11:00am

// CARD 4: Strength & Conditioning
{/* Image: functional strength training session with kettlebells and barbells in dark industrial gym setting, athlete mid-lift with focused expression, dramatic high-contrast lighting, gym equipment visible */}
<img src="" alt="Strength and Conditioning at Iron District" className="absolute inset-0 w-full h-full object-cover" />
// Label: "PERFORMANCE"
// Name: "Strength & Conditioning"
// Description: "Built for fighters, effective for everyone. Our S&C sessions are designed by Ryan Okeke, MSc Sports Science, to develop the explosive power, cardiovascular endurance, and physical resilience that every combat athlete needs — and that every gym-goer benefits from. No machines. Real training."
// Schedule: Mon–Fri · 5:00am | Sat · 8:00am
```

---

## Section 4: Fighter Stats

```tsx
// Background: bg-[hsl(var(--primary)/0.06)]
// Border: border-y border-[hsl(var(--primary)/0.2)]
// Padding: py-20

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Grid: grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0
// (On lg: dividers between columns using border-r border-[hsl(var(--border))] on first 3)

// Each stat: text-center lg:px-8

// Value:
// Font: Bebas Neue
// Size: text-[80px] leading-none
// Color: text-[hsl(var(--primary))]
// Framer Motion: whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.7 }}
//   viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}

// Label:
// Font: Space Mono 400 text-sm text-[hsl(var(--muted-foreground))] tracking-wider uppercase
// Margin: mt-2

// 4 Stats:
// "850+" / "Active Members"
// "120" / "Competitive Fight Wins"
// "6" / "Years Established"
// "3" / "Pro Champions Trained"
```

---

## Section 5: Coaches

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "THE COACHES."
// Font: Bebas Neue text-[80px] text-[hsl(var(--foreground))] leading-none mb-12

// Grid: grid grid-cols-1 md:grid-cols-3 gap-8

// COACH CARD COMPONENT:
// flex flex-col items-center text-center (or text-left on desktop)

// Image container:
// w-full aspect-[3/4] rounded-xl overflow-hidden mb-6
// img: grayscale filter initially, hover:grayscale-0 transition-all duration-500 w-full h-full object-cover

// Coach name:
// Bebas Neue text-3xl text-[hsl(var(--foreground))] mb-1

// Role/title:
// Space Mono 400 text-sm text-[hsl(var(--primary))] tracking-wider mb-3

// Credentials/bio:
// Space Mono 400 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed

// COACH 1: Marcus Cole — Head Coach
{/* Image: male boxing coach in his late 30s, intense focused expression, wearing boxing training attire, boxing gym background with bags visible, professional portrait, high contrast editorial photography style */}
<img src="" alt="Marcus Cole, Head Coach at Iron District" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
// Name: "Marcus Cole"
// Role: "HEAD COACH"
// Credentials: "Former ABA National Champion · 12 Years Coaching Experience · Licensed UK Boxing Coach · Trained 3 Pro-Level Fighters to National Title Bouts"

// COACH 2: Jade Santos — Kickboxing + Muay Thai
{/* Image: female kickboxing and Muay Thai instructor, athletic build, confident and powerful pose, gym environment with bags and equipment visible, professional sports portrait, strong and authoritative presence */}
<img src="" alt="Jade Santos, Kickboxing and Muay Thai Coach at Iron District" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
// Name: "Jade Santos"
// Role: "KICKBOXING + MUAY THAI"
// Credentials: "3× National Kickboxing Champion · WBC Muay Thai Certified · WAKO International Competitor · Head of Women's Programme"

// COACH 3: Ryan Okeke — S&C
{/* Image: male strength and conditioning coach, athletic and powerful build, wearing training gear, functional fitness gym with kettlebells and barbells, professional portrait with confident stance */}
<img src="" alt="Ryan Okeke, S&C Coach at Iron District" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
// Name: "Ryan Okeke"
// Role: "S&C COACH"
// Credentials: "MSc Sports Science (Loughborough) · UKSCA Accredited · Performance Coach to 4 Active Pro Fighters · Former GB Youth Athletics"
```

---

## Section 6: Schedule (7-Day Table)

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "THIS WEEK'S SCHEDULE."
// Font: Bebas Neue text-[72px] leading-none text-[hsl(var(--foreground))] mb-12

// Table wrapper: overflow-x-auto (enables horizontal scroll on mobile)
// Table: min-w-[700px] w-full border-collapse

// Header row: bg-[hsl(var(--card))]
// Th cells: Space Mono 700 text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider
//   px-4 py-3 text-left border-b border-[hsl(var(--border))]
// Columns: Time | Mon | Tue | Wed | Thu | Fri | Sat | Sun

// Time column: Space Mono 400 text-xs text-[hsl(var(--muted-foreground))]

// FILLED CLASS CELL:
// bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)] rounded-sm
// padding: px-2 py-2
// Class name: Space Mono 700 text-xs text-[hsl(var(--primary))] block
// Duration: Space Mono 400 text-xs text-[hsl(var(--muted-foreground))]

// EMPTY CELL:
// bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-2 py-2 rounded-sm

// Schedule data:
// 5:00am: S&C (45 min) on Mon, Tue, Wed, Thu, Fri | S&C (45 min) on Sat
// 6:00am: Boxing Fund. (60 min) on Mon, Wed, Fri | — on others
// 6:30am: — all
// 7:00pm: Boxing Fund. (60 min) on Mon, Wed, Fri | Kickboxing (60 min) on Tue, Thu
// 9:00am Sat: Kickboxing (60 min)
// 10:00am Sat: Muay Thai (60 min)
// 11:00am Sun: Muay Thai (60 min)

// Note below table:
// "Full timetable and live booking available on the Iron District member app."
// Space Mono 400 text-xs text-[hsl(var(--muted-foreground))] mt-6
```

---

## Section 7: Membership

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "NO CONTRACTS. JUST COMMITMENT."
// Font: Bebas Neue text-[72px] leading-none text-[hsl(var(--foreground))] mb-12

// Grid: grid grid-cols-1 lg:grid-cols-3 gap-6

// TIER CARD COMPONENT:
// bg-[hsl(var(--background))] rounded-xl p-8 border border-[hsl(var(--border))]
// hover:border-[hsl(var(--primary)/0.4)] transition-colors

// Tier name: Bebas Neue text-4xl text-[hsl(var(--foreground))] mb-1
// Price: Space Mono 700 text-3xl text-[hsl(var(--primary))] mb-1
// Period: Space Mono 400 text-xs text-[hsl(var(--muted-foreground))] mb-6
// Divider: border-t border-[hsl(var(--border))] my-6
// Includes list: space-y-3
//   Each item: flex items-start gap-2
//   Check icon: CheckCircle2 from lucide-react size=14 text-[hsl(var(--primary))]
//   Text: Space Mono 400 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed

// CTA: "SIGN UP" button — full-width, rounded-none, bg-[hsl(var(--border))] text-[hsl(var(--foreground))]
//   hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors
//   Space Mono 400 text-sm tracking-wider mt-6 py-3

// TIER 1: DROP-IN
// Name: "DROP-IN"
// Price: "£15" | Period: "per session"
// Includes:
//   "1 class of your choice"
//   "Locker access during session"
//   "Towel hire available (£2)"
//   "No commitment required"
//   "Book directly online"

// TIER 2: MONTHLY — add "MOST POPULAR" badge
// Badge: absolute top-0 right-0 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
//   Space Mono 400 text-xs px-3 py-1.5 rounded-bl-lg rounded-tr-xl tracking-wider
//   Text: "MOST POPULAR"
// Name: "MONTHLY"
// Price: "£65" | Period: "per month, cancel anytime"
// Includes:
//   "Unlimited classes — all types"
//   "Full weekly timetable access"
//   "Member app with class booking"
//   "10% discount on merchandise"
//   "Access to open bag sessions"
//   "No contract, cancel anytime"
// Card style: relative border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.05)]
// CTA: bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] (highlighted)

// TIER 3: ANNUAL
// Name: "ANNUAL"
// Price: "£55" | Period: "per month · billed £660/year · save £120"
// Includes:
//   "Everything in Monthly"
//   "Save £120 vs. monthly membership"
//   "Priority class booking (24hr advance)"
//   "1 free guest pass per month"
//   "Iron District branded kit bag (on signup)"
//   "Annual members only events"
```

---

## Section 8: FAQ

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-3xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "GOT QUESTIONS."
// Font: Bebas Neue text-[72px] leading-none text-[hsl(var(--foreground))] mb-12

// shadcn Accordion:
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
// type="single" collapsible className="w-full"

// AccordionItem: border border-[hsl(var(--border))] rounded-lg mb-3 px-6 bg-[hsl(var(--card))]
// AccordionTrigger: Space Mono 700 text-sm text-[hsl(var(--foreground))] py-5 hover:no-underline
// AccordionContent: Space Mono 400 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed pb-5

// Q1: "Do I need experience to join?"
// A1: "Absolutely not. Our Boxing Fundamentals classes are designed from the ground up for complete beginners, and our coaches are trained to take you from zero to confident in a matter of weeks. The only thing you need to bring is the willingness to work. We see people walk through the door every week with no experience at all — they're always the ones who progress the fastest."

// Q2: "What equipment do I need?"
// A2: "Just yourself for your first free trial session. We have boxing gloves (8oz to 16oz), wraps, and pads available to borrow for beginners. As you progress, we recommend investing in your own gloves and hand wraps — you'll find recommendations from our coaches on the member app. Mouth guards and groin protection are personal items — bring your own if you have them."

// Q3: "Is there parking?"
// A3: "Street parking is available on surrounding roads and is generally easy to find outside peak hours. The nearest tube station is Hackney Wick (Overground), a 3-minute walk from the gym entrance. Multiple bus routes serve the area — routes 26, 30, and 388 stop within 5 minutes' walk."

// Q4: "Do you run kids' or junior classes?"
// A4: "Yes — we run Junior Boxing sessions separately from our adult timetable. Junior classes for ages 9–12 run on Saturday mornings at 9:00am, and sessions for ages 13–17 run on Sunday afternoons at 2:00pm. Both are taught by Marcus Cole and follow a structured curriculum focused on discipline, fitness, and confidence — not competition. Contact us to enquire about junior membership."
```

---

## Section 9: Footer

```tsx
// Background: bg-[hsl(var(--card))]
// Border: border-t border-[hsl(var(--border))]
// Padding: py-12

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Grid: grid grid-cols-1 md:grid-cols-3 gap-8

// Column 1 — Logo + Address:
// "IRON DISTRICT" — Bebas Neue text-2xl tracking-wider text-[hsl(var(--foreground))]
// Below: Space Mono 400 text-xs text-[hsl(var(--muted-foreground))] mt-2 leading-relaxed
// "Unit 14, Hackney Wick Industrial Estate"
// "East London E9 5LU"
// mt-4: "OPEN 7 DAYS · 5AM–10PM"

// Column 2 — Nav links:
// "NAVIGATE" — Space Mono 400 text-xs tracking-[0.3em] text-[hsl(var(--primary))] uppercase mb-4
// Links: Classes | Coaches | Schedule | Membership | Junior Boxing
// Each: block Space Mono 400 text-sm text-[hsl(var(--muted-foreground))]
//   hover:text-[hsl(var(--foreground))] py-1 transition-colors

// Column 3 — Social:
// "FOLLOW US" — same label style
// "We post training highlights, fighter wins, and member stories every day."
// Space Mono 400 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed mb-4
// Social icons: flex gap-3
//   Instagram: Instagram icon lucide-react w-8 h-8
//   YouTube: Youtube icon lucide-react w-8 h-8
//   Each: text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors

// Footer bottom:
// mt-12 pt-8 border-t border-[hsl(var(--border))]
// flex flex-col sm:flex-row justify-between items-center gap-3
// "© 2025 Iron District Ltd. All rights reserved." — Space Mono 400 text-xs text-[hsl(var(--muted-foreground))]
// "East London's Home of Boxing." — Space Mono 400 text-xs text-[hsl(var(--muted-foreground))]
```

---

## App Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css                   # CSS variables, global styles, ripple keyframe
├── components/
│   ├── Navbar.tsx              # Fixed dark navbar with mobile menu
│   ├── HeroSection.tsx         # Video background hero, per-word animations
│   ├── ClassesSection.tsx      # 4 class cards, 2×2 grid
│   ├── FighterStats.tsx        # 4 stat counters
│   ├── CoachesSection.tsx      # 3 coaches, grayscale→colour hover
│   ├── ScheduleSection.tsx     # 7-day responsive table
│   ├── MembershipSection.tsx   # 3 tier cards
│   ├── FAQSection.tsx          # shadcn Accordion
│   └── Footer.tsx              # Dark footer 3-col
└── components/ui/              # shadcn/ui components
```

```tsx
// index.css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 30 13% 93%;
    --primary: 0 100% 43%;
    --primary-foreground: 0 0% 100%;
    --card: 0 0% 10%;
    --card-foreground: 30 13% 93%;
    --muted-foreground: 0 0% 55%;
    --border: 0 0% 16%;
    --muted: 0 0% 8%;
  }
  
  body {
    font-family: 'Space Mono', monospace;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
  }
}

@keyframes ripple {
  0% { transform: scale(0); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}

.ripple-btn {
  position: relative;
  overflow: hidden;
}

.ripple-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at center, rgb(255 255 255 / 0.3) 0%, transparent 60%);
  opacity: 0;
}

.ripple-btn:hover::after {
  animation: ripple 0.5s ease-out forwards;
}
```

---

## Setup Commands

```bash
npm create vite@latest iron-district -- --template react-ts
cd iron-district
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init
npx shadcn-ui@latest add accordion
npm install motion
npm install lucide-react
```

---

## Key Implementation Notes

1. **Video Background**: The video `<video>` tag gets a CSS `filter: brightness(0.4) contrast(1.1)` to make it very dark. The gradient overlay on top adds depth to the fade to black at the bottom. The `scale-105` class prevents white edges if the video slightly doesn't cover the viewport.

2. **Bebas Neue Sizing**: At 10rem (160px), the headline is intentionally oversized on desktop — this is the Iron District design language. Use `overflow-hidden` on the heading container if needed to prevent horizontal scroll on very narrow viewports.

3. **Grayscale Coach Images**: The `grayscale` class makes all coach images black and white by default, with `hover:grayscale-0 transition-all duration-500` to reveal full colour on hover. This creates a striking visual effect without JavaScript.

4. **Schedule Table**: Wrap the entire `<table>` in a `<div className="overflow-x-auto">` container. Set `min-w-[700px]` on the table itself to ensure column spacing on all viewports. Use small `text-xs` for cell content.

5. **Ripple Effect**: The CSS `.ripple-btn` class is applied to the primary CTA. The `::after` pseudo-element with `radial-gradient` creates the ring effect on hover. No JavaScript needed.

6. **Mobile Hero**: The main headline drops from `text-[10rem]` to `text-7xl` (4.5rem) on mobile. Use `sm:text-8xl lg:text-[10rem]` for the responsive scale.
