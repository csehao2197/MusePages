# Portfolio Site — Product Requirements Document

## Overview

A single-page portfolio website for a frontend engineer, using a **magazine/editorial** visual style. The site uses grid-based layouts, a case-study-driven project showcase, and a storytelling approach to presenting skills and experience. It should feel like a curated publication — typography-forward, warm, and deliberately composed.

---

## Goals

- Present professional identity, skills, and work in a polished editorial format
- Provide a memorable first impression through an interactive, cursor-driven hero
- Make it easy for recruiters, collaborators, and peers to understand expertise and get in touch
- Offer an inline resume view with download option

---

## Target Audience

- Hiring managers and recruiters at tech companies
- Potential collaborators and clients
- Fellow engineers and the broader tech community

---

## Site Structure

**Format:** Single-page scrolling site with anchor-based navigation

---

### Navigation Bar (sticky)

- Name or logo mark (scrolls to top on click)
- Anchor links: About, Experience, Projects, Contact, Resume
- "View Resumé" button styled as a CTA (scrolls to Resume section)
- Collapses to hamburger menu on mobile

---

### Section 1 — Hero

**Purpose:** Immediate introduction and strong first impression.

- **Layout:** Full-viewport height, asymmetric editorial grid
- **Headline:** Name + concise tagline (e.g. "Frontend Engineer & UI Craftsman")
- **Subtext:** 1–2 sentence elevator pitch
- **Interactive motion:** Cursor-driven effects — elements react to mouse movement (parallax layers, subtle distortion, or following shapes). Should feel responsive and alive without being distracting.
- **Scroll cue:** Subtle animated indicator to scroll down

---

### Section 2 — About Me

**Purpose:** Personal narrative and professional background.

- **Layout:** Two-column split — text alongside a professional/candid portrait photo with editorial cropping
- **Content:** 2–3 paragraphs covering background, what drives you, and your approach to frontend work
- **Optional detail:** Pull quote or highlighted statement in serif type for editorial flavor
- **Tone:** Professional and polished — confident, clear, corporate-friendly

---

### Section 3 — Skills & Experience

**Purpose:** Integrated view of technical competencies and work history.

- **Layout:** Two or three column grid with clean typographic hierarchy
- **Tech stack:** Grouped by category (Languages, Frameworks, Tools, etc.) — displayed as a typographic list or minimal icon grid. No progress bars.
- **Work history:** Compact timeline integrated alongside skills — company name, role, dates, 1-line description
- **Treatment:** The skills and experience should read as one cohesive section, not two disconnected lists

---

### Section 4 — Projects / Case Studies

**Purpose:** Showcase 3–4 curated projects with depth.

- **Layout:** Editorial grid with varying card sizes for visual hierarchy
- **Card contents:** Thumbnail image, project title, short description, tech tags
- **Interaction:** Clicking a card expands it **inline** to reveal the full case study below the card
- **Case study format per project:**
  1. **Context** — What was the project and why did it exist?
  2. **Role & Approach** — What did you do and how?
  3. **Outcome** — Results, metrics, or learnings
  4. **Stack** — Technologies used
  5. **Links** — Live site and/or GitHub repo
- **Collapse:** Expanded cards can be collapsed back to their summary state

---

### Section 5 — Contact

**Purpose:** Make it easy to start a conversation.

- **Layout:** Centered, generous whitespace
- **Heading:** Clear CTA (e.g. "Let's work together")
- **Calendly embed or link:** Scheduling link for booking a call — prominent placement
- **Email:** Mailto link as a secondary option
- **Social links:** GitHub and LinkedIn — icon row
- **Tone:** Inviting but professional

---

### Section 6 — Resume

**Purpose:** Let visitors view the full resume without downloading.

- **Layout:** Full-width section, centered PDF embed
- **Content:** Single-page resume PDF displayed inline (rendered via embedded viewer or image fallback)
- **Download button:** Prominent "Download PDF" button next to or below the resume
- **Placement:** Last content section before the footer
- **Note:** The hero CTA "View Resumé" and the nav "Resume" link both scroll to this section

---

### Footer

- Copyright notice
- Repeat social links (GitHub, LinkedIn)
- Optional "Built with Next.js" credit

---

## Design Direction

### Visual Style: Magazine / Editorial

- **Typography-driven:** Large serif headings, clean sans-serif body text, strong hierarchy through size and weight contrast
- **Grid-based layouts:** Asymmetric grids, varied column spans, intentional whitespace
- **Smart neutral palette:** Cream warmth, deep blue accent, muted sage secondary — modern and clean
- **Photography & imagery:** High-quality project screenshots treated editorially — creative crops, overlaps, bleeds
- **Minimal UI chrome:** No heavy borders, drop shadows, or ornamental elements. Content and type carry the design.

### Color Palette

| Role       | Value                                        |
| ---------- | -------------------------------------------- |
| Background | Off-white / warm cream (#FAFAF5)             |
| Text       | Near-black / charcoal (#1A1A1A)              |
| Accent     | Deep matte blue (#1E3A5F)                    |
| Secondary  | Muted sage (#8B9D8B)                         |
| Subtle     | Light warm gray for dividers/cards (#EDEAE5) |

### Typography

| Role        | Direction                                             |
| ----------- | ----------------------------------------------------- |
| Headings    | Serif typeface (e.g. Playfair Display, DM Serif Text) |
| Subheadings | Sans-serif (e.g. Inter, DM Sans) for contrast         |
| Body        | Sans-serif, same family as subheadings                |
| Accents     | Monospace for tech tags or code references            |

---

## Features

### Interactive Hero

- Cursor-driven parallax or distortion effects on hero elements
- Elements (shapes, layers, or text) respond to mouse position
- Fallback to static layout on touch devices
- Should feel subtle and sophisticated, not gimmicky

### Scroll Animations (Subtle)

- Gentle fade-in and slight slide-up for sections and elements as they enter the viewport
- Smooth anchor scrolling between sections
- Light hover interactions on project cards and links
- Implemented via CSS animations + Intersection Observer or Framer Motion

### Inline Resume View

- Resume section near the bottom of the page displays the PDF inline
- "View Resumé" CTA in both the hero and nav scrolls to this section
- "Download PDF" button alongside the inline view for offline access
- PDF rendered via embedded viewer or high-quality image fallback
- Button styled distinctly from navigation links (outlined or filled accent color)

### Inline Project Expansion

- Clicking a project card smoothly expands it to reveal case study content
- Animation should be smooth (height transition or accordion-style)
- Only one project expanded at a time (others collapse)
- Close/collapse control clearly visible

---

## Responsive Behavior

| Breakpoint | Behavior                                                                            |
| ---------- | ----------------------------------------------------------------------------------- |
| Desktop    | Full editorial grid layouts, multi-column sections, cursor effects active           |
| Tablet     | Simplified 2-column grids, adjusted spacing, cursor effects reduced                 |
| Mobile     | Single-column stack, hamburger nav, touch-friendly targets, cursor effects disabled |

---

## Tech Stack

| Layer      | Choice                        |
| ---------- | ----------------------------- |
| Framework  | React + Next.js (App Router)  |
| Styling    | Tailwind CSS                  |
| Animation  | Framer Motion                 |
| Deployment | Vercel                        |
| Resume PDF | Static file in /public        |
| Calendly   | Embed widget or external link |

---

## Non-Functional Requirements

- **Performance:** Lazy-load images, minimal JS bundle, target 90+ Lighthouse score
- **SEO:** Semantic HTML, meta tags, Open Graph tags for social sharing
- **Accessibility:** WCAG 2.1 AA, keyboard navigation, screen reader support, reduced-motion media query respected
- **Browser support:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

---

## Out of Scope (v1)

- Blog / articles section
- CMS integration
- Dark / light mode toggle
- Analytics dashboard
- Multi-language support
- Contact form (using Calendly + email instead)

---

## Next Steps

1. Review and finalize this PRD
2. Generate mockups using Google Stitch (see `STITCH_PROMPTS.md`)
3. Finalize design decisions based on mockups (exact colors, fonts, spacing)
4. Choose remaining tech stack decisions (styling, deployment)
5. Begin implementation
