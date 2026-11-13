# Kestrel: AI Startup Website Prompt

## 1. Goal
Build a calm, precise site for **Kestrel**, a twelve person AI startup in Shoreditch, London, that drafts replies to customer support tickets using a company's own help docs and past answers. A genuinely dark site: near black ground, warm off white type, one electric lime accent used sparingly, and a mono font as the second voice. The product interface leads the page, built in HTML and CSS, not a screenshot. No glow, no gradient blobs, no neon. Contrast and spacing do the work.

## 2. Tech Stack
```
React + Vite + TypeScript + Tailwind CSS + Framer Motion (motion/react) + lucide-react
```
Single page. No component libraries. The product UI is static markup with one typing animation.

## 3. Design system
```css
:root {
  --paper: #0A0B0D;         /* near black ground */
  --ink: #EDEDEA;           /* warm off white */
  --accent: #D4FF3A;        /* electric lime, the only colour */
  --on-accent: #0A0B0D;
  --surface: #141519;       /* panels and the product UI */
  --surface-2: #1C1E23;     /* rows inside the UI */
  --muted: #8E9096;
  --line: #26282E;
}
```
Lime appears only on the primary button, the logo dot, the AI label, caret and source markers in the UI, and one hero word. No shadows, separation comes from 1px `--line` borders. Every text colour, including muted text inside the UI, must reach at least 4.5 to 1 against the surface it sits on. No text under 14px, including inside the product mockup.

## 4. Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
```
- **Headings:** Geist 500, clamp(44px, 6.4vw, 96px), line-height 1.0, letter-spacing -0.035em. Sentence case.
- **Body:** Geist 400, 18px, line-height 1.6, max width 60ch
- **Mono layer:** Geist Mono 400, 14px, uppercase, letter-spacing 0.08em, in `--muted`, used for labels, step numbers and the UI meta
- **Prices and numbers:** Geist Mono 500

## 5. Buttons
Thin and exact:
- **Primary:** transparent, 1px lime border, lime text, 6px radius, Geist 500 16px, padding 13px 20px. Hover: fills lime, text turns near black, 0.15s.
- **Secondary:** a plain text link in `--ink` with a trailing `ArrowRight` icon at 16px that moves 3px right on hover. No underline, no box.
- No pills, no solid white buttons, no glow.

## 6. Sections

1. **Navbar:** paper, 64px, 1px bottom line. Wordmark `kestrel` in Geist 600 lowercase left with a small square lime dot before it, links centred in Geist 400 15px, `Sign in` as plain text and primary `Book a demo` on the right.
2. **Hero, centred, product under:** generous top padding (140px). Mono label, then the heading centred across two lines, one sentence, both buttons side by side. Below, with 72px gap, the **product UI** at max-width 1080px, 10px radius, `--surface` with 1px line border:
   - A 44px top bar with `Inbox · 14 open` in mono.
   - Left column 300px: five ticket rows on `--surface-2` (name, subject, time in mono), the second marked with a 2px lime left border.
   - Right pane: the open ticket. The customer's message in a plain block, then a block labelled `KESTREL DRAFT` in lime mono with the reply text, two numbered source markers `[1]` `[2]` in lime linking to doc titles listed below the reply, and a footer row with `Confidence: high` in mono and two small buttons `Edit` and `Approve and send`.
   - When the hero enters view, the draft reply types itself in once over 2.4s, then stays.
3. **One real answer:** paper. Left: mono label and a short heading. Right: the example question in large Geist 400 at 28px, then Kestrel's answer at 20px with its two sources underneath as mono lines. Only text, no panel.
4. **How it works:** three full width rows divided by 1px lines. Each row: a mono step number on the left at 14px, a heading at 32px in the middle column, two sentences on the right.
5. **Guardrails:** `--surface` block with 10px radius inside the page width. Heading left, four rules as a plain list on the right, each prefixed by a small lime square, not an icon.
6. **Pricing:** paper. A real comparison table with two plan columns, Team and Scale, and six feature rows. Prices in Geist Mono at 40px in the header row. A single primary button under each column. A mono note under the table.
7. **A note from the founders:** paper, narrow 640px column, centred. A short letter in Geist 400 20px, signed with two names and roles in mono. No photo.
8. **Footer:** a single line. Wordmark left, four links, `© 2026 Kestrel Labs Ltd, London` on the right in mono.

## 7. Motion
- Hero text fades up 12px, 0.6s. The product UI rises 24px and fades in 0.2s later.
- The draft reply types character by character once with a lime block caret.
- Respect `prefers-reduced-motion`: the reply appears fully written, no typing.

## 8. Responsive
- **Mobile under 768px:** heading at 44px, buttons stack full width. In the product UI the ticket list is hidden and only the open ticket shows, with a mono `← Inbox` link on top. One real answer stacks. How it works rows stack number, heading, text. The pricing table becomes two stacked plan blocks listing their own features. The navbar shows the wordmark and a `Menu` text button.
- **Desktop:** max-width 1160px, section padding 128px.

## 9. Full copy

**Name:** Kestrel
**Nav:** Product, How it works, Security, Pricing, Company. Links: `Sign in` · Button: `Book a demo`

**Hero**
- Label: `AI DRAFTS FOR SUPPORT TEAMS`
- Heading: `Every ticket answered from what your team already knows.` (set "already" in lime)
- Text: `Kestrel reads your help centre, macros and two years of past replies, then drafts an answer to each new ticket with its sources attached. Your agents approve, edit or bin it.`
- Buttons: `Book a demo` · Link: `See a live inbox`

**Product UI content**
- Tickets: `Priya Shah` `Refund for a double charge` `09:42` · `Tom Okafor` `Can I change my delivery day?` `09:38` · `Lena Hart` `Export to CSV missing` `09:31` · `Marcus Bell` `Invoice address wrong` `09:20` · `Aiko Mori` `Team seats` `09:02`
- Open ticket from Tom Okafor: `Hi, I am away next Thursday. Can I move my box to Saturday instead?`
- Kestrel draft: `Hi Tom, yes. You can move this week's delivery to Saturday from Account, then Deliveries, up to 23:59 on Tuesday [1]. Saturday slots are 08:00 to 13:00 in your area [2]. Want me to move it for you now?`
- Sources: `[1] Changing your delivery day` · `[2] Weekend delivery areas`
- Meta: `Confidence: high` · Buttons: `Edit`, `Approve and send`

**One real answer**
- Label: `FROM A LIVE CUSTOMER, SHARED WITH PERMISSION`
- Heading: `It says where it got the answer.`
- Question: `Does the annual plan include the API, or is that extra?`
- Answer: `The API is included on the annual Business plan with 50,000 calls a month. On the monthly plan it is an add on at £20 a month.`
- Sources: `Pricing page, section 3` · `Macro: API on annual plans` · `Reply by Hannah, 4 March`

**How it works**
- `01` `Connect your help desk` `Read only access to tickets, macros and your help centre.`
- `02` `Kestrel learns your voice` `It studies how your best agents write, so drafts sound like you and not like a chatbot.`
- `03` `Agents stay in charge` `Nothing is sent without a person pressing approve, until you decide otherwise for simple tickets.`

**Guardrails**
- Heading: `What Kestrel will not do`
- `It never sends a reply on its own unless you switch that on, ticket type by ticket type.`
- `It says "I don't know" and hands over when the docs do not cover the question.`
- `It cites a source for every factual claim, or it does not make the claim.`
- `It never trains on your data for anyone else.`

**Pricing**
- Columns: `Team` `£290 a month` · `Scale` `£990 a month`
- Rows: `Agent seats` `Up to 10` / `Up to 50` · `Drafts a month` `3,000` / `15,000` · `Help desk connections` `1` / `Unlimited` · `Auto send for simple tickets` `No` / `Yes` · `SSO and audit log` `No` / `Yes` · `Support` `Email` / `Named engineer`
- Buttons: `Start a trial`, `Book a demo`
- Note: `Fourteen day trial on Team. Prices exclude VAT.`

**A note from the founders**
`We spent six years answering support tickets before we wrote a line of Kestrel. The answers were almost always already written down somewhere, in a doc, a macro or a reply from last spring. Kestrel finds them, shows its working and lets your team decide. We would rather it said nothing than said something wrong.`
`Ruth Adeyemi, CEO` · `Jonas Kraft, CTO`

**Footer**
`kestrel` · `Security`, `Privacy`, `Careers`, `Status` · `© 2026 Kestrel Labs Ltd, London`

## 10. Never
Glow, gradient blobs, neon, glassmorphism, sparkle icons, robot or brain art, icon grids, made up stats, carousels, pill buttons, a second accent colour, words like "revolutionise", dashes of any kind in the copy, lorem ipsum, `100vh` heroes.

## 11. Dependencies
```json
{ "motion": "^12.0.0", "lucide-react": "^0.460.0", "clsx": "^2.1.0" }
```
