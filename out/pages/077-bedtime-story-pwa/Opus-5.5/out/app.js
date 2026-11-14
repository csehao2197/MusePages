(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 10);
  const KEY = "dreamio-v1", DKEY = "dreamio-draft";
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }, del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } } };
  const view = $("[data-view]");
  const DAY = 864e5;

  /* ---------- seed ---------- */
  const LOOK = { pj: "#B9A7FF", hair: "#4A2E1F", skin: "#F1C7A5" };
  function seed() {
    const now = Date.now();
    const st = (o) => ({ id: uid(), fav: false, images: null, voice: null, track: "", plays: 0, lastPlayed: 0, look: { ...LOOK }, photo: null, ...o });
    return {
      kids: [{ id: "mila", name: "Mila", age: 6, color: "#FFD58A" }, { id: "theo", name: "Theo", age: 4, color: "#B9A7FF" }],
      stories: [
        st({ title: "The Moon Who Lost Her Hum", hero: "Mila", childId: "mila", fav: true, created: now - DAY, track: "musicbox", plays: 3, lastPlayed: now - DAY / 2, look: { ...LOOK }, images: { at: now - DAY, look: { ...LOOK }, photo: null }, voice: { voice: "", style: "soft", instructions: "Pause gently between pages." }, scenes: [
          "Once upon a time, high above the sleepy rooftops, the Moon hummed a soft song every night. It was the song that told the stars it was time to twinkle. But one evening, Mila looked out of her window and noticed the sky was strangely quiet.",
          "“Moon, where is your hum?” Mila whispered. The Moon looked down, a little sad. “I think I dropped it somewhere in the forest,” she said. So Mila slipped on her slippers and tiptoed outside.",
          "In the forest, the tall pines swayed and shared secrets with the wind. A small owl blinked at Mila from a branch. “I heard something humming by the old oak tree,” the owl hooted softly.",
          "Beneath the oak, tucked in the moss of the forest floor, Mila found a tiny silver note, glowing like a firefly. When she held it up, it began to hum: hmm, hmm, hmmm.",
          "Mila climbed the hill and lifted the note toward the sky. Whoosh! It floated up, up, up, all the way home to the Moon. The stars began to twinkle, one by one.",
          "Back in bed, Mila snuggled under her blanket. Above the rooftops, the Moon hummed her soft song again, just for Mila. And as the last star twinkled, Mila drifted off to sleep. Goodnight, Mila."] }),
        st({ title: "Theo and the Sleepy Lighthouse", hero: "Theo", childId: "theo", created: now - 4 * DAY, track: "ocean", plays: 1, lastPlayed: now - 3 * DAY, look: { pj: "#8BE3C0", hair: "#E9B949", skin: "#E3AD86" }, images: { at: now - 4 * DAY, look: { pj: "#8BE3C0", hair: "#E9B949", skin: "#E3AD86" }, photo: null }, scenes: [
          "By the edge of the sea stood a tall striped lighthouse. Every night its big lamp swept across the waves, showing the little boats the way home.",
          "But tonight the lighthouse gave a great big yawn. “I’m so sleepy,” it rumbled. Theo, who lived in the cottage by the shore, heard it and padded down to the beach by the sea.",
          "“I’ll help you stay awake,” said Theo. He sang songs, told jokes, and counted waves. A friendly whale popped up from the sea to listen, blowing a sparkly spout.",
          "Then Theo had an idea. “Little boats,” he called, “light your lanterns!” One by one, tiny golden lights bobbed across the water, guiding each other home.",
          "With all the boats safe, the lighthouse smiled and closed its big eye for a rest. Theo climbed into bed, listening to the waves go hush, hush, hush. Goodnight, Theo."] }),
        st({ title: "Pip and the Cloud Whale", hero: "Pip", childId: "", created: now - 9 * DAY, look: { pj: "#FFD58A", hair: "#7A4B2A", skin: "#F3CFAE" }, scenes: [
          "Pip was a small dreamer with a very big blanket. One windy night, the blanket caught the breeze and carried Pip up into the clouds of the sky.",
          "There, floating like a soft gray island, was a whale made entirely of cloud. “Hello, little one,” she rumbled. “Would you like a ride across the sky?”",
          "Pip held on tight as the cloud whale swam past sleepy planets and blinking stars. Far below, the towns glowed like scattered lanterns.",
          "At last the whale brought Pip gently back home, tucking the big blanket in around Pip’s toes. “Same time tomorrow?” she whispered. But Pip was already asleep."] }),
      ],
    };
  }
  let db = store.get(KEY, null);
  if (!db || !Array.isArray(db.stories) || !Array.isArray(db.kids)) db = seed();
  const save = () => { if (!store.set(KEY, db)) toast("Storage is full. Try removing a photo or an old story"); };
  const story = (id) => db.stories.find((s) => s.id === id);
  const words = (s) => s.scenes.join(" ").split(/\s+/).length;
  const minutes = (s) => Math.max(1, Math.round(words(s) / 2.2 / 60 + s.scenes.length * 0.05));
  const fmtDate = (t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  /* ---------- illustration engine (deterministic SVG storyboards) ---------- */
  let svgN = 0;
  const rng = (seedStr) => { let s = 2166136261; for (const c of String(seedStr)) s = Math.imul(s ^ c.charCodeAt(0), 16777619) >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
  const SKIES = [["#3a2f73", "#8a5d9e", "#f0a27c"], ["#262a68", "#5b4592", "#c47aa6"], ["#1a2052", "#30397f", "#6a5fae"], ["#121844", "#222b69", "#3d4688"], ["#0c1135", "#18205a", "#2c3576"]];
  const setting = (t) => { t = t.toLowerCase(); if (/\b(sea|ocean|boats?|ship|whale|fish|waves?|shore|beach|island|sail|lighthouse)\b/.test(t) && !/\bcloud/.test(t)) return "sea"; if (/\b(castle|king|queen|prince|princess|tower|knight)\b/.test(t)) return "castle"; if (/\b(forest|trees?|woods|pines?|owl|fox|bunny|rabbit|deer|leaf|meadow|oak|moss)\b/.test(t)) return "forest"; if (/\b(clouds?|sky|fly|flew|floated|rocket|space|planets?|balloon)\b/.test(t)) return "sky"; return "hills"; };
  const KINDS = ["dragon", "whale", "bunny", "rabbit", "fox", "owl", "bear", "cat", "dog", "turtle"];
  const kindOf = (t) => { t = t.toLowerCase(); const k = KINDS.find((x) => new RegExp(`\\b${x}s?\\b`).test(t)); return k === "rabbit" ? "bunny" : k || null; };
  function kid(x, y, look, photo, n, sleepy) {
    const head = photo ? `<clipPath id="pc${n}"><circle cx="${x}" cy="${y - 58}" r="17"/></clipPath><circle cx="${x}" cy="${y - 58}" r="18.5" fill="#FFD58A"/><image href="${photo}" x="${x - 17}" y="${y - 75}" width="34" height="34" preserveAspectRatio="xMidYMid slice" clip-path="url(#pc${n})"/>`
      : `<circle cx="${x}" cy="${y - 58}" r="17" fill="${look.skin}"/><path d="M${x - 17} ${y - 58}a17 17 0 0 1 34 0c-6-5-12-7-17-5-5-2-11 0-17 5z" fill="${look.hair}"/>${sleepy ? `<path d="M${x - 9} ${y - 56}q3 3 6 0M${x + 3} ${y - 56}q3 3 6 0" stroke="#3a2a40" stroke-width="1.6" fill="none" stroke-linecap="round"/>` : `<circle cx="${x - 6}" cy="${y - 56}" r="1.9" fill="#3a2a40"/><circle cx="${x + 6}" cy="${y - 56}" r="1.9" fill="#3a2a40"/>`}<circle cx="${x - 10}" cy="${y - 51}" r="2.6" fill="#ff9db5" opacity=".55"/><circle cx="${x + 10}" cy="${y - 51}" r="2.6" fill="#ff9db5" opacity=".55"/><path d="M${x - 3} ${y - 49}q3 2.5 6 0" stroke="#3a2a40" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    return `<g><rect x="${x - 16}" y="${y - 42}" width="32" height="40" rx="12" fill="${look.pj}"/><circle cx="${x - 6}" cy="${y - 30}" r="2" fill="#fff" opacity=".5"/><circle cx="${x + 6}" cy="${y - 20}" r="2" fill="#fff" opacity=".5"/><circle cx="${x - 4}" cy="${y - 12}" r="2" fill="#fff" opacity=".5"/><rect x="${x - 12}" y="${y - 6}" width="9" height="7" rx="3" fill="${look.pj}"/><rect x="${x + 3}" y="${y - 6}" width="9" height="7" rx="3" fill="${look.pj}"/>${head}</g>`;
  }
  function friend(kind, x, y, s = 1) {
    const g = (inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
    const eyes = (dx = 7, ey = -30, c = "#2a2140") => `<circle cx="${-dx}" cy="${ey}" r="2.2" fill="${c}"/><circle cx="${dx}" cy="${ey}" r="2.2" fill="${c}"/>`;
    if (kind === "whale") return g(`<path d="M-70 -20c0-28 30-44 70-40 36 3 58 22 58 44 0 12-10 18-26 18h-80c-14 0-22-8-22-22z" fill="#7aa5e8"/><path d="M-62 -12c18 10 70 12 110 2" stroke="#cfe0ff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M52 -20l26-16-6 22 10 14-28-6z" fill="#6a94d8"/><circle cx="-36" cy="-30" r="3" fill="#1b2250"/><path d="M-48 -18q10 6 20 0" stroke="#1b2250" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-6 -60q-4-14 -12-18M-6 -60q2-16 10-20M-6 -60q-10-6-18-4" stroke="#d6e6ff" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    if (kind === "dragon") return g(`<path d="M-26 0c-8-30 6-52 30-52s36 22 28 52z" fill="#6fcf97"/><ellipse cx="2" cy="-14" rx="16" ry="18" fill="#c8f2d6"/><path d="M-6 -52l5-12 5 12 5-10 4 12" fill="#4fb07c"/><path d="M28 -30c18-14 30-6 30 6-10-4-18-2-26 6z" fill="#4fb07c"/><path d="M-26 -30c-18-14-30-6-30 6 10-4 18-2 26 6z" fill="#4fb07c"/>${eyes(9, -38)}<path d="M-4 -28q4 3 8 0" stroke="#2a2140" stroke-width="1.6" fill="none"/><path d="M26 -4q20 4 22-10" stroke="#6fcf97" stroke-width="7" fill="none" stroke-linecap="round"/>`);
    if (kind === "owl") return g(`<ellipse cx="0" cy="-26" rx="20" ry="26" fill="#9c7656"/><ellipse cx="0" cy="-18" rx="12" ry="14" fill="#d9c0a0"/><circle cx="-8" cy="-36" r="8" fill="#fff"/><circle cx="8" cy="-36" r="8" fill="#fff"/><circle cx="-8" cy="-36" r="3.5" fill="#2a2140"/><circle cx="8" cy="-36" r="3.5" fill="#2a2140"/><path d="M-3 -29l3 5 3-5z" fill="#f2b84b"/><path d="M-18 -46l4 10M18 -46l-4 10" stroke="#9c7656" stroke-width="6" stroke-linecap="round"/>`);
    if (kind === "turtle") return g(`<path d="M-34 -4a34 26 0 0 1 68 0z" fill="#5fae7a"/><path d="M-18 -16l10-8 10 8-10 8zM2 -16l10-8 10 8-10 8z" fill="#4c9466"/><circle cx="40" cy="-12" r="10" fill="#9fd8a9"/><circle cx="43" cy="-14" r="1.8" fill="#2a2140"/>`);
    const P = { bunny: ["#f3eef8", "long", "#ffc2d1"], fox: ["#f08a4b", "tri", "#fff1e0"], bear: ["#a0714f", "round", "#d9b48f"], cat: ["#a9adc4", "tri", "#e6e8f2"], dog: ["#d9a066", "flop", "#f5dcc0"] }[kind] || ["#c9b8ff", "round", "#efe8ff"];
    const [c, ear, belly] = P;
    const ears = ear === "long" ? `<ellipse cx="-8" cy="-66" rx="5" ry="16" fill="${c}"/><ellipse cx="8" cy="-66" rx="5" ry="16" fill="${c}"/><ellipse cx="-8" cy="-66" rx="2.5" ry="11" fill="${belly}"/><ellipse cx="8" cy="-66" rx="2.5" ry="11" fill="${belly}"/>` : ear === "tri" ? `<path d="M-18 -50l4-18 10 12zM18 -50l-4-18-10 12z" fill="${c}"/>` : ear === "flop" ? `<ellipse cx="-17" cy="-46" rx="6" ry="11" fill="#b9814d"/><ellipse cx="17" cy="-46" rx="6" ry="11" fill="#b9814d"/>` : `<circle cx="-14" cy="-56" r="7" fill="${c}"/><circle cx="14" cy="-56" r="7" fill="${c}"/>`;
    const tail = kind === "fox" ? `<path d="M18 -8c22 2 30-14 26-26-4 10-14 14-26 14z" fill="${c}"/><path d="M40 -30c3 6 2 10-2 14" stroke="#fff1e0" stroke-width="5" stroke-linecap="round"/>` : kind === "cat" ? `<path d="M18 -6c20 0 22-22 12-28" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>` : kind === "bunny" ? `<circle cx="20" cy="-10" r="6" fill="#fff"/>` : "";
    return g(`${tail}<ellipse cx="0" cy="-18" rx="21" ry="20" fill="${c}"/><ellipse cx="0" cy="-12" rx="12" ry="11" fill="${belly}"/>${ears}<circle cx="0" cy="-44" r="16" fill="${c}"/>${eyes(6, -46)}<ellipse cx="0" cy="-39" rx="3" ry="2.2" fill="#2a2140"/>`);
  }
  const stars = (r, n, maxY) => Array.from({ length: n }, () => `<circle cx="${(r() * 400).toFixed(1)}" cy="${(r() * maxY).toFixed(1)}" r="${(0.6 + r() * 1.3).toFixed(2)}" fill="#fff" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`).join("");
  const moon = (x, y, rad, sky, n) => `<circle cx="${x}" cy="${y}" r="${rad * 2.6}" fill="#ffd58a" opacity=".08"/><mask id="mm${n}"><rect width="400" height="300" fill="#fff"/><circle cx="${x + rad * 0.45}" cy="${y - rad * 0.25}" r="${rad * 0.92}" fill="#000"/></mask><circle cx="${x}" cy="${y}" r="${rad}" fill="#ffe2a3" mask="url(#mm${n})"/>`;
  const cloud = (x, y, s, c = "#c8c6ec", o = 0.9) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><path d="M-40 10a18 18 0 0 1 8-30 24 24 0 0 1 44-6 18 18 0 0 1 30 14 14 14 0 0 1-4 22z" fill="${c}"/></g>`;
  const pine = (x, y, h, c) => `<path d="M${x} ${y - h}l${h * 0.32} ${h * 0.55}h-${h * 0.12}l${h * 0.2} ${h * 0.45}h-${h * 0.8}l${h * 0.2}-${h * 0.45}h-${h * 0.12}z" fill="${c}"/>`;
  function sceneSVG(s, i, opts = {}) {
    const n = ++svgN, text = s.scenes[i] || "", last = i === s.scenes.length - 1 && s.scenes.length > 1, r = rng(`${s.id}:${i}`);
    const look = s.images?.look || s.look || LOOK, photo = s.images ? s.images.photo : null;
    const sky = SKIES[Math.min(SKIES.length - 1, Math.round((i / Math.max(1, s.scenes.length - 1)) * (SKIES.length - 1)))];
    const label = `Illustration ${i + 1} of ${s.scenes.length}: ${text.slice(0, 90)}`;
    let body = "";
    const grad = `<defs><linearGradient id="sk${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".65" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient><radialGradient id="gl${n}"><stop offset="0" stop-color="#ffd58a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient></defs>`;
    if (opts.plain) return `<svg viewBox="0 0 400 300" role="img" aria-label="Picture not created yet" preserveAspectRatio="xMidYMid slice">${grad}<rect width="400" height="300" fill="url(#sk${n})"/>${stars(r, 40, 220)}${moon(310, 70, 26, sky, n)}<path d="M0 250q100-40 200-10t200-10v70H0z" fill="#141a40"/></svg>`;
    const storyKind = kindOf(s.scenes.join(" ")), kind = kindOf(text) || (storyKind && i > 0 && r() < 0.55 && !last ? storyKind : null);
    if (last) {
      body = `<rect width="400" height="300" fill="#2a2f66"/><rect y="236" width="400" height="64" fill="#1d2150"/><rect x="40" y="40" width="130" height="120" rx="10" fill="url(#sk${n})"/>${`<g clip-path="url(#wc${n})">${stars(r, 18, 160)}</g>`}<clipPath id="wc${n}"><rect x="40" y="40" width="130" height="120" rx="10"/></clipPath>${moon(120, 82, 16, sky, n)}<path d="M105 40v120M40 100h130" stroke="#3b4290" stroke-width="6"/><rect x="40" y="40" width="130" height="120" rx="10" fill="none" stroke="#3b4290" stroke-width="8"/><circle cx="330" cy="120" r="60" fill="url(#gl${n})" opacity=".55"/><rect x="318" y="150" width="24" height="86" rx="4" fill="#3b4290"/><path d="M304 150h52l-10-30h-32z" fill="#ffd58a"/>
        <rect x="150" y="180" width="200" height="64" rx="14" fill="#3b4290"/><rect x="150" y="166" width="22" height="78" rx="8" fill="#4a52a8"/><rect x="328" y="186" width="22" height="58" rx="8" fill="#4a52a8"/><ellipse cx="200" cy="184" rx="30" ry="14" fill="#f4f1ff"/>
        <g transform="rotate(-80 206 196)">${kid(206, 196, look, photo, n, true)}</g><path d="M190 186h150v28a10 10 0 0 1-10 10H200a10 10 0 0 1-10-10z" fill="${look.pj}"/><path d="M190 186h150" stroke="#fff" stroke-opacity=".45" stroke-width="4"/>
        ${storyKind ? `<g opacity=".95">${friend(storyKind === "whale" ? "bear" : storyKind, 112, 238, 0.55)}</g>` : ""}<text x="248" y="150" fill="#ffd58a" font-family="Fraunces, serif" font-size="22" font-weight="600" opacity=".9">z</text><text x="268" y="128" fill="#ffd58a" font-family="Fraunces, serif" font-size="17" font-weight="600" opacity=".7">z</text><text x="284" y="110" fill="#ffd58a" font-family="Fraunces, serif" font-size="13" font-weight="600" opacity=".5">z</text>`;
    } else {
      const set = setting(text), mx = 60 + r() * 280, my = 40 + r() * 40, kx = Math.round(110 + r() * 160);
      body = `<rect width="400" height="300" fill="url(#sk${n})"/>${stars(r, 46, 190)}${moon(mx, my, 20 + r() * 8, sky, n)}`;
      if (set === "sea") {
        const lighthouse = /lighthouse/i.test(s.scenes.join(" ")), boats = /\bboats?|lanterns?|ship|sail/i.test(text);
        body += `${cloud(80 + r() * 60, 90, 0.8, "#8b86c8", 0.35)}<rect y="200" width="400" height="100" fill="#1b2a66"/><path d="M0 200h400" stroke="#2c3d86" stroke-width="3"/>${[214, 232, 252, 274].map((y, k) => `<path d="M${20 + k * 18} ${y}q20-6 40 0t40 0M${220 - k * 14} ${y + 6}q20-6 40 0t40 0" stroke="#33468f" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join("")}<ellipse cx="${mx}" cy="230" rx="18" ry="3" fill="#ffe2a3" opacity=".35"/><ellipse cx="${mx}" cy="246" rx="10" ry="2" fill="#ffe2a3" opacity=".25"/>`;
        if (lighthouse) body += `<path d="M300 202q30-16 70 0z" fill="#121a45"/><path d="M318 200l6-92h24l6 92z" fill="#f4f1ff"/><path d="M320 176h32l-2 14h-28zM323 136h26l-1 14h-24z" fill="#ff8a8a"/><rect x="320" y="94" width="32" height="16" rx="3" fill="${/yawn|sleep|closed|rest/i.test(text) ? "#5b5aa8" : "#ffd58a"}"/><path d="M316 94h40l-20-16z" fill="#ff8a8a"/>${/yawn|sleep|closed|rest/i.test(text) ? "" : `<path d="M336 102L180 70v64z" fill="#ffd58a" opacity=".16"/>`}`;
        if (boats) for (let k = 0; k < 4; k++) { const bx = 40 + k * 70 + r() * 20, by = 214 + r() * 30; body += `<path d="M${bx - 14} ${by}h28l-6 8h-16z" fill="#8a5d3b"/><path d="M${bx} ${by}v-18l10 14z" fill="#f4f1ff"/><circle cx="${bx}" cy="${by - 4}" r="9" fill="url(#gl${n})"/><circle cx="${bx}" cy="${by - 4}" r="2.4" fill="#ffe08a"/>`; }
        body += `<path d="M${kx - 60} 230q60-26 130-4v12H${kx - 60}z" fill="#d9c7a0"/>${kid(kx, 230, look, photo, n)}`;
        if (kind === "whale" || (kind && kind !== "whale")) body += kind === "whale" ? friend("whale", kx > 200 ? 110 : 290, 236, 0.75) : friend(kind, kx + 52, 230, 0.7);
      } else if (set === "sky") {
        body += `${cloud(70, 120, 1.1, "#8b86c8", 0.45)}${cloud(330, 150, 1.3, "#8b86c8", 0.4)}${[0, 1, 2, 3, 4].map(() => `<circle cx="${(r() * 400).toFixed(0)}" cy="${(240 + r() * 50).toFixed(0)}" r="2" fill="#ffd58a" opacity=".8"/>`).join("")}<path d="M0 280q100-20 200 0t200 0v20H0z" fill="#141a40"/>`;
        if (kind === "whale") body += `<g opacity=".95">${friend("whale", 220, 200, 1.15).replace(/#7aa5e8/g, "#d8d6f4").replace(/#6a94d8/g, "#c3c0ea").replace(/#cfe0ff/g, "#fff")}</g>${kid(196, 150, look, photo, n)}`;
        else body += `${cloud(kx + 4, 222, 1.25, "#e2e0f8", 1)}${kid(kx, 208, look, photo, n)}${kind ? friend(kind, kx + 70, 220, 0.6) : ""}`;
      } else if (set === "forest") {
        body += `<path d="M0 210q90-40 200-20t200 0v110H0z" fill="#1d2a5a"/>${Array.from({ length: 7 }, (_, k) => pine(20 + k * 62 + r() * 20, 220, 70 + r() * 40, "#17224d")).join("")}<path d="M0 240q120-24 230-8t170-4v72H0z" fill="#142046"/>${Array.from({ length: 4 }, (_, k) => pine((k < 2 ? 18 + k * 40 : 320 + (k - 2) * 46) + r() * 10, 262, 90 + r() * 30, "#0f1838")).join("")}${Array.from({ length: 7 }, () => `<circle cx="${(80 + r() * 260).toFixed(0)}" cy="${(160 + r() * 80).toFixed(0)}" r="2.2" fill="#e8ff9a" opacity=".85"/>`).join("")}`;
        if (/oak|note|glow/i.test(text)) body += `<circle cx="${kx + 40}" cy="226" r="22" fill="url(#gl${n})"/><path d="M${kx + 36} 230v-12l9-3v12" stroke="#f4f1ff" stroke-width="2.4" fill="none"/><circle cx="${kx + 34}" cy="231" r="3" fill="#f4f1ff"/><circle cx="${kx + 43}" cy="228" r="3" fill="#f4f1ff"/>`;
        body += kid(kx, 262, look, photo, n);
        if (kind) body += kind === "owl" ? `<path d="M${kx - 110} 150h70" stroke="#3b2f2a" stroke-width="6" stroke-linecap="round"/>${friend("owl", kx - 76, 150, 0.8)}` : friend(kind, kx + 60, 262, 0.75);
      } else if (set === "castle") {
        body += `<path d="M0 220q120-40 240-10t160 0v90H0z" fill="#1d2a5a"/><g fill="#141c46"><rect x="250" y="120" width="110" height="100"/><rect x="240" y="96" width="30" height="124"/><rect x="340" y="96" width="30" height="124"/><path d="M236 96l19-26 19 26zM336 96l19-26 19 26z"/><path d="M282 220v-36a23 23 0 0 1 46 0v36z" fill="#0b1132"/></g><rect x="250" y="130" width="9" height="13" rx="4" fill="#ffd58a"/><rect x="350" y="124" width="9" height="13" rx="4" fill="#ffd58a"/><rect x="300" y="140" width="10" height="14" rx="5" fill="#ffd58a"/><path d="M0 250q120-20 220 0t180-10v60H0z" fill="#142046"/>${kid(kx - 40, 256, look, photo, n)}${kind ? friend(kind, kx + 30, 258, 0.85) : ""}`;
      } else {
        const house = /home|house|window|roof/i.test(text);
        body += `${cloud(300, 120, 0.9, "#8b86c8", 0.35)}<path d="M0 220q110-60 220-20t180 0v100H0z" fill="#202d63"/>${house ? `<g><rect x="286" y="168" width="60" height="44" fill="#151d48"/><path d="M280 170l36-26 36 26z" fill="#10173d"/><rect x="300" y="182" width="14" height="14" rx="2" fill="#ffd58a"/><circle cx="307" cy="189" r="18" fill="url(#gl${n})" opacity=".6"/></g>` : ""}<path d="M0 250q140-36 260-10t140 0v60H0z" fill="#15204a"/>${kid(kx, 254, look, photo, n)}${kind ? friend(kind, kx + 62, 256, 0.75) : ""}`;
      }
    }
    return `<svg viewBox="0 0 400 300" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid slice">${grad}${body}</svg>`;
  }

  /* ---------- story composer (local stand-in for the LLM) ---------- */
  const IDEAS = ["a little dragon who is afraid of the dark", "a boat made of moonlight", "a bunny who collects fallen stars", "a whale that swims through the clouds", "a sleepy owl who forgot how to say goodnight", "the lighthouse that wanted a nap"];
  const POOL = {
    sea: ["The waves whispered hush, hush against the shore.", "Silver moonlight danced across the water like a ribbon.", "Somewhere far away, a foghorn hummed a low, cozy note."],
    forest: ["The tall pines swayed and shared secrets with the wind.", "Fireflies blinked on and off like tiny lanterns.", "The moss was soft as a pillow under every step."],
    sky: ["The clouds were as soft as freshly washed pillows.", "Stars blinked hello, one by one.", "The night air smelled of rain and warm milk."],
    castle: ["Up in the tower, a single candle flickered.", "The old stone walls were still warm from the afternoon sun.", "Somewhere a drawbridge creaked a sleepy creak."],
    hills: ["The grass rustled gently, like someone turning pages.", "A cool breeze carried the smell of clover.", "Far away, the windows of the town glowed golden."],
  };
  const FEEL = ["{h} felt brave and warm inside.", "{h} smiled a slow, happy smile.", "{h} took a deep breath of the cool night air.", "Everything felt calm and safe."];
  const LINKS_NP = ["Just past the sleepy hill, {h} discovered {np}.", "Later that night, {h} met {np}.", "Then, from behind a quiet cloud, came {np}.", "Not far away, {h} spotted {np}."];
  const LINKS_CL = ["And then, {cl}.", "Before long, {cl}.", "After a while, {cl}.", "Then something gentle happened: {cl}."];
  const tidy = (p) => p.trim().replace(/[.!?\s]+$/, "").replace(/^\w/, (c) => c.toLowerCase());
  const isNP = (p) => /^(a|an|the|some|two|three|four|five|my|our|his|her|their|one)\b/i.test(p);
  function paragraph(hero, prompt, idx, seedStr) {
    const r = rng(seedStr), pick = (a) => a[Math.floor(r() * a.length)], h = hero, p = tidy(prompt), set = setting(p);
    let lead;
    if (idx === 0) lead = isNP(p) ? `Once upon a time, when the evening sky turned the color of blueberries, ${h} found ${p}.` : `Once upon a time, when the evening sky turned the color of blueberries, ${p.replace(/^(i|we)\b/i, h)}.`;
    else lead = isNP(p) ? pick(LINKS_NP).replace("{h}", h).replace("{np}", p) : pick(LINKS_CL).replace("{cl}", p.replace(/^(i|we)\b/i, h));
    lead = lead.replace(/^\w/, (c) => c.toUpperCase());
    return `${lead} ${pick(POOL[set])} ${pick(FEEL).replace("{h}", h)}`;
  }
  const closing = (hero, lastPrompt) => `When the adventure was done, ${hero} yawned a big, cozy yawn. Back home, ${hero} snuggled under a warm blanket, still thinking about ${isNP(tidy(lastPrompt)) ? tidy(lastPrompt) : "everything that had happened"}. The stars kept watch, and ${hero} drifted off to sleep. Goodnight, ${hero}.`;
  function titleFor(hero, prompts) {
    const np = prompts.map(tidy).find(isNP);
    if (np) { let t = np.replace(/^(a|an|some|one|my|our|his|her|their)\s+/i, "").split(/\s+(?:who|that|which|with|named|made|from)\b|,/)[0].trim(); t = t.split(/\s+/).slice(0, 4).join(" "); return `${hero} and the ${t.replace(/^the\s+/i, "").replace(/\b\w/g, (c) => c.toUpperCase())}`; }
    return `${hero}’s Starry Night`;
  }

  /* ---------- narration (browser speech synthesis stands in for ElevenLabs) ---------- */
  const STYLES = { soft: { label: "Soft & slow (bedtime)", rate: 0.82, pitch: 1 }, whisper: { label: "Whispery calm", rate: 0.72, pitch: 0.9 }, story: { label: "Warm storyteller", rate: 0.92, pitch: 1.05 } };
  const hasTTS = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const voices = () => (hasTTS ? speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)) : []);
  if (hasTTS) speechSynthesis.addEventListener?.("voiceschanged", () => { const sel = $("[data-voice]"); if (sel && sel.options.length < 2) renderRoute(); });
  const Narr = {
    token: 0, timer: 0,
    speak(text, v, onend) {
      this.stop(); const t = ++this.token, st = STYLES[v.style] || STYLES.soft;
      const fallback = () => { if (t !== this.token) return; clearTimeout(this.timer); this.timer = setTimeout(() => t === this.token && onend(), Math.max(3500, text.split(/\s+/).length * 430 / st.rate)); };
      if (!hasTTS) return fallback();
      const u = new SpeechSynthesisUtterance(text); const vo = speechSynthesis.getVoices().find((x) => x.name === v.voice); if (vo) u.voice = vo;
      u.rate = st.rate; u.pitch = st.pitch; let started = false;
      u.onstart = () => { started = true; }; u.onend = () => { if (t === this.token) onend(); }; u.onerror = () => fallback();
      try { speechSynthesis.speak(u); } catch { return fallback(); }
      clearTimeout(this.timer); this.timer = setTimeout(() => { if (!started && t === this.token) { speechSynthesis.cancel(); fallback(); } }, 1600);
    },
    stop() { this.token++; clearTimeout(this.timer); if (hasTTS) try { speechSynthesis.cancel(); } catch { /* ignore */ } },
  };

  /* ---------- soundtrack (procedural Web Audio) ---------- */
  const TRACKS = { musicbox: "Music box lullaby", ocean: "Ocean hush", stars: "Starlight pads" };
  const Music = {
    ctx: null, master: null, key: "", timer: 0, next: 0, step: 0, nodes: [],
    start(key) {
      this.stop(true); if (!key) return;
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) { toast("Music isn't supported in this browser"); return; }
      try { this.ctx ||= new AC(); this.ctx.resume?.(); } catch { return; }
      const c = this.ctx; this.key = key; this.master = c.createGain(); this.master.gain.setValueAtTime(0, c.currentTime); this.master.gain.linearRampToValueAtTime(0.5, c.currentTime + 2); this.master.connect(c.destination);
      this.next = c.currentTime + 0.1; this.step = 0;
      if (key === "ocean") { const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; const src = c.createBufferSource(); src.buffer = buf; src.loop = true; const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 520; const g = c.createGain(); g.gain.value = 0.22; const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.09; lg.gain.value = 0.18; lfo.connect(lg).connect(g.gain); src.connect(f).connect(g).connect(this.master); src.start(); lfo.start(); this.nodes.push(src, lfo); }
      this.timer = setInterval(() => this.tick(), 200); this.tick();
    },
    note(freq, t, dur, type = "triangle", vol = 0.12, attack = 0.01) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); o.connect(g).connect(this.master); o.start(t); o.stop(t + dur + 0.05); },
    tick() {
      const c = this.ctx; if (!c || !this.key) return;
      const hz = (m) => 440 * 2 ** ((m - 69) / 12);
      while (this.next < c.currentTime + 0.6) {
        const t = this.next, s = this.step++;
        if (this.key === "musicbox") { const mel = [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74, 72, 0, 0, 0]; const m = mel[s % mel.length]; if (m) this.note(hz(m), t, 1.8, "triangle", 0.1); if (s % 4 === 0) this.note(hz([48, 43, 45, 41][(s / 4) % 4 | 0]), t, 2.6, "sine", 0.08, 0.05); this.next += 0.56; }
        else if (this.key === "stars") { const ch = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]][s % 4]; ch.forEach((m) => this.note(hz(m), t, 4.6, "sine", 0.06, 1.4)); if (Math.random() < 0.7) this.note(hz(ch[1] + 24), t + 1 + Math.random() * 2, 2, "sine", 0.03, 0.02); this.next += 4; }
        else { if (Math.random() < 0.35) this.note(hz([84, 86, 88, 91][Math.floor(Math.random() * 4)]), t + Math.random(), 2.4, "sine", 0.025); this.next += 2.5; }
      }
    },
    stop(now) {
      clearInterval(this.timer); this.key = ""; const m = this.master, nodes = this.nodes; this.nodes = []; this.master = null;
      if (m && this.ctx) { const t = this.ctx.currentTime; m.gain.cancelScheduledValues(t); m.gain.setValueAtTime(m.gain.value, t); m.gain.linearRampToValueAtTime(0, t + (now ? 0.2 : 0.8)); setTimeout(() => { nodes.forEach((x) => { try { x.stop(); } catch { /* already stopped */ } }); m.disconnect(); }, now ? 300 : 900); }
    },
  };

  /* ---------- router ---------- */
  let playlist = { sort: "new", child: "all" };
  function renderRoute() {
    const h = location.hash.replace(/^#\/?/, ""), [r, id] = h.split("/");
    if (r !== "play") { Narr.stop(); Music.stop(); document.body.style.overflow = ""; }
    $$("[data-nav]").forEach((a) => { if ((a.dataset.nav === "home" && (!r || r === "story")) || a.dataset.nav === r) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    if (r === "create") return renderCreate();
    if (r === "story" && story(id)) return renderStory(story(id));
    if (r === "play" && story(id)) return renderPlayer(story(id));
    renderHome();
  }
  const go = (hash) => { if (location.hash === hash) renderRoute(); else location.hash = hash; };
  addEventListener("hashchange", () => { renderRoute(); view.focus({ preventScroll: true }); scrollTo({ top: 0, behavior: "instant" }); });

  /* ---------- home ---------- */
  const heroOf = (s) => s.hero || "Pip";
  function card(s) {
    const kidC = db.kids.find((k) => k.id === s.childId);
    return `<article class="story" data-story="${s.id}"><div class="cover">${s.images ? sceneSVG(s, 0) : `<div class="nopic">${icon("i-image")}<span>Pictures not created yet</span></div>`}</div>
      <div class="body"><div class="info">${kidC ? `<span class="chip moon">${esc(kidC.name)}</span>` : `<span class="chip">${esc(heroOf(s))}</span>`}<span>${s.scenes.length} pages · ${minutes(s)} min</span>${s.voice ? `<span class="chip ok">${icon("i-voice")}Voice</span>` : ""}</div>
      <h3><a href="#/story/${s.id}">${esc(s.title)}</a></h3>
      <div class="row"><span class="info">${icon("i-clock")}${fmtDate(s.created)}</span><span class="acts"><button type="button" class="icon-btn fav" data-fav="${s.id}" aria-pressed="${!!s.fav}" aria-label="${s.fav ? "Remove from" : "Add to"} favorites: ${esc(s.title)}">${icon("i-heart")}</button><a class="icon-btn" href="#/play/${s.id}" aria-label="Play ${esc(s.title)}" style="background:var(--moon);color:var(--night)">${icon("i-play")}</a></span></div></div></article>`;
  }
  function sorted() {
    let list = db.stories.filter((s) => playlist.child === "all" || (playlist.child === "none" ? !s.childId : s.childId === playlist.child));
    const nm = (s) => (db.kids.find((k) => k.id === s.childId)?.name || "~");
    const by = { new: (a, b) => b.created - a.created, old: (a, b) => a.created - b.created, fav: (a, b) => b.fav - a.fav || b.created - a.created, child: (a, b) => nm(a).localeCompare(nm(b)) || b.created - a.created, played: (a, b) => b.plays - a.plays || b.created - a.created }[playlist.sort];
    return list.sort(by);
  }
  function renderPlaylist() {
    const box = $("[data-grid]"); if (!box) return;
    const list = sorted();
    box.innerHTML = list.length ? list.map(card).join("") : `<div class="empty" style="grid-column:1/-1"><p>No stories here yet.</p><a class="btn sm" href="#/create">${icon("i-plus")}Create New Story</a></div>`;
    $("[data-count]").textContent = `${list.length} ${list.length === 1 ? "story" : "stories"}`;
  }
  function renderHome() {
    const recent = db.stories.slice().sort((a, b) => (b.lastPlayed || b.created) - (a.lastPlayed || a.created))[0];
    view.className = "wrap";
    view.innerHTML = `<section class="hero"><div><p class="eyebrow">Bedtime, made together</p><h1>Little ideas,<br><em>big dreams.</em></h1><p class="lead">Your child dreams up the ideas, Dreamio spins them into a gentle story with pictures, soft narration and a lullaby to drift off to.</p><div class="acts"><a class="btn" href="#/create">${icon("i-plus")}Create New Story</a>${recent ? `<a class="btn ghost" href="#/play/${recent.id}">${icon("i-play")}Play last story</a>` : ""}</div></div>
      ${recent ? `<a class="tonight" href="#/story/${recent.id}" aria-label="Last played: ${esc(recent.title)}" style="text-decoration:none"><div class="art">${sceneSVG(recent, 0, { plain: !recent.images })}</div><div class="meta"><div><span class="chip moon">Last played</span><h2 style="margin-top:8px">${esc(recent.title)}</h2><p>${recent.scenes.length} pages · ${minutes(recent)} min${recent.track ? ` · ${TRACKS[recent.track]}` : ""}</p></div><span class="playbig" aria-hidden="true">${icon("i-play")}</span></div></a>` : ""}</section>
      <section aria-labelledby="pl-h"><div class="sec-h"><div><p class="eyebrow" data-count></p><h2 id="pl-h">Story playlist</h2></div>
        <div class="tools"><div class="seg" role="group" aria-label="Filter by child" data-childf><button type="button" data-cf="all" aria-pressed="${playlist.child === "all"}">All</button>${db.kids.map((k) => `<button type="button" data-cf="${k.id}" aria-pressed="${playlist.child === k.id}">${esc(k.name)}</button>`).join("")}</div>
        <label class="sr" for="sortsel">Sort stories</label><select id="sortsel" class="sortsel" data-sort>${[["new", "Newest first"], ["old", "Oldest first"], ["fav", "Favorites first"], ["child", "By child"], ["played", "Most played"]].map(([v, l]) => `<option value="${v}" ${playlist.sort === v ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
        <div class="grid" data-grid></div></section>
      <section class="how" aria-label="How Dreamio works"><div><span class="n">01</span><b>Dream it up</b><p>Your child shares ideas by typing or talking. Each one becomes a new page.</p></div><div><span class="n">02</span><b>Create pictures</b><p>Every page gets a calm illustration with the same little hero throughout.</p></div><div><span class="n">03</span><b>Add a voice</b><p>Choose a soothing narrator and the slides turn by themselves.</p></div><div><span class="n">04</span><b>Lights out</b><p>Subtitles for little readers, and a lullaby that fades out softly.</p></div></section>`;
    renderPlaylist();
  }
  view.addEventListener("change", (e) => { if (e.target.matches("[data-sort]")) { playlist.sort = e.target.value; renderPlaylist(); } });

  /* ---------- create (chat) ---------- */
  const newDraft = () => ({ heroId: db.kids[0]?.id || "pip", prompts: [], paras: [], msgs: [{ who: "bot", text: "Hello! Who’s the hero tonight, and what should happen first? Type an idea or tap the mic so your child can say it." }] });
  let draft = store.get(DKEY, null) || newDraft();
  const saveDraft = () => store.set(DKEY, draft);
  const heroName = () => db.kids.find((k) => k.id === draft.heroId)?.name || "Pip";
  let busy = false, rec = null;
  function renderCreate() {
    view.className = "wrap";
    const t = draft.paras.length ? titleFor(heroName(), draft.prompts) : "";
    view.innerHTML = `<div class="create"><section class="chat" aria-labelledby="ch-h"><div class="chat-h"><h1 id="ch-h">Create a new story</h1><label class="hero-pick">Hero<select data-hero aria-label="Story hero">${db.kids.map((k) => `<option value="${k.id}" ${draft.heroId === k.id ? "selected" : ""}>${esc(k.name)}</option>`).join("")}<option value="pip" ${draft.heroId === "pip" ? "selected" : ""}>Pip (default character)</option></select></label></div>
      <div class="msgs" data-msgs aria-live="polite">${draft.msgs.map(msgHTML).join("")}</div>
      <div class="ideas" data-ideas aria-label="Idea starters">${IDEAS.filter((x) => !draft.prompts.includes(x)).slice(0, 4).map((x) => `<button type="button" data-idea>${esc(x)}</button>`).join("")}</div>
      <form class="composer" data-compose><label class="sr" for="idea">Story idea</label><textarea id="idea" rows="1" maxlength="240" placeholder="${draft.paras.length ? "What happens next?" : "e.g. a dragon who is afraid of the dark"}"></textarea>
        <button type="button" class="icon-btn" data-mic aria-label="Speak an idea" title="${window.SpeechRecognition || window.webkitSpeechRecognition ? "Speak an idea" : "Voice input isn't supported in this browser"}" ${window.SpeechRecognition || window.webkitSpeechRecognition ? "" : "disabled"}>${icon("i-mic")}</button>
        <button type="submit" class="icon-btn send" aria-label="Add to story">${icon("i-send")}</button></form></section>
      <aside class="draft" aria-labelledby="dr-h"><p class="eyebrow" style="color:#a08c5a">Story draft</p><h2 id="dr-h" data-dtitle>${t ? esc(t) : "Untitled story"}</h2><p class="sub">${draft.paras.length} ${draft.paras.length === 1 ? "page" : "pages"} · starring ${esc(heroName())}</p>
        <div class="pages" data-pages>${draft.paras.length ? draft.paras.map((p, i) => `<p><b>Page ${i + 1}</b>${esc(p)}</p>`).join("") : `<p class="empty-d">Pages appear here as you add ideas. Three or four ideas make a lovely five-minute story.</p>`}</div>
        <div class="acts"><button type="button" class="btn" data-finish ${draft.paras.length ? "" : "disabled"}>${icon("i-check")}Finish story</button><button type="button" class="btn ghost sm" data-restart ${draft.paras.length ? "" : "disabled"}>Start over</button></div></aside></div>`;
    const m = $("[data-msgs]"); m.scrollTop = m.scrollHeight;
  }
  const msgHTML = (m) => m.who === "me" ? `<div class="msg me">${esc(m.text)}</div>` : `<div class="msg bot"><span class="who">${icon("i-spark")}Dreamio</span>${esc(m.text)}${m.para ? `<p class="para">${esc(m.para)}</p>` : ""}</div>`;
  const REPLIES = ["What a lovely idea! Here’s the next page:", "Ooh, I like that. I’ve added this page:", "Wonderful. The story continues:", "That fits perfectly. Here’s what happens:"];
  function addIdea(text) {
    text = text.trim();
    if (busy) return;
    if (text.length < 3) { toast("Add a few words so I can turn it into a page"); return; }
    if (draft.paras.length >= 10) { toast("That’s a long story already. Tap Finish story"); return; }
    busy = true; draft.msgs.push({ who: "me", text }); draft.prompts.push(text); saveDraft(); renderCreate();
    $("[data-msgs]").insertAdjacentHTML("beforeend", `<div class="msg bot" data-typing><span class="typing" aria-label="Writing"><i></i><i></i><i></i></span></div>`);
    setTimeout(() => {
      const para = paragraph(heroName(), text, draft.paras.length, `${draft.prompts.join("|")}`);
      draft.paras.push(para); draft.msgs.push({ who: "bot", text: `${REPLIES[draft.paras.length % REPLIES.length]}`, para });
      if (draft.paras.length === 3) draft.msgs.push({ who: "bot", text: "This is turning into a cozy story. Add another idea, or tap Finish story when you’re ready." });
      busy = false; saveDraft(); renderCreate(); $("#idea")?.focus();
    }, 650);
  }
  function finish() {
    if (!draft.paras.length) return;
    const hero = heroName(), kidC = db.kids.find((k) => k.id === draft.heroId);
    const s = { id: uid(), title: titleFor(hero, draft.prompts), hero, childId: kidC ? kidC.id : "", created: Date.now(), fav: false, images: null, voice: null, track: "musicbox", plays: 0, lastPlayed: 0, look: { pj: kidC?.color || "#FFD58A", hair: "#4A2E1F", skin: "#F1C7A5" }, photo: null, scenes: [...draft.paras, closing(hero, draft.prompts.at(-1))], prompts: draft.prompts.slice() };
    db.stories.unshift(s); save(); draft = newDraft(); store.del(DKEY); toast("Story saved to your playlist"); go(`#/story/${s.id}`);
  }
  view.addEventListener("submit", (e) => { if (e.target.matches("[data-compose]")) { e.preventDefault(); const t = $("#idea"); addIdea(t.value); } });
  view.addEventListener("keydown", (e) => { if (e.target.id === "idea" && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addIdea(e.target.value); } });
  function mic(btn) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return;
    if (rec) { rec.stop(); return; }
    try { rec = new SR(); } catch { toast("Voice input isn't available right now"); return; }
    rec.lang = "en-US"; rec.interimResults = true; const ta = $("#idea"), base = ta.value;
    rec.onresult = (ev) => { ta.value = `${base} ${[...ev.results].map((x) => x[0].transcript).join(" ")}`.trim(); };
    rec.onerror = () => toast("Couldn’t hear that. Try typing instead");
    rec.onend = () => { rec = null; btn.classList.remove("rec"); btn.setAttribute("aria-label", "Speak an idea"); };
    btn.classList.add("rec"); btn.setAttribute("aria-label", "Stop listening"); rec.start();
  }

  /* ---------- story detail ---------- */
  const PJ = ["#B9A7FF", "#FFD58A", "#8BE3C0", "#FF9DB5", "#7FB2FF"], HAIR = ["#4A2E1F", "#7A4B2A", "#E9B949", "#1E1A1A", "#C2562E"], SKIN = ["#F6D6BD", "#F1C7A5", "#E3AD86", "#B97C55", "#7E5034"];
  function renderStory(s) {
    const keep = view.dataset.sid === s.id ? Object.fromEntries(["voice", "style", "instr"].map((k) => [k, $(`[data-${k}]`)?.value])) : {};
    view.dataset.sid = s.id;
    view.className = "wrap";
    const kidC = db.kids.find((k) => k.id === s.childId), vs = voices();
    view.innerHTML = `<a class="back" href="#/">${icon("i-back")}All stories</a>
      <div class="detail-h"><div><p class="eyebrow">${kidC ? `${esc(kidC.name)}’s story` : "Story"}</p><h1 data-title>${esc(s.title)}</h1><div class="info"><span>${s.scenes.length} pages · about ${minutes(s)} min</span><span>Created ${fmtDate(s.created)}</span>${s.images ? `<span class="chip ok">${icon("i-image")}Pictures</span>` : `<span class="chip">No pictures yet</span>`}${s.voice ? `<span class="chip ok">${icon("i-voice")}Narration</span>` : `<span class="chip">Read-aloud</span>`}</div></div>
        <div class="acts"><a class="btn" href="#/play/${s.id}" data-playlink>${icon("i-play")}Play story</a><button type="button" class="icon-btn fav" data-fav="${s.id}" aria-pressed="${!!s.fav}" aria-label="${s.fav ? "Remove from" : "Add to"} favorites">${icon("i-heart")}</button><button type="button" class="icon-btn" data-del="${s.id}" aria-label="Delete story">${icon("i-trash")}</button></div></div>
      <div class="steps">
        <section class="step" aria-labelledby="st1"><h2 id="st1">${icon("i-image")}Pictures</h2><p>${s.images ? `<span class="done">Created ${fmtDate(s.images.at)}.</span> Change the look and recreate anytime.` : "One illustration per page, with the same hero on every page."}</p>
          <div class="looks"><div class="lrow"><span>Pajamas</span>${PJ.map((c) => `<button type="button" class="sw" style="background:${c}" data-look="pj" data-c="${c}" aria-pressed="${s.look.pj === c}" aria-label="Pajamas ${c}"></button>`).join("")}</div><div class="lrow"><span>Hair</span>${HAIR.map((c) => `<button type="button" class="sw" style="background:${c}" data-look="hair" data-c="${c}" aria-pressed="${s.look.hair === c}" aria-label="Hair ${c}"></button>`).join("")}</div><div class="lrow"><span>Skin</span>${SKIN.map((c) => `<button type="button" class="sw" style="background:${c}" data-look="skin" data-c="${c}" aria-pressed="${s.look.skin === c}" aria-label="Skin tone ${c}"></button>`).join("")}</div></div>
          <div class="photo">${s.photo ? `<img src="${s.photo}" alt="Child photo used for the hero's face"><button type="button" class="link" data-rmphoto>Remove photo</button>` : `<label class="btn ghost sm filebtn">${icon("i-camera")}Add child’s photo<input type="file" accept="image/*" data-photo aria-label="Add child's photo (optional)"></label>`}</div>
          <div class="progress" data-iprog hidden><i></i></div>
          <div class="row"><button type="button" class="btn sm" data-mkimg>${icon("i-spark")}${s.images ? "Recreate Images" : "Create Images"}</button></div></section>
        <section class="step" aria-labelledby="st2"><h2 id="st2">${icon("i-voice")}Narration</h2><p>${s.voice ? `<span class="done">Voice ready.</span> Slides turn by themselves during playback.` : "Pick a calm voice and the slides will follow the narration."}</p>
          <div class="vrow"><label class="fld"><span>Voice</span><select data-voice>${vs.length ? vs.map((v) => `<option value="${esc(v.name)}" ${s.voice?.voice === v.name ? "selected" : ""}>${esc(v.name.replace(/^Microsoft |^Google /, ""))}</option>`).join("") : `<option value="">Device default voice</option>`}</select></label><label class="fld"><span>Style</span><select data-style>${Object.entries(STYLES).map(([k, v]) => `<option value="${k}" ${(s.voice?.style || "soft") === k ? "selected" : ""}>${v.label}</option>`).join("")}</select></label></div>
          <label class="fld"><span>Instructions for the narrator</span><textarea data-instr rows="2" maxlength="200" placeholder="e.g. slow down at the end, pause between pages">${esc(s.voice?.instructions || "")}</textarea></label>
          <div class="progress" data-vprog hidden><i></i></div>
          <div class="row"><button type="button" class="btn sm lav" data-mkvoice>${icon("i-voice")}${s.voice ? "Update Voices" : "Generate Voices"}</button><button type="button" class="btn ghost sm" data-preview>Preview</button></div></section>
        <section class="step" aria-labelledby="st3"><h2 id="st3">${icon("i-music")}Soundtrack</h2><p>A quiet track plays under the story. You can switch it off during playback.</p>
          <label class="fld"><span>Background music</span><select data-track><option value="">No music</option>${Object.entries(TRACKS).map(([k, v]) => `<option value="${k}" ${s.track === k ? "selected" : ""}>${v}</option>`).join("")}</select></label>
          <div class="row"><button type="button" class="btn ghost sm" data-listen aria-pressed="false">${icon("i-play")}Listen</button></div></section>
      </div>
      <h2 class="sr">Storyboard</h2><div class="board" data-board>${s.scenes.map((t, i) => `<article class="scene"><div class="pic">${s.images ? sceneSVG(s, i) : `<div class="wait">Picture ${i + 1} not created yet</div>`}</div><p class="txt"><b>Page ${i + 1}</b>${esc(t)}</p></article>`).join("")}</div>`;
    ["voice", "style", "instr"].forEach((k) => { const el = $(`[data-${k}]`); if (el && keep[k] != null && [...(el.options || [{ value: keep[k] }])].some((o) => o.value === keep[k])) el.value = keep[k]; });
  }
  async function makeImages(s, btn) {
    btn.disabled = true; const prog = $("[data-iprog]"); prog.hidden = false;
    const pics = $$(".scene .pic"); pics.forEach((p, i) => (p.innerHTML = `<div class="wait go">Painting picture ${i + 1}…</div>`));
    s.images = { at: Date.now(), look: { ...s.look }, photo: s.photo };
    for (let i = 0; i < s.scenes.length; i++) { await new Promise((r) => setTimeout(r, 320)); pics[i].innerHTML = sceneSVG(s, i); prog.firstElementChild.style.width = `${((i + 1) / s.scenes.length) * 100}%`; }
    save(); toast(`${s.scenes.length} pictures ready`); renderStory(s);
  }
  async function makeVoices(s, btn) {
    btn.disabled = true; const prog = $("[data-vprog]"); prog.hidden = false;
    for (let i = 0; i < s.scenes.length; i++) { await new Promise((r) => setTimeout(r, 180)); prog.firstElementChild.style.width = `${((i + 1) / s.scenes.length) * 100}%`; }
    s.voice = { voice: $("[data-voice]").value, style: $("[data-style]").value, instructions: $("[data-instr]").value.trim() }; save(); toast("Narration ready. Press Play story"); renderStory(s);
  }
  function readPhoto(file, s) {
    if (!file || !/^image\//.test(file.type)) return toast("Please choose an image file");
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const c = document.createElement("canvas"), k = 160 / Math.min(img.width, img.height); c.width = c.height = 160; const x = c.getContext("2d"); x.drawImage(img, (160 - img.width * k) / 2, (160 - img.height * k) / 2, img.width * k, img.height * k); s.photo = c.toDataURL("image/jpeg", 0.82); URL.revokeObjectURL(url); save(); toast("Photo added. Recreate images to use it"); renderStory(s); };
    img.onerror = () => { URL.revokeObjectURL(url); toast("That image couldn't be read"); };
    img.src = url;
  }

  /* ---------- player ---------- */
  let P = null;
  function renderPlayer(s) {
    Narr.stop(); document.body.style.overflow = "hidden";
    P = { s, i: 0, playing: false, subs: store.get("dreamio-subs", true), music: !!s.track, track: s.track || "musicbox", ended: false, layer: 0 };
    s.plays = (s.plays || 0) + 1; s.lastPlayed = Date.now(); save();
    view.className = "";
    view.innerHTML = `<div class="player" data-player role="region" aria-label="Story player: ${esc(s.title)}">
      <div class="p-top"><a class="icon-btn" href="#/story/${s.id}" aria-label="Close player">${icon("i-x")}</a><h1>${esc(s.title)}</h1><span class="chip moon" data-pnum aria-live="polite"></span></div>
      <div class="p-stage"><div class="p-frame"><div class="p-img on" data-l0></div><div class="p-img" data-l1></div><div class="p-end" data-end hidden><div><h2>The End</h2><p>Sweet dreams, ${esc(heroOf(s))}.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px"><button type="button" class="btn" data-again>${icon("i-play")}Play again</button><a class="btn ghost" href="#/">All stories</a></div></div></div></div><p class="p-sub" data-sub></p></div>
      <div class="p-bot"><div class="p-bar" data-bar>${s.scenes.map((_, i) => `<button type="button" data-go="${i}" aria-label="Go to page ${i + 1}"></button>`).join("")}</div>
        <div class="p-ctrl"><button type="button" class="icon-btn" data-prev aria-label="Previous page">${icon("i-left")}</button><button type="button" class="icon-btn main" data-pp aria-label="Play narration" ${s.voice ? "" : "disabled"}>${icon("i-play")}</button><button type="button" class="icon-btn" data-next aria-label="Next page">${icon("i-right")}</button><span class="vsep"></span><button type="button" class="icon-btn" data-cc aria-pressed="${P.subs}" aria-label="Subtitles">${icon("i-cc")}</button><button type="button" class="icon-btn" data-mus aria-pressed="${P.music}" aria-label="Background music">${icon("i-music")}</button><label class="sr" for="trk">Soundtrack</label><select id="trk" data-trk>${Object.entries(TRACKS).map(([k, v]) => `<option value="${k}" ${P.track === k ? "selected" : ""}>${v}</option>`).join("")}</select></div>
        <p class="p-hint" data-hint>${s.voice ? "Press play for narration. Pages turn by themselves." : `Reading aloud yourself? Use the arrows to turn pages. <a href="#/story/${s.id}">Generate voices</a> for automatic narration.`}</p></div></div>`;
    show(0, true);
    if (P.music) Music.start(P.track);
  }
  function show(i, instant) {
    const s = P.s; P.i = Math.max(0, Math.min(s.scenes.length - 1, i)); P.ended = false; $("[data-end]").hidden = true;
    const cur = $(`[data-l${P.layer}]`), nxt = $(`[data-l${1 - P.layer}]`), html = sceneSVG(s, P.i, { plain: !s.images });
    if (instant) { cur.innerHTML = html; } else { nxt.innerHTML = html; nxt.classList.add("on"); cur.classList.remove("on"); P.layer = 1 - P.layer; }
    const sub = $("[data-sub]"); sub.textContent = s.scenes[P.i]; sub.classList.toggle("off", !P.subs); sub.setAttribute("aria-hidden", !P.subs);
    $("[data-pnum]").textContent = `Page ${P.i + 1} of ${s.scenes.length}`;
    $$("[data-go]").forEach((b, k) => { b.classList.toggle("seen", k < P.i); if (k === P.i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    $("[data-prev]").disabled = P.i === 0;
    if (P.playing) narrate();
  }
  function narrate() { const s = P.s, me = P; Narr.speak(s.scenes[P.i], s.voice, () => { if (P !== me || !P.playing) return; setTimeout(() => { if (P !== me || !P.playing) return; if (P.i < s.scenes.length - 1) show(P.i + 1); else end(); }, 1100); }); }
  function setPlaying(on) { if (!P.s.voice) return; P.playing = on; const b = $("[data-pp]"); b.innerHTML = icon(on ? "i-pause" : "i-play"); b.setAttribute("aria-label", on ? "Pause narration" : "Play narration"); if (on) { if (P.ended) show(0); else narrate(); } else Narr.stop(); }
  function end() { P.playing = false; P.ended = true; Narr.stop(); $("[data-end]").hidden = false; const b = $("[data-pp]"); b.innerHTML = icon("i-play"); b.setAttribute("aria-label", "Play narration"); $$("[data-go]").forEach((x) => x.classList.add("seen")); $("[data-again]").focus(); }
  function next() { if (!P) return; if (P.i < P.s.scenes.length - 1) show(P.i + 1); else end(); }
  function prev() { if (P && P.i > 0) show(P.i - 1); }
  document.addEventListener("keydown", (e) => {
    if (!$("[data-player]") || e.target.matches("input, select, textarea")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === " " && !e.target.matches("button, a")) { e.preventDefault(); setPlaying(!P.playing); }
    else if (e.key.toLowerCase() === "c" && !e.ctrlKey && !e.metaKey) $("[data-cc]").click();
    else if (e.key.toLowerCase() === "m" && !e.ctrlKey && !e.metaKey) $("[data-mus]").click();
    else if (e.key === "Escape") go(`#/story/${P.s.id}`);
  });

  /* ---------- shared clicks ---------- */
  view.addEventListener("click", (e) => {
    const b = e.target.closest("button, a"); if (!b) return;
    if (b.dataset.fav) { const s = story(b.dataset.fav); s.fav = !s.fav; save(); b.setAttribute("aria-pressed", s.fav); b.setAttribute("aria-label", `${s.fav ? "Remove from" : "Add to"} favorites${b.closest(".story") ? `: ${s.title}` : ""}`); toast(s.fav ? "Added to favorites" : "Removed from favorites"); if (playlist.sort === "fav" && $("[data-grid]")) renderPlaylist(); return; }
    if (b.dataset.cf) { playlist.child = b.dataset.cf; $$("[data-cf]").forEach((x) => x.setAttribute("aria-pressed", x === b)); renderPlaylist(); return; }
    if (b.hasAttribute("data-idea")) { addIdea(b.textContent); return; }
    if (b.hasAttribute("data-mic")) { mic(b); return; }
    if (b.hasAttribute("data-finish")) { finish(); return; }
    if (b.hasAttribute("data-restart")) { if (confirm("Start over? This clears the current draft.")) { draft = newDraft(); store.del(DKEY); renderCreate(); } return; }
    const s = P && $("[data-player]") ? P.s : story(location.hash.split("/")[2]);
    if (b.dataset.del) { if (confirm(`Delete “${s.title}”? This can't be undone.`)) { db.stories = db.stories.filter((x) => x.id !== s.id); save(); toast("Story deleted"); go("#/"); } return; }
    if (b.dataset.look) { s.look[b.dataset.look] = b.dataset.c; save(); $$(`[data-look="${b.dataset.look}"]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); if (s.images) toast("New look saved. Recreate images to apply it"); return; }
    if (b.hasAttribute("data-rmphoto")) { s.photo = null; save(); renderStory(s); toast("Photo removed from this device"); return; }
    if (b.hasAttribute("data-mkimg")) { makeImages(s, b); return; }
    if (b.hasAttribute("data-mkvoice")) { makeVoices(s, b); return; }
    if (b.hasAttribute("data-preview")) { const first = s.scenes[0].split(/(?<=[.!?])\s/)[0]; Narr.speak(first, { voice: $("[data-voice]").value, style: $("[data-style]").value }, () => {}); toast(hasTTS ? "Previewing the voice" : "Speech isn't supported in this browser"); return; }
    if (b.hasAttribute("data-listen")) { const on = b.getAttribute("aria-pressed") !== "true"; const k = $("[data-track]").value; if (on && !k) { toast("Choose a track first"); return; } b.setAttribute("aria-pressed", on); b.innerHTML = `${icon(on ? "i-pause" : "i-play")}${on ? "Stop" : "Listen"}`; if (on) Music.start(k); else Music.stop(); return; }
    if (!P || !$("[data-player]")) return;
    if (b.hasAttribute("data-next")) next();
    else if (b.hasAttribute("data-prev")) prev();
    else if (b.dataset.go) show(+b.dataset.go);
    else if (b.hasAttribute("data-pp")) setPlaying(!P.playing);
    else if (b.hasAttribute("data-again")) { show(0); if (P.s.voice) setPlaying(true); }
    else if (b.hasAttribute("data-cc")) { P.subs = !P.subs; store.set("dreamio-subs", P.subs); b.setAttribute("aria-pressed", P.subs); const sub = $("[data-sub]"); sub.classList.toggle("off", !P.subs); sub.setAttribute("aria-hidden", !P.subs); }
    else if (b.hasAttribute("data-mus")) { P.music = !P.music; b.setAttribute("aria-pressed", P.music); if (P.music) Music.start(P.track); else Music.stop(); }
  });
  view.addEventListener("change", (e) => {
    const t = e.target, s = story(location.hash.split("/")[2]);
    if (t.matches("[data-hero]")) { draft.heroId = t.value; saveDraft(); renderCreate(); }
    else if (t.matches("[data-photo]")) readPhoto(t.files[0], s);
    else if (t.matches("[data-track]") && s) { s.track = t.value; save(); const l = $("[data-listen]"); if (l?.getAttribute("aria-pressed") === "true") { if (t.value) Music.start(t.value); else l.click(); } toast(t.value ? `${TRACKS[t.value]} selected` : "Music off for this story"); }
    else if (t.matches("[data-trk]") && P) { P.track = t.value; P.s.track = t.value; save(); if (P.music) Music.start(P.track); }
  });

  /* ---------- children ---------- */
  const kdlg = $("[data-kidsdlg]");
  function renderKids() { $("[data-kidlist]").innerHTML = db.kids.map((k) => `<li><span class="av" style="background:${k.color}">${esc(k.name[0])}</span><span class="nm">${esc(k.name)}<small>Age ${k.age} · ${db.stories.filter((s) => s.childId === k.id).length} stories</small></span><button type="button" class="icon-btn" data-rmkid="${k.id}" aria-label="Remove ${esc(k.name)}">${icon("i-trash")}</button></li>`).join("") || `<li><span class="nm muted">No children yet. Stories star Pip.</span></li>`; }
  $("[data-kids]").addEventListener("click", () => { renderKids(); $("[data-kiderr]").textContent = ""; kdlg.showModal(); });
  kdlg.addEventListener("click", (e) => {
    if (e.target === kdlg) return kdlg.close();
    const rm = e.target.closest("[data-rmkid]"); if (rm) { db.kids = db.kids.filter((k) => k.id !== rm.dataset.rmkid); if (playlist.child === rm.dataset.rmkid) playlist.child = "all"; save(); renderKids(); renderRoute(); return; }
    if (e.target.closest("[data-addkid]")) {
      const f = $("[data-kidsform]"), name = f.kname.value.trim(), age = +f.kage.value, err = $("[data-kiderr]");
      if (!name) { err.textContent = "Please enter a name."; f.kname.focus(); return; }
      if (db.kids.some((k) => k.name.toLowerCase() === name.toLowerCase())) { err.textContent = `${name} is already on the list.`; return; }
      if (!(age >= 1 && age <= 12)) { err.textContent = "Age should be between 1 and 12."; return; }
      err.textContent = ""; db.kids.push({ id: uid(), name, age, color: PJ[db.kids.length % PJ.length] }); save(); f.kname.value = ""; renderKids(); renderRoute(); toast(`${name} added`);
    }
  });
  $("[data-kidsform]").addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.name === "kname") { e.preventDefault(); $("[data-addkid]").click(); } });
  $("[data-reset]").addEventListener("click", () => { if (!confirm("Reset to the demo stories? Your own stories on this device will be removed.")) return; db = seed(); save(); store.del(DKEY); draft = newDraft(); toast("Demo stories restored"); go("#/"); });

  let toastT; function toast(m) { const box = $("[data-toasts]"); box.innerHTML = ""; const t = document.createElement("div"); t.className = "toast"; t.textContent = m; box.append(t); clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600); }
  addEventListener("pagehide", () => { Narr.stop(); Music.stop(true); });

  window.__dreamio = { get db() { return db; }, get player() { return P; }, Narr, Music, sceneSVG, paragraph, titleFor };
  renderRoute();
})();
