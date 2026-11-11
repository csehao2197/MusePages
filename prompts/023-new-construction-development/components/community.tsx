"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, BedDouble, Check, ChevronLeft, ChevronRight, House, Leaf, MapPin, Menu, Phone, Ruler, Trees, Waves, X } from "lucide-react";
import { AmenityArt, CommunityArt, HouseArt, InteriorArt } from "./art";
import { gallery, lots, money, plans, timeline, type Lot, type Plan, type PlanId } from "./data";

type Modal = { kind: "plan"; plan: Plan } | { kind: "lot"; lot: Lot } | { kind: "gallery"; index: number } | { kind: "tour"; plan: Plan } | { kind: "brochure" } | { kind: "specs" } | { kind: "info"; title: string; content: string };
type Inquiry = { first: string; last: string; email: string; phone: string; selected: PlanId[]; purpose: string; date: string; time: string; notes: string };
const blankInquiry: Inquiry = { first: "", last: "", email: "", phone: "", selected: [], purpose: "Schedule a Tour", date: "", time: "10:00", notes: "" };
const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const nav = [["Community", "community"], ["Floor Plans", "plans"], ["Gallery", "gallery"], ["Availability", "availability"], ["Financing", "financing"], ["Contact", "contact"]];
const standards = [
  ["Kitchen", "Granite counters · stainless appliances · 36″ cabinets", "Quartz waterfall island · GE Café series* · 42″ soft-close cabinets + lighting"],
  ["Flooring", "LVP throughout the main level", "Hardwood throughout + tile in all baths"],
  ["Exterior", "Fiber cement siding · sodded front yard", "Stone / brick accents · full landscape + irrigation"],
  ["Smart home", "Schlage keypad entry*", "Ring security* · Nest thermostat* · motorized blinds"],
  ["Energy", "Concept: 2×6 framing · tankless water heater", "Same concept energy features as standard"],
];

function Dialog({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    const origin = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => { element?.close(); document.body.style.overflow = overflow; if (origin?.isConnected) origin.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className="dialog" aria-labelledby="dialog-title" onKeyDown={event => {
    if (event.key !== "Tab") return;
    const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'));
    const first = elements[0]; const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="dialog-top"><p className="eyebrow">RIDGELINE / CONCEPT PREVIEW</p><button className="icon-button" aria-label="Close dialog" onClick={close} autoFocus><X size={22}/></button></div>
    <h2 id="dialog-title">{title}</h2>{children}
  </dialog>;
}

function FloorDetail({ plan, request }: { plan: Plan; request: () => void }) {
  const [level, setLevel] = useState(0);
  return <>
    <p>{plan.beds} bedrooms · {plan.baths} baths · {plan.sqft.toLocaleString()} sq ft · {money(plan.price)} illustrative base</p>
    <div className="segmented" aria-label="Floor levels">{plan.rooms.map((_, i) => <button key={i} aria-pressed={level === i} onClick={() => setLevel(i)}>Level {i + 1}</button>)}</div>
    <svg className="floor-drawing" viewBox="0 0 620 380" role="img" aria-label={`${plan.name} level ${level + 1} schematic floor plan`}>
      <rect x="24" y="24" width="572" height="300" fill="#faf8f1" stroke="#263f49" strokeWidth="7"/>
      {plan.rooms[level].map((room, i) => { const x = 24 + (i % 3) * 190; const y = 24 + Math.floor(i / 3) * 150; return <g key={room.name}><rect x={x} y={y} width="190" height="150" fill="none" stroke="#263f49" strokeWidth="3"/><path d={`M${x + 30} ${y + 150}v-30q30 0 30 30`} fill="#faf8f1" stroke="#a4916d" strokeWidth="2"/><text x={x + 95} y={y + 62} textAnchor="middle" fill="#263f49" fontSize="15">{room.name}</text><text x={x + 95} y={y + 85} textAnchor="middle" fill="#53685f" fontSize="13">{room.width}′ × {room.depth}′</text></g>; })}
      <path d="M260 330H360M260 325V335M360 325V335" stroke="#a4916d" strokeWidth="2"/><text x="310" y="359" textAnchor="middle" fill="#53685f" fontSize="12">ROOM DIAGRAM / NOT TO SCALE</text>
    </svg>
    <p className="notice">Schematic only, not construction documents. Room rectangles are symbolic; listed dimensions are fictional interior dimensions. Selected rooms do not sum to the gross home area (circulation, walls, baths and storage omitted).</p>
    <h3>Room dimensions · level {level + 1}</h3><div className="dimension-list">{plan.rooms[level].map(room => <div key={room.name}><span>{room.name}</span><span>{room.width}′ × {room.depth}′ <strong>{room.width * room.depth} sq ft</strong></span></div>)}</div>
    <div className="two-col detail-features"><div><h3>Included in the concept</h3><ul><li>Open kitchen & generous gathering space</li><li>Granite surfaces and LVP main level</li><li>Keypad entry, tankless water heater*</li><li>Fiber cement exterior & front-yard sod</li></ul></div><div><h3>Make it your own</h3><ul><li>Premium interiors · +{money(25000)} demo</li><li>Screened porch · +{money(18000)} demo</li><li>Finish colors · no price change in demo</li></ul><p className="fine">*Specifications and certification unverified.</p></div></div>
    <button className="button primary" onClick={request}>Request Pricing <ArrowRight size={17}/></button>
  </>;
}

function LotDetail({ lot, request }: { lot: Lot; request: (id: PlanId) => void }) {
  const [id, setId] = useState<PlanId>(lot.compatible[0]);
  const [premium, setPremium] = useState(false);
  const [porch, setPorch] = useState(false);
  const plan = plans.find(p => p.id === id)!;
  return <>
    <p className="available-label">Available · fictional inventory</p><div className="lot-facts"><div><strong>{lot.acres.toFixed(2)}</strong><span>acres · {(lot.acres * 43560).toLocaleString("en-US", { maximumFractionDigits: 0 })} sq ft lot</span></div><div><strong>{lot.facing}-facing</strong><span>backyard · Phase {lot.phase}</span></div></div>
    <p><Trees size={19}/> {lot.premium} · illustrative lot premium {money(lot.premiumPrice)}</p>
    <label className="field">Compatible floor plan<select value={id} onChange={event => setId(event.target.value as PlanId)}>{lot.compatible.map(planId => { const p = plans.find(item => item.id === planId)!; return <option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>; })}</select></label>
    <fieldset><legend>Illustrative options</legend><label className="check-row"><input type="checkbox" checked={premium} onChange={e => setPremium(e.target.checked)}/>Premium interior package · +$25,000</label><label className="check-row"><input type="checkbox" checked={porch} onChange={e => setPorch(e.target.checked)}/>Screened porch · +$18,000</label></fieldset>
    <div className="estimate"><span>Illustrative starting total</span><strong data-testid="lot-total">{money(plan.price + lot.premiumPrice + (premium ? 25000 : 0) + (porch ? 18000 : 0))}</strong><p>Base {money(plan.price)} + lot {money(lot.premiumPrice)} + selected options. Excludes taxes, fees and financing. Not a quote or offer.</p></div>
    <button className="button primary" onClick={() => request(id)}>Request Info on This Lot <ArrowRight size={17}/></button>
  </>;
}

function Affordability() {
  const [price, setPrice] = useState("498000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  return <form className="calculator" onSubmit={e => {
    e.preventDefault();
    const principal = Number(price) * (1 - Number(down) / 100); const monthly = Number(rate) / 1200; const count = Number(years) * 12;
    const total = monthly === 0 ? principal / count : principal * monthly / (1 - (1 + monthly) ** -count);
    if (!Number.isFinite(total)) { setError("Check your figures and try again."); setResult(null); return; }
    setError(""); setResult(total);
  }}>
    <div><p className="eyebrow">A LITTLE CLARITY</p><h3>Explore the numbers</h3><p>A fictional principal-and-interest illustration. Not financial advice, pre-qualification, or an offer.</p></div>
    <div className="calc-fields"><label className="field">Home price ($)<input required type="number" min="100000" max="2000000" step="1000" value={price} onChange={e => { setPrice(e.target.value); setResult(null); }}/></label><label className="field">Down payment (%)<input required type="number" min="0" max="100" step="0.5" value={down} onChange={e => { setDown(e.target.value); setResult(null); }}/></label><label className="field">Annual interest (%)<input required type="number" min="0" max="20" step="0.01" value={rate} onChange={e => { setRate(e.target.value); setResult(null); }}/></label><label className="field">Term (years)<select value={years} onChange={e => { setYears(e.target.value); setResult(null); }}><option>30</option><option>20</option><option>15</option></select></label></div>
    <div className="calc-actions"><button className="button primary" type="submit">Calculate illustration</button><button className="text-button" type="button" onClick={() => { setPrice("498000"); setDown("20"); setRate("6.5"); setYears("30"); setResult(null); setError(""); }}>Reset calculator</button></div>
    <div aria-live="polite">{result !== null && <p className="calc-result"><strong>{money(result)} / month</strong> Principal & interest only. Excludes property tax, insurance, HOA, PMI, fees and closing costs. Actual financing may differ.</p>}{error && <p role="alert">{error}</p>}</div>
  </form>;
}

export default function Community() {
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [beds, setBeds] = useState("all");
  const [area, setArea] = useState(3300);
  const [price, setPrice] = useState("650000");
  const [stories, setStories] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState("map");
  const [status, setStatus] = useState("all");
  const [phase, setPhase] = useState("all");
  const [lotPlan, setLotPlan] = useState("all");
  const [listCount, setListCount] = useState(12);
  const [zoom, setZoom] = useState(1);
  const [step, setStep] = useState(1);
  const [featureTab, setFeatureTab] = useState(0);
  const [tourScene, setTourScene] = useState(0);
  const [inquiry, setInquiry] = useState<Inquiry>({ ...blankInquiry });
  const [context, setContext] = useState("General community inquiry");
  const [formStage, setFormStage] = useState<"edit" | "preview" | "confirmed">("edit");
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const filteredPlans = plans.filter(p => (beds === "all" || p.beds === Number(beds)) && p.sqft <= area && p.price <= Number(price) && (stories === "all" || p.stories === Number(stories)));
  const filteredLots = lots.filter(l => (status === "all" || l.status === status) && (phase === "all" || l.phase === Number(phase)) && (lotPlan === "all" || l.compatible.includes(lotPlan as PlanId)));
  const sortedLots = [...filteredLots].sort((a, b) => ["Available", "Model home", "Under contract", "Sold"].indexOf(a.status) - ["Available", "Model home", "Under contract", "Sold"].indexOf(b.status) || a.number - b.number);
  const resetFilters = () => { setBeds("all"); setArea(3300); setPrice("650000"); setStories("all"); };
  const resetLots = () => { setStatus("all"); setPhase("all"); setLotPlan("all"); setListCount(12); setZoom(1); };
  const info = (title: string, content: string) => setModal({ kind: "info", title, content });
  const visit = (purpose = "Schedule a Tour", selected?: PlanId, subject = "General community inquiry") => {
    setModal(null); setMobileNav(false); setFormStage("edit"); setFormError(""); setContext(subject);
    setInquiry(current => ({ ...current, purpose, selected: selected ? [selected] : current.selected }));
    requestAnimationFrame(() => { formRef.current?.scrollIntoView({ behavior: "instant", block: "start" }); formRef.current?.querySelector<HTMLInputElement>('input[name="first"]')?.focus({ preventScroll: true }); });
  };
  const update = <K extends keyof Inquiry>(key: K, value: Inquiry[K]) => { setInquiry(current => ({ ...current, [key]: value })); setFormError(""); };
  const resetInquiry = () => { setInquiry({ ...blankInquiry, selected: [] }); setContext("General community inquiry"); setFormStage("edit"); setFormError(""); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input[name="first"]')?.focus()); };
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (formStage !== "edit") reviewRef.current?.focus({ preventScroll: true });
  }, [formStage]);
  useEffect(() => {
    if (!mobileNav) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setMobileNav(false); menuRef.current?.focus(); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileNav]);
  const modalTitle = modal?.kind === "plan" ? modal.plan.name : modal?.kind === "lot" ? `Homesite ${modal.lot.number}` : modal?.kind === "gallery" ? gallery[modal.index] : modal?.kind === "tour" ? `${modal.plan.name} · Guided concept tour` : modal?.kind === "brochure" ? "Take Ridgeline with you" : modal?.kind === "specs" ? "The details make the difference" : modal?.kind === "info" ? modal.title : "";

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="demo-banner">AN ORIGINAL COMMUNITY CONCEPT <span>· Fictional availability, pricing & location. No real sales or bookings.</span></div>
    <header className="header">
      <a href="#main" className="brand" aria-label="Crestwood Homes home"><span className="brand-mark"><House size={28} strokeWidth={1.5}/></span><span>CRESTWOOD<small>H O M E S</small></span></a>
      <nav id="mobile-nav-links" className={mobileNav ? "nav open" : "nav"} aria-label="Main navigation">{nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMobileNav(false)}>{label}</a>)}</nav>
      <button className="phone" aria-label="Fictional sales phone information" onClick={() => info("Let’s talk · concept contact", "919-555-0142 is a fictional demo number. There is no live sales team or calling service. Use the local inquiry form to preview a request; no information is transmitted.")}><Phone size={16}/><span>919-555-0142</span></button>
      <button className="button primary header-cta" onClick={() => visit()}>Schedule a Tour <ArrowRight size={16}/></button>
      <button ref={menuRef} className="icon-button mobile-menu" aria-label={mobileNav ? "Close navigation" : "Open navigation"} aria-expanded={mobileNav} aria-controls="mobile-nav-links" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X/> : <Menu/>}</button>
    </header>
    <main id="main" data-ready={ready}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art"><CommunityArt/></div><div className="hero-shade"/>
        <div className="hero-badge"><span className="pulse"/>Phase 2 now selling <span className="badge-divider"/>14 homesites remaining<small>Fictional concept inventory</small></div>
        <div className="hero-copy"><p className="eyebrow">SOUTHWEST RALEIGH, NORTH CAROLINA · CONCEPT</p><h1 id="hero-title">Your new home.<br/>A whole new <em>chapter.</em></h1><p className="hero-sub">Welcome to Ridgeline at Cedar Creek. 86 thoughtfully designed single-family homes from the $420s.</p><div className="hero-actions"><a className="button primary" href="#plans">Explore Floor Plans <ArrowRight size={18}/></a><button className="button outline-light" onClick={() => visit()}>Schedule a Model Home Tour</button></div><p className="art-note">Original architectural illustration · not a photograph or built community</p></div>
        <a className="hero-scroll" href="#community" aria-label="Discover the community"><ArrowDown size={22}/><span>PUT DOWN ROOTS</span></a>
      </section>
      <section className="stats" aria-label="Community at a glance"><div><span>STARTING FROM</span><strong>$425,000<sup>*</sup></strong></div><div><span>ROOM TO GROW</span><strong>3–5 <small>bedrooms</small></strong></div><div><span>THOUGHTFULLY DESIGNED</span><strong>1,842–3,218 <small>sq ft</small></strong></div><div><span>A LITTLE MORE SPACE</span><strong>0.25–0.40 <small>acre lots</small></strong></div></section>
      <p className="stats-note">*Illustrative starting prices, sizes and inventory only. Not an offer. Exact plan areas replace the brief’s rounded 1,800–3,200 sq ft range.</p>
      <section id="community" className="section community-section">
        <div className="community-copy"><p className="eyebrow">01 / THE COMMUNITY</p><h2>Life at <em>Ridgeline.</em></h2><p className="lead">More fresh air. More front-porch hellos. More of the moments that make a place feel like home.</p><p>A walkable, amenity-rich neighborhood imagined for how families actually live — with trails, green space, and neighbors who become friends.</p>
          <div className="highlights"><div><Waves/><span><strong>Resort-style pool & clubhouse</strong><small>Summer 2026 opening · unverified concept target</small></span></div><div><Trees/><span><strong>12 acres of preserved green space</strong><small>Walking trails, two playgrounds & sand volleyball · concept</small></span></div><div><House/><span><strong>Connected to everyday life</strong><small>School zoning, retail & hospital proximity unverified</small></span></div></div>
          <button className="text-button" onClick={() => setModal({ kind: "brochure" })}>Download Community Brochure <ArrowRight size={18}/></button>
        </div>
        <div className="collage"><div className="collage-main"><AmenityArt scene={0}/><span>YOUR EVERYDAY, REIMAGINED</span></div><div className="collage-small"><AmenityArt scene={1}/></div><div className="collage-small"><AmenityArt scene={2}/></div><div className="green-caption"><Leaf size={27}/><strong>Room to put down <em>roots.</em></strong><small>Original landscape concepts</small></div></div>
      </section>
      <section id="plans" className="section plans-section">
        <div className="section-heading"><div><p className="eyebrow">02 / FIND YOUR FIT</p><h2>Choose your <em>floor plan.</em></h2></div><p>Four distinct designs.<br/>One place to belong.</p></div>
        <button className="filter-toggle button secondary" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}>Refine floor plans <span>{filtersOpen ? "−" : "+"}</span></button>
        <div className={`filters ${filtersOpen ? "expanded" : ""}`}><label className="field">Bedrooms<select aria-label="Bedrooms" value={beds} onChange={e => setBeds(e.target.value)}><option value="all">All bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option><option value="5">5 bedrooms</option></select></label><label className="field">Maximum area · {area.toLocaleString()} sq ft<input type="range" min="1800" max="3300" step="50" value={area} onChange={e => setArea(Number(e.target.value))}/></label><label className="field">Maximum base price<select aria-label="Maximum base price" value={price} onChange={e => setPrice(e.target.value)}><option value="650000">$650,000</option><option value="575000">$575,000</option><option value="500000">$500,000</option><option value="450000">$450,000</option></select></label><label className="field">Stories<select aria-label="Stories" value={stories} onChange={e => setStories(e.target.value)}><option value="all">All stories</option><option value="1">1-story</option><option value="2">2-story</option></select></label><button className="text-button" onClick={resetFilters}>Reset filters</button></div>
        <p className="result-count" role="status">{filteredPlans.length} of 4 floor plans · fictional starting prices</p>
        <div className="plan-grid">{filteredPlans.map(plan => <article className="plan-card" key={plan.id}><div className="plan-image"><HouseArt variant={plans.indexOf(plan)} label={`${plan.name} ${plan.style} original exterior rendering`}/>{plan.badge && <span className="plan-badge">{plan.badge}</span>}<span className="image-label">{plan.style}</span></div><div className="plan-body"><div className="plan-title"><h3>{plan.name}</h3><span>From <strong>{money(plan.price)}</strong></span></div><div className="specs"><span><BedDouble size={16}/>{plan.beds} bed</span><span>{plan.baths} bath</span><span><Ruler size={16}/>{plan.sqft.toLocaleString()} sq ft</span><span>{plan.stories}-story</span></div><div className="card-actions"><button className="button secondary" onClick={() => setModal({ kind: "plan", plan })}>View Floor Plan</button><button className="button primary" onClick={() => { setStatus("Available"); setPhase("2"); setLotPlan(plan.id); setView("list"); setListCount(14); document.getElementById("availability")?.scrollIntoView({ behavior: "instant" }); info(`Availability for ${plan.name}`, `${lots.filter(l => l.status === "Available" && l.compatible.includes(plan.id)).length} fictional available homesites fit ${plan.name}. Compatible plans are listed in each homesite detail. Close this preview to browse the filtered available list; no live inventory is queried.`); }}>Check Availability <ArrowRight size={15}/></button></div></div></article>)}</div>
        {filteredPlans.length === 0 && <div className="empty"><House size={32}/><h3>No plans match this combination.</h3><p>Try a larger area or price limit, or explore all four designs.</p><button className="button primary" onClick={resetFilters}>Show all floor plans</button></div>}
      </section>
      <section id="availability" className="section availability-section">
        <div className="section-heading"><div><p className="eyebrow">03 / A PLACE OF YOUR OWN</p><h2>Find your <em>homesite.</em></h2></div><p>Choose the view.<br/>Imagine the possibilities.</p></div>
        <div className="site-toolbar"><div className="segmented view-toggle"><button aria-pressed={view === "map"} onClick={() => setView("map")}>Site plan</button><button aria-pressed={view === "list"} onClick={() => setView("list")}>Lot list</button></div><label className="field">Lot status<select aria-label="Lot status" value={status} onChange={e => { setStatus(e.target.value); setListCount(12); }}><option value="all">All statuses</option><option>Available</option><option>Under contract</option><option>Sold</option><option>Model home</option></select></label><label className="field">Phase<select aria-label="Phase" value={phase} onChange={e => { setPhase(e.target.value); setListCount(12); }}><option value="all">All phases</option><option value="1">Phase 1 · sold out</option><option value="2">Phase 2 · concept selling</option><option value="3">Phase 3 · future concept</option></select></label><label className="field">Compatible plan<select aria-label="Compatible plan" value={lotPlan} onChange={e => { setLotPlan(e.target.value); setListCount(12); }}><option value="all">All floor plans</option>{plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className="text-button" onClick={resetLots}>Reset homesites</button></div>
        <div className={view === "map" ? "site-map" : "site-map list-selected"}>
          <div className="map-heading"><span>RIDGELINE AT CEDAR CREEK</span><span>SCHEMATIC SITE PLAN / NOT TO SCALE</span></div>
          <div className="zoom-controls"><button className="icon-button" aria-label="Zoom out site plan" disabled={zoom <= 1} onClick={() => setZoom(z => z - .25)}>−</button><span>{Math.round(zoom * 100)}%</span><button className="icon-button" aria-label="Zoom in site plan" disabled={zoom >= 1.75} onClick={() => setZoom(z => z + .25)}>+</button></div>
          <div className="map-scroll" tabIndex={0} aria-label="Scrollable schematic homesite plan"><svg viewBox="0 0 1060 660" style={{ width: `${zoom * 100}%` }} aria-label="86 fictional homesites, colored by availability" role="group">
            <rect width="1060" height="660" fill="#f0f2e8"/><path d="M0 62H1060M0 315H1060M0 555H1060" stroke="#d4d8ca" strokeWidth="42"/><path d="M90 0V660M984 0V660" stroke="#d4d8ca" strokeWidth="38"/><path d="M0 62H1060M0 315H1060M0 555H1060" stroke="#fbfaf2" strokeWidth="2" strokeDasharray="12 13"/>
            <rect x="328" y="347" width="216" height="65" rx="20" fill="#c4d3ae"/><text x="436" y="376" textAnchor="middle" fill="#4e674d" fontSize="13">CEDAR CREEK GREEN</text><text x="436" y="396" textAnchor="middle" fill="#4e674d" fontSize="10">TRAIL / CONCEPT</text>
            {lots.map((lot, index) => { const row = Math.floor(index / 18); const col = index % 18; const x = 134 + col * 45; const y = [106, 205, 427, 473, 592][row]; const match = filteredLots.includes(lot); const active = lot.status === "Available" || lot.status === "Model home"; return <g key={lot.number} className={`svg-lot ${active && match ? "interactive" : ""}`} role={active && match ? "button" : "img"} tabIndex={match ? 0 : -1} aria-label={`Lot ${lot.number}, ${lot.status}, Phase ${lot.phase}`} opacity={match ? 1 : .18} onClick={() => { if (!match || !active) return; if (lot.status === "Available") setModal({ kind: "lot", lot }); else { setTourScene(0); setModal({ kind: "tour", plan: plans[lot.number % 2 ? 1 : 3] }); } }} onKeyDown={e => { if ((e.key === "Enter" || e.key === " ") && match && active) { e.preventDefault(); if (lot.status === "Available") setModal({ kind: "lot", lot }); else { setTourScene(0); setModal({ kind: "tour", plan: plans[lot.number % 2 ? 1 : 3] }); } } }}>
              <title>{`Lot ${lot.number} · ${lot.status} · ${lot.acres.toFixed(2)} acres · Phase ${lot.phase}${active ? "" : " · not selectable"}`}</title><rect className="lot-hit-area" x={x - 4} y={y - 2} width="44" height={row < 2 ? 72 : 44} fill="transparent"/><rect x={x} y={y} width="36" height={row < 2 ? 68 : 40} rx="3" fill={{ Available: "#22c55e", "Under contract": "#f59e0b", Sold: "#94a3b8", "Model home": "#1d4ed8" }[lot.status]} stroke="#fff" strokeWidth="2"/><text x={x + 18} y={y + (row < 2 ? 39 : 25)} textAnchor="middle" fill={lot.status === "Model home" ? "white" : "#162b30"} fontSize="12" pointerEvents="none">{lot.number}</text>
            </g>; })}
            <text x="390" y="173" fontSize="15" fill="#536756">PHASE 1 / SOLD OUT</text><text x="695" y="379" fontSize="15" fill="#536756">PHASE 2 / CONCEPT RELEASE</text><text x="210" y="320" fontSize="12" fill="#536756">RIDGELINE DRIVE</text><path d="M1014 159V114l-9 17m9-17l9 17" stroke="#536756" strokeWidth="2"/><text x="1014" y="102" textAnchor="middle" fill="#536756">N</text>
          </svg></div><div className="future-phase">Phase 3 · coming Q4 2026 in the original concept — unverified target; future extension not part of the 86-lot drawing.</div>
        </div>
        <div className={view === "list" ? "lot-list active" : "lot-list"}>{sortedLots.slice(0, listCount).map(lot => <article className="lot-card" key={lot.number}><span className={`status-dot ${lot.status.toLowerCase().replace(" ", "-")}`}/><div><h3>Lot {lot.number}</h3><p>{lot.acres.toFixed(2)} acres · Phase {lot.phase}</p><small>{lot.premium}</small></div><div><span className="lot-status">{lot.status}</span>{lot.status === "Available" ? <button className="text-button" onClick={() => setModal({ kind: "lot", lot })}>View homesite <ArrowRight size={16}/></button> : lot.status === "Model home" ? <button className="text-button" onClick={() => { setTourScene(0); setModal({ kind: "tour", plan: plans[lot.number % 2 ? 1 : 3] }); }}>Explore model</button> : <small>Not selectable</small>}</div></article>)}{sortedLots.length > listCount && <button className="button secondary load-lots" onClick={() => setListCount(c => c + 18)}>Show more homesites ({sortedLots.length - listCount} remaining)</button>}</div>
        <div className="site-legend">{(["Available", "Under contract", "Sold", "Model home"] as const).map(s => <span key={s}><i className={`status-dot ${s.toLowerCase().replace(" ", "-")}`}/>{s}</span>)}<strong>14 Available · 23 Under Contract · 46 Sold · 3 Model Homes</strong></div>
        <p role="status" className="fine">{filteredLots.length} of 86 fictional homesites match your filters. On mobile, the lot list replaces the drawing.</p>
        {filteredLots.length === 0 && <div className="empty"><h3>No homesites in this selection.</h3><p>Phase 3 has no released homesites in this demo. Phase 1 has no available lots.</p><button className="button primary" onClick={resetLots}>Show all homesites</button></div>}
        <p className="notice">Availability, lot boundaries, orientations and premiums are fictional. Site and floor plans are schematic, not survey or construction documents. No deposits, reservations or purchases.</p>
      </section>
      <section id="gallery" className="section models-section">
        <div className="section-heading"><div><p className="eyebrow">04 / STEP INSIDE</p><h2>See your life <em>take shape.</em></h2></div><p>Tour our model home concepts.<br/>Finished, furnished. Full of possibility.</p></div>
        <div className="two-col model-grid">{[plans[3], plans[1]].map((plan, i) => <article className="model-card" key={plan.id}><InteriorArt scene={i === 0 ? 2 : 0}/><div className="model-body"><p className="eyebrow">MODEL HOME / ILLUSTRATIVE</p><h3>{plan.name}</h3><p>{plan.sqft.toLocaleString()} sq ft · {plan.beds} bed · {plan.baths} bath</p><div className="card-actions"><button className="button secondary" onClick={() => { setTourScene(0); setModal({ kind: "tour", plan }); }}>Take Virtual Tour</button><button className="button primary" onClick={() => visit("Schedule a Tour", plan.id, `${plan.name} model home tour`)}>Schedule In-Person Tour</button></div></div></article>)}</div>
        <p className="model-hours"><MapPin size={18}/> Concept model hours: Thu–Mon 10AM–5PM · Closed Tue–Wed <button className="text-button" onClick={() => info("Finding Ridgeline · schematic directions", "The source address, 100 Ridgeline Drive, Raleigh, NC 27607, is fictional/unverified. The on-page location graphic is an original schematic, not a navigation map. No GPS, routing or external map services are used. Do not travel based on this demo.")}>Address & directions <ArrowRight size={15}/></button></p>
        <div className="gallery-strip" aria-label="Concept image gallery">{gallery.map((label, i) => <button key={label} onClick={() => setModal({ kind: "gallery", index: i })} aria-label={`Expand ${label} image`}><InteriorArt scene={i}/><span>{label} <span>↗</span></span></button>)}</div>
        <p className="fine">Original SVG art substitutes for photography, renderings and 360° tours. No actual interior or built condition is represented.</p>
      </section>
      <section id="features" className="section features-section"><div className="section-heading"><div><p className="eyebrow">05 / THE CRESTWOOD DIFFERENCE</p><h2>Considered details.<br/><em>Included from day one.</em></h2></div><p>Beautiful comes standard.<br/>Your personal touch is optional.</p></div>
        <div className="segmented feature-tabs" aria-label="Specifications package"><button aria-pressed={featureTab === 0} onClick={() => setFeatureTab(0)}>Standard</button><button aria-pressed={featureTab === 1} onClick={() => setFeatureTab(1)}>Premium</button></div>
        <div className="comparison"><div className={`feature-column standard ${featureTab === 0 ? "selected" : ""}`}><p className="eyebrow">THOUGHTFULLY INCLUDED</p><h3>What’s included — standard</h3>{standards.map(row => <div key={row[0]}><strong>{row[0]}</strong><p>{row[1]}</p></div>)}</div><div className={`feature-column premium ${featureTab === 1 ? "selected" : ""}`}><p className="eyebrow">MAKE IT UNIQUELY YOURS</p><h3>Premium upgrade package</h3>{standards.map(row => <div key={row[0]}><strong>{row[0]}</strong><p>{row[2]}</p></div>)}</div></div>
        <p className="fine">*Source brand names are concept references, not provider endorsements. Energy Star certification, energy performance, materials and sustainability are unverified. No energy-savings guarantees.</p><button className="button secondary" onClick={() => setModal({ kind: "specs" })}>Request Full Specifications Sheet <ArrowRight size={17}/></button>
      </section>
      <section id="timeline" className="section timeline-section"><div><p className="eyebrow">06 / FROM VISION TO HOME</p><h2>A community.<br/><em>Growing thoughtfully.</em></h2><p>Follow the concept’s story, one chapter at a time. All phase dates and construction progress are fictional or unverified; no delivery guarantee.</p></div><div className="timeline-content"><div className="timeline-steps" aria-label="Construction timeline">{timeline.map((item, i) => <button key={item.title} aria-label={i === 3 ? "Your build" : `Phase ${i + 1}`} aria-pressed={step === i} onClick={() => setStep(i)}><span>0{i + 1}</span>{i === 3 ? "Your build" : `Phase ${i + 1}`}</button>)}</div><div className="timeline-panel" aria-live="polite"><p className="eyebrow">{timeline[step].date}</p><h3>{timeline[step].title}</h3><p>{timeline[step].detail}</p><button className="text-button" onClick={() => visit("Speak With a Sales Advisor", undefined, timeline[step].title)}>Ask about the process <ArrowRight size={17}/></button></div></div></section>
      <section id="neighborhood" className="section neighborhood-section"><div><p className="eyebrow">CLOSE TO WHAT MATTERS</p><h2>Connected to <em>Raleigh.</em></h2><p>Quiet streets in the concept. Everyday conveniences in the original brief.</p></div><div className="neighborhood-points"><div><strong>05 <small>min*</small></strong><span>Costco, Whole Foods<br/>& Crossroads Plaza</span></div><div><strong>08 <small>min*</small></strong><span>WakeMed Cary<br/>Hospital</span></div><div><strong>Wake <small>County*</small></strong><span>Cedar Creek Elementary<br/>Panther Creek High</span></div><p className="fine">*All location, travel-time, zoning and “top-rated school” claims are unverified source concepts. Verify with official school and local authorities; no live map or ratings.</p></div></section>
      <section id="financing" className="section financing-section"><div className="section-heading"><div><p className="eyebrow">07 / PLAN YOUR NEXT CHAPTER</p><h2>Make room for <em>possibility.</em></h2></div><p>Explore the original incentive concepts.<br/>Not active financing offers.</p></div>
        <div className="incentives"><article><p className="eyebrow">HISTORICAL CONCEPT · NOT AN OFFER</p><h3>Preferred lender rate</h3><strong>5.99%*</strong><p>Original March 2026 rate concept. Up to $12,000 in closing costs was proposed. Crestwood Mortgage Partners is fictional, not an endorsed lender.</p></article><article><p className="eyebrow">EXPIRED CONCEPT</p><h3>Phase 2 incentive</h3><strong>$15,000</strong><p>Original upgrade / closing-cost concept ended April 30, 2026. Not available or redeemable in this demo.</p></article><article><p className="eyebrow">EDUCATIONAL ONLY</p><h3>VA & FHA programs</h3><strong>Know your options.</strong><p>The brief mentions VA $0-down and FHA 3.5%-down programs. Eligibility, property approval and terms are not verified or guaranteed.</p></article></div>
        <p className="fine">*Original brief: rate as of March 2026, subject to credit approval, APR may vary. No current rates, lender referral, credit check, pre-qualification or financial advice here.</p>
        <button className="text-button" onClick={() => info("Before you explore financing", "The source’s “Get Pre-Qualified in 10 Minutes” action is replaced with this educational preview. No lender, credit check or account is connected. Consider asking a licensed professional about APR, closing costs, taxes, insurance, HOA and mortgage insurance. Never enter financial credentials in this demo.")}>Learn about pre-qualification <ArrowRight size={17}/></button>
        <Affordability/>
      </section>
      <section className="section testimonials"><p className="eyebrow">08 / IMAGINED HOMEOWNER STORIES</p><h2>The start of <em>something good.</em></h2><p className="fine">Fictional testimonials from the brief, not verified reviews or builder performance claims.</p><div className="testimonial-grid">{[
        ["“Building new meant we got exactly what we wanted — and the warranty gave us peace of mind.”", "The Martinez Family", "Lot 22"],
        ["“The build process was transparent. We had a dedicated project manager and a portal to track progress.”", "Jason & Emily P.", "Lot 38"],
        ["“The pool, the trails, the schools. It feels like a real neighborhood.”", "Sarah L.", "Lot 51"],
      ].map(([quote, name, lot]) => <article key={name}><span className="stars" aria-label="Fictional five-star review">★★★★★</span><blockquote>{quote}</blockquote><strong>{name}</strong><small>{lot} · fictional story</small></article>)}</div></section>
      <section id="contact" className="section contact-section"><div className="contact-left"><p className="eyebrow">09 / COME SAY HELLO</p><h2>Ready for your <em>next chapter?</em></h2><p>Picture yourself here. Preview a tour or pricing request — locally, with no information sent.</p>
        {formStage === "edit" ? <form ref={formRef} className="inquiry-form" onSubmit={e => {
          e.preventDefault(); setFormError("");
          if (inquiry.selected.length === 0) { setFormError("Choose at least one floor plan so we can tailor your preview."); return; }
          if (inquiry.phone.replace(/\D/g, "").length < 7) { setFormError("Enter a phone number with at least 7 digits for this local preview."); return; }
          if (inquiry.purpose === "Schedule a Tour") {
            const day = new Date(`${inquiry.date}T12:00:00`).getDay();
            if (day === 2 || day === 3) { setFormError("Concept models are closed Tuesday and Wednesday. Choose Thursday–Monday."); dateRef.current?.focus(); return; }
          }
          setFormStage("preview");
        }}>
          <div className="context-line"><span>Request context</span><strong>{context}</strong>{context !== "General community inquiry" && <button type="button" className="text-button" onClick={() => setContext("General community inquiry")}>Clear context</button>}</div>
          <div className="two-col"><label className="field">First name<input name="first" required autoComplete="given-name" maxLength={60} pattern={".*\\S.*"} value={inquiry.first} onChange={e => update("first", e.target.value)}/></label><label className="field">Last name<input required autoComplete="family-name" maxLength={60} pattern={".*\\S.*"} value={inquiry.last} onChange={e => update("last", e.target.value)}/></label><label className="field">Email<input required type="email" autoComplete="email" maxLength={100} value={inquiry.email} onChange={e => update("email", e.target.value)}/></label><label className="field">Phone<input required type="tel" autoComplete="tel" pattern={"[+0-9\\(\\) .\\-]{7,20}"} title="Use 7–20 characters: digits, spaces, +, parentheses, dots or hyphens." value={inquiry.phone} onChange={e => update("phone", e.target.value)}/></label></div>
          <fieldset><legend>I’m interested in:</legend><div className="plan-checks">{plans.map(p => <label className="check-row" key={p.id}><input type="checkbox" checked={inquiry.selected.includes(p.id)} onChange={e => update("selected", e.target.checked ? [...inquiry.selected, p.id] : inquiry.selected.filter(id => id !== p.id))}/>{p.name}</label>)}</div></fieldset>
          <fieldset><legend>I’d like to:</legend>{["Schedule a Tour", "Get Pricing Info", "Speak With a Sales Advisor"].map(p => <label className="check-row" key={p}><input name="purpose" type="radio" checked={inquiry.purpose === p} onChange={() => update("purpose", p)}/>{p}</label>)}</fieldset>
          {inquiry.purpose === "Schedule a Tour" && <div className="two-col"><label className="field">Preferred tour date<input ref={dateRef} required type="date" min={localDate()} max={`${Number(localDate().slice(0, 4)) + 1}${localDate().slice(4)}`} value={inquiry.date} onChange={e => update("date", e.target.value)}/><small>Thu–Mon only · next 12 months · fictional hours</small></label><label className="field">Preferred tour time<select value={inquiry.time} onChange={e => update("time", e.target.value)}>{["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map(time => <option key={time}>{time}</option>)}</select><small>Illustrative local Raleigh time; no slot reserved</small></label></div>}
          <label className="field">Anything else? <small>Optional · no sensitive information</small><textarea rows={3} maxLength={500} value={inquiry.notes} onChange={e => update("notes", e.target.value)}/></label>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <button className="button primary full" type="submit">{inquiry.purpose === "Schedule a Tour" ? "Preview My Tour Request" : "Preview My Inquiry"} <ArrowRight size={18}/></button><button className="text-button" type="button" onClick={resetInquiry}>Reset inquiry</button>
          <p className="fine">Your information stays in this page’s memory. Never sent, stored, emailed or shared. Refresh clears it. This is not an appointment or sales transaction.</p>
        </form> : <div ref={reviewRef} tabIndex={-1} className="request-review" aria-label={formStage === "confirmed" ? "Request confirmed locally" : "Review local request"}>
          {formStage === "preview" ? <><p className="eyebrow">REVIEW BEFORE CONFIRMING</p><h3>Your local request preview</h3><p>{inquiry.first} {inquiry.last} · {inquiry.email} · {inquiry.phone}</p><dl><dt>Context</dt><dd>{context}</dd><dt>Interested in</dt><dd>{inquiry.selected.map(id => plans.find(p => p.id === id)!.name).join(", ")}</dd><dt>Purpose</dt><dd>{inquiry.purpose}</dd>{inquiry.purpose === "Schedule a Tour" && <><dt>Preferred time</dt><dd>{inquiry.date} at {inquiry.time} · Raleigh local time (illustrative)</dd></>}{inquiry.notes && <><dt>Notes</dt><dd>{inquiry.notes}</dd></>}</dl><p className="notice">Nothing will be sent or booked. Confirm creates an on-page acknowledgment only.</p>{formError && <p role="alert" className="form-error">{formError}</p>}<div className="review-actions"><button className="button primary" onClick={() => { setFormError(""); setFormStage("confirmed"); }}>Confirm local preview</button><button className="button secondary" onClick={() => { setFormStage("edit"); setFormError(""); }}>Edit request</button><button className="text-button" onClick={() => setFormError("Simulated local preview error. Nothing was sent. Retry confirmation or edit your request.")}>Simulate preview error</button></div></>
          : <><span className="success-icon"><Check size={30}/></span><h3>Preview confirmed. Your next chapter can wait.</h3><p>Local reference: RIDGE-DEMO-023. Your {inquiry.purpose.toLowerCase()} for {inquiry.selected.map(id => plans.find(p => p.id === id)!.name).join(", ")} was acknowledged on this page only.</p><p>No appointment reserved. No email, call, account or transaction created.</p><button className="button primary" onClick={resetInquiry}>Start a new request</button></>}
        </div>}
      </div><aside className="contact-aside"><div className="location-art"><svg viewBox="0 0 480 390" role="img" aria-label="Original schematic location diagram, not a real navigation map"><rect width="480" height="390" fill="#e8ecde"/><path d="M0 90H480M0 270H480M125 0V390M355 0V390" stroke="#fffaf0" strokeWidth="28"/><path d="M0 135Q235 221 480 190" fill="none" stroke="#b5cecd" strokeWidth="18"/><rect x="170" y="220" width="136" height="80" rx="12" fill="#bacba4"/><path d="M240 113c-28 0-45 21-45 43s45 69 45 69 45-45 45-69-18-43-45-43Z" fill="#1d4ed8"/><circle cx="240" cy="156" r="13" fill="#f8fafc"/><text x="240" y="343" fill="#526755" textAnchor="middle" fontSize="12" letterSpacing="2">SCHEMATIC / LOCATION UNVERIFIED</text></svg><div className="location-card"><p className="eyebrow">THE CONCEPT SALES CENTER</p><h3>100 Ridgeline Drive</h3><p>Raleigh, NC 27607 · unverified address</p><button className="text-button" onClick={() => info("Directions · illustrative only", "This is an original schematic, not a real map. The source address is fictional/unverified. No live directions are available and no maps provider is connected. Do not use this demo for navigation.")}>View directions preview <ArrowRight size={16}/></button></div></div><div className="contact-hours"><h3>A warm welcome.<br/><em>On your schedule.</em></h3><p>Thu–Mon · 10AM–5PM<br/>Closed Tuesday & Wednesday<br/>Fictional model hours</p><button className="text-button" onClick={() => info("Fictional contact", "919-555-0142 is a fictional number. No calling or sales service is available. Local request previews stay in memory only.")}><Phone size={17}/>919-555-0142</button></div></aside></section>
    </main>
    <footer className="footer"><div className="footer-intro"><a className="brand" href="#main"><House size={31}/><span>CRESTWOOD<small>H O M E S</small></span></a><p>Built around life.<br/><em>Designed for what’s next.</em></p><span>RIDGELINE AT CEDAR CREEK / CONCEPT</span></div><div className="footer-links">{[
      { title: "Community", links: ["Overview", "Floor Plans", "Availability", "Gallery", "Amenities"] },
      { title: "Buying", links: ["Financing", "Incentives", "FAQ", "Build Process Timeline"] },
      { title: "Crestwood Homes", links: ["About", "Other Communities", "Careers", "Warranty", "Refer a Friend"] },
      { title: "Connect", links: ["Contact Sales", "Schedule Tour", "Newsletter", "Instagram", "Facebook"] },
    ].map(group => <details key={group.title} open><summary>{group.title}</summary><div>{group.links.map(label => {
      const routes: Record<string, string> = { Overview: "community", "Floor Plans": "plans", Availability: "availability", Gallery: "gallery", Amenities: "community", Financing: "financing", Incentives: "financing", "Build Process Timeline": "timeline", "Contact Sales": "contact" };
      if (routes[label]) return <a href={`#${routes[label]}`} key={label}>{label}</a>;
      return <button key={label} onClick={() => label === "Schedule Tour" ? visit() : info(label, label === "FAQ" ? "Is this a real community? No — it is a fictional demo. Can I book or buy? No. What is included? Explore the specification comparison. Are plans accurate? They are schematic, not construction documents. Are prices current? All prices and inventory are fictional." : `${label} is a local concept preview only. Crestwood Homes is fictional; there are no external communities, employment applications, warranty coverage, referral rewards, newsletter subscriptions or social accounts connected. No data is collected and no provider is endorsed.`)}>{label}</button>;
    })}</div></details>)}</div><div className="footer-bottom"><p>© 2026 Crestwood Homes, LLC (fictional). All pricing, square footage, and availability subject to change without notice. Renderings are artist’s impressions and may vary from final product.</p><p><House size={18}/> Equal Housing Opportunity · NC General Contractor #12345 is an unverified placeholder, not a licensed-builder claim.</p><p>All builder, review, location, market, permit, certification, sustainability and completion claims are fictional or unverified. Original SVG/CSS art; system fonts. No live services.</p></div></footer>
    <div className="mobile-tour"><span>Find your next chapter.<small>Local preview · not a booking</small></span><button className="button primary" onClick={() => visit()}>Schedule a Tour <ArrowRight size={15}/></button></div>
    {modal && <Dialog title={modalTitle} close={() => setModal(null)}>
      {modal.kind === "plan" && <FloorDetail plan={modal.plan} request={() => visit("Get Pricing Info", modal.plan.id, `${modal.plan.name} pricing`)}/>}
      {modal.kind === "lot" && <LotDetail lot={modal.lot} request={id => visit("Get Pricing Info", id, `Lot ${modal.lot.number} · ${modal.lot.acres.toFixed(2)} acres · ${modal.lot.premium}`)}/>}
      {modal.kind === "gallery" && <><InteriorArt scene={modal.index}/><div className="gallery-controls"><button className="button secondary" aria-label="Previous gallery image" onClick={() => setModal({ kind: "gallery", index: (modal.index + 5) % 6 })}><ChevronLeft size={19}/>Previous</button><span aria-live="polite">{modal.index + 1} / 6 · {gallery[modal.index]}</span><button className="button secondary" aria-label="Next gallery image" onClick={() => setModal({ kind: "gallery", index: (modal.index + 1) % 6 })}>Next<ChevronRight size={19}/></button></div><p className="notice">Original concept art, not photography. Illustrated finishes and conditions are fictional.</p></>}
      {modal.kind === "tour" && <><p>{modal.plan.sqft.toLocaleString()} sq ft · {modal.plan.beds} bed · {modal.plan.baths} bath</p><InteriorArt scene={[2, 0, 1, 3][tourScene]}/><div className="segmented tour-rooms" aria-label="Concept tour rooms">{["Great room", "Kitchen", "Primary bath", "Backyard"].map((label, i) => <button key={label} aria-pressed={tourScene === i} onClick={() => setTourScene(i)}>{label}</button>)}</div><p aria-live="polite">{["Open gathering space and natural light.", "A kitchen designed for everyday connection.", "A quiet retreat, with room to unwind.", "A little more space under the open sky."][tourScene]}</p><p className="notice">Guided original SVG scenes substitute for a 360° tour / video. No real model, video or third-party embed.</p><button className="button primary" onClick={() => visit("Schedule a Tour", modal.plan.id, `${modal.plan.name} model home tour`)}>Schedule In-Person Tour</button></>}
      {modal.kind === "brochure" && <><p>Four plans. A green-space community concept. All the details in one local, print-ready brochure.</p><ul><li>Illustrative plan dimensions and starting prices</li><li>Concept amenities, included features and visit information</li><li>Clear fictional-data and asset notices</li></ul><p className="notice">The requested PDF is adapted to accessible HTML. Download the HTML, then use your browser’s print / save as PDF feature. No email required or sent.</p><a className="button primary" href="/community-brochure.html" download="ridgeline-concept-brochure.html">Download local brochure <ArrowDown size={17}/></a><p className="fine">You remain on this page; close the preview to keep exploring.</p></>}
      {modal.kind === "specs" && <><p>Fictional specification sheet · no actual builder guarantees.</p>{standards.map(([category, standard, premium]) => <div className="spec-sheet-row" key={category}><h3>{category}</h3><p><strong>Standard:</strong> {standard}</p><p><strong>Premium:</strong> {premium}</p></div>)}<p className="notice">Energy Star certification and performance are unverified. Brand references imply no endorsement. Premium interiors +$25,000 and screened porch +$18,000 are fictional fixture amounts, not actual upgrade quotes.</p><button className="button primary" onClick={() => visit("Get Pricing Info", undefined, "Full specifications and upgrades")}>Preview a specifications inquiry</button></>}
      {modal.kind === "info" && <><p>{modal.content}</p><button className="button primary" onClick={() => setModal(null)}>Back to exploring <ArrowRight size={17}/></button></>}
    </Dialog>}
  </>;
}
