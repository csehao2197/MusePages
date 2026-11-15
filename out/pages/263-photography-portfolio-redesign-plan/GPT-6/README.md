# Adrian Vale Photography

From this model folder: `python -m http.server 8080 --bind 127.0.0.1 --directory out` serves the site; `node verify.mjs` reruns QA using the batch-local runner in the Schema Studio sibling folder.

HTML service-selling homepage based on `data\prompts\263-photography-portfolio-redesign-plan\263-photography-portfolio-redesign-plan.md` and `src\workflows\AI Agent\DESIGN.md`. Model `gpt-6.1-sol`; label `GPT-6`.

Source: `index.html`, `style.css`, `app.js`, `assets\`; independent export `out\`. Features: 6-second crossfading hero, pause/reduced-motion support, four alternating service sections, four-image sample gallery, URL-linked project filtering, illustrative testimonials/biography, validated inquiry preview and FAQ. Georgia/Segoe UI are local serif/sans fallbacks for Playfair/DM Sans. Contact is local; no booking or email service. No environment variables.

Photos downloaded from Unsplash image IDs `photo-1487958449943-2429e8be8625`, `photo-1600210492486-724fe5c67fb0`, `photo-1506794778202-cad84cf45f1d`, `photo-1511795409834-ef04bbd61622`. They are illustrative stock, not this fictional studio’s work. Source: images.unsplash.com; terms: https://unsplash.com/license. Original rights apply.

Serve `out\` with static HTTP at `pages/photography-portfolio-redesign-plan/GPT-6/index.html`. Existing Playwright executes `verify.mjs` exported checks; actual screenshots and evidence: `.checks\`. No builds, installs, dist or publication.
