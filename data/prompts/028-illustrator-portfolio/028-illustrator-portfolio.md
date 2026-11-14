Create a portfolio website for an illustrator named "Maya Torres" that showcases artwork across multiple styles and allows clients to commission work:

1. NAVIGATION BAR
- Name/logo: "Maya Torres" in a hand-lettered style font (or distinctive serif)
- Links: Work, About, Services, Shop, Contact
- Right side: Instagram icon, Behance icon, dark/light mode toggle
- Transparent over hero, turns solid white on scroll
- Mobile: hamburger menu with full-screen overlay

2. HERO SECTION (full-viewport, 100vh)
- Full-bleed hero illustration as background (one of the artist's best editorial pieces)
- Dark gradient overlay from bottom (transparent to rgba(0,0,0,0.6))
- Large name: "Maya Torres" (64px, white, bottom-left positioned)
- Tagline: "Illustrator & Visual Storyteller" (20px, white/80% opacity)
- Scroll indicator: animated down arrow at bottom center
- Subtle parallax effect on the background illustration

3. WORK GALLERY (masonry grid)
- Section title: "Selected Work"
- Filter bar: All (default), Editorial, Book Covers, Branding, Personal, Motion
- Active filter: underline in #E11D48 (rose-600)
- Masonry layout: 3 columns on desktop, mixed aspect ratios
- 18 pieces total (6 shown initially, "Load More" button):

Sample pieces with titles and categories:
- "The Midnight Garden" — Book Covers (portrait, tall)
- "Bloomberg Businessweek: AI Issue" — Editorial (landscape)
- "Fauna Coffee Branding" — Branding (square)
- "Migration Patterns" — Personal (portrait)
- "New Yorker: Urban Solitude" — Editorial (portrait, tall)
- "Dreamscape" — Motion (landscape, shows GIF/video badge)
- "Wildflower Herbarium" — Personal (square)
- "HarperCollins: The Lost City" — Book Covers (portrait)
- "Oatly Campaign Illustrations" — Branding (landscape)
- "Creatures of the Deep" — Personal (portrait, tall)
- "Wired Magazine: Quantum Computing" — Editorial (landscape)
- "Luna Tea Packaging" — Branding (square)

- Each tile: artwork fills container, rounded 8px corners
- Hover state: dark overlay with title, category, and "View Project →" link
- Smooth filter transitions with fade animation

4. PROJECT DETAIL OVERLAY (modal or expanded view)
- Triggered by clicking a gallery tile
- Full-width expanded view (max-width 1200px centered)
- Large artwork image(s) — carousel if multiple views
- Right panel:
  - Project title: "Bloomberg Businessweek: AI Issue"
  - Client: "Bloomberg"
  - Category: "Editorial Illustration"
  - Year: "2025"
  - Description: "A series of 4 illustrations exploring the visual language of artificial intelligence for Bloomberg Businessweek's special AI issue."
  - Tools: "Procreate, Photoshop"
  - Additional images in a 2-column sub-grid below
- Close button (X) top-right, ESC to close

5. ABOUT SECTION
- Two-column layout (60% text, 40% photo)
- Photo: Maya in her studio, candid, with warm tones
- Headline: "About Maya"
- Bio text (3 paragraphs):
  - "I'm a freelance illustrator based in Portland, Oregon, creating work that blends the natural world with human emotion..."
  - Years of experience, education (Rhode Island School of Design)
  - Notable clients list: The New Yorker, Bloomberg, HarperCollins, Oatly, Wired
- Stats row below bio:
  - "8+ Years Experience" · "200+ Projects" · "40+ Clients Worldwide"
- "Download Full CV" link

6. SERVICES SECTION
- Headline: "Services & Commissions"
- Three service cards (equal width):

Card 1 — Editorial Illustration:
- Icon: newspaper
- Starting at $800/piece
- "Magazine covers, article illustrations, op-ed visuals"
- Turnaround: 1-2 weeks
- "Inquire" button

Card 2 — Book & Cover Art:
- Icon: book
- Starting at $2,000/project
- "Cover design, interior illustrations, chapter headers"
- Turnaround: 3-6 weeks
- "Inquire" button

Card 3 — Brand Illustration:
- Icon: palette
- Starting at $1,500/project
- "Packaging, campaigns, brand identity illustration systems"
- Turnaround: 2-4 weeks
- "Inquire" button

- Cards: white background, 1px #E5E7EB border, 12px radius
- Below cards: "Looking for something custom? Let's talk." with email link

7. SHOP TEASER
- Headline: "Prints & Originals"
- Horizontal scroll of 4 available prints:
  - Artwork thumbnail (square, 280px)
  - Title: "The Midnight Garden — Limited Print"
  - Edition: "12/50 remaining"
  - Price: "$120"
  - "View in Shop →" link
- "Browse All Prints →" button

8. TESTIMONIALS (horizontal scroll)
- 3 testimonials from clients:
  - "Maya's work brought our cover story to life in ways we couldn't have imagined." — Art Director, Bloomberg Businessweek
  - "She understood our brand ethos immediately and delivered illustrations that feel authentically Oatly." — Creative Director, Oatly
  - "Working with Maya was seamless. The final book cover exceeded our expectations." — Editor, HarperCollins
- Each card: quote, attribution, small client logo
- Auto-scroll with pause on hover

9. CONTACT SECTION
- Headline: "Let's Work Together"
- Two-column layout:
  - Left: contact form
    - Name, email, project type (dropdown: Editorial, Book, Brand, Personal, Other), budget range (dropdown: <$1K, $1K-3K, $3K-5K, $5K+), message textarea
    - "Send Inquiry" button (#E11D48 rose)
  - Right: additional info
    - Email: hello@mayatorres.com
    - Based in: Portland, OR (available worldwide)
    - Response time: Within 48 hours
    - Social links: Instagram, Behance, Dribbble, LinkedIn

10. FOOTER
- "Maya Torres © 2026"
- Links: Privacy Policy, Instagram, Behance
- "Built with love and too much coffee"

Design: Elegant and gallery-focused. Let the artwork breathe. Primary accent: #E11D48 (rose-600) used sparingly for CTAs and active states. Background: white (#FFFFFF) with #FAFAFA section alternation. Text: #1A1A1A for headings, #4B5563 for body. Typography: Playfair Display for headings (artistic, editorial feel), Inter for body text. Minimal UI chrome — the art is the star. Smooth page transitions with subtle fade-ins on scroll.

Responsive: On tablet, work gallery becomes 2 columns. On mobile, single column masonry, about section stacks (photo on top), service cards stack vertically, shop prints become horizontally scrollable cards. Project detail modal becomes full-screen on mobile with swipeable image carousel. Navigation becomes full-screen overlay with large text links.