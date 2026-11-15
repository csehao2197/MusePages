# Fixwell: Good appliances deserve another go

Original: `data\prompts\276-appliance-repair\276-appliance-repair.md`, used in full with `src\workflows\AI Agent\DESIGN.md`.

Standalone HTML/CSS/JavaScript by actual model **gpt-6.1-sol**, public label **GPT-6**. Source: this directory; static export: `out\`. Eight-appliance picker linked to highlighted price rows and preselected enquiry, diagnostic credit explanation, postcode format/area checker, six FAQs and validated repair preview. Original engineer/appliance SVG.

Browser-only demonstration: Fictional provider, illustrative repair ranges, coverage and guarantee terms. No live slots, real booking, payments or verified reviews/registrations. Enquiries remain local. Static system-font adaptation. No environment variables or backend. Original CSS/inline SVG artwork; system fonts. Source rights remain with their authors.

Verification: `node out\pages\276-appliance-repair\GPT-6\verify.mjs` (existing Playwright, temporary loopback HTTP). 43 executed assertions including desktop/mobile interactions, static subpath/resources, overflow, disabled registration and preservation. Evidence/captures: `.checks\`. Actual desktop/mobile image-view inspection: Viewed both full-page images: friendly cobalt engineer/appliance illustration, clear repair picker and fee hierarchy; mobile two-column picker, stacked fee rows and postcode form fit without clipping.

Public path: `pages\appliance-repair\GPT-6\index.html`. Preview is a current 1200×900 browser capture with matching digest. Registered disabled/undeployed. No builds, installs, dist or publication performed.

Final boundary audit: removed an unreferenced copied test script from `out\`; public export now contains only index.html, style.css, app.js and preview.png. Visible source bytes are unchanged from image-view QA. Refreshed real preview/digest and passed 41 further desktop/mobile browser assertions. All helpers stopped.
