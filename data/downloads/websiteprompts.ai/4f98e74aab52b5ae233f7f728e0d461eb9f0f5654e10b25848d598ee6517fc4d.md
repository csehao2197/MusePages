# GOOD BOY ACADEMY — Dog Trainer Website Prompt

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS + Framer Motion (`motion/react`) + shadcn/ui + lucide-react  
**Niche:** Professional Dog Training Studio

---

## Design System

### Colors (HSL in :root CSS custom properties)

```css
:root {
  --background: 36 44% 89%;        /* warm sand #F2E8D5 */
  --foreground: 60 3% 10%;         /* near-black #1A1A18 */
  --primary: 155 37% 26%;          /* forest green #2A5C45 */
  --primary-foreground: 36 44% 95%;
  --accent: 18 52% 55%;            /* terracotta #C8714A */
  --muted: 36 30% 83%;
  --muted-foreground: 60 3% 40%;
  --border: 36 20% 75%;
  --card: 36 44% 95%;
  --card-foreground: 60 3% 10%;
}
```

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&family=DM+Sans:wght@300;400;500&display=swap');

/* Headings: DM Serif Display 400 italic */
/* Body: DM Sans 300/400/500 */
```

Apply globally:
```css
body {
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 {
  font-family: 'DM Serif Display', serif;
  font-style: italic;
}
```

### Tailwind Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### Design Tokens — Usage Guide

The colour system is intentionally restrained to four roles:

- **`--background` (warm sand)**: The dominant surface. Used for the page base, hero, method section background, and the trainer section. Creates the warm, earthy, outdoors-adjacent tone.
- **`--card` (light sand)**: Slightly lighter than background, used for programme section, testimonial section, and card components. Creates subtle contrast without switching moods.
- **`--muted` (mid sand)**: Used for the method section and FAQ background. Also used for trust-signal pill backgrounds in the hero.
- **`--primary` (forest green)**: Used only for primary CTAs, link states, profile image borders, checklist icons, accordion triggers, and the journey timeline active states. Do not overuse — its restraint is what gives it authority.
- **`--accent` (terracotta)**: Used exclusively for small labels, star ratings, dog name chips in testimonials, and the sliding dog SVG in the journey timeline. Never used for interactive elements or CTA buttons.
- **`--foreground` (near-black)**: Used for the dark footer background (inverted) and all body text.

---

## Signature Animation: Training Journey Timeline

The "Your Journey With Us" section (Section 6) features an animated horizontal timeline with a sliding dog silhouette. This is the most complex component in the build and should be given careful attention.

```tsx
// TrainingJourney component
// 4 stages arranged horizontally on desktop, vertically on mobile
// A small dog-silhouette SVG slides along a dotted track line as user scrolls

// Dog SVG (inline, 32px × 20px, used as the sliding indicator):
const DogSilhouette = () => (
  <svg viewBox="0 0 32 20" fill="currentColor" className="w-8 h-5 text-[hsl(var(--accent))]">
    {/* Simple running dog side silhouette */}
    <path d="M28 8c0-2-1-3-2-3h-2l-2-3h-4l-1 1-3-1H8c-2 0-4 2-4 4v2l-2 2v4h4v-2h2v2h12v-2l3 1 3-1v-1l2-1V8z"/>
  </svg>
)

// Track: a dotted line connecting all 4 stages
// On desktop: horizontal dotted line, position: absolute, top: 50% of the icons row
// Dog SVG position: absolute on the track, translateX controlled by scrollProgress state

// Full component implementation:
import { useRef, useEffect, useState } from 'react'
import { motion } from 'motion/react'

const STAGES = [
  {
    icon: '🐾',
    step: 'Step 01',
    title: 'Free Assessment',
    description: 'A 30-minute call to understand your dog, your goals, and which programme is right for you. No obligation, no pressure.',
  },
  {
    icon: '📋',
    step: 'Step 02',
    title: 'Training Plan',
    description: 'We design a personalised training programme built around your specific dog — not a cookie-cutter approach.',
  },
  {
    icon: '🎾',
    step: 'Step 03',
    title: 'Training Sessions',
    description: 'Regular sessions with Sarah, homework exercises, and WhatsApp support between every visit.',
  },
  {
    icon: '🏆',
    step: 'Step 04',
    title: 'Graduate',
    description: 'Your dog completes the programme. You receive a certificate — and the skills to keep it going for life.',
  },
]

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dogX, setDogX] = useState(0)
  const [activeStage, setActiveStage] = useState(-1)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !trackRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      // Progress: 0 when section enters viewport, 1 when section is fully scrolled through
      const progress = Math.min(1, Math.max(0, (windowH - rect.top) / (windowH + rect.height)))
      const trackWidth = trackRef.current.offsetWidth
      const dogWidth = 32
      setDogX(progress * (trackWidth - dogWidth))
      setActiveStage(Math.floor(progress * STAGES.length))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-[hsl(var(--primary)/0.04)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl text-center mb-16 text-[hsl(var(--foreground))]">
          Your journey with us.
        </h2>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative">
          {/* Track line */}
          <div
            ref={trackRef}
            className="absolute top-7 left-0 right-0 border-t-2 border-dashed border-[hsl(var(--border))] z-0"
          />
          {/* Sliding dog */}
          <motion.div
            className="absolute top-[calc(1.75rem-10px)] z-20"
            animate={{ x: dogX }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          >
            <DogSilhouette />
          </motion.div>

          {/* Stages */}
          <div className="flex justify-between relative z-10">
            {STAGES.map((stage, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 border-2 transition-all duration-500
                    ${activeStage > i
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'
                    }`}
                >
                  {stage.icon}
                </div>
                <p className="text-xs text-[hsl(var(--foreground)/0.4)] uppercase tracking-wider mb-1 font-sans font-light">
                  {stage.step}
                </p>
                <h3 className="text-xl text-[hsl(var(--foreground))] mb-3 text-center">
                  {stage.title}
                </h3>
                <p className="text-sm text-[hsl(var(--foreground)/0.65)] leading-relaxed max-w-[180px] text-center font-sans font-light">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical layout */}
        <div className="lg:hidden relative pl-8 border-l-2 border-dashed border-[hsl(var(--border))]">
          {STAGES.map((stage, i) => (
            <motion.div
              key={i}
              className="mb-10 relative"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -16 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="absolute -left-[calc(2rem+7px)] top-0 w-3.5 h-3.5 rounded-full bg-[hsl(var(--primary))] border-2 border-[hsl(var(--background))]" />
              <p className="text-xs text-[hsl(var(--foreground)/0.4)] uppercase tracking-wider mb-1 font-sans font-light">
                {stage.step}
              </p>
              <h3 className="text-2xl text-[hsl(var(--foreground))] mb-2">{stage.title}</h3>
              <p className="text-sm text-[hsl(var(--foreground)/0.65)] leading-relaxed font-sans font-light">
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CSS for the track:
// .journey-track: position absolute, top 50%, border-top: 2px dashed hsl(var(--border))
// width: calc(100% - 2rem), left: 1rem

// Stage marker circles: w-12 h-12 rounded-full bg-[hsl(var(--card))] border-2 border-[hsl(var(--border))]
// Active (when dog passes): border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] transition-all
```

---

## Section 1: Navbar

```tsx
// Sticky top: position sticky top-0 z-50
// bg-[hsl(var(--background)/0.97)] border-b border-[hsl(var(--border))]
// backdrop-blur-sm for subtle glass effect behind scroll content
// Height: h-16

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Layout: flex items-center justify-between

// Logo: flex items-center gap-2
//   PawPrint icon from lucide-react: w-6 h-6 text-[hsl(var(--primary))]
//   "GOOD BOY ACADEMY" — font-family DM Serif Display italic text-xl text-[hsl(var(--primary))]

// Desktop nav (hidden below lg, lg:flex gap-8):
// "Programs" | "Our Method" | "About" | "Testimonials" | "Book Assessment"
// Font: DM Sans 300 text-sm text-[hsl(var(--foreground)/0.65)]
// Hover: text-[hsl(var(--foreground))] transition-colors duration-150

// "Book Assessment" CTA:
// bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
// DM Sans 500 text-sm
// rounded-full px-5 py-2
// hover:opacity-90 transition-opacity

// Mobile hamburger: Menu icon from lucide-react, shown lg:hidden
// Use useState for isOpen, toggle on click
// X icon from lucide-react replaces Menu icon when open

// Mobile menu: slides down from under navbar
// Framer Motion: AnimatePresence wrapping the menu div
// initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
// transition={{ duration: 0.2 }}
// bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] shadow-sm
// Links: py-3 px-6 border-b border-[hsl(var(--muted))] DM Sans 400 text-base
// Last item: "Book Assessment" as a full-width button
//   bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg mx-6 my-3 py-2.5 text-center DM Sans 500

// Scroll behaviour: add shadow-sm when scrolled past 10px
// useEffect with scroll listener, toggle 'scrolled' state
// Conditional: className={scrolled ? 'shadow-sm' : ''}

// Full component:
import { useState, useEffect } from 'react'
import { PawPrint, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const NAV_LINKS = ['Programs', 'Our Method', 'About', 'Testimonials']

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-[hsl(var(--background)/0.97)] border-b border-[hsl(var(--border))] backdrop-blur-sm transition-shadow ${scrolled ? 'shadow-sm' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <PawPrint className="w-6 h-6 text-[hsl(var(--primary))]" />
          <span className="font-serif italic text-xl text-[hsl(var(--primary))]">GOOD BOY ACADEMY</span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-sans font-light text-[hsl(var(--foreground)/0.65)] hover:text-[hsl(var(--foreground))] transition-colors">
              {link}
            </a>
          ))}
          <a href="#book"
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-sans font-medium rounded-full px-5 py-2 hover:opacity-90 transition-opacity">
            Book Assessment
          </a>
        </nav>

        <button className="lg:hidden" onClick={() => setIsOpen(v => !v)} aria-label="Toggle menu">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.2 }}
            className="lg:hidden bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] shadow-sm"
          >
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="block py-3 px-6 border-b border-[hsl(var(--muted))] font-sans font-light text-base"
                onClick={() => setIsOpen(false)}>
                {link}
              </a>
            ))}
            <div className="px-6 py-3">
              <a href="#book"
                className="block bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-center rounded-lg py-2.5 font-sans font-medium">
                Book Assessment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

---

## Section 2: Hero

```tsx
// min-h-screen bg-[hsl(var(--background))]
// Grid: grid lg:grid-cols-2 items-center
// On mobile: single column, image below text

// LEFT COLUMN (px-6 sm:px-12 py-16 lg:py-24):

// Pre-label: "SURREY · FEAR-FREE CERTIFIED"
// DM Sans 300 text-xs tracking-[0.3em] text-[hsl(var(--accent))] uppercase mb-4

// Headline: "Every dog. Every breed. Every stage."
// Font: DM Serif Display italic
// Size: text-6xl lg:text-7xl (desktop) → text-4xl sm:text-5xl (mobile)
// Color: text-[hsl(var(--foreground))]
// Leading: leading-tight mb-6

// Subtext:
// "Professional dog training that works with your dog's nature, not against it. From boisterous puppies to dogs with complex behaviour challenges — we meet them where they are."
// DM Sans 300 text-lg text-[hsl(var(--foreground)/0.7)] leading-relaxed mb-8 max-w-lg

// CTA Row (flex flex-wrap gap-4):
// Primary: "Book Free Assessment"
//   bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
//   px-8 py-3 rounded-lg DM Sans 500 hover:opacity-90 transition-opacity
// Ghost: "Our Programs ↓"
//   border border-[hsl(var(--primary))] text-[hsl(var(--primary))]
//   px-8 py-3 rounded-lg DM Sans 400 hover:bg-[hsl(var(--primary)/0.05)] transition-colors

// Trust signals (flex flex-wrap gap-2 mt-6):
// Pill-style tags: bg-[hsl(var(--muted))] border border-[hsl(var(--border))]
//   text-[hsl(var(--foreground)/0.6)] text-xs px-3 py-1.5 rounded-full DM Sans 300
// Text: "COAPE Certified" · "Fear Free" · "12+ Years Experience" · "Fully Insured"

// Entrance animation:
// Wrap entire left column in motion.div
// initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}

// RIGHT COLUMN:
// h-[55vh] lg:h-screen relative overflow-hidden
// On mobile: order-first (image above text on smallest screens) or order-last depending on design preference
// On desktop: right side, full height, no rounding (full-bleed to edge)
// On mobile: rounded-2xl mx-4 mb-6

{/* Image: friendly professional dog trainer working one-on-one with a golden retriever outdoors, Surrey countryside setting, warm afternoon golden hour light, trainer crouching at dog's level showing treats, warm professional and approachable atmosphere */}
<img
  src=""
  alt="Professional dog trainer with golden retriever in Surrey"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>

// Optional: very subtle dark gradient overlay at bottom of image to allow text overlap if needed
// bg-gradient-to-t from-black/20 to-transparent absolute inset-0

// Right col entrance:
// initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}

// Stat row (optional, below hero on mobile or floating bottom-left on desktop):
// 3 quick stats: "500+ Dogs Trained" · "12 Years Experience" · "100% Fear Free"
// Each: DM Serif Display italic text-2xl value, DM Sans 300 text-xs label below
// Separated by thin dividers: border-r border-[hsl(var(--border))]
```

---

## Section 3: Training Programs

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "WHAT WE OFFER"
// DM Sans 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--accent))] mb-4

// Heading: "Programs designed for where you are."
// DM Serif Display italic text-5xl text-[hsl(var(--foreground))] leading-tight mb-4

// Subheading: "Whether you have a brand-new puppy or a dog with a complex history, there's a programme built around your dog's actual situation."
// DM Sans 300 text-base text-[hsl(var(--foreground)/0.6)] mb-12 max-w-2xl

// Grid: grid grid-cols-1 lg:grid-cols-3 gap-8

// PROGRAM CARD COMPONENT (ProgramCard):
// bg-[hsl(var(--background))] rounded-3xl overflow-hidden border border-[hsl(var(--border))]
// hover:shadow-md transition-shadow duration-300
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
//   viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }}
// flex flex-col (so CTA button stays at bottom)

// Image (top, h-52 w-full):

// Content: p-8 lg:p-10 flex-1 flex flex-col

// Price badge: inline-flex items-center DM Sans 500 text-sm bg-[hsl(var(--primary)/0.1)]
//   text-[hsl(var(--primary))] px-3 py-1 rounded-full mb-3 self-start

// Program name: DM Serif Display italic text-3xl text-[hsl(var(--foreground))] mb-3

// Description: DM Sans 300 text-base leading-relaxed text-[hsl(var(--foreground)/0.7)] mb-6 flex-1

// Divider: border-t border-[hsl(var(--border))] mb-6

// "What's included" label:
// DM Sans 500 text-xs text-[hsl(var(--foreground)/0.45)] uppercase tracking-[0.15em] mb-3

// Includes list (space-y-2 mb-6):
// Each item: flex items-start gap-2
// CheckCircle2 icon from lucide-react: size=14 className="text-[hsl(var(--primary))] mt-0.5 flex-shrink-0"
// Text: DM Sans 300 text-sm text-[hsl(var(--foreground)/0.7)]

// CTA button (mt-auto):
// "Find Out More →"
// border border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-lg px-6 py-2.5 w-full
// DM Sans 500 text-sm text-center
// hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors duration-200

// PROGRAM 1: Puppy Foundation — £45/session
{/* Image: adorable puppy learning to sit with patient trainer, outdoor training environment on grass, sunny afternoon, happy energetic small puppy looking up attentively at trainer, warm lifestyle photography */}
<img src="" alt="Puppy foundation training at Good Boy Academy" className="w-full h-full object-cover" />
// Badge: "£45/session"
// Name: "Puppy Foundation"
// Description: "For puppies 8 weeks – 6 months. We start from scratch: socialisation, bite inhibition, sit, stay, come, lead walking, and house manners. Sessions are fun, reward-based, and structured so your puppy actually enjoys learning. This is the most important investment you can make in your dog's future."
// Includes:
//   "6-week course (12 sessions)"
//   "Puppy workbook to track progress"
//   "WhatsApp support between sessions"
//   "Certificate of completion"
//   "Discount on follow-up Adult programme"

// PROGRAM 2: Adult Obedience — £55/session
{/* Image: well-trained border collie sitting attentively on a woodland path, owner standing nearby smiling with pride, beautiful dappled green park light, lifestyle dog photography with natural warm tones */}
<img src="" alt="Adult dog obedience training in woodland park" className="w-full h-full object-cover" />
// Badge: "£55/session"
// Name: "Adult Obedience"
// Description: "For dogs 6 months+. Whether your dog ignores recall, pulls on lead, barks at other dogs, or just needs a brush-up on the basics, we'll build reliable, real-world obedience through positive reinforcement — not correction. Training that works both inside the home and out on busy streets."
// Includes:
//   "Tailored 8-session programme"
//   "Written progress report"
//   "Training guide PDF (yours to keep)"
//   "1 complimentary follow-up session"
//   "Lifetime email support after graduation"

// PROGRAM 3: Behaviour & Rehabilitation — £75/session
{/* Image: calm patient dog trainer working with a reactive-looking dog in an open field, using gentle body language and space, professional outdoor behaviour consultation, serene but focused atmosphere, golden afternoon light */}
<img src="" alt="Dog behaviour rehabilitation session in open field" className="w-full h-full object-cover" />
// Badge: "£75/session"
// Name: "Behaviour & Rehabilitation"
// Description: "For dogs with anxiety, reactivity, aggression, or complex behaviour challenges. These bespoke programmes are designed after a thorough initial assessment — because every difficult behaviour has a root cause we need to understand before we can help. No shortcuts, no punishment, no timeline pressure."
// Includes:
//   "2-hour initial assessment (included)"
//   "Fully bespoke written training plan"
//   "Video progress review sessions"
//   "Direct trainer contact between sessions"
//   "No fixed session limit — we work until it works"
//   "Vet liaison where appropriate"
```

---

## Section 4: Our Method

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Grid: grid grid-cols-1 lg:grid-cols-2 gap-16 items-center

// LEFT: Text content
// py-8
// Label: "HOW WE WORK"
// DM Sans 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--accent))] mb-4

// Heading: "We train with dogs, not against them."
// DM Serif Display italic text-5xl text-[hsl(var(--foreground))] leading-tight mb-8

// Paragraph 1:
// "Good Boy Academy is built on one principle: dogs learn best when they want to learn. That means we never use punishment, correction collars, choke chains, or anything that creates fear or pain. Every technique we use is rooted in modern behavioural science and positive reinforcement — the same methods used by the world's leading animal behaviourists."
// DM Sans 300 text-base leading-relaxed text-[hsl(var(--foreground)/0.75)] mb-4

// Paragraph 2:
// "We take time to understand your dog as an individual — their history, their triggers, their temperament, and their needs. Only then do we design a training path that's realistic for your life and genuinely effective for your dog. Some dogs respond in three sessions. Some take twelve. We adjust as we go."
// Same style, mb-4

// Paragraph 3:
// "Our approach is certified by COAPE (Centre of Applied Pet Ethology) and aligned with Fear Free principles. We work in partnership with local vets and animal behaviourists when complex needs arise. If we can't help, we'll tell you — and we'll refer you to someone who can."
// Same style, mb-8

// Credentials row (flex flex-wrap gap-2):
// Pills: bg-[hsl(var(--card))] border border-[hsl(var(--border))]
//   text-[hsl(var(--foreground)/0.65)] text-xs px-3 py-1.5 rounded-full DM Sans 400
// "COAPE Certified" | "Fear Free Practitioner" | "APDT Member" | "Fully Insured"

// Entrance:
// whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -40 }}
// viewport={{ once: true }} transition={{ duration: 0.6 }}

// RIGHT: Image
// rounded-3xl overflow-hidden h-[500px]
// Framer Motion: whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 40 }}
//   viewport={{ once: true }} transition={{ duration: 0.7 }}
{/* Image: extreme close-up of a trainer's hand gently offering a small treat to a dog at ground level, warm natural afternoon light, soft blurred green background, dog's nose and paw partially visible, reward-based training moment, shallow depth of field */}
<img src="" alt="Reward-based dog training — trainer offering treat" className="w-full h-full object-cover" />

// Method pillars (optional 3-column row below the main 2-col layout):
// 3 small icon + heading + text cards
// "Science-Based" / "Reward-Focused" / "Individually Tailored"
// Icon: Framer icon-style in --primary/0.1 bg, --primary icon colour
// From lucide-react: FlaskConical / Star / UserCheck
// Each: flex items-start gap-3, heading DM Serif Display italic text-lg, body DM Sans 300 text-sm
```

---

## Section 5: Meet the Trainer

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center

// Entrance: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
// viewport={{ once: true }} transition={{ duration: 0.6 }}

// Profile image:
// mx-auto mb-8
// w-40 h-40 rounded-full overflow-hidden
// border-4 border-[hsl(var(--primary))] shadow-md shadow-[hsl(var(--primary)/0.2)]
{/* Image: Sarah Mitchell, professional dog trainer, warm friendly headshot, outdoors in a park with soft bokeh tree background, confident warm personality, casual professional clothing such as a light khaki jacket, natural smile, approachable expression */}
<img src="" alt="Sarah Mitchell, Founder of Good Boy Academy" className="w-full h-full object-cover object-top" />

// Name: "Sarah Mitchell"
// DM Serif Display italic text-5xl text-[hsl(var(--foreground))] mb-2

// Subtitle: "Founder & Lead Trainer · COAPE Certified · 12 Years Experience"
// DM Sans 300 text-base text-[hsl(var(--foreground)/0.55)] mb-8

// Bio paragraph 1:
// "I started Good Boy Academy after years of watching brilliant dogs written off as 'bad' — when really, they were just misunderstood. Every dog I've worked with has taught me something. A nervous rescue collie showed me patience I didn't know I had. A destructive adolescent Labrador reminded me that boredom is a behaviour problem, not a character flaw."
// DM Sans 300 text-base leading-relaxed text-[hsl(var(--foreground)/0.75)] mb-4 text-left sm:text-center

// Bio paragraph 2:
// "I started this work because I believe that the bond between a dog and their owner is one of life's genuine joys — and I want to help every family I work with feel that. Not just a dog that sits on command, but a dog you understand and who understands you."
// Same style, mb-8

// Quote pull:
// max-w-xl mx-auto mt-4
// border-l-4 border-[hsl(var(--primary))] pl-6 py-2
// text-left
// DM Serif Display italic text-2xl text-[hsl(var(--foreground)/0.8)]
// "Training is the most loving thing you can do for your dog."

// Optional: small icon row of press mentions or association logos
// "As recognised by" label, then grayscale logos/text of COAPE, APDT, Fear Free
// opacity-40 on container, DM Sans 300 text-xs uppercase tracking-wider mb-2
```

---

## Section 6: The Training Journey (Signature Timeline)

See the full component implementation at the top of this document under "Signature Animation: Training Journey Timeline". The section uses the `JourneySection` component with the inline scroll-tracking logic and dog SVG slider.

Key styling recap:

```tsx
// Section wrapper:
// Background: bg-[hsl(var(--primary)/0.04)] — very subtle green tint
// Padding: py-24
// Container: max-w-5xl mx-auto px-4 sm:px-6 lg:px-8

// Section heading:
// "Your journey with us."
// DM Serif Display italic text-5xl text-[hsl(var(--foreground))] text-center mb-16

// DESKTOP (lg):
// All 4 stages in a horizontal flex row
// Dotted track line: absolute, positioned vertically at top-7 (center of the 56px icon circles)
// Dog SVG: w-8 h-5 text-[hsl(var(--accent))] animated with Framer Motion spring

// MOBILE (below lg):
// Vertical stack with left border dotted line
// pl-8 border-l-2 border-dashed border-[hsl(var(--border))]
// Small filled dot at left for each stage: -left-[calc(2rem+7px)] w-3.5 h-3.5 rounded-full bg-[hsl(var(--primary))]
// Dog icon hidden on mobile

// Stage label: step number in DM Sans 300 text-xs text-[hsl(var(--foreground)/0.4)] uppercase tracking-wider
// Stage title: DM Serif Display italic text-xl (desktop) or text-2xl (mobile)
// Stage description: DM Sans 300 text-sm text-[hsl(var(--foreground)/0.65)] leading-relaxed
// Desktop max-w: max-w-[180px] text-center | Mobile: normal width

// Active state for circles (when dog has passed that stage):
// border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]
// transition-all duration-500
```

---

## Section 7: Testimonials

```tsx
// Background: bg-[hsl(var(--card))]
// Padding: py-24
// Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "REAL RESULTS"
// DM Sans 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--accent))] text-center mb-4

// Heading: "Real dogs. Real results."
// DM Serif Display italic text-5xl text-[hsl(var(--foreground))] text-center mb-12

// Grid: grid grid-cols-1 md:grid-cols-3 gap-6

// TESTIMONIAL CARD:
// bg-[hsl(var(--background))] rounded-3xl p-8 border border-[hsl(var(--border))]
// flex flex-col
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
//   viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.5 }}

// Stars row:
// flex gap-0.5 mb-3
// 5x Star icons from lucide-react: size=14 fill="hsl(var(--accent))" className="text-[hsl(var(--accent))]"
// Or render "★★★★★" as a text node in text-[hsl(var(--accent))] text-base

// Dog name chip: inline-block DM Sans 500 text-xs bg-[hsl(var(--primary)/0.1)]
//   text-[hsl(var(--primary))] px-3 py-1 rounded-full mb-4

// Quote: DM Sans 300 italic text-base leading-relaxed text-[hsl(var(--foreground)/0.8)] mb-6 flex-1
// Wrap in <blockquote> for semantic HTML

// Divider: border-t border-[hsl(var(--border))] mb-4

// Attribution:
// Owner name: DM Sans 500 text-sm text-[hsl(var(--foreground))]
// Dog info: DM Sans 300 text-xs text-[hsl(var(--foreground)/0.45)] mt-1

// TESTIMONIAL 1: Archie the Cocker Spaniel
// Dog chip: "Archie"
// Quote: "Archie was reactive to other dogs — barking, lunging, the full works. We'd tried stopping other training approaches with no luck. After 8 sessions with Sarah, we can walk past other dogs on the pavement without a single reaction. The change in him — and honestly, in us — has been incredible."
// Owner: "Emma B." | Dog: "Archie · Cocker Spaniel"

// TESTIMONIAL 2: Biscuit the Labrador
// Dog chip: "Biscuit"
// Quote: "We got Biscuit as a puppy during lockdown and had absolutely no idea what we were doing. Sarah structured everything perfectly from week one. We went from genuine chaos — chewing, jumping, no recall — to having a dog we're actually proud to show off. The puppy programme was worth every penny."
// Owner: "Tom & Sophie R." | Dog: "Biscuit · Labrador"

// TESTIMONIAL 3: Maya the Border Collie Mix
// Dog chip: "Maya"
// Quote: "Maya has separation anxiety and we'd tried two other trainers before Sarah with no real success. Sarah took the time to understand Maya's specific triggers and designed a very specific, gradual programme. Within 12 weeks, Maya can be left alone for three hours without distress. I genuinely didn't think that was possible."
// Owner: "Rachel H." | Dog: "Maya · Border Collie Mix"

// Below testimonials: trust-bar row
// "Rated 5 stars across 80+ reviews" — centered, DM Sans 300 text-sm text-[hsl(var(--foreground)/0.5)] mt-10
// flex items-center justify-center gap-2
// 5 small filled star icons + count text
```

---

## Section 8: Pricing

```tsx
// Background: bg-[hsl(var(--background))]
// Padding: py-24
// Container: max-w-5xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "TRANSPARENT PRICING"
// DM Sans 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--accent))] text-center mb-4

// Heading: "Straightforward pricing."
// DM Serif Display italic text-5xl text-[hsl(var(--foreground))] text-center mb-4

// Subheading: "No hidden fees. No pressure to book a block. Pay per session or save with a package — the choice is yours."
// DM Sans 300 text-base text-[hsl(var(--foreground)/0.6)] text-center mb-12

// Grid: grid grid-cols-1 md:grid-cols-3 gap-6

// PRICING CARD:
// bg-[hsl(var(--card))] rounded-3xl p-8 border border-[hsl(var(--border))]
// text-center hover:shadow-md transition-shadow duration-300
// flex flex-col
// Framer Motion: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
//   viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.45 }}

// Program name: DM Serif Display italic text-3xl text-[hsl(var(--foreground))] mb-2

// Per-session price: DM Sans 500 text-3xl text-[hsl(var(--primary))] mb-1

// "per session" label: DM Sans 300 text-xs text-[hsl(var(--foreground)/0.4)] mb-2

// Block deal pill: inline-block bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]
//   DM Sans 400 text-xs px-3 py-1 rounded-full mb-6

// Divider: border-t border-[hsl(var(--border))] my-6

// Details text: DM Sans 300 text-sm text-[hsl(var(--foreground)/0.65)] leading-relaxed mb-6 flex-1 text-left

// CTA (mt-auto): "Book a Session →"
// border border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-lg px-6 py-2.5 w-full
// DM Sans 500 text-sm hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors

// CARD 1: Puppy Foundation
// Name: "Puppy Foundation"
// Price: "£45"
// Block: "Block of 12 — £490 (save £50)"
// Details: "6-week structured programme for puppies 8 weeks–6 months. Includes workbook and ongoing WhatsApp support throughout the course."

// CARD 2: Adult Obedience
// Name: "Adult Obedience"
// Price: "£55"
// Block: "8-session package — £399 (save £41)"
// Details: "Personalised 8-session programme for dogs 6 months+. Includes written progress report and 1 complimentary follow-up session at 8 weeks post-programme."

// CARD 3: Behaviour & Rehab
// Name: "Behaviour & Rehab"
// Price: "£75"
// Block: "2-hour assessment — £150 (credited to programme)"
// Details: "Fully bespoke programme for complex behaviour challenges including reactivity, anxiety, and aggression. No session cap — we work until the outcome is achieved."

// Note below cards:
// "All sessions held at your home or a local outdoor environment relevant to your dog's training needs. Travel within 25 miles of Guildford included. Further travel available at £0.45/mile."
// DM Sans 300 text-sm text-[hsl(var(--foreground)/0.45)] text-center mt-8 max-w-xl mx-auto
```

---

## Section 9: FAQ

```tsx
// Background: bg-[hsl(var(--muted))]
// Padding: py-24
// Container: max-w-2xl mx-auto px-4 sm:px-6 lg:px-8

// Label: "GOT QUESTIONS?"
// DM Sans 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--accent))] text-center mb-4

// Heading: "Common questions."
// DM Serif Display italic text-5xl text-[hsl(var(--foreground))] text-center mb-12

// shadcn/ui Accordion:
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
// <Accordion type="single" collapsible className="space-y-3">

// AccordionItem: border border-[hsl(var(--border))] rounded-2xl px-6 bg-[hsl(var(--card))]
// Remove the default border-b on AccordionItem: add [&>*]:border-b-0 or override styles

// AccordionTrigger:
// DM Sans 500 text-base text-[hsl(var(--foreground))] py-5
// hover:no-underline (override shadcn default)
// [&>svg]:text-[hsl(var(--primary))] to style the chevron icon

// AccordionContent:
// DM Sans 300 text-sm leading-relaxed text-[hsl(var(--foreground)/0.7)] pb-5

// Q1: "Where do sessions take place?"
// A1: "All training takes place at your home or a local outdoor space that's relevant to your dog's challenges — a park they find stressful, a road they react on, a café they need to learn to sit outside. We train in the real-world environments your dog actually lives in. There is no need to travel to a training facility."

// Q2: "How quickly will I see results?"
// A2: "Most clients notice meaningful changes within the first 2–3 sessions — improvements in focus, attention, and willingness to engage. Full programme outcomes typically emerge over 6–12 weeks depending on the dog and the challenge. Behaviour change is a process, not an event. We set realistic expectations from day one."

// Q3: "My dog has already been to another trainer. Can you still help?"
// A3: "Yes — and this is more common than you might think. Many of our clients come to us after other approaches haven't delivered lasting results. We start completely fresh: new assessment, new plan, no assumptions. Previous training — positive or otherwise — is part of the picture we consider, not a complication."

// Q4: "Do you work with all breeds?"
// A4: "Yes, without exception. We work with every breed, mix, size, and age. We have extensive experience with gentle family dogs, high-drive working breeds, terriers, livestock guardian breeds, and everything in between. Breed tendencies inform our approach, but every dog is assessed and trained as an individual."

// Q5 (optional fifth): "Is your training safe for rescue dogs?"
// A5: "Absolutely. Many of our most rewarding cases involve rescue dogs with unknown or difficult histories. Fear-free, force-free training is particularly well-suited to dogs who may have trauma or anxiety from past experiences. We always proceed at your dog's pace — never pushing further than they're comfortable with. An initial assessment helps us understand your rescue's specific background before we begin."

// Below FAQ: CTA nudge
// "Still have questions? Just reach out."
// DM Sans 300 text-sm text-[hsl(var(--foreground)/0.5)] text-center mt-10
// "hello@goodboyacademy.co.uk" as a mailto link, text-[hsl(var(--primary))] underline
```

---

## Section 10: Footer

```tsx
// Background: bg-[hsl(var(--foreground))]  — near-black inverted footer
// Color: all text is light on dark
// Padding: py-16

// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Grid: grid grid-cols-1 md:grid-cols-3 gap-12

// Column 1 — Logo + Tagline:
// flex items-center gap-2 mb-4
// PawPrint icon (lucide-react): text-[hsl(var(--background)/0.6)] w-5 h-5
// "GOOD BOY ACADEMY" — DM Serif Display italic text-xl text-[hsl(var(--background))]
// Tagline: "Every dog. Every breed. Every stage."
//   DM Sans 300 text-sm text-[hsl(var(--background)/0.55)] mt-2
// Location: "Based in Surrey · Serving Surrey, Hampshire & West London"
//   DM Sans 300 text-xs text-[hsl(var(--background)/0.4)] mt-4 leading-relaxed

// Column 2 — Quick Links:
// "Quick Links" label — DM Sans 300 text-xs tracking-[0.3em] uppercase text-[hsl(var(--background)/0.4)] mb-4
// Links: Programs | Our Method | About Sarah | Testimonials | Book Assessment
// Each: block DM Sans 300 text-sm text-[hsl(var(--background)/0.6)] py-1
//   hover:text-[hsl(var(--background))] transition-colors duration-150

// Column 3 — Get In Touch:
// "Get In Touch" — same uppercase label style
// "hello@goodboyacademy.co.uk" — DM Sans 400 text-sm text-[hsl(var(--background)/0.65)] mb-1
// "07700 900 456" — same style mb-4
// "Mon–Fri 8am–6pm · Sat 8am–1pm" — DM Sans 300 text-xs text-[hsl(var(--background)/0.4)] mb-6

// Social icons row (flex gap-3):
// Instagram + Facebook icons from lucide-react
// Wrap in <a> with href and aria-label
// text-[hsl(var(--background)/0.5)] hover:text-[hsl(var(--background))] transition-colors w-6 h-6

// Bottom bar:
// mt-12 pt-8 border-t border-[hsl(var(--background)/0.1)]
// flex flex-col sm:flex-row justify-between items-center gap-3
// "© 2025 Good Boy Academy. All rights reserved."
//   DM Sans 300 text-xs text-[hsl(var(--background)/0.35)]
// "Fear-free · science-based · human(e)."
//   DM Sans 300 text-xs text-[hsl(var(--background)/0.25)] italic
```

---

## App Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── ProgramsSection.tsx
│   ├── MethodSection.tsx
│   ├── TrainerSection.tsx
│   ├── JourneySection.tsx         # Animated timeline with dog SVG
│   ├── TestimonialsSection.tsx
│   ├── PricingSection.tsx
│   ├── FAQSection.tsx
│   └── Footer.tsx
└── components/ui/                 # shadcn/ui components
    ├── accordion.tsx
    ├── button.tsx
    └── ...
```

### App.tsx Structure

```tsx
// App.tsx
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProgramsSection from './components/ProgramsSection'
import MethodSection from './components/MethodSection'
import TrainerSection from './components/TrainerSection'
import JourneySection from './components/JourneySection'
import TestimonialsSection from './components/TestimonialsSection'
import PricingSection from './components/PricingSection'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ProgramsSection />
        <MethodSection />
        <TrainerSection />
        <JourneySection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
```

### index.css

```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@1&family=DM+Sans:wght@300;400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 36 44% 89%;
    --foreground: 60 3% 10%;
    --primary: 155 37% 26%;
    --primary-foreground: 36 44% 95%;
    --accent: 18 52% 55%;
    --muted: 36 30% 83%;
    --muted-foreground: 60 3% 40%;
    --border: 36 20% 75%;
    --card: 36 44% 95%;
    --card-foreground: 60 3% 10%;
    --radius: 0.75rem;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4 {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-weight: 400;
  }

  /* Smooth scrolling for anchor links */
  html {
    scroll-behavior: smooth;
  }

  /* Remove tap highlight on mobile */
  * {
    -webkit-tap-highlight-color: transparent;
  }
}

@layer utilities {
  /* Custom tracking utility for the label style */
  .tracking-label {
    letter-spacing: 0.3em;
  }
}
```

---

## Key Implementation Notes

1. **Journey Timeline Dog**: The dog SVG should be 32px × 20px and positioned absolutely on the horizontal dotted track line. Calculate `dogX` in a `useEffect` by tracking the section's scroll progress via `window.scrollY` relative to the section's `getBoundingClientRect().top`. Clamp to 0–1. Multiply by `(trackContainerWidth - 40)` for the final translateX value. Use Framer Motion `animate={{ x: dogX }}` with a spring transition for smooth movement. The 4 stage circles transition to an active visual state (green border, light green background) as the dog passes them — controlled by `Math.floor(scrollProgress * 4)`.

2. **DM Serif Display — Italic Only**: This Google Font only ships the italic weight. Every heading should have `font-style: italic` applied. The CSS `h1, h2, h3, h4 { font-style: italic }` rule handles this globally, but ensure any heading rendered inside a `<p>` or `<span>` outside heading tags also gets the font class `font-serif italic` manually. Failing to apply this will cause the heading to fall back to a default serif in non-italic form.

3. **Fear-Free Branding**: The trust signals in the hero ("Fear Free", "COAPE Certified") should always appear together. These are real certifications — the website copy reflects genuine professional credentials. Keep them visible and prominent. COAPE is the Centre of Applied Pet Ethology (UK-based professional body). APDT is the Association of Pet Dog Trainers. Both are real organisations and their names should not be altered.

4. **Mobile Journey**: On mobile (below `lg`), the timeline switches to a vertical layout. The dotted line runs down the left side of the container as a `border-l-2 border-dashed` style. The dog icon is not shown on mobile (too small and impractical on a scrolling vertical layout). Each stage gets a small filled dot (`w-3.5 h-3.5 rounded-full bg-[hsl(var(--primary))]`) at the left edge as a visual marker. The stages animate in with `whileInView` staggered entrance on mobile.

5. **Terracotta Accent Usage**: The `--accent` colour (terracotta `#C8714A`) is used for labels ("WHAT WE OFFER", "HOW WE WORK", etc.), the hero pre-label ("SURREY · FEAR-FREE CERTIFIED"), star ratings in testimonials, the dog name chips in testimonials, and the sliding dog SVG in the journey timeline. It should NOT be used for primary CTAs — that's the forest green `--primary`. The two colours are complementary, not interchangeable. Maintaining this distinction is what gives the accent colour its power.

6. **Image Alt Texts**: All image alt texts reference the specific programme or trainer depicted. This is important for accessibility and SEO — dog training website content is highly visual and well-optimised alt texts improve Google Image search discovery. Images described in JSX comments above each `<img>` tag include specific detail: lighting quality, dog breed, trainer body language, and setting. Pass these descriptions to an AI image generation tool (Midjourney, DALL-E, Flux) to generate placeholder images during development.

7. **Section IDs for Anchor Navigation**: The navbar links use hash navigation. Each section should have a corresponding `id` attribute:
   - `<section id="programs">` — Programme section
   - `<section id="our-method">` — Method section
   - `<section id="about">` — Trainer section
   - `<section id="testimonials">` — Testimonials section
   - `<section id="book">` — Pricing section (doubles as booking anchor)
   The smooth scroll is handled by `html { scroll-behavior: smooth }` in `index.css`, so no JavaScript scroll handler is needed for the anchor links.

8. **Performance Notes**: All `whileInView` animations use `viewport={{ once: true }}` to ensure they only trigger once — preventing re-animation when the user scrolls back up. This is essential for a professional feel. The hero animations (`animate` on mount) fire immediately and do not use `whileInView`. The journey timeline uses a passive scroll listener (`{ passive: true }`) for optimal scroll performance. No images have `loading="eager"` by default — add this only to the hero image which is above the fold.

9. **shadcn/ui Accordion Customisation**: The default shadcn Accordion component adds an underline to the trigger on hover via a Tailwind utility. Override this with `hover:no-underline` on the `AccordionTrigger`. Also remove the default bottom border on `AccordionItem` by overriding with `border-b-0` — the border comes from the card container, not the item itself. The chevron icon inside `AccordionTrigger` inherits the text colour; colour it forest green by targeting `[&_svg]:text-[hsl(var(--primary))]` on the trigger.

10. **Responsive Grid Breakpoints**: Programme cards: `grid-cols-1` on mobile, `grid-cols-3` from `lg` (1024px). Pricing cards: `grid-cols-1` on mobile, `grid-cols-3` from `md` (768px). Testimonial cards: `grid-cols-1` on mobile, `grid-cols-3` from `md`. The hero grid is `grid-cols-1` on mobile (stacked), `grid-cols-2` from `lg`. The footer grid is `grid-cols-1` on mobile, `grid-cols-3` from `md`. These breakpoints ensure content is readable and layouts don't compress awkwardly at tablet sizes.
