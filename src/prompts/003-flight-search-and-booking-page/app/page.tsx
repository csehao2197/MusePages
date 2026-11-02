"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plane, Menu, BriefcaseBusiness, ChevronDown, ArrowRightLeft, MapPin, CalendarDays, Users, Search as SearchIcon, SlidersHorizontal, ArrowRight, Bell, Sparkles, Check, Info, ShieldCheck, Globe2, X, ChevronRight } from "lucide-react";
import FlightCard from "../components/FlightCard";
import Modal from "../components/Modal";
import Booking, { type Confirmation } from "../components/Booking";
import { airlines, airports, flights, initialSearch, freshFilters, priceBounds, farePrice, matches, dateText, dateAdjustment, addDays, slots, slotRanges, type Search, type Filters, type Flight, type Airport, type Trip } from "../components/flights";

const sortOptions = ["Best", "Cheapest", "Fastest", "Earliest Departure", "Latest Departure"];
const footerGroups = [
  ["Explore", "Top Destinations", "Flight Deals", "Airline Reviews", "Airport Guides"],
  ["Company", "About FlyFair", "How We Rank", "Press", "Careers"],
  ["Support", "Help Center", "Contact", "Refund Policy", "Accessibility"],
  ["Legal", "Privacy Policy", "Terms of Service", "Cookie Settings"],
];
const infoContent: Record<string, string> = {
  Hotels: "No hotel service is connected. This flight-focused demo does not search, reserve or sell hotels.",
  "Car Rental": "No car rental inventory or reservation service is connected in this demo.",
  Packages: "Packages are not offered here. Flights can be compared and simulated individually.",
  "Travel Guides": "Tokyo quick guide: Narita is outside central Tokyo; allow time for the airport train. Haneda is nearer the city. Check official travel requirements before any real journey.",
  "How We Rank": "Best balances price and outbound duration: normalized USD fare + 0.5 × duration in minutes. Lowest score wins; flight 1 is the initial best-value example. No sponsored payment influences this order.",
  "Privacy Policy": "Searches, passenger details, alerts and confirmations exist only in React memory. Reloading clears them. No analytics, cookies, email providers or travel APIs are configured. Do not use real personal information.",
  "Terms of Service": "This is a fictional interface demonstration. Prices, gates, inventory, itinerary times and policies are illustrative; nothing here constitutes a travel offer or an issued ticket.",
  "Cookie Settings": "This demo sets no application cookies and uses no tracking scripts. There are no optional cookie services to enable.",
  "Refund Policy": "No payments are accepted, so no real refund or cancellation policy applies. The 24-hour cancellation and price-match messages illustrate product copy, not enforceable guarantees.",
  Accessibility: "Keyboard navigation, native controls, visible focus, modal focus containment and reduced-motion styles are implemented. This demo has not received an independent accessibility audit.",
  "Airline Reviews": "Airline names identify example comparison rows, not endorsements. Initial-based icons were made for this demo and are not official airline logos. No real ratings are claimed.",
  "Flight Deals": "Explore the flexible-date calendar and use the Cheapest sorting option to compare local simulated fares.",
  "Top Destinations": "Available simulated airports: New York JFK, Newark EWR, Tokyo Narita NRT, Tokyo Haneda HND and Osaka Kansai KIX. Change the search to explore them.",
  "Airport Guides": "JFK: New York · NRT: Tokyo Narita · HND: Tokyo Haneda · EWR: Newark · KIX: Osaka Kansai. All terminal and gate information on result cards is fictional.",
  "About FlyFair": "FlyFair is a fictional flight comparison product, built as a local, self-contained design and interaction demo.",
  Press: "FlyFair is a demo brand. There are no press releases, commercial affiliations or real endorsements.",
  Careers: "This fictional platform is not recruiting. No applications or personal details are collected.",
  "Help Center": "Change dates and travelers with Search, combine filters to narrow results, open a flight’s fare comparison, and complete Travelers → Seats → Review to save a simulated trip. Reset filters if no flight matches.",
  Contact: "No real support channel is connected. This local demo cannot send email or provide live travel assistance.",
  "Sign In": "No login or account service is connected. My Trips holds your simulated confirmations in memory only, without a password or account.",
  "Demo policies": "No hidden fees: displayed totals include simulated taxes. Price match, 24-hour cancellation and 24/7 support are illustrative product concepts only, not real promises. No airline endorsement, security certification, IATA membership or BBB rating is claimed.",
};

export default function Home() {
  const [search, setSearch] = useState<Search>(initialSearch);
  const [draft, setDraft] = useState<Search>(initialSearch);
  const [filters, setFilters] = useState<Filters>(freshFilters);
  const [sort, setSort] = useState("Best");
  const [currency, setCurrency] = useState("USD");
  const [modify, setModify] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [calendar, setCalendar] = useState(true);
  const [month, setMonth] = useState(false);
  const [moreAirlines, setMoreAirlines] = useState(false);
  const [limit, setLimit] = useState(10);
  const [infinite, setInfinite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [info, setInfo] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertFeedback, setAlertFeedback] = useState("");
  const [alertError, setAlertError] = useState(false);
  const [booking, setBooking] = useState<{ flight: Flight; fare: number } | null>(null);
  const [trips, setTrips] = useState<Confirmation[]>([]);
  const [showTrips, setShowTrips] = useState(false);
  const loadTarget = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount * (currency === "EUR" ? .92 : currency === "JPY" ? 150 : 1));
  const visible = useMemo(() => flights.filter(f => matches(f, filters, search)).sort((a, b) => {
    if (sort === "Cheapest") return farePrice(a, search) - farePrice(b, search);
    if (sort === "Fastest") return a.duration - b.duration;
    if (sort === "Earliest Departure") return a.departure - b.departure;
    if (sort === "Latest Departure") return b.departure - a.departure;
    return farePrice(a, search) + a.duration * .5 - farePrice(b, search) - b.duration * .5;
  }), [filters, sort, search]);
  useEffect(() => { setLimit(10); if (timer.current) clearTimeout(timer.current); setLoading(false); }, [filters, search, sort]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const loadMore = () => {
    if (loading || limit >= visible.length) return;
    setLoading(true);
    timer.current = setTimeout(() => { setLimit(value => Math.min(value + 20, visible.length)); setLoading(false); }, 400);
  };
  useEffect(() => {
    if (!infinite || loading || limit >= visible.length) return;
    const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) loadMore(); }, { rootMargin: "60px" });
    if (loadTarget.current) observer.observe(loadTarget.current);
    return () => observer.disconnect();
    // The observer is rebuilt whenever the current result page changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infinite, loading, limit, visible.length]);
  const toggle = <K extends "stops" | "airlines" | "departure" | "arrival" | "layovers" | "alliances">(key: K, value: Filters[K][number]) => {
    setFilters(current => { const values = current[key] as (number | string)[]; return { ...current, [key]: values.includes(value) ? values.filter(v => v !== value) : [...values, value] }; });
  };
  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.from === draft.to || (draft.trip === "Multi-City" && draft.onward === draft.to)) { setSearchError("Choose different airports for each leg."); return; }
    if (!draft.depart || (draft.trip !== "One Way" && (!draft.returnDate || draft.returnDate <= draft.depart))) { setSearchError("Choose a departure date and a later return or onward date."); return; }
    if (draft.depart < "2026-01-01" || draft.depart > "2027-12-30" || (draft.trip !== "One Way" && draft.returnDate > "2027-12-31")) { setSearchError("The simulated schedule supports dates in 2026–2027 only."); return; }
    const bounds = priceBounds(draft);
    setFilters(current => ({ ...current, min: Math.max(bounds.min, Math.min(bounds.max, current.min === priceBounds(search).min ? bounds.min : current.min)), max: Math.max(bounds.min, Math.min(bounds.max, current.max === priceBounds(search).max ? bounds.max : current.max)) }));
    setSearchError(""); setSearch({ ...draft }); setModify(false); setAnnouncement("Search updated. All results are simulated locally.");
  };
  const changeDate = (date: string) => {
    const nights = Math.max(1, Math.round((new Date(search.returnDate).getTime() - new Date(search.depart).getTime()) / 86400000));
    if (date < "2026-01-01" || date > "2027-12-30" || (search.trip !== "One Way" && addDays(date, nights) > "2027-12-31")) { setAnnouncement("This date is outside the supported 2026–2027 simulated schedule."); return; }
    const next = { ...search, depart: date, returnDate: addDays(date, nights) };
    setSearch(next); setDraft(next); setAnnouncement(`Departure changed to ${dateText(date)}. ${search.trip === "Round Trip" ? `${nights}-night stay preserved.` : "Itinerary dates updated."}`);
  };
  const similarRoute = (from: Airport, to: Airport) => { const next = { ...search, from, to }; setSearch(next); setDraft(next); setFilters(freshFilters(next)); setAnnouncement(`Showing simulated flights for ${from} to ${to}.`); window.scrollTo({ top: 0, behavior: "instant" }); };
  const setPriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) { setAlertError(true); setAlertFeedback("Enter a valid demo email address."); return; }
    setAlertError(false); setAlertFeedback(`Local alert set for ${search.from} → ${search.to}. No email will be sent; this clears on reload.`);
  };
  const bounds = priceBounds(search);
  const filterCount = filters.stops.length + filters.airlines.length + filters.departure.length + filters.arrival.length + filters.layovers.length + filters.alliances.length + (filters.min !== bounds.min || filters.max !== bounds.max ? 1 : 0) + (filters.duration !== 36 ? 1 : 0);
  const filtersContent = <div className="filter-content">
    <div className="filter-heading"><h2>Filters</h2><button className="text-button" onClick={() => setFilters(freshFilters(search))}>Reset all</button></div>
    <fieldset><legend>Price range <span>per person · USD</span></legend><div className="histogram" aria-label="Illustrative fare distribution">{[12, 23, 42, 57, 83, 100, 91, 74, 63, 42, 33, 23, 15, 10, 7].map((v, i) => <span key={i} style={{ height: `${v}%` }} />)}</div>
      <div className="range-pair"><input aria-label="Minimum price" type="range" min={bounds.min} max={bounds.max} step="1" value={filters.min} onChange={e => setFilters({ ...filters, min: Math.min(Number(e.target.value), filters.max) })} /><input aria-label="Maximum price" type="range" min={bounds.min} max={bounds.max} step="1" value={filters.max} onChange={e => setFilters({ ...filters, max: Math.max(Number(e.target.value), filters.min) })} /></div><div className="range-values"><span>${filters.min.toLocaleString()}</span><span>${filters.max.toLocaleString()}</span></div>
    </fieldset>
    <fieldset><legend>Stops</legend>{["Nonstop", "1 Stop", "2+ Stops"].map((label, i) => <label className="checkbox" key={label}><input type="checkbox" checked={filters.stops.includes(i)} onChange={() => toggle("stops", i)} /><span>{label}</span><small>{flights.filter(f => f.stops === i).length}</small></label>)}</fieldset>
    <fieldset><legend>Airlines</legend>{airlines.slice(0, moreAirlines ? 8 : 6).map((airline, i) => <label className="checkbox airline-check" key={airline.code}><input type="checkbox" checked={filters.airlines.includes(i)} onChange={() => toggle("airlines", i)} /><span className="mini-logo" style={{ color: airline.color }}>{airline.code}</span><span>{airline.full}{i === 0 ? " (ANA)" : i === 1 ? " (JAL)" : ""}</span><small>{flights.filter(f => f.airline === i).length}</small></label>)}<button className="text-button" onClick={() => setMoreAirlines(!moreAirlines)} aria-expanded={moreAirlines}>{moreAirlines ? "Show fewer airlines" : "Others · Show more"}<ChevronDown size={14} /></button></fieldset>
    {(["departure", "arrival"] as const).map(key => <fieldset key={key}><legend>{key === "departure" ? "Departure" : "Arrival"} time</legend><div className="time-grid">{slots.map((slot, i) => <button key={slot} aria-pressed={filters[key].includes(i)} onClick={() => toggle(key, i)}>{slot}<small>{slotRanges[i]}</small></button>)}</div></fieldset>)}
    <fieldset><legend>Duration <span>outbound</span></legend><label className="range-label">Up to {filters.duration}h<input type="range" min="13" max="36" value={filters.duration} onChange={e => setFilters({ ...filters, duration: Number(e.target.value) })} /></label><div className="range-values"><span>13h</span><span>36h</span></div></fieldset>
    <fieldset><legend>Layover airport</legend><p className="small muted">Choose any matching connection.</p><div className="airport-chips">{["LAX", "SFO", "ORD", "ICN"].map(code => <button key={code} aria-pressed={filters.layovers.includes(code)} onClick={() => toggle("layovers", code)}>{code}</button>)}</div></fieldset>
    <fieldset><legend>Alliance</legend>{["Star Alliance", "SkyTeam", "Oneworld"].map(alliance => <label className="checkbox" key={alliance}><input type="checkbox" checked={filters.alliances.includes(alliance)} onChange={() => toggle("alliances", alliance)} /><span>{alliance}</span></label>)}</fieldset>
    <button className="text-button reset-bottom" onClick={() => setFilters(freshFilters(search))}><X size={15} />Reset All Filters</button>
  </div>;
  const airportSelect = (key: "from" | "to" | "onward", label: string) => <label className={`search-field ${key === "onward" ? "onward-field" : ""}`}><span><MapPin size={14} />{label}</span><select value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value as Airport })}>{Object.entries(airports).map(([code, name]) => <option value={code} key={code}>{name}</option>)}</select></label>;
  const dateFields = Array.from({ length: 7 }, (_, i) => addDays(search.depart, i - 3));
  const dayPrices: Record<string, number> = { "2026-04-12": 945, "2026-04-13": 892, "2026-04-14": 1102, "2026-04-15": 892, "2026-04-16": 934, "2026-04-17": 1245, "2026-04-18": 876 };
  const calendarPrice = (date: string) => Math.round((dayPrices[date] ?? 892 + dateAdjustment(date)) * (search.trip === "One Way" ? .62 : 1) * (search.cabin === "Business" ? 2.4 : search.cabin === "Premium Economy" ? 1.5 : 1) + (search.trip === "Multi-City" ? 180 : 0) + (search.from !== "JFK" || search.to !== "NRT" ? 48 : 0));
  const monthStart = `${search.depart.slice(0, 7)}-01`;
  const monthLength = new Date(Number(search.depart.slice(0, 4)), Number(search.depart.slice(5, 7)), 0).getDate();
  const monthOffset = new Date(`${monthStart}T12:00:00Z`).getUTCDay();
  return <>
    <a href="#results" className="skip-link">Skip to flight results</a>
    <header className="nav"><div className="nav-inner"><a className="logo" href="#" aria-label="FlyFair home"><Plane size={25} />FlyFair<span className="logo-dot">.</span></a>
      <nav aria-label="Primary" className={mobileMenu ? "nav-links open" : "nav-links"}>{["Flights", "Hotels", "Car Rental", "Packages", "Travel Guides"].map(link => <button key={link} className={link === "Flights" ? "active" : ""} onClick={() => { setMobileMenu(false); if (link === "Flights") document.getElementById("results")?.scrollIntoView(); else setInfo(link); }}>{link}</button>)}</nav>
      <div className="nav-actions"><label className="currency"><Globe2 size={16} /><span className="sr-only">Currency</span><select value={currency} onClick={() => setAnnouncement("Currency uses fixed demo rates: 1 USD = 0.92 EUR = 150 JPY. Filters remain in USD.")} onChange={e => setCurrency(e.target.value)}><option>USD</option><option>EUR</option><option>JPY</option></select></label><button className="trips-button" aria-label={`My Trips${trips.length ? ` (${trips.length})` : ""}`} onClick={() => setShowTrips(true)}><BriefcaseBusiness size={18} /><span>My Trips{trips.length ? ` (${trips.length})` : ""}</span></button><button className="sign-in outline" onClick={() => setInfo("Sign In")}>Sign In</button><button className="icon-button hamburger" aria-label="Toggle navigation" aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}><Menu size={22} /></button></div>
    </div></header>
    <section className="search-bar" aria-label="Modify flight search"><div className="mobile-summary"><span><strong>{search.from} → {search.to}</strong><small>{dateText(search.depart)}{search.trip !== "One Way" && `–${dateText(search.returnDate)}`} · {search.adults} Adults</small></span><button className="text-button" onClick={() => setModify(!modify)} aria-expanded={modify}>{modify ? "Close" : "Modify"} <SlidersHorizontal size={16} /></button></div>
      <form className={`search-inner ${modify ? "expanded-search" : ""}`} onSubmit={applySearch} noValidate>
        <div className="trip-tabs">{(["Round Trip", "One Way", "Multi-City"] as Trip[]).map(trip => <button type="button" key={trip} aria-pressed={draft.trip === trip} onClick={() => setDraft({ ...draft, trip })}>{trip}<ChevronDown size={13} /></button>)}<span>Every journey starts with a fair fare.</span></div>
        <div className="search-fields">{airportSelect("from", "From")}<button className="swap icon-button" type="button" aria-label="Swap origin and destination" onClick={() => setDraft({ ...draft, from: draft.to, to: draft.from })}><ArrowRightLeft size={18} /></button>{airportSelect("to", "To")}
          <label className="search-field date-field"><span><CalendarDays size={14} />Depart</span><input type="date" min="2026-01-01" max="2027-12-30" value={draft.depart} onChange={e => setDraft({ ...draft, depart: e.target.value })} /></label>
          {draft.trip !== "One Way" && <label className="search-field date-field"><span><CalendarDays size={14} />{draft.trip === "Multi-City" ? "Onward date" : "Return"}</span><input type="date" min={draft.depart ? addDays(draft.depart, 1) : "2026-01-02"} max="2027-12-31" value={draft.returnDate} onChange={e => setDraft({ ...draft, returnDate: e.target.value })} /></label>}
          <label className="search-field travelers-field"><span><Users size={14} />Travelers</span><select value={draft.adults} onChange={e => setDraft({ ...draft, adults: Number(e.target.value) })}>{[1, 2, 3, 4, 5, 6].map(n => <option value={n} key={n}>{n} Adult{n > 1 ? "s" : ""}</option>)}</select></label>
          <label className="search-field class-field"><span><BriefcaseBusiness size={14} />Class</span><select value={draft.cabin} onChange={e => setDraft({ ...draft, cabin: e.target.value })}><option>Economy</option><option>Premium Economy</option><option>Business</option></select></label><button className="primary search-submit" type="submit"><SearchIcon size={18} />Search</button>
          {draft.trip === "Multi-City" && airportSelect("onward", `Next destination (from ${draft.to})`)}
        </div>{searchError && <p className="error" role="alert">{searchError}</p>}
      </form>
    </section>
    <main className="container">
      <div className="breadcrumb"><span>Flights</span><ChevronRight size={13} /><span>{search.from === "JFK" ? "New York" : search.from} to {search.to === "NRT" || search.to === "HND" ? "Tokyo" : search.to}</span></div>
      <section className="destination"><div><div className="eyebrow"><span />YOUR NEXT CHAPTER</div><h1>A little closer to {search.to === "NRT" || search.to === "HND" ? "Tokyo" : search.to === "KIX" ? "Osaka" : "New York"}.</h1><p>Find the right flight. Keep the good part for the journey.</p><div className="destination-tags"><span><CalendarDays size={15} />{dateText(search.depart)}{search.trip !== "One Way" && ` – ${dateText(search.returnDate)}`}, {search.depart.slice(0, 4)}</span><span><Users size={15} />{search.adults} adults</span><span>{search.cabin}</span></div></div><img src="/tokyo.svg" alt="Original pastel illustration of Tokyo Tower, Mount Fuji and the Tokyo skyline" width="640" height="250" /></section>
      <div className="simulation-banner"><ShieldCheck size={17} /><span><strong>Explore with confidence — it’s a demo.</strong> All {flights.length} flights, fares and seats are fictional. No live prices, payment or actual tickets.</span><button className="text-button" onClick={() => setInfo("Demo policies")}>About this demo <Info size={14} /></button></div>
      <div className="workspace"><aside className="sidebar" aria-label="Flight filters">
        <div className="filter-panel">{filtersContent}</div>
        <section className="alert-widget"><span className="widget-icon"><Bell size={20} /></span><h3>Good things come to those who wait.</h3><p>Get a local price alert for {search.from} → {search.to}.</p><form onSubmit={setPriceAlert} noValidate><label className="sr-only" htmlFor="alert-email">Price alert email</label><input id="alert-email" type="email" placeholder="Your demo email address" value={alertEmail} onChange={e => setAlertEmail(e.target.value)} aria-invalid={alertError} /><button className="primary" type="submit"><Bell size={15} />Set Alert</button></form>{alertFeedback && <p className={alertError ? "error" : "success"} role={alertError ? "alert" : "status"}>{alertFeedback}</p>}<small>No real notifications. Memory only.</small></section>
        <section className="similar-widget"><h3>Worth a look, too</h3><p className="muted small">Similar routes · simulated fares</p>{([["JFK", "HND"], ["EWR", "NRT"], ["JFK", "KIX"]] as [Airport, Airport][]).map(([from, to]) => <button key={`${from}${to}`} onClick={() => similarRoute(from, to)}><span>{from} <ArrowRight size={13} />{to}</span><ChevronRight size={15} /></button>)}</section>
        <section className="tip-widget"><Sparkles size={20} /><h3>A little FlyFair wisdom</h3><p>Booking 3–6 weeks ahead is a useful window to compare transpacific fares.</p><small>The brief’s 15–25% savings is illustrative, not a verified prediction.</small></section>
      </aside>
      <section className="results" id="results" tabIndex={-1}>
        <div className="results-summary"><div><h2><strong data-testid="result-count">{visible.length}</strong> flights found</h2><p>{search.from} → {search.to}{search.trip === "Multi-City" && ` → ${search.onward}`} · {search.trip.toLowerCase()} · {dateText(search.depart)}{search.trip !== "One Way" && ` – ${dateText(search.returnDate)}`}</p></div><div className="sort-control"><label>Sort by<select aria-label="Sort flights" value={sort} onChange={e => setSort(e.target.value)}>{sortOptions.map(option => <option key={option}>{option}</option>)}</select></label><button className="icon-button" aria-label="How Best ranking works" onClick={() => setInfo("How We Rank")}><Info size={16} /></button></div></div>
        <div className="price-calendar"><button className="calendar-heading" aria-expanded={calendar} onClick={() => setCalendar(!calendar)}><span><CalendarDays size={19} /><strong>Flexible dates? Find a happier fare.</strong><small>See the cheapest fares</small></span><ChevronDown size={18} className={calendar ? "rotated" : ""} /></button>
          {calendar && <><div className="calendar-days">{dateFields.map(date => { const cheapest = calendarPrice(date) === Math.min(...dateFields.map(calendarPrice)); return <button key={date} className={`date-tile ${search.depart === date ? "selected" : ""} ${cheapest ? "lowest" : ""}`} aria-pressed={search.depart === date} aria-label={`Depart ${dateText(date)}, ${money(calendarPrice(date))}`} onClick={() => changeDate(date)}><span>{dateText(date)}</span><div className="bar-space"><span style={{ height: `${Math.max(15, calendarPrice(date) / Math.max(...dateFields.map(calendarPrice)) * 40)}px` }} /></div><strong>{money(calendarPrice(date))}</strong><small>{search.depart === date ? "Selected" : cheapest ? "Lowest fare" : new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}</small></button>; })}</div><div className="calendar-footer"><span><span className="green-dot" />Flexible-date fare guide · not live quotes</span><button className="text-button" onClick={() => setMonth(!month)} aria-expanded={month}>{month ? "Hide full month" : "Show full month view"}<ChevronRight size={14} /></button></div>
          {month && <div className="month-view"><h3>{new Date(`${monthStart}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}</h3><div className="month-grid">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span className="weekday" key={d}>{d}</span>)}{Array.from({ length: monthOffset }, (_, i) => <span key={`blank${i}`} />)}{Array.from({ length: monthLength }, (_, i) => { const date = addDays(monthStart, i); const p = calendarPrice(date); return <button key={date} className={`${p < 950 ? "low" : p > 1150 ? "high" : "mid"} ${date === search.depart ? "chosen" : ""}`} aria-pressed={date === search.depart} aria-label={`Depart ${dateText(date)}, ${money(p)}`} onClick={() => changeDate(date)}>{i + 1}<small>{money(p)}</small></button>; })}</div><p className="small muted">Green: lower · amber: mid · red: higher illustrative fares. Choosing a date keeps the trip length.</p></div>}</>}
        </div>
        <div className="comparison-tabs" aria-label="Quick sort">{["Best", "Cheapest", "Fastest"].map(option => { const candidate = [...flights].filter(f => f.seats >= search.adults).sort((a, b) => option === "Fastest" ? a.duration - b.duration : option === "Best" ? farePrice(a, search) + a.duration * .5 - farePrice(b, search) - b.duration * .5 : farePrice(a, search) - farePrice(b, search))[0]; return <button key={option} onClick={() => setSort(option)} aria-pressed={sort === option}>{option === "Best" ? <Sparkles size={16} /> : option === "Fastest" ? <Plane size={16} /> : <span>$</span>}<span><strong>{option}</strong><small>{candidate ? `${money(farePrice(candidate, search))} · ${Math.floor(candidate.duration / 60)}h ${candidate.duration % 60}m` : "Unavailable"}</small></span>{sort === option && <Check size={16} />}</button>; })}</div>
        {filterCount > 0 && <div className="active-filters"><SlidersHorizontal size={14} />{filterCount} active filter{filterCount > 1 ? "s" : ""}<button className="text-button" onClick={() => setFilters(freshFilters(search))}>Clear all <X size={13} /></button></div>}
        <p className="sr-only" role="status" aria-live="polite">{announcement} {visible.length} simulated flights match.</p>
        {visible.length === 0 ? <div className="empty-state"><SearchIcon size={38} /><h3>No flights match this combination.</h3><p>Try a wider price range, fewer stops or another airline. All inventory is simulated.</p><button className="primary" onClick={() => setFilters(freshFilters(search))}>Reset filters</button></div> : <div className="flight-list">
          {visible.slice(0, limit).map((f, i) => <div key={f.id}><FlightCard flight={f} search={search} money={money} onSelect={(flight, fare) => setBooking({ flight, fare })} badge={f.id === 1 ? "Best Value" : f.id === 3 ? "Cheapest" : f.id === 2 ? "Fastest" : undefined} />
            {i === 2 && <><section className="sponsored"><div className="sponsored-top"><span className="mini-logo">NH</span><span>Illustrative sponsored placement · no paid partnership</span></div><div><div><span className="eyebrow">A LITTLE EXTRA GOES A LONG WAY</span><h3>Fly ANA Premium Economy</h3><p>Extra legroom, illustrative lounge access & 2 bags included.</p><span>From <strong>{money(farePrice({ ...flights[0], price: 742 }, search) + 448)}/person</strong> · $150 demo bundle discount</span></div><button className="outline" onClick={() => setBooking({ flight: { ...flights[0], price: 742 }, fare: 2 })}>View Deal <ArrowRight size={16} /></button></div></section>
            <section className="trust-bar"><ShieldCheck size={22} /><div><span><Check size={14} />No hidden demo fees</span><span><Check size={14} />Price match concept</span><span><Check size={14} />24-hour cancellation concept</span><span><Check size={14} />24/7 support concept</span></div><button className="text-button" onClick={() => setInfo("Demo policies")}>Demo policies</button></section></>}
          </div>)}
        </div>}
        {loading && <div className="skeletons" role="status" aria-label="Loading more simulated flights"><div /><div /></div>}
        <div className="load-area" ref={loadTarget}>{limit < visible.length && <button className="outline load-more" disabled={loading} onClick={loadMore}>{loading ? "Loading flights…" : "Show 20 more flights"}<ChevronDown size={17} /></button>}<p>Showing {Math.min(limit, visible.length)} of {visible.length} flights{filterCount ? ` · ${flights.length} in demo inventory` : ""}</p>{visible.length > 10 && <label className="checkbox infinite"><input type="checkbox" checked={infinite} onChange={e => setInfinite(e.target.checked)} />Load more automatically as I scroll</label>}</div>
      </section></div>
    </main>
    <footer><div className="footer-inner"><div className="footer-brand"><a className="logo" href="#"><Plane size={23} />FlyFair<span className="logo-dot">.</span></a><p>Less searching.<br />More somewhere.</p><small>Fictional travel platform · local demo</small></div>{footerGroups.map(([heading, ...links]) => <section key={heading}><h3>{heading}</h3>{links.map(link => <button key={link} onClick={() => setInfo(link)}>{link}</button>)}</section>)}<div className="footer-bottom"><span>© 2026 FlyFair Inc. · Fictional brand. Demo only.</span><span><ShieldCheck size={15} />No security certification, IATA membership or BBB rating claimed.</span></div></div></footer>
    <div className="mobile-bottom"><div><strong>{visible.length} flights</strong><small>{visible.length ? `from ${money(Math.min(...visible.map(f => farePrice(f, search))))}` : "Try resetting filters"}</small></div><button onClick={() => setSortModal(true)}><ArrowRightLeft size={17} />Sort</button><button onClick={() => setFilterModal(true)}><SlidersHorizontal size={17} />Filters{filterCount > 0 && <span>{filterCount}</span>}</button></div>
    {filterModal && <Modal title="Filter your flights" sheet onClose={() => setFilterModal(false)}>{filtersContent}<div className="sheet-action"><button className="primary" onClick={() => setFilterModal(false)}>Show {visible.length} flights</button></div></Modal>}
    {sortModal && <Modal title="Sort flights" sheet onClose={() => setSortModal(false)}><div className="sort-options">{sortOptions.map(option => <button className={sort === option ? "selected" : ""} key={option} onClick={() => { setSort(option); setSortModal(false); }}>{option}{sort === option && <Check size={18} />}</button>)}</div><p className="muted small">Best balances simulated price and outbound duration.</p></Modal>}
    {info && <Modal title={info} onClose={() => setInfo("")}><div className="info-body"><p>{infoContent[info] ?? "This is a local demonstration with no external service connected."}</p><button className="primary" onClick={() => setInfo("")}>Got it</button></div></Modal>}
    {showTrips && <Modal title="My simulated trips" onClose={() => setShowTrips(false)}><div className="info-body"><p className="demo-note">Local memory only — not real reservations. Reloading clears all trips.</p>{trips.length ? trips.map((trip, i) => <section className="saved-trip" key={i}><strong>{trip.reference}</strong><h3>{trip.route}</h3><p>{trip.fare} · {trip.total}</p><p>{trip.passengers.join(" & ")}</p><p>{trip.seats.join(" · ")}</p><button className="text-button" onClick={() => setTrips(trips.filter((_, index) => index !== i))}>Remove local preview</button></section>) : <div className="empty-state"><BriefcaseBusiness size={36} /><h3>No trips yet</h3><p>Choose a flight and complete the simulated booking to see it here.</p></div>}</div></Modal>}
    {booking && <Booking flight={booking.flight} fare={booking.fare} search={search} money={money} onClose={() => setBooking(null)} onConfirm={trip => setTrips(current => [...current, trip])} />}
  </>;
}
