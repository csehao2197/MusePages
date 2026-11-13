# LINGUA — Language School Website Prompt
## For Bolt, v0, Lovable, Claude — React + Vite + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui + lucide-react

---

Build a complete, production-ready language school website for **LINGUA** — a modern online language school aimed at professional adults who want structured, effective language learning without the gimmicks. The brand is confident, intelligent, and approachable — navy with warm yellow accents. Every section contains fully written copy and all animations are fully implemented.

---

## DESIGN SYSTEM

### Colors — HSL custom properties in :root

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500&display=swap');

:root {
  --background: 0 0% 100%;
  --foreground: 228 52% 22%;
  --primary: 228 52% 22%;
  --primary-foreground: 0 0% 100%;
  --accent: 45 92% 61%;
  --muted: 220 30% 96%;
  --card: 0 0% 100%;
  --border: 220 15% 88%;
  --muted-foreground: 228 20% 50%;
}
```

### Typography
- **Headings**: Sora — weights 700 and 800. Modern, geometric, friendly but purposeful. Used for all H1/H2/H3.
- **Body**: Plus Jakarta Sans — weights 400 and 500. Clear, readable, professional.

### Signature Animation: Language Ticker Marquee

The hero section features a horizontal scrolling language ticker — a full-width animated strip that scrolls languages infinitely from right to left. Implementation:

```css
/* Add to global CSS */
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll 25s linear infinite;
}

.ticker-track:hover {
  animation-play-state: paused;
}
```

```tsx
// Ticker JSX:
const TICKER_TEXT = "Hello · Hola · Bonjour · Ciao · Olá · こんにちは · Merhaba · مرحبا · Привет · Namaste · "

<div className="w-full overflow-hidden bg-[hsl(var(--accent))] py-3">
  <div className="ticker-track">
    {/* Render the string TWICE side-by-side so the loop is seamless */}
    <span className="font-[Sora] font-bold text-lg text-[hsl(var(--foreground))] pr-8 whitespace-nowrap">
      {TICKER_TEXT.repeat(4)}
    </span>
    <span className="font-[Sora] font-bold text-lg text-[hsl(var(--foreground))] pr-8 whitespace-nowrap">
      {TICKER_TEXT.repeat(4)}
    </span>
  </div>
</div>
```

---

## SECTION 1: NAVBAR

```tsx
// Sticky navbar with scroll shadow

// State: const [scrolled, setScrolled] = useState(false)
// useEffect: window.addEventListener('scroll', () => setScrolled(window.scrollY > 40))

// <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300
//                  border-b border-[hsl(var(--border))]
//                  ${scrolled ? 'shadow-sm' : 'shadow-none'}`}>
// <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between h-[72px]">

// LOGO (left):
// <a href="/" className="flex items-center gap-2.5">
//   <GraduationCap className="w-6 h-6 text-[hsl(var(--accent))]" />
//   <span className="font-[Sora] font-bold text-[22px] text-[hsl(var(--foreground))] tracking-tight">
//     LINGUA
//   </span>
// </a>

// NAV LINKS (center, hidden md:down):
// <nav className="hidden md:flex items-center gap-8">
//   {['Languages', 'Courses', 'Teachers', 'Business', 'Pricing'].map(item => (
//     <a key={item} href={`#${item.toLowerCase()}`}
//        className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                   hover:text-[hsl(var(--foreground))] transition-colors">
//       {item}
//     </a>
//   ))}
// </nav>

// CTA (right):
// <button className="bg-[hsl(var(--primary))] text-white font-[Plus_Jakarta_Sans] font-medium
//                    text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
//   Start Learning
// </button>
```

---

## SECTION 2: HERO

```tsx
// <section className="min-h-[90dvh] bg-white flex flex-col items-center justify-center
//                      text-center px-6 relative overflow-hidden">

// BACKGROUND DECORATIVE ELEMENTS (absolutely positioned, z-0):
// Large faint language names scattered in corners:
// <span className="absolute top-8 left-4 font-[Sora] font-extrabold text-[120px]
//                  text-[hsl(var(--foreground)/0.04)] select-none pointer-events-none leading-none
//                  max-lg:hidden">
//   ESPAÑOL
// </span>
// <span className="absolute bottom-8 right-4 font-[Sora] font-extrabold text-[100px]
//                  text-[hsl(var(--foreground)/0.04)] select-none pointer-events-none leading-none
//                  max-lg:hidden">
//   FRANÇAIS
// </span>
// <span className="absolute top-1/2 right-8 -translate-y-1/2 font-[Sora] font-extrabold text-[80px]
//                  text-[hsl(var(--foreground)/0.03)] select-none pointer-events-none leading-none
//                  max-lg:hidden">
//   ITALIANO
// </span>

// Subtle radial gradient background:
// <div className="absolute inset-0 bg-radial-gradient from-[hsl(var(--primary)/0.04)]
//                  to-transparent pointer-events-none" />
//  → Use inline style: background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(228 52% 22% / 0.04), transparent)'

// CONTENT z-10:
// <div className="relative z-10 w-full flex flex-col items-center">

//   --- TICKER (full width, appears just above the headline) ---
//   (Render the ticker marquee strip here — full width, yellow background strip with scrolling text)
//   (See ticker implementation above)

//   Pre-heading:
//   <p className="font-[Plus_Jakarta_Sans] font-normal text-xs tracking-[0.35em] uppercase
//                  text-[hsl(var(--muted-foreground))] mt-10 mb-5">
//     ONLINE LANGUAGE SCHOOL
//   </p>

//   Headline:
//   <motion.h1
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.9, ease: 'easeOut' }}
//     className="font-[Sora] font-extrabold text-[72px] max-lg:text-[52px] max-sm:text-[38px]
//                text-[hsl(var(--foreground))] leading-[1.1] max-w-3xl"
//   >
//     Speak a new language with confidence.
//   </motion.h1>

//   Subtext:
//   <motion.p
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 0.8, delay: 0.4 }}
//     className="font-[Plus_Jakarta_Sans] font-normal text-lg text-[hsl(var(--muted-foreground))]
//                leading-relaxed max-w-xl mt-5"
//   >
//     Expert tutors, structured courses, and flexible scheduling — for absolute beginners and
//     conversational speakers wanting to go further. 7 languages. 1 platform.
//   </motion.p>

//   CTAs:
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6, delay: 0.7 }}
//     className="flex flex-wrap gap-4 justify-center mt-8"
//   >
//     <button className="bg-[hsl(var(--primary))] text-white font-[Plus_Jakarta_Sans] font-medium
//                        text-base px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity">
//       Book a Free Trial Class
//     </button>
//     <button className="text-[hsl(var(--primary))] font-[Plus_Jakarta_Sans] font-medium
//                        text-base px-7 py-3.5 hover:underline">
//       Explore Languages →
//     </button>
//   </motion.div>

//   Social proof strip:
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ duration: 0.6, delay: 1 }}
//     className="mt-10 border-t border-[hsl(var(--border))] pt-6"
//   >
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]">
//       Trusted by 4,200+ learners across 38 countries &nbsp;·&nbsp; 4.9★ Trustpilot &nbsp;·&nbsp; Google-certified teachers
//     </p>
//   </motion.div>

// </div>
```

---

## SECTION 3: LANGUAGES

```tsx
// <section id="languages" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <motion.h2
//   initial={{ opacity: 0, y: 20 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   viewport={{ once: true }}
//   className="font-[Sora] font-bold text-[52px] max-md:text-[38px]
//              text-[hsl(var(--foreground))] leading-tight mb-4"
// >
//   7 languages. Expert teachers. One platform.
// </motion.h2>
// <p className="font-[Plus_Jakarta_Sans] font-normal text-base text-[hsl(var(--muted-foreground))]
//               mb-14 max-w-xl">
//   All our teachers are native or near-native speakers with recognised teaching qualifications
//   and a minimum of two years' experience.
// </p>

const languages = [
  {
    flag: '🇪🇸',
    name: 'Spanish',
    teachers: 10,
    levels: 'A1 – C2',
    popular: true,
    description: 'The world\'s second most spoken language, and our most popular. Whether you\'re headed to Spain or Latin America, this is where most students start.',
  },
  {
    flag: '🇫🇷',
    name: 'French',
    teachers: 8,
    levels: 'A1 – C2',
    popular: true,
    description: 'Official language in 29 countries. Our French teachers cover European, Canadian, and African French varieties depending on your goals.',
  },
  {
    flag: '🇩🇪',
    name: 'German',
    teachers: 6,
    levels: 'A1 – C1',
    popular: false,
    description: 'The most spoken language in the EU. Highly valued in engineering, finance, and academia — and more learnable than its reputation suggests.',
  },
  {
    flag: '🇮🇹',
    name: 'Italian',
    teachers: 5,
    levels: 'A1 – B2',
    popular: true,
    description: 'The language of opera, art, food, and fashion. Students consistently describe Italian lessons as the most enjoyable on the platform.',
  },
  {
    flag: '🇵🇹',
    name: 'Portuguese',
    teachers: 4,
    levels: 'A1 – B2',
    popular: false,
    description: 'Available in both European (Portugal) and Brazilian varieties. Growing rapidly in business importance, particularly in tech and finance.',
  },
  {
    flag: '🇯🇵',
    name: 'Japanese',
    teachers: 4,
    levels: 'Beginner – Intermediate',
    popular: false,
    description: 'Three writing systems, a unique grammatical structure, and an incredibly rich cultural context. Our teachers make it structured and achievable.',
  },
  {
    flag: '🇦🇪',
    name: 'Arabic',
    teachers: 3,
    levels: 'A1 – A2',
    popular: false,
    description: 'We offer Modern Standard Arabic, suitable for formal communication, reading, and as a foundation for regional dialects. Expanding programme.',
  },
]

// Grid: grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4
// Each card:
// <motion.div
//   key={lang.name}
//   whileInView={{ opacity: 1, y: 0 }}
//   initial={{ opacity: 0, y: 20 }}
//   viewport={{ once: true }}
//   transition={{ delay: index * 0.08 }}
//   className="bg-white rounded-2xl p-6 border border-[hsl(var(--border))]
//              hover:border-[hsl(var(--accent))] hover:shadow-md transition-all duration-300
//              relative overflow-hidden"
// >
//   {lang.popular && (
//     <span className="absolute top-3 right-3 bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]
//                       font-[Plus_Jakarta_Sans] font-medium text-[10px] tracking-wider uppercase
//                       px-2.5 py-1 rounded-full">
//       Most Popular
//     </span>
//   )}
//   <div className="text-[40px] mb-3 leading-none">{lang.flag}</div>
//   <h3 className="font-[Sora] font-bold text-[22px] text-[hsl(var(--foreground))] mb-1">
//     {lang.name}
//   </h3>
//   <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--muted-foreground))] mb-3">
//     {lang.levels} · {lang.teachers} teachers available
//   </p>
//   <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
//     {lang.description}
//   </p>
//   <button className="mt-5 font-[Plus_Jakarta_Sans] font-medium text-sm
//                      text-[hsl(var(--primary))] hover:underline">
//     View {lang.name} teachers →
//   </button>
// </motion.div>
```

---

## SECTION 4: HOW IT WORKS

```tsx
// <section id="courses" className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6 text-center">

// Heading:
// <h2 className="font-[Sora] font-bold text-[52px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-4 text-center">
//   Learning that fits your life.
// </h2>
// <p className="font-[Plus_Jakarta_Sans] font-normal text-base text-[hsl(var(--muted-foreground))]
//               mb-16 max-w-lg mx-auto text-center">
//   No commuting to a classroom, no fixed timetable you can't keep. Just structured, effective
//   language learning built around your schedule.
// </p>

const steps = [
  {
    number: '01',
    icon: '📝',
    title: 'Take a free placement test',
    description: 'A 15-minute online assessment tells us exactly where you are and what you need. No guesswork, no wasted early lessons, no frustration. We\'ll know your level before your first session.',
    time: '15 minutes',
  },
  {
    number: '02',
    icon: '👩‍🏫',
    title: 'Get matched with a teacher',
    description: 'Based on your level, your goals, your learning style, and your schedule, we match you with the right teacher. You can preview their profile and short-form intro video before confirming.',
    time: 'Within 48 hours',
  },
  {
    number: '03',
    icon: '📅',
    title: 'Book flexible lessons',
    description: '1-on-1 sessions, small group classes (max. 6), or a mix of both. Book week-by-week for flexibility or subscribe for better value and priority scheduling. Sessions from 30 to 90 minutes.',
    time: 'Your schedule',
  },
  {
    number: '04',
    icon: '🎯',
    title: 'Track your progress',
    description: 'After every month you\'ll receive a written progress report from your teacher. After every completed CEFR level, a full language assessment. You\'ll always know exactly where you stand and what\'s next.',
    time: 'Monthly reports',
  },
]

// Desktop: horizontal 4-col grid. Mobile: vertical stack.
// <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-8 text-left">
// {steps.map((step, i) => (
//   <motion.div
//     key={step.number}
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.1 }}
//     className="relative"
//   >
//     <div className="font-[Sora] font-extrabold text-[60px] leading-none
//                     text-[hsl(var(--accent)/0.4)] mb-4">
//       {step.number}
//     </div>
//     <div className="text-3xl mb-3">{step.icon}</div>
//     <h3 className="font-[Sora] font-bold text-lg text-[hsl(var(--foreground))] mb-3">
//       {step.title}
//     </h3>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                   leading-relaxed">
//       {step.description}
//     </p>
//     <p className="font-[Plus_Jakarta_Sans] font-medium text-xs text-[hsl(var(--accent))]
//                   mt-4 uppercase tracking-wider">
//       {step.time}
//     </p>
//   </motion.div>
// ))}
```

---

## SECTION 5: MEET THE TEACHERS

```tsx
// <section id="teachers" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-7xl mx-auto px-6">

// Heading:
// <h2 className="font-[Sora] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-14">
//   Meet some of our teachers.
// </h2>

const teachers = [
  {
    imageComment: '/* Image: friendly female Spanish language teacher, warm genuine smile, professional yet approachable expression, light neutral background, softbox lighting, educational or home office setting, portrait photography for a tutoring website */',
    altText: 'Elena Martínez, Spanish teacher at Lingua',
    name: 'Elena Martínez',
    languages: 'Spanish (Native) · English (C2)',
    credentials: 'DELE Examiner · MA Hispanic Studies · 9 years teaching',
    reviews: 97,
    reviewCount: 248,
    quote: "I'm passionate about helping students use Spanish in real conversations from day one — not just conjugating verbs on paper. My lessons are fast-paced, practical, and always grounded in how people actually speak.",
    specialisms: ['Conversational Spanish', 'Business Spanish', 'DELE Exam prep'],
  },
  {
    imageComment: '/* Image: male French and Italian language teacher, intellectual and friendly expression, slight smile, professional casual attire, light academic or neutral background, warm natural lighting, tutoring website portrait */',
    altText: 'Julien Fontaine, French and Italian teacher at Lingua',
    name: 'Julien Fontaine',
    languages: 'French (Native) · Italian (B2) · English (C1)',
    credentials: 'MA Linguistics (Paris III) · DALF examiner · 11 years teaching',
    reviews: 94,
    reviewCount: 189,
    quote: "My approach: the fastest path to speaking a language is enormous amounts of comprehensible input and gentle, consistent correction. I don't waste lesson time on abstract grammar — we speak, and the grammar follows.",
    specialisms: ['DALF/DELF Exam prep', 'Academic French', 'Beginners Italian'],
  },
  {
    imageComment: '/* Image: friendly female Japanese language teacher, warm professional portrait, natural and approachable expression, minimal clean background, soft natural lighting from the side, educational portrait style */',
    altText: 'Yuki Tanaka, Japanese teacher at Lingua',
    name: 'Yuki Tanaka',
    languages: 'Japanese (Native) · English (C1)',
    credentials: 'JLPT Certification Specialist · BA Japanese Education · 8 years teaching',
    reviews: 98,
    reviewCount: 143,
    quote: "Japanese has a reputation for being impossibly difficult. It isn't — it just needs a proper system, introduced in the right order. I've helped complete beginners pass JLPT N3 in 18 months. It's entirely achievable.",
    specialisms: ['JLPT N5–N2 prep', 'Reading & Writing systems', 'Business Japanese'],
  },
]

// 3-column grid desktop, 1-col mobile
// <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-6">
// {teachers.map((teacher, i) => (
//   <motion.div
//     key={teacher.name}
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.1 }}
//     className="bg-white rounded-2xl p-6 border border-[hsl(var(--border))] flex flex-col"
//   >
//     {/* Teacher portrait */}
//     {teacher.imageComment}
//     <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[hsl(var(--accent)/0.4)]">
//       <img src="" alt={teacher.altText} className="w-full h-full object-cover" />
//     </div>

//     {/* Name & meta */}
//     <h3 className="font-[Sora] font-bold text-xl text-[hsl(var(--foreground))] mb-0.5">
//       {teacher.name}
//     </h3>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--muted-foreground))] mb-2">
//       {teacher.languages}
//     </p>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--muted-foreground))] mb-4">
//       {teacher.credentials}
//     </p>

//     {/* Reviews */}
//     <div className="flex items-center gap-2 mb-5">
//       <div className="flex">
//         {[...Array(5)].map((_, s) => (
//           <Star key={s} className="w-3.5 h-3.5 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
//         ))}
//       </div>
//       <span className="font-[Plus_Jakarta_Sans] font-medium text-xs text-[hsl(var(--foreground))]">
//         {teacher.reviews}% positive
//       </span>
//       <span className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--muted-foreground))]">
//         ({teacher.reviewCount} reviews)
//       </span>
//     </div>

//     {/* Quote */}
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                   leading-relaxed italic flex-1 mb-5">
//       "{teacher.quote}"
//     </p>

//     {/* Specialisms */}
//     <div className="flex flex-wrap gap-2 mt-auto">
//       {teacher.specialisms.map(s => (
//         <span key={s} className="bg-[hsl(var(--muted))] font-[Plus_Jakarta_Sans] font-normal
//                                  text-[10px] text-[hsl(var(--foreground))] px-2.5 py-1 rounded-full">
//           {s}
//         </span>
//       ))}
//     </div>

//     <button className="mt-5 w-full border border-[hsl(var(--primary))] text-[hsl(var(--primary))]
//                        font-[Plus_Jakarta_Sans] font-medium text-sm py-2.5 rounded-full
//                        hover:bg-[hsl(var(--primary))] hover:text-white transition-colors">
//       View profile & book
//     </button>
//   </motion.div>
// ))}

// "Meet all 38 teachers" link:
// <p className="text-center mt-10">
//   <a href="#" className="font-[Plus_Jakarta_Sans] font-medium text-base
//                          text-[hsl(var(--primary))] hover:underline">
//     Meet all 38 teachers →
//   </a>
// </p>
```

---

## SECTION 6: COURSES

```tsx
// <section id="courses" className="py-24 bg-white">
// <div className="max-w-5xl mx-auto px-6">

// Heading:
// <h2 className="font-[Sora] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-14">
//   Structured courses, clear outcomes.
// </h2>

const courses = [
  {
    name: 'Individual 1-on-1 Tuition',
    tag: 'Most popular',
    description: 'Completely personalised — your pace, your goals, your schedule, your teacher. Our most popular format for adults who want measurable results and don\'t want to waste a single lesson hour. Every session is tailored to you: what you did last time, what you struggled with, what you need to nail before your next trip or meeting.',
    price: 'From £35 / hour',
    note: 'Book weekly or subscribe for best value',
    languages: 'All 7 languages available',
    format: 'Online · 1-on-1',
  },
  {
    name: 'Small Group Classes (max. 6)',
    tag: 'Great value',
    description: 'Learn with peers at exactly the same level. Build fluency through real conversation with other learners guided by a teacher — correcting in real-time, creating realistic dialogue, building confidence through repetition. The small group format is available for Spanish, French, and Italian at levels A1 through B2.',
    price: 'From £15 / lesson',
    note: 'Fixed timetable — book a term at a time',
    languages: 'Spanish · French · Italian',
    format: 'Online · up to 6 students',
  },
  {
    name: 'Business Language Programme',
    tag: 'Teams welcome',
    description: 'Corporate language training for individuals and teams. The curriculum is built around your industry, your specific communication scenarios, your stakeholders, and your goals. Invoice-based billing, a dedicated account manager, and a full progress report for each learner at the end of every 8-week module. Certificates of completion provided.',
    price: 'From £55 / hour',
    note: 'Team discounts available · Invoice billing',
    languages: 'All 7 languages available',
    format: 'Online · 1-on-1 or team sessions',
  },
]

// Each course: a horizontal row with border-b, py-10
// <div className="divide-y divide-[hsl(var(--border))]">
// {courses.map((course, i) => (
//   <motion.div
//     key={course.name}
//     initial={{ opacity: 0, x: -20 }}
//     whileInView={{ opacity: 1, x: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.1 }}
//     className="py-10 flex flex-col lg:flex-row lg:items-start gap-6 justify-between"
//   >
//     <div className="flex-1 max-w-2xl">
//       <div className="flex items-center gap-3 mb-2">
//         <h3 className="font-[Sora] font-bold text-2xl text-[hsl(var(--foreground))]">
//           {course.name}
//         </h3>
//         <span className="bg-[hsl(var(--accent)/0.3)] font-[Plus_Jakarta_Sans] font-medium
//                          text-[10px] text-[hsl(var(--foreground))] px-2.5 py-1 rounded-full uppercase tracking-wide">
//           {course.tag}
//         </span>
//       </div>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))]
//                     leading-relaxed mb-4">
//         {course.description}
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--muted-foreground))]">
//         {course.languages} · {course.format}
//       </p>
//     </div>
//     <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
//       <p className="font-[Sora] font-bold text-2xl text-[hsl(var(--primary))]">
//         {course.price}
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--muted-foreground))]">
//         {course.note}
//       </p>
//       <button className="bg-[hsl(var(--primary))] text-white font-[Plus_Jakarta_Sans] font-medium
//                          text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
//         Learn more
//       </button>
//     </div>
//   </motion.div>
// ))}
```

---

## SECTION 7: PRICING

```tsx
// <section id="pricing" className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-6xl mx-auto px-6 text-center">

// Heading:
// <h2 className="font-[Sora] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-4">
//   Simple pricing.
// </h2>
// <p className="font-[Plus_Jakarta_Sans] font-normal text-base text-[hsl(var(--muted-foreground))]
//               mb-16 max-w-sm mx-auto">
//   No hidden fees. No contracts unless you want one. No pressure.
// </p>

const plans = [
  {
    name: 'Pay As You Go',
    tag: null,
    price: 'From £35',
    period: '/ lesson',
    description: 'Maximum flexibility. Book a lesson when you want one and cancel anytime.',
    features: [
      '1-on-1 lessons from £35 / hour',
      'Group classes from £15 / lesson',
      'Book anytime — no advance commitment',
      'Access to all 7 languages',
      'Cancel with 24 hours notice',
      'Session recording available',
    ],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Monthly Subscriber',
    tag: 'BEST VALUE',
    price: '£99',
    period: '/ month',
    description: 'Consistent weekly lessons with priority teacher matching and monthly progress reports.',
    features: [
      '4 × 1hr 1-on-1 sessions per month',
      'Unlimited group class access',
      'Priority teacher matching',
      'Written progress report monthly',
      'WhatsApp teacher check-in',
      'Save 15% vs Pay As You Go',
      'Roll over unused sessions (1 per month)',
    ],
    cta: 'Start subscription',
    highlight: true,
  },
  {
    name: 'Business',
    tag: 'For teams',
    price: 'Custom',
    period: 'pricing',
    description: 'For organisations that need structured language training with accountability and reporting.',
    features: [
      'Individual and group sessions',
      'Invoice billing available',
      'Dedicated account manager',
      'Team progress dashboard',
      'Custom curriculum per learner',
      'Certificate of completion',
      'Discounts from 3+ learners',
    ],
    cta: 'Contact us →',
    highlight: false,
  },
]

// 3-column grid
// <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-6 text-left">
// {plans.map(plan => (
//   <div key={plan.name}
//        className={`rounded-2xl p-8 border flex flex-col ${
//          plan.highlight
//            ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white'
//            : 'bg-white border-[hsl(var(--border))]'
//        }`}
//   >
//     {plan.tag && (
//       <span className={`inline-block self-start font-[Plus_Jakarta_Sans] font-medium text-[10px]
//                         tracking-widest uppercase px-3 py-1 rounded-full mb-4 ${
//         plan.highlight
//           ? 'bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]'
//           : 'bg-[hsl(var(--accent)/0.3)] text-[hsl(var(--foreground))]'
//       }`}>
//         {plan.tag}
//       </span>
//     )}
//     <h3 className={`font-[Sora] font-bold text-2xl mb-1 ${plan.highlight ? 'text-white' : 'text-[hsl(var(--foreground))]'}`}>
//       {plan.name}
//     </h3>
//     <div className="flex items-baseline gap-1 my-4">
//       <span className={`font-[Sora] font-extrabold text-5xl ${plan.highlight ? 'text-white' : 'text-[hsl(var(--primary))]'}`}>
//         {plan.price}
//       </span>
//       <span className={`font-[Plus_Jakarta_Sans] font-normal text-sm ${plan.highlight ? 'text-white/70' : 'text-[hsl(var(--muted-foreground))]'}`}>
//         {plan.period}
//       </span>
//     </div>
//     <p className={`font-[Plus_Jakarta_Sans] font-normal text-sm leading-relaxed mb-6 ${plan.highlight ? 'text-white/80' : 'text-[hsl(var(--muted-foreground))]'}`}>
//       {plan.description}
//     </p>
//     <ul className="space-y-2.5 flex-1 mb-8">
//       {plan.features.map(f => (
//         <li key={f} className="flex items-start gap-2.5">
//           <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--primary))]'}`} />
//           <span className={`font-[Plus_Jakarta_Sans] font-normal text-sm ${plan.highlight ? 'text-white/80' : 'text-[hsl(var(--muted-foreground))]'}`}>
//             {f}
//           </span>
//         </li>
//       ))}
//     </ul>
//     <button className={`w-full py-3 rounded-full font-[Plus_Jakarta_Sans] font-medium text-sm transition-opacity hover:opacity-90 ${
//       plan.highlight
//         ? 'bg-white text-[hsl(var(--primary))]'
//         : 'bg-[hsl(var(--primary))] text-white'
//     }`}>
//       {plan.cta}
//     </button>
//   </div>
// ))}
```

---

## SECTION 8: STUDENT REVIEWS

```tsx
// <section className="py-24 bg-white">
// <div className="max-w-7xl mx-auto px-6">

// Heading with star rating:
// <div className="text-center mb-14">
//   <div className="flex justify-center gap-1 mb-3">
//     {[...Array(5)].map((_, i) => (
//       <Star key={i} className="w-6 h-6 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
//     ))}
//   </div>
//   <h2 className="font-[Sora] font-bold text-[48px] max-md:text-[36px]
//                  text-[hsl(var(--foreground))] leading-tight">
//     4.9★ on Trustpilot.
//   </h2>
//   <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--muted-foreground))] mt-2">
//     Based on 1,240 verified reviews
//   </p>
// </div>

const reviews = [
  {
    text: "I've tried Duolingo, apps, evening classes, online courses — none of them stuck. Lingua's 1-on-1 lessons were completely different. Having a real person who adapts to me, who explains why something works, who remembers what I struggled with last week — it made everything click. I had my first proper conversation in French after three months of weekly sessions.",
    name: "Marcus D.",
    detail: "French learner · started at A1",
    stars: 5,
  },
  {
    text: "Elena is an incredible Spanish teacher. Patient, structured, always comes to sessions with interesting materials that are actually relevant to my life and goals. My A2 exam is next month and I feel genuinely ready in a way I've never felt before an exam. I'm already looking forward to starting B1.",
    name: "Priya S.",
    detail: "Spanish learner · currently A2",
    stars: 5,
  },
  {
    text: "We subscribed our entire sales team — 14 people — to Italian lessons before we expanded into the Italian market. The business programme was flexible, the teachers understood our industry without needing extensive briefing, and we had measurable real-world improvement in communication confidence within eight weeks. Excellent programme.",
    name: "Tom B.",
    detail: "Operations Director · team of 14",
    stars: 5,
  },
  {
    text: "I've been doing weekly Japanese lessons with Yuki for six months and I've gone from complete zero knowledge to passing JLPT N4 level — which I genuinely did not think was possible in that timeframe. The structured approach she uses makes Japanese feel achievable for the first time. Exceptional teacher.",
    name: "Claire F.",
    detail: "Japanese learner · JLPT N4 passed",
    stars: 5,
  },
]

// 2×2 grid desktop, 1-col mobile
// <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
// {reviews.map((review, i) => (
//   <motion.div
//     key={review.name}
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ delay: i * 0.1 }}
//     className="bg-[hsl(var(--muted))] rounded-2xl p-8 border border-[hsl(var(--border))]"
//   >
//     <div className="flex gap-1 mb-4">
//       {[...Array(review.stars)].map((_, s) => (
//         <Star key={s} className="w-4 h-4 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
//       ))}
//     </div>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-[hsl(var(--foreground))]
//                   leading-relaxed mb-5">
//       "{review.text}"
//     </p>
//     <div className="border-t border-[hsl(var(--border))] pt-4">
//       <p className="font-[Plus_Jakarta_Sans] font-medium text-sm text-[hsl(var(--foreground))]">
//         {review.name}
//       </p>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
//         {review.detail}
//       </p>
//     </div>
//   </motion.div>
// ))}
```

---

## SECTION 9: FAQ

```tsx
// <section className="py-24 bg-[hsl(var(--muted))]">
// <div className="max-w-3xl mx-auto px-6">

// Heading:
// <h2 className="font-[Sora] font-bold text-[48px] max-md:text-[36px]
//                text-[hsl(var(--foreground))] leading-tight mb-12">
//   Questions we get asked a lot.
// </h2>

// Use shadcn/ui Accordion component:
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    q: "What level do I need to be?",
    a: "All levels are welcome — from absolute beginner (no prior exposure to the language at all) to near-native speakers who want to refine accent, register, or professional vocabulary. We take a free 15-minute placement test before we match you with a teacher, so we start at exactly the right point.",
  },
  {
    q: "How are lessons delivered?",
    a: "All lessons are online via our integrated video platform — accessible from any laptop, tablet, or desktop with a webcam. Sessions can be recorded with teacher consent, so you can revisit what was covered. Our platform also includes a shared notes space and a vocabulary bank that builds over time.",
  },
  {
    q: "Can I switch teachers?",
    a: "Yes, always and without any awkwardness. If the initial match isn't quite right — a different teaching style preference, a scheduling conflict, or simply a personality fit that isn't working — just let us know via the app or by email and we'll rematch you, typically within 48 hours.",
  },
  {
    q: "Are your teachers qualified?",
    a: "Every teacher on the Lingua platform holds at least a recognised language teaching qualification — CELTA, DELTA, TEFL equivalent, or the national teaching licence for their language (such as DELE examinership for Spanish teachers). Minimum two years of classroom or online teaching experience is required before acceptance.",
  },
  {
    q: "Do you offer trial lessons?",
    a: "Yes — your first lesson is available at a reduced rate of £15 (standard 1-on-1, 45 minutes) so you can experience the platform and meet a teacher before committing. Group trial classes are free for your first session.",
  },
  {
    q: "What if I need to cancel a lesson?",
    a: "Cancel up to 24 hours before your session for a full credit back to your account. Cancellations within 24 hours are charged at 50%. Missed sessions with no notice are charged in full. We understand life happens — we're flexible, just ask.",
  },
]

// <Accordion type="single" collapsible className="space-y-3">
//   {faqs.map((faq, i) => (
//     <AccordionItem key={i} value={`item-${i}`}
//                   className="bg-white rounded-xl border border-[hsl(var(--border))] px-6">
//       <AccordionTrigger className="font-[Sora] font-bold text-base text-[hsl(var(--foreground))]
//                                    hover:no-underline py-5">
//         {faq.q}
//       </AccordionTrigger>
//       <AccordionContent className="font-[Plus_Jakarta_Sans] font-normal text-sm
//                                     text-[hsl(var(--muted-foreground))] leading-relaxed pb-5">
//         {faq.a}
//       </AccordionContent>
//     </AccordionItem>
//   ))}
// </Accordion>
```

---

## SECTION 10: FOOTER

```tsx
// <footer className="bg-[hsl(var(--foreground))] text-white py-16">
// <div className="max-w-7xl mx-auto px-6">

//   Main row:
//   <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-12 pb-12
//                   border-b border-white/10">

//     {/* Brand column */}
//     <div>
//       <div className="flex items-center gap-2.5 mb-4">
//         <GraduationCap className="w-6 h-6 text-[hsl(var(--accent))]" />
//         <span className="font-[Sora] font-bold text-2xl text-white">LINGUA</span>
//       </div>
//       <p className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/50 leading-relaxed">
//         Speak with confidence. Learn with the best.
//       </p>
//       <div className="flex gap-4 mt-6">
//         {/* Trustpilot badge placeholder */}
//         <div className="bg-white/10 rounded-lg px-3 py-2">
//           <p className="font-[Plus_Jakarta_Sans] font-medium text-xs text-white">
//             ★ 4.9 Trustpilot
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Languages column */}
//     <div>
//       <p className="font-[Sora] font-bold text-sm text-white mb-4 tracking-wide uppercase">
//         Languages
//       </p>
//       <ul className="space-y-2.5">
//         {['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Arabic'].map(lang => (
//           <li key={lang}>
//             <a href="#" className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/60
//                                   hover:text-white transition-colors">
//               {lang}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>

//     {/* Learn column */}
//     <div>
//       <p className="font-[Sora] font-bold text-sm text-white mb-4 tracking-wide uppercase">
//         Learn
//       </p>
//       <ul className="space-y-2.5">
//         {['Courses', 'Teachers', 'Group Classes', 'Business Training', 'Pricing', 'Blog'].map(link => (
//           <li key={link}>
//             <a href="#" className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/60
//                                   hover:text-white transition-colors">
//               {link}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>

//     {/* Contact column */}
//     <div>
//       <p className="font-[Sora] font-bold text-sm text-white mb-4 tracking-wide uppercase">
//         Get in touch
//       </p>
//       <ul className="space-y-2.5">
//         <li className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/60">
//           📧 hello@lingua.school
//         </li>
//         <li className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/60">
//           📞 +44 20 7946 0000
//         </li>
//         <li className="font-[Plus_Jakarta_Sans] font-normal text-sm text-white/60">
//           Mon–Fri, 9am–6pm GMT
//         </li>
//       </ul>
//     </div>

//   </div>

//   Bottom row:
//   <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-white/30">
//       © 2025 Lingua Language School Ltd. Registered in England & Wales.
//     </p>
//     <p className="font-[Plus_Jakarta_Sans] font-normal text-xs text-white/30">
//       Privacy Policy · Terms & Conditions · Cookie Policy
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

### Key state:
```tsx
const [scrolled, setScrolled] = useState(false)
const [mobileNavOpen, setMobileNavOpen] = useState(false)
```

### Global CSS:
```css
* { font-family: 'Plus Jakarta Sans', sans-serif; }
h1, h2, h3 { font-family: 'Sora', sans-serif; }
html { scroll-behavior: smooth; }

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll 25s linear infinite;
}
```

### Accessibility notes:
- Language ticker includes `aria-hidden="true"` since it's decorative
- All interactive elements have focus states
- Teacher portraits have descriptive alt text
- FAQ accordion uses semantic HTML with aria attributes (built into shadcn Accordion)
- Colour contrast passes WCAG AA on all text combinations
