# CLEARWAY DRIVING SCHOOL — Website Prompt

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS + Framer Motion (`motion/react`) + shadcn/ui + lucide-react  
**Niche:** Driving School / Driving Instructor — Manchester

---

## Design System

### Colors (HSL in :root CSS custom properties)

```css
:root {
  --background: 0 0% 100%;           /* white */
  --foreground: 228 17% 14%;         /* deep charcoal #1E2028 */
  --primary: 14 91% 57%;             /* signal orange #F5622D */
  --primary-foreground: 0 0% 100%;
  --muted: 220 7% 95%;               /* light grey #F0F1F3 */
  --card: 0 0% 100%;
  --card-foreground: 228 17% 14%;
  --border: 220 10% 88%;
  --muted-foreground: 220 10% 50%;
  --accent: 220 17% 20%;
}
```

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500&display=swap');

/* Display headings: Plus Jakarta Sans 700/800 */
/* Body: Inter 400/500 */
```

Apply globally:
```css
body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
}
```

---

## Signature Animations

### Animation 1: Pass Rate Counter (0 → 93%)

The "93%" stat in the hero section counts up from 0 to 93 over 2 seconds on page load using `requestAnimationFrame`.

```tsx
// useCountUp custom hook
import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | null = null
    let animFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // easeOut cubic: progress stays fast then decelerates
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.round(eased * target))
      
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate)
      }
    }
    
    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [target, duration])
  
  return count
}

// Usage in Hero:
const passRate = useCountUp(93, 2000)
// Display: <span className="...">{passRate}%</span>

// Other counters:
const studentsCount = useCountUp(2400, 2000)
const yearsCount = useCountUp(15, 1500)
```

### Animation 2: Car Sliding Along Journey Road

The "How It Works" section (Section 4) has a dotted road line with a car SVG that slides from Step 1 to Step 4 as the user scrolls through the section.

```tsx
// Car SVG component (16px × 28px, signal orange):
const CarIcon = () => (
  <svg viewBox="0 0 28 16" fill="currentColor" className="w-7 h-4 text-[hsl(var(--primary))]">
    <path d="M2 10 L4 4 L8 2 L20 2 L24 4 L26 10 L26 12 L2 12 Z M6 12 A2 2 0 0 0 10 12 M18 12 A2 2 0 0 0 22 12" stroke="none"/>
    <rect x="8" y="3" width="12" height="5" rx="1" fill="white" opacity="0.5"/>
    <circle cx="8" cy="12" r="2.5" fill="hsl(14 91% 20%)"/>
    <circle cx="20" cy="12" r="2.5" fill="hsl(14 91% 20%)"/>
  </svg>
)

// Road line: dotted, runs horizontally between the 4 step circles on desktop
// border-t-2 border-dashed border-[hsl(var(--border))]

// Car position: translateX based on scroll progress through the section
// IntersectionObserver OR useScroll from Framer Motion

// Implementation using window.scroll:
// const [carProgress, setCarProgress] = useState(0)
// In useEffect: track window.scrollY vs section's getBoundingClientRect()
// carProgress goes 0→1 as the section passes through the viewport
// translateX = carProgress * (trackWidth - carWidth)
// Framer Motion: animate={{ x: carX }} transition={{ type: 'spring', stiffness: 80, damping: 25 }}
```

---

## Section 1: Navbar

```tsx
// Sticky top: sticky top-0 z-50
// Background: bg-white
// Shadow: shadow-sm on default, shadow-md after scroll (useEffect scroll listener, transition-shadow duration-200)
// Height: h-16

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Layout: flex items-center justify-between

// Logo: flex flex-col items-start
//   Row 1: flex items-center gap-2
//     [Steering wheel SVG, ~22px, text-[hsl(var(--primary))]]
//     "CLEARWAY" — Plus Jakarta Sans 800 text-xl text-[hsl(var(--foreground))]
//   Row 2: "DRIVING SCHOOL" — Inter 400 text-xs text-[hsl(var(--muted-foreground))] tracking-widest

// Desktop nav (lg:flex gap-7):
// "Courses" | "Instructors" | "Reviews" | "Theory Test" | "Pricing"
// Inter 400 text-sm text-[hsl(var(--muted-foreground))]
// hover:text-[hsl(var(--foreground))] transition-colors

// "Book a Lesson" CTA:
// bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
// Inter 500 text-sm rounded-full px-5 py-2
// hover:opacity-90 transition-opacity

// Mobile: Menu icon (lucide-react), hamburger
// Mobile menu: absolute top-16, full-width bg-white shadow-lg
// Links stacked, py-3 px-6, border-b border-[hsl(var(--border))]
// Framer Motion slide-down: initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
```

---

## Section 2: Hero

```tsx
// min-h-[90dvh] bg-white
// Grid: grid lg:grid-cols-2 items-center

// LEFT COLUMN (px-6 sm:px-12 py-16 lg:py-24):

// Label: "MANCHESTER'S TOP-RATED DRIVING SCHOOL"
// Inter 400 text-xs tracking-[0.25em] text-[hsl(var(--muted-foreground))] uppercase mb-4

// Headline: "Pass first time. Drive for life."
// Plus Jakarta Sans 800
// text-[72px] leading-tight (desktop) → text-5xl (mobile: text-[44px])
// text-[hsl(var(--foreground))]
// Motion: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}

// Subtext: "Expert tuition from ADI-qualified instructors. Modern dual-control cars. Flexible lesson times around your schedule. And a first-time pass rate that speaks for itself."
// Inter 400 text-lg text-[hsl(var(--muted-foreground))] leading-relaxed mt-4 mb-8
// Motion: delay 0.2s

// CTA Row (flex flex-wrap gap-4):
// Primary: "Book Your First Lesson"
//   bg-[hsl(var(--primary))] text-white rounded-full px-8 py-3.5
//   Inter 500 hover:opacity-90 transition-opacity
// Text link: "See All Courses →"
//   text-[hsl(var(--primary))] Inter 500 text-sm hover:underline py-3

// Stat counters row:
// flex gap-8 mt-8 pt-8 border-t border-[hsl(var(--border))] flex-wrap

// ANIMATED COUNTER STATS:
// Stat 1: Pass Rate
//   Number: "{passRate}%" — Plus Jakarta Sans 800 text-4xl lg:text-5xl text-[hsl(var(--primary))]
//   Label: "First-time pass rate" — Inter 400 text-sm text-[hsl(var(--muted-foreground))]
//   Sub: "(National avg: 47%)" — Inter 400 text-xs text-[hsl(var(--muted-foreground)/0.6)]

// Stat 2: Students
//   Number: "{studentsCount.toLocaleString()}+" — same size/style
//   Label: "Students taught"

// Stat 3: Years
//   Number: "{yearsCount}" — same
//   Label: "Years established"

// Motion on stats: initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}

// RIGHT COLUMN:
// h-[55vh] lg:h-full relative overflow-hidden
// lg:rounded-none rounded-2xl overflow-hidden
{/* Image: modern car during a driving lesson, young female student behind the wheel with a friendly male instructor in the passenger seat with a dual-control pedal visible, suburban Manchester street scene, bright natural daylight, clean modern Ford Focus or similar, relaxed and positive atmosphere */}
<img src="" alt="Clearway driving lesson Manchester" className="absolute inset-0 w-full h-full object-cover object-center" />
// Soft gradient overlay on left edge: lg:absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent
```

---

## Section 3: Courses

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "Find your perfect course."
// Plus Jakarta Sans 800 text-5xl text-[hsl(var(--foreground))] mb-12

// Grid: grid grid-cols-1 lg:grid-cols-3 gap-6

// COURSE CARD:
// bg-white rounded-2xl p-8 border border-[hsl(var(--border))] shadow-sm
// hover:shadow-md transition-shadow duration-300
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
//   viewport={{ once: true }} transition={{ delay: index * 0.12 }}

// Icon circle: w-12 h-12 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center mb-4
//   Icon (lucide-react): text-[hsl(var(--primary))] w-5 h-5

// Price: Inter 500 text-sm text-[hsl(var(--muted-foreground))] mb-1

// Course name: Plus Jakarta Sans 800 text-2xl text-[hsl(var(--foreground))] mb-3

// Description: Inter 400 text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-6

// "Ideal for" label: Inter 500 text-xs uppercase tracking-wider text-[hsl(var(--foreground)/0.5)] mb-3

// Ideal for list (space-y-1.5):
// Each: flex items-center gap-2
//   Small dot: w-1 h-1 rounded-full bg-[hsl(var(--primary))]
//   Inter 400 text-sm text-[hsl(var(--muted-foreground))]

// CTA: "Learn More →"
// text-[hsl(var(--primary))] Inter 500 text-sm hover:underline mt-6 inline-block

// BADGE (for Intensive): "MOST POPULAR"
// absolute top-6 right-6 bg-[hsl(var(--primary))] text-white
//   text-xs Inter 500 px-3 py-1 rounded-full

// COURSE 1: Beginner Lessons
// Icon: Car from lucide-react
// Price: "from £35 / hour"
// Name: "Beginner Lessons"
// Description: "New to driving? Perfect. We start from the very basics — car controls, safety checks, moving off — and progress at exactly your pace. No pressure, no rushing. Our most popular block for beginners is 10 hours for £320, saving you £30 vs. hourly rate."
// Ideal for: "Total beginners with no experience" · "Flexible weekly scheduling" · "Buy in blocks of 5, 10, or 20 hours"

// COURSE 2: Intensive 5-Day Course (MOST POPULAR badge)
// Icon: Zap from lucide-react
// Price: "£450 — includes test fee"
// Name: "Intensive 5-Day Course"
// Description: "Pass within a week. Our structured intensive programme takes you from beginner to test-ready in five full days of focused, immersive learning. Includes a mock test on day 4, theory prep support throughout, and a qualified instructor accompanying you on test day."
// Ideal for: "Learners who need to pass quickly" · "Monday to Friday, 9am–4pm" · "Test fee (£62) included in price"

// COURSE 3: Refresher Lessons
// Icon: RotateCcw from lucide-react
// Price: "from £40 / hour · min. 3 hours"
// Name: "Refresher Lessons"
// Description: "Passed but rusty? Had a long gap in driving? Our refresher sessions rebuild your confidence and update your skills on modern roads — motorways, dual carriageways, roundabouts, and parking scenarios. Book as many or as few hours as you need."
// Ideal for: "Drivers returning after a break" · "Recently passed nervous drivers" · "No test required — just driving"
```

---

## Section 4: Your Journey (Animated Road)

```tsx
// Background: bg-white
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "How it works."
// Plus Jakarta Sans 800 text-5xl text-[hsl(var(--foreground))] text-center mb-20

// Journey wrapper (ref for scroll tracking):
// relative max-w-4xl mx-auto

// Desktop road line (lg:block hidden):
// absolute top-[28px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)]
// border-t-2 border-dashed border-[hsl(var(--border))] z-0

// Car SVG (lg:block hidden):
// absolute top-[18px] z-10
// Framer Motion: animate={{ x: carX }} transition={{ type: 'spring', stiffness: 80, damping: 25 }}

// 4 steps (grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4):

// STEP COMPONENT:
// flex flex-col items-center text-center (or items-start text-left on mobile)
// relative z-10

// Circle: w-14 h-14 rounded-full bg-white border-2 border-[hsl(var(--border))]
//   flex items-center justify-center mb-4 shadow-sm
//   text-2xl (for the emoji) OR
//   Active (when car arrives): border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]

// Step number: Inter 400 text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2

// Step title: Plus Jakarta Sans 700 text-lg text-[hsl(var(--foreground))] mb-3

// Step description: Inter 400 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed

// STEP 1: Book Online
// Emoji/Icon: 🚗 (or Car icon lucide-react)
// Number: "STEP 1"
// Title: "Book Online"
// Description: "Pick your course, choose your instructor — James or Priya — and select a start date that suits you. Takes less than 2 minutes on our booking page."

// STEP 2: Learn at Your Pace
// Emoji/Icon: 📚 (or BookOpen icon)
// Number: "STEP 2"
// Title: "Learn at Your Pace"
// Description: "Your instructor adapts every lesson to your progress. You're never rushed, never made to feel silly for not getting something immediately. We've all been there."

// STEP 3: Take Your Test
// Emoji/Icon: ✅ (or CheckCircle icon)
// Number: "STEP 3"
// Title: "Take Your Test"
// Description: "When you're ready — and only when you're ready — we'll book your practical driving test. Your instructor comes with you on test day to meet you at the centre."

// STEP 4: Drive!
// Emoji/Icon: 🎉 (or Star icon)
// Number: "STEP 4"
// Title: "Drive!"
// Description: "You've passed. Now the real driving begins. We offer post-pass motorway sessions to build confidence on faster roads — many new drivers find these invaluable."
```

---

## Section 5: Instructors

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "Your instructors."
// Plus Jakarta Sans 800 text-5xl text-[hsl(var(--foreground))] mb-12

// Grid: grid grid-cols-1 md:grid-cols-2 gap-8

// INSTRUCTOR CARD:
// bg-white rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-sm
// flex flex-col lg:flex-row

// Image: h-64 lg:h-auto lg:w-56 flex-shrink-0 overflow-hidden
//   img: w-full h-full object-cover object-top

// Card body: p-8 flex flex-col justify-center

// Name: Plus Jakarta Sans 800 text-2xl text-[hsl(var(--foreground))] mb-1

// Role/speciality: Inter 500 text-sm text-[hsl(var(--primary))] mb-4

// Bio: Inter 400 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6

// Credential tags (flex flex-wrap gap-2):
//   bg-[hsl(var(--muted))] text-[hsl(var(--foreground)/0.6)] text-xs px-3 py-1 rounded-full Inter 400

// INSTRUCTOR 1: James Cooper
{/* Image: friendly professional male driving instructor in his late 30s, smart casual appearance, confident relaxed smile, standing next to a modern Ford Focus with the passenger door open, suburban Manchester setting, welcoming and approachable */}
<img src="" alt="James Cooper, Clearway Driving School instructor" className="w-full h-full object-cover object-top" />
// Name: "James Cooper"
// Role: "ADI Qualified · Nervous Learner Specialist"
// Bio: "James has taught over 800 learners across Greater Manchester over 10 years of instruction. His structured, methodical approach makes lessons easy to follow — particularly for nervous learners, older returners, and anyone who's had a bad experience at a previous school. He passed his driving test first time and hasn't forgotten what it felt like to be a beginner."
// Tags: "ADI Qualified" | "10 Years Teaching" | "800+ Students" | "Motorway Specialist"

// INSTRUCTOR 2: Priya Sharma
{/* Image: friendly professional female driving instructor, professional appearance, warm encouraging smile, inside or beside a modern dual-control teaching car, professional driving school setting, patient and confident demeanour */}
<img src="" alt="Priya Sharma, Clearway Driving School instructor" className="w-full h-full object-cover object-top" />
// Name: "Priya Sharma"
// Role: "ADI Qualified · Anxiety & Nervous Learner Specialist"
// Bio: "Priya specialises in working with learners who find driving particularly stressful — including those who've failed their test multiple times or have test anxiety. Her patient, non-judgemental style creates the kind of calm, supportive lesson environment where nervous learners genuinely thrive. Her personal first-time pass rate for anxious learners is 89%."
// Tags: "ADI Qualified" | "6 Years Teaching" | "Anxiety Specialist" | "Test Prep Expert"
```

---

## Section 6: Pass Rate Stats

```tsx
// Background: bg-[hsl(var(--primary))]
// Color: text-white
// Padding: py-24

// Container: max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center

// Main stat:
// "93%" — Plus Jakarta Sans 800, font-size: 8rem (128px) desktop → text-8xl mobile
// text-white leading-none mb-4
// Framer Motion: whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.8 }}
//   viewport={{ once: true }} transition={{ duration: 0.6, type: 'spring' }}

// Label: "First-time pass rate"
// Inter 400 text-2xl text-white/85 mb-3

// Comparison note: "National average: 47% · Clearway average: 93%"
// Inter 400 text-base text-white/65 mb-16

// Additional stats row (grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto):

// Each sub-stat: text-center
// bg-[hsl(0 0% 100% / 0.12)] rounded-2xl p-6
// Number: Plus Jakarta Sans 800 text-3xl text-white mb-1
// Label: Inter 400 text-sm text-white/70

// Sub-stat 1: "2,400+" / "Students taught since 2010"
// Sub-stat 2: "4.9★" / "Google rating — 847 reviews"
```

---

## Section 7: Student Reviews

```tsx
// Background: bg-white
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "What our students say."
// Plus Jakarta Sans 800 text-5xl text-[hsl(var(--foreground))] mb-12

// Grid: grid grid-cols-1 md:grid-cols-2 gap-6

// REVIEW CARD:
// bg-[hsl(var(--muted))] rounded-2xl p-6 border border-[hsl(var(--border))]
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
//   viewport={{ once: true }} transition={{ delay: index * 0.1 }}

// Stars: "★★★★★" text-[hsl(var(--primary))] text-base mb-3

// Quote: Inter 400 text-base leading-relaxed text-[hsl(var(--foreground)/0.8)] mb-4

// Attribution row: flex items-center justify-between
//   Name: Inter 500 text-sm text-[hsl(var(--foreground))]
//   Course: Inter 400 text-xs text-[hsl(var(--muted-foreground))] mt-0.5

// REVIEW 1:
// Quote: "I failed with two other schools before coming to Clearway. James broke everything down in a way that finally made sense to me — particularly the roundabouts I always struggled with. Passed first time. Genuinely wish I'd come here first."
// Name: "Daniel O." | Course: "Beginner Lessons"

// REVIEW 2:
// Quote: "Did the intensive course in a week. I was terrified of the idea but Priya was incredible. She kept me calm when I wanted to quit on day two, worked on my specific weaknesses each afternoon, and I passed on Friday morning. The best £450 I've ever spent."
// Name: "Amara J." | Course: "Intensive 5-Day Course"

// REVIEW 3:
// Quote: "I'm 47 and hadn't driven in 12 years. I felt embarrassed calling a driving school at my age. James made me feel completely normal about it — no impatience, no judgement. I passed on my first attempt and now I drive every day."
// Name: "Helen M." | Course: "Refresher Lessons"

// REVIEW 4:
// Quote: "Booked online in about 3 minutes, had my first lesson booked for that same week. The car was modern and clean, the instructor arrived early and immediately made me feel at ease. Everything a driving school should be — nothing it shouldn't."
// Name: "Callum T." | Course: "Beginner Lessons"
```

---

## Section 8: Pricing

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-5xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "Clear, honest pricing."
// Plus Jakarta Sans 800 text-5xl text-[hsl(var(--foreground))] text-center mb-12

// Grid: grid grid-cols-1 lg:grid-cols-2 gap-12

// LEFT — Pricing Table:
// bg-white rounded-2xl p-8 border border-[hsl(var(--border))] shadow-sm

// "Individual Rates" — Inter 500 text-sm uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-6

// Table rows (divide-y divide-[hsl(var(--border))]):
// Each: flex justify-between items-center py-4

// Row label: Inter 400 text-base text-[hsl(var(--foreground)/0.8)]
// Row price: Plus Jakarta Sans 700 text-base text-[hsl(var(--primary))]
// "BEST VALUE" badge: bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-xs Inter 500 px-2 py-0.5 rounded ml-2

// Rows:
// "Single Lesson (1 hour)" → "£35 / hour"
// "Block of 5 hours" → "£165" (save £10 note in text-xs below)
// "Block of 10 hours" → "£320 [BEST VALUE]" (save £30 note)
// "Intensive 5-Day Course" → "£450" (test fee included note)
// "Refresher Lessons" → "£40 / hour"
// "Theory Test Prep Session" → "£35 (1-hour session)"

// RIGHT — Info Card:
// bg-white rounded-2xl p-8 border border-[hsl(var(--border))] shadow-sm

// Icon: HelpCircle from lucide-react w-8 h-8 text-[hsl(var(--primary))] mb-4

// Heading: "Not sure which to choose?"
// Plus Jakarta Sans 800 text-2xl text-[hsl(var(--foreground))] mb-3

// Body: "Book a free 15-minute introductory call with your chosen instructor before committing. We'll talk through your experience level, goals, and schedule — and recommend the best option for you. No obligation, no hard sell."
// Inter 400 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6

// CTA: "Book a Free Call"
// bg-[hsl(var(--primary))] text-white rounded-full px-6 py-3 Inter 500 text-sm
// hover:opacity-90 transition-opacity inline-block

// Below grid:
// "All prices include VAT. Test fee (£62) included in Intensive 5-Day Course only."
// Inter 400 text-xs text-[hsl(var(--muted-foreground))] text-center mt-6
```

---

## Section 9: Theory Test Prep

```tsx
// Background: bg-white
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Grid: grid grid-cols-1 lg:grid-cols-2 gap-16 items-center

// LEFT — Text:
// Label: "THEORY TEST SUPPORT"
// Inter 400 text-xs tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))] mb-4

// Heading: "Pass your theory test too."
// Plus Jakarta Sans 800 text-5xl text-[hsl(var(--foreground))] leading-tight mb-6

// Body: "The theory test catches more learners off guard than the practical. Many students focus entirely on driving and leave the theory to the last minute — and it shows. We offer dedicated 1-hour theory prep sessions where your instructor walks you through the hazard perception test, the most commonly failed question categories, and time management tips for the multiple-choice paper."
// Inter 400 text-base text-[hsl(var(--muted-foreground))] leading-relaxed mb-6

// "We also recommend the official DVSA revision guide and the DVSA Theory Test Kit app — both are linked below. One session with us plus two weeks of app practice is typically all most students need."
// Same style, mb-8

// Info box:
// bg-[hsl(var(--muted))] rounded-2xl p-6 border border-[hsl(var(--border))] mb-8

// "WHAT'S COVERED IN A THEORY PREP SESSION" — Inter 500 text-xs tracking-wider uppercase text-[hsl(var(--foreground)/0.5)] mb-4

// Checklist (space-y-3):
// Each: flex items-start gap-2
//   CheckCircle2 from lucide-react size=14 text-[hsl(var(--primary))]
//   Inter 400 text-sm text-[hsl(var(--foreground)/0.8)]
// Items:
//   "Highway Code revision — the 15 most-failed categories"
//   "Hazard perception test walkthrough with 3 practice clips"
//   "Mock multiple-choice paper (50 questions, timed)"
//   "Road sign refresher — official DVSA image bank"
//   "Q&A: any areas you're unsure about"

// CTA: "Book a Theory Prep Session →"
// bg-[hsl(var(--primary))] text-white rounded-full px-8 py-3 Inter 500 hover:opacity-90 transition-opacity

// RIGHT — Image:
// h-[450px] rounded-2xl overflow-hidden
// Framer Motion: whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 30 }}
//   viewport={{ once: true }} transition={{ duration: 0.6 }}
{/* Image: young person studying for the UK driving theory test on a tablet, bright natural window light, theory test revision screen visible on device, focused and engaged expression, clean study environment */}
<img src="" alt="Driving theory test preparation" className="w-full h-full object-cover" />
```

---

## Section 10: FAQ + Footer

```tsx
// FAQ Section:
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-3xl mx-auto px-4 sm:px-6 lg:px-8

// Heading: "Common questions."
// Plus Jakarta Sans 800 text-5xl text-[hsl(var(--foreground))] text-center mb-12

// shadcn/ui Accordion: type="single" collapsible

// AccordionItem: border border-[hsl(var(--border))] rounded-2xl px-6 mb-3 bg-white
// AccordionTrigger: Plus Jakarta Sans 700 text-base text-[hsl(var(--foreground))] py-5 hover:no-underline
// AccordionContent: Inter 400 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] pb-5

// Q1: "How long does it take to learn to drive?"
// A1: "The DVSA recommends around 45 hours of professional lessons plus 22 hours of private practice for the average learner. Every learner is different — some are test-ready in 30 hours, others need 60. With our intensive course, learners can be test-ready in 5 days. We'll give you an honest assessment after your first lesson."

// Q2: "What car do you use for lessons?"
// A2: "We use a modern dual-control Ford Focus or similar vehicle. The car is current-year or one year old, fully serviced, and covered by comprehensive learner driver insurance. Dual controls are fitted as standard — your instructor can brake from the passenger seat if needed. The car is clean and meets all current DVSA standards."

// Q3: "Can I choose my instructor?"
// A3: "Yes — when booking you can request either James Cooper or Priya Sharma. If your preferred instructor doesn't have availability for your requested dates, we'll let you know immediately. If you book with one instructor and feel you'd prefer to switch, just let us know — we handle this without any awkwardness."

// Q4: "What if I fail my test?"
// A4: "Don't worry — it happens to more learners than you might think, even well-prepared ones. After a failed test, your instructor will debrief with you to understand exactly what went wrong and design targeted follow-up sessions addressing those specific areas. Most learners who fail once pass on their second attempt with 3–5 additional hours of focused work."

// FOOTER:
// Background: bg-white
// Border: border-t border-[hsl(var(--border))]
// Padding: py-16

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Grid: grid grid-cols-1 md:grid-cols-3 gap-12

// Column 1 — Logo + location:
// Steering wheel logo + CLEARWAY (same as navbar)
// "Manchester, Greater Manchester" — Inter 400 text-sm text-[hsl(var(--muted-foreground))] mt-3
// "Serving M, SK, OL, BL postcodes" — Inter 400 text-xs text-[hsl(var(--muted-foreground))] mt-1
// Google Rating badge (flex items-center gap-1 mt-4 p-2 bg-[hsl(var(--muted))] rounded-lg inline-flex):
//   "⭐ 4.9 / 5" — Inter 500 text-sm
//   " (847 reviews)" — Inter 400 text-xs text-[hsl(var(--muted-foreground))]

// Column 2 — Links:
// "Quick Links" — label style
// Courses | Our Instructors | Pricing | Theory Test Prep | Book a Lesson
// Inter 400 text-sm text-[hsl(var(--muted-foreground))] block py-1 hover:text-[hsl(var(--foreground))] transition-colors

// Column 3 — Contact:
// "Contact Us" — label
// Phone: "0161 900 0001" — Inter 500 text-sm text-[hsl(var(--foreground))] mb-1
// Email: "hello@clearwaydriving.co.uk" — same style mb-6
// "ADI Registered · Fully Insured · DBS Checked" — Inter 400 text-xs text-[hsl(var(--muted-foreground))] mt-1

// Footer bottom:
// mt-12 pt-8 border-t border-[hsl(var(--border))]
// flex flex-col sm:flex-row justify-between items-center gap-3
// "© 2025 Clearway Driving School. All rights reserved. ADI Registered." — Inter 400 text-xs text-[hsl(var(--muted-foreground))]
```

---

## App Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── hooks/
│   └── useCountUp.ts          # requestAnimationFrame counter hook
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx        # Grid hero with animated counters
│   ├── CoursesSection.tsx     # 3 course cards
│   ├── JourneySection.tsx     # 4-step road with car SVG
│   ├── InstructorsSection.tsx # 2 instructors
│   ├── PassRateSection.tsx    # Orange stats section
│   ├── ReviewsSection.tsx     # 4 review cards
│   ├── PricingSection.tsx     # Table + info card
│   ├── TheorySection.tsx      # Theory test prep
│   ├── FAQSection.tsx         # shadcn Accordion
│   └── Footer.tsx
└── components/ui/
```

```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 228 17% 14%;
    --primary: 14 91% 57%;
    --primary-foreground: 0 0% 100%;
    --muted: 220 7% 95%;
    --card: 0 0% 100%;
    --card-foreground: 228 17% 14%;
    --border: 220 10% 88%;
    --muted-foreground: 220 10% 50%;
    --accent: 220 17% 20%;
  }
  body {
    font-family: 'Inter', sans-serif;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
  }
}
```

---

## Setup Commands

```bash
npm create vite@latest clearway-driving -- --template react-ts
cd clearway-driving
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init
npx shadcn-ui@latest add accordion button input select
npm install motion
npm install lucide-react
```

---

## Key Implementation Notes

1. **useCountUp Hook**: Place in `src/hooks/useCountUp.ts`. The hook starts counting on mount — use it only in the Hero component so it runs immediately on page load. For the 2,400+ students counter, call `useCountUp(2400, 2000)` and display with `.toLocaleString()` for the comma separator: `{studentsCount.toLocaleString()}+`.

2. **93% Stat Section**: The orange "Pass Rate" section (Section 6) is deliberately a full-width orange block — it serves as a high-contrast visual break and a conversion-driving stat. The 93% figure in 128px Plus Jakarta Sans 800 is intentionally oversized — it should command the section. Pair with the spring scale-up animation on scroll.

3. **Car SVG on Mobile**: The car animation only runs on desktop (`lg:block hidden`). On mobile, the 4 steps stack vertically with connecting dotted left border (like the Good Boy Academy timeline). No car animation on mobile — the experience is simplified to a clean numbered list.

4. **Counter Numbers**: `useCountUp` starts at 0 on mount. If the counters are not visible on page load (e.g., they're below the fold), consider adding an `IntersectionObserver` inside the hook to delay the start until the element is visible. However, for the hero position, page-load start is correct.

5. **Orange Palette**: Signal orange `hsl(14 91% 57%)` is the entire accent of this website — the background is white, the body text is near-black, and the only colour is orange. This creates a very high-contrast, immediately trustworthy design that performs well as a local services website (clear, no-nonsense, professional).

6. **Dual-Control Car Image**: The hero image specifically mentions "dual-control pedal visible" in the image description comment. This detail signals professionalism and safety to the viewer — it distinguishes a professional ADI instructor from an informal arrangement. Keep this detail in any replacement photography.

7. **ADI Registration**: The footer mentions "ADI Registered" twice. ADI (Approved Driving Instructor) is the UK legal requirement for professional driving instruction — it's an important trust signal. Keep this visible in the footer and potentially in the instructor credential tags.
