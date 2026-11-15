# Motion Clinic

Inputs: `data\prompts\418-physiotherapist\418-physiotherapist.md` and `src\workflows\AI Agent\DESIGN.md`. Actual model **gpt-6.1-sol**, label **GPT-6**. Build-free HTML/CSS/JS; source here; safe export `out`; expected path `pages/physiotherapist/GPT-6/index.html`.

Clinical blue split hero, original rehab illustration, six condition information dialogs, service selection, care process and date/closure/acknowledgement-checked local appointment outline. Team roles are illustrative, not credentialled people. Credentials, same-week claims and dramatic recovery testimonials are replaced with clear concept context and outcome-neutral copy. Standard appointment duration differs from the proposed 20-minute introduction. All prices/location/hours are examples; availability and suitability require a real provider. No medical advice, diagnosis, booking, data transmission, backend or environment variables.

Serve `out` over HTTP. QA: `node out\pages\418-physiotherapist\GPT-6\verify.mjs`. No builds, installs or publication.

Verified: 34 browser/export assertions and 3 registration/preservation checks. Both desktop and mobile images actually viewed: Viewed both real desktop and mobile images. Bright clinical blue hero, large readable heading, clear service rows and calm SVG illustration work well; mobile stacking, form labels and safety notice are contained and aligned. Evidence: .checks\qa.json and desktop/mobile.png. Registered disabled and undeployed. No build, install, dist or publication.

Final independent audit: 34 additional identity, fingerprint, export, preview, subpath, image, navigation, responsive and console/resource checks passed. Evidence: `.checks\final-audit.json`.
