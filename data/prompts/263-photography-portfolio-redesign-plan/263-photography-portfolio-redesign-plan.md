# Major Website Redesign

Date: 2026-01-27

## Overview

Transforming the site from a portfolio-focused design to a commercial service-selling site. The portfolio becomes supporting content for credibility while the primary focus shifts to selling photography services.

## Visual Direction

**Aesthetic**: Bold & Confident + Warm & Approachable

**Typography**
- Headings: Playfair Display (bold, commanding serif)
- Body/UI: DM Sans (clean, legible)

**Color Palette**
- Light Background: #FDFCFA (warm off-white)
- Dark Sections: #1e2a3a (deep navy)
- Foreground (on light): #1a1a2e (warm charcoal)
- Foreground (on dark): #FDFCFA (warm off-white)
- Muted Text: #6b7280 (warm gray)
- Accent: #c9a86c (warm gold for CTAs)
- Border: #e5e2dd (warm subtle dividers)

## Page Structures

### Home Page

1. **Hero Section**
   - Full viewport, deep navy background
   - Single full-bleed image with crossfade transitions (1s duration, 5-6s interval)
   - Dot indicators showing current image (clickable)
   - Centered frosted glass card with name, tagline, CTA button
   - CTA: "View Services" (gold) scrolls to Services section

2. **Services Section**
   - 4 horizontal cards: Retail, Marketing/Social Media, Headshots, Events
   - Alternating layout (image left/right)
   - Alternating backgrounds (navy/light)
   - Images clickable to open modal with 4-5 sample images
   - "View Projects →" links to /projects with filter query param

3. **Testimonials Section**
   - Deep navy background
   - 2x2 grid of review cards
   - Cards have warm white background

4. **Featured Portfolio**
   - Light background
   - Keep current masonry grid

### Projects Page

- Updated filters: All, Retail, Marketing/Social Media, Headshots, Events
- URL query param support: `/projects?filter=retail`
- Gold accent for active filter state

### About Page

1. Bio section with portrait (existing)
2. Camera gear list (existing)
3. Education & Experience (new) - two column layout
4. Personal Hobbies (new) - "Beyond the Lens" section

### Hire Page

1. Contact Form
   - Fields: First Name, Last Name, Email, Website/Social (optional), Photography needs
   - Gold submit button

2. FAQ Accordion (existing)

## Removed Components

- Hero image wall (replaced with single crossfading image)
- Photography Packages section
- Bottom CTA card on Hire page

## Technical Notes

- Services filter maps to project categories
- ImageModal reused for service image galleries
- URL query params for filter deep linking from Services
