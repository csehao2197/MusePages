"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BedDouble, MapPin, Heart, ChevronLeft, ChevronRight, Search as SearchIcon,
  SlidersHorizontal, List, LayoutGrid, X, Wifi, Waves, Dumbbell, ShieldCheck,
  Headphones, LockKeyhole, Check, ArrowUpRight, Star, Map as MapIcon, Plus, Minus,
} from "lucide-react";
import Dialog from "./dialog";
import { hotels, initialSearch, nightsFor, searchError, roomFits, defaultRoom, ratingLabel,
  type Hotel, type Room, type Search } from "./data";

type Filters = { min: number; max: number; stars: string[]; rating: string[]; type: string[]; neighborhood: string[]; amenities: string[] };
type Group = "stars" | "rating" | "type" | "neighborhood" | "amenities";
type Modal = "details" | "booking" | "compare" | "map" | "filters" | "info" | "saved" | "gallery" | null;
const emptyFilters: Filters = { min: 0, max: 800, stars: [], rating: [], type: [], neighborhood: [], amenities: [] };
const groups: { key: Group; title: string; options: string[] }[] = [
  { key: "stars", title: "Star rating", options: ["5", "4", "3", "2", "1"] },
  { key: "rating", title: "Guest rating", options: ["9", "8", "7"] },
  { key: "type", title: "Property type", options: ["Hotel", "Ryokan", "Hostel", "Apartment", "Capsule Hotel"] },
  { key: "neighborhood", title: "Neighborhood", options: ["Shinjuku", "Shibuya", "Ginza", "Asakusa", "Roppongi", "Akihabara", "Otemachi"] },
  { key: "amenities", title: "Amenities", options: ["Free WiFi", "Breakfast Included", "Pool", "Gym", "Free Cancellation", "Airport Shuttle", "Onsen/Hot Spring"] }
];
const photoLabels = ["Room illustration", "Warm-light room study", "City-light room study", "Interior detail study", "Soft-light room study"];
const reviewSamples = [
  { name: "Alex · United Kingdom", score: "9.6", title: "A calm place to come home to", text: "Loved the thoughtful room layout and the warm welcome. A lovely base for exploring the city.", reply: "Thank you for sharing your stay. We’re glad you found a little calm in Tokyo." },
  { name: "Mei · Singapore", score: "9.2", title: "Thoughtful details throughout", text: "The room was comfortable and the staff helped us plan a neighborhood walk. We would stay again.", reply: "It was a pleasure helping you explore. We hope to welcome you back." },
  { name: "Sam · Australia", score: "8.8", title: "Comfortable city stay", text: "Good connections and a quiet room. The breakfast selection could have been a little wider.", reply: "We appreciate the feedback and have shared your breakfast suggestion with our team." },
  { name: "Robin · Canada", score: "9.0", title: "An easy weekend", text: "Comfortable bedding and space to unpack. The location worked well for our short visit.", reply: "Thank you for spending your weekend with us." },
  { name: "Jules · France", score: "9.4", title: "Would choose it again", text: "We especially enjoyed the relaxing shared spaces after a full day outside.", reply: "We’re happy the spaces helped you unwind." },
  { name: "Ari · New Zealand", score: "8.9", title: "A welcoming arrival", text: "The sample experience felt friendly and straightforward. A useful city base.", reply: "Thank you for your kind words." }
];

function Photo({ hotel, index = 0, className = "" }: { hotel: Hotel; index?: number; className?: string }) {
  return <div className={`photo photo-${index} ${className}`}>
    {/* Each study uses our original local illustration, never a real property photograph. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`/hotel-${hotel.theme}.svg`} alt={`${hotel.name}: ${photoLabels[index % 5].toLowerCase()}`} loading="lazy" />
    <span className="illustration-label">Illustrated stay</span>
  </div>;
}

function matches(hotel: Hotel, filters: Filters, omit?: Group) {
  return hotel.price >= filters.min && hotel.price <= filters.max && groups.every(({ key }) => {
    if (key === omit || filters[key].length === 0) return true;
    return filters[key].some(value => key === "stars" ? hotel.stars === Number(value) :
      key === "rating" ? hotel.rating >= Number(value) : key === "type" ? hotel.type === value :
      key === "neighborhood" ? hotel.neighborhood === value : hotel.amenities.includes(value));
  });
}
function optionLabel(key: Group, value: string) {
  return key === "stars" ? `${"★".repeat(Number(value))} ${value} stars` :
    key === "rating" ? `${value}+ ${value === "9" ? "Exceptional" : value === "8" ? "Excellent" : "Very good"}` : value;
}
function amenityIcon(amenity: string) {
  return amenity === "Free WiFi" ? <Wifi size={15}/> : amenity === "Pool" || amenity.includes("Onsen") ? <Waves size={15}/> :
    amenity === "Gym" ? <Dumbbell size={15}/> : <Check size={15}/>;
}

export default function StayFinder() {
  const [draft, setDraft] = useState<Search>(initialSearch);
  const [search, setSearch] = useState<Search>(initialSearch);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState("Recommended");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<Hotel>(hotels[0]);
  const [room, setRoom] = useState<Room>(defaultRoom(hotels[0]));
  const [saved, setSaved] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [info, setInfo] = useState({ title: "", text: "" });
  const [currency, setCurrency] = useState("USD");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [allReviews, setAllReviews] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [area, setArea] = useState("");
  const nights = nightsFor(search);
  const money = (price: number) => new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 0
  }).format(price * (currency === "EUR" ? 0.92 : currency === "JPY" ? 150 : 1));

  useEffect(() => {
    try {
      const ids = (key: string) => {
        const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string" && hotels.some(h => h.id === id)) : [];
      };
      setSaved(ids("stayfinder-005-saved")); setRecent(ids("stayfinder-005-recent"));
    } catch { setStatus("Browser storage is unavailable. Saves will last for this visit only."); }
    const onScroll = () => setScrolled(window.scrollY > 230);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setPage(1); setLoaded(false); }, [filters, search, sort, area]);
  const base = useMemo(() => {
    const tokyo = /^(tokyo|tokyo,\s*japan)$/i.test(search.destination.trim());
    return tokyo ? hotels.filter(hotel => hotel.rooms.some(r => roomFits(hotel, r, search)) && (!area || hotel.neighborhood === area)) : [];
  }, [search, area]);
  const results = useMemo(() => {
    const list = base.filter(hotel => matches(hotel, filters));
    return list.sort((a, b) => sort === "Price: Low to High" ? a.price - b.price :
      sort === "Price: High to Low" ? b.price - a.price :
      sort === "Guest Rating" ? b.rating - a.rating :
      sort === "Distance to Center" ? a.distance - b.distance : hotels.indexOf(a) - hotels.indexOf(b));
  }, [base, filters, sort]);
  const visible = loaded ? results : results.slice((page - 1) * 4, page * 4);
  const pages = Math.ceil(results.length / 4);
  const activeCount = groups.reduce((count, group) => count + filters[group.key].length, 0) + (filters.min > 0 || filters.max < 800 ? 1 : 0) + (area ? 1 : 0);

  function persist(key: string, ids: string[]) {
    try { localStorage.setItem(key, JSON.stringify(ids)); }
    catch { setStatus("Browser storage is unavailable. Changes last for this visit only."); }
  }
  function toggleSaved(hotel: Hotel) {
    const next = saved.includes(hotel.id) ? saved.filter(id => id !== hotel.id) : [...saved, hotel.id];
    setSaved(next); persist("stayfinder-005-saved", next);
    setStatus(`${hotel.name} ${next.includes(hotel.id) ? "saved on this device" : "removed from saved stays"}.`);
  }
  function openHotel(hotel: Hotel, target: Modal = "details", nextRoom?: Room) {
    setSelected(hotel); setRoom(nextRoom ?? defaultRoom(hotel)); setAllReviews(false);
    setConfirmation(""); setBookingError(""); setModal(target);
    const next = [hotel.id, ...recent.filter(id => id !== hotel.id)].slice(0, 5);
    setRecent(next); persist("stayfinder-005-recent", next);
  }
  function showInfo(title: string, text = "This local demo only includes Tokyo hotel search and simulated bookings. This section is not connected to a service.") {
    setInfo({ title, text }); setModal("info");
  }
  function toggleFilter(key: Group, value: string) {
    setFilters(current => ({ ...current, [key]: current[key].includes(value) ? current[key].filter(v => v !== value) : [...current[key], value] }));
  }
  function reset() { setFilters(emptyFilters); setArea(""); setStatus("All filters cleared."); }
  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const message = searchError(draft); setError(message);
    if (message) return;
    setSearch({ ...draft, destination: draft.destination.trim() }); setArea(""); setGuestsOpen(false);
    setDestinationOpen(false); setSearchOpen(false); setStatus("Sample search updated. No live availability was checked.");
  }
  function toggleCompare(hotel: Hotel) {
    if (comparison.includes(hotel.id)) setComparison(comparison.filter(id => id !== hotel.id));
    else if (comparison.length < 3) setComparison([...comparison, hotel.id]);
    else setStatus("Compare up to 3 hotels. Remove one to add another.");
  }
  function book(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (name.length < 2) { setBookingError("Enter your full name (at least 2 characters)."); return; }
    if (!roomFits(selected, room, search)) { setBookingError("This room cannot accommodate your party. Select a larger room or search for more rooms."); return; }
    if (selected.available < search.rooms) { setBookingError("The sample inventory does not have enough rooms. Search for fewer rooms or choose another hotel."); return; }
    setBookingError("");
    setConfirmation(`SF-DEMO-${Date.now().toString(36).toUpperCase()}`);
  }

  const filterPanel = <div className="filter-panel">
    <div className="filter-heading"><h2>Filter your stay</h2><button className="text-button" onClick={reset}>Clear all filters</button></div>
    <button className="map-preview" onClick={() => setModal("map")}><span className="mini-map" aria-hidden="true"><i/><i/><i/></span><span><MapIcon size={17}/> Show map <ArrowUpRight size={16}/></span></button>
    <section className="filter-section"><h3>Nightly price</h3><p className="muted small">Base room · taxes & fees included</p>
      <div className="histogram" aria-label="Sample price distribution">{[1, 3, 2, 5, 3, 4, 7, 6, 3, 4, 2, 1, 2, 1, 1, 1].map((height, index) => <i key={index} style={{ height: `${height * 7}px` }}/>)}</div>
      <label className="range-label">Minimum price <strong>{money(filters.min)}</strong><input aria-label="Minimum nightly price" type="range" min="0" max="800" step="1" value={filters.min} onChange={event => setFilters({ ...filters, min: Math.min(Number(event.target.value), filters.max) })}/></label>
      <label className="range-label">Maximum price <strong>{money(filters.max)}</strong><input aria-label="Maximum nightly price" type="range" min="0" max="800" step="1" value={filters.max} onChange={event => setFilters({ ...filters, max: Math.max(Number(event.target.value), filters.min) })}/></label>
    </section>
    {groups.map(group => <fieldset className="filter-section" key={group.key}><legend>{group.title}</legend>
      {group.options.map(value => {
        const count = base.filter(hotel => matches(hotel, filters, group.key) && (group.key === "stars" ? hotel.stars === Number(value) : group.key === "rating" ? hotel.rating >= Number(value) : group.key === "type" ? hotel.type === value : group.key === "neighborhood" ? hotel.neighborhood === value : hotel.amenities.includes(value))).length;
        return <label className={`check-row ${group.key === "stars" ? "star-option" : ""}`} key={value}>
          <input type="checkbox" checked={filters[group.key].includes(value)} onChange={() => toggleFilter(group.key, value)}/>
          <span>{optionLabel(group.key, value)}</span><span className="count">({count})</span>
        </label>;
      })}
    </fieldset>)}
    <p className="small muted">Counts reflect 8 fictional properties, not a live hotel directory. Amenities within a group match any selection.</p>
  </div>;

  function card(hotel: Hotel) {
    return <HotelCard key={hotel.id} hotel={hotel} nights={nights} search={search} money={money}
      saved={saved.includes(hotel.id)} compared={comparison.includes(hotel.id)} onSave={() => toggleSaved(hotel)}
      onCompare={() => toggleCompare(hotel)} onDetails={() => openHotel(hotel)}
      onBook={() => openHotel(hotel, "booking")} sponsored={hotel.id === "skyline"} />;
  }

  return <>
    <a className="skip-link" href="#results">Skip to hotel results</a>
    <header className="site-header"><div className="nav-shell">
      <a className="logo" href="#top"><span><BedDouble size={24}/></span>StayFinder<span className="logo-dot">.</span></a>
      <nav aria-label="Main navigation"><a className="active" href="#results">Hotels</a>{["Vacation Rentals", "Experiences", "Deals"].map(label => <button key={label} onClick={() => showInfo(label)}>{label}</button>)}</nav>
      {scrolled && <button className="compact-search" onClick={() => { setSearchOpen(true); document.getElementById("search")?.scrollIntoView({ behavior: "smooth" }); }}><SearchIcon size={16}/>{search.destination} · {nights} nights</button>}
      <div className="nav-right"><label className="currency-label"><span className="sr-only">Currency</span><select aria-label="Currency" value={currency} onChange={e => setCurrency(e.target.value)}><option>USD</option><option>EUR</option><option>JPY</option></select></label>
        <button className="property-link" onClick={() => showInfo("List your property", "Property onboarding is not available in this local demo. No data is submitted.")}>List your property</button>
        <button className="icon-button saved-nav" aria-label={`Saved hotels (${saved.length})`} onClick={() => setModal("saved")}><Heart size={21}/>{saved.length > 0 && <span>{saved.length}</span>}</button>
        <button className="signin" onClick={() => showInfo("Sign in", "No accounts are created. Saved hotels and recently viewed stays are stored only in this browser. You can complete a simulated reservation without signing in.")}><span className="avatar">S</span><span>Sign in</span></button>
      </div>
    </div></header>

    <main id="top">
      <section className="search-region">
        <div className="container"><div className="breadcrumb"><span>Japan</span><ChevronRight size={12}/><span>Tokyo</span><ChevronRight size={12}/><span>Hotels</span></div>
          <div className="hero-heading"><div><p className="eyebrow">A CITY OF ENDLESS DISCOVERY</p><h1>Find your kind of Tokyo.</h1><p>From skyline stays to quiet ryokans. Your next chapter starts here.</p></div><span className="hero-note"><MapPin size={18}/> Tokyo, Japan <span>35.6762° N · 139.6503° E</span></span></div>
          <button className="mobile-search-toggle secondary" onClick={() => setSearchOpen(!searchOpen)} aria-expanded={searchOpen}><SearchIcon size={17}/>{search.destination} · {nights} nights <span>{searchOpen ? "Collapse" : "Edit search"}</span></button>
          <form id="search" className={`search-card ${searchOpen ? "expanded" : ""}`} onSubmit={submitSearch} noValidate>
            <div className="destination-field search-field" onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDestinationOpen(false);
            }} onKeyDown={e => {
              if (e.key === "Escape") { document.getElementById("destination")?.focus(); setDestinationOpen(false); }
            }}><label htmlFor="destination"><MapPin size={16}/> Destination</label>
              <input id="destination" value={draft.destination} onChange={e => { setDraft({ ...draft, destination: e.target.value }); setDestinationOpen(true); }} onFocus={() => setDestinationOpen(true)}
                onKeyDown={e => { if (e.key === "ArrowDown") { e.preventDefault(); document.getElementById("tokyo-option")?.focus(); } }}
                role="combobox" aria-expanded={destinationOpen} aria-controls="destination-options" aria-autocomplete="list"
                autoComplete="off" aria-describedby="destination-hint" />
              <span id="destination-hint" className="sr-only">Type a destination or select Tokyo below. Only Tokyo has sample inventory.</span>
              {destinationOpen && <div className="destination-options" id="destination-options" role="listbox" aria-label="Destination suggestions"><button id="tokyo-option" role="option" aria-selected={draft.destination === "Tokyo, Japan"} type="button" onMouseDown={e => e.preventDefault()} onClick={() => { setDraft({ ...draft, destination: "Tokyo, Japan" }); document.getElementById("destination")?.focus(); setDestinationOpen(false); }}><MapPin size={17}/><span>Tokyo, Japan<small>8 illustrated sample properties</small></span></button></div>}
            </div>
            <div className="search-field"><label htmlFor="check-in">Check-in</label><input id="check-in" type="date" value={draft.checkIn} onChange={e => setDraft({ ...draft, checkIn: e.target.value })}/></div>
            <div className="search-field"><label htmlFor="check-out">Check-out</label><input id="check-out" type="date" value={draft.checkOut} onChange={e => setDraft({ ...draft, checkOut: e.target.value })}/></div>
            <div className="search-field guest-field"><span className="field-label">Guests & rooms</span><button type="button" className="guest-toggle" aria-expanded={guestsOpen} aria-controls="guest-options" onClick={() => setGuestsOpen(!guestsOpen)}>{draft.adults} adults, {draft.children} children<small>{draft.rooms} {draft.rooms === 1 ? "room" : "rooms"}</small></button>
              {guestsOpen && <div id="guest-options" className="guest-options">
                {([{ key: "adults", label: "Adults", hint: "18 years and over", min: 1, max: 12 }, { key: "children", label: "Children", hint: "0–17 years", min: 0, max: 8 }, { key: "rooms", label: "Rooms", hint: "An adult in each room", min: 1, max: 6 }] as const).map(item => <div className="stepper" key={item.key}><span>{item.label}<small>{item.hint}</small></span><button type="button" aria-label={`Decrease ${item.label.toLowerCase()}`} disabled={draft[item.key] <= item.min} onClick={() => setDraft({ ...draft, [item.key]: draft[item.key] - 1 })}><Minus size={16}/></button><output aria-label={`${item.label} count`}>{draft[item.key]}</output><button type="button" aria-label={`Increase ${item.label.toLowerCase()}`} disabled={draft[item.key] >= item.max} onClick={() => setDraft({ ...draft, [item.key]: draft[item.key] + 1 })}><Plus size={16}/></button></div>)}
                <button type="button" className="primary" onClick={() => setGuestsOpen(false)}>Done</button>
              </div>}
            </div>
            <button className="primary search-submit" type="submit"><SearchIcon size={19}/> Search</button>
            {error && <p role="alert" className="form-error">{error}</p>}
          </form>
          <div className="search-summary"><span><strong>{nights} nights</strong> · {results.length} sample hotels found · Prices include taxes & fees</span><span><ShieldCheck size={15}/> Explore with confidence</span></div>
          <p className="demo-strip">LOCAL DEMO <span>Fictional hotels, illustrated rooms & simulated rates. No real bookings or payments.</span></p>
        </div>
      </section>

      <div className="container content-layout">
        <aside className="desktop-filters" aria-label="Hotel filters">{filterPanel}</aside>
        <section id="results" className="results-section" aria-label="Hotel results" tabIndex={-1}>
          <div className="results-heading"><div><h2>Stays that feel like you.</h2><p><strong data-testid="results-count">{results.length} hotels found</strong><span className="muted"> in the sample collection</span></p></div><span className="verified"><ShieldCheck size={16}/> Handpicked demo stays</span></div>
          <div className="sort-bar"><button className="secondary mobile-filters" onClick={() => setModal("filters")}><SlidersHorizontal size={16}/> Filters {activeCount > 0 && `(${activeCount})`}</button>
            <label className="sort-label">Sort by: <select aria-label="Sort hotels" value={sort} onChange={e => setSort(e.target.value)}>{["Recommended", "Price: Low to High", "Price: High to Low", "Guest Rating", "Distance to Center"].map(label => <option key={label}>{label}</option>)}</select></label>
            <div className="view-toggle"><button className={view === "list" ? "selected" : ""} aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={18}/></button><button className={view === "grid" ? "selected" : ""} aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid size={17}/></button></div>
            <button className="text-button map-mobile" onClick={() => setModal("map")}><MapIcon size={17}/> Map</button>
          </div>
          {activeCount > 0 && <div className="filter-chips" aria-label="Active filters">
            {groups.flatMap(group => filters[group.key].map(value => <button key={`${group.key}-${value}`} onClick={() => toggleFilter(group.key, value)} aria-label={`Remove ${optionLabel(group.key, value)} filter`}>{optionLabel(group.key, value)}<X size={13}/></button>))}
            {(filters.min > 0 || filters.max < 800) && <button onClick={() => setFilters({ ...filters, min: 0, max: 800 })}>{money(filters.min)}–{money(filters.max)}<X size={13}/><span className="sr-only">Remove price filter</span></button>}
            {area && <button onClick={() => setArea("")}>Map area: {area}<X size={13}/></button>}
            <button className="text-button" onClick={reset}>Reset</button>
          </div>}
          <div className={`hotel-results ${view === "grid" ? "grid-view" : ""}`}>
            {visible.map(card)}
            {results.length === 0 && <div className="empty-state"><SearchIcon size={34}/><h3>No stays match this search</h3><p>Try a wider price range, fewer filters or a smaller party. Tokyo is the only destination with sample inventory.</p><button className="primary" onClick={() => { reset(); setSearch(initialSearch); setDraft(initialSearch); }}>Reset search and filters</button></div>}
          </div>
          {results.length > 0 && <div className="pagination"><p>Showing {loaded ? 1 : (page - 1) * 4 + 1}–{loaded ? results.length : Math.min(page * 4, results.length)} of {results.length} sample results</p>
            {!loaded && <div className="pages"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16}/></button>{Array.from({ length: pages }, (_, index) => <button key={index} aria-label={`Page ${index + 1}`} aria-current={page === index + 1 ? "page" : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button aria-label="Next page" disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight size={16}/></button></div>}
            {!loaded && results.length > 4 && <button className="secondary" onClick={() => setLoaded(true)}>Load all {results.length} stays</button>}
          </div>}
          <div className="editorial"><span className="editorial-icon">旅</span><div><p className="eyebrow">STAY A LITTLE DIFFERENT</p><h3>A city. A thousand ways to feel at home.</h3><p>Discover a quiet ryokan, a design-led hideaway or a room above the clouds.</p></div><button className="text-button" onClick={() => { reset(); setFilters({ ...emptyFilters, type: ["Ryokan"] }); }}>Explore ryokans <ArrowUpRight size={16}/></button></div>
        </section>
      </div>
      <section className="trust-section container"><div><ShieldCheck/><strong>Price transparency</strong><span>All sample rates include taxes</span></div><div><Star/><strong>Review examples</strong><span>Fictional, never real endorsements</span></div><div><LockKeyhole/><strong>No payment required</strong><span>Local simulated reservations</span></div><div><Headphones/><strong>Support information</strong><span>No live 24/7 service in this demo</span></div></section>
      <section className="recent-section container"><div className="section-title"><h2>Your recently viewed hotels</h2>{recent.length > 0 && <button className="text-button" onClick={() => { setRecent([]); persist("stayfinder-005-recent", []); }}>Clear history</button>}</div>
        {recent.length === 0 ? <p className="muted">Open a hotel to build your own shortlist. History stays on this device.</p> : <div className="recent-list">{recent.map(id => {
          const hotel = hotels.find(h => h.id === id)!;
          return <button className="recent-card" key={id} onClick={() => openHotel(hotel)}><Photo hotel={hotel}/><strong>{hotel.name}</strong><span>{hotel.rating} · {ratingLabel(hotel.rating)}</span><b>{money(hotel.price)}<small> / night from</small></b></button>;
        })}</div>}
      </section>
    </main>
    <footer><div className="container"><div className="footer-top"><div className="footer-brand"><a className="logo" href="#top"><BedDouble size={24}/>StayFinder.</a><p>A better stay starts with<br/>a little discovery.</p><p className="small">A portfolio demo, not a travel agency.</p></div>
      {[{ title: "Popular destinations", links: ["Tokyo", "Paris", "New York", "Bali", "London", "Barcelona"] }, { title: "Property types", links: ["Hotels", "Vacation Rentals", "Hostels", "Resorts", "Apartments"] }, { title: "Company", links: ["About", "Careers", "Press", "Affiliate Program", "Blog"] }, { title: "Support", links: ["Help Center", "Contact Us", "Cancellation Policy", "COVID-19 Info"] }].map(column => <div className="footer-column" key={column.title}><h3>{column.title}</h3>{column.links.map(label => <button key={label} onClick={() => label === "Tokyo" ? (setDraft(initialSearch), setSearch(initialSearch), reset(), document.getElementById("top")?.scrollIntoView()) : showInfo(label, label === "Cancellation Policy" ? "Sample flexible rates allow cancellation until 7 days before check-in (4 days for Paper & Pine). Non-refundable sample rates are labeled. No real reservation or cancellation request is processed." : undefined)}>{label}</button>)}</div>)}
    </div><div className="footer-bottom"><span>© 2026 StayFinder Inc. · Fictional brand</span><div><label>Currency <select aria-label="Footer currency" value={currency} onChange={e => setCurrency(e.target.value)}><option>USD</option><option>EUR</option><option>JPY</option></select></label><label>Language <select aria-label="Language"><option>English</option></select></label></div><span className="payment-text">Visa · Mastercard · Amex · PayPal · Apple Pay<br/><small>Illustrative payment options only. None accepted here.</small></span></div></div></footer>
    <div className="sr-only" role="status" aria-live="polite">{status}</div>
    {comparison.length > 0 && <div className="comparison-dock"><span>{comparison.length}/3 stays selected</span><button className="primary" onClick={() => setModal("compare")}>Compare hotels</button><button className="icon-button" aria-label="Clear comparison" onClick={() => setComparison([])}><X size={18}/></button></div>}
    {comparison.length === 0 && results.some(h => h.available > 0) && <div className="mobile-deal"><span>From <strong>{money(Math.min(...results.filter(h => h.available > 0).map(h => h.price)))}</strong> / night<small>Sample rate · {nights} nights</small></span><button className="primary" onClick={() => {
      const hotel = [...results].filter(h => h.available > 0).sort((a, b) => a.price - b.price)[0]; openHotel(hotel);
    }}>View deal</button></div>}

    {modal === "filters" && <Dialog title="Filter your stay" onClose={() => setModal(null)}>{filterPanel}<div className="modal-sticky"><button className="primary" onClick={() => setModal(null)}>Show {results.length} stays</button></div></Dialog>}
    {modal === "info" && <Dialog title={info.title} onClose={() => setModal(null)}><p className="info-text">{info.text}</p><button className="primary" onClick={() => setModal(null)}>Got it</button></Dialog>}
    {modal === "saved" && <Dialog title="Your saved hotels" wide onClose={() => setModal(null)}><p className="muted">Saved on this browser only. No account or cloud synchronization.</p>{saved.length ? <div className="saved-results">{hotels.filter(h => saved.includes(h.id)).map(card)}</div> : <div className="empty-state"><Heart/><h3>Your shortlist starts here</h3><p>Use the heart on any hotel to save it for later.</p></div>}</Dialog>}
    {modal === "compare" && <Dialog title="Compare your stays" wide onClose={() => setModal(null)}><p className="muted">Sample base rooms · {nights} nights · {search.rooms} room(s). Larger room rates may differ.</p>
      <div className="comparison-grid">{hotels.filter(h => comparison.includes(h.id)).map(hotel => <article key={hotel.id}><Photo hotel={hotel}/><h3>{hotel.name}</h3><p>{hotel.neighborhood} · {hotel.stars} stars</p><dl><dt>Guest rating</dt><dd>{hotel.rating}/10 <small>(fictional)</small></dd><dt>Nightly base rate</dt><dd>{money(hotel.price)}</dd><dt>Stay total from</dt><dd>{money(hotel.price * nights * search.rooms)}</dd><dt>Base room</dt><dd>{defaultRoom(hotel).name} · {defaultRoom(hotel).size} m²</dd><dt>Capacity / room</dt><dd>{defaultRoom(hotel).capacity} guests</dd><dt>Cancellation</dt><dd>{hotel.cancellation ? "Flexible sample policy" : "Non-refundable sample rate"}</dd><dt>Breakfast</dt><dd>{hotel.breakfast ? "Included" : "Not included"}</dd><dt>Amenities</dt><dd>{hotel.amenities.join(", ")}</dd><dt>Availability</dt><dd>{hotel.available ? `${hotel.available} sample rooms` : "Sold out in demo"}</dd></dl><button className="primary" onClick={() => openHotel(hotel)}>View hotel</button><button className="text-button" onClick={() => setComparison(comparison.filter(id => id !== hotel.id))}>Remove {hotel.name}</button></article>)}</div>
      {!comparison.length && <p>Select hotels using Compare on the result cards.</p>}
    </Dialog>}
    {modal === "map" && <Dialog title="Explore Tokyo on the map" wide className="map-dialog" onClose={() => setModal(null)}>
      <TokyoMap hotels={results} money={money} onHotel={hotel => openHotel(hotel)} onSearchArea={next => { setArea(next); setStatus(`Map search updated: ${next || "all Tokyo"}.`); }} area={area}/>
    </Dialog>}
    {modal === "gallery" && <Dialog title={`${selected.name} — illustration gallery`} wide onClose={() => setModal("details")}>
      <p className="muted">5 locally drawn interior studies; not photographs of a real property.</p><div className="full-gallery"><Photo hotel={selected} index={galleryIndex}/><div className="gallery-controls"><button className="secondary" aria-label="Previous gallery illustration" onClick={() => setGalleryIndex((galleryIndex + 4) % 5)}><ChevronLeft/></button><span>{galleryIndex + 1} of 5 · {photoLabels[galleryIndex]}</span><button className="secondary" aria-label="Next gallery illustration" onClick={() => setGalleryIndex((galleryIndex + 1) % 5)}><ChevronRight/></button></div></div>
    </Dialog>}
    {modal === "details" && <Dialog title={selected.name} wide onClose={() => setModal(null)}>
      <div className="detail-gallery">{[0, 1, 2, 3, 4].map(index => <button key={index} onClick={() => { setGalleryIndex(index); setModal("gallery"); }} aria-label={`View illustration ${index + 1}`}><Photo hotel={selected} index={index}/></button>)}<button className="gallery-all secondary" onClick={() => { setGalleryIndex(0); setModal("gallery"); }}>View all 5 illustrations</button></div>
      <div className="detail-summary"><div><p className="stars">{"★".repeat(selected.stars)} <span>{selected.type} · {selected.neighborhood}</span></p><button className="text-button" onClick={() => setModal("map")}><MapPin size={15}/>{selected.address}</button></div><div className="rating-line"><b>{selected.rating}</b><span>{ratingLabel(selected.rating)}<small>{selected.reviews.toLocaleString()} illustrative reviews</small></span></div></div>
      <p className="notice">Fictional property. Rates, reviews, policies, availability and distances below are illustrative, not independently verified.</p>
      <nav className="detail-tabs" aria-label="Hotel sections">{["Overview", "Rooms", "Amenities", "Location", "Reviews"].map(label => <a key={label} href={`#detail-${label.toLowerCase()}`}>{label}</a>)}</nav>
      <section id="detail-overview" className="detail-section"><h3>Your Tokyo retreat</h3>{selected.description.map(text => <p key={text}>{text}</p>)}
        <div className="rating-breakdown">{[["Cleanliness", "9.6"], ["Location", "9.8"], ["Service", "9.2"], ["Value", "8.9"], ["Facilities", "9.0"]].map(([label, score]) => <div key={label}><span>{label}</span><b>{score}</b><meter min={0} max={10} value={Number(score)} aria-label={`${label} sample rating`}/></div>)}</div>
      </section>
      <section id="detail-rooms" className="detail-section"><h3>Choose your room</h3><p className="muted">Rates are per room, per night. Children have no extra fee in this demo; total party size must fit the room capacity.</p><div className="room-table">
        {selected.rooms.map((candidate, index) => {
          const fits = roomFits(selected, candidate, search); const available = selected.available >= search.rooms;
          return <article key={candidate.name} className={room.name === candidate.name ? "room-row chosen" : "room-row"}><Photo hotel={selected} index={index}/><div><h4>{candidate.name} {candidate.price === selected.price && <span className="popular">Most popular</span>}</h4><p>{candidate.size} m² · {candidate.bed} · {candidate.view}</p><p>Maximum {candidate.capacity} guests / room</p>{!fits && <p className="warning">Too small for this party or child policy</p>}</div><div className="room-price"><strong>{money(candidate.price)}</strong><small>/ night</small><button className="secondary" disabled={!fits || !available} onClick={() => { setRoom(candidate); setStatus(`${candidate.name} selected.`); }}>{!available ? "Sold out" : !fits ? "Not suitable" : room.name === candidate.name ? "Selected" : "Select"}</button></div></article>;
        })}</div>
      </section>
      <section id="detail-amenities" className="detail-section"><h3>A little of everything you need</h3><div className="amenities-grid">{selected.amenities.map(amenity => <span key={amenity}>{amenityIcon(amenity)}{amenity}</span>)}</div></section>
      <section id="detail-location" className="detail-section"><h3>A neighborhood worth exploring</h3><div className="location-layout"><button className="location-map" onClick={() => setModal("map")}><MapPin/><strong>{selected.neighborhood}</strong><span>Open schematic Tokyo map</span></button><div><h4>Nearby · illustrative travel times</h4>{(selected.neighborhood === "Shinjuku" ? ["Shinjuku Station · 8 min walk", "Shinjuku Gyoen · 12 min walk", "Meiji Shrine · 20 min by train"] : [`${selected.neighborhood} Station · 8 min walk`, "Neighborhood gardens · 12 min walk", "Tokyo Station · 20 min by train"]).map(attraction => <p key={attraction}><MapPin size={14}/>{attraction}</p>)}</div></div></section>
      <section className="detail-section"><h3>House rules & rate policy</h3><div className="house-rules"><span>Check-in <strong>3:00 PM</strong></span><span>Check-out <strong>11:00 AM</strong></span><span>No smoking</span><span>Pets not allowed</span></div><p>{selected.cancellation ? `Sample free cancellation until ${cancellationDate(selected, search)}. After that, the sample policy charges the first night.` : "Sample non-refundable rate. Nest Capsule is pay at property; no money is collected here."}</p></section>
      <section id="detail-reviews" className="detail-section"><h3>Guest stories <span className="small muted">· fictional review examples</span></h3><div className="reviews-grid">{reviewSamples.slice(0, allReviews ? 6 : 3).map(review => <article key={review.name}><div><b>{review.score}</b><span>{review.name}</span></div><h4>{review.title}</h4><p>{review.text}</p><blockquote><strong>Sample hotel response</strong>{review.reply}</blockquote></article>)}</div><button className="text-button" onClick={() => setAllReviews(!allReviews)}>{allReviews ? "Show fewer examples" : "Read all 6 sample reviews"}</button></section>
      <div className="detail-booking-bar"><div><strong>{room.name}</strong><small>{search.checkIn} → {search.checkOut} · {nights} nights · {search.rooms} room(s)</small></div><div><strong>{money(room.price * nights * search.rooms)}</strong><small>Total · taxes & fees included</small></div><button className="primary" disabled={!roomFits(selected, room, search) || selected.available < search.rooms} onClick={() => { setConfirmation(""); setBookingError(""); setModal("booking"); }}>Reserve now</button></div>
    </Dialog>}
    {modal === "booking" && <Dialog title={confirmation ? "Your local reservation preview" : "Reserve your sample stay"} onClose={() => setModal(null)}>
      {confirmation ? <div className="confirmation" role="status"><span className="success-icon"><Check size={30}/></span><h3>Your demo stay is confirmed.</h3><p className="notice">Nothing has been booked with a hotel. No payment taken, email sent or inventory held. This preview ends when you close it.</p><strong className="reference">{confirmation}</strong><h4>{selected.name}</h4><p>{room.name}</p><p>{search.checkIn} → {search.checkOut}<br/>{nights} nights · {search.adults} adults · {search.children} children · {search.rooms} room(s)</p><p className="confirmation-total">{money(room.price * nights * search.rooms)} total</p><button className="primary" onClick={() => setModal(null)}>Back to hotels</button></div> :
      <form className="booking-form" onSubmit={book}>
        <div className="booking-property"><Photo hotel={selected}/><div><h3>{selected.name}</h3><p>{room.name}</p><p>{selected.neighborhood} · {selected.rating}/10</p></div></div>
        <div className="booking-dates"><span>Check-in<strong>{search.checkIn}</strong></span><span>Check-out<strong>{search.checkOut}</strong></span><span>Guests<strong>{search.adults} adults, {search.children} children</strong></span></div>
        <label>Room & sample nightly rate<select aria-label="Booking room" value={room.name} onChange={e => setRoom(selected.rooms.find(r => r.name === e.target.value)!)}>{selected.rooms.map(r => <option key={r.name} value={r.name}>{r.name} · {money(r.price)} · max {r.capacity} guests</option>)}</select></label>
        {(!roomFits(selected, room, search) || selected.available < search.rooms) && <p role="alert" className="form-error">{!roomFits(selected, room, search) ? "This room does not fit your party. Choose a larger room." : "Not enough sample rooms remain for your party."}</p>}
        <dl className="price-breakdown"><dt>{money(room.price)} × {nights} nights × {search.rooms} room(s)</dt><dd>{money(room.price * nights * search.rooms)}</dd><dt>Taxes & fees</dt><dd>Included</dd><dt className="total">Total sample price</dt><dd className="total" data-testid="booking-total">{money(room.price * nights * search.rooms)}</dd></dl>
        <p className="cancellation">{selected.cancellation ? `Sample free cancellation until ${cancellationDate(selected, search)}` : "Sample non-refundable rate · no payment collected"}</p>
        <p className="notice">Use fictional details. This form stays in memory; no email, payment, account or external booking service is contacted.</p>
        <label>Guest full name<input name="name" autoComplete="off" placeholder="Alex Example" required minLength={2} maxLength={80}/></label>
        <label>Email (for preview only)<input name="email" type="email" autoComplete="off" placeholder="alex@example.com" required maxLength={120}/></label>
        <label className="consent"><input name="consent" type="checkbox" required/><span>I understand this is a simulated reservation and agree to the displayed sample house rules and cancellation policy.</span></label>
        {bookingError && <p className="form-error" role="alert">{bookingError}</p>}
        <button className="primary full-width" type="submit" disabled={!roomFits(selected, room, search) || selected.available < search.rooms}><LockKeyhole size={16}/> Confirm demo reservation</button><button type="button" className="text-button" onClick={() => setModal("details")}>Back to hotel & policies</button>
      </form>}
    </Dialog>}
  </>;
}

function cancellationDate(hotel: Hotel, search: Search) {
  return new Date(Date.parse(search.checkIn) - (hotel.id === "paper" ? 4 : 7) * 86400000)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function HotelCard({ hotel, nights, search, money, saved, compared, onSave, onCompare, onDetails, onBook, sponsored }: {
  hotel: Hotel; nights: number; search: Search; money: (price: number) => string; saved: boolean;
  compared: boolean; onSave: () => void; onCompare: () => void; onDetails: () => void;
  onBook: () => void; sponsored: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const baseRoom = defaultRoom(hotel);
  const canBook = hotel.available >= search.rooms;
  return <article className="hotel-card" data-testid="hotel-card" aria-label={hotel.name}>
    <div className="card-media" onTouchStart={e => setTouchStart(e.touches[0].clientX)} onTouchEnd={e => {
      if (touchStart !== null && Math.abs(e.changedTouches[0].clientX - touchStart) > 40) setIndex((index + (e.changedTouches[0].clientX < touchStart ? 1 : 3)) % 4);
      setTouchStart(null);
    }}>
      <button className="photo-link" aria-label={`View ${hotel.name} details`} onClick={onDetails}><Photo hotel={hotel} index={index}/></button>
      <span className="style-badge">{hotel.badge}</span>
      <button className={`save-button ${saved ? "is-saved" : ""}`} aria-label={`${saved ? "Unsave" : "Save"} ${hotel.name}`} aria-pressed={saved} onClick={onSave}><Heart size={19} fill={saved ? "currentColor" : "none"}/></button>
      <button className="photo-arrow prev" aria-label={`Previous ${hotel.name} illustration`} onClick={() => setIndex((index + 3) % 4)}><ChevronLeft size={17}/></button><button className="photo-arrow next" aria-label={`Next ${hotel.name} illustration`} onClick={() => setIndex((index + 1) % 4)}><ChevronRight size={17}/></button>
      <div className="photo-dots">{[0, 1, 2, 3].map(dot => <button key={dot} aria-label={`${hotel.name} illustration ${dot + 1}`} aria-pressed={index === dot} className={index === dot ? "active" : ""} onClick={() => setIndex(dot)}/>)}</div>
    </div>
    <div className="card-details"><div className="card-title-row"><button className="hotel-name" onClick={onDetails}><h3>{hotel.name}</h3></button>{sponsored && <span className="ad-badge" title="Illustrative ad placement; no paid endorsement">Demo ad</span>}</div>
      <p className="stars">{"★".repeat(hotel.stars)}<span><MapPin size={13}/>{hotel.neighborhood} · {hotel.distance} km to center</span></p>
      <div className="rating-line"><b>{hotel.rating}</b><span>{ratingLabel(hotel.rating)}<small>{hotel.reviews.toLocaleString()} illustrative reviews</small></span></div>
      <div className="card-amenities">{hotel.amenities.filter(a => a !== "Free Cancellation").slice(0, 4).map(amenity => <span key={amenity}>{amenityIcon(amenity)}{amenity.replace("Free ", "").replace("/Hot Spring", "")}</span>)}</div>
      <div className="card-bottom"><div className="room-info"><strong>{baseRoom.name} — {baseRoom.view}</strong><span>{baseRoom.size} m² · {baseRoom.capacity} guests / room</span>
        {hotel.breakfast && <p className="cancellation"><Check size={13}/> Breakfast {hotel.id === "sakura" ? "& onsen access " : ""}included</p>}
        <p className={hotel.cancellation ? "cancellation" : "muted"}>{hotel.cancellation ? <><Check size={13}/> Free cancellation until {cancellationDate(hotel, search)}</> : hotel.type === "Capsule Hotel" ? "Pay at property · non-refundable" : "Non-refundable sample rate"}</p>
        <label className="compare-check"><input type="checkbox" checked={compared} onChange={onCompare}/><span>Compare <span className="sr-only">{hotel.name} hotel</span></span></label>
      </div><div className="price-block">{hotel.oldPrice && <div><s>{money(hotel.oldPrice)}</s><span className="discount">{Math.round((1 - hotel.price / hotel.oldPrice) * 100)}% off</span></div>}<p><strong data-testid="nightly-price">{money(hotel.price)}</strong><span>/ night</span></p><span>{money(hotel.price * nights * search.rooms)} total for {nights} nights{search.rooms > 1 ? ` · ${search.rooms} rooms` : ""}</span><small>Taxes & fees included · from base room</small>
        <p className={`availability ${hotel.available <= 3 ? "warning" : ""}`}>{hotel.available === 0 ? "Sold out in demo" : hotel.available <= 3 ? `Only ${hotel.available} sample rooms left` : `${hotel.available} sample rooms available`}</p>
        <button className="primary" disabled={!canBook} onClick={onBook}>{canBook ? "Book now" : "Unavailable"}{canBook && <ChevronRight size={15}/>}</button>
      </div></div>
    </div>
  </article>;
}

function TokyoMap({ hotels: mapHotels, money, onHotel, onSearchArea, area }: {
  hotels: Hotel[]; money: (price: number) => string; onHotel: (hotel: Hotel) => void; onSearchArea: (area: string) => void; area: string;
}) {
  const [zoom, setZoom] = useState(1);
  const [satellite, setSatellite] = useState(false);
  const [active, setActive] = useState<Hotel | null>(null);
  const [region, setRegion] = useState(area);
  const [expandedCluster, setExpandedCluster] = useState(false);
  const cluster = mapHotels.filter(h => h.neighborhood === "Shinjuku");
  return <div className="map-view"><p className="notice">Original schematic map — not geographic navigation or live satellite imagery. Blue = sample inventory, gray = sold out.</p>
    <div className="map-toolbar"><div><button className="secondary" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - 0.25))}><Minus size={17}/></button><output aria-label="Map zoom">{Math.round(zoom * 100)}%</output><button className="secondary" aria-label="Zoom in" disabled={zoom >= 2} onClick={() => setZoom(Math.min(2, zoom + 0.25))}><Plus size={17}/></button></div>
      <button className="secondary" aria-pressed={satellite} onClick={() => setSatellite(!satellite)}>{satellite ? "Street style" : "Satellite style (simulated)"}</button>
      <label>Map area<select aria-label="Map area" value={region} onChange={e => setRegion(e.target.value)}><option value="">All Tokyo</option>{groups.find(g => g.key === "neighborhood")!.options.map(label => <option key={label}>{label}</option>)}</select></label>
      <button className="primary" onClick={() => { onSearchArea(region); setActive(null); }}>Search this area</button>
    </div>
    <div className={`tokyo-map ${satellite ? "satellite" : ""}`}><div className="map-canvas" style={{ transform: `scale(${zoom})` }}>
      <div className="map-river"/><div className="map-park park-one"/><div className="map-park park-two"/><div className="rail-line"/><span className="map-label shinjuku">SHINJUKU</span><span className="map-label shibuya">SHIBUYA</span><span className="map-label ginza">GINZA</span><span className="map-label asakusa">ASAKUSA</span><span className="map-center">Imperial gardens</span>
      {cluster.length > 1 && zoom < 1.5 && !expandedCluster && <button className="map-cluster" style={{ left: "27%", top: "34%" }} aria-label={`Expand Shinjuku cluster of ${cluster.length} hotels`} onClick={() => setExpandedCluster(true)}>{cluster.length}<small>stays</small></button>}
      {mapHotels.filter(hotel => !(hotel.neighborhood === "Shinjuku" && cluster.length > 1 && zoom < 1.5 && !expandedCluster)).map(hotel => <button className={`price-marker ${hotel.available ? "" : "sold-out"} ${active?.id === hotel.id ? "active" : ""}`} key={hotel.id} style={{ left: `${hotel.position[0]}%`, top: `${hotel.position[1]}%` }} aria-label={`${hotel.name}, ${money(hotel.price)}${hotel.available ? "" : ", sold out"}`} onClick={() => setActive(hotel)}>{money(hotel.price)}</button>)}
    </div><span className="map-attribution">StayFinder original illustration · Not to scale</span></div>
    {mapHotels.length === 0 && <p role="status">No markers match your search. Clear filters or select All Tokyo and search this area.</p>}
    {active && <article className="map-mini-card"><Photo hotel={active}/><div><h3>{active.name}</h3><p>{active.rating}/10 · {active.neighborhood}</p><strong>{money(active.price)} / night</strong><p>{active.available ? "Sample rooms available" : "Sold out in demo"}</p><button className="primary" onClick={() => onHotel(active)}>View hotel details</button></div><button className="icon-button" aria-label="Close map hotel preview" onClick={() => setActive(null)}><X size={18}/></button></article>}
    <p className="small muted">Use the area selector to explore neighborhoods; the map does not geolocate you. Map filters combine with the search and sidebar filters.</p>
  </div>;
}
