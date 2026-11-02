"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronRight, Clock3, Compass, Download, Heart, MapPin, Menu, Plane, Search, ShieldCheck, Star, TrainFront, X } from "lucide-react";
import Scene from "./scene";
import { attractions, itineraries, months, neighborhoods, tips, type Category } from "./data";

type PlannerMode = "trip" | "packages" | "hotels";
const categories: Category[] = ["All", "Culture", "Nature", "Food", "Shopping"];
const sectionLinks = [["overview", "Overview"], ["attractions", "Things to do"], ["itinerary", "Itineraries"], ["stay", "Where to stay"], ["tips", "Local tips"], ["weather", "When to go"]];

function makePdf(text: string[]) {
  // A small dependency-free PDF with ASCII text and accurate byte offsets.
  const safe = (s: string) => s.replace(/[^\x20-\x7E]/g, "-").replace(/([\\()])/g, "\\$1");
  const stream = `BT /F1 12 Tf 48 790 Td 17 TL ${text.map((line, i) => `${i ? "T* " : ""}(${safe(line)}) Tj`).join("\n")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(o => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export default function DestinationGuide() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [days, setDays] = useState<3 | 5 | 7>(3);
  const [month, setMonth] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [planner, setPlanner] = useState<PlannerMode | null>(null);
  const [area, setArea] = useState("Shinjuku");
  const [downloaded, setDownloaded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const glance = useRef<HTMLDetailsElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [pace, setPace] = useState("Balanced");
  const [interests, setInterests] = useState<string[]>(["Culture", "Food"]);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = new Date();
  const dateMinimum = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (window.matchMedia("(max-width: 640px)").matches && glance.current) glance.current.open = false;
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("wanderly-tokyo-saved") || "[]");
      if (Array.isArray(stored)) setSaved(stored.filter((id): id is string => typeof id === "string" && attractions.some(a => a.id === id)));
    } catch { setStorageError("Saved places are session-only because browser storage is unavailable."); }
    return () => { if (submitTimer.current) clearTimeout(submitTimer.current); };
  }, []);

  function toggleSave(id: string, name: string) {
    const next = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
    setSaved(next);
    setSaveMessage(`${name} ${next.includes(id) ? "saved to" : "removed from"} your shortlist.`);
    try { localStorage.setItem("wanderly-tokyo-saved", JSON.stringify(next)); }
    catch { setStorageError("Saved places are session-only because browser storage is unavailable."); }
  }
  function openPlanner(mode: PlannerMode = "trip", neighborhood?: string) {
    returnFocus.current = document.activeElement as HTMLElement;
    setPlanner(mode);
    setSubmitted(false);
    setSubmitting(false);
    setFormError("");
    if (neighborhood) setArea(neighborhood);
    dialog.current?.showModal();
    setMenuOpen(false);
  }
  function closePlanner() {
    if (submitTimer.current) clearTimeout(submitTimer.current);
    setSubmitting(false);
    dialog.current?.close();
    setPlanner(null);
    returnFocus.current?.focus();
  }
  function downloadGuide() {
    const lines = [
      "WANDERLY - TOKYO POCKET GUIDE", "Fictional local demo. No reservations or live travel advice.", "",
      "AT A GLANCE", "Currency: Japanese Yen (JPY) | Language: Japanese", "Time zone: JST (UTC+9) | Plugs: Type A | Tipping: not customary",
      "US/EU short-stay entry: often up to 90 days; check official eligibility.", "",
      `YOUR ${days}-DAY OUTLINE`,
      ...itineraries[days].flatMap((day, i) => [`Day ${i + 1}: ${day.title}`, ...day.stops.map(s => `  ${s.time.split(" · ")[0]} - ${s.name}`)]),
      "", `SHORTLIST: ${saved.length ? attractions.filter(a => saved.includes(a.id)).map(a => a.name).join(", ") : "None yet"}`,
      "Best seasons: spring (Mar-May), autumn (Oct-Nov).",
      "Carry yen, use an IC transit card, and avoid morning rush hour.",
      "TeamLab Borderless: Azabudai Hills, not its former Odaiba location.",
      "Illustrations and sample prices are for demonstration only.",
    ];
    // Keep the single-page pocket guide short enough for the seven-day variant.
    const compact = lines.length > 43 ? lines.filter(line => !line.startsWith("  ")) : lines;
    const url = URL.createObjectURL(makePdf(compact));
    const link = document.createElement("a");
    link.href = url; link.download = "wanderly-tokyo-pocket-guide.pdf"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  function submitInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    if (!String(values.get("name") || "").trim()) { setFormError("Please enter your name, not just spaces."); return; }
    if (!travelDate || travelDate < dateMinimum) { setFormError("Choose today or a future departure date."); return; }
    if (!interests.length) { setFormError("Choose at least one interest so we can tailor your plan."); return; }
    setFormError(""); setSubmitting(true);
    submitTimer.current = setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 450);
  }
  const filtered = attractions.filter(a => (category === "All" || a.category === category) && (!savedOnly || saved.includes(a.id)) && `${a.name} ${a.area} ${a.description}`.toLowerCase().includes(query.toLowerCase().trim()));

  return (
    <>
      <a className="skip-link" href="#main">Skip to destination guide</a>
      <header className="site-header">
        <div className="nav-inner">
          <a href="#top" className="logo" aria-label="Wanderly home"><Compass size={30} strokeWidth={1.5} />Wanderly<span className="logo-dot">.</span></a>
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
            <a href="#attractions" onClick={() => setMenuOpen(false)}>Destinations</a>
            <a href="#itinerary" onClick={() => setMenuOpen(false)}>Trip Styles</a>
            <a href="#packages" onClick={() => setMenuOpen(false)}>Deals <span className="tiny-badge">NEW</span></a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About Us</a>
            <a href="#tips" onClick={() => setMenuOpen(false)}>Blog</a>
          </nav>
          <button className="button header-cta" onClick={() => openPlanner()}>Plan My Trip <ArrowRight size={16} /></button>
          <button className="icon-button mobile-menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      <main id="main">
        <div id="top" className="breadcrumb wrap" aria-label="Breadcrumb"><a href="#top">Home</a><ChevronRight size={12} /><a href="#attractions">Destinations</a><ChevronRight size={12} /><span>Asia</span><ChevronRight size={12} /><strong>Tokyo, Japan</strong></div>
        <section className="hero" aria-labelledby="hero-title">
          <Scene kind="skyline" label="Original cinematic illustration of Tokyo at dusk, Mount Fuji beyond a neon-lit skyline" />
          <div className="hero-shade" />
          <div className="hero-content wrap">
            <span className="hero-kicker">🇯🇵 JAPAN <span>35.6762° N · 139.6503° E</span></span>
            <h1 id="hero-title">Tokyo<span className="hero-period">.</span></h1>
            <p className="hero-tagline">Where ancient temples meet<br className="desktop-break" /> neon-lit streets.</p>
            <div className="hero-stats"><span><Plane size={16} />14h from NYC</span><span>☀ Best: Mar–May, Oct–Nov</span><span>¥ $$$ Moderate</span><span>文 Japanese</span></div>
            <button className="button" onClick={() => openPlanner()}>Start Planning <ArrowRight size={17} /></button>
          </div>
          <div className="hero-caption">TOKYO, REIMAGINED · ORIGINAL WANDERLY ILLUSTRATION</div>
          <a className="hero-scroll" href="#overview" aria-label="Explore the guide"><ArrowDown size={19} /></a>
        </section>
        <div className="section-nav"><nav className="wrap" aria-label="Guide sections">{sectionLinks.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav></div>
        <div className="guide-layout wrap">
          <div className="editorial">
            <section id="overview" className="overview section">
              <div className="section-eyebrow">THE CITY OF BEAUTIFUL CONTRASTS</div>
              <div className="overview-grid">
                <div><h2>A thousand worlds.<br />One extraordinary city.</h2>
                  <p>Tokyo is a city of contrasts — a place where centuries-old shrines sit in the shadow of soaring skyscrapers, where Michelin-starred sushi bars share streets with bustling ramen stalls, and where cutting-edge technology coexists with deeply rooted tradition. With 14 million residents, the world&apos;s largest metropolitan area offers endless discovery.</p>
                  <p className="editor-note">Come for the bright lights. Stay for the quiet moments between them.</p>
                </div>
                <div className="collage"><Scene kind="temple" label="Original illustration of Senso-ji among blossoms" /><Scene kind="market" label="Original illustration of a Tokyo food market" /><span className="collage-note">Find your kind<br />of Tokyo.</span></div>
              </div>
              <div className="highlights">{[
                ["🏯", "38,000+", "temples & shrines across Japan"],
                ["🍣", "A food lover’s capital", "More Michelin stars than any city"],
                ["🚄", "200 mph", "bullet-train adventures"],
                ["🌸", "Blossom season", "a little magic in late March"],
                ["🎮", "Play, discover, repeat", "the home of gaming & anime"],
                ["🛍️", "Your style, your street", "shopping for every taste"],
              ].map(([icon, title, detail]) => <div key={title}><span className="highlight-icon">{icon}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</div>
              <p className="fine-print">Guide facts are illustrative and should be checked before travel. The shrine count refers to Japan, not Tokyo alone.</p>
            </section>
            <section id="attractions" className="section">
              <div className="section-eyebrow">MAKE ROOM FOR WONDER</div>
              <div className="section-heading"><h2>Must-See Attractions</h2><span className="small-note">Six places. Endless stories.</span></div>
              <div className="attraction-tools">
                <div className="filter-tabs" aria-label="Attraction categories">{categories.map(c => <button key={c} aria-pressed={category === c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
                <label className="search-field"><Search size={16} /><input aria-label="Search attractions" placeholder="Find your next stop" value={query} onChange={e => setQuery(e.target.value)} /></label>
              </div>
              <div className="shortlist-row"><button className={`text-button ${savedOnly ? "selected" : ""}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Heart size={15} />My saved places ({saved.length})</button><span aria-live="polite">{filtered.length} {filtered.length === 1 ? "place" : "places"} to explore</span></div>
              <div className="sr-only" role="status">{saveMessage}</div>
              {storageError && <p role="status" className="fine-print">{storageError}</p>}
              {filtered.length ? <div className="attraction-grid">{filtered.map(a => <article className="attraction-card" key={a.id}>
                <div className="card-image"><Scene kind={a.scene} label={`Original illustration inspired by ${a.name}`} /><span className="image-tag"><MapPin size={12} />{a.area}</span><button className={`save-button ${saved.includes(a.id) ? "saved" : ""}`} aria-label={`${saved.includes(a.id) ? "Unsave" : "Save"} ${a.name}`} aria-pressed={saved.includes(a.id)} onClick={() => toggleSave(a.id, a.name)}><Heart size={18} fill={saved.includes(a.id) ? "currentColor" : "none"} /></button></div>
                <div className="card-body"><div className="card-title"><h3>{a.name}</h3><span className="rating"><Star size={12} fill="currentColor" />{a.rating}</span></div><p>{a.description}</p><div className="card-meta"><span><Clock3 size={13} />{a.time}</span><strong>{a.cost}</strong></div></div>
              </article>)}</div> : <div className="empty-state"><Compass size={30} /><h3>No places found, yet.</h3><p>{savedOnly ? "Save a place with its heart icon, or broaden your filters." : "Try a neighborhood name or a different category."}</p><button className="button outline" onClick={() => { setCategory("All"); setQuery(""); setSavedOnly(false); }}>Reset filters</button></div>}
              <p className="fine-print">Ratings are fictional demo scores, not live reviews. *Sample ticket price, not a quote. Borderless moved from Odaiba to Azabudai Hills; check current prices and hours.</p>
            </section>
            <section id="itinerary" className="section itinerary-section">
              <div className="section-eyebrow">LESS PLANNING. MORE EXPLORING.</div>
              <div className="section-heading"><h2>Your Tokyo, day by day</h2><span className="small-note">A starting point, not a schedule.</span></div>
              <div className="itinerary-tabs" role="tablist" aria-label="Itinerary duration">
                {([3, 5, 7] as const).map((d, i) => <button role="tab" key={d} id={`tab-${d}`} aria-controls="itinerary-panel" aria-selected={days === d} tabIndex={days === d ? 0 : -1} className={days === d ? "active" : ""} onClick={() => setDays(d)} onKeyDown={event => {
                  if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
                    event.preventDefault();
                    const next = event.key === "Home" ? 3 : event.key === "End" ? 7 : ([3, 5, 7] as const)[(i + (event.key === "ArrowRight" ? 1 : 2)) % 3];
                    setDays(next); document.getElementById(`tab-${next}`)?.focus();
                  }
                }}><strong>{d} Days</strong><span>{d === 3 ? "Highlights" : d === 5 ? "Deep Dive" : "Complete Tokyo"}</span>{d === 3 && <small>MOST POPULAR</small>}</button>)}
              </div>
              <div id="itinerary-panel" role="tabpanel" aria-labelledby={`tab-${days}`} tabIndex={0} className="day-list">{itineraries[days].map((day, i) => <article className="day" key={day.title}>
                <div className="day-image"><Scene kind={day.scene} label={`Original illustration for ${day.title}`} /><span>DAY {String(i + 1).padStart(2, "0")}</span></div>
                <div className="day-content"><h3>{day.title}</h3><ol className="timeline">{day.stops.map((stop, n) => <li key={stop.name}><span className="timeline-icon">{n === 0 ? <Compass size={13} /> : <MapPin size={13} />}</span><div><span className="stop-time">{stop.time}</span><strong>{stop.name}</strong><p>{stop.detail}</p></div></li>)}</ol><p className="meal-note">🍜 {day.meal}</p></div>
              </article>)}</div>
              <div className="itinerary-bottom"><p><Check size={17} />Go at your pace. We&apos;ll help make it yours.</p><button className="button" onClick={() => openPlanner()}>Customize This Itinerary <ArrowRight size={16} /></button></div>
            </section>
            <section id="stay" className="section">
              <div className="section-eyebrow">FIND YOUR HOME BASE</div>
              <div className="section-heading"><h2>Best Neighborhoods to Stay</h2><button className="text-button" onClick={() => openPlanner("hotels")}>View All Hotels <ArrowRight size={15} /></button></div>
              <div className="neighborhood-grid">{neighborhoods.map(n => <article className="neighborhood-card" key={n.name}><div className="card-image"><Scene kind={n.scene} label={`Original neighborhood illustration of ${n.name}`} /><span className="neighborhood-name">{n.name}</span></div><div className="card-body"><span className="best-tag">Best for: {n.best}</span><p>{n.description}</p><div className="transit"><TrainFront size={13} />{n.transit}</div><button className="neighborhood-price" onClick={() => openPlanner("hotels", n.name)}><span>From <strong>${n.price}</strong><small>/night</small></span><ArrowRight size={17} /></button><span className="fine-print">Typical demo range: {n.range}/night</span></div></article>)}</div>
            </section>
            <section id="tips" className="section tips-section">
              <div className="section-eyebrow">THE LITTLE THINGS MAKE THE TRIP</div>
              <h2>Insider Tips from Our Travel Experts</h2>
              <p className="section-intro">A little local know-how goes a long way.</p>
              <div className="tips-grid">{tips.map(([icon, title, text]) => <div key={title} className="tip"><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
            </section>
            <section id="weather" className="section">
              <div className="section-eyebrow">EVERY SEASON TELLS A DIFFERENT STORY</div>
              <h2>When will Tokyo be yours?</h2>
              <p className="section-intro">Spring blossoms or autumn gold? Find your perfect moment.</p>
              <div className="weather-legend"><span><i className="best" />Best</span><span><i className="good" />Good</span><span><i className="hot" />Hot / Rainy</span><span><i className="cold" />Cold · good for fewer crowds</span></div>
              <div className="month-chart" aria-label="Monthly Tokyo weather; select a month for details">{months.map((m, i) => <button key={m.name} className={`month ${m.mood === "Best" ? "best" : m.mood === "Good" ? "good" : m.mood === "Cold" ? "cold" : "hot"} ${month === i ? "active" : ""}`} aria-pressed={month === i} aria-label={`${m.name}: ${m.temp}°C, ${m.rain} mm rain, ${m.mood}`} onClick={() => setMonth(i)}><span>{m.name}</span><div className="weather-bar"><i style={{ height: `${m.temp * 2 + 10}px` }} /></div><strong>{m.temp}°</strong><small>{m.rain}mm</small></button>)}</div>
              <div className="weather-detail" role="status"><span className="weather-symbol">{months[month].mood === "Best" ? "✿" : months[month].mood === "Cold" ? "❄" : "☂"}</span><div><h3>{months[month].name} in Tokyo <span>{months[month].mood}</span></h3><p>{months[month].note}</p></div></div>
              <div className="event-grid"><div>🌸 <strong>Cherry blossoms</strong><span>Late March · a fleeting kind of magic</span></div><div>🎆 <strong>Sumidagawa Fireworks</strong><span>July · the sky puts on a show</span></div><div>🍁 <strong>Autumn leaves</strong><span>November · parks turn to gold</span></div></div>
              <p className="fine-print">Illustrative average temperatures and rainfall, not a live forecast. Spring is generally mild (15–22°C); autumn often 15–20°C. June–August brings rain, heat, and humidity.</p>
            </section>
            <section id="reviews" className="section reviews-section">
              <div className="section-eyebrow">MEMORIES WORTH BRINGING HOME</div>
              <h2>What Travelers Say About Tokyo</h2>
              <p className="fine-print">Fictional travelers and sample testimonials created for this demo — not real endorsements.</p>
              <div className="review-grid">{[
                ["JR", "James R.", "5 days · October", "Tokyo exceeded every expectation. The food alone is worth the flight."],
                ["PM", "Priya & Anil M.", "7 days · April", "We felt so safe walking around at midnight. The city is incredibly clean and the people are so kind."],
                ["SL", "Sophie L.", "10 days · November", "Third time visiting and I still discover something new every day."],
              ].map(([initials, name, trip, quote], i) => <figure key={name}><span className="review-stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>“{quote}”</blockquote><figcaption><svg className={`avatar avatar-${i}`} viewBox="0 0 48 48" role="img" aria-label={`Original fictional avatar for ${name}`}><rect width="48" height="48" rx="24" fill={["#ead8c3", "#d9e7dd", "#e5dce7"][i]} /><circle cx="24" cy="18" r="8" fill="#8a6e60" /><path d="M9 47c0-23 30-23 30 0" fill="#4c7773" /><text x="24" y="42" textAnchor="middle" fontSize="9" fill="white">{initials}</text></svg><div><strong>{name}</strong><span>{trip}</span></div></figcaption></figure>)}</div>
            </section>
          </div>
          <aside className="glance-sidebar" aria-label="Tokyo practical information">
            <details ref={glance} className="glance-card" open><summary><span><Compass size={20} />Tokyo at a glance</span><ChevronRight size={15} /></summary><div className="glance-content">
              <div className="glance-location"><span>🇯🇵</span><div><strong>Tokyo, Japan</strong><small>Asia · Your next chapter</small></div></div>
              <dl>{[
                ["Currency", "Japanese Yen (¥)"],
                ["Language", "Japanese", "English widely understood in tourist areas"],
                ["Time Zone", "JST (UTC+9)"],
                ["Visa", "Up to 90 days visa-free*", "For eligible US/EU short-stay visitors"],
                ["Plug Type", "Type A (US-compatible)", "100V supply; check your device"],
                ["Tipping", "Not customary"],
              ].map(([label, value, detail]) => <div key={label}><dt>{label}</dt><dd>{value}{detail && <small>{detail}</small>}</dd></div>)}</dl>
              <div className="safety"><ShieldCheck size={22} /><div><span>★★★★★</span><strong>Very Safe</strong><small>Use normal city precautions</small></div></div>
              <button className="button outline full" onClick={downloadGuide}><Download size={15} />Download PDF Guide</button>
              {downloaded && <p role="status" className="download-status">Your local pocket guide is ready.</p>}
              <button className="button full" onClick={() => openPlanner()}>Book This Destination <ArrowRight size={15} /></button>
              <p className="fine-print">Demo inquiry only. No bookings or payments.<br />*Entry rules vary; verify with official sources.</p>
            </div></details>
            <div className="sidebar-note"><span>✦</span><h3>Not just a trip.<br />A story you&apos;ll tell.</h3><p>Thoughtfully planned.<br />Wonderfully yours.</p><a href="#itinerary">Find your itinerary <ArrowRight size={14} /></a></div>
          </aside>
        </div>
        <section id="packages" className="final-cta">
          <div className="wrap"><span className="section-eyebrow">A LITTLE CURIOSITY CAN TAKE YOU A LONG WAY</span><h2>Ready to Explore Tokyo?</h2><p>Our travel experts will craft a personalized itinerary just for you.</p><div className="cta-actions"><button className="button white" onClick={() => openPlanner()}>Plan My Tokyo Trip <ArrowRight size={16} /></button><button className="button white-outline" onClick={() => openPlanner("packages")}>Browse Tokyo Packages</button></div><span className="package-price">Starting from <strong>$2,899/person</strong> · 7 days · Flights + Hotels + Experiences</span><small>Illustrative package only. No live availability or reservations.</small></div><span className="cta-decoration" aria-hidden="true">東<br />京</span>
        </section>
      </main>
      <footer id="about" className="site-footer wrap"><div className="footer-top"><div className="footer-brand"><a href="#top" className="logo"><Compass size={28} />Wanderly.</a><p>Go somewhere.<br />Feel something.<br />Bring a little wonder home.</p><div className="social-links" aria-label="Social platforms">{["Instagram", "Facebook", "Pinterest", "YouTube", "TikTok"].map((name, i) => <a key={name} href={`https://www.${["instagram", "facebook", "pinterest", "youtube", "tiktok"][i]}.com/`} target="_blank" rel="noreferrer" aria-label={`${name} platform home (not a Wanderly profile)`}>{["◎", "f", "p", "▶", "♪"][i]}</a>)}</div></div>
        {[
          ["Destinations", ["Tokyo, Japan", "#top"], ["Asia discoveries", "#attractions"], ["City escapes", "#stay"]],
          ["Trip Styles", ["Culture & heritage", "#attractions"], ["Food adventures", "#tips"], ["Slow travel", "#itinerary"]],
          ["Company", ["About Wanderly", "#about"], ["Travel journal", "#tips"], ["Our philosophy", "#overview"]],
          ["Support", ["Plan your trip", "#packages"], ["Practical guide", "#weather"], ["Travel essentials", "#tips"]],
        ].map(([title, ...links]) => <div key={title as string} className="footer-column"><h3>{title as string}</h3>{(links as string[][]).map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>)}
      </div><div className="footer-bottom"><span>© 2026 Wanderly Travel Co. · Fictional local demo</span><span>Original vector illustrations · No external services connected</span></div><p className="fine-print">This single-destination demo maps navigation to relevant sections. Social links go to platform homepages, not fictional brand accounts. No real travel company, testimonials, or endorsements are represented.</p></footer>
      <div className="mobile-bottom"><div><small>Your next adventure</small><strong>Tokyo, Japan 🇯🇵</strong></div><button className="button" onClick={() => openPlanner()}>Plan My Trip <ArrowRight size={15} /></button></div>
      <dialog ref={dialog} className="planner-dialog" aria-labelledby="planner-title" onCancel={e => { e.preventDefault(); closePlanner(); }} onClick={e => { if (e.target === dialog.current) closePlanner(); }}>
        <div className="planner-shell">
          <button className="icon-button dialog-close" aria-label="Close trip planner" onClick={closePlanner}><X size={22} /></button>
          <div className="section-eyebrow">MAKE IT YOUR TOKYO</div>
          <h2 id="planner-title">{submitted ? "Your demo plan is ready." : planner === "hotels" ? "Find your Tokyo home base" : planner === "packages" ? "A week of Tokyo wonder" : `Your ${days}-day Tokyo adventure`}</h2>
          {submitted ? <div className="confirmation" role="status"><span className="confirmation-check"><Check size={28} /></span><p>We&apos;ve put together your local preview. <strong>No inquiry was sent, and nothing was booked.</strong></p><dl><div><dt>Departure</dt><dd>{travelDate}</dd></div><div><dt>Your trip</dt><dd>{days} days · {travelers} travelers · {pace} pace</dd></div><div><dt>Home base</dt><dd>{area}</dd></div><div><dt>Your interests</dt><dd>{interests.join(", ")}</dd></div><div><dt>Saved places</dt><dd>{saved.length ? attractions.filter(a => saved.includes(a.id)).map(a => a.name).join(", ") : "Let curiosity lead the way"}</dd></div></dl><p className="fine-print">This preview stays in memory for this visit. Your name and email are not stored or transmitted.</p><button className="button full" onClick={downloadGuide}><Download size={16} />Download itinerary PDF</button>{downloaded && <p role="status" className="download-status">Your local pocket guide is ready.</p>}<button className="text-button" onClick={() => setSubmitted(false)}>Edit my preferences</button></div>
            : <><p className="planner-intro">A thoughtful starting point, tailored to you. This is a local planning demo — no live bookings, payments, or email.</p>
              {planner === "packages" && <div className="package-preview"><span>THE COMPLETE TOKYO · SAMPLE PACKAGE</span><strong>$2,899 <small>per person</small></strong><p>7 days · Flights + 6 hotel nights + curated experiences</p><button className="text-button" onClick={() => setDays(7)}>Use the 7-day itinerary <ArrowRight size={14} /></button></div>}
              {planner === "hotels" && <div className="hotel-options">{neighborhoods.map(n => <button key={n.name} aria-pressed={area === n.name} className={area === n.name ? "active" : ""} onClick={() => setArea(n.name)}><strong>{n.name}</strong><span>From ${n.price}/night</span><small>{n.best}</small></button>)}</div>}
              <form onSubmit={submitInquiry}>
                <div className="form-grid"><label>Your name<input name="name" autoComplete="name" required maxLength={80} placeholder="Alex Morgan" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={150} placeholder="alex@example.com" /></label><label>Departure date<input name="date" type="date" required min={dateMinimum} value={travelDate} onChange={e => setTravelDate(e.target.value)} /></label><label>Travelers<select value={travelers} onChange={e => setTravelers(e.target.value)}>{["1", "2", "3", "4", "5", "6"].map(n => <option key={n}>{n}</option>)}</select></label><label>Trip length<select value={days} onChange={e => setDays(Number(e.target.value) as 3 | 5 | 7)}><option value="3">3 days — Highlights</option><option value="5">5 days — Deep Dive</option><option value="7">7 days — Complete Tokyo</option></select></label><label>Your pace<select value={pace} onChange={e => setPace(e.target.value)}><option>Balanced</option><option>Slow & easy</option><option>See it all</option></select></label><label className="span-two">Preferred neighborhood<select value={area} onChange={e => setArea(e.target.value)}>{neighborhoods.map(n => <option key={n.name}>{n.name}</option>)}</select></label></div>
                <fieldset className="interest-options"><legend>What brings you to Tokyo? <span>(choose at least one)</span></legend>{["Culture", "Food", "Nature", "Shopping", "Gaming"].map(interest => <label key={interest}><input type="checkbox" checked={interests.includes(interest)} onChange={() => setInterests(interests.includes(interest) ? interests.filter(i => i !== interest) : [...interests, interest])} /><span>{interest}</span></label>)}</fieldset>
                <label className="consent"><input type="checkbox" required />I understand this creates a local demo preview, not a booking or real inquiry.</label>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <button className="button full" type="submit" disabled={submitting}>{submitting ? "Creating your local preview…" : "Create My Demo Trip"}{!submitting && <ArrowRight size={16} />}</button>
              </form>
            </>}
        </div>
      </dialog>
    </>
  );
}
