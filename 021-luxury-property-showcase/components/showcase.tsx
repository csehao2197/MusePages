"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bath, BedDouble, CalendarDays, Check, ChevronDown, Heart, KeyRound, Maximize2, Menu, ShieldCheck, Sparkles, Square, Utensils, Wifi, X } from "lucide-react";
import Scene from "./scene";
import { amenities, features, homes, money, places, planRooms, rooms, type Home } from "./data";

type Overlay = { type: "gallery"; index: number } | { type: "home"; home: Home } | { type: "info"; title: string; text: string } | { type: "tour" };
const icons = [Utensils, Bath, Sparkles, Wifi, Square, ShieldCheck];
const homeScenes: Record<string, number> = { meridian: 0, apex: 1, harbor: 10, park: 3 };

export default function Showcase() {
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [storageNote, setStorageNote] = useState("");
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [tourRoom, setTourRoom] = useState(0);
  const [planRoom, setPlanRoom] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [place, setPlace] = useState(0);
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("All");
  const [beds, setBeds] = useState("All");
  const [budget, setBudget] = useState("All");
  const [sort, setSort] = useState("featured");
  const [onlySaved, setOnlySaved] = useState(false);
  const [mode, setMode] = useState("viewing");
  const [viewingHome, setViewingHome] = useState(homes[0]);
  const [confirmation, setConfirmation] = useState("");
  const [formError, setFormError] = useState("");
  const [today, setToday] = useState("");
  const [payment, setPayment] = useState<number | null>(21793);
  const [estimateError, setEstimateError] = useState("");
  const [purchase, setPurchase] = useState("4200000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.75");
  const [years, setYears] = useState("30");
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`);
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("meridian-saved") || "[]");
      if (Array.isArray(stored)) setSaved(stored.filter((id): id is string => typeof id === "string" && homes.some(home => home.id === id)));
    } catch { setStorageNote("Saved homes are available for this session; browser storage is unavailable."); }
  }, []);
  useEffect(() => {
    if (overlay && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [overlay]);

  function open(value: Overlay) {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOverlay(value);
  }
  function close() {
    dialog.current?.close();
    setOverlay(null);
    requestAnimationFrame(() => opener.current?.focus());
  }
  function save(id: string) {
    const next = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem("meridian-saved", JSON.stringify(next)); }
    catch { setStorageNote("Saved for this session only; browser storage is unavailable."); }
  }
  function goViewing(nextMode = "viewing", home = homes[0]) {
    setViewingHome(home); setMode(nextMode); setConfirmation(""); setFormError(""); setMenu(false);
    document.getElementById("viewing")?.scrollIntoView({ behavior: "auto" });
    requestAnimationFrame(() => document.getElementById("full-name")?.focus({ preventScroll: true }));
  }
  function requestViewing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "");
    if (!name || phone.replace(/\D/g, "").length < 7) { setFormError("Enter your full name and a phone number with at least 7 digits."); return; }
    if (mode === "viewing") {
      if (String(data.get("date")) < today) { setFormError("Choose today or a future date."); return; }
      if (data.get("time") === "18:00") { setFormError("The 6:00 PM demo slot is unavailable. Choose another time and retry; nothing was sent."); return; }
    }
    setFormError("");
    setConfirmation(mode === "viewing" ? `Private viewing preview for ${viewingHome.address} created for ${data.get("date")} at ${data.get("time")}.` : `Your inquiry preview about ${viewingHome.address} is ready.`);
    event.currentTarget.reset();
    requestAnimationFrame(() => document.getElementById("confirmation")?.focus());
  }
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(purchase), percentage = Number(down), interest = Number(rate), term = Number(years);
    if (!Number.isFinite(price) || price <= 0 || percentage < 0 || percentage > 100 || interest < 0 || interest > 25 || term < 1 || term > 40) {
      setEstimateError("Use a positive price, 0–100% down, 0–25% interest and a 1–40 year term."); setPayment(null); return;
    }
    const loan = price * (1-percentage/100), monthly = interest/1200, months = term*12;
    setPayment(monthly === 0 ? loan/months : loan*monthly/(1-Math.pow(1+monthly,-months)));
    setEstimateError("");
  }
  const filtered = homes.filter(home => (!query || `${home.name} ${home.address}`.toLowerCase().includes(query.toLowerCase())) && (district === "All" || home.district === district) && (beds === "All" || home.beds >= Number(beds)) && (budget === "All" || home.price <= Number(budget)) && (!onlySaved || saved.includes(home.id)))
    .sort((a,b) => sort === "low" ? a.price-b.price : sort === "high" ? b.price-a.price : sort === "area" ? b.area-a.area : 0);
  function resetFilters() { setQuery(""); setDistrict("All"); setBeds("All"); setBudget("All"); setSort("featured"); setOnlySaved(false); }
  const neighborhood = <><div className="map-art" aria-label="Illustrative neighborhood diagram, not a real map"><div className="map-water">THE HARBOR</div><div className="map-park">CENTRAL PARK</div><div className="map-street street-one"/><div className="map-street street-two"/><div className="map-street street-three"/><span className="map-home">M<span>THE MERIDIAN</span></span>{places.map((item,i) => <button key={item[0]} className={`map-pin pin-${i} ${place === i ? "active" : ""}`} aria-label={`Explore ${item[0]}`} aria-pressed={place === i} onClick={() => setPlace(i)}>{i+1}</button>)}<span className="map-caption">CONCEPT MAP · NOT TO SCALE</span></div><div className="map-description" role="status"><strong>{places[place][0]} · {places[place][1]}</strong><p>{places[place][2]} All locations and journey times are fictional.</p></div></>;

  return <>
    <a className="skip" href="#overview">Skip to property overview</a>
    <header className="nav">
      <a className="brand" href="#top" aria-label="Sterling home">STERLING<span>LUXURY GROUP</span></a>
      <nav className={menu ? "nav-links open" : "nav-links"} aria-label="Main navigation">
        {[["The residence","overview"],["The collection","gallery"],["The neighborhood","neighborhood"]].map(([text,id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{text}</a>)}
        <button className="nav-view" onClick={() => goViewing()}>Arrange a viewing <ArrowUpRight size={15}/></button>
      </nav>
      <button className="menu-toggle" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </header>
    <main id="top">
      <section className="hero">
        <Scene label="Penthouse living room at dusk" className="hero-art"/>
        <div className="hero-shade"/>
        <div className="hero-topline"><span>EXCEPTIONAL HOMES. EXTRAORDINARY LIVES.</span><span>DOWNTOWN · FICTIONAL CITY</span></div>
        <div className="hero-content"><p className="eyebrow light">THE STERLING COLLECTION / NO. 042</p><h1>The Meridian<br/><em>Penthouse</em></h1><p className="hero-subtitle">Crown Jewel of Downtown Living</p><div className="hero-bottom"><span className="hero-price">$4,200,000 <small>USD · FICTIONAL ASKING PRICE</small></span><button className={`save-hero ${saved.includes("meridian") ? "is-saved" : ""}`} aria-label={saved.includes("meridian") ? "Unsave Meridian" : "Save Meridian"} aria-pressed={saved.includes("meridian")} onClick={() => save("meridian")}><Heart size={18} fill={saved.includes("meridian") ? "currentColor" : "none"}/> {saved.includes("meridian") ? "Residence saved" : "Save this residence"}</button></div></div>
        <a href="#overview" className="scroll-link"><ArrowDown size={18}/><span>DISCOVER THE RESIDENCE</span></a>
        <span className="art-credit">ORIGINAL ARCHITECTURAL CONCEPT · NOT A PHOTOGRAPH</span>
      </section>
      <div className="details-bar">
        <details className="mobile-stats"><summary>4 beds · 3.5 baths · 3,800 sq ft <ChevronDown size={16}/></summary><p>42nd floor · 2 parking spaces</p></details>
        <div className="stats"><span><BedDouble/> <strong>4</strong> Bedrooms</span><span><Bath/> <strong>3.5</strong> Bathrooms</span><span><Square/> <strong>3,800</strong> sq ft</span><span><strong>42</strong> Floor</span><span><KeyRound/> <strong>2</strong> Parking</span></div>
        <button className="button" onClick={() => goViewing()}>Schedule private viewing <ArrowUpRight size={16}/></button>
      </div>
      <div className="demo-note"><span className="gold-dot"/> A fictional residence, beautifully imagined. All listings, people, availability and claims are illustrative. No real transactions.</div>
      <section className="section overview" id="overview">
        <div className="overview-art"><Scene variant={2} label="Open-concept kitchen and dining"/><span className="image-caption">01 / A SPACE TO GATHER</span><div className="image-tag">270°<span>AN IMAGINED PANORAMA</span></div></div>
        <div className="overview-copy"><p className="eyebrow">THE ART OF LIVING WELL</p><h2>Unparalleled<br/><em>urban living.</em></h2><div className="gold-rule"/><p>Perched on the 42nd floor of The Meridian, this imagined full-floor penthouse frames a 270-degree panorama of skyline, harbor and distant mountains. Light moves through 3,800 sq ft of carefully composed interiors, from sunrise to the last glow of evening.</p><p>The fictional design story credits architect Elena Vasquez, pairing Italian marble details and custom walnut cabinetry with wide-plank European oak. Every space invites a quieter, more considered way of living.</p><p className="fine">Concept listing ID: 2026-MER-4201 · Not an actual MLS listing. Architect and award references are fictional; no award or certification is asserted.</p><div className="agent"><div className="agent-monogram" aria-label="Illustrated agent monogram">AS</div><div><strong>Alexandra Sterling</strong><span>Fictional advisor · Sterling Luxury Group</span><button className="text-link" onClick={() => goViewing("inquiry")}>Contact agent <ArrowUpRight size={14}/></button></div></div></div>
      </section>
      <section className="section gallery-section" id="gallery"><div className="section-heading"><div><p className="eyebrow">A CLOSER LOOK</p><h2>Extraordinary, <em>in every detail.</em></h2></div><span className="fine">16 original concept illustrations<br/>Select any scene to explore</span></div>
        <div className="gallery-grid">{rooms.map((room,i) => <button className={`gallery-item gallery-${i}`} key={room} onClick={() => open({ type: "gallery", index: i })} aria-label={`Open gallery: ${room}`}><Scene variant={i} label={room}/><span><span>{String(i+1).padStart(2,"0")} / {room}</span><Maximize2 size={17}/></span></button>)}</div>
        <p className="fine">Concept scenes replace listing photography. On mobile, swipe horizontally; every scene also supports keyboard navigation.</p>
      </section>
      <section className="section floor-section" id="floor-plan"><div className="section-heading"><div><p className="eyebrow">ROOM TO BREATHE</p><h2>A considered <em>composition.</em></h2></div><a className="text-link" href="/floor-plan" download>Download floor plan PDF <ArrowDown size={16}/></a></div>
        <div className="floor-layout"><div><div className="plan-controls"><button aria-label="Zoom floor plan out" disabled={zoom === 1} onClick={() => setZoom(Math.max(1,zoom-.25))}>−</button><span>{Math.round(zoom*100)}%</span><button aria-label="Zoom floor plan in" disabled={zoom === 2} onClick={() => setZoom(Math.min(2,zoom+.25))}>+</button><button onClick={() => setZoom(1)}>Reset zoom</button></div><div className="plan-viewport" tabIndex={0} aria-label="Scrollable schematic floor plan"><div className="plan" style={{ width: `${zoom*100}%` }}><div className="terrace">PRIVATE TERRACE · 600 SQ FT</div><div className="plan-grid">{planRooms.map(([name,dim],i) => <button key={name} className={`plan-cell cell-${i} ${planRoom === i ? "selected" : ""}`} aria-pressed={planRoom === i} onClick={() => setPlanRoom(i)}><span>{name}</span><small>{dim}</small><Square size={24}/></button>)}<div className="plan-circulation">PRIVATE LIFT / CIRCULATION / 3.5 BATHS</div></div><div className="plan-compass">N ↑ &nbsp; CONCEPT ONLY · NOT TO SCALE</div></div></div></div><aside className="plan-summary"><p className="eyebrow">INTERIOR LIVING AREA</p><h3>3,800 <small>sq ft</small></h3><p>Plus a separate 600 sq ft terrace.</p><hr/><div role="status"><strong>{planRooms[planRoom][0]}</strong><p>{planRooms[planRoom][1]} · dimensions in feet</p></div><p className="fine">Select a room to explore. This schematic is not surveyed, not to scale and not for construction. Room rectangles do not represent dimensional proportions; remaining area includes baths and circulation.</p></aside></div>
      </section>
      <section className="section features-section"><p className="eyebrow">NOTHING OVERLOOKED</p><h2>The distinction is <em>in the details.</em></h2><p className="fine">Illustrative specification only. Product names describe the fictional brief, not partnerships or endorsements.</p><div className="features-grid">{features.map(([name,...items],i) => { const Icon = icons[i]; return <details key={name} open className="feature"><summary><Icon size={23}/><span>{name}</span><ChevronDown size={16}/></summary><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></details>; })}</div></section>
      <section className="section amenities-section"><div className="section-heading"><div><p className="eyebrow">BEYOND YOUR FRONT DOOR</p><h2>A world <em>of your own.</em></h2></div><div className="carousel-controls"><button aria-label="Previous amenities" onClick={() => document.getElementById("amenity-strip")?.scrollBy({ left: -350, behavior: "auto" })}><ArrowLeft/></button><button aria-label="Next amenities" onClick={() => document.getElementById("amenity-strip")?.scrollBy({ left: 350, behavior: "auto" })}><ArrowRight/></button></div></div><div className="amenity-strip" id="amenity-strip" tabIndex={0} aria-label="Building amenities, horizontally scrollable">{amenities.map(([name,text],i) => <article key={name}><Scene variant={[13,14,9,15,0,6,10,12][i]} label={name}/><span className="eyebrow">0{i+1} / RESIDENT PRIVILEGES</span><h3>{name}</h3><p>{text}</p></article>)}</div></section>
      <section className="section neighborhood" id="neighborhood"><div className="section-heading"><div><p className="eyebrow">CONNECTED. YET A WORLD APART.</p><h2>The city, <em>at your feet.</em></h2></div><p className="fine">Fictional district · no live map or location tracking</p></div><div className="neighborhood-grid"><div>{neighborhood}</div><div><p className="neighborhood-intro">A morning by the harbor. An evening in the city.<br/>An imagined address at the center of it all.</p><div className="places">{places.map(([name,time],i) => <button aria-pressed={place === i} key={name} onClick={() => setPlace(i)}><span>0{i+1} &nbsp; {name}</span><small>{time}</small><ArrowUpRight size={15}/></button>)}</div><div className="scores">{[["96","Walk"],["92","Transit"],["88","Bike"]].map(([score,label]) => <div key={label}><span>{score}</span><small>{label}</small></div>)}</div><p className="fine">Illustrative mobility scores, not verified Walk Score® ratings. No real distances, Michelin stars or neighborhood claims.</p></div></div></section>
      <section className="section tour-section" id="tour"><div className="tour-copy"><p className="eyebrow light">STEP INSIDE, FROM ANYWHERE</p><h2>Take the <em>virtual tour.</em></h2><p>A room-by-room architectural preview.<br/>Find your favorite perspective.</p><p className="fine">Local illustrated walkthrough, adapted from the 3D/video brief. No Matterport, video service or tracking.</p></div><div className="tour-preview"><Scene variant={tourRoom} label={rooms[tourRoom]}/><button className="tour-expand" aria-label="Open immersive virtual tour" onClick={() => open({ type: "tour" })}><Maximize2 size={18}/> Expand preview</button><div className="tour-room-controls">{[0,2,3,10].map(i => <button key={i} aria-pressed={tourRoom === i} onClick={() => setTourRoom(i)}>{["Living","Kitchen","Suite","Terrace"][[0,2,3,10].indexOf(i)]}</button>)}</div></div></section>
      <section className="section finance-section" id="estimate"><div><p className="eyebrow">PLAN YOUR POSSIBILITIES</p><h2>A little <em>perspective.</em></h2><p>Explore a hypothetical principal-and-interest payment.<br/>Not a financing offer or investment recommendation.</p><button className="text-link" onClick={() => open({ type: "info", title: "About pre-approval", text: "This local showcase cannot pre-approve you or connect to a lender. No financial data is sent. For real financing, consult an independently chosen qualified professional. You can preview a general inquiry below without submitting it." })}>Get pre-approved — demo information <ArrowUpRight size={16}/></button></div><form className="calculator" onSubmit={calculate}><div className="calculator-fields"><label>Purchase price (USD)<input type="number" required min="1" max="1000000000" step="1" value={purchase} onChange={e => setPurchase(e.target.value)}/></label><label>Down payment (%)<input type="number" required min="0" max="100" step=".1" value={down} onChange={e => setDown(e.target.value)}/><small>{money(Number(purchase)*Number(down)/100)} USD</small></label><label>Annual interest (%)<input type="number" required min="0" max="25" step=".01" value={rate} onChange={e => setRate(e.target.value)}/></label><label>Loan term (years)<input type="number" required min="1" max="40" step="1" value={years} onChange={e => setYears(e.target.value)}/></label></div><div className="payment" aria-live="polite"><span>ESTIMATED PRINCIPAL & INTEREST</span><strong>{payment === null ? "—" : money(payment)}<small> / mo</small></strong></div><button className="button" type="submit">Calculate estimate <ArrowRight size={16}/></button>{estimateError && <p role="alert">{estimateError}</p>}<p className="fine">USD. Estimates for informational purposes only. Fixed-rate amortization; excludes taxes, insurance, HOA dues, fees and lender terms. No valuation, approval or return guarantees. Recalculate after changing inputs.</p></form></section>
      <section className="section viewing-section" id="viewing"><div className="viewing-copy"><p className="eyebrow">AN INVITATION TO EXPERIENCE</p><h2>Some things<br/>must be <em>felt.</em></h2><p>Experience this property in person —<br/>as a local, fictional viewing preview.</p><div className="agent large"><div className="agent-monogram">AS</div><div><strong>Alexandra Sterling</strong><span>Fictional private property advisor</span><span>Sterling Luxury Group</span></div></div><p className="agent-contact">+1 (212) 555-0142 · fictional number<br/>alexandra@sterling.example · non-deliverable</p><p className="fine">All viewings are private and by appointment only in the fictional narrative. This form does not book, send email or store personal information.</p></div><div className="viewing-form"><div className="form-tabs"><button aria-pressed={mode === "viewing"} onClick={() => {setMode("viewing");setConfirmation("");setFormError("");}}>Private viewing</button><button aria-pressed={mode === "inquiry"} onClick={() => {setMode("inquiry");setConfirmation("");setFormError("");}}>Agent inquiry</button></div>{confirmation ? <div className="confirmation" id="confirmation" tabIndex={-1}><Check size={35}/><h3>{mode === "viewing" ? "Your visit, imagined." : "A conversation, imagined."}</h3><p>{confirmation}</p><p>Local preview only. Nothing was sent, booked or saved; availability is fictional.</p><button className="button" onClick={() => {setConfirmation("");requestAnimationFrame(() => document.getElementById("full-name")?.focus());}}>Create another preview <ArrowRight size={16}/></button></div> : <form ref={form} onSubmit={requestViewing}><h3>{mode === "viewing" ? "Request a private viewing" : "Contact your fictional advisor"}</h3><div className="form-grid"><label className="full-width">Full name<input id="full-name" name="name" autoComplete="name" required maxLength={100} placeholder="Your full name"/></label><label>Email<input name="email" type="email" autoComplete="email" required maxLength={150} placeholder="you@example.com"/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} pattern="[+0-9() .-]{7,30}" placeholder="+1 (555) 123-4567"/></label>{mode === "viewing" && <><label>Preferred date<input name="date" type="date" min={today} required/></label><label>Preferred time<select name="time" required defaultValue=""><option value="" disabled>Select a time</option><option value="10:00">10:00 AM</option><option value="14:00">2:00 PM</option><option value="16:00">4:00 PM</option><option value="18:00">6:00 PM — demo unavailable</option></select></label></>}<label className="full-width">Message <span className="fine">(optional)</span><textarea name="message" rows={3} maxLength={1000} placeholder="What would you like to know?"/></label></div>{formError && <p className="form-error" role="alert">{formError}</p>}<p className="fine">Use invented contact details. No accounts, payment, email or real appointment service.</p><div className="form-actions"><button type="submit" className="button">{mode === "viewing" ? "Request private viewing" : "Preview inquiry"} <ArrowUpRight size={16}/></button><button type="reset" className="text-link" onClick={() => setFormError("")}>Reset form</button></div></form>}</div></section>
      <section className="section listings" id="listings"><div className="section-heading"><div><p className="eyebrow">THE STERLING COLLECTION</p><h2>Other remarkable <em>residences.</em></h2></div><button className="text-link" onClick={resetFilters}>View all luxury listings <ArrowUpRight size={16}/></button></div><p className="fine">Four fictional homes, including the featured residence. Asking prices are USD, not valuations; availability is not real.</p><div className="filters"><label>Find a residence<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Name or address"/></label><label>Neighborhood<select value={district} onChange={e => setDistrict(e.target.value)}>{["All","Downtown","Harbor","Parkside"].map(value => <option key={value}>{value}</option>)}</select></label><label>Bedrooms<select value={beds} onChange={e => setBeds(e.target.value)}><option value="All">Any</option><option value="3">3+ bedrooms</option><option value="4">4+ bedrooms</option></select></label><label>Maximum price (USD)<select value={budget} onChange={e => setBudget(e.target.value)}><option value="All">Any price</option><option value="4000000">$4,000,000</option><option value="4500000">$4,500,000</option></select></label><label>Sort listings<select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="area">Largest first</option></select></label></div><div className="listing-toolbar"><p role="status">{filtered.length} {filtered.length === 1 ? "residence" : "residences"} found {onlySaved && "· saved only"}</p><button className="text-link" aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}><Heart size={16}/> {onlySaved ? "Show all homes" : `Saved homes (${saved.length})`}</button><button className="text-link" onClick={resetFilters}>Reset filters</button></div>{storageNote && <p role="status" className="fine">{storageNote}</p>}
        {filtered.length ? <div className="listing-grid">{filtered.map(home => <article className="home-card" key={home.id}><div className="home-art"><button className="home-open" aria-label={`View details for ${home.address}`} onClick={() => open({ type: "home", home })}><Scene variant={homeScenes[home.id]} label={home.address}/></button><button className="heart-button" aria-label={`${saved.includes(home.id) ? "Unsave" : "Save"} ${home.address}`} aria-pressed={saved.includes(home.id)} onClick={() => save(home.id)}><Heart size={18} fill={saved.includes(home.id) ? "currentColor" : "none"}/></button><span className="home-district">{home.district} · CONCEPT</span></div><div className="home-copy"><p className="home-price">{money(home.price)} <small>USD</small></p><h3><button onClick={() => open({ type: "home", home })}>{home.address} <ArrowUpRight size={16}/></button></h3><p>{home.beds} bed <span>/</span> {home.baths} bath <span>/</span> {home.area.toLocaleString("en-US")} sq ft</p></div></article>)}</div> : <div className="empty-state"><h3>No residences match your selection.</h3><p>Try another neighborhood, a higher budget, or clear your saved-only view.</p><button className="button" onClick={resetFilters}>Reset discovery <ArrowRight size={16}/></button></div>}
      </section>
    </main>
    <footer><div className="footer-top"><a className="brand" href="#top">STERLING<span>LUXURY GROUP</span></a><p>Exceptional homes.<br/><em>Extraordinary lives.</em></p><button className="text-link" onClick={() => goViewing("inquiry")}>Start a conversation <ArrowUpRight size={16}/></button></div><div className="footer-disclosure"><p>Fictional showcase only. Sterling Luxury Group and Alexandra Sterling are invented; no New York brokerage license, real MLS membership, awards, reviews or professional endorsements are claimed. Phone and .example email are non-operational. All properties, prices, specifications and availability are illustrative and unverified.</p><p><span className="equal-symbol" aria-hidden="true">⌂</span> Equal housing opportunity. This demo supports inclusive housing access and makes no actual housing offer. Original artwork is not photography. No financial, sales or investment advice.</p></div><div className="footer-bottom"><span>© 2026 Sterling · Fictional local demonstration</span><div>{["Instagram","LinkedIn","Privacy policy","Terms of service"].map(title => <button key={title} onClick={() => open({ type: "info", title, text: title === "Privacy policy" ? "This local demo sends no inquiry data and has no tracking, accounts or providers. Saved property identifiers alone are kept in your browser; unsave homes to remove them. Form details exist only in the current page and are cleared after preview. No personal data is persisted." : title === "Terms of service" ? "An original illustrated fictional showcase for demonstration only. Not a housing offer, brokerage service, advice, certification or guarantee. Do not enter real personal or financial data. Plans are illustrative and not for construction." : `No real ${title} account is connected. This is a local preview of the fictional brokerage’s social presence; no external navigation or endorsement.` })}>{title}</button>)}</div></div></footer>
    <button className="mobile-viewing button" onClick={() => goViewing()}><CalendarDays size={18}/> Schedule viewing <ArrowUpRight size={16}/></button>
    <dialog ref={dialog} className={`modal ${overlay?.type === "gallery" || overlay?.type === "tour" ? "media-modal" : ""}`} aria-labelledby="modal-title" onCancel={event => {event.preventDefault();close();}} onClick={event => {if(event.target === event.currentTarget) close();}} onKeyDown={event => {
      if (event.key === "Tab") {
        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]'));
        const first = focusable[0], last = focusable[focusable.length-1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if(overlay?.type === "gallery" && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {event.preventDefault();setOverlay({type:"gallery",index:(overlay.index+(event.key === "ArrowRight" ? 1 : 15))%16});}
    }}>
      {overlay && <><button className="modal-close" aria-label="Close dialog" onClick={close}><X/></button>
        {overlay.type === "gallery" && <><h2 id="modal-title">{rooms[overlay.index]}</h2><Scene variant={overlay.index} label={rooms[overlay.index]}/><div className="lightbox-controls"><button aria-label="Previous photo" onClick={() => setOverlay({type:"gallery",index:(overlay.index+15)%16})}><ArrowLeft/></button><p aria-live="polite">{overlay.index+1} of 16 · Concept illustration</p><button aria-label="Next photo" onClick={() => setOverlay({type:"gallery",index:(overlay.index+1)%16})}><ArrowRight/></button></div></>}
        {overlay.type === "home" && <><p className="eyebrow">FICTIONAL COLLECTION RESIDENCE</p><h2 id="modal-title">{overlay.home.address}</h2><Scene variant={homeScenes[overlay.home.id]} label={overlay.home.address}/><p className="modal-price">{money(overlay.home.price)} USD</p><p>{overlay.home.beds} bedrooms · {overlay.home.baths} bathrooms · {overlay.home.area.toLocaleString("en-US")} sq ft · Floor {overlay.home.floor}</p><p>{overlay.home.name}. An imagined {overlay.home.district.toLowerCase()} address with generous living spaces, panoramic views and private arrival. Concept amenities: concierge, fitness studio, residents’ lounge. No real availability or brokerage offer.</p><div className="form-actions"><button className="button" onClick={() => {const home = overlay.home;close();goViewing("viewing", home);}}>Preview a viewing <ArrowUpRight size={16}/></button><button className="text-link" aria-pressed={saved.includes(overlay.home.id)} onClick={() => save(overlay.home.id)}>{saved.includes(overlay.home.id) ? "Unsave residence" : "Save residence"}</button></div></>}
        {overlay.type === "info" && <><p className="eyebrow">LOCAL DEMONSTRATION</p><h2 id="modal-title">{overlay.title}</h2><p>{overlay.text}</p><button className="button" onClick={close}>Understood <Check size={16}/></button></>}
        {overlay.type === "tour" && <><h2 id="modal-title">An immersive concept preview</h2><Scene variant={tourRoom} label={rooms[tourRoom]}/><div className="tour-room-controls">{[0,2,3,10].map(i => <button key={i} aria-pressed={tourRoom === i} onClick={() => setTourRoom(i)}>{rooms[i]}</button>)}</div><p className="fine">Expanded dialog adapts the full-screen 3D tour to an accessible local illustrated walkthrough. No external video or 3D service.</p></>}
      </>}
    </dialog>
  </>;
}
