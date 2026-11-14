(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rp = (n) => "Rp " + n.toLocaleString("id-ID");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- konfigurasi WhatsApp (isi nomor bisnis, format 62xxxxxxxxxx) ---------- */
  const WA_NUMBER = ""; // demo: kosong → wa.me membuka pilihan kontak dengan pesan terisi
  const wa = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  /* ---------- konten ---------- */
  const CATS = [
    { id: "yb", name: "Yearbook", icon: "i-book", scene: "yearbook", from: 175000, unit: "/siswa", d: "Buku tahunan dengan konsep, foto kelas, dan video angkatan." },
    { id: "wo", name: "Wedding Organizer", icon: "i-ring", scene: "wedding", from: 6500000, unit: "", d: "Dokumentasi pernikahan dari akad hingga resepsi." },
    { id: "fg", name: "Foto Graduation", icon: "i-cap", scene: "graduation", from: 450000, unit: "", d: "Sesi foto wisuda pribadi, keluarga, dan angkatan." },
    { id: "vg", name: "Video Graduation", icon: "i-video", scene: "video", from: 1500000, unit: "", d: "Film pendek wisuda: highlight sinematik dan dokumenter." }
  ];
  const catById = Object.fromEntries(CATS.map((c) => [c.id, c]));
  const WORK = [
    { t: "Angkatan 24: Dream Big", c: "yb", type: "foto", client: "SMA Harapan Bangsa", loc: "Bekasi", y: 2026, size: "tall", seed: 3 },
    { t: "Akad di Rumah Joglo", c: "wo", type: "video", client: "Nadia & Raka", loc: "Yogyakarta", y: 2026, size: "wide", seed: 5, len: 182 },
    { t: "Toga & Senja", c: "fg", type: "foto", client: "Universitas Nusantara", loc: "Depok", y: 2025, size: "", seed: 7 },
    { t: "Kelas XII IPA 2", c: "yb", type: "foto", client: "SMA Cendekia", loc: "Bogor", y: 2025, size: "", seed: 9 },
    { t: "Wisuda Teknik 2025", c: "vg", type: "video", client: "Institut Teknologi Mandala", loc: "Bandung", y: 2025, size: "tall", seed: 11, len: 96 },
    { t: "Garden Party Wedding", c: "wo", type: "foto", client: "Sasha & Dimas", loc: "Bali", y: 2025, size: "", seed: 13 },
    { t: "Yearbook Film: Kita Pernah Di Sini", c: "yb", type: "video", client: "SMAN 8", loc: "Jakarta", y: 2026, size: "wide", seed: 17, len: 240 },
    { t: "Lulus Bersama Keluarga", c: "fg", type: "foto", client: "Keluarga Wibowo", loc: "Jakarta", y: 2026, size: "", seed: 19 },
    { t: "Same-Day Edit Resepsi", c: "wo", type: "video", client: "Ayu & Bram", loc: "Tangerang", y: 2026, size: "", seed: 23, len: 150 },
    { t: "Behind the Toga", c: "vg", type: "video", client: "Politeknik Cahaya", loc: "Semarang", y: 2025, size: "", seed: 29, len: 75 },
    { t: "Foto Angkatan Kedokteran", c: "fg", type: "foto", client: "FK Universitas Pelita", loc: "Surabaya", y: 2025, size: "wide", seed: 31 },
    { t: "Hari Terakhir Seragam", c: "vg", type: "video", client: "SMA Bina Insani", loc: "Depok", y: 2026, size: "", seed: 37, len: 120 }
  ].map((w, i) => ({ ...w, i, desc: `${w.type === "video" ? "Film" : "Seri foto"} ${catById[w.c].name.toLowerCase()} untuk ${w.client}, ${w.loc}. Diproduksi dengan color grading hangat khas Lentera.` }));
  const PKGS = {
    yb: [["Yearbook Basic", 175000, "/siswa · min. 100 siswa", "Untuk angkatan yang ingin buku rapi dan hemat.", ["Foto kelas & individu", "Desain 1 konsep", "Buku hardcover 80 hlm", "File digital semua foto"]], ["Yearbook Signature", 245000, "/siswa · min. 100 siswa", "Paling sering dipilih panitia sekolah.", ["Semua di Basic", "2 konsep tema + moodboard", "Video angkatan 3 menit", "Buku 120 hlm laminasi doff"], true], ["Yearbook Cinematic", 325000, "/siswa · min. 120 siswa", "Pengalaman lengkap ala film.", ["Semua di Signature", "Video dokumenter 8 menit", "Sesi drone & behind the scene", "Buku 160 hlm + box eksklusif"]]],
    wo: [["Intimate", 6500000, "", "Akad atau resepsi kecil hingga 150 tamu.", ["1 fotografer + 1 videografer", "Liputan 6 jam", "Highlight video 1 menit", "300 foto edit + album 20x30"]], ["Signature", 12000000, "", "Dokumentasi lengkap akad & resepsi.", ["2 fotografer + 2 videografer", "Liputan 10 jam", "Film 3–5 menit + teaser", "Album premium 30x30"], true], ["Cinematic", 19500000, "", "Untuk hari besar yang ingin terasa seperti film.", ["Tim 6 orang + drone", "Pre-wedding 1 lokasi", "Same-day edit di resepsi", "Film 8–10 menit + raw footage"]]],
    fg: [["Solo", 450000, "", "Sesi wisuda pribadi 30 menit.", ["1 lokasi kampus", "15 foto edit", "2 pose dengan keluarga", "Hasil dalam 5 hari"]], ["Bersama", 1200000, "/grup s.d. 5 orang", "Untuk sahabat atau satu keluarga.", ["Sesi 60 menit", "40 foto edit", "Properti balon & bunga", "Cetak 4R x 10"], true], ["Angkatan", 4500000, "/kelas s.d. 40 orang", "Foto angkatan rapi dan seru.", ["Sesi 2 jam", "Foto formal & candid", "Foto individu tiap anggota", "File high-res untuk semua"]]],
    vg: [["Highlight", 1500000, "", "Video wisuda 1 menit untuk media sosial.", ["Liputan 2 jam", "Musik berlisensi", "Format vertikal & horizontal", "Hasil 3 hari"]], ["Cinematic", 3500000, "", "Film pendek 3 menit dengan cerita.", ["Liputan 4 jam + wawancara", "Color grading sinematik", "Drone (jika diizinkan)", "Revisi 2x"], true], ["Film Angkatan", 9000000, "", "Dokumenter angkatan 8–10 menit.", ["Pra-produksi & storyboard", "Liputan 2 hari", "Wawancara 10 orang", "Pemutaran di acara wisuda"]]]
  };
  const TESTS = [["Hasil yearbook-nya bikin satu angkatan nangis haru waktu pemutaran video. Timnya sabar banget ngadepin 300 siswa!", "Rina", "Panitia Yearbook, SMA Harapan Bangsa"], ["Same-day edit di resepsi kami jadi momen paling berkesan. Tamu masih membicarakannya sampai sekarang.", "Ayu & Bram", "Pasangan pengantin"], ["Foto wisudaku warnanya hangat dan natural. Prosesnya cepat dan arahan gayanya jelas.", "Dimas", "Wisudawan Teknik"]];
  const FAQ = [["Berapa lama hasil foto dan video selesai?", "Foto edit 5–7 hari kerja. Video highlight 3–7 hari, film panjang dan yearbook 3–6 minggu tergantung paket."], ["Apakah harus DP untuk booking tanggal?", "Ya, DP 30% untuk mengunci tanggal. Sisanya dilunasi H-3 sebelum acara."], ["Apakah bisa liputan di luar Jabodetabek?", "Bisa. Kami sering bertugas di Bandung, Yogyakarta, dan Bali. Biaya transport dan akomodasi dihitung terpisah."], ["Bisa custom paket?", "Tentu. Ceritakan kebutuhanmu lewat WhatsApp dan kami susun paket yang pas dengan anggaran."], ["Musik di video aman untuk media sosial?", "Kami memakai musik berlisensi, jadi video aman diunggah ke Instagram, TikTok, dan YouTube."], ["Bagaimana jika acara diundur?", "Jadwal bisa dipindah satu kali tanpa biaya jika dikabari minimal 14 hari sebelumnya."]];

  /* ---------- WhatsApp links ---------- */
  function setWa(a, msg) { a.href = wa(msg); a.target = "_blank"; a.rel = "noopener"; }
  $$("[data-wa]").forEach((a) => setWa(a, a.dataset.waMsg));

  /* ---------- hero reel ---------- */
  const reel = $("[data-reel]"), kinds = ["wedding", "graduation", "yearbook", "video"];
  reel.innerHTML = kinds.map((k, i) => `<div class="${i ? "" : "on"}">${Scene.scene(k, 41 + i, "")}</div>`).join("");
  if (!reduce) { let r = 0; setInterval(() => { const f = reel.children; f[r].classList.remove("on"); r = (r + 1) % f.length; f[r].classList.add("on"); }, 6000); }

  /* ---------- categories ---------- */
  $("[data-cats]").innerHTML = CATS.map((c, i) => `<a class="cat" href="#layanan" data-cat-go="${c.id}"><span class="ci">${Scene.scene(c.scene, 60 + i, `Ilustrasi ${c.name}`)}</span><span class="ct">${icon(c.icon)}<h3>${c.name}</h3><p>${c.d}</p><span class="from">Mulai ${rp(c.from)}${c.unit}</span></span></a>`).join("");

  /* ---------- portfolio ---------- */
  let filter = "all", list = WORK;
  $("[data-filters]").innerHTML = [["all", "Semua"], ...CATS.map((c) => [c.id, c.name])].map(([k, l]) => `<button type="button" aria-pressed="${k === "all"}" data-f="${k}">${l}</button>`).join("");
  function renderGrid() {
    list = WORK.filter((w) => filter === "all" || w.c === filter);
    $("[data-pcount]").textContent = `${list.length} karya${filter === "all" ? "" : ` · ${catById[filter].name}`}`;
    $("[data-grid]").innerHTML = list.map((w, k) => `<button type="button" class="item ${filter === "all" ? w.size : ""}" data-open="${k}" aria-label="${esc(w.t)}, ${w.type === "video" ? "video" : "foto"} ${esc(catById[w.c].name)}. Buka detail">${Scene.scene(catById[w.c].scene, w.seed, "")}<span class="kind">${w.type === "video" ? "Video" : "Foto"} · ${catById[w.c].name}</span>${w.type === "video" ? `<span class="playb" aria-hidden="true">${icon("i-play")}</span>` : ""}<span class="cap"><b>${esc(w.t)}</b><small>${esc(w.client)} · ${w.y}</small></span></button>`).join("");
    $$("[data-f]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.f === filter));
  }
  $("[data-filters]").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) { filter = b.dataset.f; renderGrid(); } });
  renderGrid();

  /* ---------- lightbox (photo series & simulated video preview) ---------- */
  const lb = $("[data-lb]"), lbb = $("[data-lb-body]");
  let cur = 0, playT = null, back = null;
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  function show(k) {
    clearInterval(playT); cur = (k + list.length) % list.length; const w = list[cur], c = catById[w.c];
    lbb.innerHTML = `<div class="media" data-media>${Scene.scene(c.scene, w.seed, `${w.t}: ${w.type === "video" ? "cuplikan video" : "foto"} ${c.name}`)}${w.type === "video" ? `<div class="vbar"><button class="icon-btn" type="button" aria-label="Putar pratinjau" aria-pressed="false" data-vplay>${icon("i-play")}</button><span class="track" role="progressbar" aria-label="Progres video" aria-valuemin="0" aria-valuemax="${w.len}" aria-valuenow="0"><i data-vprog></i></span><span class="t" data-vt>0:00 / ${mmss(w.len)}</span></div>` : ""}</div>
      <div class="info"><button class="icon-btn x" type="button" aria-label="Tutup" data-lbclose>${icon("i-close")}</button><p class="eyebrow" style="margin:0">${w.type === "video" ? "Video" : "Foto"} · ${c.name}</p><h2 id="lb-title">${esc(w.t)}</h2><p style="margin:0">${esc(w.desc)}</p><dl><dt>Klien</dt><dd>${esc(w.client)}</dd><dt>Lokasi</dt><dd>${esc(w.loc)}</dd><dt>Tahun</dt><dd>${w.y}</dd>${w.len ? `<dt>Durasi</dt><dd>${mmss(w.len)}</dd>` : ""}</dl>
        <a class="btn gold" href="${wa(`Halo Lentera Cinema, saya suka karya "${w.t}" dan ingin paket ${c.name} yang serupa.`)}" target="_blank" rel="noopener" data-lbwa>${icon("i-wa")}Mau yang seperti ini</a>
        <div class="nav2"><button class="icon-btn" type="button" aria-label="Karya sebelumnya" data-prev>${icon("i-left")}</button><span style="align-self:center;font-size:14px" data-pos>${cur + 1} / ${list.length}</span><button class="icon-btn" type="button" aria-label="Karya berikutnya" data-next>${icon("i-right")}</button></div></div>`;
    if (!lb.open) { back = document.activeElement; lb.showModal(); }
    $("[data-lbclose]", lbb).focus();
  }
  $("[data-grid]").addEventListener("click", (e) => { const b = e.target.closest("[data-open]"); if (b) show(+b.dataset.open); });
  lbb.addEventListener("click", (e) => {
    if (e.target.closest("[data-lbclose]")) return lb.close();
    if (e.target.closest("[data-prev]")) return show(cur - 1);
    if (e.target.closest("[data-next]")) return show(cur + 1);
    const p = e.target.closest("[data-vplay]"); if (!p) return;
    const w = list[cur], on = p.getAttribute("aria-pressed") !== "true", media = $("[data-media]", lbb);
    p.setAttribute("aria-pressed", on); p.setAttribute("aria-label", on ? "Jeda pratinjau" : "Putar pratinjau"); $("use", p).setAttribute("href", on ? "#i-pause" : "#i-play"); media.classList.toggle("playing", on);
    clearInterval(playT);
    if (on) { let t = +(media.dataset.t || 0); playT = setInterval(() => { t = Math.min(w.len, t + 1); media.dataset.t = t; $("[data-vprog]", lbb).style.width = `${(t / w.len) * 100}%`; $("[data-vt]", lbb).textContent = `${mmss(t)} / ${mmss(w.len)}`; $(".track", lbb).setAttribute("aria-valuenow", t); if (t >= w.len) { clearInterval(playT); p.click(); } }, 250); }
  });
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); });
  lb.addEventListener("close", () => { clearInterval(playT); lbb.innerHTML = ""; if (back && back.isConnected) back.focus({ preventScroll: true }); });

  /* ---------- packages ---------- */
  let pcat = "yb";
  const tabs = $("[data-ptabs]");
  tabs.innerHTML = CATS.map((c) => `<button type="button" role="tab" id="pt-${c.id}" aria-controls="pkg-panel" aria-selected="${c.id === pcat}" tabindex="${c.id === pcat ? 0 : -1}" data-pt="${c.id}">${c.name}</button>`).join("");
  function renderPkgs() {
    $("[data-pkgs]").setAttribute("aria-labelledby", `pt-${pcat}`);
    $("[data-pkgs]").innerHTML = PKGS[pcat].map(([n, price, unit, d, feats, pop]) => `<article class="pkg${pop ? " pop" : ""}">${pop ? '<span class="badge">Paling populer</span>' : ""}<h3>${n}</h3><p class="d">${d}</p><p class="price">${rp(price)} <small>${unit}</small></p><ul>${feats.map((f) => `<li>${icon("i-check")}<span>${f}</span></li>`).join("")}</ul><a class="btn ${pop ? "gold" : "ghost"}" href="${wa(`Halo Lentera Cinema, saya ingin memilih paket ${catById[pcat].name} – ${n} (${rp(price)}${unit ? " " + unit.split(" · ")[0] : ""}). Apakah tanggal saya masih tersedia?`)}" target="_blank" rel="noopener" data-pick="${n}">Pilih Paket</a></article>`).join("");
    $$("[data-pt]").forEach((b) => { const on = b.dataset.pt === pcat; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest("[data-pt]"); if (b) { pcat = b.dataset.pt; renderPkgs(); } });
  tabs.addEventListener("keydown", (e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; e.preventDefault(); const ids = CATS.map((c) => c.id); pcat = ids[(ids.indexOf(pcat) + d + ids.length) % ids.length]; renderPkgs(); $(`[data-pt="${pcat}"]`).focus(); });
  $("[data-cats]").addEventListener("click", (e) => { const a = e.target.closest("[data-cat-go]"); if (a) { pcat = a.dataset.catGo; renderPkgs(); } });
  renderPkgs();

  /* ---------- testimonials, FAQ, about ---------- */
  $("[data-tests]").innerHTML = TESTS.map(([q, n, r]) => `<figure class="test"><div class="stars" role="img" aria-label="5 dari 5 bintang">${icon("i-star").repeat(5)}</div><blockquote>“${esc(q)}”</blockquote><figcaption><span class="av" aria-hidden="true">${n[0]}</span><span><b>${esc(n)}</b>${esc(r)}</span></figcaption></figure>`).join("");
  $("[data-faq]").innerHTML = FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("");
  $("[data-about-img]").innerHTML = Scene.scene("video", 77, "Ilustrasi tim Lentera Cinema sedang merekam");
  const faqs = $$("[data-faq] details"); faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => o !== d && (o.open = false)); }));

  /* ---------- quick WhatsApp form ---------- */
  const qf = $("[data-quick]");
  $("[data-svc-select]").innerHTML = CATS.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  qf.addEventListener("submit", (e) => {
    e.preventDefault(); const n = qf.nama.value.trim(), err = $("[data-qerr]");
    if (n.length < 2) { qf.nama.setAttribute("aria-invalid", "true"); err.textContent = "Isi nama kamu dulu ya."; qf.nama.focus(); return; }
    qf.nama.removeAttribute("aria-invalid"); err.textContent = "";
    const tgl = qf.tanggal.value ? new Date(qf.tanggal.value + "T12:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "belum ditentukan";
    const msg = `Halo Lentera Cinema, saya ${n}. Saya tertarik layanan ${catById[qf.layanan.value].name} untuk tanggal ${tgl}.${qf.pesan.value.trim() ? " " + qf.pesan.value.trim() : ""}`;
    const url = wa(msg); qf.dataset.lastUrl = url;
    window.open(url, "_blank", "noopener");
    toast("Membuka WhatsApp…");
  });

  /* ---------- nav: solid on scroll, spy, burger ---------- */
  const nav = $("[data-nav]"), links = $("[data-links]"), burger = $("[data-burger]");
  addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 40), { passive: true });
  function menu(o) { links.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Tutup menu" : "Buka menu"); $("use", burger).setAttribute("href", o ? "#i-close" : "#i-menu"); }
  burger.addEventListener("click", () => menu(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) menu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("open")) { menu(false); burger.focus(); } });
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) $$("[data-spy]").forEach((a) => a.classList.toggle("on", a.dataset.spy === en.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    ["portofolio", "layanan", "tentang", "kontak"].forEach((id) => spy.observe(document.getElementById(id)));
    if (!reduce) { const rv = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" }); $$(".sec .sec-h, .cats, .pkgs, .tests, .about, .faq-w, .contact").forEach((el) => { el.classList.add("rv"); rv.observe(el); }); }
  }
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon}: tautan contoh di situs demo ini.`); } });
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2600); }
})();
