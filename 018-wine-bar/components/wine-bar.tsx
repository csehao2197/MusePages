"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Grape, MapPin, Menu, Plus, Sparkles, Users, Wine as WineIcon, X } from "lucide-react";
import Scene from "./scene";
import { wines, events, gallery, localDate, futureDate, dateLabel, money, type Wine, type BarEvent } from "./fixtures";

type ModalState =
  | { kind: "collection" } | { kind: "wine"; wine: Wine }
  | { kind: "booking"; mode: "tasting" | "reservation" | "private"; event?: BarEvent }
  | { kind: "gallery"; index: number }
  | { kind: "info"; title: string; text: string }
  | { kind: "nav" };

function Modal({ title, children, onClose, drawer = false }: { title: string; children: ReactNode; onClose: () => void; drawer?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previous; if (trigger?.isConnected) trigger.focus({ preventScroll: true }); };
  }, []);
  return <dialog className={drawer ? "modal drawer" : "modal"} ref={ref} aria-labelledby="modal-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={e => {
    if (e.key !== "Tab") return;
    const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled])')).filter(el => el.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }}>
    <div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={22}/></button></div>
    {children}
  </dialog>;
}

function Bottle({ wine }: { wine: Wine }) {
  return <svg className="bottle" viewBox="0 0 140 260" aria-hidden="true">
    <ellipse cx="70" cy="245" rx="46" ry="7" fill="#000" opacity=".25"/>
    <path d="M58 14h24v60q0 12 17 25q10 9 10 26v110q0 9-10 9H41q-10 0-10-9V125q0-17 10-26q17-13 17-25Z" fill={wine.style === "Red" ? "#27392d" : "#74774b"} stroke="#d3bf93" strokeOpacity=".25"/>
    <path d="M58 14h24v41H58Z" fill={wine.color}/><path d="M44 119v111" stroke="#fff" strokeOpacity=".12" strokeWidth="5"/>
    <rect x="34" y="133" width="72" height="78" rx="1" fill="#dfd3b8"/>
    <path d="M45 145h50M45 198h50" stroke="#aa8b61" strokeWidth=".8"/>
    <text x="70" y="160" textAnchor="middle" fontSize="8" fill="#493e36" fontFamily="Georgia">TERROIR</text>
    <text x="70" y="173" textAnchor="middle" fontSize="7" fill="#493e36" fontFamily="Georgia">&amp; VINE</text>
    <text x="70" y="188" textAnchor="middle" fontSize="8" fill="#493e36">{wine.vintage}</text>
  </svg>;
}

const navItems = [["Home", "home"], ["Wines", "wines"], ["Events", "events"], ["About", "about"], ["Visit", "visit"]];
const reviews = [
  { text: "The sommelier recommendations were spot-on. Best wine bar in the city.", name: "Sarah M.", context: "Illustrative guest vignette · not a Google review" },
  { text: "Hosted our anniversary here. The private tasting was unforgettable.", name: "James & Linda K.", context: "Fictional anniversary vignette · not a real endorsement" },
  { text: "Incredible selection and the ambiance is unmatched.", name: "David R.", context: "Illustrative guest vignette · not a Yelp review" },
];

function Collection({ onWine }: { onWine: (wine: Wine) => void }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const [style, setStyle] = useState("All styles");
  const [selected, setSelected] = useState<string[]>([]);
  const [flight, setFlight] = useState(false);
  const filtered = wines.filter(w => (region === "All regions" || w.region === region) && (style === "All styles" || w.style === style) && `${w.name} ${w.notes} ${w.country}`.toLowerCase().includes(query.toLowerCase()));
  const total = selected.reduce((sum, id) => sum + wines.find(w => w.id === id)!.price / 2, 0);
  const clearFilters = () => { setQuery(""); setStyle("All styles"); setRegion("All regions"); };
  return <>
    <p className="muted">Seven fictional cellar selections. Glass prices are illustrative; no alcohol is sold. Build a five-wine, 50 ml-per-wine tasting plan.</p>
    <div className="filters">
      <label>Search the cellar<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Wine, country, or flavor"/></label>
      <label>Region<select aria-label="Region" value={region} onChange={e => setRegion(e.target.value)}><option>All regions</option>{Array.from(new Set(wines.map(w => w.region))).map(r => <option key={r}>{r}</option>)}</select></label>
      <label>Style<select aria-label="Style" value={style} onChange={e => setStyle(e.target.value)}><option>All styles</option>{["Red", "White", "Rosé", "Sparkling"].map(s => <option key={s}>{s}</option>)}</select></label>
    </div>
    <div className="collection-results" aria-live="polite">{filtered.length} selections found</div>
    {!filtered.length && <div className="empty"><WineIcon/><h3>No bottles in this corner.</h3><p>Try another region or clear your filters.</p><button className="button outline" onClick={clearFilters}>Clear filters</button></div>}
    <div className="collection-list">{filtered.map(w => <article key={w.id} className="collection-row">
      <Bottle wine={w}/><div><span className="eyebrow">{w.region} · {w.style}</span><h3>{w.vintage} {w.name}</h3><p>{w.notes}</p><strong>{money(w.price)} / glass</strong><button className="text-button" onClick={() => onWine(w)}>Details & pairing <ArrowUpRight size={14}/></button></div>
      <button className={`flight-add ${selected.includes(w.id) ? "selected" : ""}`} aria-label={`${selected.includes(w.id) ? "Remove" : "Add"} ${w.name} ${selected.includes(w.id) ? "from" : "to"} flight`} disabled={!selected.includes(w.id) && selected.length === 5} onClick={() => { setFlight(false); setSelected(s => s.includes(w.id) ? s.filter(id => id !== w.id) : [...s, w.id]); }}>{selected.includes(w.id) ? <Check size={18}/> : <Plus size={18}/>}</button>
    </article>)}</div>
    <div className="flight-tray"><div><span className="eyebrow">Your five-wine flight</span><p aria-live="polite">{selected.length} / 5 pours · {money(total)} per guest</p><small>Each pour is priced at half its listed glass price. Pairings not included.</small></div><button className="button primary" disabled={selected.length !== 5} onClick={() => setFlight(true)}>Save flight plan</button><button className="text-button" onClick={() => { setSelected([]); setFlight(false); }}>Reset flight</button></div>
    {flight && <div role="status" className="success"><Check size={20}/><div><strong>Flight plan saved for this visit.</strong><p>{selected.map(id => wines.find(w => w.id === id)!.name).join(" · ")}. No order placed. Closing the cellar clears this plan.</p></div></div>}
  </>;
}

function WineDetails({ wine, back }: { wine: Wine; back: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const [paired, setPaired] = useState(false);
  const [saved, setSaved] = useState(false);
  return <div className="wine-detail"><div className="detail-bottle"><Bottle wine={wine}/><span className="eyebrow">Fictional cellar label</span></div><div><span className="eyebrow">{wine.vintage} · {wine.region}, {wine.country} · {wine.style}</span><h3>{wine.name}</h3><p>{wine.story}</p><p className="tasting-notes">{wine.notes}</p>
    <div className="pairing"><span className="eyebrow">A little something alongside</span><h4>{wine.pairing}</h4><p>{money(wine.pairingPrice)} / board · vegetarian · contains {wine.pairing.includes("almonds") ? "nuts" : "milk and/or wheat"}. Ask a real venue about allergens; this demo cannot assure safety.</p><label className="checkbox"><input type="checkbox" checked={paired} onChange={e => { setPaired(e.target.checked); setSaved(false); }}/> Include food pairing</label></div>
    <label>Glasses in your illustrative plan<input type="number" min="1" max="6" required value={quantity} onChange={e => { setQuantity(Number(e.target.value)); setSaved(false); }}/></label>
    <p className="plan-total" aria-live="polite">Plan total: {money((wine.price + (paired ? wine.pairingPrice : 0)) * (Number.isFinite(quantity) ? quantity : 0))}</p>
    <button className="button primary" disabled={!Number.isInteger(quantity) || quantity < 1 || quantity > 6} onClick={() => setSaved(true)}>Save pairing plan</button>
    {saved && <p className="success" role="status"><Check size={20}/> Pairing plan saved locally for this open dialog. No alcohol purchase or table booking.</p>}
    <div className="button-row"><button className="text-button" onClick={() => { setQuantity(1); setPaired(false); setSaved(false); }}>Reset pairing</button><button className="text-button" onClick={back}>Back to wine list <ArrowRight size={16}/></button></div>
  </div></div>;
}

function Booking({ mode, event }: { mode: "tasting" | "reservation" | "private"; event?: BarEvent }) {
  const min = mode === "private" ? 8 : 1;
  const max = event?.capacity ?? (mode === "private" ? 24 : 8);
  const [guests, setGuests] = useState(min);
  const [date, setDate] = useState(event ? futureDate(event.offset) : "");
  const [time, setTime] = useState(event?.time ?? "");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [adult, setAdult] = useState(false);
  const rate = event?.price ?? (mode === "reservation" ? 0 : 75);
  const validGuests = Number.isInteger(guests) && guests >= min && guests <= max;
  const reset = () => { setConfirmed(false); setError(""); setGuests(min); setDate(event ? futureDate(event.offset) : ""); setTime(event?.time ?? ""); setName(""); setAdult(false); };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const day = new Date(`${date}T12:00:00`).getDay();
    const earliest = day === 0 ? "15:00" : "16:00";
    const latest = day === 0 ? "20:00" : day === 5 || day === 6 ? "23:00" : "22:00";
    if (!validGuests) return setError(`Choose ${min}–${max} guests.`);
    if (!event && (date < localDate() || date > futureDate(90) || day === 1)) return setError("The demo venue is closed Monday. Choose another date within the next 90 days.");
    if (!event && (time < earliest || time > latest || !/^\d{2}:(00|30)$/.test(time))) return setError(`Choose a half-hour arrival between ${earliest} and ${latest}; the final hour is reserved for your visit.`);
    if (!event && date === localDate() && time <= new Date().toTimeString().slice(0, 5)) return setError("That arrival has already passed. Choose a later time or another date.");
    if (!name.trim()) return setError("Please enter a name for your local plan.");
    setError(""); setConfirmed(true);
  };
  if (confirmed) return <div className="confirmation" role="status"><span className="confirm-icon"><Check/></span><span className="eyebrow">Local demo confirmation</span><h3>Your evening, imagined.</h3><p>{name.trim()}, your {event ? event.name : mode === "reservation" ? "table visit" : mode === "private" ? "private tasting inquiry" : "guided tasting"} plan is ready.</p><dl><div><dt>When</dt><dd>{dateLabel(date)} · {time}</dd></div><div><dt>Party</dt><dd>{guests} adults, 21+</dd></div><div><dt>Illustrative total</dt><dd>{rate ? money(rate * guests) : "$0 · no reservation fee"}</dd></div></dl><p>No booking, inquiry, email, or payment was sent. Availability is fictional and no seats are held. Data disappears when this dialog closes.</p><button className="button primary" onClick={reset}>Plan another visit</button></div>;
  return <form className="booking-form" onSubmit={submit}>
    <p>{event ? event.description : mode === "reservation" ? "An unhurried table in our imagined warehouse bar. Plan a visit for 1–8 guests; drinks and food are not included." : "A curated five-wine flight with cheese pairings, guided by a fictional in-house sommelier. Private rooms welcome 8–24 guests; corporate inquiries use this same local plan."}</p>
    <div className="booking-summary"><WineIcon size={24}/><div><strong>{event?.name ?? (mode === "reservation" ? "A table for the evening" : "Five pours. Five stories.")}</strong><p>{rate ? `${money(rate)} / person` : "No table fee"} · {min}–{max} guests · {event ? `${event.capacity} illustrative spots` : "illustrative availability"}</p></div></div>
    <div className="form-grid"><label>Your name<input autoComplete="off" name="guestName" required maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="For your local plan only"/></label><label>Guests (21+)<input name="guests" type="number" required min={min} max={max} step="1" value={guests} onChange={e => setGuests(Number(e.target.value))}/></label><label>Date<input name="date" type="date" required min={localDate()} max={event ? futureDate(event.offset) : futureDate(90)} readOnly={!!event} value={date} onChange={e => { setDate(e.target.value); setError(""); }}/></label><label>Arrival time<input name="time" type="time" required min="00:00" step="1800" readOnly={!!event} value={time} onChange={e => { setTime(e.target.value); setError(""); }}/></label></div>
    <p className="muted">Monday closed. Sun: 15:00–20:00 arrivals. Tue–Thu: 16:00–22:00. Fri–Sat: 16:00–23:00. Select a half-hour slot; event times are fixed.</p>
    <label className="checkbox"><input name="adult" type="checkbox" required checked={adult} onChange={e => setAdult(e.target.checked)}/> All guests are 21+. I understand this is only a local demonstration.</label><p className="small">This declaration is not legally sufficient age verification. Please drink responsibly; no actual alcohol sales.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="booking-total"><span>Illustrative total</span><strong aria-live="polite">{validGuests ? money(rate * guests) : "Choose a valid party size"}</strong></div>
    <div className="button-row"><button className="button primary" type="submit">{mode === "private" && !event ? "Save event inquiry" : "Confirm local plan"} <ArrowRight size={17}/></button><button className="text-button" type="button" onClick={reset}>Reset form</button></div>
    <p className="small">No card details, accounts, provider, live capacity, or real booking. Your name stays in this dialog.</p>
  </form>;
}

export default function WineBar() {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [review, setReview] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [clubError, setClubError] = useState("");
  const [ready, setReady] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setReady(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(media.matches);
    updateMotion(); media.addEventListener("change", updateMotion);
    const scroll = () => { setScrolled(window.scrollY > 40); if (heroRef.current) heroRef.current.style.transform = media.matches ? "none" : `translateY(${Math.min(window.scrollY * .16, 100)}px)`; };
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); media.removeEventListener("change", updateMotion); };
  }, []);
  useEffect(() => {
    if (paused || reduced || modal) return;
    const timer = window.setInterval(() => { if (!document.hidden) setReview(r => (r + 1) % reviews.length); }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reduced, modal]);
  const book = (mode: "tasting" | "reservation" | "private", event?: BarEvent) => setModal({ kind: "booking", mode, event });
  const info = (title: string, text: string) => setModal({ kind: "info", title, text });
  const title = !modal ? "" : modal.kind === "collection" ? "The cellar collection" : modal.kind === "wine" ? "Notes from the cellar" : modal.kind === "booking" ? modal.event?.name ?? (modal.mode === "private" ? "Private tastings & events" : modal.mode === "reservation" ? "Plan your table visit" : "Book a tasting") : modal.kind === "gallery" ? gallery[modal.index].title : modal.kind === "info" ? modal.title : "Explore Terroir & Vine";
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={scrolled ? "site-header solid" : "site-header"}>
      <a href="#home" className="brand" aria-label="Terroir and Vine home"><Grape size={23}/><span>Terroir <i>&</i> Vine<small>WINE BAR & TASTING ROOM</small></span></a>
      <nav aria-label="Main navigation">{navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <button className="button nav-reserve" onClick={() => book("reservation")}>Reserve a table <ArrowUpRight size={15}/></button>
      <button className="icon-button menu-button" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => setModal({ kind: "nav" })}><Menu/></button>
    </header>
    <main id="main">
      <section className="hero" id="home">
        <div className="hero-art" ref={heroRef}><Scene variant="bar"/></div><div className="hero-shade"/>
        <div className="hero-content"><span className="eyebrow hero-eyebrow"><span/> ARTS DISTRICT · WAREHOUSE ROW</span><p className="hero-brand">Terroir & Vine</p><h1>A little closer<br/>to the <em>vineyard.</em></h1><p className="hero-tagline">Curated Wines. Crafted Experiences.</p><p className="hero-copy">Old-world character. New discoveries.<br/>An intimate evening, one glass at a time.</p><div className="button-row"><a className="button outline light" href="#wines">Explore Our Collection <ArrowRight size={17}/></a><button className="button primary" onClick={() => book("tasting")}>Book a Tasting <ArrowUpRight size={17}/></button></div></div>
        <div className="hero-bottom"><span><MapPin size={14}/> A fictional corner of the Arts District</span><a href="#about">SETTLE IN <span>↓</span></a><span>21+ · LOCAL DEMO · NO SALES</span></div>
      </section>
      <div className="demo-strip">AN ILLUSTRATIVE WINE BAR <span>·</span> Fictional wines, venue, availability & guest stories. No real bookings or purchases.</div>
      <section className="intro section" id="about"><span className="eyebrow">THE LAND. THE PEOPLE. THE POUR.</span><h2>Where Every Glass<br/>Tells a <em>Story</em></h2><p>Imagine wines from family-owned vineyards across France, Italy, and Spain. Our fictional sommelier team invites you into a rotating cellar concept of 200+ wines, from bold Barolos to crisp Sancerres.</p><p className="small">Seven fictional selections are available in this demo. Sourcing, cellar size, and team descriptions are illustrative, not operational claims.</p><div className="grape-divider"><span/><Grape size={22}/><span/></div></section>
      <section className="section wine-section" id="wines"><div className="section-heading"><div><span className="eyebrow">FROM OUR IMAGINED CELLAR</span><h2>A glass worth<br/><em>getting to know.</em></h2></div><p>Character over convention.<br/>A few of our current favorites,<br/>each with a story of its own.</p></div>
        <div className="wine-grid">{wines.slice(0, 3).map((w,i) => <article className="wine-card" key={w.id}><div className={`wine-art wine-art-${i}`}><span className="wine-number">0{i+1}</span><span className="style-tag">{w.style}</span><Bottle wine={w}/><span className="art-annotation">CELLAR SELECTION / {w.vintage}</span></div><div className="wine-card-body"><span className="eyebrow"><span className={`flag flag-${w.flag}`} aria-label={w.country}>{w.flag}</span> {w.region}, {w.country}</span><h3>{w.vintage}<br/>{w.name}</h3><p>{w.notes}</p><div className="card-bottom"><span><strong>{money(w.price)}</strong> / glass</span><button className="icon-button" aria-label={`Explore ${w.name}`} onClick={() => setModal({ kind: "wine", wine: w })}><ArrowUpRight/></button></div></div></article>)}</div>
        <div className="center"><button className="button outline" onClick={() => setModal({ kind: "collection" })}>View Full Wine List <ArrowRight size={17}/></button><p className="small">Illustrative labels & prices · thoughtful food pairings · build your own flight</p></div>
      </section>
      <section className="experience" id="tastings"><div className="experience-art"><Scene variant="alcove"/><span className="image-note">THE PRIVATE ROOM · ORIGINAL ILLUSTRATION</span><div className="experience-seal">5<small>WINES<br/>ONE JOURNEY</small></div></div><div className="experience-content"><span className="eyebrow">SOME EVENINGS DESERVE MORE</span><h2>Private Tastings<br/>& <em>Events</em></h2><p>Pull up a chair. Let our imagined sommelier guide you through the regions, traditions, and little details that make every pour different.</p><ul className="features"><li><WineIcon/><span>Curated 5-wine flight with cheese pairings</span></li><li><Users/><span>Private rooms for groups of 8–24 guests</span></li><li><Sparkles/><span>Corporate event packages available as demo inquiries</span></li></ul><button className="button primary" onClick={() => book("private")}>Inquire About Events <ArrowUpRight size={17}/></button><p className="small">Illustrative guided tasting: $75 per person. No inquiry is sent.</p></div></section>
      <section className="section events-section" id="events"><div className="section-heading"><div><span className="eyebrow">GOOD WINE. BETTER COMPANY.</span><h2>On the <em>calendar.</em></h2></div><a className="text-button" href="#all-events">View All Events <ArrowRight size={17}/></a></div><p className="small event-disclaimer">All three demo events below. Dates roll forward from today; spots and hosts are illustrative.</p><div className="event-grid" id="all-events">{events.map(event => <article className="event-card" key={event.id}><div className="event-art"><Scene variant={event.scene}/><div className="date-badge">{ready ? dateLabel(futureDate(event.offset)).split(", ")[1] : "SOON"}<small>{ready ? dateLabel(futureDate(event.offset)).split(", ")[0] : "DEMO"}</small></div></div><div className="event-body"><span className="eyebrow"><Clock3 size={13}/> {event.time} · GUIDED TASTING</span><h3>{event.name}</h3><p>{event.description}</p><div className="event-meta"><strong>{money(event.price)}<small> / person</small></strong><span className={event.capacity <= 8 ? "availability amber" : "availability"}><i/>{event.capacity} demo spots</span></div><button className="text-button" onClick={() => book("tasting", event)}>Plan a seat <ArrowUpRight size={17}/></button></div></article>)}</div></section>
      <section className="section gallery-section" id="atmosphere"><div className="section-heading"><div><span className="eyebrow">TAKE A LOOK AROUND</span><h2>A place to <em>linger.</em></h2></div><p>Warm brick. Candlelit corners.<br/>Room for one more story.</p></div><div className="gallery-grid">{gallery.map((g,i) => <button className={`gallery-tile gallery-${i}`} key={g.title} onClick={() => setModal({ kind: "gallery", index: i })} aria-label={`View ${g.title}`}><Scene variant={g.scene}/><span>{g.title}<Plus size={18}/></span></button>)}</div><p className="small center">Six original digital illustrations, not photographs of a real venue.</p></section>
      <section className="testimonials" aria-label="Illustrative guest stories"><span className="eyebrow">EVENINGS THAT STAY WITH YOU</span><div className="stars" aria-label="Fictional five-star vignette">✦ ✦ ✦ ✦ ✦</div><blockquote key={review}>“{reviews[review].text}”</blockquote><p className="review-name">{reviews[review].name}</p><p className="small">{reviews[review].context}</p><div className="review-controls">{reviews.map((_,i) => <button className={review === i ? "dot active" : "dot"} key={i} aria-label={`Show guest story ${i+1}`} aria-pressed={review === i} onClick={() => { setReview(i); setPaused(true); }}/>)}</div><button className="text-button small" onClick={() => setPaused(p => !p)} disabled={reduced}>{reduced ? "Autoplay off · reduced motion" : paused ? "Resume stories" : "Pause stories"}</button></section>
      <section className="section visit-section" id="visit"><div className="local-map" role="img" aria-label="Illustrative neighborhood diagram, not a real map or location"><div className="map-street horizontal street-1">WAREHOUSE ROW</div><div className="map-street horizontal street-2">ARTS WALK</div><div className="map-street vertical street-3">GALLERY LANE</div><div className="map-block block-1">THE GALLERIES</div><div className="map-block block-2">WAREHOUSE<br/>GARAGE</div><div className="map-block block-3">ARTS<br/>COURTYARD</div><div className="map-pin"><Grape/><span>Terroir & Vine</span><small>412 Warehouse Row</small></div><span className="map-compass">N ↑</span><span className="map-note">ILLUSTRATIVE NEIGHBORHOOD · NOT FOR NAVIGATION</span></div><div className="visit-content"><span className="eyebrow">YOUR EVENING STARTS HERE</span><h2>Find your<br/><em>favorite corner.</em></h2><p className="address"><MapPin size={18}/>412 Warehouse Row<br/>Arts District, Downtown</p><span className="small">Fictional address · (555) 923-7100 is a placeholder, not a contact line</span><dl className="hours"><div><dt>Tuesday–Thursday</dt><dd>4 PM – 11 PM</dd></div><div><dt>Friday–Saturday</dt><dd>4 PM – 1 AM</dd></div><div><dt>Sunday</dt><dd>3 PM – 9 PM</dd></div><div><dt>Monday</dt><dd>Taking a little rest</dd></div></dl><div className="happy-hour"><span className="eyebrow">THE GOLDEN HOURS</span><p>Tue–Thu, 4–6 PM · 30% off wines by the glass</p><small>Illustrative promotion only; not applied to tasting or event plans.</small></div><p className="small">Imagined validated parking in the Warehouse Row garage. No actual parking service.</p><button className="button outline" onClick={() => book("reservation")}>Plan your visit <ArrowUpRight size={17}/></button></div></section>
      <section className="club" id="club"><div><span className="eyebrow">A LITTLE CLOSER TO THE VINE</span><h2>Join the <em>Vine Club.</em></h2><p>First access to rare wines and exclusive events —<br/>a taste of the concept, not an actual mailing list.</p></div>{subscribed ? <div className="club-confirm" role="status"><Check/><h3>You’re on the local demo list.</h3><p>No email was sent or stored. This resets on reload.</p><button className="text-button" onClick={() => { setSubscribed(false); setEmail(""); setClubError(""); }}>Reset subscription</button></div> : <form className="club-form" onSubmit={e => { e.preventDefault(); if (!email.trim()) return setClubError("Enter an email to preview the club confirmation."); setClubError(""); setSubscribed(true); setEmail(""); }}><label htmlFor="club-email">Your email address</label><div className="email-row"><input id="club-email" type="email" required maxLength={120} value={email} onChange={e => { setEmail(e.target.value); setClubError(""); }} placeholder="you@example.com" autoComplete="off"/><button className="button primary" type="submit">Subscribe <ArrowRight size={17}/></button></div><label className="checkbox"><input type="checkbox" required/> I am 21+ and understand this is a demo.</label>{clubError && <p role="alert">{clubError}</p>}<small>Local confirmation only. No subscription, tracking, or email provider.</small></form>}</section>
    </main>
    <footer><div className="footer-top"><a className="brand" href="#home"><Grape/><span>Terroir <i>&</i> Vine<small>CURATED WINES. CRAFTED EXPERIENCES.</small></span></a><div className="footer-links"><button onClick={() => setModal({ kind: "collection" })}>Wine List</button><button onClick={() => book("private")}>Private Events</button><button onClick={() => info("Gift cards, thoughtfully imagined", "Gift cards are a concept only. No value is issued, sold, or redeemed in this demo. Try a tasting plan instead to explore the experience.")}>Gift Cards</button><button onClick={() => info("Careers at the imagined bar", "This fictional venue has no vacancies or application service. No CV or personal information is collected.")}>Careers</button><button onClick={() => info("Press & provenance", "Terroir & Vine is a fictional local design demo. There are no real awards, certifications, press endorsements, reviews, or producer affiliations. All venue art is original SVG; no photography was downloaded.")}>Press</button></div><div className="social-links">{["Instagram", "Facebook", "Yelp"].map((social,i) => <button aria-label={`${social} demo information`} key={social} onClick={() => info(`${social} · illustrative social link`, "No social account or third-party service is connected. The guest stories on this page are fictional, not published reviews.")}>{["ig","f","y"][i]}</button>)}</div></div><div className="footer-bottom"><span>© 2026 Terroir & Vine · Fictional design study</span><span>Must be 21+ to enter. Please drink responsibly.</span><span>No actual sales · bookings · payments</span></div></footer>
    {modal && <Modal title={title} onClose={() => setModal(null)} drawer={modal.kind === "nav"}>
      {modal.kind === "nav" && <nav className="drawer-nav" aria-label="Mobile navigation">{navItems.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setModal(null)}>{label}<ArrowUpRight size={22}/></a>)}<button className="button primary" onClick={() => book("reservation")}>Reserve a table</button><p className="small">21+ · illustrative venue · local plans only</p></nav>}
      {modal.kind === "collection" && <Collection onWine={wine => setModal({ kind: "wine", wine })}/>}
      {modal.kind === "wine" && <WineDetails key={modal.wine.id} wine={modal.wine} back={() => setModal({ kind: "collection" })}/>}
      {modal.kind === "booking" && <Booking key={modal.event?.id ?? modal.mode} mode={modal.mode} event={modal.event}/>}
      {modal.kind === "gallery" && <><div className="lightbox-art"><Scene variant={gallery[modal.index].scene}/></div><p>{gallery[modal.index].caption}</p><div className="lightbox-controls"><button className="icon-button" aria-label="Previous gallery image" onClick={() => setModal({ kind: "gallery", index: (modal.index + 5) % 6 })}><ChevronLeft/></button><span aria-live="polite">{modal.index + 1} / 6 · original illustration</span><button className="icon-button" aria-label="Next gallery image" onClick={() => setModal({ kind: "gallery", index: (modal.index + 1) % 6 })}><ChevronRight/></button></div></>}
      {modal.kind === "info" && <div className="info-content"><Grape size={36}/><p>{modal.text}</p><button className="button outline" onClick={() => book("tasting")}>Explore a tasting plan <CalendarDays size={17}/></button></div>}
    </Modal>}
  </>;
}
