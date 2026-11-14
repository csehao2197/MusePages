# SCOOP — Ice Cream Shop Website Prompt
## For Bolt, v0, Lovable, Claude — React + Vite + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui + lucide-react

---

Build a complete, production-ready artisan ice cream shop website for **SCOOP** — a small-batch ice cream shop based in Borough Market, London. The brand is playful, quality-obsessed, and joyful: warm vanilla cream backgrounds, strawberry pink and pistachio green accents, with Fraunces italic headings that feel handcrafted and personality-filled. All copy is fully written. All animations are fully implemented.

---

## DESIGN SYSTEM

### Colors — HSL custom properties in :root

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,700;1,900&family=Plus+Jakarta+Sans:wght@400;500&display=swap');

:root {
  --background: 46 90% 97%;
  --foreground: 0 0% 8%;
  --primary: 348 70% 75%;
  --primary-foreground: 0 0% 8%;
  --secondary: 100 37% 75%;
  --accent: 32 80% 68%;
  --muted: 46 50% 94%;
  --card: 0 0% 100%;
  --border: 46 30% 88%;
  --muted-foreground: 0 0% 45%;
}
```

### Typography
- **Headings**: Fraunces italic — weights 700 italic and 900 italic. Quirky, warm, characterful serif. All headings are italic. Has an old-fashioned charm that suits artisan food.
- **Body**: Plus Jakarta Sans — weights 400 and 500. Modern, very readable, balances the quirky headings.

### Signature Animation 1: 3D Flip Card — "Flavour of the Day"

A large card in the hero that auto-flips every 5 seconds to reveal the day's flavour. CSS 3D transform on a 300×180px card. 3 flavours cycle.

```css
/* Global CSS for the flip card */
.flip-card {
  perspective: 1200px;
}

.flip-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(.17,.67,.83,.67);
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
```

```tsx
// State:
const [flipIndex, setFlipIndex] = useState(0)
const [isFlipped, setIsFlipped] = useState(false)

// Auto-cycle interval:
useEffect(() => {
  const interval = setInterval(() => {
    setIsFlipped(true)
    setTimeout(() => {
      setFlipIndex(prev => (prev + 1) % flavours.length)
      setIsFlipped(false)
    }, 400) // halfway through flip, switch content
  }, 5000)
  return () => clearInterval(interval)
}, [])

const flavours = [
  {
    name: 'Burnt Honey & Lavender',
    description: 'Wildflower honey taken to the edge of caramel, with Provençal lavender that makes it unmistakable.',
    bg: 'bg-[hsl(var(--accent))]',
    textColor: 'text-[hsl(var(--foreground))]',
  },
  {
    name: 'Roasted Pistachio & Sea Salt',
    description: 'Whole Sicilian pistachios roasted in-house, churned into a dense, nutty ice cream finished with Atlantic sea salt.',
    bg: 'bg-[hsl(var(--secondary))]',
    textColor: 'text-[hsl(var(--foreground))]',
  },
  {
    name: 'Strawberry Balsamic',
    description: 'Bright summer strawberries with a whisper of aged balsamic — sweet, sharp, and completely irresistible.',
    bg: 'bg-[hsl(var(--primary))]',
    textColor: 'text-[hsl(var(--foreground))]',
  },
]

// JSX:
// <div className="flip-card w-[300px] h-[180px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
//   <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
//     {/* Front */}
//     <div className="flip-card-front bg-[hsl(var(--primary))] flex flex-col items-center
//                     justify-center text-center p-6">
//       <p className="font-[Plus_Jakarta_Sans] font-medium text-sm uppercase tracking-widest
//                     text-[hsl(var(--foreground))/0.7] mb-2">
//         🍦 TODAY'S FLAVOUR
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--foreground))/0.5]">
//         Flip to reveal →
//       </p>
//     </div>
//     {/* Back */}
//     <div className={`flip-card-back flex flex-col items-center justify-center text-center p-6
//                      ${flavours[flipIndex].bg}`}>
//       <h3 className={`font-[Fraunces] italic font-bold text-2xl leading-tight mb-2
//                       ${flavours[flipIndex].textColor}`}>
//         {flavours[flipIndex].name}
//       </h3>
//       <p className={`font-[Plus_Jakarta_Sans] font-normal text-xs leading-relaxed mb-3
//                      ${flavours[flipIndex].textColor} opacity-80`}>
//         {flavours[flipIndex].description}
//       </p>
//       <p className={`font-[Plus_Jakarta_Sans] font-normal text-[10px] uppercase tracking-wider
//                      ${flavours[flipIndex].textColor} opacity-60`}>
//         Now serving at the counter
//       </p>
//     </div>
//   </div>
// </div>
```

### Signature Animation 2: Interactive Flavour Wheel

Section 4 features a circular SVG with 8 flavour segments. Hovering highlights a segment; clicking adds the flavour to a "Your Cup" panel (UI only, no real order).

```tsx
// Flavour wheel data:
const wheelFlavours = [
  { id: 0, name: 'Strawberry Balsamic', emoji: '🍓', color: 'hsl(348 70% 75%)', angle: 0 },
  { id: 1, name: 'Burnt Honey & Lavender', emoji: '🌻', color: 'hsl(32 80% 68%)', angle: 45 },
  { id: 2, name: 'Pistachio Sea Salt', emoji: '🥜', color: 'hsl(100 37% 75%)', angle: 90 },
  { id: 3, name: 'Matcha White Choc', emoji: '🍵', color: 'hsl(120 30% 60%)', angle: 135 },
  { id: 4, name: 'Dark Choc Espresso', emoji: '🍫', color: 'hsl(20 50% 35%)', angle: 180 },
  { id: 5, name: 'Yuzu Ginger Sorbet', emoji: '🍋', color: 'hsl(55 80% 70%)', angle: 225 },
  { id: 6, name: 'Blueberry Cheesecake', emoji: '🫐', color: 'hsl(250 40% 65%)', angle: 270 },
  { id: 7, name: 'Peach Champagne', emoji: '🍑', color: 'hsl(30 70% 80%)', angle: 315 },
]

// State:
const [selectedScoops, setSelectedScoops] = useState<typeof wheelFlavours[0][]>([])
const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

// SVG wheel: 600×600px, center (300,300), outer radius 260, inner radius 120
// Each segment is a pie wedge (path) covering 45° (360°/8)
// Use polar-to-cartesian math to calculate SVG path d attribute for each wedge:
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function wedgePath(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
  const s1 = polarToCartesian(cx, cy, outerR, startAngle)
  const e1 = polarToCartesian(cx, cy, outerR, endAngle)
  const s2 = polarToCartesian(cx, cy, innerR, endAngle)
  const e2 = polarToCartesian(cx, cy, innerR, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${s1.x} ${s1.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${e2.x} ${e2.y} Z`
}
```

---

## SECTION 1: NAVBAR

```tsx
// Sticky navbar, vanilla cream background

// <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--background))]
//                 border-b border-[hsl(var(--border))]">
// <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

// LOGO (left) — ice cream cone SVG + "SCOOP":
// <a href="/" className="flex items-center gap-2.5">
//   <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"
//        aria-hidden="true">
//     {/* Cone shape */}
//     <path d="M 8 16 L 14 32 L 20 16 Z" fill="hsl(32 80% 68%)" />
//     {/* Cone waffle lines */}
//     <path d="M 9 19 L 19 19 M 10 22 L 18 22 M 11 25 L 17 25" stroke="hsl(32 60% 55%)" strokeWidth="0.8" />
//     {/* Scoop of ice cream (circle, slightly offset up) */}
//     <circle cx="14" cy="11" r="9" fill="hsl(348 70% 75%)" />
//     {/* Highlight */}
//     <circle cx="11" cy="8" r="2.5" fill="hsl(348 70% 85%)" opacity="0.7" />
//   </svg>
//   <span className="font-[Fraunces] italic font-black text-2xl text-[hsl(var(--foreground))]">
//     SCOOP
//   </span>
// </a>

// NAV LINKS:
// {['Flavours', 'Build a Cup', 'Visit Us', 'Events', 'Gift Cards'].map(item => (
//   <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
//      className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                 hover:text-[hsl(var(--foreground))] transition-colors hidden md:block">
//     {item}
//   </a>
// ))}

// CTA:
// <motion.button
//   whileHover={{ scale: 1.05 }}
//   className="bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] font-[Plus_Jakarta_Sans]
//              font-medium text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
// >
//   Order Now
// </motion.button>
```

---

## SECTION 2: HERO

```tsx
// <section className="min-h-screen bg-[hsl(var(--background))] relative overflow-hidden
//                      flex items-center">

// LARGE DECORATIVE ICE CREAM CONE SVG — right side, absolutely positioned:
// A large illustrated ice cream cone, playful and colourful, absolutely positioned right-0, 40vw height
// <div className="absolute right-0 top-0 h-full w-[45vw] pointer-events-none z-0">
//   <svg viewBox="0 0 300 480" className="w-full h-full" aria-hidden="true">
//     {/* Cone */}
//     <path d="M 60 180 L 150 480 L 240 180 Z" fill="hsl(32 80% 68%)" opacity="0.9" />
//     {/* Cone grid lines */}
//     {[200, 230, 260, 290, 320, 350].map((y, i) => (
//       <line key={y} x1={Math.max(60, 60 + (y-180) * 0.47)} y1={y}
//             x2={Math.min(240, 240 - (y-180) * 0.47)} y2={y}
//             stroke="hsl(32 60% 55%)" strokeWidth="1.5" opacity="0.6" />
//     ))}
//     {/* Bottom scoop */}
//     <ellipse cx="150" cy="180" rx="90" ry="55" fill="hsl(348 70% 75%)" />
//     {/* Middle scoop */}
//     <ellipse cx="150" cy="120" rx="78" ry="48" fill="hsl(100 37% 75%)" />
//     {/* Top scoop */}
//     <ellipse cx="150" cy="66" rx="64" ry="42" fill="hsl(32 80% 68%)" />
//     {/* Cherry on top */}
//     <circle cx="150" cy="28" r="14" fill="hsl(0 70% 65%)" />
//     <path d="M 150 24 Q 160 10 155 4" stroke="hsl(120 40% 30%)" strokeWidth="2" fill="none" />
//   </svg>
// </div>

// SCATTERED SPRINKLE DOTS (absolutely positioned, purely decorative):
// Generate ~20 small coloured dots scattered around the left-side content area:
// Use inline style with random top/left percentages and colours from --primary, --secondary, --accent
// <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
//   {sprinkles.map((s, i) => (
//     <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
//          style={{ top: s.top, left: s.left, backgroundColor: s.color,
//                   transform: `rotate(${s.angle}deg)` }} />
//   ))}
// </div>

// CONTENT (left side):
// <div className="relative z-10 pl-8 lg:pl-16 py-24 max-w-[600px]">

//   Pre-heading:
//   <motion.p
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ delay: 0.2 }}
//     className="font-[Plus_Jakarta_Sans] font-normal text-[10px] tracking-[0.25em] uppercase
//                text-[hsl(var(--foreground)/0.5)] mb-5"
//   >
//     ARTISAN ICE CREAM · MADE FRESH DAILY
//   </motion.p>

//   Headline:
//   <motion.h1
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.9, ease: 'easeOut' }}
//     className="font-[Fraunces] italic font-black text-[80px] max-lg:text-[60px] max-sm:text-[48px]
//                text-[hsl(var(--foreground))] leading-[1.05] mb-5"
//   >
//     Life is short. Have a scoop.
//   </motion.h1>

//   Subtext:
//   <motion.p
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ delay: 0.5, duration: 0.8 }}
//     className="font-[Plus_Jakarta_Sans] font-normal text-lg text-[hsl(var(--foreground)/0.7)]
//                leading-relaxed mb-8 max-w-md"
//   >
//     We make small-batch ice cream and sorbets from scratch every morning.
//     Real ingredients. Seasonal flavours. Absolutely no shortcuts.
//   </motion.p>

//   --- FLIP CARD (see SIGNATURE ANIMATION 1) ---
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.8 }}
//     className="mb-8"
//   >
//     {/* Render FlipCard component here */}
//   </motion.div>

//   CTAs:
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ delay: 1 }}
//     className="flex flex-wrap gap-4"
//   >
//     <button className="bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] font-[Plus_Jakarta_Sans]
//                        font-medium text-base px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity">
//       See All Flavours
//     </button>
//     <button className="font-[Plus_Jakarta_Sans] font-medium text-base text-[hsl(var(--foreground))]
//                        hover:underline px-2">
//       Build Your Cup →
//     </button>
//   </motion.div>

// </div>
```

---

## SECTION 3: FLAVOURS MENU

```tsx
// <section id="flavours" className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Fraunces] italic font-bold text-[56px] max-md:text-[42px]
//                text-[hsl(var(--foreground))] leading-tight mb-3">
//   What's in the cabinet.
// </h2>
// <p className="font-[Plus_Jakarta_Sans] font-normal text-base text-[hsl(var(--foreground)/0.6)] mb-14">
//   Our menu rotates with the seasons. Here's what's currently scooping.
// </p>

const flavours = [
  {
    emoji: '🍓',
    name: 'Strawberry Balsamic',
    description: 'Bright summer strawberries with a whisper of aged balsamic — sweet, sharp, and completely irresistible. One of our defining flavours.',
    tags: ['Contains: dairy', 'Egg-free'],
    badge: 'Summer Favourite',
    badgeColor: 'bg-[hsl(var(--primary)/0.2)]',
  },
  {
    emoji: '🍵',
    name: 'Matcha & White Chocolate',
    description: 'Ceremonial grade matcha, lightly sweetened to let its grassy, slightly bitter character shine, with pools of melted white chocolate swirled through each batch.',
    tags: ['Vegan available', 'Nut-free'],
    badge: 'Spring',
    badgeColor: 'bg-[hsl(var(--secondary)/0.3)]',
  },
  {
    emoji: '🌻',
    name: 'Burnt Honey & Lavender',
    description: 'Wildflower honey taken to the very edge of caramel — nutty, deep, complex — with Provençal lavender that makes it unmistakable and unforgettable.',
    tags: ['Contains: dairy'],
    badge: 'Year-round Signature',
    badgeColor: 'bg-[hsl(var(--accent)/0.2)]',
  },
  {
    emoji: '🥜',
    name: 'Roasted Pistachio & Sea Salt',
    description: 'Whole Sicilian pistachios roasted in-house, ground and churned into a wonderfully dense, nutty ice cream. Finished with a small amount of Atlantic sea salt.',
    tags: ['Contains: dairy, nuts'],
    badge: 'Year-round Signature',
    badgeColor: 'bg-[hsl(var(--secondary)/0.3)]',
  },
  {
    emoji: '🍋',
    name: 'Yuzu & Ginger Sorbet',
    description: 'Intensely citrusy Japanese yuzu (like lemon and mandarin had a child) with crystalised ginger — zingy, refreshing, entirely dairy-free and utterly addictive.',
    tags: ['Vegan', 'Nut-free', 'Dairy-free'],
    badge: 'Summer',
    badgeColor: 'bg-yellow-100',
  },
  {
    emoji: '🍫',
    name: 'Dark Chocolate & Espresso',
    description: '70% Valrhona dark chocolate with a double shot of single-origin Colombian espresso folded through it. Dense, intense, deeply satisfying. For people who take their ice cream seriously.',
    tags: ['Contains: dairy'],
    badge: 'Year-round',
    badgeColor: 'bg-amber-50',
  },
  {
    emoji: '🍑',
    name: 'Peach & Champagne Sorbet',
    description: 'Ripe white peaches at the peak of summer, with a splash of Moët Brut. Grown-up sorbet for a grown-up occasion. Light enough that one scoop invariably leads to two.',
    tags: ['Vegan', 'Nut-free', 'Dairy-free'],
    badge: 'Summer Special',
    badgeColor: 'bg-orange-50',
  },
  {
    emoji: '🫐',
    name: 'Blueberry & Cheesecake',
    description: 'A lemon cream cheese base — dense, tangy, unmistakably cheesecake — with a vivid jammy wild blueberry ripple. All the joy of a slice, in a scoop. Possibly our most Instagrammed flavour.',
    tags: ['Contains: dairy'],
    badge: 'Summer',
    badgeColor: 'bg-purple-50',
  },
  {
    emoji: '🌶️',
    name: 'Chilli Chocolate',
    description: '70% dark chocolate base with Scotch bonnet chilli oil blended through. The heat arrives after the chocolate — building slowly, fading slowly. This one is genuinely not for the faint-hearted.',
    tags: ['Vegan available', 'Nut-free'],
    badge: 'Winter Special',
    badgeColor: 'bg-red-50',
  },
]

// 3×3 grid desktop, 2-col tablet, 1-col mobile
// <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5">
// {flavours.map((f, i) => (
//   <motion.div
//     key={f.name}
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.06 }}
//     className="bg-[hsl(var(--muted))] rounded-2xl p-6 border border-[hsl(var(--border))]
//                hover:shadow-md transition-shadow duration-300"
//   >
//     <div className="text-3xl mb-3 leading-none">{f.emoji}</div>
//     <div className="flex items-start justify-between gap-2 mb-2">
//       <h3 className="font-[Fraunces] italic font-bold text-xl text-[hsl(var(--foreground))] leading-snug">
//         {f.name}
//       </h3>
//     </div>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                   leading-relaxed mb-4">
//       {f.description}
//     </p>
//     <div className="flex flex-wrap items-center gap-2 mt-auto">
//       <span className={`${f.badgeColor} font-[Plus_Jakarta_Sans] font-medium text-[10px]
//                         uppercase tracking-wide px-2.5 py-1 rounded-full text-[hsl(var(--foreground))]`}>
//         {f.badge}
//       </span>
//       {f.tags.map(tag => (
//         <span key={tag} className="font-[Plus_Jakarta_Sans] font-normal text-[10px]
//                                    text-[hsl(var(--muted-foreground))]">
//           {tag}
//         </span>
//       ))}
//     </div>
//   </motion.div>
// ))}
```

---

## SECTION 4: BUILD YOUR CUP — INTERACTIVE WHEEL

```tsx
// <section id="build-a-cup" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Fraunces] italic font-bold text-[52px] max-md:text-[38px]
//                text-[hsl(var(--foreground))] leading-tight mb-3 text-center">
//   Build your perfect cup.
// </h2>
// <p className="font-[Plus_Jakarta_Sans] font-normal text-base text-[hsl(var(--foreground)/0.6)]
//               text-center mb-16 max-w-md mx-auto">
//   Click to add a flavour to your cup. Up to 3 scoops per cup.
// </p>

// DESKTOP: SVG wheel + Your Cup panel
// <div className="hidden md:flex items-center justify-center gap-16">

//   --- SVG FLAVOUR WHEEL ---
//   <div className="relative">
//     <svg
//       width="520"
//       height="520"
//       viewBox="0 0 600 600"
//       className="drop-shadow-lg"
//     >
//       {/* Outer ring background */}
//       <circle cx="300" cy="300" r="280" fill="white" opacity="0.4" />

//       {/* 8 wedge segments */}
//       {wheelFlavours.map((flavour, i) => {
//         const startAngle = i * 45
//         const endAngle = startAngle + 44  // slight gap between segments
//         const isHovered = hoveredSegment === i
//         const isSelected = selectedScoops.some(s => s.id === i)
//         return (
//           <g key={flavour.id}
//              onMouseEnter={() => setHoveredSegment(i)}
//              onMouseLeave={() => setHoveredSegment(null)}
//              onClick={() => {
//                if (isSelected) {
//                  setSelectedScoops(prev => prev.filter(s => s.id !== i))
//                } else if (selectedScoops.length < 3) {
//                  setSelectedScoops(prev => [...prev, flavour])
//                }
//              }}
//              className="cursor-pointer">
//             <motion.path
//               d={wedgePath(300, 300, isHovered ? 275 : 260, 120, startAngle, endAngle)}
//               fill={flavour.color}
//               opacity={isSelected ? 1 : isHovered ? 0.9 : 0.7}
//               whileHover={{ scale: 1.03 }}
//               transition={{ duration: 0.15 }}
//             />
//             {/* Flavour emoji positioned in the middle of the wedge */}
//             {(() => {
//               const midAngle = startAngle + 22.5
//               const pos = polarToCartesian(300, 300, 195, midAngle)
//               return (
//                 <text x={pos.x} y={pos.y + 6}
//                       textAnchor="middle" fontSize="24" className="select-none pointer-events-none">
//                   {flavour.emoji}
//                 </text>
//               )
//             })()}
//           </g>
//         )
//       })}

//       {/* Center circle with "YOUR CUP" text */}
//       <circle cx="300" cy="300" r="110" fill="hsl(var(--background))" />
//       <text x="300" y="293" textAnchor="middle"
//             fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="900" fontSize="18"
//             fill="hsl(var(--foreground))">
//         YOUR
//       </text>
//       <text x="300" y="315" textAnchor="middle"
//             fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="900" fontSize="18"
//             fill="hsl(var(--foreground))">
//         CUP
//       </text>

//       {/* Hover tooltip — show flavour name when hovering */}
//       {hoveredSegment !== null && (
//         <g>
//           <rect x="175" y="548" width="250" height="36" rx="18"
//                 fill="hsl(var(--foreground))" />
//           <text x="300" y="570" textAnchor="middle"
//                 fontFamily="Plus Jakarta Sans, sans-serif" fontSize="13" fill="white">
//             {wheelFlavours[hoveredSegment].emoji} {wheelFlavours[hoveredSegment].name}
//           </text>
//         </g>
//       )}
//     </svg>
//   </div>

//   --- YOUR CUP PANEL ---
//   <div className="w-72 bg-white rounded-3xl p-8 border border-[hsl(var(--border))] shadow-sm">
//     <h3 className="font-[Fraunces] italic font-bold text-2xl text-[hsl(var(--foreground))] mb-6">
//       Your Cup
//     </h3>
//     {selectedScoops.length === 0 ? (
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                     text-center py-8">
//         Click flavours on the wheel to build your cup. Up to 3 scoops.
//       </p>
//     ) : (
//       <div className="space-y-3 mb-6">
//         {selectedScoops.map((scoop, i) => (
//           <motion.div
//             key={`${scoop.id}-${i}`}
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="flex items-center gap-3 bg-[hsl(var(--muted))] rounded-xl px-4 py-3"
//           >
//             <span className="text-xl">{scoop.emoji}</span>
//             <span className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--foreground))] flex-1">
//               {scoop.name}
//             </span>
//             <button onClick={() => setSelectedScoops(prev => prev.filter((_, idx) => idx !== i))}
//                     className="text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors text-xs">
//               ✕
//             </button>
//           </motion.div>
//         ))}
//       </div>
//     )}
//     {selectedScoops.length > 0 && (
//       <>
//         <button
//           className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--foreground))]
//                      font-[Plus_Jakarta_Sans] font-medium text-sm py-3 rounded-full
//                      hover:opacity-90 transition-opacity mb-3"
//           onClick={() => {
//             // Show toast: "Come to the counter and mention your cup!"
//             alert("Come to the counter and mention your cup! We'll have it ready. 🍦")
//           }}
//         >
//           Order This Cup →
//         </button>
//         <button
//           className="w-full font-[Plus_Jakarta_Sans] font-normal text-xs
//                      text-[hsl(var(--muted-foreground))] hover:underline"
//           onClick={() => setSelectedScoops([])}
//         >
//           Clear
//         </button>
//       </>
//     )}
//   </div>

// </div>

// MOBILE FALLBACK — grid of checkboxes:
// <div className="md:hidden grid grid-cols-2 gap-3">
// {wheelFlavours.map(flavour => {
//   const isSelected = selectedScoops.some(s => s.id === flavour.id)
//   return (
//     <button
//       key={flavour.id}
//       onClick={() => {
//         if (isSelected) setSelectedScoops(prev => prev.filter(s => s.id !== flavour.id))
//         else if (selectedScoops.length < 3) setSelectedScoops(prev => [...prev, flavour])
//       }}
//       className={`p-4 rounded-2xl border-2 text-left transition-all ${
//         isSelected
//           ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground)/0.05)]'
//           : 'border-[hsl(var(--border))] bg-white'
//       }`}
//     >
//       <div className="text-2xl mb-1">{flavour.emoji}</div>
//       <p className="font-[Plus_Jakarta_Sans] font-medium text-xs text-[hsl(var(--foreground))]">
//         {flavour.name}
//       </p>
//     </button>
//   )
// })}
```

---

## SECTION 5: HOW WE MAKE IT

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Fraunces] italic font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-16 text-center">
//   Made fresh, every morning.
// </h2>

const process = [
  {
    emoji: '🥛',
    title: 'Fresh Ingredients',
    description: 'We source dairy from a single family farm in Somerset — milk delivered twice a week, cream three times. Fruits come from local growers at Borough Market when in season, and we import key flavouring ingredients direct: Sicilian pistachios, Valrhona chocolate, ceremonial grade matcha. No stabilisers, no gums, no artificial flavouring of any kind.',
  },
  {
    emoji: '🔄',
    title: 'Small Batch Churning',
    description: 'Each batch is 10–20 litres — small enough that we can taste every single one before it goes in the cabinet. We churn through the morning, through the afternoon, and sometimes into the evening to keep up with demand on busy days. If we run out, we run out. Yesterday\'s ice cream will never appear in the cabinet.',
  },
  {
    emoji: '❄️',
    title: 'Same Day Service',
    description: 'Ice cream served the day it was made. Whatever hasn\'t sold by closing time goes to our team or to local food banks through a partnership with Borough Market Food Bank. We do not serve yesterday\'s ice cream. We do not freeze down and thaw up. What you\'re eating was made this morning. That\'s the whole point.',
  },
]

// 3-col horizontal desktop, vertical mobile:
// <div className="grid grid-cols-3 max-md:grid-cols-1 gap-12">
// {process.map((step, i) => (
//   <motion.div
//     key={step.title}
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.15 }}
//     className="text-center"
//   >
//     <div className="text-5xl mb-5">{step.emoji}</div>
//     <h3 className="font-[Fraunces] italic font-bold text-2xl text-[hsl(var(--foreground))] mb-3">
//       {step.title}
//     </h3>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                   leading-relaxed">
//       {step.description}
//     </p>
//   </motion.div>
// ))}
```

---

## SECTION 6: VISIT US

```tsx
// <section id="visit-us" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

// LEFT — Info
// <div>
//   <h2 className="font-[Fraunces] italic font-bold text-[48px] max-md:text-[36px]
//                  text-[hsl(var(--foreground))] leading-tight mb-6">
//     Come find us.
//   </h2>
//   <address className="not-italic">
//     <p className="font-[Plus_Jakarta_Sans] font-medium text-base text-[hsl(var(--foreground))] mb-1">
//       14 Stoney Street
//     </p>
//     <p className="font-[Plus_Jakarta_Sans] font-medium text-base text-[hsl(var(--foreground))] mb-6">
//       Borough Market, London SE1 9AD
//     </p>
//   </address>

//   Hours table:
//   <div className="space-y-2 mb-8">
//     {[
//       { day: 'Monday – Friday', hours: '10am – 7pm' },
//       { day: 'Saturday', hours: '9am – 8pm' },
//       { day: 'Sunday', hours: '10am – 6pm' },
//       { day: 'January', hours: 'Closed' },
//     ].map(row => (
//       <div key={row.day} className="flex justify-between items-center
//                                     border-b border-[hsl(var(--border))] pb-2">
//         <span className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--foreground))]">
//           {row.day}
//         </span>
//         <span className={`font-[Plus_Jakarta_Sans] font-medium text-sm ${
//           row.hours === 'Closed' ? 'text-red-500' : 'text-[hsl(var(--foreground))]'
//         }`}>
//           {row.hours}
//         </span>
//       </div>
//     ))}
//   </div>

//   <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
//     We're 2 minutes from Borough Market tube exit. Look for the pink awning and the queue.
//     On warm days, the queue starts at the door and moves quickly.
//   </p>

//   Nearest stations:
//   <div className="flex gap-6">
//     <div>
//       <p className="font-[Plus_Jakarta_Sans] font-medium text-xs text-[hsl(var(--foreground))] uppercase tracking-wider mb-1">
//         London Bridge
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-light text-sm text-[hsl(var(--muted-foreground))]">
//         2 min walk
//       </p>
//     </div>
//     <div>
//       <p className="font-[Plus_Jakarta_Sans] font-medium text-xs text-[hsl(var(--foreground))] uppercase tracking-wider mb-1">
//         Southwark
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-light text-sm text-[hsl(var(--muted-foreground))]">
//         7 min walk
//       </p>
//     </div>
//   </div>
// </div>

// RIGHT — Shop image + map
// <div className="space-y-4">
//   {/* Image: Scoop ice cream shop exterior on Stoney Street Borough Market, a pink-painted shopfront with a hand-lettered sign, a cheerful queue of customers outside on a sunny day, Borough Market bustling in the background, candid street photography style */}
//   <div className="rounded-2xl overflow-hidden aspect-[4/3]">
//     <img src="" alt="Scoop ice cream shop exterior at Borough Market"
//          className="w-full h-full object-cover" />
//   </div>
//   {/* Map placeholder */}
//   <div className="bg-white border border-[hsl(var(--border))] rounded-2xl h-32 flex items-center justify-center">
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]">
//       📍 14 Stoney Street, SE1 9AD
//     </p>
//   </div>
// </div>
```

---

## SECTION 7: EVENTS & PRIVATE HIRE

```tsx
// <section id="events" className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Fraunces] italic font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-14">
//   Scoop at your event.
// </h2>

// Two options, side by side desktop / stacked mobile
// <div className="grid lg:grid-cols-2 gap-8">

//   SCOOP CART HIRE:
//   <div className="border border-[hsl(var(--border))] rounded-3xl overflow-hidden">
//     {/* Image: a white and pink vintage ice cream cart decorated with fresh flowers and a chalkboard menu, two cheerful scoopists in pink aprons serving guests at an outdoor summer wedding, long tables set with white linen in the background */}
//     <div className="aspect-[16/9] overflow-hidden">
//       <img src="" alt="Scoop vintage ice cream cart at a summer wedding"
//            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
//     </div>
//     <div className="p-8">
//       <h3 className="font-[Fraunces] italic font-bold text-2xl text-[hsl(var(--foreground))] mb-2">
//         Scoop Cart Hire
//       </h3>
//       <p className="font-[Plus_Jakarta_Sans] font-medium text-[hsl(var(--primary))] text-sm mb-4">
//         From £450 · up to 100 guests
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
//         We bring our vintage ice cream cart, eight flavours of the season, and two scoopists to your event.
//         Weddings, corporate summer parties, product launches, birthday celebrations. The cart is self-contained
//         and works indoors or outdoors. We handle everything — you just enjoy your event.
//       </p>
//       <ul className="space-y-1.5 mb-6">
//         {['8 seasonal flavours', '2 scoopists included', 'Min. 2 hours, max. 6 hours', 'Cones, cups, napkins included', '100+ guests? Ask for a quote'].map(item => (
//           <li key={item} className="flex items-center gap-2">
//             <span className="text-[hsl(var(--primary))] text-xs">✦</span>
//             <span className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]">
//               {item}
//             </span>
//           </li>
//         ))}
//       </ul>
//       <button className="bg-[hsl(var(--primary))] text-[hsl(var(--foreground))] font-[Plus_Jakarta_Sans]
//                          font-medium text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
//         Enquire about cart hire
//       </button>
//     </div>
//   </div>

//   PRIVATE TASTING EVENTS:
//   <div className="border border-[hsl(var(--border))] rounded-3xl overflow-hidden">
//     {/* Image: an intimate evening ice cream tasting at the Scoop shop after hours — a small group of 12 people gathered around a long table with tasting spoons, small ceramic tasting dishes of different ice creams, and jars of local honey and jam for pairing, warm lighting creating a special occasion mood */}
//     <div className="aspect-[16/9] overflow-hidden">
//       <img src="" alt="Scoop private ice cream tasting event at the shop"
//            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
//     </div>
//     <div className="p-8">
//       <h3 className="font-[Fraunces] italic font-bold text-2xl text-[hsl(var(--foreground))] mb-2">
//         Private Tasting Events
//       </h3>
//       <p className="font-[Plus_Jakarta_Sans] font-medium text-[hsl(var(--primary))] text-sm mb-4">
//         From £65 per person · max. 20 guests
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
//         Book the Scoop shop after hours for a guided tasting evening with our head maker. Ten flavours, the
//         story behind each one, pairings with locally produced honey, jam, and seasonal fruit. A genuinely
//         lovely evening — popular for birthdays, hen parties, corporate team events, and food-lover groups.
//       </p>
//       <ul className="space-y-1.5 mb-6">
//         {['10 ice cream tastings per person', 'Guided by our head maker', 'Pairing notes and recipes to take home', 'Prosecco package available (+£15pp)', 'Friday and Saturday evenings'].map(item => (
//           <li key={item} className="flex items-center gap-2">
//             <span className="text-[hsl(var(--primary))] text-xs">✦</span>
//             <span className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]">
//               {item}
//             </span>
//           </li>
//         ))}
//       </ul>
//       <button className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] font-[Plus_Jakarta_Sans]
//                          font-medium text-sm px-6 py-3 rounded-full hover:opacity-80 transition-opacity">
//         Book a tasting event
//       </button>
//     </div>
//   </div>

// </div>
```

---

## SECTION 8: GIFT CARDS

```tsx
// <section id="gift-cards" className="py-24 bg-[hsl(var(--primary)/0.15)]">
// <div className="max-w-4xl mx-auto px-6 text-center">

// Heading:
// <h2 className="font-[Fraunces] italic font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-4">
//   Give the gift of scoops.
// </h2>
// <p className="font-[Plus_Jakarta_Sans] font-normal text-base text-[hsl(var(--muted-foreground))]
//               mb-14 max-w-sm mx-auto">
//   Digital gift cards in any amount from £10. Redeemable in store. No expiry date. Ever.
// </p>

// 3 gift card mockups:
// <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-6 mb-12">
// {[
//   { amount: '£10', gradient: 'from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)]' },
//   { amount: '£25', gradient: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary)/0.7)]' },
//   { amount: '£50', gradient: 'from-[hsl(var(--accent))] to-[hsl(var(--accent)/0.7)]' },
// ].map(card => (
//   <motion.div
//     key={card.amount}
//     whileHover={{ scale: 1.04, rotate: -1 }}
//     transition={{ type: 'spring', stiffness: 400 }}
//     className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 aspect-[1.6/1]
//                 flex flex-col justify-between shadow-md cursor-pointer`}
//   >
//     <div className="flex justify-between items-start">
//       <span className="font-[Fraunces] italic font-black text-white text-xl">SCOOP</span>
//       <span className="font-[Plus_Jakarta_Sans] font-medium text-white/80 text-xs uppercase tracking-wider">
//         Gift Card
//       </span>
//     </div>
//     <div>
//       <span className="font-[Fraunces] italic font-black text-white text-4xl">{card.amount}</span>
//     </div>
//   </motion.div>
// ))}

// Gift card FAQ note:
// <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))] mb-10">
//   Valid in-store only · No expiry date · Not redeemable for cash · If lost or stolen, cannot be replaced
// </p>

// CTA:
// <button className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] font-[Plus_Jakarta_Sans]
//                    font-medium text-base px-8 py-4 rounded-full hover:opacity-80 transition-opacity">
//   Buy a Gift Card
// </button>
```

---

## SECTION 9: SOCIAL / INSTAGRAM GRID

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Fraunces] italic font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-3 text-center">
//   Follow our scoops.
// </h2>
// <p className="font-[Plus_Jakarta_Sans] font-normal text-base text-[hsl(var(--muted-foreground))]
//               text-center mb-12">
//   @scoop_london · Tag us to be featured
// </p>

const instagramImages = [
  {
    comment: '/* Image: extreme close-up of a single scoop of strawberry balsamic ice cream in a freshly waffle cone, vivid pink ice cream slowly dripping, vibrant food photography with a bright white background, social-media-first composition */',
    alt: 'Close-up of strawberry balsamic scoop in a waffle cone',
  },
  {
    comment: '/* Image: two scoops of artisan ice cream — one pistachio green, one dark chocolate brown — served in a minimalist white ceramic cup on a white marble counter, food styling photography for an Instagram-worthy flat lay */',
    alt: 'Two scoops pistachio and dark chocolate in ceramic cup',
  },
  {
    comment: '/* Image: behind-the-scenes view of the ice cream churning machine in action, pale cream ice cream being churned in a silver bowl, warm bakery kitchen lighting, authentic artisan process photography */',
    alt: 'Ice cream churning machine in Scoop kitchen',
  },
  {
    comment: '/* Image: the Scoop shop window from outside — a chalkboard menu with hand-lettered flavour names, a glimpse of the colourful ice cream cabinet through the glass, Borough Market street scene in the background, candid urban street photography */',
    alt: 'Scoop shop window with chalkboard menu at Borough Market',
  },
  {
    comment: '/* Image: the Scoop vintage ice cream cart at an outdoor summer wedding, decorated with trailing flowers, two people in pink aprons handing cones to happy guests, soft late afternoon golden light */',
    alt: 'Scoop ice cream cart at a summer wedding',
  },
  {
    comment: '/* Image: hands holding a scoop of brilliant green matcha white chocolate ice cream from above, the vivid colour against a light neutral surface, overhead food photography with exceptional colour contrast */',
    alt: 'Hands holding matcha white chocolate scoop, aerial view',
  },
]

// 3×2 grid desktop, 2-col mobile
// <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-3">
// {instagramImages.map((img, i) => (
//   <motion.div
//     key={i}
//     whileHover={{ opacity: 0.9 }}
//     className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
//   >
//     {img.comment}
//     <img src="" alt={img.alt} className="w-full h-full object-cover" />
//     {/* Instagram hover overlay */}
//     <div className="absolute inset-0 bg-[hsl(var(--foreground)/0.3)] opacity-0 group-hover:opacity-100
//                     transition-opacity flex items-center justify-center">
//       <Instagram className="w-8 h-8 text-white" />
//     </div>
//   </motion.div>
// ))}
```

---

## SECTION 10: FAQ + FOOTER

```tsx
// FAQ
// <section className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-3xl mx-auto px-6">

// Heading:
// <h2 className="font-[Fraunces] italic font-bold text-[44px] max-md:text-[34px]
//                text-[hsl(var(--foreground))] leading-tight mb-12">
//   Good questions.
// </h2>

const faqs = [
  {
    q: "Are there vegan options?",
    a: "Yes — we always have at least 3 vegan scoops in the cabinet at any time. All our sorbets are vegan. Our matcha white chocolate and chilli chocolate flavours are also available in vegan versions (made with coconut cream base). Vegan options are clearly marked with a 🌱 on the cabinet label. If you're unsure, ask — we're happy to go through the cabinet with you.",
  },
  {
    q: "Do you do wholesale or supply to restaurants?",
    a: "We do have a small number of restaurant accounts in SE1 — two to three restaurants who feature our ice cream on their dessert menus. Our production capacity means we keep it very small. Minimum weekly order applies. If you're interested, email hello@scoop-london.com with your restaurant details and requirements.",
  },
  {
    q: "Can I order online for delivery?",
    a: "We don't deliver. Ice cream just doesn't travel well enough to our standards — by the time it arrives, it's been through temperature changes, and that affects the texture and flavour in ways we can't accept. We're a come-to-us kind of place, and we're a two-minute walk from London Bridge station. Most people agree the trip is worth it.",
  },
  {
    q: "Do you cater for allergies?",
    a: "We handle dairy, eggs, nuts (pistachios), and gluten in our kitchen. Cross-contamination is genuinely possible — we're a small kitchen without separate preparation areas. If you have a severe allergy, we'd gently suggest caution. If your allergy is less severe, ask at the counter and we'll walk you through what's currently in the cabinet and what equipment each flavour has used.",
  },
]

// <Accordion type="single" collapsible className="space-y-3">
//   {faqs.map((faq, i) => (
//     <AccordionItem key={i} value={`item-${i}`}
//                   className="bg-white rounded-xl border border-[hsl(var(--border))] px-6">
//       <AccordionTrigger className="font-[Plus_Jakarta_Sans] font-medium text-base
//                                    text-[hsl(var(--foreground))] hover:no-underline py-5 text-left">
//         {faq.q}
//       </AccordionTrigger>
//       <AccordionContent className="font-[Plus_Jakarta_Sans] font-normal text-sm
//                                     text-[hsl(var(--muted-foreground))] leading-relaxed pb-5">
//         {faq.a}
//       </AccordionContent>
//     </AccordionItem>
//   ))}
// </Accordion>

// FOOTER
// <footer className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] py-16">
// <div className="max-w-7xl mx-auto px-6">

//   Top:
//   <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12 border-b border-white/10">
//     <div>
//       <div className="flex items-center gap-2.5 mb-3">
//         {/* Ice cream cone SVG in white */}
//         <span className="font-[Fraunces] italic font-black text-3xl text-white">SCOOP</span>
//       </div>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/40 max-w-xs">
//         Small-batch artisan ice cream. Made fresh daily. Borough Market, London.
//       </p>
//     </div>
//     <nav className="flex flex-wrap gap-x-10 gap-y-3">
//       {['Flavours', 'Build a Cup', 'Visit Us', 'Events', 'Gift Cards', 'FAQ'].map(link => (
//         <a key={link} href="#"
//            className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/50 hover:text-white transition-colors">
//           {link}
//         </a>
//       ))}
//     </nav>
//   </div>

//   Bottom:
//   <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-white/30">
//       📍 14 Stoney Street, Borough Market, London SE1 9AD
//     </p>
//     <div className="flex gap-4">
//       <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="Instagram">
//         <Instagram className="w-4 h-4" />
//       </a>
//       <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="TikTok">
//         {/* TikTok icon — use a simple path SVG since lucide doesn't have TikTok */}
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//           <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
//         </svg>
//       </a>
//     </div>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-white/30">
//       © 2025 Scoop Ice Cream Ltd. Made fresh daily.
//     </p>
//   </div>

// </div>
```

---

## DEPENDENCIES & IMPLEMENTATION NOTES

```bash
npm install framer-motion lucide-react
npx shadcn-ui@latest init
npx shadcn-ui@latest add accordion button card toast
```

### Key state variables:
```tsx
const [flipIndex, setFlipIndex] = useState(0)
const [isFlipped, setIsFlipped] = useState(false)
const [selectedScoops, setSelectedScoops] = useState<WheelFlavour[]>([])
const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
const [scrolled, setScrolled] = useState(false)
```

### Sprinkle dots generation:
```tsx
const sprinkles = useMemo(() => 
  Array.from({ length: 20 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 50}%`, // only on left half
    color: ['hsl(348 70% 75%)', 'hsl(100 37% 75%)', 'hsl(32 80% 68%)'][i % 3],
    angle: Math.random() * 360,
  }))
, [])
```

### Global CSS:
```css
* { font-family: 'Plus Jakarta Sans', sans-serif; }
h1, h2, h3 { font-family: 'Fraunces', serif; font-style: italic; }
html { scroll-behavior: smooth; }

/* Flip card CSS */
.flip-card { perspective: 1200px; }
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(.17,.67,.83,.67);
}
.flip-card-inner.flipped { transform: rotateY(180deg); }
.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
}
.flip-card-back { transform: rotateY(180deg); }
```
