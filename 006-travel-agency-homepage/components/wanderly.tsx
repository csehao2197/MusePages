"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, CalendarDays, Camera, Check, CheckCircle2, Compass, Globe, Heart, Leaf, Mail, Map, MapPin, Menu, MessageCircle, Minus, Mountain, Music2, Phone, Plane, Play, Plus, Search, ShieldCheck, Sparkles, Star, Users, Wine, X } from "lucide-react";
import Scene from "./scene";
import { articles, categories, dateError, money, styles, today, trips, type Trip, type TripStyle } from "./data";

type Modal = { kind: "trip"; trip: Trip } | { kind: "plan"; trip?: Trip } | { kind: "wishlist" } | { kind: "article"; index: number } | { kind: "info"; title: string; body: string };
type SearchValues = { destination: string; style: string; start: string; end: string; travelers: number };
const initialSearch: SearchValues = { destination: "", style: "", start: "", end: "", travelers: 2 };
const info: Record<string, string> = {
  "About Us": "Wanderly is a fictional travel studio built around a simple idea: less logistics, more discovery. This local demo explores thoughtful small-group adventures, cultural journeys, and slow luxury escapes. No travel agency operates behind this website.",
  "Careers": "Our imaginary team brings together itinerary designers, local guides, and curious travelers. There are no real job openings or application collection in this demo.",
  "Press": "Wanderly is a fictional portfolio brand. Destination illustrations are original artwork, and all trip data, traveler quotes, ratings, and business metrics are illustrative.",
  "Affiliate Program": "There is no active affiliate program, tracking, commission, or partner relationship. Brand names below demonstrate the intended layout only.",
  "Contact Us": "Try Plan My Trip to create a local inquiry preview. The phone number (555) 290-8700 is fictional and is not a support line. Nothing is sent to an agency.",
  "FAQ": "How does this demo work? Search trips, save favorites in this browser, and preview an inquiry. Are prices live? No—all prices, dates, inclusions, ratings, and availability are fictional. Is anything booked? No, and no payment is accepted.",
  "Travel Insurance": "Travel insurance is not sold or quoted here. For a real trip, independently review coverage, exclusions, emergency care, and cancellation provisions with a licensed provider.",
  "Cancellation Policy": "No reservations are created, so there is nothing to cancel or refund. A real booking would require a provider-specific contract and cancellation policy before purchase.",
  "COVID-19 Info": "This demo has no live health or border information. Check official destination and public-health sources for current requirements before real travel.",
  "Privacy": "There is no backend, analytics, account, or email service. Favorite trip IDs and a newsletter preference may be stored in localStorage in your browser; use Clear saved preferences below to remove them. Inquiry details exist only in the open page and are not transmitted.",
  "Terms": "This website is an illustrated demonstration, not a travel offer. Prices, itineraries, dates, reviews, urgency, partner names, and trust badges must not be relied on for actual travel. No booking, payment, or live customer support is available.",
  "Sitemap": "Use the navigation to visit Destinations, Trip Styles, Deals, About Us, and Blog. The footer provides local information panels, and Plan My Trip opens the inquiry preview.",
};
const categoryIcons = [Globe, Mountain, Map, Sparkles, Users, Wine];

function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex='0']")).filter(element => element.getClientRects().length > 0);
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

function Inquiry({ trip, defaults }: { trip?: Trip; defaults: SearchValues }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<{ name: string; destination: string; start: string; end: string; travelers: string; budget: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [destination, setDestination] = useState(trip?.id || defaults.destination);
  const [travelStyle, setTravelStyle] = useState(defaults.style || trip?.styles[0] || "");
  const [reference] = useState(() => `WL-DEMO-${Date.now().toString(36).toUpperCase()}`);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) || "").trim();
    const next: Record<string, string> = {};
    if (value("name").length < 2) next.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) next.email = "Enter a valid email address for the preview.";
    if (!destination) next.destination = "Choose a destination.";
    const rangeError = dateError(value("start"), value("end"), true);
    if (rangeError) next.start = rangeError;
    const count = Number(value("travelers"));
    if (!Number.isInteger(count) || count < 1 || count > 12) next.travelers = "Choose between 1 and 12 travelers.";
    const budget = Number(value("budget"));
    if (!Number.isFinite(budget) || budget < 500 || budget > 50000) next.budget = "Enter a per-person budget between $500 and $50,000.";
    if (!travelStyle) next.style = "Choose a travel style.";
    if (!data.get("consent")) next.consent = "Acknowledge that this is a local preview, not a booking.";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement | null)?.focus());
      return;
    }
    setConfirmation({ name: value("name"), destination: trips.find(t => t.id === destination)!.destination, start: value("start"), end: value("end"), travelers: value("travelers"), budget: value("budget") });
  }
  const error = (key: string) => errors[key] ? <span id={`error-${key}`} className="field-error">{errors[key]}</span> : null;
  const invalid = (key: string) => ({ required: true, "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `error-${key}` : undefined });
  if (confirmation) return <div className="confirmation" role="status">
    <CheckCircle2 size={48} /><p className="eyebrow">YOUR DREAM, SKETCHED</p><h2 id="modal-title">Adventure looks good on you, {confirmation.name.split(" ")[0]}.</h2>
    <p>Your local inquiry preview is ready. No booking was made and no email was sent.</p>
    <dl><div><dt>Destination</dt><dd>{confirmation.destination}</dd></div><div><dt>Dates</dt><dd>{confirmation.start} → {confirmation.end}</dd></div><div><dt>Travelers</dt><dd>{confirmation.travelers}</dd></div><div><dt>Budget per person</dt><dd>{money(Number(confirmation.budget))}</dd></div><div><dt>Demo reference</dt><dd>{reference}</dd></div></dl>
    <p className="fineprint">This preview is held only on this page. Closing it clears the inquiry; no reservation, price guarantee, or itinerary service is created.</p>
    <button className="button" onClick={() => setConfirmation(null)}>Create another preview</button>
  </div>;
  return <>
    <p className="eyebrow">LET&apos;S MAKE IT PERSONAL</p><h2 id="modal-title">{trip ? `Plan your ${trip.destination} escape` : "Where do you dream of going?"}</h2>
    <p className="modal-intro">A few details are all it takes to start imagining. <strong>Local demo only—nothing is booked or sent.</strong></p>
    {trip?.id === "bali" && <p className="deal-note">Bali Explorer · 10 days · illustrative {money(trip.price)}/person. The countdown and “6 spots” are simulated, not live availability.</p>}
    <form ref={formRef} onSubmit={submit} noValidate className="inquiry-form">
      {Object.keys(errors).length > 0 && <p role="alert" className="error-summary">Please check the highlighted details before previewing your inquiry.</p>}
      <div className="form-grid">
        <label>Your name<input aria-label="Your name" name="name" autoComplete="name" maxLength={80} {...invalid("name")} />{error("name")}</label>
        <label>Email address<input aria-label="Email address" name="email" type="email" autoComplete="email" maxLength={150} {...invalid("email")} />{error("email")}</label>
        <label>Destination<select aria-label="Destination" name="destination" value={destination} onChange={e => setDestination(e.target.value)} {...invalid("destination")}><option value="">Choose your destination</option>{trips.map(t => <option key={t.id} value={t.id}>{t.destination}{t.country && `, ${t.country}`}</option>)}</select>{error("destination")}</label>
        <label>Travel style<select aria-label="Travel style" name="style" value={travelStyle} onChange={e => setTravelStyle(e.target.value)} {...invalid("style")}><option value="">Choose your style</option>{styles.map(s => <option key={s}>{s}</option>)}</select>{error("style")}</label>
        <label>Departure date<input aria-label="Departure date" name="start" type="date" min={today()} defaultValue={defaults.start} {...invalid("start")} />{error("start")}</label>
        <label>Return date<input aria-label="Return date" name="end" type="date" min={today()} required defaultValue={defaults.end} aria-invalid={!!errors.start} aria-describedby={errors.start ? "error-start" : undefined} /></label>
        <label>Number of travelers<input aria-label="Number of travelers" name="travelers" type="number" min={1} max={12} step={1} defaultValue={defaults.travelers} {...invalid("travelers")} />{error("travelers")}</label>
        <label>Budget / person (USD)<input aria-label="Budget / person (USD)" name="budget" type="number" min={500} max={50000} step={1} defaultValue={trip?.price || 2500} {...invalid("budget")} />{error("budget")}</label>
      </div>
      <label>What would make this trip yours? <span className="optional">(optional)</span><textarea name="notes" rows={3} maxLength={1000} placeholder="A special occasion, dietary needs, or a dream experience…" /></label>
      <label className="checkbox-label"><input name="consent" type="checkbox" {...invalid("consent")} /><span>I understand this is a local demo inquiry, not a booking or email request.</span></label>{error("consent")}
      <button className="button full" type="submit">Preview My Inquiry <ArrowRight size={17} /></button>
      <p className="fineprint"><ShieldCheck size={14} /> No payment. No account. No data sent.</p>
    </form>
  </>;
}

function TrustStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      if (reduced.matches) { setProgress(1); return; }
      const start = performance.now();
      const tick = (time: number) => {
        const value = Math.min((time - start) / 1100, 1);
        setProgress(1 - (1 - value) ** 3);
        if (value < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <section className="trust-section"><div className="container" ref={ref}>
    <p className="eyebrow">BIG DREAMS. THOUGHTFUL DETAILS.</p>
    <div className="stats"><div aria-label="15,000 plus illustrative trips planned"><strong aria-hidden="true">{Math.round(15000 * progress).toLocaleString("en-US")}+</strong><span>Trips Planned</span></div><div aria-label="98 percent illustrative satisfaction rate"><strong aria-hidden="true">{Math.round(98 * progress)}%</strong><span>Satisfaction Rate</span></div><div aria-label="120 plus illustrative destinations"><strong aria-hidden="true">{Math.round(120 * progress)}+</strong><span>Destinations</span></div><div><strong>24/7</strong><span>Travel Support</span></div></div>
    <p className="trust-disclaimer">Illustrative brand metrics—not real trips, survey results, inventory, or staffed support.</p>
    <div className="partners"><span>Trusted partners: <small>layout examples only</small></span><b>Marriott</b><b>airbnb</b><b className="delta">△ DELTA</b><b>Expedia</b><b>viator</b></div>
    <p className="trust-disclaimer">No partnerships or endorsements are claimed. Names shown as plain text for the fictional design.</p>
  </div></section>;
}

function TripCard({ trip, favorites, onSave, onExplore }: { trip: Trip; favorites: string[]; onSave: (id: string) => void; onExplore: (trip: Trip) => void }) {
  const label = trip.destination + (trip.country ? `, ${trip.country}` : "");
  return <article className="destination-card">
    <div className="destination-image"><button className="scene-button" aria-label={`Explore ${label}`} onClick={() => onExplore(trip)}><Scene name={trip.scene} /></button><span className={`badge ${trip.tag === "Most Popular" ? "amber" : ""}`}>{trip.tag}</span><button className={`save-button ${favorites.includes(trip.id) ? "saved" : ""}`} aria-label={`${favorites.includes(trip.id) ? "Unsave" : "Save"} ${trip.destination}`} aria-pressed={favorites.includes(trip.id)} onClick={() => onSave(trip.id)}><Heart size={18} fill={favorites.includes(trip.id) ? "currentColor" : "none"} /></button></div>
    <div className="destination-info"><p className="place"><MapPin size={12} />{trip.country || (trip.id === "iceland" ? "Nordic Europe" : "Central America")}</p><h3><button onClick={() => onExplore(trip)}>{label}</button></h3><p className="trip-price">From <strong>{money(trip.price)}</strong><span>/person · {trip.days} days</span></p><div className="rating"><Star size={13} fill="currentColor" /><b>{trip.rating}</b><span>({trip.reviews} demo reviews)</span><button aria-label={`View ${trip.destination} trip details`} onClick={() => onExplore(trip)}><ArrowRight size={17} /></button></div></div>
  </article>;
}

export default function Wanderly() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>(initialSearch);
  const [active, setActive] = useState<SearchValues>(initialSearch);
  const [showAll, setShowAll] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<Modal | null>(null);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [dealTime, setDealTime] = useState(2 * 86400 + 14 * 3600 + 32 * 60);
  const dialog = useRef<HTMLDialogElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const destinationSection = useRef<HTMLElement>(null);
  const heroArt = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function updateScroll() {
      setScrolled(window.scrollY > 45);
      if (heroArt.current) heroArt.current.style.transform = reduced.matches ? "" : `translateY(${Math.min(window.scrollY, window.innerHeight) * 0.15}px)`;
      frame = 0;
    }
    function scroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
    updateScroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("wanderly-favorites") || "[]");
      if (Array.isArray(saved)) setFavorites([...new Set(saved.filter((id): id is string => typeof id === "string" && trips.some(t => t.id === id)))]);
      if (localStorage.getItem("wanderly-newsletter")) setNewsletterStatus("Your demo subscription is saved in this browser. No email will be sent.");
    } catch { setNotice("Browser storage is unavailable. You can still explore and save favorites for this visit."); }
  }, []);
  useEffect(() => {
    const end = Date.now() + (2 * 86400 + 14 * 3600 + 32 * 60) * 1000;
    const timer = window.setInterval(() => setDealTime(Math.max(0, Math.floor((end - Date.now()) / 1000))), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (modal && !element.open) element.showModal();
    if (modal && element.open && !element.contains(document.activeElement)) element.querySelector<HTMLElement>("button")?.focus();
    if (!modal && element.open) element.close();
    document.body.style.overflow = modal || menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal, menu]);
  useEffect(() => {
    if (menu && !drawer.current?.open) drawer.current?.showModal();
    if (!menu && drawer.current?.open) drawer.current?.close();
  }, [menu]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const change = () => { if (mq.matches) setMenu(false); };
    mq.addEventListener("change", change);
    return () => mq.removeEventListener("change", change);
  }, []);
  const filtered = trips.filter(t => (!active.destination || active.destination === t.id) && (!active.style || t.styles.includes(active.style as TripStyle)));
  const hasFilter = !!active.destination || !!active.style || !!active.start;
  const visible = hasFilter || showAll ? filtered : filtered.slice(0, 4);
  const closeModal = () => setModal(null);
  function save(id: string) {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    const title = trips.find(t => t.id === id)!.destination;
    setNotice(`${title} ${next.includes(id) ? "saved to" : "removed from"} your wishlist.`);
    try { localStorage.setItem("wanderly-favorites", JSON.stringify(next)); }
    catch { setNotice(`${title} updated for this visit only; browser storage is unavailable.`); }
  }
  function showResults(values: SearchValues) {
    setSearchValues(values); setActive(values); setShowAll(true); setSearchError("");
    destinationSection.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  function search(event: React.FormEvent) {
    event.preventDefault();
    const error = dateError(searchValues.start, searchValues.end);
    setSearchError(error);
    if (!error) showResults(searchValues);
  }
  function browseStyle(style: TripStyle) { showResults({ ...initialSearch, style }); }
  function browseDestination(id: string) { showResults({ ...initialSearch, destination: id }); }
  function openInfo(title: string) { setModal({ kind: "info", title, body: info[title] || `${title} is a design-only feature in this fictional travel demo. No external service, social account, payment processor, or certification is connected.` }); }
  function navClick() { setMenu(false); }
  function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setNewsletterError("Enter a valid email address to preview subscribing."); setNewsletterStatus(""); return;
    }
    setNewsletterError("");
    try {
      localStorage.setItem("wanderly-newsletter", "opted-in");
      setNewsletterStatus("You're on the demo list! Preference saved locally; no email was sent.");
    } catch { setNewsletterStatus("Subscription preview complete for this visit. Storage is unavailable; no email was sent."); }
    setEmail("");
  }
  const nav = <><a href="#destinations" onClick={navClick}>Destinations</a><a href="#styles" onClick={navClick}>Trip Styles</a><a href="#deals" onClick={navClick}>Deals</a><button onClick={() => { navClick(); openInfo("About Us"); }}>About Us</button><a href="#stories" onClick={navClick}>Blog</a></>;
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}><div className="nav-shell"><a href="#" className="logo" aria-label="Wanderly home"><Compass size={34} strokeWidth={1.5} /><span>Wanderly<span className="logo-dot">.</span></span></a><nav className="desktop-nav" aria-label="Main navigation">{nav}</nav><div className="nav-actions"><button className="phone" onClick={() => openInfo("Contact Us")}><Phone size={14} />(555) 290-8700</button><button className="wishlist icon-button" aria-label={`Open wishlist, ${favorites.length} saved trips`} onClick={() => setModal({ kind: "wishlist" })}><Heart size={20} />{favorites.length > 0 && <span>{favorites.length}</span>}</button><button className="button nav-plan" onClick={() => setModal({ kind: "plan" })}>Plan My Trip <ArrowRight size={15} /></button><button className="mobile-toggle icon-button" aria-label="Open navigation menu" aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(true)}><Menu size={24} /></button></div></div></header>
    <main id="main">
      <section className="hero">
        <div className="hero-art" ref={heroArt}><Scene name="coast" /></div><div className="hero-shade" />
        <div className="hero-content container"><div className="hero-kicker"><span />YOUR NEXT ADVENTURE STARTS HERE<span /></div><h1>Curated Travel Experiences{" "}<br />Around the <em>World.</em></h1><p className="hero-description">Extraordinary places. Thoughtfully planned.<br className="mobile-only" /> Unforgettable, just-for-you journeys.</p>
          <div className="search-card"><button className="search-collapse" aria-expanded={searchOpen} aria-controls="trip-search" onClick={() => setSearchOpen(!searchOpen)}><Search size={18} />Find your next adventure <Plus size={17} className={searchOpen ? "rotated" : ""} /></button>
            <form id="trip-search" onSubmit={search} noValidate className={`trip-search ${searchOpen ? "expanded" : ""}`}>
              <label className="search-field"><span><MapPin size={14} />DESTINATION</span><select aria-label="Search destination" value={searchValues.destination} onChange={e => setSearchValues({ ...searchValues, destination: e.target.value })}><option value="">Where to?</option>{trips.map(t => <option key={t.id} value={t.id}>{t.destination}</option>)}</select></label>
              <fieldset className="search-field date-field"><legend><CalendarDays size={14} />TRAVEL DATES</legend><div><input aria-label="Search departure date" type="date" min={today()} value={searchValues.start} onChange={e => setSearchValues({ ...searchValues, start: e.target.value })} /><span>→</span><input aria-label="Search return date" type="date" min={searchValues.start || today()} value={searchValues.end} onChange={e => setSearchValues({ ...searchValues, end: e.target.value })} /></div></fieldset>
              <fieldset className="search-field traveler-field"><legend><Users size={14} />TRAVELERS</legend><div className="stepper"><button type="button" aria-label="Remove traveler" disabled={searchValues.travelers <= 1} onClick={() => setSearchValues({ ...searchValues, travelers: searchValues.travelers - 1 })}><Minus size={13} /></button><output aria-live="polite">{searchValues.travelers} {searchValues.travelers === 1 ? "Adult" : "Adults"}</output><button type="button" aria-label="Add traveler" disabled={searchValues.travelers >= 12} onClick={() => setSearchValues({ ...searchValues, travelers: searchValues.travelers + 1 })}><Plus size={13} /></button></div></fieldset>
              <label className="search-field"><span><Compass size={14} />TRIP STYLE</span><select aria-label="Search trip style" value={searchValues.style} onChange={e => setSearchValues({ ...searchValues, style: e.target.value })}><option value="">Your kind of escape</option>{styles.map(s => <option key={s}>{s}</option>)}</select></label>
              <button className="button search-submit" type="submit"><Search size={17} />Search Trips</button>
              {searchError && <p className="search-error" role="alert">{searchError}</p>}
            </form>
          </div>
          <div className="trending"><span>🔥 Trending:</span>{["bali", "amalfi", "kyoto", "patagonia", "iceland"].map(id => <button key={id} onClick={() => browseDestination(id)}>{trips.find(t => t.id === id)!.destination}</button>)}</div>
          <div className="hero-promise"><span><Check size={14} />Tailored to you</span><span><Check size={14} />Local-led experiences</span><span><Check size={14} />Every detail, considered</span></div>
        </div>
        <div className="hero-bottom"><span><MapPin size={13} /> Somewhere you&apos;d rather be.</span><a href="#destinations" aria-label="Explore popular destinations"><ArrowDown size={20} /></a><span className="art-label">Original coastal illustration · local demo</span></div>
      </section>
      <div className="demo-strip"><Compass size={15} /><span>Welcome to the Wanderly demo. All trips, prices, reviews & availability are fictional. No bookings or payments.</span></div>
      <section className="section destinations container" id="destinations" ref={destinationSection}>
        <div className="section-heading"><div><p className="eyebrow">THE WORLD IS CALLING</p><h2>{hasFilter ? "Find your kind of somewhere" : "Popular Destinations"}</h2><p>Places you&apos;ll dream about. Moments you&apos;ll keep forever.</p></div><button className="text-link" onClick={() => showResults(initialSearch)}>View All <ArrowRight size={17} /></button></div>
        <p className="data-note">Illustrative starting prices in USD per person, not quotes. Ratings and reviews are fictional.</p>
        {(hasFilter || showAll) && <div className="results-bar" role="status"><span>{filtered.length} {filtered.length === 1 ? "journey" : "journeys"}{active.style && ` · ${active.style}`}{active.destination && ` · ${trips.find(t => t.id === active.destination)?.destination}`}{active.start && ` · ${active.start} to ${active.end} · ${active.travelers} travelers`}<small>Dates customize your inquiry; no live availability is checked.</small></span><button onClick={() => { setActive(initialSearch); setSearchValues(initialSearch); setShowAll(false); }}>Reset filters <X size={14} /></button></div>}
        {visible.length ? <div className="destination-grid" aria-label="Trip results">{visible.map(trip => <TripCard key={trip.id} trip={trip} favorites={favorites} onSave={save} onExplore={trip => setModal({ kind: "trip", trip })} />)}</div> : <div className="empty-state"><Compass size={42} /><h3>A different path might be calling.</h3><p>No demo journeys match that destination and travel style. Try another style or explore every destination.</p><button className="button" onClick={() => showResults(initialSearch)}>Explore all trips <ArrowRight size={16} /></button></div>}
      </section>
      <section className="styles-section section" id="styles"><div className="container"><div className="center-heading"><p className="eyebrow">NOT ALL WANDERERS TRAVEL ALIKE</p><h2>How Do You Travel?</h2><p>Follow your curiosity. We&apos;ll take care of the route.</p></div><div className="styles-grid">{categories.map((category, index) => { const Icon = categoryIcons[index]; return <button key={category.style} className="style-card" onClick={() => browseStyle(category.style)} aria-label={`Discover ${category.title} trips`}><Scene name={category.scene} /><div className="style-overlay" /><div className="style-copy"><Icon size={29} strokeWidth={1.4} /><h3>{category.title}</h3><p>{category.description}</p><span>Find your escape <ArrowRight size={15} /></span></div></button>; })}</div></div></section>
      <section className="how-section section"><div className="container"><div className="center-heading"><p className="eyebrow">LESS PLANNING. MORE LIVING.</p><h2>Planning Your Trip Is Easy</h2><p>Your dream trip, without the twenty open tabs.</p></div><div className="steps">{[{ icon: MessageCircle, title: "Tell Us Your Dream", copy: "Share your destination, dates, budget, and travel style with our team." }, { icon: Map, title: "Get a Custom Itinerary", copy: "Our travel experts craft a day-by-day plan tailored to you." }, { icon: Plane, title: "Book & Go", copy: "Confirm your trip and we handle every detail—flights, hotels, experiences." }].map((step, i) => <div className="step" key={step.title}><div className="step-icon"><step.icon size={32} strokeWidth={1.4} /><span>{i + 1}</span></div><h3>{step.title}</h3><p>{step.copy}</p></div>)}</div><div className="center"><button className="button" onClick={() => setModal({ kind: "plan" })}>Start Planning <ArrowRight size={16} /></button><p className="fineprint">The real-world journey, imagined. This demo stops at a local inquiry preview.</p></div></div></section>
      <section className="deal-section" id="deals"><Scene name="bali" /><div className="deal-overlay" /><div className="container deal-layout"><div className="deal-copy"><span className="deal-badge">🔥 DEAL OF THE WEEK <span>DEMO</span></span><p className="deal-kicker">A little paradise. A lot of possibility.</p><h2>Bali Explorer<br /><em>10 Days of Wonder.</em></h2><p>Flights + 4-star hotels + guided tours + surf lesson</p><div className="deal-price"><del>$3,200</del><strong>$2,399<span>/person</span></strong></div><button className="button" onClick={() => setModal({ kind: "plan", trip: trips.find(t => t.id === "bali") })}>Claim This Deal <ArrowRight size={17} /></button><p className="deal-disclaimer">Illustrative package and pricing. “Claim” opens a local inquiry, not a reservation.</p></div><div className="countdown-card"><p>GOOD ADVENTURES DON&apos;T WAIT</p><div className="countdown" aria-label="Simulated offer countdown"><div><strong>{Math.floor(dealTime / 86400).toString().padStart(2, "0")}</strong><span>DAYS</span></div><b>:</b><div><strong>{Math.floor(dealTime % 86400 / 3600).toString().padStart(2, "0")}</strong><span>HOURS</span></div><b>:</b><div><strong>{Math.floor(dealTime % 3600 / 60).toString().padStart(2, "0")}</strong><span>MINS</span></div></div><p className="spots"><span />Only 6 spots left at this price</p><small>Simulated countdown & scarcity. No live inventory.<br />Resets on page load; no offer actually expires.</small></div></div></section>
      <section className="reviews-section section"><div className="container"><div className="center-heading"><p className="eyebrow">MEMORIES MADE. STORIES SHARED.</p><h2>What Our Travelers Say</h2><p>The best part of every journey? The people who take it.</p><span className="data-note">Fictional traveler stories and ratings, not endorsements.</span></div><div className="reviews-grid">{[{ name: "Rachel & David K.", destination: "Santorini, Greece", quote: "Wanderly planned our honeymoon to Santorini and it was absolutely magical. Every detail was perfect.", date: "June 2026", initials: "R&D", color: "rose" }, { name: "Marcus J.", destination: "Kyoto, Japan", quote: "I'm a solo traveler and felt completely taken care of. The Kyoto itinerary was a dream.", date: "April 2026", initials: "MJ", color: "sage" }, { name: "The Chen Family", destination: "Costa Rica", quote: "We've used Wanderly for 3 family vacations now. The kids always have a blast.", date: "July 2026", initials: "CF", color: "sand" }].map(review => <figure className="review-card" key={review.name}><div className="review-stars" aria-label="5 out of 5 fictional stars">★★★★★</div><blockquote>“{review.quote}”</blockquote><figcaption><div className={`avatar ${review.color}`} aria-hidden="true">{review.initials}</div><div><strong>{review.name}</strong><span>{review.destination}</span><small>{review.date} · Demo traveler</small></div><span className="quote-mark" aria-hidden="true">”</span></figcaption></figure>)}</div></div></section>
      <TrustStats />
      <section className="stories-section section container" id="stories"><div className="section-heading"><div><p className="eyebrow">A LITTLE INSPIRATION GOES A LONG WAY</p><h2>Travel Stories & Guides</h2><p>Good reads for your next great adventure.</p></div><button className="text-link" onClick={() => setModal({ kind: "info", title: "More stories, more possibilities", body: "Our local editorial collection has three original short guides. Explore hidden beaches, carry-on packing, and Mexico City's food culture in the cards below. No external blog is connected." })}>Read More Stories <ArrowRight size={17} /></button></div><div className="blog-grid">{articles.map((article, index) => <article className="blog-card" key={article.id}><button className="blog-image" onClick={() => setModal({ kind: "article", index })} aria-label={`Read ${article.title}`}><Scene name={article.scene} /><span className="badge">{article.category}</span></button><div className="blog-copy"><p>{article.minutes} min read <span>· Original demo editorial</span></p><h3><button onClick={() => setModal({ kind: "article", index })}>{article.title}</button></h3><div className="byline"><span className="small-avatar">{article.author.split(" ").map(s => s[0]).join("")}</span><span>{article.author}</span><button aria-label={`Open ${article.title}`} onClick={() => setModal({ kind: "article", index })}><ArrowRight size={17} /></button></div></div></article>)}</div></section>
      <section className="newsletter"><div className="newsletter-orbit" aria-hidden="true" /><div className="container newsletter-layout"><div><p className="eyebrow">YOUR INBOX COULD USE A VACATION</p><h2>Get Exclusive Deals{" "}<br />in Your Inbox</h2><p>Join 50,000+ travelers. One email a week.{" "}<br />Secret deals and somewhere-new inspiration.</p><small>Illustrative audience and promise. This demo sends no email.</small></div><form onSubmit={subscribe} noValidate><label htmlFor="newsletter-email">Email address</label><div className="newsletter-input"><Mail size={20} /><input id="newsletter-email" type="email" placeholder="Your email address" autoComplete="email" maxLength={150} value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!newsletterError} aria-describedby={newsletterError ? "newsletter-error" : "newsletter-note"} /><button type="submit">Subscribe <ArrowRight size={16} /></button></div><p id="newsletter-note">No spam, unsubscribe anytime. 🌍 <span>Local preference only.</span></p>{newsletterError && <p id="newsletter-error" className="newsletter-message" role="alert">{newsletterError}</p>}{newsletterStatus && <p className="newsletter-message" role="status"><CheckCircle2 size={16} />{newsletterStatus}</p>}<button type="button" className="newsletter-reset" onClick={() => { try { localStorage.removeItem("wanderly-newsletter"); setNewsletterStatus("Demo subscription removed. No email service was contacted."); } catch { setNewsletterStatus("Local storage is unavailable. No subscription was sent."); } }}>Unsubscribe locally</button></form></div></section>
    </main>
    <footer><div className="container"><div className="footer-top"><div className="footer-brand"><a href="#" className="logo"><Compass size={33} strokeWidth={1.5} />Wanderly<span className="logo-dot">.</span></a><p>A little further.<br />A little more you.</p><span>Thoughtful journeys for curious souls.</span><div className="socials">{[{ label: "Instagram", icon: Camera }, { label: "Facebook", icon: MessageCircle }, { label: "Pinterest", icon: Compass }, { label: "YouTube", icon: Play }, { label: "TikTok", icon: Music2 }].map(s => <button key={s.label} aria-label={`${s.label} demo information`} onClick={() => openInfo(s.label)}><s.icon size={17} /></button>)}</div></div><div><h3>Destinations</h3>{[["Greece", "santorini"], ["Japan", "kyoto"], ["Costa Rica", "costa-rica"], ["Italy", "amalfi"], ["Bali", "bali"], ["Iceland", "iceland"]].map(([label, id]) => <button key={id} onClick={() => browseDestination(id)}>{label}</button>)}<button onClick={() => showResults(initialSearch)}>All Destinations <ArrowRight size={12} /></button></div><div><h3>Trip Styles</h3>{styles.map(s => <button key={s} onClick={() => browseStyle(s)}>{s}</button>)}</div><div><h3>Company</h3>{["About Us", "Careers", "Press", "Affiliate Program"].map(s => <button key={s} onClick={() => openInfo(s)}>{s}</button>)}<a href="#stories">Blog</a></div><div><h3>Support</h3>{["Contact Us", "FAQ", "Travel Insurance", "Cancellation Policy", "COVID-19 Info"].map(s => <button key={s} onClick={() => openInfo(s)}>{s}</button>)}</div></div><div className="footer-trust"><span><ShieldCheck size={16} /> ASTA member · SSL secure <small>Design-only badges; no certification claim</small></span><span>VISA <b>Mastercard</b> PayPal <small>No payments accepted</small></span></div><div className="footer-bottom"><span>© 2026 Wanderly Travel Co. All rights reserved. <small>Fictional demo brand.</small></span><div>{["Privacy", "Terms", "Sitemap"].map(s => <button key={s} onClick={() => openInfo(s)}>{s}</button>)}<button onClick={() => { try { localStorage.removeItem("wanderly-favorites"); localStorage.removeItem("wanderly-newsletter"); setFavorites([]); setNewsletterStatus(""); setNotice("All Wanderly saved preferences cleared from this browser."); } catch { setFavorites([]); setNewsletterStatus(""); setNotice("Visit preferences cleared. Browser storage could not be accessed."); } }}>Clear saved preferences</button></div></div><p className="art-credit"><Leaf size={12} /> Every landscape is an original SVG illustration. Local, OFL-licensed DM Serif Display & Inter. No stock photos or real traveler portraits.</p></div></footer>
    <div className="mobile-bottom"><span>Your next chapter awaits.</span><button className="button" onClick={() => setModal({ kind: "plan" })}>Plan My Trip <ArrowRight size={15} /></button></div>
    <div className="toast" role="status" aria-live="polite">{notice && <><CheckCircle2 size={17} /><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15} /></button></>}</div>
    <dialog ref={drawer} id="mobile-navigation" className="mobile-drawer" aria-labelledby="drawer-title" onKeyDown={trapFocus} onClose={() => setMenu(false)} onClick={e => { if (e.target === e.currentTarget) setMenu(false); }}><div className="drawer-head"><span className="logo" id="drawer-title"><Compass size={28} />Wanderly.</span><button className="icon-button" aria-label="Close navigation menu" onClick={() => setMenu(false)}><X /></button></div><nav aria-label="Mobile navigation">{nav}</nav><button className="button" onClick={() => { setMenu(false); setModal({ kind: "plan" }); }}>Plan My Trip <ArrowRight size={16} /></button><p>Explore a little further.<br /><small>Local travel demo—no real bookings.</small></p></dialog>
    <dialog ref={dialog} className={`modal ${modal?.kind === "trip" || modal?.kind === "article" ? "visual-modal" : ""}`} aria-labelledby="modal-title" onKeyDown={trapFocus} onClose={closeModal} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}><button className="modal-close icon-button" aria-label="Close dialog" onClick={closeModal}><X size={21} /></button>
      {modal?.kind === "plan" && <div className="modal-content"><Inquiry key={modal.trip?.id || "custom"} trip={modal.trip} defaults={searchValues} /></div>}
      {modal?.kind === "trip" && <><div className="modal-scene"><Scene name={modal.trip.scene} /><span className="badge">{modal.trip.tag}</span></div><div className="modal-content"><p className="eyebrow">{modal.trip.destination}{modal.trip.country && `, ${modal.trip.country}`} · {modal.trip.days} DAYS</p><h2 id="modal-title">{modal.trip.title}</h2><p className="modal-intro">{modal.trip.description}</p><div className="detail-meta"><strong>{money(modal.trip.price)}<span>/person, illustrative</span></strong><span><Star size={14} fill="currentColor" />{modal.trip.rating} ({modal.trip.reviews} fictional reviews)</span></div><h3>A few things to look forward to</h3><ul className="highlights">{modal.trip.highlights.map(h => <li key={h}><CheckCircle2 size={17} />{h}</li>)}</ul><p className="style-tags">{modal.trip.styles.map(s => <button key={s} onClick={() => { closeModal(); browseStyle(s); }}>{s}</button>)}</p><p className="fineprint">Sample itinerary only. Price, hotels, inclusions, and reviews are fictional; travel dates do not check live availability. No booking or payment.</p><div className="modal-actions"><button className="button" onClick={() => setModal({ kind: "plan", trip: modal.trip })}>Plan This Trip <ArrowRight size={16} /></button><button className="button outline" aria-pressed={favorites.includes(modal.trip.id)} onClick={() => save(modal.trip.id)}><Heart size={17} fill={favorites.includes(modal.trip.id) ? "currentColor" : "none"} />{favorites.includes(modal.trip.id) ? "Saved" : "Save Trip"}</button></div></div></>}
      {modal?.kind === "wishlist" && <div className="modal-content"><p className="eyebrow">PLACES FOR YOUR SOMEDAY</p><h2 id="modal-title">Your Wishlist</h2><p className="modal-intro">Favorite journeys, saved in this browser. No account needed.</p>{favorites.length ? <div className="wishlist-list">{favorites.map(id => { const trip = trips.find(t => t.id === id)!; return <div className="wishlist-row" key={id}><div><Scene name={trip.scene} /></div><button onClick={() => setModal({ kind: "trip", trip })}><strong>{trip.destination}</strong><span>{trip.days} days · {money(trip.price)} illustrative</span></button><button className="icon-button" aria-label={`Remove ${trip.destination} from wishlist`} onClick={() => save(id)}><X size={18} /></button></div>; })}</div> : <div className="empty-state"><Heart size={40} /><h3>Your next adventure belongs here.</h3><p>Tap a destination&apos;s heart to keep it close.</p><button className="button" onClick={() => { closeModal(); showResults(initialSearch); }}>Discover destinations <ArrowRight size={16} /></button></div>}</div>}
      {modal?.kind === "article" && <><div className="modal-scene"><Scene name={articles[modal.index].scene} /></div><div className="modal-content article-content"><p className="eyebrow">{articles[modal.index].category} · {articles[modal.index].minutes} MIN READ</p><h2 id="modal-title">{articles[modal.index].title}</h2><p className="article-byline">By {articles[modal.index].author} · Fictional author, original short demo guide</p><p className="article-lead">{articles[modal.index].excerpt}</p>{articles[modal.index].paragraphs.map(p => <p key={p}>{p}</p>)}<button className="button" onClick={() => setModal({ kind: "plan" })}>Turn inspiration into a plan <ArrowRight size={16} /></button></div></>}
      {modal?.kind === "info" && <div className="modal-content"><p className="eyebrow">THE WANDERLY DETAILS</p><h2 id="modal-title">{modal.title}</h2><p className="modal-intro info-body">{modal.body}</p><button className="button" onClick={closeModal}>Got it <Check size={16} /></button></div>}
    </dialog>
  </>;
}
