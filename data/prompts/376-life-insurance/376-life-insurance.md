# Thornbury & Reed: Life Insurance Website Prompt

## 1. Goal
Build a sober, document like website for **Thornbury & Reed**, an independent life insurance broker established in 1998. Cool ivory, deep navy ink, one muted gold accent, a Caslon display face.

**This one has no drawn element and no animated centrepiece on purpose.** It is a page of plain type, rules and one real table. A broker sells trust, and trust here looks like a well set document, not a graphic that moves. If you are tempted to add an illustration, do not.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS
```
Framer Motion is optional and should be used for nothing more than a single fade on the headline. No component libraries, no quote engine, no validated forms. Actions are a phone link and an email link.

## 3. Design system
```css
:root {
  --paper: #F2F1ED;
  --ink: #16233B;
  --accent: #9A7B3F;
  --on-accent: #FFFFFF;
  --surface: #E6E5E0;
  --muted: #5C6579;
  --line: rgba(22,35,59,0.15);
  --radius: 4px;
  --panel-radius: 4px;
}
```
Note the small radius. Nothing on this page is a rounded card. Structure comes from hairlines and from the space between blocks.

Section rhythm: light throughout, with exactly one surface tinted block. There is no dark section and no accent panel anywhere on this page.

**Contrast is a requirement, not a preference.** Every text colour, including `--muted` and small captions, must reach at least 4.5 to 1 against the surface it sits on. No text below 14 px.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
```
- **Display:** Libre Caslon Text 400, clamp(34px, 4.2vw, 58px), line-height 1.12, letter-spacing -0.01em. Deliberately smaller than a marketing site. This is a document heading, not a billboard.
- **Body:** Inter 300, 17px, line-height 1.7, set to a 62 character measure. The measure matters more than anything else on this page.
- **Meta layer:** IBM Plex Mono 400, 11px, uppercase. Years, sums, premiums.

## 5. Sections

Eight sections. No more. Each is separated by a hairline and generous space, nothing else.

1. **Navbar**: 64px, ivory, one hairline beneath. Wordmark left in small caps. Four text links right at 14px. **No button anywhere in the navbar.** Instead the phone number sits at the far right in mono, at the same size as the links, with a hairline under it only on hover.
2. **Hero, a paragraph**: no headline block and no photograph. One Caslon sentence at display size, then two body paragraphs at the 62 character measure, then the phone number and an email address as plain underlined links. Min height is whatever the content needs. Do not pad it to fill a screen.
3. **What we arrange**: four cover types as a definition list. Term on the left in Caslon at 20px, two lines of explanation on the right in body. Hairline between each. No cards, no icons, no columns of three.
4. **What it costs**: the one real table on the page, and the reason people are here. Four rows: age and smoking status, cover, term, typical monthly premium. Figures in mono, right aligned, with a hairline under the header row only. Beneath it, one short paragraph about what moves a price.
5. **How we work**: four numbered paragraphs, plainly set, including the awkward truth that honest answers to medical questions are what stop a claim being refused.
6. **Why a broker**: the single surface tinted block on the page. Two short columns: what we do, and what we charge, which is nothing. Set in body text, not as a feature list.
7. **The people**: two names, each with years in the trade and one sentence. Small portraits, 96px square, sitting inline at the start of each paragraph rather than in a grid.
8. **Footer**: quiet. Three short lines at 14px: address, the FCA line, and three links. No giant wordmark, no dark block, no accent band. The page simply ends.

## 6. Motion
One fade on the hero sentence, 16px rise, 0.5 seconds, once. Nothing else moves anywhere on this page. No scroll triggered reveals, no counters, no drawn lines, no hover lifts. Respect `prefers-reduced-motion` by removing even that.

## 7. Responsive
- **Mobile under 768px:** the measure narrows but stays at a comfortable 40 characters. The premium table becomes stacked rows with the premium on the same line as the age. Portraits stay inline. The phone number moves to the top of the hero. No horizontal page scroll and no sticky call bar.
- **Desktop:** content max-width 760px, not 1200px. This is a reading width, and the narrowness is the design.

## 8. Full copy

**Wordmark:** THORNBURY & REED. Meta: `INDEPENDENT LIFE INSURANCE BROKER. ESTABLISHED 1998.`

**Nav:** Cover, Costs, How we work, About. Phone at the right: `01793 555 0142`

**Hero**
- Sentence: `Life insurance is a promise that the mortgage gets paid when you cannot pay it.`
- Paragraph one: `We are an independent broker. We look across the whole market, explain the two or three policies that actually fit, and get paid by the insurer rather than by you.`
- Paragraph two: `Most people need twenty minutes on the phone and one honest conversation. If you already have cover through work and it is enough, we will tell you that and you will never hear from us again.`
- Links: `01793 555 0142` and `hello@thornburyreed.co.uk`

**What we arrange**
- **Level term.** `A fixed amount for a fixed number of years. The simplest and usually the cheapest. Suits families with a mortgage.`
- **Decreasing term.** `Cover falls in step with a repayment mortgage, so you pay for what you owe rather than what you borrowed.`
- **Family income benefit.** `Pays a monthly income to your family instead of one lump sum. Easier to live on, harder to mishandle.`
- **Critical illness.** `Pays out on diagnosis of a listed condition. Costs more and the wording matters more. Worth it if you are self employed with no sick pay.`

**What it costs**
| Age and status | Cover | Term | Typical premium |
|---|---|---|---|
| 30, non smoker | 250,000 GBP | 25 years | 9 GBP a month |
| 35, non smoker | 300,000 GBP | 25 years | 14 GBP a month |
| 40, non smoker | 300,000 GBP | 20 years | 21 GBP a month |
| 45, smoker | 200,000 GBP | 15 years | 46 GBP a month |
Beneath: `These are real quotes from last month, not illustrations. Premiums move with age, health, smoking, weight and occupation. A declined application elsewhere does not mean you are uninsurable, it usually means the wrong insurer was asked.`

**How we work**
- `01` `The call. Twenty minutes. What you owe, who depends on you, and what you already have through work.`
- `02` `The research. We check the whole market and come back with two or three options, with the reasons, in writing.`
- `03` `The application. We fill it in with you. Answer the medical questions honestly, including the awkward ones. A refused claim usually starts here.`
- `04` `The review. Every two years, or whenever your mortgage, job or family changes.`

**Why a broker**
- What we do: `Read the policy wording rather than the summary. Ask insurers about your specific condition before you apply. Handle the medical follow up. Help your family claim, years later, when we have no commercial reason left to care.`
- What we charge: `Nothing. The insurer pays us a commission and you pay the same premium you would pay going direct. If anyone tells you a broker costs extra, they are selling you something else.`

**The people**
- **Alan Thornbury.** `31 years in protection. Will talk you out of cover you do not need, which is why half our enquiries come from people he previously turned away.`
- **Priya Reed.** `18 years, ten of them in underwriting, which is why she knows what gets declined before the application goes in.`

**Footer**
`14 Wood Street, Swindon SN1 4AN. 01793 555 0142.`
`Thornbury & Reed Ltd is authorised and regulated by the Financial Conduct Authority, number 302118.`
Links: `Costs`, `Complaints`, `Privacy`

## 9. Never
Anything that moves except the one hero fade. Illustrations, drawn diagrams, timelines, icons, badges, rounded cards, shadows, gradients, glow, dark sections, accent panels, giant wordmarks, stock photography of families on beaches, countdown timers, stat soup, lorem ipsum, dashes of any kind in the copy, more than two fonts plus the mono layer, `100vh` heroes.

## 10. Dependencies
```json
{ "clsx": "^2.1.0" }
```
