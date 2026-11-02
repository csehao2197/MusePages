"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { Building2, MapPin, Search, ArrowRight, ArrowUpRight, Heart, CalendarDays, Grid2X2, List, Map, Bell, SlidersHorizontal, X, Menu, ChevronLeft, ChevronRight, Maximize2, Plus, Minus, Phone, ArrowDown, Layers, Check, Ruler, Move, SquareDashedMousePointer, Scale } from "lucide-react";
import { properties, types, amenities, certifications, quickFilters, initialFilters, currency, number, monthlyRent, salePerFoot, filterProperties, validateRanges, localDate, type Property, type Filters, type Bounds } from "./listings";

type Modal = { kind: "details" | "tour" | "alert" | "info" | "compare" | "filters"; property?: Property; title?: string; text?: string } | null;
const brokers = [
  { name: "Sarah Chen", role: "Managing Director", specialty: "Office", initials: "SC" },
  { name: "Marcus Rivera", role: "Senior Vice President", specialty: "Retail", initials: "MR" },
  { name: "Tom Bradley", role: "Director", specialty: "Industrial", initials: "TB" },
];
const priceText = (p: Property) => p.transaction === "Sale" ? currency(p.price) : `${currency(p.price, 2)} /SF/year${p.nnn ? " NNN" : ""}`;
const secondaryPrice = (p: Property) => p.transaction === "Sale" ? `${currency(salePerFoot(p), 2)}/SF` : `${currency(monthlyRent(p.sf, p.price))}/month base rent`;

function LocalForm({ kind, property, onFinish }: { kind: "requirement" | "tour"; property?: Property; onFinish?: () => void }) {
  const [complete, setComplete] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get("name")).trim() || !String(data.get("company")).trim()) {
      setError("Please enter a name and company, not only spaces."); return;
    }
    const phone = String(data.get("phone"));
    if (phone.replace(/\D/g, "").length < 7) { setError("Enter a phone number with at least 7 digits."); return; }
    if (kind === "tour" && (String(data.get("date")) < localDate(1) || String(data.get("date")) > localDate(90))) {
      setError("Choose a tour date from tomorrow through the next 90 days."); return;
    }
    setSummary(kind === "tour" ? `${data.get("date")} · ${data.get("time")} Austin local · ${data.get("company")}` : `${data.get("type")} · ${data.get("size")} · ${data.getAll("submarket").join(", ") || "Any submarket"} · ${data.get("company")}`);
    setError(""); setComplete(true);
  }
  if (complete) return <div className="confirmation" role="status"><span className="success-icon"><Check /></span><h3>{kind === "tour" ? "Tour request previewed" : "Requirement received locally"}</h3><p>{kind === "tour" ? `Your request for ${property?.name} is ready for review.` : "Your space requirements have been captured in this page’s memory."} This is a demo: no broker was contacted, no tour is booked, and nothing was sent or stored.</p><p className="request-summary">{summary}</p><button className="primary" onClick={() => { setComplete(false); setError(""); setSummary(""); }}>Start a new request</button>{onFinish && <button className="secondary" onClick={onFinish}>Close</button>}</div>;
  return <form ref={form} onSubmit={submit} onReset={() => setError("")} className="lead-form">
    <div className="form-grid">
      <label>Full name<input name="name" required maxLength={80} autoComplete="name" placeholder="Your full name" /></label>
      <label>Company<input name="company" required maxLength={100} autoComplete="organization" placeholder="Company name" /></label>
      <label>Email<input name="email" required type="email" autoComplete="email" placeholder="you@company.com" /></label>
      <label>Phone<input name="phone" required type="tel" pattern="[+0-9() .-]{7,25}" maxLength={25} autoComplete="tel" placeholder="(512) 555-0100" /></label>
      {kind === "requirement" ? <>
        <label>Property type<select aria-label="Property type" name="type" required defaultValue=""><option value="" disabled>Select a property type</option>{types.map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Size needed<select aria-label="Size needed" name="size" required defaultValue=""><option value="" disabled>Select a size range</option>{["Under 2,000 SF", "2,000–5,000 SF", "5,000–15,000 SF", "15,000–50,000 SF", "50,000+ SF"].map(t => <option key={t}>{t}</option>)}</select></label>
        <fieldset className="submarkets"><legend>Preferred submarket (select any)</legend>{["Downtown", "North Austin", "East Austin", "South Austin", "West Austin"].map(t => <label key={t}><input name="submarket" type="checkbox" value={t} />{t}</label>)}</fieldset>
      </> : <>
        <label>Preferred date<input name="date" type="date" required min={localDate(1)} max={localDate(90)} /></label>
        <label>Preferred time<select aria-label="Preferred time" name="time" required defaultValue=""><option value="" disabled>Select time · Austin local</option><option>9:00 AM</option><option>11:00 AM</option><option>2:00 PM</option><option>4:00 PM</option></select></label>
      </>}
      <label className="wide">Additional notes<textarea name="notes" maxLength={1000} rows={3} placeholder="Share your timeline, must-haves, or questions…" /></label>
    </div>
    {error && <p role="alert" className="error">{error}</p>}
    <div className="form-actions"><button type="submit" className="primary">{kind === "tour" ? "Preview Tour Request" : "Submit Requirement"}<ArrowRight size={17} /></button><button type="reset" className="text-button">Reset form</button></div>
    <p className="privacy-note">Local demo only. Your entries stay in this page’s memory and are never transmitted. Please use fictional contact details.</p>
  </form>;
}

export default function PropertyBrowser() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [draft, setDraft] = useState({ query: "", type: "", transaction: "" });
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<Modal>(null);
  const [menu, setMenu] = useState(false);
  const [gallery, setGallery] = useState(0);
  const [cardGalleries, setCardGalleries] = useState<Record<number, number>>({});
  const [calculatorSize, setCalculatorSize] = useState("");
  const [calculatorRate, setCalculatorRate] = useState("");
  const [alertComplete, setAlertComplete] = useState(false);
  const [mapPin, setMapPin] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [satellite, setSatellite] = useState(false);
  const [fullMap, setFullMap] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [pendingArea, setPendingArea] = useState<Bounds | null>(null);
  const [pan, setPan] = useState(0);
  const [storageReady, setStorageReady] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const rangeError = validateRanges(filters);
  const results = rangeError ? [] : filterProperties(filters, saved, sort);
  const pages = Math.max(1, Math.ceil(results.length / 6));
  const currentPage = Math.min(page, pages);
  const visible = view === "map" ? results : results.slice((currentPage - 1) * 6, currentPage * 6);
  const activeCount = Object.entries(filters).reduce((count, [key, value]) => count + (key === "query" ? 0 : Array.isArray(value) ? value.length : value ? 1 : 0), 0);
  const selectedProperty = properties.find(p => p.id === mapPin);
  const downtownCluster = zoom === 1 && results.some(p => p.id === 1) && results.some(p => p.id === 10);

  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem("vanguard-019-saved") || "[]");
      if (Array.isArray(raw)) setSaved([...new Set(raw.filter((id): id is number => typeof id === "number" && properties.some(p => p.id === id)))]);
    } catch { setNotice("Saved properties could not be loaded. You can still browse and save for this session."); }
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem("vanguard-019-saved", JSON.stringify(saved)); }
    catch { setNotice("Browser storage is unavailable. Saves will last only for this session."); }
  }, [saved, storageReady]);
  useEffect(() => {
    if (modal) {
      if (!dialog.current?.open) dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close(); document.body.style.overflow = "";
      if (opener.current?.isConnected) opener.current.focus();
      else {
        const fallback = document.querySelector<HTMLElement>(".results-heading h2");
        fallback?.setAttribute("tabindex", "-1"); fallback?.focus();
      }
    }
    return () => { document.body.style.overflow = ""; };
  }, [modal]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(false); setFullMap(false); setDrawing(false); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  function open(next: NonNullable<Modal>) {
    if (!modal) opener.current = document.activeElement as HTMLElement;
    setGallery(0); setAlertComplete(false);
    setCalculatorSize(String(next.property?.sf || "")); setCalculatorRate(String(next.property?.price || ""));
    setModal(next);
  }
  const close = () => setModal(null);
  const info = (title: string, text: string) => open({ kind: "info", title, text });
  function update<K extends keyof Filters>(key: K, value: Filters[K]) { setFilters(f => ({ ...f, [key]: value })); setPage(1); setMapPin(null); }
  function toggleFilter(key: "selectedTypes" | "classes" | "years" | "amenities" | "certifications" | "quick", value: string) {
    update(key, filters[key].includes(value) ? filters[key].filter(v => v !== value) : [...filters[key], value]);
  }
  function clear() {
    setFilters(initialFilters); setDraft({ query: "", type: "", transaction: "" }); setPage(1); setPendingArea(null); setDrawing(false); setMapPin(null);
  }
  function save(p: Property) { setSaved(s => s.includes(p.id) ? s.filter(id => id !== p.id) : [...s, p.id]); setNotice(saved.includes(p.id) ? `${p.name} removed from saved properties.` : `${p.name} saved on this browser.`); }
  function comparison(p: Property) {
    if (!compare.includes(p.id) && compare.length >= 3) { setNotice("Compare up to 3 properties. Remove one first."); return; }
    setCompare(c => c.includes(p.id) ? c.filter(id => id !== p.id) : [...c, p.id]);
  }
  function search(event: FormEvent) {
    event.preventDefault(); setFilters(f => ({ ...f, ...draft, minPrice: draft.transaction === f.transaction ? f.minPrice : "", maxPrice: draft.transaction === f.transaction ? f.maxPrice : "" })); setPage(1); setMapPin(null);
  }
  function point(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: Math.min(100, Math.max(0, (event.clientX - rect.left) / rect.width * 100)), y: Math.min(100, Math.max(0, (event.clientY - rect.top) / rect.height * 100)) };
  }
  function drawMove(event: PointerEvent<HTMLDivElement>) {
    if (!drawing || !dragStart.current) return;
    const end = point(event), start = dragStart.current;
    setPendingArea({ left: Math.min(start.x, end.x), right: Math.max(start.x, end.x), top: Math.min(start.y, end.y), bottom: Math.max(start.y, end.y) });
  }
  function viewportBounds(scale: number, offset: number): Bounds {
    return { left: Math.max(0, 50 - offset - 50 / scale), right: Math.min(100, 50 - offset + 50 / scale), top: Math.max(0, 50 - 50 / scale), bottom: Math.min(100, 50 + 50 / scale) };
  }
  const checkboxGroup = (label: string, key: "selectedTypes" | "classes" | "years" | "amenities" | "certifications", values: readonly string[], counts = false) => <details className="filter-group" open={["PROPERTY TYPE", "BUILDING CLASS"].includes(label)} key={key}><summary>{label}<span>{filters[key].length || "+"}</span></summary><div className="filter-options">{values.map(value => <label key={value}><input type="checkbox" checked={filters[key].includes(value)} onChange={() => toggleFilter(key, value)} />{key === "classes" ? `Class ${value}` : value}{counts && <small>{properties.filter(p => key === "selectedTypes" ? p.type === value : p.class === value).length}</small>}</label>)}</div></details>;
  const filterContent = <><div className="filter-heading"><strong><SlidersHorizontal size={16} />Refine results</strong><button className="text-button" onClick={clear}>Clear all</button></div>
    {checkboxGroup("PROPERTY TYPE", "selectedTypes", types, true)}
    <details className="filter-group" open><summary>PRICE RANGE <span>+</span></summary><div className="filter-options">
      <label>Transaction / price units<select aria-label="Filter transaction" value={filters.transaction} onChange={e => { update("transaction", e.target.value); setFilters(f => ({ ...f, minPrice: "", maxPrice: "" })); setDraft(d => ({ ...d, transaction: e.target.value })); }}><option value="">All · choose for price</option><option value="Lease">Lease · $/SF/year</option><option value="Sale">Sale · total $</option><option value="Sublease">Sublease · $/SF/year</option></select></label>
      <div className="range-inputs"><label>Min price<input type="number" min="0" step="any" value={filters.minPrice} onChange={e => update("minPrice", e.target.value)} placeholder={filters.transaction === "Sale" ? "500000" : "15"} /></label><span>–</span><label>Max price<input type="number" min="0" step="any" value={filters.maxPrice} onChange={e => update("maxPrice", e.target.value)} placeholder={filters.transaction === "Sale" ? "50000000" : "85"} /></label></div>
      {filters.transaction && <><label>Minimum price slider<input aria-label="Minimum price slider" type="range" min={filters.transaction === "Sale" ? 500000 : 15} max={filters.transaction === "Sale" ? 50000000 : 85} step={filters.transaction === "Sale" ? 50000 : 1} value={filters.minPrice || (filters.transaction === "Sale" ? 500000 : 15)} onChange={e => update("minPrice", e.target.value)} /></label><label>Maximum price slider<input aria-label="Maximum price slider" type="range" min={filters.transaction === "Sale" ? 500000 : 15} max={filters.transaction === "Sale" ? 50000000 : 85} step={filters.transaction === "Sale" ? 50000 : 1} value={filters.maxPrice || (filters.transaction === "Sale" ? 50000000 : 85)} onChange={e => update("maxPrice", e.target.value)} /></label></>}
      <small>{filters.transaction === "Sale" ? "Total asking price · USD" : filters.transaction ? "Annual base rent per square foot · USD" : "Do not compare lease rates with sale totals."}</small>
    </div></details>
    <details className="filter-group" open><summary>SIZE (SF)<span>+</span></summary><div className="filter-options"><div className="range-inputs"><label>Min size<input type="number" min="0" value={filters.minSize} onChange={e => update("minSize", e.target.value)} placeholder="500" /></label><span>–</span><label>Max size<input type="number" min="0" value={filters.maxSize} onChange={e => update("maxSize", e.target.value)} placeholder="No maximum" /></label></div><label>Minimum size slider<input type="range" min="500" max="200000" step="500" value={filters.minSize || 500} onChange={e => update("minSize", e.target.value)} /></label><label>Maximum size slider<input type="range" min="500" max="200000" step="500" value={filters.maxSize || 200000} onChange={e => update("maxSize", e.target.value)} /></label><small>Square feet · manual input accepts 100,000+ SF</small></div></details>
    {checkboxGroup("BUILDING CLASS", "classes", ["A", "B", "C"], true)}
    {checkboxGroup("YEAR BUILT", "years", ["Before 2000", "2000–2009", "2010–2019", "2020+"])}
    {checkboxGroup("AMENITIES", "amenities", amenities)}
    {checkboxGroup("CERTIFICATIONS · DEMO", "certifications", certifications)}
    <details className="filter-group"><summary>AVAILABILITY · SIMULATED<span>+</span></summary><div className="filter-options"><label>Availability<select aria-label="Availability" value={filters.availability} onChange={e => update("availability", e.target.value)}><option value="">Any timeline</option><option value="0">Available now</option><option value="30">Within 30 days</option><option value="90">Within 90 days</option></select></label></div></details>
    {rangeError && <p role="alert" className="error">{rangeError}</p>}
    <p className="small-note">All attributes, availability and certification labels are fictional. No actual property certification is represented.</p>
  </>;

  function card(p: Property) {
    return <article key={p.id} className={`property-card ${view !== "grid" ? "row-card" : ""}`} data-testid={`property-${p.id}`}>
      <div className="cover" onTouchStart={e => { dragStart.current = { x: e.touches[0].clientX, y: 0 }; }} onTouchEnd={e => { if (dragStart.current && Math.abs(e.changedTouches[0].clientX - dragStart.current.x) > 40) setCardGalleries(g => ({ ...g, [p.id]: ((g[p.id] || 0) + 1) % 3 })); dragStart.current = null; }}><img className={`gallery-${cardGalleries[p.id] || 0}`} src={`/${p.image}.svg`} alt={`Original architectural illustration of ${p.type.toLowerCase()} space; not a photograph of this property`} width="800" height="500" /><div className="badges"><span className={`badge ${p.transaction === "Sale" ? "sale" : ""}`}>FOR {p.transaction.toUpperCase()}</span><span className="badge type-badge">{p.type === "Office" ? `CLASS ${p.class}` : p.type.toUpperCase()}</span></div><button className={`save-cover ${saved.includes(p.id) ? "is-saved" : ""}`} aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`} aria-pressed={saved.includes(p.id)} onClick={() => save(p)}><Heart size={18} fill={saved.includes(p.id) ? "currentColor" : "none"} /></button><button className="card-gallery-next" aria-label={`Next illustration for ${p.name}`} onClick={() => setCardGalleries(g => ({ ...g, [p.id]: ((g[p.id] || 0) + 1) % 3 }))}><ChevronRight size={17} /><span>{(cardGalleries[p.id] || 0) + 1}/3</span></button><span className="art-label">ILLUSTRATIVE RENDER</span></div>
      <div className="card-body"><div className="card-eyebrow">{p.neighborhood}<span>DEMO {String(p.id).padStart(3, "0")}</span></div><h3><button onClick={() => open({ kind: "details", property: p })}>{p.name}</button></h3><p className="address"><MapPin size={13} />{p.address}, Austin, TX {p.zip}</p><div className="specs"><span><Ruler size={14} />{number(p.sf)} SF</span><span>Built {p.year}</span></div><p className="other-specs">{p.specs}</p><div className="price">{priceText(p)}</div><p className="secondary-price">{secondaryPrice(p)}</p><div className="tags">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="broker-line"><span className="avatar tiny">{p.broker.split(" ").map(n => n[0]).join("")}</span><span>{p.broker}<small>Vanguard Commercial · Fictional broker</small></span></div><div className="card-actions"><label><input type="checkbox" checked={compare.includes(p.id)} onChange={() => comparison(p)} />Compare</label><button onClick={() => open({ kind: "tour", property: p })}><CalendarDays size={15} />Tour</button><button onClick={() => open({ kind: "details", property: p })}>Details<ArrowRight size={15} /></button></div></div>
    </article>;
  }
  const mapPanel = <div className={`map-panel ${fullMap ? "map-expanded" : ""} ${satellite ? "satellite" : ""}`}>
    <div className="map-top"><span><MapPin size={15} /> Austin · illustrative map</span><button aria-label={fullMap ? "Exit fullscreen map" : "Expand map"} onClick={() => setFullMap(!fullMap)}><Maximize2 size={17} /></button></div>
    <div className={`map-canvas ${drawing ? "drawing" : ""}`} data-testid="map-canvas" onPointerDown={e => { if (!drawing || (e.target as HTMLElement).closest("button")) return; dragStart.current = point(e); e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={drawMove} onPointerUp={e => { if (!dragStart.current) return; drawMove(e); dragStart.current = null; setDrawing(false); }} onPointerCancel={() => { dragStart.current = null; setDrawing(false); }}>
      <div className="map-world" style={{ transform: `scale(${zoom}) translateX(${pan}%)` }}>
        <svg className="map-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="streets" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="var(--map-land)"/><path d="M0 0h8v8" fill="none" stroke="var(--map-road)" strokeWidth=".5"/></pattern></defs><rect width="100" height="100" fill="url(#streets)" /><path d="M0 74C22 46 31 85 56 68S82 77 100 60" fill="none" stroke="#a4c8da" strokeWidth="6" /><path d="M44 0 50 35 44 65 62 100M0 28 100 37M12 0 29 100" fill="none" stroke="#fffaf1" strokeWidth="2" /><path d="M0 35h18v25H0M68 0h32v15H68M75 80h25v20H75" fill="#c5d7bc" /></svg>
        <span className="map-label downtown">DOWNTOWN</span><span className="map-label north">NORTH AUSTIN</span><span className="map-label east">EAST AUSTIN</span><span className="map-label river">Lady Bird Lake · schematic</span>
        {results.filter(p => !downtownCluster || ![1, 10].includes(p.id)).map(p => <button key={p.id} className={`map-pin ${p.type.toLowerCase()} ${mapPin === p.id ? "selected" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} title={`${p.name} · ${priceText(p)} · ${number(p.sf)} SF`} aria-label={`Map pin: ${p.name}, ${priceText(p)}, ${number(p.sf)} SF`} onClick={() => setMapPin(p.id)}>{p.transaction === "Sale" ? `${(p.price / 1e6).toFixed(2)}M` : `$${p.price}`}</button>)}
        {downtownCluster && <button className="map-pin office cluster" style={{ left: "46%", top: "54%" }} aria-label="Cluster: 2 downtown properties. Zoom to expand" onClick={() => { setZoom(1.2); setPendingArea(viewportBounds(1.2, pan)); }}>2</button>}
      </div>
      {pendingArea && <div className="drawn-area" style={{ left: `${pendingArea.left}%`, top: `${pendingArea.top}%`, width: `${pendingArea.right - pendingArea.left}%`, height: `${pendingArea.bottom - pendingArea.top}%` }} />}
    </div>
    <div className="map-controls"><button aria-label="Zoom in" disabled={zoom >= 1.4} onClick={() => { const next = Math.min(1.4, zoom + .2); setZoom(next); setPendingArea(viewportBounds(next, pan)); }}><Plus size={18} /></button><button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => { const next = Math.max(1, zoom - .2); setZoom(next); setPendingArea(viewportBounds(next, pan)); }}><Minus size={18} /></button><button aria-label="Toggle satellite schematic" aria-pressed={satellite} onClick={() => setSatellite(!satellite)}><Layers size={18} /></button></div>
    <div className="map-bottom"><button className="secondary" onClick={() => { const next = pan ? 0 : -12; setPan(next); setPendingArea(viewportBounds(zoom, next)); }}><Move size={15} />{pan ? "Pan back" : "Pan east"}</button><button className="primary" onClick={() => { update("area", pendingArea); setPendingArea(null); }} disabled={!pendingArea}>Search this area</button></div>
    {selectedProperty && results.some(p => p.id === selectedProperty.id) && <div className="map-popup"><button className="popup-close" aria-label="Close map property" onClick={() => setMapPin(null)}><X size={16} /></button><strong>{selectedProperty.name}</strong><p>{priceText(selectedProperty)} · {number(selectedProperty.sf)} SF</p><button className="text-button" onClick={() => open({ kind: "details", property: selectedProperty })}>View property<ArrowRight size={15} /></button></div>}
    <div className="map-legend"><span className="office">● Office</span><span className="retail">● Retail</span><span className="industrial">● Industrial</span><span>● Other</span></div>
    <p className="small-note">Original schematic, not geospatial data. No map provider or live locations. {drawing ? "Drag a rectangle, then search this area. Keyboard: use East Austin preset below." : "Pins show fictional asking values."}</p>
    <button className="text-button area-preset" onClick={() => { setDrawing(true); setZoom(1); setPan(0); setPendingArea(null); }}><SquareDashedMousePointer size={15} />Draw custom area</button>
    <button className="text-button area-preset" onClick={() => { setPendingArea({ left: 55, top: 0, right: 100, bottom: 75 }); setDrawing(false); }}>Select East Austin area (keyboard alternative)</button>
  </div>;

  return <>
    <div className="demo-bar"><span><span className="demo-dot" />FICTIONAL BROKERAGE DEMO</span><span>12 sample properties · No live listings, certifications or market data</span></div>
    <header className="site-header"><a className="brand" href="#" aria-label="Vanguard Commercial home"><span className="brand-mark"><Building2 size={27} strokeWidth={1.7} /></span><span>VANGUARD<small>COMMERCIAL</small></span></a><nav className={menu ? "main-nav menu-open" : "main-nav"} aria-label="Main navigation">{[["Properties", "#properties"], ["Markets", "#markets"], ["Services", "#contact"], ["Insights", "#markets"], ["About", "#team"]].map(([text, href]) => <a key={text} className={text === "Properties" ? "active" : ""} href={href} onClick={() => setMenu(false)}>{text}</a>)}</nav><div className="nav-actions"><button className="list-link" onClick={() => info("List a property", "Listing intake is simulated. Use the requirement form to preview a property conversation. No listing will be published.")}>List a Property<ArrowUpRight size={13} /></button><button className="phone-link" onClick={() => info("Contact Vanguard", "1-800-VANGUARD is a source design placeholder, not a working brokerage number. Use Contact Us for a local requirement preview.")}><Phone size={13} />1-800-VANGUARD</button><button className="signin" onClick={() => info("No account needed", "This local demo has no sign-in service. Save properties on this browser and compare up to three listings without an account.")}>Sign In</button><a className="primary contact-mini" href="#contact">Contact<span> Us</span><ArrowUpRight size={15} /></a><button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></header>
    <main>
      <section className="hero"><div className="container"><div className="hero-topline"><span>COMMERCIAL REAL ESTATE / AUSTIN, TEXAS</span><span className="hero-pill"><span />Local expertise. Wider perspective.</span></div><h1>Find the right space.<br /><span>Build what’s next.</span></h1><p className="hero-description">Commercial Properties for Lease &amp; Sale</p><p className="hero-subtitle">Explore office, retail and industrial opportunities across Austin’s submarkets.</p>
        <form className="search-bar" onSubmit={search}><label className="location-field"><span>LOCATION</span><div><MapPin size={18} /><input aria-label="City, ZIP, or neighborhood" list="locations" value={draft.query} onChange={e => setDraft(d => ({ ...d, query: e.target.value }))} placeholder="City, ZIP, or neighborhood" /></div><datalist id="locations">{["Austin", "Downtown", "North Austin", "East Austin", "South Austin", "West Austin", "78701", "78702", "78758"].map(t => <option key={t} value={t} />)}</datalist></label><label><span>PROPERTY TYPE</span><select aria-label="Search property type" value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}><option value="">All property types</option>{types.map(t => <option key={t}>{t}</option>)}</select></label><label><span>TRANSACTION</span><select aria-label="Search transaction" value={draft.transaction} onChange={e => setDraft(d => ({ ...d, transaction: e.target.value }))}><option value="">Lease &amp; sale</option><option value="Lease">For Lease</option><option value="Sale">For Sale</option><option value="Sublease">For Sublease</option></select></label><button className="blue" type="submit"><Search size={18} />Search properties</button></form>
        <div className="quick-filters"><span>QUICK FILTERS</span>{quickFilters.map(q => <button key={q} className={filters.quick.includes(q) ? "selected" : ""} aria-pressed={filters.quick.includes(q)} onClick={() => toggleFilter("quick", q)}>{filters.quick.includes(q) && <Check size={12} />}{q}{q === "Green Certified" && <small>DEMO</small>}</button>)}</div>
      </div></section>
      <section id="properties" className="discovery container"><div className="breadcrumb"><a href="#">Home</a><ChevronRight size={12} /><span>Commercial properties</span><ChevronRight size={12} /><strong>Austin, TX</strong></div><div className="results-heading"><div><span className="eyebrow">YOUR NEXT OPPORTUNITY</span><h2>Austin commercial properties</h2><p aria-live="polite" data-testid="result-count"><strong>{results.length} properties</strong> found in Austin, TX <span>· Curated fictional sample</span></p></div><button className={`secondary saved-search ${filters.savedOnly ? "selected" : ""}`} aria-pressed={filters.savedOnly} onClick={() => update("savedOnly", !filters.savedOnly)}><Heart size={16} />Saved properties ({saved.length})</button></div>
        <div className="results-toolbar"><div className="toolbar-left"><button className="secondary mobile-filter" onClick={() => open({ kind: "filters" })}><SlidersHorizontal size={16} />Filters ({activeCount})</button><label>Sort by<select aria-label="Sort properties" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}><option value="newest">Newest</option><option value="price-asc">Price (Low–High)</option><option value="price-desc">Price (High–Low)</option><option value="size-asc">Size (Small–Large)</option><option value="size-desc">Size (Large–Small)</option></select></label><button className="text-button draw-button" onClick={() => { setView("map"); setDrawing(true); setZoom(1); setPan(0); setNotice("Drag a rectangle on the schematic map or use the keyboard area preset."); }}><SquareDashedMousePointer size={16} />Draw on map</button></div><div className="toolbar-right"><button className="text-button save-search-button" onClick={() => open({ kind: "alert" })}><Bell size={16} />Save search</button><div className="view-toggle" aria-label="Result view">{[["grid", Grid2X2], ["list", List], ["map", Map]].map(([name, Icon]) => { const ViewIcon = Icon as typeof Map; return <button key={String(name)} aria-label={`${name} view`} aria-pressed={view === name} onClick={() => { setView(String(name)); setFullMap(false); }}><ViewIcon size={17} /></button>; })}</div></div></div>
        <p className="sort-note">Price sorting: annual base rent totals for leases/subleases; asking totals for sales. Different transaction totals are not directly comparable.</p>
        {notice && <div className="notice" role="status">{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15} /></button></div>}
        {(activeCount > 0 || filters.query) && <div className="active-filters"><span>{activeCount} active filters{filters.query && ` · “${filters.query}”`}{filters.area && " · Custom map area"}</span><button className="text-button" onClick={clear}>Clear all filters<X size={13} /></button></div>}
        {compare.length > 0 && <div className="comparison-bar"><span><Scale size={18} />{compare.length} of 3 properties selected</span><button className="primary" onClick={() => open({ kind: "compare" })}>Compare properties</button><button className="text-button" onClick={() => setCompare([])}>Clear comparison</button></div>}
        <div className={`discovery-layout ${view === "map" ? "map-layout" : ""}`}><aside className="filter-sidebar" aria-label="Property filters">{filterContent}</aside><div className="results-content">
          <div className={view === "map" ? "split-view" : ""}><div className={`property-grid ${view === "list" || view === "map" ? "list-view" : ""}`}>{rangeError ? <div className="empty" role="alert"><SlidersHorizontal /><h3>Check your filter ranges</h3><p>{rangeError}</p><button className="primary" onClick={clear}>Reset filters</button></div> : visible.length ? visible.map(card) : <div className="empty"><Search size={30} /><h3>No matching properties</h3><p>Try a wider area, fewer amenities, or a different size range. This demo includes 12 sample listings.</p><button className="primary" onClick={clear}>Reset filters</button></div>}</div>{view === "map" && mapPanel}</div>
          {view !== "map" && <div className="pagination"><span>Showing {results.length ? (currentPage - 1) * 6 + 1 : 0}–{Math.min(currentPage * 6, results.length)} of {results.length}</span><div><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={17} /></button>{Array.from({ length: pages }, (_, i) => <button key={i} aria-label={`Page ${i + 1}`} aria-current={currentPage === i + 1 ? "page" : undefined} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={17} /></button></div></div>}
          <article className="featured"><div className="featured-image"><img src="/office.svg" alt="Original campus architecture illustration, not property photography" width="800" height="500" /><span>FEATURED LISTING · FICTIONAL</span></div><div className="featured-body"><span className="eyebrow">ROOM FOR A BIGGER VISION</span><h3>The Austin Tech Center</h3><p className="featured-specs">185,000 SF · Class A · Built 2021</p><p>Full-building campus concept with a 10,000 SF rooftop deck, 500-space parking garage and campus-grade fiber. Divisible to 15,000 SF.</p><span className="featured-cert">LEED Platinum · fictional label, not certified</span><div className="featured-bottom"><strong>$58.00<small> /SF/year</small></strong><button className="blue" onClick={() => open({ kind: "tour", property: properties[3] })}>Schedule a Tour<ArrowUpRight size={16} /></button></div></div></article>
        </div></div>
      </section>
      <section id="markets" className="market-section"><div className="container"><div className="section-top"><div><span className="eyebrow">THE BIGGER PICTURE</span><h2>Austin Market Snapshot <span>— Q1 2026</span></h2></div><button className="text-button" onClick={() => { const data = "Vanguard Commercial — FICTIONAL demo market report, Q1 2026\nNot verified market data. Not financial or investment advice.\nOffice vacancy: 14.2% (illustrative)\nAverage office rent: $48.50/SF/year (illustrative)\nRetail absorption: +320,000 SF (illustrative)\nIndustrial cap rate: 5.8% (illustrative; no returns implied)\n"; const url = URL.createObjectURL(new Blob([data], { type: "text/plain" })); const a = document.createElement("a"); a.href = url; a.download = "vanguard-fictional-market-report.txt"; a.click(); URL.revokeObjectURL(url); setNotice("Fictional market report downloaded. It is not verified data or financial advice."); }}>Download demo report<ArrowDown size={16} /></button></div><p className="market-disclaimer">Illustrative source-design figures only · Not verified market research, investment advice, or a forecast.</p><div className="market-stats">{[["Office vacancy", "14.2%", "↓ 0.8% from Q4", "down"], ["Avg. office rent", "$48.50", "/SF/year · ↑ 3.2% YoY", "up"], ["Retail absorption", "+320,000", "SF · Q1 2026", ""], ["Industrial cap rate", "5.8%", "Illustrative · stable", ""]].map(([label, value, note, trend]) => <div key={label}><span>{label}</span><strong>{value}</strong><small className={trend}>{note}</small></div>)}</div></div></section>
      <section className="contact-section container" id="contact"><div className="contact-form-wrap"><span className="eyebrow">LET’S FIND YOUR FIT</span><h2>Can’t find what<br />you’re looking for?</h2><p>Tell us what you need. Preview a requirement for our fictional Austin team.</p><LocalForm kind="requirement" /></div><aside className="team-panel" id="team"><span className="eyebrow">PEOPLE. PERSPECTIVE. POSSIBILITIES.</span><h2>Your Austin team</h2><p>Specialized perspectives for every property type.</p><span className="fictional-label">Fictional profiles · No real endorsements</span>{brokers.map((b, i) => <article className="team-member" key={b.name}><span className={`avatar portrait portrait-${i}`}>{b.initials}</span><div><h3>{b.name}</h3><p>{b.role} · {b.specialty}</p><button onClick={() => info(`Contact ${b.name}`, `${b.name} is a fictional broker. The source email ${b.name.split(" ")[0].toLowerCase()}@vanguard.com is not used or linked. Fill out the local requirement form; nothing will be emailed.`)}>Contact {b.name.split(" ")[0]}<ArrowUpRight size={13} /></button></div></article>)}<div className="team-note"><Building2 size={24} /><div><strong>Built around your business.</strong><p>Office, retail, industrial and beyond. Explore the possibilities, without a real-world commitment.</p></div></div></aside></section>
    </main>
    <footer><div className="container footer-grid"><div className="footer-brand"><a className="brand" href="#"><Building2 size={30} /><span>VANGUARD<small>COMMERCIAL</small></span></a><p>A wider perspective.<br />A stronger foundation.</p><span>Fictional local experience<br />Austin, Texas · Illustrative locations</span></div>{[{ title: "Properties", links: ["Office", "Retail", "Industrial", "Flex", "Land", "All Listings"] }, { title: "Services", links: ["Tenant Representation", "Landlord Leasing", "Investment Sales", "Property Management", "Consulting"] }, { title: "Markets", links: ["Austin", "Dallas", "Houston", "San Antonio", "Denver", "Phoenix"] }, { title: "Company", links: ["About Us", "Team", "Careers", "Insights", "Press", "Contact"] }].map(group => <div key={group.title}><h3>{group.title}</h3>{group.links.map(link => <button key={link} onClick={() => { if (group.title === "Properties") { clear(); if (link !== "All Listings") { update("type", link); setDraft(d => ({ ...d, type: link })); } document.getElementById("properties")?.scrollIntoView(); } else if (["Contact", "Team", "Insights", "Austin"].includes(link)) document.getElementById(link === "Contact" ? "contact" : link === "Team" ? "team" : "markets")?.scrollIntoView(); else info(link, `This ${group.title.toLowerCase()} topic is a local demo preview. There are no real services, jobs or listings outside this fictional Austin sample. Contact Us lets you preview a requirement without sending it.`); }}>{link}</button>)}</div>)}</div><div className="container footer-bottom"><span>© 2026 Vanguard Commercial · Fictional demo</span><div>{["Privacy", "Terms", "Licensing"].map(t => <button key={t} onClick={() => info(t, t === "Licensing" ? "The original design’s Texas license #987654 is a fictional placeholder. This demo is not a licensed brokerage and represents no actual certification. Original SVG artwork was created for this project; system fonts and MIT-licensed software are used." : "Local demo only. No accounts, tracking, payments, real transactions or transmitted form entries. Saved property IDs use this browser’s local storage; clear saves to remove them. All listings and market figures are fictional, not financial advice.")}>{t}</button>)}</div></div></footer>
    <div className="mobile-bottom"><button aria-pressed={view === "map"} onClick={() => { setView(view === "map" ? "grid" : "map"); document.getElementById("properties")?.scrollIntoView(); }}><Map size={18} />{view === "map" ? "Properties" : "Map"}</button><button onClick={() => open({ kind: "filters" })}><SlidersHorizontal size={18} />Filters ({activeCount})</button></div>
    <dialog ref={dialog} className={`modal ${modal?.kind === "filters" ? "filter-modal" : ""}`} onKeyDown={e => {
      if (e.key !== "Tab") return;
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, a[href]')).filter(element => element.getClientRects().length > 0);
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } }} aria-labelledby="dialog-title">
      {modal && <><div className="modal-heading"><div><span className="eyebrow">VANGUARD · LOCAL DEMO</span><h2 id="dialog-title">{modal.kind === "details" ? modal.property?.name : modal.kind === "tour" ? "Schedule a property tour" : modal.kind === "alert" ? "Save your search" : modal.kind === "compare" ? "Compare properties" : modal.kind === "filters" ? "Property filters" : modal.title}</h2></div><button autoFocus aria-label="Close dialog" onClick={close}><X /></button></div>
        {modal.kind === "info" && <div className="info-content"><p>{modal.text}</p><button className="primary" onClick={close}>Got it</button></div>}
        {modal.kind === "filters" && <><div className="drawer-content">{filterContent}</div><div className="drawer-bottom"><button className="blue" disabled={!!rangeError} onClick={close}>Apply Filters · {results.length} results</button></div></>}
        {modal.kind === "tour" && <><p className="tour-context"><MapPin size={17} />{modal.property?.name}<br />No actual tour is booked. Requested times are not availability.</p><LocalForm key={modal.property?.id} kind="tour" property={modal.property} onFinish={close} /></>}
        {modal.kind === "alert" && <div className="info-content">{alertComplete ? <div className="confirmation" role="status"><Check /><h3>Search saved for this session</h3><p>No email alert was created or sent. This preview is kept in page memory only.</p><button className="primary" onClick={() => setAlertComplete(false)}>Reset saved search</button></div> : <form onSubmit={e => { e.preventDefault(); setAlertComplete(true); }}><p>Preview an alert for <strong>{results.length} matching properties</strong>{filters.query && ` in ${filters.query}`}. No emails are sent.</p><label>Search name<input required name="searchName" maxLength={80} pattern=".*\S.*" defaultValue="Austin property search" /></label><label>Email for preview only<input required type="email" placeholder="demo@example.com" /></label><button className="blue" type="submit"><Bell size={16} />Save local search preview</button></form>}</div>}
        {modal.kind === "compare" && <div className="compare-wrap"><p>Asking figures only. Lease rates and sale prices use different units; no returns are implied.</p>{compare.length ? <div className="compare-grid">{properties.filter(p => compare.includes(p.id)).map(p => <article key={p.id}><img src={`/${p.image}.svg`} alt="Original building illustration" width="800" height="500" /><h3>{p.name}</h3><dl><dt>Transaction</dt><dd>{p.transaction}</dd><dt>Asking</dt><dd>{priceText(p)}</dd><dt>{p.transaction === "Sale" ? "Price per SF" : "Monthly base rent"}</dt><dd>{secondaryPrice(p)}</dd><dt>Size</dt><dd>{number(p.sf)} SF</dd><dt>Type / class</dt><dd>{p.type} / {p.class}</dd><dt>Built</dt><dd>{p.year}</dd><dt>Amenities</dt><dd>{p.amenities.join(", ") || "None in demo"}</dd></dl><button className="secondary" onClick={() => comparison(p)}>Remove {p.name}</button></article>)}</div> : <div className="empty"><p>No properties selected.</p><button className="primary" onClick={close}>Back to listings</button></div>}</div>}
        {modal.kind === "details" && modal.property && <div className="detail-content"><div className="detail-gallery" onTouchStart={e => { dragStart.current = { x: e.touches[0].clientX, y: 0 }; }} onTouchEnd={e => { const start = dragStart.current; if (start && Math.abs(e.changedTouches[0].clientX - start.x) > 40) setGallery(g => (g + 1) % 3); dragStart.current = null; }}><img src={`/${modal.property.image}.svg`} alt={`Illustrative ${["exterior", "facade detail", "campus perspective"][gallery]}; no actual property photography`} className={`gallery-${gallery}`} width="800" height="500" /><button className="gallery-prev" aria-label="Previous illustration" onClick={() => setGallery(g => (g + 2) % 3)}><ChevronLeft /></button><button className="gallery-next" aria-label="Next illustration" onClick={() => setGallery(g => (g + 1) % 3)}><ChevronRight /></button><span aria-live="polite">{gallery + 1} / 3 · Original illustrative views</span></div><p className="address"><MapPin size={15} />{modal.property.address}, Austin, TX {modal.property.zip}</p><div className="detail-stats"><div><small>ASKING {modal.property.transaction.toUpperCase()}</small><strong>{priceText(modal.property)}</strong></div><div><small>AREA</small><strong>{number(modal.property.sf)} SF</strong></div><div><small>BUILDING</small><strong>Class {modal.property.class} · {modal.property.year}</strong></div></div><p>{modal.property.specs}. A fictional {modal.property.type.toLowerCase()} listing in {modal.property.neighborhood}, presented for comparing space needs. All dimensions, amenities, pricing, locations and broker claims are illustrative; conduct independent due diligence on any real property.</p><div className="tags">{modal.property.tags.concat(modal.property.amenities).map(t => <span key={t}>{t}</span>)}</div>{modal.property.certifications.length > 0 && <p className="small-note">Fictional certification labels: {modal.property.certifications.join(", ")}. Not a claim of actual certification.</p>}<section className="calculator"><h3>{modal.property.transaction === "Sale" ? "Asking price per SF calculator" : "Monthly base rent calculator"}</h3><p>{modal.property.transaction === "Sale" ? "Asking price ÷ area. Not a valuation or investment recommendation." : "Area × annual rate ÷ 12. Excludes NNN, operating costs, taxes and fees."} Demo input limits: 1 billion SF and $1 trillion.</p><div className="range-inputs"><label>Area (SF)<input type="number" min="1" max="1000000000" step="any" value={calculatorSize} onChange={e => setCalculatorSize(e.target.value)} /></label><label>{modal.property.transaction === "Sale" ? "Asking price ($)" : "Annual rate ($/SF/year)"}<input type="number" min="0" max="1000000000000" step="any" value={calculatorRate} onChange={e => setCalculatorRate(e.target.value)} /></label></div><output aria-live="polite" data-testid="calculator-output">{calculatorSize !== "" && calculatorRate !== "" && Number(calculatorSize) > 0 && Number(calculatorSize) <= 1e9 && Number(calculatorRate) >= 0 && Number(calculatorRate) <= 1e12 && Number.isFinite(Number(calculatorSize)) && Number.isFinite(Number(calculatorRate)) ? modal.property.transaction === "Sale" ? `${currency(Number(calculatorRate) / Number(calculatorSize), 2)}/SF` : `${currency(monthlyRent(Number(calculatorSize), Number(calculatorRate)), 2)}/month` : "Enter a positive area and a non-negative amount within the demo limits."}</output></section><div className="detail-actions"><button className="blue" onClick={() => open({ kind: "tour", property: modal.property })}><CalendarDays size={17} />Schedule a Tour</button><button className="secondary" onClick={() => save(modal.property!)}><Heart size={17} />{saved.includes(modal.property.id) ? "Unsave property" : "Save property"}</button></div></div>}
      </>}
    </dialog>
  </>;
}
