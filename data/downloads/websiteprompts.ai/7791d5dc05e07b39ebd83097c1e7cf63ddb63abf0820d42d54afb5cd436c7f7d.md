# Carrier & Kemp: Translation Agency Website Prompt

## 1. Goal
Build a precise, unshowy website for **Carrier & Kemp**, a translation agency that works in eleven languages and refuses machine output. Warm grey paper, near black ink, one ultramarine accent, a clean grotesk, and one signature: a single sentence that re sets itself word by word into another language. Everything on the page should feel like it was proofread, because that is the product.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react)
```
No component libraries, no language switcher, no quote engine. The word swap is a timed array of strings. `lucide-react` only for the arrow glyph.

## 3. Design system
```css
:root {
  --paper: #F4F3F1;
  --ink: #18191B;
  --accent: #2F5BD0;           /* ultramarine */
  --on-accent: #FFFFFF;
  --surface: #E6E5E2;
  --muted: #5C5E60;
  --line: rgba(24,25,27,0.16);
  --radius: 8px;
  --panel-radius: 24px;
}
```
Section rhythm: light, light, surface, dark, light, accent, dark footer. Hairlines instead of cards.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px anywhere on the page.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;600;700&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Schibsted Grotesk 700, clamp(40px, 5.4vw, 78px), line-height 1.02, letter-spacing -0.03em
- **Body:** Inter 300, 16px, line-height 1.65
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase, letter-spacing 0.06em. Rates, turnaround, word counts, index labels.
- No italics except for the language names in the signature element.

## 5. Signature element
**One sentence, re set.** A single line of type at 34px sits centred. It begins in English. Every 2.2 seconds, one word at a time from left to right, it becomes the same sentence in another language, each word crossfading over 0.25 seconds while the line re centres. It passes through four languages and stops on English again.

The sentence is the same meaning every time, never a literal word for word swap, because that is the point of the business. Beneath it a mono caption names the current language.

It runs once per page load, not on a loop.

## 6. Sections, each a different skeleton

1. **Navbar**: 70px, paper, one hairline beneath. Wordmark left, four links right, ultramarine pill with a round arrow circle.
2. **Hero, statement**: one long grotesk sentence starting at one third, mono label `000/ Carrier & Kemp` in the left column, a short paragraph, two actions and three mono facts. No photograph. Min height `clamp(500px, 72vh, 740px)`.
3. **The sentence**: surface. The signature element (section 5) with its caption.
4. **What we translate, Swiss list**: light. Label `001/ Work`, four stacked document types from one third, each with two lines and a mono note about who checks it.
5. **Languages, ruled rows**: light. Eleven languages in three columns of hairline rows, each with a mono note on whether we have a native in house or use a vetted partner. Honest about the difference.
6. **How a job runs, numbered rows**: dark ink ground, inset 16px, `--panel-radius`. Four rows in paper colour with mono timings: the file, the translator, the second pair of eyes, delivery.
7. **Rates and turnaround, table**: light. Four rows: job type, unit, rate, standard turnaround. Figures in mono, right aligned.
8. **Why not machine translation, index**: light. Two ruled columns. Left: where machine output is genuinely fine. Right: where it has cost somebody money, written plainly and without scaremongering.
9. **One quote**: surface. A single centred quote in Schibsted Grotesk at 28px with a signature line in mono.
10. **Send a file, accent panel**: ultramarine ground, inset panel. One line, two actions, a mono note about the free sample paragraph.
11. **Footer**: dark ink. Giant cropped `CARRIER & KEMP` wordmark, address, professional body membership, three small links.

## 7. Motion
- Hero sentence fades up 16px once.
- The sentence re sets word by word, as described, once.
- Language rows fade in with 0.03s stagger.
- Ease `cubic-bezier(.22,1,.36,1)`, respect `prefers-reduced-motion` by showing the English sentence and all four translations stacked beneath it.

## 8. Responsive
- **Mobile under 768px:** hero at 36px from the left margin. The signature sentence drops to 22px and wraps to three lines, re setting line by line rather than word by word. Languages become one column. Rate table becomes stacked rows. No horizontal page scroll.
- **Tablet:** languages in two columns.
- **Desktop:** content max-width 1160px, gutters 40px, section padding 110px.

## 9. Full copy

**Wordmark:** CARRIER & KEMP. Meta: `TRANSLATION. ELEVEN LANGUAGES. HUMAN ONLY.`

**Nav:** Work, Languages, Rates, About. Button: `Send a file`

**Hero** (label `000/ Carrier & Kemp`)
- Sentence: `A translation is not finished when the words are right. It is finished when a native speaker stops noticing it was translated.`
- Paragraph: `Eleven languages, every job read twice, and no machine output passed off as human work. We will tell you when a job does not need us.`
- Actions: `Send a file`, `See rates`
- Facts: `11 LANGUAGES` · `EVERY JOB PROOFREAD BY A SECOND NATIVE` · `ESTABLISHED 2011`

**The sentence** (label `001/ The point`)
- English: `The lease runs until the end of March and cannot be broken early.`
- French: `Le bail court jusqu'à la fin du mois de mars et ne peut être résilié par anticipation.`
- German: `Der Mietvertrag läuft bis Ende März und kann nicht vorzeitig gekündigt werden.`
- Spanish: `El contrato de arrendamiento vence a finales de marzo y no puede rescindirse antes.`
- Caption: `Same meaning, four structures. A machine gets three of these nearly right, and nearly right is what ends up in court.`

**What we translate** (label `002/ Work`)
- **Legal and contracts.** `Leases, terms, employment contracts, court bundles. Translated by a lawyer linguist, then checked.` `CHECKED BY: A SECOND LEGAL TRANSLATOR`
- **Technical and manuals.** `Installation guides, safety sheets, specifications. Glossary agreed with you before we start.` `CHECKED BY: A SUBJECT SPECIALIST`
- **Marketing and brand.** `Transcreation rather than translation. Your tone survives, the jokes get replaced with ones that land.` `CHECKED BY: A NATIVE COPYWRITER`
- **Certified documents.** `Birth certificates, degrees, company filings, with a signed statement of accuracy for the Home Office or a court.` `CHECKED BY: A SWORN TRANSLATOR`

**Languages** (label `003/ Languages`)
French `IN HOUSE` · German `IN HOUSE` · Spanish `IN HOUSE` · Italian `IN HOUSE` · Portuguese `IN HOUSE` · Dutch `IN HOUSE` · Polish `VETTED PARTNER, 9 YEARS` · Czech `VETTED PARTNER, 6 YEARS` · Swedish `VETTED PARTNER, 11 YEARS` · Japanese `VETTED PARTNER, 7 YEARS` · Arabic `VETTED PARTNER, 5 YEARS`
Note: `In house means we employ them. Vetted partner means we have used the same person for years and we name them on your file.`

**How a job runs** (label `004/ Process`)
- `WITHIN 2 HOURS` **The file.** `Send it in any format. We come back with a word count, a price and a date, not a range.`
- `DAY ONE TO THREE` **The translator.** `One named person does the whole document. We never split a file across three people to hit a deadline.`
- `BEFORE DELIVERY` **The second pair of eyes.** `A different native speaker reads it against the original. This is not optional and it is not an upsell.`
- `ON THE DATE` **Delivery.** `In the same format you sent, with the layout intact. Certified work arrives signed and stamped by post as well.`

**Rates and turnaround** (label `005/ Rates`)
| Job | Unit | Rate | Turnaround |
|---|---|---|---|
| General translation | Per source word | 0.12 GBP | 2,000 words a day |
| Legal or technical | Per source word | 0.16 GBP | 1,500 words a day |
| Transcreation | Per hour | 65 GBP | Quoted per project |
| Certified document | Per page | 45 GBP | Two working days |
Note: `Minimum charge 60 GBP. Rush work is 50 per cent more and we will tell you honestly whether it is needed.`

**Why not machine translation** (label `006/ Honest`)
- Machine output is fine for: `Understanding an email you received`, `Internal notes nobody will act on`, `A first pass you are going to have checked anyway`, `Languages where you only need the gist`
- It has cost people money on: `A lease where a negation was dropped`, `A safety sheet where a warning became a recommendation`, `A brand line that was obscene in Dutch`, `A certified document a court refused because no human signed it`

**Quote:** `They sent back our German manual with forty queries about our own English. Half of them were things our engineers had got wrong.`
Signature: `Ingrid Vossen, technical director`

**Send a file panel**
- Line: `Send the file. We will translate the first paragraph free so you can judge the tone before you commit.`
- Actions: `Send a file`, `Ask about a language`
- Mono: `QUOTE BACK WITHIN TWO WORKING HOURS. SAMPLE PARAGRAPH WITHIN ONE DAY.`

**Footer**
`CARRIER & KEMP`, `Suite 4, 18 Mosley Street, Manchester M2 3AQ`, `work@carrierkemp.co.uk`
Mono: `Corporate member of the Institute of Translation and Interpreting since 2013.`
Links: `Work`, `Languages`, `Rates`

## 10. Never
Glassmorphism, gradients, glow, drop shadowed cards, icon grids, emoji, flag icons for languages, typewriter effects that loop, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono meta layer, `100vh` heroes, identical stripes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
