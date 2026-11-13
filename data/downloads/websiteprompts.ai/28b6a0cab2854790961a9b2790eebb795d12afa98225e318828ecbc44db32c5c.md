# ZEN POINT — Acupuncture Clinic Website Prompt
## For Bolt, v0, Lovable, Claude — React + Vite + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui + lucide-react

---

Build a complete, production-ready acupuncture and Traditional Chinese Medicine clinic website for **ZEN POINT** — a contemporary London clinic that bridges ancient TCM practice with modern clinical sensitivity. The aesthetic is calm, earthy, and quietly authoritative: forest green and warm gold, with clean white space. All copy is fully written, all animations are fully implemented.

---

## DESIGN SYSTEM

### Colors — HSL custom properties in :root

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=DM+Sans:wght@300;400&display=swap');

:root {
  --background: 40 30% 97%;
  --foreground: 155 27% 18%;
  --primary: 155 27% 18%;
  --primary-foreground: 40 30% 97%;
  --accent: 42 41% 59%;
  --muted: 40 20% 93%;
  --card: 0 0% 100%;
  --border: 40 15% 86%;
  --muted-foreground: 155 10% 45%;
}
```

### Typography
- **Headings**: Noto Serif — weights 400 and 700. Grounded, timeless, universally trusted. Evokes traditional knowledge without being ornate.
- **Body**: DM Sans — weights 300 (light, flowing body copy) and 400 (regular, for UI elements and labels).

### Signature Animation 1: Breathing Pulse Circle

The hero section features a large animated circle that pulses like a breath — expanding on the inhale, contracting on the exhale. This creates a calming, meditative first impression. Implemented with Framer Motion.

```tsx
import { motion } from 'motion/react'

// Behind the hero text, centered absolutely:
<motion.div
  className="absolute rounded-full pointer-events-none"
  style={{
    width: '350px',
    height: '350px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(circle, hsl(155 27% 18% / 0.12) 0%, transparent 70%)',
  }}
  animate={{
    scale: [1, 1.12, 1],
    opacity: [0.6, 0.9, 0.6],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
    times: [0, 0.5, 1],
  }}
/>

// Caption below the circle:
// <p className="font-[DM_Sans] font-light text-[10px] tracking-[0.3em] uppercase
//               text-[hsl(var(--muted-foreground))] mt-3">
//   breathe in · breathe out
// </p>
```

### Signature Animation 2: Interactive Meridian Points SVG

Section 5 features a simplified body silhouette SVG with 6 glowing acupuncture point markers. Hovering over each point reveals a tooltip with the point name and its traditional therapeutic use.

```tsx
// SVG meridian points — each as a positioned circle within an SVG

const meridianPoints = [
  {
    id: 'PC-6',
    cx: 148,  // x position on 300px-wide SVG
    cy: 210,  // y position on 500px-tall SVG
    name: 'PC-6 · Pericardium 6',
    chinese: 'Nei Guan',
    use: 'Nausea, anxiety, heart palpitations, travel sickness. One of the most frequently used points in TCM.',
  },
  {
    id: 'LI-4',
    cx: 130,
    cy: 185,
    name: 'LI-4 · Large Intestine 4',
    chinese: 'He Gu',
    use: 'Pain relief, immune support, headaches, and facial conditions. Often described as the "aspirin point" of acupuncture.',
  },
  {
    id: 'ST-36',
    cx: 168,
    cy: 340,
    name: 'ST-36 · Stomach 36',
    chinese: 'Zu San Li',
    use: 'Digestive health, energy and vitality, immune function. One of the most important tonification points in the entire system.',
  },
  {
    id: 'SP-6',
    cx: 152,
    cy: 390,
    name: 'SP-6 · Spleen 6',
    chinese: 'San Yin Jiao',
    use: 'Hormonal balance, sleep quality, stress, menstrual regulation. The meeting point of three yin meridians.',
  },
  {
    id: 'GV-20',
    cx: 150,
    cy: 38,
    name: 'GV-20 · Governing Vessel 20',
    chinese: 'Bai Hui',
    use: 'Mental clarity, headaches, dizziness, calming anxiety, and lifting the spirits. The "crown" point.',
  },
  {
    id: 'LV-3',
    cx: 160,
    cy: 420,
    name: 'LV-3 · Liver 3',
    chinese: 'Tai Chong',
    use: 'Stress and anger, liver health, headaches, menstrual pain, eye conditions. Paired with LI-4 as the "Four Gates".',
  },
]

// Each point rendered as:
// <motion.g key={point.id}>
//   {/* Outer pulse ring */}
//   <motion.circle
//     cx={point.cx}
//     cy={point.cy}
//     r="12"
//     fill="none"
//     stroke="hsl(42 41% 59% / 0.3)"
//     strokeWidth="1"
//     animate={{ r: [12, 18, 12], opacity: [0.3, 0, 0.3] }}
//     transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
//   />
//   {/* Main dot */}
//   <motion.circle
//     cx={point.cx}
//     cy={point.cy}
//     r="6"
//     fill="hsl(42 41% 59%)"
//     whileHover={{ r: 8, fill: 'hsl(155 27% 18%)' }}
//     className="cursor-pointer"
//   />
//   {/* Tooltip on hover — use Framer Motion AnimatePresence */}
// </motion.g>
```

---

## SECTION 1: NAVBAR

```tsx
// Sticky, lightly frosted background

// <nav className="fixed top-0 left-0 right-0 z-50
//                 bg-[hsl(var(--background)/0.97)] border-b border-[hsl(var(--border))]
//                 backdrop-blur-sm">
// <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

// LOGO (left) — lotus SVG + wordmark:
// Simple 6-petal lotus outline SVG (inline, approx 28×28px):
// <a href="/" className="flex items-center gap-2.5">
//   <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"
//        aria-hidden="true">
//     {/* Simple lotus: circle centre + 6 petal outlines */}
//     <circle cx="14" cy="14" r="3" fill="hsl(42 41% 59%)" />
//     <ellipse cx="14" cy="6" rx="2.5" ry="5" fill="none" stroke="hsl(42 41% 59%)" strokeWidth="1.2" />
//     <ellipse cx="14" cy="22" rx="2.5" ry="5" fill="none" stroke="hsl(42 41% 59%)" strokeWidth="1.2" />
//     <ellipse cx="6" cy="14" rx="5" ry="2.5" fill="none" stroke="hsl(42 41% 59%)" strokeWidth="1.2" />
//     <ellipse cx="22" cy="14" rx="5" ry="2.5" fill="none" stroke="hsl(42 41% 59%)" strokeWidth="1.2" />
//     <ellipse cx="8.5" cy="8.5" rx="3.5" ry="2" transform="rotate(-45 8.5 8.5)"
//              fill="none" stroke="hsl(42 41% 59%)" strokeWidth="1.2" />
//     <ellipse cx="19.5" cy="19.5" rx="3.5" ry="2" transform="rotate(-45 19.5 19.5)"
//              fill="none" stroke="hsl(42 41% 59%)" strokeWidth="1.2" />
//   </svg>
//   <span className="font-[Noto_Serif] font-bold text-[20px] text-[hsl(var(--foreground))] tracking-wide">
//     ZEN POINT
//   </span>
// </a>

// NAV LINKS:
// {['Treatments', 'Conditions', 'About', 'FAQ', 'Book'].map(item => (
//   <a key={item} href={`#${item.toLowerCase()}`}
//      className="font-[DM_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                 hover:text-[hsl(var(--foreground))] transition-colors">
//     {item}
//   </a>
// ))}

// CTA:
// <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
//                    font-[DM_Sans] font-normal text-sm px-5 py-2.5 rounded-full
//                    hover:opacity-90 transition-opacity">
//   Book Appointment
// </button>
```

---

## SECTION 2: HERO

```tsx
// <section className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center
//                      justify-center text-center relative overflow-hidden px-6">

// Breathing pulse circle (see SIGNATURE ANIMATION 1 above):
// Absolutely centred, z-0, behind all content

// Optional very subtle bamboo/botanical SVG decorative elements at edges (z-0):
// Simple organic line art, very low opacity (0.06), positioned bottom-right and top-left

// CONTENT z-10:
// <div className="relative z-10 flex flex-col items-center">

//   Decorative horizontal line:
//   <div className="w-16 h-px bg-[hsl(var(--accent)/0.4)] mx-auto mb-6" />

//   Pre-heading:
//   <p className="font-[DM_Sans] font-light text-[10px] tracking-[0.35em] uppercase
//                  text-[hsl(var(--muted-foreground))] mb-6">
//     TRADITIONAL CHINESE MEDICINE · LONDON
//   </p>

//   Headline:
//   <motion.h1
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 1.2, ease: 'easeOut' }}
//     className="font-[Noto_Serif] font-bold text-[64px] max-lg:text-[48px] max-sm:text-[36px]
//                text-[hsl(var(--foreground))] leading-[1.15] max-w-xl"
//   >
//     Restore your body's natural balance.
//   </motion.h1>

//   Subtext:
//   <motion.p
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 0.9, delay: 0.6 }}
//     className="font-[DM_Sans] font-light text-lg text-[hsl(var(--muted-foreground))]
//                leading-relaxed max-w-lg mt-5"
//   >
//     Zen Point is a contemporary acupuncture and Traditional Chinese Medicine clinic
//     in London. We treat pain, stress, hormonal imbalance, sleep disorders, and more —
//     with methods refined over 2,000 years of clinical practice.
//   </motion.p>

//   Breathing caption (see animation notes above):
//   <motion.p
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ delay: 1 }}
//     className="font-[DM_Sans] font-light text-[10px] tracking-[0.3em] uppercase
//                text-[hsl(var(--muted-foreground))] mt-3"
//   >
//     breathe in · breathe out
//   </motion.p>

//   CTAs:
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.9, duration: 0.6 }}
//     className="flex flex-wrap gap-4 justify-center mt-8"
//   >
//     <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
//                        font-[DM_Sans] font-normal px-7 py-3.5 rounded-full text-base
//                        hover:opacity-90 transition-opacity">
//       Book Your First Session
//     </button>
//     <button className="font-[DM_Sans] font-normal text-base text-[hsl(var(--accent))]
//                        hover:underline px-2">
//       What We Treat →
//     </button>
//   </motion.div>

//   Credential pills:
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ delay: 1.2 }}
//     className="flex flex-wrap gap-3 justify-center mt-10"
//   >
//     {['BACS Registered', 'Fully Insured', '1,800+ treatments delivered'].map(pill => (
//       <span key={pill}
//             className="bg-white border border-[hsl(var(--border))] font-[DM_Sans] font-light
//                        text-xs text-[hsl(var(--muted-foreground))] px-4 py-1.5 rounded-full">
//         {pill}
//       </span>
//     ))}
//   </motion.div>

// </div>
```

---

## SECTION 3: TREATMENTS

```tsx
// <section id="treatments" className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Noto_Serif] font-bold text-[52px] max-md:text-[38px]
//                text-[hsl(var(--foreground))] leading-tight mb-14">
//   Our treatments.
// </h2>

const treatments = [
  {
    name: 'Acupuncture',
    icon: 'Syringe', // lucide-react
    price: 'From £65 / session',
    duration: '60 minutes',
    description: 'The insertion of ultra-fine single-use sterile needles at specific meridian points to restore the flow of qi (vital energy) and support the body\'s natural healing processes. Used to treat a broad range of conditions including pain, fatigue, anxiety, insomnia, digestive issues, and reproductive health.',
    note: 'Initial session includes consultation. Follow-up sessions 45 minutes.',
  },
  {
    name: 'Cupping Therapy',
    icon: 'Wind',
    price: 'From £55 / session',
    duration: '45 minutes',
    description: 'Glass or medical-grade silicone cups are applied to the skin and used to create gentle suction, lifting the fascia, increasing local blood circulation, and releasing deep layers of muscle tension. Particularly effective for chronic pain, sports recovery, respiratory conditions, and stress-related muscle holding.',
    note: 'Temporary circular marks are common and typically fade within 3–7 days.',
  },
  {
    name: 'Chinese Herbal Medicine',
    icon: 'Leaf',
    price: 'From £45 / consultation',
    duration: '60 minutes + herbs',
    description: 'Bespoke herbal formulas prescribed following a comprehensive TCM consultation. Herbs are combined in precise ratios to address your unique pattern of disbalance — available as traditional teas, convenient granule powders, or capsules. Particularly effective for hormonal, digestive, immune, and skin conditions.',
    note: 'Cost of herbs in addition to consultation fee. Typical ongoing cost: £30–£55 per month.',
  },
  {
    name: 'Moxibustion',
    icon: 'Flame',
    price: 'Included in select plans',
    duration: 'Add-on to acupuncture',
    description: 'The careful burning of dried mugwort (moxa) near specific acupuncture points to generate warmth, stimulate the meridians, and tonify yang energy. Particularly effective for conditions characterised by cold or deficiency: low energy and immunity, menstrual pain, certain digestive conditions, and breech presentation in pregnancy.',
    note: 'Always performed by Dr. Zhang as an integrated part of a treatment plan, never in isolation.',
  },
  {
    name: 'Facial Acupuncture',
    icon: 'Sparkles',
    price: 'From £85 / session',
    duration: '75 minutes',
    description: 'Constitutional facial renewal using extremely fine needles to improve microcirculation, stimulate collagen and elastin production, and release accumulated facial tension. Unlike Botox, results build subtly over a course of treatments — improving tone, radiance, and reducing the appearance of fine lines whilst also supporting overall systemic health.',
    note: 'Recommended course: 10 sessions weekly, then monthly maintenance. Not suitable during pregnancy.',
  },
  {
    name: 'TCM Health Consultation',
    icon: 'ClipboardList',
    price: '£95',
    duration: '75 minutes',
    description: 'A comprehensive initial consultation covering your complete health history, current symptoms, lifestyle, diet, sleep, emotional state, and goals. Dr. Zhang uses TCM diagnostic methods including tongue and pulse observation to identify your unique pattern of disbalance and formulate a personalised treatment plan.',
    note: 'The £95 consultation fee is deducted from the cost of your first treatment course.',
  },
]

// Grid: 3×2 desktop, 2-col tablet, 1-col mobile
// <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5">
// {treatments.map((t, i) => (
//   <motion.div
//     key={t.name}
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.1 }}
//     className="bg-[hsl(var(--muted))] rounded-2xl p-8 border border-[hsl(var(--border))]
//                hover:border-[hsl(var(--accent))] transition-colors duration-300"
//   >
//     <div className="mb-5">
//       <Icon className="w-6 h-6 text-[hsl(var(--accent))]" /> {/* lucide icon */}
//     </div>
//     <h3 className="font-[Noto_Serif] font-bold text-xl text-[hsl(var(--foreground))] mb-1">
//       {t.name}
//     </h3>
//     <p className="font-[DM_Sans] font-light text-xs text-[hsl(var(--accent))] mb-4">
//       {t.price} · {t.duration}
//     </p>
//     <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
//       {t.description}
//     </p>
//     <p className="font-[DM_Sans] font-light text-[11px] text-[hsl(var(--muted-foreground))] italic border-t
//                   border-[hsl(var(--border))] pt-4">
//       {t.note}
//     </p>
//   </motion.div>
// ))}
```

---

## SECTION 4: CONDITIONS WE TREAT

```tsx
// <section id="conditions" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Noto_Serif] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-4">
//   What we can help with.
// </h2>
// <p className="font-[DM_Sans] font-light text-base text-[hsl(var(--muted-foreground))] mb-12 max-w-xl">
//   This list represents our most frequently treated conditions. Acupuncture and TCM have a
//   much broader clinical scope — if your condition isn't listed, please get in touch.
// </p>

const conditions = [
  'Chronic Back Pain', 'Neck & Shoulder Pain', 'Migraines & Headaches',
  'Anxiety & Stress', 'Insomnia & Sleep Issues', 'Fertility Support',
  'Menstrual Irregularities', 'Menopause Symptoms', 'IBS & Digestive Issues',
  'Fatigue & Low Energy', 'Sports Injuries', 'Sciatica',
  'Fibromyalgia', 'Hay Fever & Allergies', 'Skin Conditions (Eczema, Acne)',
  'High Blood Pressure', 'Immune Support', 'Post-COVID Recovery',
  'Pregnancy Support', 'Carpal Tunnel Syndrome', 'Tennis Elbow',
  'Frozen Shoulder', 'Low Mood & Depression', 'Irritable Bowel Syndrome',
]

// Interactive tags — hover changes to primary colour:
// <div className="flex flex-wrap gap-3">
// {conditions.map(condition => (
//   <motion.button
//     key={condition}
//     whileHover={{ scale: 1.03 }}
//     className="bg-white border border-[hsl(var(--border))] rounded-full px-4 py-2
//                font-[DM_Sans] font-normal text-sm text-[hsl(var(--foreground))]
//                hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]
//                hover:border-transparent transition-all duration-200"
//   >
//     {condition}
//   </motion.button>
// ))}
// </div>

// Note:
// <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] mt-10
//               italic">
//   Not sure whether acupuncture can help with your condition?
//   <a href="#" className="text-[hsl(var(--accent))] hover:underline ml-1">
//     Book a free 15-minute discovery call →
//   </a>
// </p>
```

---

## SECTION 5: THE MERIDIAN POINTS

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Noto_Serif] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-4 text-center">
//   The science of acupuncture.
// </h2>
// <p className="font-[DM_Sans] font-light text-base text-[hsl(var(--muted-foreground))]
//               text-center mb-16 max-w-2xl mx-auto">
//   TCM views the body as a network of energy pathways — meridians — through which qi (vital
//   energy) flows. Hover over the points below to explore the meridian system.
// </p>

// 2-column layout: SVG left, text right
// <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-16 items-start">

//   LEFT — SVG body silhouette with interactive points
//   <div className="relative flex justify-center">
//     <svg
//       width="300"
//       height="500"
//       viewBox="0 0 300 500"
//       className="max-w-[300px] mx-auto"
//     >
//       {/* Simple clean body silhouette — front view, minimal line art */}
//       {/* Head */}
//       <ellipse cx="150" cy="45" rx="32" ry="40" fill="none" stroke="hsl(155 27% 18% / 0.15)" strokeWidth="1.5" />
//       {/* Neck */}
//       <path d="M 134 84 L 134 100 L 166 100 L 166 84" fill="none" stroke="hsl(155 27% 18% / 0.15)" strokeWidth="1.5" />
//       {/* Shoulders + torso */}
//       <path d="M 100 110 Q 80 115 78 150 L 82 280 Q 82 290 90 290 L 210 290 Q 218 290 218 280 L 222 150 Q 220 115 200 110 L 166 100 L 134 100 Z"
//             fill="none" stroke="hsl(155 27% 18% / 0.15)" strokeWidth="1.5" />
//       {/* Left arm */}
//       <path d="M 100 110 L 65 220 Q 62 235 70 240 L 78 240"
//             fill="none" stroke="hsl(155 27% 18% / 0.15)" strokeWidth="1.5" />
//       {/* Right arm */}
//       <path d="M 200 110 L 235 220 Q 238 235 230 240 L 222 240"
//             fill="none" stroke="hsl(155 27% 18% / 0.15)" strokeWidth="1.5" />
//       {/* Hips + legs */}
//       <path d="M 90 290 L 82 380 L 80 430 L 95 430 L 105 380 L 150 370 L 195 380 L 205 430 L 220 430 L 218 380 L 210 290"
//             fill="none" stroke="hsl(155 27% 18% / 0.15)" strokeWidth="1.5" />

//       {/* Meridian points — see SIGNATURE ANIMATION 2 data above */}
//       {/* Render each point as a pulsing circle with hover tooltip */}
//       {meridianPoints.map((point, index) => (
//         <AnimatePresence key={point.id}>
//           <motion.g>
//             {/* Pulse ring */}
//             <motion.circle
//               cx={point.cx} cy={point.cy} r="12"
//               fill="none" stroke="hsl(42 41% 59% / 0.4)" strokeWidth="1"
//               animate={{ r: [12, 20, 12], opacity: [0.4, 0, 0.4] }}
//               transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
//             />
//             {/* Main dot */}
//             <motion.circle
//               cx={point.cx} cy={point.cy} r="6"
//               fill="hsl(42 41% 59%)"
//               whileHover={{ r: 9 }}
//               className="cursor-pointer"
//               onHoverStart={() => setHoveredPoint(point.id)}
//               onHoverEnd={() => setHoveredPoint(null)}
//             />
//             {/* Point label */}
//             <text x={point.cx + 12} y={point.cy + 4}
//                   fill="hsl(155 27% 18%)" fontSize="9" fontFamily="DM Sans">
//               {point.id}
//             </text>
//           </motion.g>
//         </AnimatePresence>
//       ))}
//     </svg>

//     {/* Tooltip — shows below SVG or as absolute overlay */}
//     {hoveredPoint && (() => {
//       const point = meridianPoints.find(p => p.id === hoveredPoint)
//       return point ? (
//         <motion.div
//           initial={{ opacity: 0, y: 5 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0 }}
//           className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white border
//                      border-[hsl(var(--border))] rounded-xl shadow-lg p-4 w-72 z-20"
//         >
//           <p className="font-[Noto_Serif] font-bold text-sm text-[hsl(var(--foreground))] mb-0.5">
//             {point.name}
//           </p>
//           <p className="font-[DM_Sans] font-light text-xs text-[hsl(var(--accent))] mb-2">
//             {point.chinese}
//           </p>
//           <p className="font-[DM_Sans] font-light text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
//             {point.use}
//           </p>
//         </motion.div>
//       ) : null
//     })()}
//   </div>

//   RIGHT — Explanatory text
//   <div>
//     <h3 className="font-[Noto_Serif] font-bold text-2xl text-[hsl(var(--foreground))] mb-5">
//       How acupuncture works.
//     </h3>
//     <div className="space-y-5">
//       <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
//         Traditional Chinese Medicine views the body as a dynamic system of interconnected pathways —
//         meridians — through which qi (vital energy) flows. When this flow is disrupted by stress,
//         injury, illness, dietary factors, or emotional patterns, symptoms arise. Acupuncture restores
//         balance by stimulating specific points along these meridians, prompting the body's own
//         healing response.
//       </p>
//       <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
//         Modern research increasingly supports what Chinese physicians have observed for millennia.
//         Studies have demonstrated that acupuncture stimulates the release of endogenous opioids
//         (the body's natural painkillers), modulates the autonomic nervous system, reduces systemic
//         inflammation, and influences gene expression in ways that promote tissue healing.
//       </p>
//       <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
//         The six points illustrated opposite represent a small fraction of the 361 recognised
//         acupuncture points distributed across 14 primary meridians. A TCM practitioner selects
//         which points to use based on your specific pattern — no two treatment plans are identical.
//       </p>
//     </div>
//   </div>

// </div>
```

---

## SECTION 6: ABOUT THE PRACTITIONER

```tsx
// <section id="about" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">

// LEFT — Portrait image
// {/* Image: Dr. Mei Lin Zhang — a female acupuncturist in her early forties, calm and professional expression that conveys warmth and clinical authority, photographed in a clean contemporary TCM treatment room with subtle traditional elements, soft natural light from one side, half-length portrait photography for a medical clinic website */}
// <motion.div
//   initial={{ opacity: 0, x: -20 }}
//   whileInView={{ opacity: 1, x: 0 }}
//   viewport={{ once: true }}
//   className="rounded-3xl overflow-hidden aspect-[4/5]"
// >
//   <img src="" alt="Dr. Mei Lin Zhang, Zen Point acupuncturist"
//        className="w-full h-full object-cover" />
// </motion.div>

// RIGHT — Bio
// <motion.div
//   initial={{ opacity: 0, x: 20 }}
//   whileInView={{ opacity: 1, x: 0 }}
//   viewport={{ once: true }}
//   className="py-8 lg:py-12"
// >
//   <p className="font-[DM_Sans] font-light text-[10px] tracking-[0.3em] uppercase
//                  text-[hsl(var(--muted-foreground))] mb-4">
//     LEAD PRACTITIONER
//   </p>
//   <h2 className="font-[Noto_Serif] font-bold text-[40px] max-md:text-[32px]
//                  text-[hsl(var(--foreground))] leading-tight mb-1">
//     Dr. Mei Lin Zhang
//   </h2>
//   <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] mb-8">
//     MBBAcC · BSc (Hons) Acupuncture · TCM Herbalist · 14 Years Clinical Experience
//   </p>

//   <div className="space-y-5">
//     <p className="font-[DM_Sans] font-light text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
//       I trained at the University of Westminster in Traditional Chinese Medicine — one of the
//       most rigorous TCM training programmes in the UK — and have been in clinical practice in
//       London for fourteen years. My approach integrates classical TCM diagnostics with an
//       understanding of modern biomedicine and lifestyle medicine.
//     </p>
//     <p className="font-[DM_Sans] font-light text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
//       The tongue and pulse tell me things that a blood test cannot. The blood test tells me
//       things that pulse diagnosis cannot. I use both, and I believe that lasting health outcomes
//       come from treating the root cause of a condition — not suppressing the symptom.
//     </p>
//     <p className="font-[DM_Sans] font-light text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
//       I work collaboratively with my patients' GPs and specialists where appropriate, and I
//       always keep clear clinical notes. Zen Point is registered with BACS (the British
//       Acupuncture Council) and all treatments are performed using single-use sterile needles
//       under full clinical protocols.
//     </p>
//   </div>

//   {/* Stats row */}
//   <div className="grid grid-cols-4 gap-4 mt-10 border-t border-[hsl(var(--border))] pt-8">
//     {[
//       { number: '14', label: 'Years practice' },
//       { number: '1,800+', label: 'Patients' },
//       { number: 'MBBAcC', label: 'Registered' },
//       { number: '5★', label: 'Rating' },
//     ].map(stat => (
//       <div key={stat.label} className="text-center">
//         <p className="font-[Noto_Serif] font-bold text-xl text-[hsl(var(--primary))] leading-none">
//           {stat.number}
//         </p>
//         <p className="font-[DM_Sans] font-light text-xs text-[hsl(var(--muted-foreground))] mt-1">
//           {stat.label}
//         </p>
//       </div>
//     ))}
//   </div>

// </motion.div>
```

---

## SECTION 7: WHAT TO EXPECT

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-5xl mx-auto px-6">

// Heading:
// <h2 className="font-[Noto_Serif] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-16">
//   Your first visit.
// </h2>

const visitSteps = [
  {
    number: '1',
    title: 'The Consultation',
    timing: '30 minutes',
    description: "We begin with a detailed health history — current symptoms, your sleep, digestion, emotional state, energy levels, menstrual cycle if relevant, and medical history. Dr. Zhang will then use TCM diagnostic methods: tongue observation (the tongue maps directly to the organ systems) and pulse reading at three positions on each wrist, each corresponding to different internal organs and functions.",
  },
  {
    number: '2',
    title: 'Your Treatment Plan',
    timing: '10 minutes',
    description: "Based on the assessment, Dr. Zhang will explain your TCM diagnosis in plain language — what pattern she's identified, what's driving it, and what a realistic treatment course looks like. She'll recommend a number of sessions and a frequency, and explain why. You're never pressured to commit to more than you're comfortable with.",
  },
  {
    number: '3',
    title: 'The Treatment',
    timing: '45–60 minutes',
    description: "You'll rest comfortably on a heated treatment couch. Ultra-fine single-use needles are inserted gently — most people feel little or nothing on insertion, and many describe a dull ache or warmth at the needle site, which is the qi arriving. Once the needles are placed, you'll rest for 20–30 minutes. The majority of patients fall asleep.",
  },
  {
    number: '4',
    title: 'Ongoing Support',
    timing: 'Between sessions',
    description: "After each session, Dr. Zhang will advise on dietary adjustments, lifestyle factors, exercises, or breathing practices that support your treatment. Every 4 sessions, she'll conduct a formal progress review and adjust the treatment plan accordingly. You'll always know where you are and what's coming next.",
  },
]

// Vertical numbered steps
// <div className="space-y-0 divide-y divide-[hsl(var(--border))]">
// {visitSteps.map((step, i) => (
//   <motion.div
//     key={step.number}
//     initial={{ opacity: 0, x: -20 }}
//     whileInView={{ opacity: 1, x: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.1 }}
//     className="py-10 grid grid-cols-[64px_1fr] gap-8 items-start"
//   >
//     <span className="font-[Noto_Serif] font-bold text-[56px] leading-none
//                      text-[hsl(var(--accent)/0.35)]">
//       {step.number}
//     </span>
//     <div>
//       <div className="flex items-center gap-4 mb-3">
//         <h3 className="font-[Noto_Serif] font-bold text-xl text-[hsl(var(--foreground))]">
//           {step.title}
//         </h3>
//         <span className="font-[DM_Sans] font-light text-xs text-[hsl(var(--accent))] uppercase tracking-wider">
//           {step.timing}
//         </span>
//       </div>
//       <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
//         {step.description}
//       </p>
//     </div>
//   </motion.div>
// ))}
```

---

## SECTION 8: TESTIMONIALS

```tsx
// <section className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Noto_Serif] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-14 text-center">
//   Patient experiences.
// </h2>

const testimonials = [
  {
    quote: "I came to Zen Point for chronic lower back pain after two years of physiotherapy that hadn't resolved it. Six sessions with Dr. Zhang later and I'm pain-free for the first time in years. I don't fully understand the mechanism, but I've stopped needing to. It works.",
    name: "Michael O.",
    condition: "Chronic lower back pain",
    sessions: "6 sessions · ongoing",
  },
  {
    quote: "I'd been struggling with insomnia and anxiety for 18 months. I'd tried CBT, sleep hygiene protocols, and medication — nothing lasted. Acupuncture was genuinely my last resort. I'm now sleeping 7–8 hours and my anxiety is completely manageable for the first time in a long time. I wish I hadn't waited so long.",
    name: "Laura S.",
    condition: "Insomnia & anxiety",
    sessions: "8 sessions to date",
  },
  {
    quote: "I came for fertility support alongside a private IVF cycle. Dr. Zhang was extraordinarily knowledgeable about the IVF process, worked sensitively alongside my clinic, and never made claims she couldn't support. I'm now 24 weeks pregnant. I can't prove causation, but I feel strongly that the treatment supported my body through the process.",
    name: "Hannah T.",
    condition: "Fertility support",
    sessions: "12 sessions across IVF cycle",
  },
]

// 3-col desktop, 1-col mobile
// {testimonials.map((t, i) => (
//   <motion.div
//     key={t.name}
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.12 }}
//     className="bg-white rounded-2xl p-8 border border-[hsl(var(--border))] flex flex-col"
//   >
//     {/* Gold accent line */}
//     <div className="w-8 h-0.5 bg-[hsl(var(--accent))] mb-6" />
//     <p className="font-[Noto_Serif] font-normal italic text-base text-[hsl(var(--foreground))]
//                   leading-relaxed flex-1 mb-6">
//       "{t.quote}"
//     </p>
//     <div className="border-t border-[hsl(var(--border))] pt-5">
//       <p className="font-[DM_Sans] font-normal text-sm text-[hsl(var(--foreground))]">{t.name}</p>
//       <p className="font-[DM_Sans] font-light text-xs text-[hsl(var(--accent))] mt-0.5">{t.condition}</p>
//       <p className="font-[DM_Sans] font-light text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{t.sessions}</p>
//     </div>
//   </motion.div>
// ))}
```

---

## SECTION 9: PRICING

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-3xl mx-auto px-6">

// Heading:
// <h2 className="font-[Noto_Serif] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-4">
//   Pricing.
// </h2>

const priceList = [
  { service: 'Initial TCM Consultation', detail: '75 minutes · redeemable against first treatment course', price: '£95' },
  { service: 'Follow-up Acupuncture', detail: '60 minutes', price: '£75' },
  { service: 'Facial Acupuncture', detail: '75 minutes', price: '£85' },
  { service: 'Cupping Therapy', detail: '45 minutes', price: '£55' },
  { service: 'Chinese Herbal Consultation', detail: '60 minutes · herbs charged separately (approx. £30–55 / month)', price: '£45' },
  { service: 'Course of 6 Acupuncture Sessions', detail: 'Paid in advance — save 10% vs individual session pricing', price: '£405' },
  { service: 'Course of 10 Acupuncture Sessions', detail: 'Paid in advance — save 12% vs individual session pricing', price: '£660' },
]

// Clean table with border-b rows:
// <div className="border border-[hsl(var(--border))] rounded-2xl overflow-hidden mb-8">
//   {priceList.map((row, i) => (
//     <div key={row.service}
//          className="flex justify-between items-start gap-6 px-8 py-5
//                     border-b border-[hsl(var(--border))] last:border-b-0">
//       <div>
//         <p className="font-[Noto_Serif] font-bold text-base text-[hsl(var(--foreground))]">
//           {row.service}
//         </p>
//         <p className="font-[DM_Sans] font-light text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
//           {row.detail}
//         </p>
//       </div>
//       <p className="font-[Noto_Serif] font-bold text-xl text-[hsl(var(--primary))] shrink-0">
//         {row.price}
//       </p>
//     </div>
//   ))}
// </div>

// Notes:
// <p className="font-[DM_Sans] font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
//   HSA/FSA eligible. Detailed receipts for private health insurance claims are provided as
//   standard. BACS registered practitioner number available on request. Cancellation policy:
//   24 hours' notice required. Late cancellations charged at 50%.
// </p>
```

---

## SECTION 10: FAQ + FOOTER

```tsx
// FAQ
// <section id="faq" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-3xl mx-auto px-6">

// Heading:
// <h2 className="font-[Noto_Serif] font-bold text-[40px] max-md:text-[30px]
//                text-[hsl(var(--foreground))] leading-tight mb-12">
//   Frequently asked questions.
// </h2>

const faqs = [
  {
    q: "Does acupuncture hurt?",
    a: "Acupuncture needles are extraordinarily fine — considerably thinner than a hypodermic needle and nothing like an injection. On insertion, most people feel little or nothing. At the needle site, you may experience a dull ache, warmth, tingling, or heaviness — sensations that indicate qi arriving at the point and are considered therapeutically positive. Most patients relax deeply during treatment, and a significant number fall asleep.",
  },
  {
    q: "How many sessions will I need?",
    a: "This varies considerably by condition. Acute conditions (a recent sports injury, a cold, tension headache) may resolve meaningfully in 2–3 sessions. Chronic or complex conditions — long-standing pain, hormonal imbalance, anxiety — typically require a course of 6–10 sessions to produce lasting change. Dr. Zhang will give you an honest, realistic expectation at your initial consultation and revise it at your 4-session review.",
  },
  {
    q: "Is acupuncture safe?",
    a: "When practised by a qualified and registered practitioner using single-use sterile needles, acupuncture has an excellent safety record. Dr. Zhang is a Member of the British Acupuncture Council (MBBAcC), holds full professional indemnity insurance, and works strictly within the BAcC's Code of Safe Practice. Serious adverse events from acupuncture are extremely rare.",
  },
  {
    q: "Can acupuncture be combined with conventional medical treatment?",
    a: "Yes, and it often works best this way. Many of Zen Point's patients receive acupuncture alongside conventional medical care — for example, supporting IVF cycles, managing side effects of cancer treatment, or complementing physiotherapy for musculoskeletal conditions. Dr. Zhang always reviews your current medications and medical situation at consultation.",
  },
  {
    q: "Do you offer acupuncture during pregnancy?",
    a: "Yes — pregnancy acupuncture is one of Dr. Zhang's specialist areas. Certain acupuncture points are avoided during pregnancy, and the treatment approach adapts to each trimester. Acupuncture during pregnancy is used to address morning sickness, pelvic girdle pain, back pain, anxiety, sleep problems, and to prepare for birth. Please mention your pregnancy when booking.",
  },
]

// <Accordion type="single" collapsible className="space-y-3">
//   {faqs.map((faq, i) => (
//     <AccordionItem key={i} value={`item-${i}`}
//                   className="bg-white rounded-xl border border-[hsl(var(--border))] px-6">
//       <AccordionTrigger className="font-[Noto_Serif] font-bold text-base
//                                    text-[hsl(var(--foreground))] hover:no-underline py-5 text-left">
//         {faq.q}
//       </AccordionTrigger>
//       <AccordionContent className="font-[DM_Sans] font-light text-sm
//                                     text-[hsl(var(--muted-foreground))] leading-relaxed pb-5">
//         {faq.a}
//       </AccordionContent>
//     </AccordionItem>
//   ))}
// </Accordion>

// FOOTER
// <footer className="bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))] py-16">
// <div className="max-w-7xl mx-auto px-6">

//   Top row:
//   <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12 border-b border-white/10">
//     <div>
//       <div className="flex items-center gap-2.5 mb-3">
//         {/* Lotus SVG in white */}
//         <span className="font-[Noto_Serif] font-bold text-2xl text-white">ZEN POINT</span>
//       </div>
//       <p className="font-[DM_Sans] font-light text-sm text-white/40 max-w-xs leading-relaxed">
//         Contemporary acupuncture and Traditional Chinese Medicine. Harley Street area, London.
//       </p>
//     </div>
//     <nav className="flex flex-wrap gap-x-10 gap-y-3">
//       {['Treatments', 'Conditions', 'About', 'What to Expect', 'Pricing', 'FAQ', 'Book'].map(link => (
//         <a key={link} href="#"
//            className="font-[DM_Sans] font-light text-sm text-white/50 hover:text-white transition-colors">
//           {link}
//         </a>
//       ))}
//     </nav>
//   </div>

//   Bottom row:
//   <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
//     <p className="font-[DM_Sans] font-light text-xs text-white/30">
//       📍 Harley Street area, London W1 &nbsp;|&nbsp; ☎ 020 7946 0001
//     </p>
//     <p className="font-[DM_Sans] font-light text-xs text-white/30">
//       © 2025 Zen Point Acupuncture Clinic. Dr. Mei Lin Zhang MBBAcC.
//     </p>
//   </div>

// </div>
```

---

## DEPENDENCIES & IMPLEMENTATION NOTES

```bash
npm install framer-motion lucide-react
npx shadcn-ui@latest init
npx shadcn-ui@latest add accordion button card
```

### Key state variables:
```tsx
const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
const [scrolled, setScrolled] = useState(false)
```

### Global CSS:
```css
* { font-family: 'DM Sans', sans-serif; }
h1, h2, h3 { font-family: 'Noto Serif', serif; }
html { scroll-behavior: smooth; }
```

### SVG body silhouette note:
The body outline SVG provided is a simplified schematic. For production, consider using a professional anatomical illustration SVG (available royalty-free from medical illustration libraries) with the acupuncture point circles overlaid via SVG `<g>` groups positioned to match actual anatomical point locations.
