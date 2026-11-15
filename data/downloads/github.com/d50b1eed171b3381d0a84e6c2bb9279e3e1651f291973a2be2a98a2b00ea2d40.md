# How Large Language Models Work

Build this website exactly as described below. Replace the [VARIABLES] with your own values; keep everything else.

## Brief
A single long-scroll interactive explainer for [BRAND] titled "[TOPIC]". One unfinished example sentence, [EXAMPLE_SENTENCE], travels through a pinned SVG stage in eight steps while short caption cards scroll past: the sentence splits into token chips, the chips get numeric ids, the chips fly onto a 2D meaning map with labeled regions, curved attention arcs connect each word to the earlier words it relies on, a bar chart shows the top eight candidate next words, and a temperature slider with a seeded dice roll samples an ending the reader can re-roll. It closes with a five-icon recap strip, a glossary, a short FAQ and a footer. No model runs in the browser: every number is invented, illustrative and stored in one content file.

- Audience: [AUDIENCE]: people who use AI writing tools or hear about them at work and want an honest, visual picture of what happens inside, without math or code.
- Goal: By the end of the page the reader can explain in their own words the five stages (split, embed, attend, predict, sample) and has played with temperature long enough to see why the same prompt can give different answers.
- Tone: Calm, precise and friendly, like a good science magazine. Short sentences, one idea per card, an everyday analogy for each idea, no hype, no jargon without an inline definition. Never names real AI products, labs or people; always says "a language model".

## Stack
- Framework: Vite 5 + React 18 + TypeScript
- Styling: Tailwind CSS 3.4
- Libraries: react, react-dom 18 (MIT), vite 5, @vitejs/plugin-react (MIT), typescript 5 (Apache-2.0), tailwindcss 3.4, postcss, autoprefixer (MIT), gsap 3 (core + ScrollTrigger) (GSAP Standard License (free, commercial use allowed)), lucide-react (ISC), @fontsource-variable/fraunces (OFL-1.1), @fontsource-variable/inter (OFL-1.1), @fontsource-variable/jetbrains-mono (OFL-1.1)
- Build: `npm run build` → static files in `dist/`. No backend, no server code, no external APIs.
- Setup:
  - Scaffold with the Vite react-ts template; single entry index.html with <title>[BRAND] · [TOPIC]</title> and <link rel="icon" href="./favicon.svg">.
  - vite.config.ts: base './', build.sourcemap false, build.outDir 'dist', default minification.
  - Import the three Fontsource variable packages once in src/main.tsx; register gsap ScrollTrigger once there with gsap.registerPlugin(ScrollTrigger).
  - Define all colors as space-separated RGB CSS variables in src/index.css under :root (light) and [data-theme="dark"] (dark); map them in tailwind.config.ts theme.extend.colors as rgb(var(--x) / <alpha-value>). Tailwind darkMode: ['selector', '[data-theme="dark"]'].
  - tailwind.config.ts fontFamily: display ['Fraunces Variable', 'Georgia', 'serif'], sans ['Inter Variable', 'system-ui', 'sans-serif'], mono ['JetBrains Mono Variable', 'ui-monospace', 'monospace'].
  - Keep every piece of copy and data in src/content.ts: hero text, the eight step captions with analogies and glossary terms, the tokens array (text, id, category, mapX, mapY), ghost words, regions, attention rows, candidates (word, probability, continuation), recap labels, glossary, FAQ and footer text. Components only read from it. When the variable values change, rewrite the copy and regenerate all data in this file to fit the new example; keep the same shapes and counts.
  - Put the sampler in src/lib/sampler.ts: mulberry32(seed) PRNG, applyTemperature(probs, T) computing softmax(ln(p_i) / T), and sample(probs, r) returning the index where the cumulative sum first exceeds r.
  - Components: Header, Hero, Scrolly (StepCard list + Stage), Stage layers TokenLayer, MapLayer, AttentionLayer, BarsLayer, TemperatureControls, then Recap, Glossary, Faq, Footer. One useReducedMotion hook reading matchMedia('(prefers-reduced-motion: reduce)').
  - Stage animation model: React state activeStep (0-7) set by one ScrollTrigger per StepCard (start 'top 60%', end 'bottom 60%', onToggle when isActive). Each step change runs a GSAP timeline that tweens SVG attributes and transforms from the current state to that step's target state (overwrite: 'auto'), so scrolling backwards works the same as forwards.
  - Theme: on load read localStorage key 'theme' inside try/catch, fall back to prefers-color-scheme; set data-theme on <html>; the header toggle writes it back inside try/catch.

## Variables
- [BRAND] — Publication or series name (default: "Lantern Guides"). The invented publisher of the explainer, shown in the header wordmark, hero kicker and footer.
- [TOPIC] — Explainer headline (default: "How a language model picks the next word"). The question the page answers; used as the hero headline and in the <title>.
- [EXAMPLE_SENTENCE] — Unfinished example sentence (default: "After a rainy walk, the sleepy dog curled up by the"). The input that travels through every step. Pick one that splits into 12-16 tokens, contains at least one word that breaks into two pieces, and has an obvious but not certain next word.
- [AUDIENCE] — Who the page is for (default: "curious readers with no engineering background"). Sets the vocabulary and analogies of every caption.
- [CREDIT] — keep a small "Template by VibeFather" link to https://vibefather.ai/t/how-large-language-models-work in the footer (default: yes; delete this line to remove it)

The copy under Pages & Sections is written for the default values. If your values differ, rewrite every headline, paragraph, label and image for them — same length, tone and structure. Layout, colors, type and motion stay as described.
Keep all copy, image paths and links in one content file (for example `src/content.ts`), keyed by section, so the content can be swapped later without touching components.

---
**This is the public part of a VibeFather Pro prompt.** The page sections, layout, motion and asset instructions that make the live demo look the way it does are for Pro members: https://vibefather.ai/templates/how-large-language-models-work?utm_source=github&utm_medium=readme&utm_campaign=awesome-vibe-coding-websites&utm_content=pro-prompt
— Prompt by VibeFather · https://vibefather.ai/t/how-large-language-models-work · CC BY-NC 4.0 (non-commercial; commercial use needs a VibeFather Pro license) · Request removal: https://vibefather.ai/takedown
