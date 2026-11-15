# Vessel Gallery: Slow Water

Original: `data\prompts\278-art-gallery\278-art-gallery.md`, used in full with `src\workflows\AI Agent\DESIGN.md`.

Standalone HTML/CSS/JavaScript by actual model **gpt-6.1-sol**, public label **GPT-6**. Source: this directory; static export: `out\`. Six original textured SVG artworks, installation illustration, work viewer with cyclic navigation and specific email subjects, artist disclosures, year-filtered archive and visit information.

Browser-only demonstration: Fictional gallery, artists, exhibition programme and contact details. Original digital illustrations are explicitly not physical works by a real artist. No ecommerce, availability database, forms or actual private viewing room. Static system-font adaptation. No environment variables or backend. Original CSS/inline SVG artwork; system fonts. Source rights remain with their authors.

Verification: `node out\pages\278-art-gallery\GPT-6\verify.mjs` (existing Playwright, temporary loopback HTTP). 33 executed assertions including desktop/mobile interactions, static subpath/resources, overflow, disabled registration and preservation. Evidence/captures: `.checks\`. Actual desktop/mobile image-view inspection: Viewed both full-page images: deliberate white-cube negative space, artwork-only colour, original textured landscape studies and restrained wall labels. Mobile single-column works and archive rows remain aligned without clipping.

Public path: `pages\art-gallery\GPT-6\index.html`. Preview is a current 1200×900 browser capture with matching digest. Registered disabled/undeployed. No builds, installs, dist or publication performed.

Final boundary audit: removed an unreferenced copied test script from `out\`; public export now contains only index.html, style.css, app.js and preview.png. Visible source bytes are unchanged from image-view QA. Refreshed real preview/digest and passed 31 further desktop/mobile browser assertions. All helpers stopped.
