(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const view = $("[data-view]"), DAY = 864e5, CARD_SIZE = 10, PTS_PER_PUNCH = 10;
  const KEY = "punchly-db", chan = "BroadcastChannel" in window ? new BroadcastChannel("punchly") : null;
  const fmtDate = (t) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const fmtTime = (t) => new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  /* ---------- in-browser "database" (tables mirror the PRD's Drizzle schema) ---------- */
  function seed() {
    const now = Date.now(), r = ((s) => () => ((s = (s * 16807) % 2147483647) / 2147483647))(74);
    const users = [["Ava Chen", "#EB6834"], ["Ben Ortiz", "#2A78D6"], ["Chloe Kim", "#1BAF7A"], ["Dev Patel", "#6250D6"], ["Ema Rossi", "#E87BA4"], ["Finn Walsh", "#008300"], ["Marco Silva", "#7A6E66", true], ["Sam Lee", "#1C1410", false, true]]
      .map(([name, color, isStaff = false, isAdmin = false], i) => ({ id: i + 1, clerkId: `user_${name.split(" ")[0].toLowerCase()}`, name, color, isStaff, isAdmin, staffRestaurantIds: isStaff ? [1] : [] }));
    const restaurants = [["Bean & Brew", "Neighborhood coffee roaster with house pastries.", "214 Mission St", "#7C4A2D"], ["Nonna's Pizza", "Wood-fired Neapolitan pies, family recipes.", "88 Columbus Ave", "#C2410C"], ["Taco Luz", "Street tacos and fresh aguas frescas.", "1450 Valencia St", "#B45309"], ["Sakura Ramen", "Rich tonkotsu and miso ramen.", "530 Geary St", "#BE185D"], ["Green Bowl", "Seasonal salads and grain bowls.", "77 Market St", "#15803D"], ["Sweet Crumb", "Bakery for cakes, cookies and celebrations.", "301 Hayes St", "#6D28D9"]]
      .map(([name, description, address, color], i) => ({ id: i + 1, name, description, address, color, imageUrl: "" }));
    let pcId = 0; const punchCards = [], punchEvents = [];
    [[1, 1, 7], [1, 3, 3], [1, 4, 9], [1, 6, 10], [2, 1, 4], [3, 1, 10], [4, 2, 6], [5, 1, 2], [6, 5, 8], [2, 3, 5], [3, 4, 7]].forEach(([userId, restaurantId, punches]) => {
      punchCards.push({ id: ++pcId, userId, restaurantId, punches, completed: punches >= CARD_SIZE, updatedAt: now - Math.floor(r() * 5) * DAY });
      for (let k = 0; k < punches; k++) punchEvents.push({ cardId: pcId, userId, restaurantId, at: now - Math.floor(r() * 14) * DAY - Math.floor(r() * 10) * 36e5 });
    });
    for (let d = 0; d < 14; d++) for (let k = 0; k < 2 + Math.floor(r() * 7); k++) punchEvents.push({ cardId: 0, userId: 2 + Math.floor(r() * 5), restaurantId: 1 + Math.floor(r() * 3), at: now - d * DAY - Math.floor(r() * 10) * 36e5 });
    punchCards.filter((c) => c.completed).forEach((c) => punchCards.push({ id: ++pcId, userId: c.userId, restaurantId: c.restaurantId, punches: 0, completed: false, updatedAt: now }));
    const raffleEntries = [{ id: 1, userId: 1, punchCardId: 4, restaurantId: 6, createdAt: now - 2 * DAY }, { id: 2, userId: 3, punchCardId: 6, restaurantId: 1, createdAt: now - DAY }];
    const P = (restaurantId, name, description, type, requiredPunches, quantity, rules) => ({ restaurantId, name, description, type, requiredPunches, quantity, rules, available: true, imageUrl: "", createdAt: now - 20 * DAY });
    const prizes = [P(1, "Free coffee", "Any drip coffee or Americano, any size.", "reward", 5, 50, { expirationDays: 14, usageLimit: 1, terms: "One per visit." }), P(1, "Pastry & latte", "Any pastry with a latte or cappuccino.", "reward", 8, 20, { expirationDays: 30 }), P(1, "Espresso machine raffle", "Monthly draw among completed cards.", "raffle", 10, 1, { terms: "Drawn on the 1st of each month." }), P(2, "Free slice", "One classic slice of your choice.", "reward", 5, 40, { expirationDays: 14 }), P(2, "Pizza night for two", "Raffle: two pizzas and drinks.", "raffle", 10, 2, {}), P(3, "Free taco", "Any taco from the menu.", "reward", 4, 60, { expirationDays: 21 }), P(4, "Extra toppings bowl", "Ramen bowl with any 3 toppings.", "reward", 6, 25, { expirationDays: 21 }), P(5, "Free smoothie", "Any 16 oz smoothie.", "reward", 6, 30, { expirationDays: 14 }), P(6, "Birthday cake raffle", "Win a custom 8\" cake.", "raffle", 10, 1, {}), P(6, "Cookie box", "Box of six cookies.", "reward", 7, 15, { expirationDays: 30 })].map((p, i) => ({ id: i + 1, ...p }));
    const pointBalances = [340, 520, 910, 150, 260, 780, 0, 0].map((points, i) => ({ id: i + 1, userId: i + 1, points, updatedAt: now }));
    const prizeRedemptions = [{ id: 1, userId: 2, prizeId: 1, punchCardId: 5, status: "pending", expiresAt: now + 10 * DAY, createdAt: now - 4 * DAY, redeemedAt: null }, { id: 2, userId: 3, prizeId: 2, punchCardId: 6, status: "redeemed", expiresAt: now + 20 * DAY, createdAt: now - 6 * DAY, redeemedAt: now - 5 * DAY }, { id: 3, userId: 5, prizeId: 1, punchCardId: 8, status: "pending", expiresAt: now - DAY, createdAt: now - 15 * DAY, redeemedAt: null }];
    const pointTransfers = [{ id: 1, fromUserId: 1, toUserId: 2, points: 40, message: "Coffee's on me!", status: "completed", createdAt: now - 3 * DAY }];
    const achievements = [["first_punch", 9], ["card_complete", 2], ["raffle_entry", 2], ["first_transfer", 3]].map(([type, d], i) => ({ id: i + 1, userId: 1, type, data: {}, unlockedAt: now - d * DAY }));
    return { users, restaurants, punchCards, raffleEntries, prizes, prizeRedemptions, pointBalances, pointTransfers, achievements, punchEvents, seq: 100 };
  }
  let db; try { db = JSON.parse(localStorage.getItem(KEY)); } catch { db = null; }
  if (!db || !db.users) db = seed();
  const save = (evt) => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* unavailable */ } if (evt && chan) chan.postMessage(evt); };
  save();
  const nextId = () => ++db.seq;
  const user = (id) => db.users.find((u) => u.id === id), rest = (id) => db.restaurants.find((r) => r.id === id);
  const points = (uid) => (db.pointBalances.find((b) => b.userId === uid) || { points: 0 }).points;
  const addPoints = (uid, n) => { let b = db.pointBalances.find((x) => x.userId === uid); if (!b) db.pointBalances.push((b = { id: nextId(), userId: uid, points: 0 })); b.points += n; b.updatedAt = Date.now(); };
  const code = (c) => `PCH-${String(c.id).padStart(4, "0")}-${user(c.userId).name.split(" ").map((x) => x[0]).join("")}`;
  const activeCard = (uid, rid) => db.punchCards.find((c) => c.userId === uid && c.restaurantId === rid && !c.completed);
  const role = (u) => (u.isAdmin ? "admin" : u.isStaff ? "staff" : "user");

  /* ---------- session (demo sign-in, per tab; stands in for Clerk) ---------- */
  let me = null; try { me = user(+sessionStorage.getItem("punchly-user")) || null; } catch { me = null; }
  function signIn(id) { me = user(id); anaRest = 0; manageRest = 0; raffleRest = 0; prizeRest = 0; anaTable = false; try { sessionStorage.setItem("punchly-user", id); } catch { /* ignore */ } toast(`Signed in as ${me.name} (${{ user: "User", staff: "Restaurant admin", admin: "System admin" }[role(me)]})`); location.hash = { user: "#/cards", staff: "#/scan", admin: "#/analytics" }[role(me)]; renderHeader(); }
  function signOut() { me = null; try { sessionStorage.removeItem("punchly-user"); } catch { /* ignore */ } location.hash = "#/"; renderHeader(); route(); }

  /* ---------- achievements ---------- */
  const ACH = { first_punch: ["First punch", "i-card", "Earned your first punch"], card_complete: ["Card complete", "i-check", "Filled a 10-punch card"], raffle_entry: ["In the draw", "i-ticket", "Entered your first raffle"], first_transfer: ["Generous", "i-send", "Sent points to a friend"], transfer_100: ["Big spender", "i-coin", "Sent 100+ points in total"], points_500: ["Rising star", "i-trophy", "Reached 500 points"], points_1000: ["Legend", "i-trophy", "Reached 1,000 points"] };
  function unlock(uid, type) { if (db.achievements.some((a) => a.userId === uid && a.type === type)) return null; const a = { id: nextId(), userId: uid, type, data: {}, unlockedAt: Date.now() }; db.achievements.push(a); return a; }
  function checkAch(uid) { const out = [], p = points(uid), sent = db.pointTransfers.filter((t) => t.fromUserId === uid && t.status === "completed").reduce((s, t) => s + t.points, 0);
    if (db.punchEvents.some((e) => e.userId === uid)) out.push(unlock(uid, "first_punch")); if (db.punchCards.some((c) => c.userId === uid && c.completed)) out.push(unlock(uid, "card_complete")); if (db.raffleEntries.some((e) => e.userId === uid)) out.push(unlock(uid, "raffle_entry"));
    if (sent > 0) out.push(unlock(uid, "first_transfer")); if (sent >= 100) out.push(unlock(uid, "transfer_100")); if (p >= 500) out.push(unlock(uid, "points_500")); if (p >= 1000) out.push(unlock(uid, "points_1000"));
    return out.filter(Boolean); }

  /* ---------- core actions (the API surface) ---------- */
  function punch(cardCode, staff) {
    const card = db.punchCards.find((c) => code(c) === cardCode.trim().toUpperCase());
    if (!card) return { ok: false, msg: "Code not recognized. Check the code and try again." };
    if (card.completed) return { ok: false, msg: "That card is already complete. Ask the guest to show their new card." };
    if (!staff.isAdmin && !staff.staffRestaurantIds.includes(card.restaurantId)) return { ok: false, msg: `This card belongs to ${rest(card.restaurantId).name}. You can only punch cards for your restaurant.` };
    card.punches += 1; card.updatedAt = Date.now(); db.punchEvents.push({ cardId: card.id, userId: card.userId, restaurantId: card.restaurantId, at: Date.now() }); addPoints(card.userId, PTS_PER_PUNCH);
    let raffle = null;
    if (card.punches >= CARD_SIZE) { card.completed = true; raffle = { id: nextId(), userId: card.userId, punchCardId: card.id, restaurantId: card.restaurantId, createdAt: Date.now() }; db.raffleEntries.push(raffle); db.punchCards.push({ id: nextId(), userId: card.userId, restaurantId: card.restaurantId, punches: 0, completed: false, updatedAt: Date.now() }); }
    const ach = checkAch(card.userId);
    save({ type: "punch", cardId: card.id, userId: card.userId, restaurantId: card.restaurantId, punches: card.punches, completed: card.completed });
    return { ok: true, card, raffle, ach };
  }
  function redeem(prizeId) {
    const p = db.prizes.find((x) => x.id === prizeId), card = activeCard(me.id, p.restaurantId);
    if (!p.available || p.quantity <= 0) return "This prize is not available right now.";
    if (!card || card.punches < p.requiredPunches) return `You need ${p.requiredPunches} punches on your ${rest(p.restaurantId).name} card.`;
    const used = db.prizeRedemptions.filter((x) => x.userId === me.id && x.prizeId === p.id && x.status !== "cancelled").length;
    if (p.rules.usageLimit && used >= p.rules.usageLimit) return `You've reached the limit of ${p.rules.usageLimit} for this prize.`;
    card.punches -= p.requiredPunches; p.quantity -= 1;
    const red = { id: nextId(), userId: me.id, prizeId: p.id, punchCardId: card.id, status: "pending", createdAt: Date.now(), redeemedAt: null, expiresAt: p.rules.expirationDays ? Date.now() + p.rules.expirationDays * DAY : null };
    db.prizeRedemptions.push(red); save({ type: "redeem", id: red.id }); return red;
  }
  function transfer(toId, n, message) {
    if (!(Number.isInteger(n) && n >= 1)) return "Send at least 1 point (whole numbers only).";
    if (n > points(me.id)) return `You only have ${points(me.id)} points.`;
    if ((message || "").length > 200) return "Message must be 200 characters or fewer.";
    addPoints(me.id, -n); addPoints(toId, n);
    const t = { id: nextId(), fromUserId: me.id, toUserId: toId, points: n, message, status: "completed", createdAt: Date.now() }; db.pointTransfers.push(t);
    const ach = checkAch(me.id); checkAch(toId); save({ type: "transfer", id: t.id, to: toId }); return { t, ach };
  }
  const statusOf = (rd) => (rd.status === "pending" && rd.expiresAt && rd.expiresAt < Date.now() ? "expired" : rd.status);
  const canManage = (rid) => me && (me.isAdmin || me.staffRestaurantIds.includes(rid));
  const myRestaurants = () => (me.isAdmin ? db.restaurants : db.restaurants.filter((r) => me.staffRestaurantIds.includes(r.id)));

  /* ---------- pseudo QR (demo pattern, not a standards-compliant QR code) ---------- */
  function qr(text) {
    const N = 25; let h = 2166136261; const bits = []; for (let i = 0; i < N * N; i++) { h ^= text.charCodeAt(i % text.length) + i; h = Math.imul(h, 16777619); bits.push((h >>> 13) & 1); }
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#1C1410"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#1C1410"/>`;
    const inF = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    let s = ""; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inF(x, y) && bits[y * N + x]) s += `<rect x="${x}" y="${y}" width="1" height="1" fill="#1C1410"/>`;
    return `<svg viewBox="0 0 ${N} ${N}" role="img" aria-label="Demo scan pattern for code ${text}" shape-rendering="crispEdges">${s}${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</svg>`;
  }

  /* ---------- header ---------- */
  const TABS = { user: [["cards", "My cards", "i-card"], ["restaurants", "Restaurants", "i-store"], ["prizes", "Prizes", "i-gift"], ["points", "Points", "i-coin"], ["leaderboard", "Leaderboard", "i-trophy"]], staff: [["scan", "Scan", "i-scan"], ["manage", "Prizes", "i-gift"], ["redemptions", "Redemptions", "i-ticket"], ["raffle", "Raffle", "i-dice"], ["analytics", "Analytics", "i-chart"]], admin: [["analytics", "Analytics", "i-chart"], ["admin-restaurants", "Restaurants", "i-store"], ["users", "Users", "i-users"], ["manage", "Prizes", "i-gift"], ["redemptions", "Redemptions", "i-ticket"], ["raffle", "Raffle", "i-dice"], ["scan", "Scan", "i-scan"]] };
  function renderHeader() {
    $("[data-tabs]").innerHTML = me ? TABS[role(me)].map(([k, l, ic]) => `<a href="#/${k}" data-tab="${k}">${icon(ic)}<span>${l}</span></a>`).join("") : "";
    $("[data-who]").innerHTML = me ? `${role(me) === "user" ? `<span class="pts" data-mypts>${icon("i-coin")}${points(me.id)}</span>` : `<span class="pill ink">${role(me) === "admin" ? "System admin" : "Restaurant admin"}</span>`}<span class="me"><span class="av" style="background:${me.color}" aria-hidden="true">${me.name[0]}</span><span class="nm"><b>${esc(me.name)}</b><small style="color:var(--muted)">${esc(me.clerkId)}</small></span></span><button class="icon-btn" type="button" aria-label="Sign out" data-signout>${icon("i-logout")}</button>` : `<a class="btn sm" href="#/" data-signin-link>Sign in</a>`;
    const cur = (location.hash.match(/^#\/([\w-]+)/) || [])[1]; $$("[data-tab]").forEach((a) => (a.dataset.tab === cur ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  }
  $("[data-who]").addEventListener("click", (e) => { if (e.target.closest("[data-signout]")) signOut(); });

  /* ---------- views ---------- */
  const V = {};
  V.home = () => `<div class="page"><section class="hero"><div><span class="pill o">Digital punch cards</span><h1 style="margin-top:12px">Every visit counts. <em>Every tenth one wins.</em></h1><p>Collect punches at participating restaurants, fill a card to enter raffles, redeem rewards, and send points to friends. Restaurant teams get a scanner, prize tools and analytics.</p>
      <div class="personas" aria-label="Demo sign-in"><p style="margin:0;font-size:13px;color:var(--muted);font-weight:600">Demo sign-in: choose a role</p>${[[1, "User", "Ava has 4 punch cards, 340 points and a raffle entry."], [7, "Restaurant admin", "Marco runs Bean & Brew: scan cards, manage prizes, see analytics."], [8, "System admin", "Sam can manage all restaurants, users and analytics."]].map(([id, r, d]) => { const u = user(id); return `<button type="button" class="persona" data-persona="${id}"><span class="av" style="background:${u.color}" aria-hidden="true">${u.name[0]}</span><span><b>${esc(u.name)} · ${r}</b><small>${d}</small></span>${icon("i-lock")}</button>`; }).join("")}</div></div>
      <div class="demo-card" aria-hidden="true"><div class="pc" style="--c:#7C4A2D;margin:0"><div class="top"><div><h3>Bean &amp; Brew</h3><span class="sub">7 of 10 punches</span></div><span class="ribbon">3 to go</span></div><div class="holes">${Array.from({ length: 10 }, (_, i) => `<span class="hole${i < 7 ? " on" : ""}">${i < 7 ? icon("i-check") : ""}</span>`).join("")}</div><div class="foot2"><span>Free coffee at 5 punches</span></div></div><p style="margin:16px 0 0;font-size:14px">Show your code at the counter, staff scan it, and the punch appears on your phone instantly.</p></div></section>
    <section class="how"><h2 style="font-size:24px">How it works</h2><ol><li><b>Visit</b>Show your card code at any participating restaurant.</li><li><b>Get punched</b>Staff scan it and your card updates in real time.</li><li><b>Fill your card</b>10 punches enter you into that restaurant's raffle.</li><li><b>Redeem &amp; share</b>Trade punches for rewards and send points to friends.</li></ol></section></div>`;
  V.cards = () => {
    const mine = db.punchCards.filter((c) => c.userId === me.id).sort((a, b) => a.completed - b.completed || b.punches - a.punches);
    return `<div class="page"><div class="ph"><div><h1>My punch cards</h1><p>${mine.filter((c) => !c.completed).length} active · ${mine.filter((c) => c.completed).length} completed · ${db.raffleEntries.filter((e) => e.userId === me.id).length} raffle entries</p></div><a class="btn-o" href="#/restaurants">${icon("i-plus")}Start a new card</a></div>
      <div class="pcards" data-cards>${mine.map((c) => { const r = rest(c.restaurantId), next = db.prizes.filter((p) => p.restaurantId === r.id && p.type === "reward" && p.available).sort((a, b) => a.requiredPunches - b.requiredPunches).find((p) => p.requiredPunches > c.punches); return `<article class="pc${c.completed ? " done" : ""}" style="--c:${r.color}" data-card="${c.id}"><div class="top"><div><h3>${esc(r.name)}</h3><span class="sub" data-count>${c.punches} of ${CARD_SIZE} punches</span></div>${c.completed ? `<span class="ribbon">${icon("i-ticket")}Raffle entered</span>` : `<span class="ribbon">${CARD_SIZE - c.punches} to go</span>`}</div><div class="holes" role="img" aria-label="${c.punches} of ${CARD_SIZE} punches">${Array.from({ length: CARD_SIZE }, (_, i) => `<span class="hole${i < c.punches ? " on" : ""}">${i < c.punches ? icon("i-check") : ""}</span>`).join("")}</div><div class="foot2"><span>${c.completed ? "Completed" : next ? `${esc(next.name)} at ${next.requiredPunches}` : "Rewards ready to redeem"}</span>${c.completed ? "" : `<button class="btn-o sm" type="button" data-showcode="${c.id}">${icon("i-scan")}Show code</button>`}</div></article>`; }).join("") || `<p class="empty">No cards yet. <a href="#/restaurants">Pick a restaurant</a> to start one.</p>`}</div></div>`;
  };
  V.restaurants = () => `<div class="page"><div class="ph"><div><h1>Participating restaurants</h1><p>${db.restaurants.length} places to earn punches</p></div></div><div class="rgrid">${db.restaurants.map((r) => { const c = activeCard(me.id, r.id); return `<article class="rest" data-rest="${r.id}"><div class="art" style="--c:${r.color}" aria-hidden="true">${esc(r.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</div><div class="b"><h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><span class="addr">${icon("i-pin")}${esc(r.address)}</span><div class="row"><span class="pill${c ? " o" : ""}">${c ? `${c.punches}/${CARD_SIZE} punches` : "No card yet"}</span>${c ? `<button class="btn-o sm" type="button" data-showcode="${c.id}">Show code</button>` : `<button class="btn sm" type="button" data-startcard="${r.id}">${icon("i-plus")}Start card</button>`}</div></div></article>`; }).join("")}</div></div>`;
  let prizeRest = 0;
  V.prizes = () => {
    const list = db.prizes.filter((p) => !prizeRest || p.restaurantId === prizeRest), reds = db.prizeRedemptions.filter((x) => x.userId === me.id).sort((a, b) => b.createdAt - a.createdAt);
    return `<div class="page"><div class="ph"><div><h1>Prizes</h1><p>Trade punches for rewards. Complete a card to enter raffles.</p></div><label class="f" style="min-width:220px">Restaurant<select data-prest><option value="0">All restaurants</option>${db.restaurants.map((r) => `<option value="${r.id}"${prizeRest === r.id ? " selected" : ""}>${esc(r.name)}</option>`).join("")}</select></label></div>
      <div class="prizes" data-prizes>${list.map((p) => { const c = activeCard(me.id, p.restaurantId), have = c ? c.punches : 0, entries = db.raffleEntries.filter((e) => e.userId === me.id && e.restaurantId === p.restaurantId).length; return `<article class="prize" data-prize="${p.id}"><div class="meta"><span class="pill ${p.type === "raffle" ? "ink" : "o"}">${p.type === "raffle" ? "Raffle" : "Reward"}</span><span class="pill">${esc(rest(p.restaurantId).name)}</span>${!p.available || p.quantity <= 0 ? '<span class="pill bad">Unavailable</span>' : ""}</div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p>${p.type === "raffle" ? `<p style="font-size:13px;color:var(--muted)">You have <b>${entries}</b> entr${entries === 1 ? "y" : "ies"}. Complete a ${CARD_SIZE}-punch card for another.</p>` : `<div class="progress" role="img" aria-label="${Math.min(have, p.requiredPunches)} of ${p.requiredPunches} punches"><i style="width:${Math.min(100, (have / p.requiredPunches) * 100)}%"></i></div><p style="font-size:13px;color:var(--muted)">${have}/${p.requiredPunches} punches${p.rules.expirationDays ? ` · use within ${p.rules.expirationDays} days` : ""}${p.rules.terms ? ` · ${esc(p.rules.terms)}` : ""}</p>`}<div class="row"><span class="pill">${p.quantity} left</span>${p.type === "reward" ? `<button class="btn sm" type="button" data-redeem="${p.id}" ${have >= p.requiredPunches && p.available && p.quantity > 0 ? "" : "disabled"}>Redeem for ${p.requiredPunches}</button>` : ""}</div></article>`; }).join("")}</div>
      <section class="card" style="margin-top:20px"><h2>My redemptions</h2>${reds.length ? `<div class="tbl-wrap" style="margin-top:10px"><table class="tbl"><thead><tr><th>Prize</th><th>Restaurant</th><th>Status</th><th class="hide-sm">Expires</th></tr></thead><tbody data-myreds>${reds.map((x) => { const p = db.prizes.find((y) => y.id === x.prizeId), st = statusOf(x); return `<tr><td>${esc(p.name)}</td><td>${esc(rest(p.restaurantId).name)}</td><td><span class="pill ${st === "redeemed" ? "ok" : st === "pending" ? "warn" : "bad"}">${st}</span></td><td class="hide-sm">${x.expiresAt ? fmtDate(x.expiresAt) : "–"}</td></tr>`; }).join("")}</tbody></table></div><p style="font-size:13px;color:var(--muted)">Show a pending redemption at the counter; staff will mark it redeemed.</p>` : `<p class="empty" style="margin-top:10px">No redemptions yet.</p>`}</section></div>`;
  };
  V.points = () => {
    const mine = db.achievements.filter((a) => a.userId === me.id), hist = db.pointTransfers.filter((t) => t.fromUserId === me.id || t.toUserId === me.id).sort((a, b) => b.createdAt - a.createdAt);
    return `<div class="page"><div class="ph"><div><h1>Points &amp; achievements</h1><p>Earn ${PTS_PER_PUNCH} points per punch and send them to friends.</p></div></div>
      <div class="g2"><section class="card"><div class="kpi" style="border:0;padding:0"><span>Your balance</span><b data-balance>${points(me.id)} pts</b></div>
        <form class="form" novalidate data-transfer style="margin-top:14px"><h2>Send points</h2><div class="row2"><label class="f">To<select name="to">${db.users.filter((u) => u.id !== me.id && role(u) === "user").map((u) => `<option value="${u.id}">${esc(u.name)}</option>`).join("")}</select></label><label class="f">Points<input name="pts" type="number" min="1" step="1" inputmode="numeric"></label></div><label class="f">Message (optional)<input name="msg" maxlength="220" placeholder="Lunch is on me!"></label><p class="result bad" hidden data-terr></p><button class="btn" type="submit">${icon("i-send")}Send points</button></form></section>
        <section class="card"><h2>History</h2>${hist.length ? `<ul class="log" style="margin-top:10px" data-hist>${hist.map((t) => `<li><span>${t.fromUserId === me.id ? `Sent to ${esc(user(t.toUserId).name)}` : `From ${esc(user(t.fromUserId).name)}`}${t.message ? ` · “${esc(t.message)}”` : ""}</span><b class="mono" style="color:${t.fromUserId === me.id ? "var(--bad)" : "var(--ok)"}">${t.fromUserId === me.id ? "−" : "+"}${t.points}</b></li>`).join("")}</ul>` : `<p class="empty">No transfers yet.</p>`}</section></div>
      <section style="margin-top:20px"><div class="card-h"><h2>Achievements</h2><span class="pill">${mine.length} of ${Object.keys(ACH).length} unlocked</span></div><div class="ach" data-ach>${Object.entries(ACH).map(([k, [n, ic, d]]) => { const a = mine.find((x) => x.type === k); return `<div class="badge${a ? "" : " lock"}" data-badge="${k}"><span class="bi">${icon(a ? ic : "i-lock")}</span><b>${n}</b><span>${d}</span>${a ? `<small style="color:var(--muted)">${fmtDate(a.unlockedAt)}</small><button class="btn-g sm" type="button" data-shareach="${k}">${icon("i-share")}Share</button>` : ""}</div>`; }).join("")}</div></section></div>`;
  };
  let liveTimer = null, live = true;
  V.leaderboard = () => {
    const rows = db.users.filter((u) => role(u) === "user").map((u) => [u, points(u.id)]).sort((a, b) => b[1] - a[1]);
    return `<div class="page"><div class="ph"><div><h1>Leaderboard</h1><p>Ranked by points. Updates in real time.</p></div><label style="display:flex;gap:8px;align-items:center;min-height:44px"><input type="checkbox" data-live ${live ? "checked" : ""} style="width:18px;height:18px"><span class="live">Live activity</span></label></div><ol class="lb" data-lb>${rows.map(([u, p], i) => `<li class="${u.id === me.id ? "me" : ""}" data-lbu="${u.id}"><span class="rk">${i + 1}</span><span class="av" style="background:${u.color}" aria-hidden="true">${u.name[0]}</span><span><b style="color:var(--ink)">${esc(u.name)}</b>${u.id === me.id ? " <span class='pill o'>You</span>" : ""}<br><small style="color:var(--muted)">${db.achievements.filter((a) => a.userId === u.id).length} achievements</small></span><span class="p">${p}</span></li>`).join("")}</ol></div>`;
  };
  /* staff/admin */
  let scanLog = [];
  V.scan = () => `<div class="page"><div class="ph"><div><h1>Scan station</h1><p>${me.isAdmin ? "All restaurants" : esc(myRestaurants().map((r) => r.name).join(", "))} · each scan adds one punch</p></div></div><div class="scan"><div class="stack"><div class="viewfinder" aria-hidden="true"><p>Camera scanning is simulated in this demo. Type the code shown on the guest's phone, or tap a guest below.</p></div>
      <form class="form card" novalidate data-scanform><label class="f">Card code<input name="code" class="mono" autocomplete="off" placeholder="PCH-0001-AC" style="text-transform:uppercase"></label><button class="btn" type="submit">${icon("i-scan")}Add punch</button><div data-scanres aria-live="polite"></div></form></div>
      <div class="stack"><section class="card"><h2>Guests with open cards</h2><p style="font-size:13px;color:var(--muted);margin:2px 0 10px">Tap to simulate scanning their code.</p><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Guest</th><th class="hide-sm">Restaurant</th><th>Punches</th><th><span class="sr">Scan</span></th></tr></thead><tbody>${db.punchCards.filter((c) => !c.completed && canManage(c.restaurantId)).map((c) => `<tr><td>${esc(user(c.userId).name)}<br><small class="mono" style="color:var(--muted)">${code(c)}</small></td><td class="hide-sm">${esc(rest(c.restaurantId).name)}</td><td class="mono">${c.punches}/${CARD_SIZE}</td><td class="r"><button class="btn-o sm" type="button" data-quickscan="${code(c)}">Scan</button></td></tr>`).join("")}</tbody></table></div></section>
      <section class="card"><h2>Recent scans</h2><ul class="log" style="margin-top:10px" data-scanlog>${scanLog.map((l) => `<li><span>${esc(l)}</span></li>`).join("") || "<li><span>No scans yet this session.</span></li>"}</ul></section></div></div></div>`;
  let manageRest = 0;
  V.manage = () => {
    const rs = myRestaurants(); if (!manageRest || !rs.some((r) => r.id === manageRest)) manageRest = rs[0]?.id || 0;
    const list = db.prizes.filter((p) => p.restaurantId === manageRest);
    return `<div class="page"><div class="ph"><div><h1>Prize management</h1><p>Create rewards and raffles, set rules, quantity and availability.</p></div><div style="display:flex;gap:10px;align-items:end;flex-wrap:wrap">${rs.length > 1 ? `<label class="f">Restaurant<select data-mrest>${rs.map((r) => `<option value="${r.id}"${r.id === manageRest ? " selected" : ""}>${esc(r.name)}</option>`).join("")}</select></label>` : ""}<button class="btn" type="button" data-newprize>${icon("i-plus")}New prize</button></div></div>
      <section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Prize</th><th>Type</th><th class="r">Punches</th><th class="r">Qty</th><th>Available</th><th><span class="sr">Actions</span></th></tr></thead><tbody data-ptable>${list.map((p) => `<tr data-pid="${p.id}"><td><b style="color:var(--ink)">${esc(p.name)}</b><br><small style="color:var(--muted)">${esc(p.description)}</small></td><td><span class="pill ${p.type === "raffle" ? "ink" : "o"}">${p.type}</span></td><td class="r mono">${p.requiredPunches}</td><td class="r mono">${p.quantity}</td><td><label style="display:inline-flex;gap:6px;align-items:center;min-height:40px"><input type="checkbox" data-avail ${p.available ? "checked" : ""} style="width:18px;height:18px"><span class="sr">Available</span>${p.available ? "On" : "Off"}</label></td><td><div class="acts"><button class="icon-btn" type="button" aria-label="Edit ${esc(p.name)}" data-editprize>${icon("i-edit")}</button><button class="icon-btn" type="button" aria-label="Delete ${esc(p.name)}" data-delprize>${icon("i-trash")}</button></div></td></tr>`).join("") || `<tr><td colspan="6"><p class="empty">No prizes yet.</p></td></tr>`}</tbody></table></div></section></div>`;
  };
  V.redemptions = () => {
    const list = db.prizeRedemptions.filter((x) => canManage(db.prizes.find((p) => p.id === x.prizeId)?.restaurantId)).sort((a, b) => b.createdAt - a.createdAt);
    return `<div class="page"><div class="ph"><div><h1>Redemptions</h1><p>Mark rewards as redeemed when guests claim them. Pending items expire automatically.</p></div></div><section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Guest</th><th>Prize</th><th>Status</th><th class="hide-sm">Created</th><th class="hide-sm">Expires</th><th><span class="sr">Actions</span></th></tr></thead><tbody data-rtable>${list.map((x) => { const p = db.prizes.find((y) => y.id === x.prizeId), st = statusOf(x); return `<tr data-rid="${x.id}"><td>${esc(user(x.userId).name)}</td><td>${esc(p.name)}<br><small style="color:var(--muted)">${esc(rest(p.restaurantId).name)}</small></td><td><span class="pill ${st === "redeemed" ? "ok" : st === "pending" ? "warn" : "bad"}" data-st>${st}</span></td><td class="hide-sm">${fmtDate(x.createdAt)}</td><td class="hide-sm">${x.expiresAt ? fmtDate(x.expiresAt) : "–"}</td><td><div class="acts">${st === "pending" ? `<button class="btn sm" type="button" data-markred>Mark redeemed</button><button class="btn-o sm" type="button" data-cancelred>Cancel</button>` : ""}</div></td></tr>`; }).join("") || `<tr><td colspan="6"><p class="empty">No redemptions.</p></td></tr>`}</tbody></table></div></section></div>`;
  };
  let raffleRest = 0;
  V.raffle = () => {
    const rs = myRestaurants(); if (!raffleRest || !rs.some((r) => r.id === raffleRest)) raffleRest = rs[0]?.id || 0;
    const entries = db.raffleEntries.filter((e) => e.restaurantId === raffleRest).sort((a, b) => b.createdAt - a.createdAt);
    return `<div class="page"><div class="ph"><div><h1>Raffle draws</h1><p>Each completed ${CARD_SIZE}-punch card is one entry.</p></div>${rs.length > 1 ? `<label class="f">Restaurant<select data-rrest>${rs.map((r) => `<option value="${r.id}"${r.id === raffleRest ? " selected" : ""}>${esc(r.name)}</option>`).join("")}</select></label>` : ""}</div>
      <section class="card"><div class="card-h"><div><h2>${entries.length} entr${entries.length === 1 ? "y" : "ies"} · ${esc(rest(raffleRest).name)}</h2><p>Prizes: ${esc(db.prizes.filter((p) => p.restaurantId === raffleRest && p.type === "raffle").map((p) => p.name).join(", ") || "none configured")}</p></div><button class="btn dark" type="button" data-draw ${entries.filter((e) => !e.won).length ? "" : "disabled"}>${icon("i-dice")}Draw a winner</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Entry</th><th>Guest</th><th>Date</th><th>Result</th></tr></thead><tbody data-entries>${entries.map((e) => `<tr><td class="mono">#${e.id}</td><td>${esc(user(e.userId).name)}</td><td>${fmtDate(e.createdAt)}</td><td>${e.won ? `<span class="pill ok">${icon("i-trophy")}Winner</span>` : "–"}</td></tr>`).join("") || `<tr><td colspan="4"><p class="empty">No entries yet.</p></td></tr>`}</tbody></table></div></section></div>`;
  };
  let anaRest = 0, anaTable = false;
  function analytics(rid) {
    const ev = db.punchEvents.filter((e) => !rid || e.restaurantId === rid), cards = db.punchCards.filter((c) => !rid || c.restaurantId === rid), reds = db.prizeRedemptions.filter((x) => !rid || db.prizes.find((p) => p.id === x.prizeId)?.restaurantId === rid);
    const today = new Date(); today.setHours(0, 0, 0, 0); const days = Array.from({ length: 14 }, (_, i) => ({ d: new Date(today.getTime() - (13 - i) * DAY), n: 0 }));
    ev.forEach((e) => { const k = Math.floor((e.at - today.getTime()) / DAY) + 13; if (k >= 0 && k < 14) days[k].n++; });
    const recent = ev.filter((e) => e.at >= today.getTime() - 13 * DAY);
    return { days, punches: recent.length, active: new Set(recent.map((e) => e.userId)).size, completion: cards.length ? cards.filter((c) => c.completed).length / cards.length : 0, redemption: reds.length ? reds.filter((x) => x.status === "redeemed").length / reds.length : 0, entries: db.raffleEntries.filter((e) => !rid || e.restaurantId === rid).length };
  }
  V.analytics = () => {
    const rs = myRestaurants(); if (!me.isAdmin && (!anaRest || !rs.some((r) => r.id === anaRest))) anaRest = rs[0]?.id || 0;
    const a = analytics(anaRest);
    return `<div class="page"><div class="ph"><div><h1>Analytics</h1><p>${anaRest ? esc(rest(anaRest).name) : "All restaurants"} · last 14 days</p></div>${me.isAdmin || rs.length > 1 ? `<label class="f">Restaurant<select data-arest>${me.isAdmin ? `<option value="0">All restaurants</option>` : ""}${rs.map((r) => `<option value="${r.id}"${r.id === anaRest ? " selected" : ""}>${esc(r.name)}</option>`).join("")}</select></label>` : ""}</div>
      <div class="kpis"><div class="kpi"><span>Punches</span><b data-k-punches>${a.punches}</b><small>last 14 days</small></div><div class="kpi"><span>Active guests</span><b data-k-active>${a.active}</b><small>punched in 14 days</small></div><div class="kpi"><span>Card completion</span><b>${Math.round(a.completion * 100)}%</b><small>of all cards</small></div><div class="kpi"><span>Redemption rate</span><b>${Math.round(a.redemption * 100)}%</b><small>${a.entries} raffle entries</small></div></div>
      <section class="card"><div class="card-h"><div><h2>Punches per day</h2><p>Hover or focus a bar for details</p></div><button class="btn-o sm" type="button" aria-pressed="${anaTable}" data-atable>${anaTable ? "Show chart" : "Show table"}</button></div>${anaTable ? `<div class="tbl-wrap"><table class="tbl" data-adata><thead><tr><th>Day</th><th class="r">Punches</th></tr></thead><tbody>${a.days.map((d) => `<tr><td>${d.d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</td><td class="r mono">${d.n}</td></tr>`).join("")}</tbody></table></div>` : `<div class="chart" data-achart></div>`}</section></div>`;
  };
  function chart(box, days) {
    const W = Math.max(300, box.clientWidth), H = 240, m = { l: 36, r: 10, t: 20, b: 28 }, iw = W - m.l - m.r, ih = H - m.t - m.b, max = Math.max(4, ...days.map((d) => d.n)), step = Math.ceil(max / 4), top = step * 4, band = iw / days.length, bw = Math.min(24, band * 0.6), y = (v) => m.t + ih - (v / top) * ih, peak = days.reduce((a, d, i) => (d.n > days[a].n ? i : a), 0);
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="Punches per day, last 14 days: ${days.map((d) => d.n).join(", ")}">`;
    for (let v = 0; v <= top; v += step) s += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    days.forEach((d, i) => { const cx = m.l + band * i + band / 2, h = m.t + ih - y(d.n), rr = Math.min(4, h); s += `<g data-i="${i}">${h > 0 ? `<path class="bar" d="M${cx - bw / 2} ${m.t + ih}V${y(d.n) + rr}Q${cx - bw / 2} ${y(d.n)} ${cx - bw / 2 + rr} ${y(d.n)}H${cx + bw / 2 - rr}Q${cx + bw / 2} ${y(d.n)} ${cx + bw / 2} ${y(d.n) + rr}V${m.t + ih}Z"/>` : ""}${i === peak || i === days.length - 1 ? `<text class="vl" x="${cx}" y="${y(d.n) - 6}" text-anchor="middle">${d.n}</text>` : ""}${i % (W < 500 ? 3 : 2) === 0 || i === days.length - 1 ? `<text class="ax" x="${cx}" y="${H - 8}" text-anchor="middle">${i === days.length - 1 ? "Today" : d.d.getDate()}</text>` : ""}<rect x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih}" fill="transparent" tabindex="0" aria-label="${d.d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${d.n} punches" data-hit="${i}"/></g>`; });
    box.innerHTML = s + `<line x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}" stroke="#CDBFB5"/></svg><div class="tip" hidden data-tip></div>`;
    const tip = $("[data-tip]", box), show = (i) => { $$("g.on", box).forEach((g) => g.classList.remove("on")); $(`g[data-i="${i}"]`, box).classList.add("on"); tip.hidden = false; tip.innerHTML = `<b>${days[i].d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</b>${days[i].n} punches`; tip.style.left = `${((m.l + band * i + band / 2) / W) * box.clientWidth}px`; tip.style.top = `${(y(days[i].n) / H) * box.clientHeight}px`; };
    $$("[data-hit]", box).forEach((h) => { ["pointerenter", "focus", "pointerdown"].forEach((ev) => h.addEventListener(ev, () => show(+h.dataset.hit))); h.addEventListener("blur", () => (tip.hidden = true)); });
    box.addEventListener("pointerleave", () => (tip.hidden = true));
  }
  V["admin-restaurants"] = () => `<div class="page"><div class="ph"><div><h1>Restaurants</h1><p>${db.restaurants.length} participating restaurants</p></div><button class="btn" type="button" data-newrest>${icon("i-plus")}Add restaurant</button></div><section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th class="hide-sm">Address</th><th class="r">Cards</th><th class="r">Prizes</th><th><span class="sr">Actions</span></th></tr></thead><tbody data-restable>${db.restaurants.map((r) => `<tr data-rest-id="${r.id}"><td><span class="av" style="background:${r.color};width:28px;height:28px;font-size:12px;vertical-align:middle;margin-right:8px" aria-hidden="true">${esc(r.name[0])}</span>${esc(r.name)}</td><td class="hide-sm">${esc(r.address)}</td><td class="r mono">${db.punchCards.filter((c) => c.restaurantId === r.id).length}</td><td class="r mono">${db.prizes.filter((p) => p.restaurantId === r.id).length}</td><td><div class="acts"><button class="icon-btn" type="button" aria-label="Edit ${esc(r.name)}" data-editrest>${icon("i-edit")}</button></div></td></tr>`).join("")}</tbody></table></div></section></div>`;
  V.users = () => `<div class="page"><div class="ph"><div><h1>Users &amp; roles</h1><p>Assign restaurant admins and system admins.</p></div></div><section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>User</th><th class="hide-sm">Clerk ID</th><th>Role</th><th>Restaurant</th><th class="r">Points</th></tr></thead><tbody data-utable>${db.users.map((u) => `<tr data-uid="${u.id}"><td>${esc(u.name)}</td><td class="hide-sm mono" style="font-size:12px">${esc(u.clerkId)}</td><td><label class="sr" for="role-${u.id}">Role for ${esc(u.name)}</label><select id="role-${u.id}" data-role ${u.id === me.id ? "disabled" : ""} style="min-height:38px;border:1px solid #DCCFC5;border-radius:10px;padding:0 8px"><option value="user"${role(u) === "user" ? " selected" : ""}>User</option><option value="staff"${role(u) === "staff" ? " selected" : ""}>Restaurant admin</option><option value="admin"${role(u) === "admin" ? " selected" : ""}>System admin</option></select></td><td>${role(u) === "staff" ? `<label class="sr" for="sr-${u.id}">Restaurant for ${esc(u.name)}</label><select id="sr-${u.id}" data-staffrest style="min-height:38px;border:1px solid #DCCFC5;border-radius:10px;padding:0 8px">${db.restaurants.map((r) => `<option value="${r.id}"${u.staffRestaurantIds[0] === r.id ? " selected" : ""}>${esc(r.name)}</option>`).join("")}</select>` : "–"}</td><td class="r mono">${points(u.id)}</td></tr>`).join("")}</tbody></table></div></section></div>`;
  V.denied = () => `<div class="page"><div class="ph"><div><h1>Not allowed</h1><p>Your role doesn't have access to this page.</p></div></div><a class="btn" href="#/">Go back</a></div>`;

  /* ---------- router with role guards ---------- */
  const ACCESS = { cards: ["user"], restaurants: ["user"], prizes: ["user"], points: ["user"], leaderboard: ["user"], scan: ["staff", "admin"], manage: ["staff", "admin"], redemptions: ["staff", "admin"], raffle: ["staff", "admin"], analytics: ["staff", "admin"], "admin-restaurants": ["admin"], users: ["admin"] };
  let cur = "";
  function route() {
    const r = (location.hash.match(/^#\/([\w-]+)/) || [])[1] || "home";
    let key = V[r] ? r : "home";
    if (ACCESS[key] && !me) { toast("Please sign in to continue", "err"); key = "home"; }
    else if (ACCESS[key] && !ACCESS[key].includes(role(me))) key = "denied";
    if (key === "home" && me && !r.startsWith("home") && location.hash && location.hash !== "#/") key = key;
    clearInterval(liveTimer); liveTimer = null;
    const y = cur === key ? scrollY : 0;
    view.innerHTML = V[key](); view.dataset.route = key; document.title = `${{ home: "Punchly — Digital Punch Cards & Restaurant Loyalty" }[key] || $("h1", view).textContent + " — Punchly"}`;
    renderHeader();
    if (key === "analytics" && !anaTable) chart($("[data-achart]"), analytics(anaRest).days);
    if (key === "leaderboard" && live) liveTimer = setInterval(liveTick, 4000);
    if (cur !== key) { scrollTo(0, 0); view.focus({ preventScroll: true }); } else scrollTo(0, y);
    cur = key;
  }
  addEventListener("hashchange", route);
  function liveTick() {
    const others = db.users.filter((u) => role(u) === "user" && (!me || u.id !== me.id)), u = others[Math.floor(Math.random() * others.length)], gain = 10 * (1 + Math.floor(Math.random() * 3));
    addPoints(u.id, gain); save({ type: "points", userId: u.id }); route();
    const li = $(`[data-lbu="${u.id}"]`); if (li) { li.classList.add("bump"); setTimeout(() => li.classList.remove("bump"), 900); }
  }

  /* ---------- interactions ---------- */
  document.addEventListener("click", (e) => {
    const p = e.target.closest("[data-persona]"); if (p) return signIn(+p.dataset.persona);
    const sc = e.target.closest("[data-showcode]"); if (sc) { const c = db.punchCards.find((x) => x.id === +sc.dataset.showcode); return openDlg(`<h2 id="dlg-title">${esc(rest(c.restaurantId).name)}</h2><div class="qr">${qr(code(c))}<span class="code" data-code>${code(c)}</span><p style="margin:0;text-align:center;font-size:14px;color:var(--muted)">Show this to staff. Punches appear here instantly.<br><small>Demo pattern: staff enter the code in the scan station.</small></p><p class="pill o" data-livecount>${c.punches}/${CARD_SIZE} punches</p></div><div class="acts"><button class="btn" value="cancel">Done</button></div>`, null, c.id); }
    const sc2 = e.target.closest("[data-startcard]"); if (sc2) { const rid = +sc2.dataset.startcard; db.punchCards.push({ id: nextId(), userId: me.id, restaurantId: rid, punches: 0, completed: false, updatedAt: Date.now() }); save({ type: "card" }); route(); toast(`New card started at ${rest(rid).name}`); return; }
    const rd = e.target.closest("[data-redeem]"); if (rd) { const p2 = db.prizes.find((x) => x.id === +rd.dataset.redeem); return openDlg(`<h2 id="dlg-title">Redeem ${esc(p2.name)}?</h2><p style="margin:0">This uses <b>${p2.requiredPunches} punches</b> from your ${esc(rest(p2.restaurantId).name)} card.${p2.rules.expirationDays ? ` Use it within ${p2.rules.expirationDays} days.` : ""}${p2.rules.terms ? ` ${esc(p2.rules.terms)}` : ""}</p><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn" type="submit">Redeem</button></div>`, () => { const res = redeem(p2.id); dlg.close(); if (typeof res === "string") toast(res, "err"); else { route(); toast(`Redeemed ${p2.name}. Show it at the counter.`); } }); }
    const sh = e.target.closest("[data-shareach]"); if (sh) { const t = `I unlocked “${ACH[sh.dataset.shareach][0]}” on Punchly!`; if (navigator.share) navigator.share({ text: t }).catch(() => {}); else { try { navigator.clipboard.writeText(t).then(() => toast("Copied to share")); } catch { toast(t); } } return; }
    const qs = e.target.closest("[data-quickscan]"); if (qs) return doScan(qs.dataset.quickscan);
    if (e.target.closest("[data-newprize]")) return prizeDlg();
    const ep = e.target.closest("[data-editprize]"); if (ep) return prizeDlg(db.prizes.find((x) => x.id === +ep.closest("[data-pid]").dataset.pid));
    const dp = e.target.closest("[data-delprize]"); if (dp) { const pz = db.prizes.find((x) => x.id === +dp.closest("[data-pid]").dataset.pid); return openDlg(`<h2 id="dlg-title">Delete “${esc(pz.name)}”?</h2><p style="margin:0">Existing redemptions keep their history.</p><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn" style="background:#B91C1C;border-color:#B91C1C" type="submit">Delete</button></div>`, () => { db.prizes = db.prizes.filter((x) => x !== pz); save({ type: "prize" }); dlg.close(); route(); toast(`Deleted ${pz.name}`); }); }
    const mr = e.target.closest("[data-markred], [data-cancelred]"); if (mr) { const x = db.prizeRedemptions.find((y) => y.id === +mr.closest("[data-rid]").dataset.rid); if (mr.hasAttribute("data-markred")) { x.status = "redeemed"; x.redeemedAt = Date.now(); } else { x.status = "cancelled"; const pz = db.prizes.find((y) => y.id === x.prizeId); pz.quantity += 1; } save({ type: "redemption" }); route(); toast(`Marked ${x.status}`); return; }
    if (e.target.closest("[data-draw]")) { const pool = db.raffleEntries.filter((x) => x.restaurantId === raffleRest && !x.won), w = pool[Math.floor(Math.random() * pool.length)]; w.won = true; w.wonAt = Date.now(); save({ type: "raffle" }); route(); return openDlg(`<h2 id="dlg-title">We have a winner!</h2><p style="margin:0;font-size:18px"><b data-winner>${esc(user(w.userId).name)}</b> wins the ${esc(rest(raffleRest).name)} raffle (entry #${w.id}).</p><div class="acts"><button class="btn" value="cancel">Done</button></div>`); }
    if (e.target.closest("[data-atable]")) { anaTable = !anaTable; route(); $("[data-atable]").focus(); return; }
    if (e.target.closest("[data-newrest]")) return restDlg();
    const er = e.target.closest("[data-editrest]"); if (er) return restDlg(rest(+er.closest("[data-rest-id]").dataset.restId));
    if (e.target.closest("[data-resetall]")) { localStorage.removeItem(KEY); db = seed(); save({ type: "reset" }); scanLog = []; route(); toast("Demo data reset"); }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches("[data-prest]")) { prizeRest = +t.value; route(); }
    if (t.matches("[data-mrest]")) { manageRest = +t.value; route(); }
    if (t.matches("[data-rrest]")) { raffleRest = +t.value; route(); }
    if (t.matches("[data-arest]")) { anaRest = +t.value; route(); }
    if (t.matches("[data-live]")) { live = t.checked; route(); }
    if (t.matches("[data-avail]")) { const pz = db.prizes.find((x) => x.id === +t.closest("[data-pid]").dataset.pid); pz.available = t.checked; save({ type: "prize" }); route(); toast(`${pz.name} is now ${pz.available ? "available" : "hidden"}`); }
    if (t.matches("[data-role]")) { const u = user(+t.closest("[data-uid]").dataset.uid); u.isAdmin = t.value === "admin"; u.isStaff = t.value === "staff"; u.staffRestaurantIds = u.isStaff ? [u.staffRestaurantIds[0] || 1] : []; save({ type: "user" }); route(); toast(`${u.name} is now ${t.selectedOptions[0].textContent}`); }
    if (t.matches("[data-staffrest]")) { const u = user(+t.closest("[data-uid]").dataset.uid); u.staffRestaurantIds = [+t.value]; save({ type: "user" }); toast(`${u.name} now manages ${rest(+t.value).name}`); }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.matches("[data-scanform]")) { e.preventDefault(); doScan(e.target.code.value); e.target.code.value = ""; return; }
    if (e.target.matches("[data-transfer]")) {
      e.preventDefault(); const f = e.target, n = Number(f.pts.value), res = transfer(+f.to.value, n, f.msg.value.trim()), err = $("[data-terr]");
      if (typeof res === "string") { err.hidden = false; err.textContent = res; f.pts.setAttribute("aria-invalid", "true"); f.pts.focus(); return; }
      route(); toast(`Sent ${n} points to ${user(+f.to.value).name}`); res.ach.forEach((a) => toast(`Achievement unlocked: ${ACH[a.type][0]}`)); res.ach.forEach((a) => $(`[data-badge="${a.type}"]`)?.classList.add("new"));
    }
  });
  function doScan(c) {
    const res = punch(c, me), box = $("[data-scanres]");
    if (!res.ok) { box.innerHTML = `<p class="result bad" role="alert">${esc(res.msg)}</p>`; return; }
    scanLog.unshift(`${fmtTime(Date.now())} · ${user(res.card.userId).name} · ${rest(res.card.restaurantId).name} → ${res.card.punches}/${CARD_SIZE}`);
    route();
    $("[data-scanres]").innerHTML = res.raffle ? `<p class="result raffle" role="status"><b>Card complete!</b> ${esc(user(res.card.userId).name)} is entered into the ${esc(rest(res.card.restaurantId).name)} raffle (entry #${res.raffle.id}). A new card was started.</p>` : `<p class="result ok" role="status">${icon("i-check")} Punched ${esc(user(res.card.userId).name)}: <b>${res.card.punches}/${CARD_SIZE}</b> · +${PTS_PER_PUNCH} points</p>`;
  }

  /* ---------- real-time sync between tabs (stands in for WebSockets) ---------- */
  if (chan) chan.onmessage = (m) => {
    try { db = JSON.parse(localStorage.getItem(KEY)) || db; } catch { /* keep */ }
    const d = m.data; if (me) me = user(me.id) || me;
    const openCard = dlg.open && +dlg.dataset.openCard;
    if (d.type === "punch" && me && d.userId === me.id) { toast(d.completed ? `Card complete at ${rest(d.restaurantId).name}! You're in the raffle.` : `+1 punch at ${rest(d.restaurantId).name} (${d.punches}/${CARD_SIZE})`); if (openCard === d.cardId) { const lc = $("[data-livecount]"); if (lc) lc.textContent = `${d.punches}/${CARD_SIZE} punches`; } }
    route();
    if (d.type === "punch" && me && d.userId === me.id) { const h = $$(`[data-card="${d.cardId}"] .hole.on`).pop(); if (h) h.classList.add("pop"); }
  };

  /* ---------- dialogs ---------- */
  const dlg = $("[data-dlg]"), db2 = $("[data-dlg-body]");
  let back = null;
  function openDlg(html, onSubmit, cardId) { back = document.activeElement; db2.innerHTML = html; dlg.dataset.openCard = cardId || ""; db2.onsubmit = (e) => { if (e.submitter && e.submitter.value === "cancel") return; e.preventDefault(); onSubmit && onSubmit(); }; if (!dlg.open) dlg.showModal(); ($("input, select", db2) || $("button[type=submit], button", db2)).focus(); }
  dlg.addEventListener("close", () => { dlg.dataset.openCard = ""; if (back && back.isConnected) back.focus({ preventScroll: true }); });
  const fld = (n, l, v, t = "text", x = "") => `<label class="f">${l}<input name="${n}" type="${t}" value="${esc(v ?? "")}" ${x}><span class="e"></span></label>`;
  const err = (n, m) => { const el = db2.elements[n]; if (m) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); el.closest(".f").querySelector(".e").textContent = m || ""; return !!m; };
  function prizeDlg(p) {
    const r0 = p ? p.rules : {};
    openDlg(`<h2 id="dlg-title">${p ? "Edit prize" : "New prize"} · ${esc(rest(p ? p.restaurantId : manageRest).name)}</h2>${fld("name", "Name", p?.name, "text", 'maxlength="60"')}<label class="f">Description<textarea name="description" maxlength="200">${esc(p?.description || "")}</textarea><span class="e"></span></label><div class="row2"><label class="f">Type<select name="type"><option value="reward"${p?.type !== "raffle" ? " selected" : ""}>Reward</option><option value="raffle"${p?.type === "raffle" ? " selected" : ""}>Raffle</option></select></label>${fld("requiredPunches", "Required punches", p?.requiredPunches ?? 5, "number", 'min="1" max="10" step="1"')}</div><div class="row2">${fld("quantity", "Quantity", p?.quantity ?? 10, "number", 'min="0" step="1"')}${fld("expirationDays", "Expires after (days, optional)", r0.expirationDays ?? "", "number", 'min="1" step="1"')}</div><div class="row2">${fld("usageLimit", "Usage limit per guest (optional)", r0.usageLimit ?? "", "number", 'min="1" step="1"')}${fld("terms", "Terms (optional)", r0.terms ?? "", "text", 'maxlength="200"')}</div><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn" type="submit">${p ? "Save" : "Create prize"}</button></div>`, () => {
      const f = db2.elements, int = (v) => (v === "" ? null : Number(v)), rp = int(f.requiredPunches.value), q = int(f.quantity.value), ex = int(f.expirationDays.value), ul = int(f.usageLimit.value);
      const bad = [err("name", f.name.value.trim().length < 2 ? "Name is required" : ""), err("description", f.description.value.trim().length < 3 ? "Describe the prize" : ""), err("requiredPunches", !(Number.isInteger(rp) && rp >= 1 && rp <= CARD_SIZE) ? `Whole number 1–${CARD_SIZE}` : ""), err("quantity", !(Number.isInteger(q) && q >= 0) ? "0 or more" : ""), err("expirationDays", ex !== null && !(Number.isInteger(ex) && ex >= 1) ? "1 or more days" : ""), err("usageLimit", ul !== null && !(Number.isInteger(ul) && ul >= 1) ? "1 or more" : "")];
      if (bad.includes(true)) return $("[aria-invalid=true]", db2).focus();
      const rules = {}; if (ex) rules.expirationDays = ex; if (ul) rules.usageLimit = ul; if (f.terms.value.trim()) rules.terms = f.terms.value.trim();
      const rec = p || (db.prizes.push({ id: nextId(), restaurantId: manageRest, available: true, imageUrl: "", createdAt: Date.now() }), db.prizes[db.prizes.length - 1]);
      Object.assign(rec, { name: f.name.value.trim(), description: f.description.value.trim(), type: f.type.value, requiredPunches: rp, quantity: q, rules });
      save({ type: "prize" }); dlg.close(); route(); toast(`${p ? "Saved" : "Created"} ${rec.name}`);
    });
  }
  function restDlg(r) {
    openDlg(`<h2 id="dlg-title">${r ? "Edit restaurant" : "Add restaurant"}</h2>${fld("name", "Name", r?.name, "text", 'maxlength="60"')}${fld("description", "Description", r?.description, "text", 'maxlength="140"')}${fld("address", "Address", r?.address, "text", 'maxlength="100"')}<label class="f">Brand color<input name="color" type="color" value="${r?.color || "#EB6834"}" style="padding:4px"></label><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn" type="submit">${r ? "Save" : "Add restaurant"}</button></div>`, () => {
      const f = db2.elements, bad = [err("name", f.name.value.trim().length < 2 ? "Name is required" : db.restaurants.some((x) => x !== r && x.name.toLowerCase() === f.name.value.trim().toLowerCase()) ? "Name already exists" : ""), err("description", f.description.value.trim().length < 3 ? "Add a short description" : ""), err("address", f.address.value.trim().length < 3 ? "Address is required" : "")];
      if (bad.includes(true)) return $("[aria-invalid=true]", db2).focus();
      const rec = r || (db.restaurants.push({ id: nextId(), imageUrl: "" }), db.restaurants[db.restaurants.length - 1]);
      Object.assign(rec, { name: f.name.value.trim(), description: f.description.value.trim(), address: f.address.value.trim(), color: f.color.value });
      save({ type: "restaurant" }); dlg.close(); route(); toast(`${r ? "Saved" : "Added"} ${rec.name}`);
    });
  }
  function toast(m, kind = "") { const t = document.createElement("div"); t.className = `toast ${kind}`; t.innerHTML = `${icon(kind === "err" ? "i-lock" : "i-check")}<span>${esc(m)}</span>`; $("[data-toasts]").append(t); setTimeout(() => t.remove(), 3600); }

  window.__punchly = { code: (id) => code(db.punchCards.find((c) => c.id === id)), db: () => db };
  route();
})();
