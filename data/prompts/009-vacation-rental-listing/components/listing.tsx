"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Bath, BedDouble, Bike, CalendarDays, Check, ChevronLeft, ChevronRight,
  Diamond, Globe2, Heart, House, KeyRound, MapPin, Menu, MessageCircle, Minus,
  Plus, ShieldCheck, SlidersHorizontal, Sparkles, Star, Sun, Users, Waves, Wifi, X,
  Share2, Utensils, Car, AirVent, Camera, Leaf, LockKeyhole, Mail,
} from "lucide-react";
import Modal from "./modal";
import { amenities, blockedDates, Currency, DEMO_TODAY, Guests, money, quote, reviews, scenes, similar } from "./data";

type DialogName = "gallery" | "amenities" | "reviews" | "share" | "contact" | "reserve" | "report" | "info" | null;
const topAmenities = [
  [Waves, "Private infinity pool"], [Sun, "Direct beach access"], [Wifi, "High-speed WiFi (150 Mbps)"],
  [AirVent, "Air conditioning (all rooms)"], [Utensils, "Full chef’s kitchen"], [Car, "Free parking (2 vehicles)"],
  [Utensils, "Private chef available (extra)"], [Leaf, "Yoga deck"], [Bike, "2 complimentary bicycles"], [LockKeyhole, "Smart lock entry"],
] as const;
const infoText: Record<string, string> = {
  "How It Works": "Explore a home, check illustrative dates, and preview a request directly to its fictional host. This demo never creates a booking, charges a card, or sends a message. The zero platform service fee is an illustrative direct-booking benefit, not a guarantee.",
  "List Your Property": "The owner journey would collect property details, photography, safety disclosures, and availability. Owner onboarding and accounts are intentionally unavailable in this local listing demo.",
  "Sign In": "No account is needed to explore Casa Azul. Authentication is intentionally disabled: do not enter credentials. Saved homes last only for this page session.",
  Help: "Use the illustrated gallery, amenity list, and availability calendar to explore Casa Azul. Choose 3–28 nights and up to 6 guests, including infants. Reservation and host-contact forms create local previews only.",
  Privacy: "This local demo has no analytics, cookies, account service, or remote API. Form previews stay in browser memory and disappear when you reload. Do not enter sensitive personal information.",
  Terms: "All property details, hosts, ratings, discounts, policies, availability, distances, and guarantees are fictional or illustrative. No contract, booking, payment protection, or refund entitlement is created.",
  Accessibility: "Controls support keyboards, native date and email validation, modal focus containment, and reduced motion. Original illustrations have descriptive text. Use your browser’s zoom settings for larger text.",
};
function ReviewCard({ review }: { review: typeof reviews[number] }) {
  return <article className="review-card">
    <div className="review-author"><span className="avatar small">{review.name.slice(0, 1)}</span><div><strong>{review.name}</strong><span>{review.city} · {review.date}</span></div></div>
    <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} <span>Fictional guest</span></div>
    <p>{review.text}</p>
  </article>;
}

export default function Listing() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogName>(null);
  const [info, setInfo] = useState({ title: "", text: "" });
  const [photo, setPhoto] = useState(0);
  const [mobilePhoto, setMobilePhoto] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [guestOpen, setGuestOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [month, setMonth] = useState(0);
  const [query, setQuery] = useState("");
  const [amenityQuery, setAmenityQuery] = useState("");
  const [copyState, setCopyState] = useState("");
  const [complete, setComplete] = useState(false);
  const [formError, setFormError] = useState("");
  const [preview, setPreview] = useState({ name: "", email: "", message: "", category: "" });
  const galleryRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    if (!bookingOpen || dialog || !window.matchMedia("(max-width: 760px)").matches) return;
    const planner = document.getElementById("booking")!;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    planner.querySelector<HTMLButtonElement>(".close-booking")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setBookingOpen(false); }
      if (event.key !== "Tab") return;
      const targets = [...planner.querySelectorAll<HTMLElement>("button:not(:disabled), input, select, textarea, a[href]")].filter(element => element.getClientRects().length);
      const first = targets[0]; const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, [bookingOpen, dialog]);
  const totalGuests = guests.adults + guests.children + guests.infants;
  const pricing = quote(checkIn, checkOut, guests);
  const showError = attempted || (!!checkIn && !!checkOut);
  const format = (value: number) => money(value, currency);
  const toggleSave = (name: string) => setSaved(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  const closeDialog = () => { setDialog(null); setComplete(false); setFormError(""); };
  const showInfo = (title: string, text?: string) => {
    setInfo({ title, text: text || infoText[title] || `${title} is part of the illustrative StayDirect platform. This local demo focuses on Casa Azul; no external service or account is connected. Explore the property, review its policies, or preview a message to the host.` });
    setDialog("info"); setMenuOpen(false);
  };
  const openBooking = () => { setBookingOpen(true); setMenuOpen(false); document.getElementById("booking")?.scrollIntoView({ block: "center", behavior: "smooth" }); };
  const openGallery = (index: number) => { setPhoto(index); setDialog("gallery"); };
  const scrollPhoto = (index: number) => {
    const gallery = galleryRef.current;
    if (gallery) gallery.scrollTo({ left: index * gallery.clientWidth, behavior: "smooth" });
  };
  const chooseDate = (date: string) => {
    if (!checkIn || checkOut || date <= checkIn) { setCheckIn(date); setCheckOut(""); }
    else setCheckOut(date);
    setAttempted(false);
  };
  const submitPreview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (dialog === "reserve" && pricing.error) { setFormError(pricing.error); return; }
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || ((dialog === "contact" || dialog === "report") && message.length < 10)) {
      setFormError("Use a name of at least 2 characters, a valid email, and a message of at least 10 non-whitespace characters."); return;
    }
    setPreview({ name, email, message, category: String(form.get("category") || "") });
    setFormError(""); setComplete(true);
  };
  const title = dialog === "gallery" ? "A closer look at Casa Azul" : dialog === "amenities" ? "Every comfort, considered" : dialog === "reviews" ? "Guest stories · fictional examples" : dialog === "share" ? "Share a little paradise" : dialog === "contact" ? "Message Gabriela · local preview" : dialog === "reserve" ? "Preview your stay" : dialog === "report" ? "Report a concern · local preview" : info.title;
  const filteredReviews = reviews.filter(review => `${review.name} ${review.city} ${review.text}`.toLowerCase().includes(query.toLowerCase()));
  const filteredAmenities = Object.entries(amenities).map(([category, items]) => [category, items.filter(item => item.toLowerCase().includes(amenityQuery.toLowerCase()))] as const).filter(([, items]) => items.length);

  function calendar(offset: number) {
    const first = new Date(Date.UTC(2026, 9 + month + offset, 1));
    const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    return <div className={`month ${offset ? "second-month" : ""}`} key={offset}>
      <h3>{first.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}</h3>
      <div className="calendar-grid">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => <span className="weekday" key={day}>{day}</span>)}
        {Array.from({ length: first.getUTCDay() }, (_, index) => <span key={`blank-${index}`} />)}
        {Array.from({ length: count }, (_, index) => {
          const date = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), index + 1)).toISOString().slice(0, 10);
          const unavailable = blockedDates.has(date) || date < DEMO_TODAY || date > "2027-04-30";
          const start = date === checkIn; const end = date === checkOut;
          const selected = start || end;
          const inRange = checkIn && checkOut && date > checkIn && date < checkOut;
          return <button type="button" key={date} disabled={unavailable} aria-pressed={selected || !!inRange}
            aria-label={`${date}${unavailable ? " unavailable" : start ? " check-in" : end ? " check-out" : " available"}`}
            className={`calendar-day ${selected ? "selected" : ""} ${inRange ? "in-range" : ""}`}
            onClick={() => chooseDate(date)}>{index + 1}</button>;
        })}
      </div>
    </div>;
  }
  return <>
    <div className="demo-banner">A fictional escape, a real sense of possibility. <span>Local demo · no bookings or payments</span></div>
    <header className="header"><div className="nav container">
      <a href="#" className="brand" aria-label="StayDirect home"><span className="brand-icon"><House size={23} /></span>Stay<span>Direct</span><i /></a>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
        <a href="#similar" onClick={() => setMenuOpen(false)}>Explore</a>
        {["How It Works", "List Your Property", "Help"].map(label => <button key={label} onClick={() => showInfo(label)}>{label}</button>)}
      </nav>
      <div className="nav-actions"><label className="currency"><Globe2 size={16} /><span className="sr-only">Currency</span><select aria-label="Currency" value={currency} onChange={event => setCurrency(event.target.value as Currency)}><option>USD</option><option>EUR</option><option>GBP</option></select></label>
        <button className="signin" onClick={() => showInfo("Sign In")}>Sign In</button><button className="primary nav-book" onClick={openBooking}>Book<span> Now</span><ArrowRight size={16} /></button>
        <button className="icon-button menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </div></header>
    <main className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">{["Home", "Mexico", "Tulum"].map(label => <span key={label}><a href={label === "Home" ? "#" : "#location"}>{label}</a><ChevronRight size={12} /></span>)}<span>Beachfront Villas</span></nav>
      <section className="listing-header">
        <div className="eyebrow"><span /> YOUR PRIVATE SLICE OF THE CARIBBEAN</div>
        <div className="title-row"><h1>Casa Azul <span>— Luxury Beachfront Villa<br className="desktop-break" /> with Private Pool</span></h1><div className="quick-actions">
          <button onClick={() => toggleSave("Casa Azul")} aria-pressed={saved.includes("Casa Azul")}><Heart size={18} fill={saved.includes("Casa Azul") ? "currentColor" : "none"} />{saved.includes("Casa Azul") ? "Saved" : "Save"}</button>
          <button onClick={() => { setCopyState(""); setDialog("share"); }}><Share2 size={18} />Share</button>
        </div></div>
        <div className="listing-meta"><a href="#reviews"><Star size={15} fill="currentColor" /> <strong>4.92</strong> · 127 illustrative reviews</a><span className="meta-divider" /><a href="#location"><MapPin size={16} />Tulum Beach Road, Mexico</a><span className="host-chip"><ShieldCheck size={15} /> Superhost · fictional profile</span><button className="report-link" onClick={() => setDialog("report")}>Report listing</button></div>
      </section>

      <section className="gallery-section" aria-label="Property gallery">
        <div className="mosaic">{scenes.slice(0, 5).map((scene, index) => <button key={scene.title} className={`scene scene-${index}`} onClick={() => openGallery(index)} aria-label={`Open illustrated view: ${scene.title}`}>
          <img src={scene.src} alt={scene.title} /><span className="image-hover"><Camera size={20} />View illustration</span>
        </button>)}</div>
        <div className="mobile-carousel" ref={galleryRef} onScroll={event => setMobilePhoto(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}>
          {scenes.map((scene, index) => <button key={scene.title} onClick={() => openGallery(index)} aria-label={`Open illustrated view: ${scene.title}`}><img src={scene.src} alt={scene.title} /></button>)}
        </div>
        <div className="gallery-label"><Sun size={15} /> CASA AZUL, TULUM</div>
        <button className="all-photos" onClick={() => openGallery(mobilePhoto)}><SlidersHorizontal size={16} />Explore 8 illustrated views</button>
        <div className="carousel-dots">{scenes.map((scene, index) => <button key={scene.title} aria-label={`Go to view ${index + 1}`} aria-current={mobilePhoto === index ? "true" : undefined} onClick={() => scrollPhoto(index)}><span /></button>)}<span>{mobilePhoto + 1} / 8</span></div>
      </section>
      <div className="art-note"><Camera size={14} /> Original architectural illustrations, not property photographs. All listing details are fictional.</div>

      <div className="main-grid"><div className="details">
        <section className="quick-stats section">
          <div className="section-heading"><div><h2>Entire villa. Entirely yours.</h2><p>Hosted by <a href="#host">Gabriela</a> · fictional local host</p></div><a href="#host" className="avatar host-avatar" aria-label="Meet fictional host Gabriela">G<span><Check size={12} /></span></a></div>
          <div className="stats">{[[Users, "6 guests"], [BedDouble, "3 bedrooms"], [Bath, "3 bathrooms"], [Waves, "Private pool"]].map(([Icon, label]) => {
            const StatIcon = Icon as typeof Users; return <span key={String(label)}><StatIcon size={18} />{String(label)}</span>;
          })}</div>
        </section>
        <section className="highlights" aria-label="Property highlights">
          <div><Sun /><div><h3>Life at the water’s edge</h3><p>Steps from the Caribbean, with your own private beach path.</p></div></div>
          <div><ShieldCheck /><div><h3>A thoughtful Superhost</h3><p>Illustrative 4.92 rating · 98% response rate · 127 reviews.</p></div></div>
          <div><KeyRound /><div><h3>Arrive on your own time</h3><p>Self check-in by smart lock. A real stay would provide a code 24 hours before arrival.</p></div></div>
        </section>
        <section className="section about" id="about"><div className="eyebrow">DESIGNED TO SLOW YOU DOWN</div><h2>About this property</h2>
          <p>Welcome to Casa Azul — your private slice of the Tulum coastline. This handcrafted 3-bedroom villa sits directly on the beach, surrounded by lush jungle gardens and the sound of Caribbean waves.</p>
          <div className={`description-more ${expanded ? "expanded" : ""}`}>
            <p>Built in 2022 with sustainable local materials — reclaimed tropical hardwood, Yucatán limestone, and handmade Oaxacan tiles — every detail was designed for relaxed luxury. Wake up to ocean views, swim in the infinity pool at sunset, and fall asleep to the rhythm of the sea.</p>
            <h3>The space</h3><p>2,400 sq ft across two levels. Downstairs: open-air living and dining, a chef’s kitchen, and two en-suite guest rooms with direct pool access. Upstairs: a master suite, private balcony, outdoor rain shower, and a 180° ocean panorama.</p>
            <h3>Guest access</h3><p>The full property is yours: beach path, rooftop daybed, outdoor BBQ, yoga deck, and a beach palapa. Beach towels, snorkel gear, and two bicycles are included.</p>
          </div>
          <button className="text-button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Show more"}<ChevronRight size={16} className={expanded ? "rotate" : ""} /></button>
        </section>
        <section className="section"><h2>Where you’ll sleep</h2><p className="section-subtitle">Three quiet retreats. Room for everyone.</p>
          <div className="bedrooms">{[
            ["01", "Master Suite", "King bed", "Ocean view · private balcony · en-suite rain shower"],
            ["02", "Jungle Room", "Queen bed", "Garden view · en-suite bath with soaking tub"],
            ["03", "Palm Room", "2 twin beds", "Convertible to king · pool view · en-suite shower"],
          ].map(([number, name, bed, detail]) => <article key={name}><div><BedDouble size={28} /><span>{number}</span></div><h3>{name}</h3><strong>{bed}</strong><p>{detail}</p></article>)}</div>
        </section>
        <section className="section" id="amenities"><h2>What this place offers</h2><div className="amenities-grid">{topAmenities.map(([Icon, label]) => <div key={label}><Icon size={21} /><span>{label}</span></div>)}</div>
          <button className="outline" onClick={() => { setAmenityQuery(""); setDialog("amenities"); }}>Explore all {Object.values(amenities).flat().length} amenities<ArrowRight size={16} /></button>
        </section>
        <section className="section" id="availability"><div className="section-heading"><div><h2>A little time for yourself</h2><p>Availability · 3-night minimum</p></div><CalendarDays size={24} /></div>
          <p className="calendar-note">Fictional availability · demo clock: October 31, 2026. Select check-in, then check-out.</p>
          <div className="calendar-nav"><button className="icon-button" aria-label="Previous month" disabled={month === 0} onClick={() => setMonth(month - 1)}><ChevronLeft /></button><span>Find your dates</span><button className="icon-button" aria-label="Next month" disabled={month >= 6} onClick={() => setMonth(month + 1)}><ChevronRight /></button></div>
          <div className="calendars" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => {
            if (touchStart.current === null) return;
            const difference = touchStart.current - event.changedTouches[0].clientX;
            if (Math.abs(difference) > 60) setMonth(value => Math.min(6, Math.max(0, value + (difference > 0 ? 1 : -1))));
            touchStart.current = null;
          }}>{calendar(0)}{calendar(1)}</div>
          <div className="calendar-legend"><span><i />Available</span><span><i className="unavailable" />Unavailable</span><span><i className="selected" />Your stay</span></div>
          <div className="calendar-foot"><span>{checkIn ? `Check-in: ${checkIn}${checkOut ? ` · Check-out: ${checkOut}` : " · choose check-out"}` : "Sample update: 2 hours ago · not a live feed"}</span><button className="text-button" onClick={() => { setCheckIn(""); setCheckOut(""); setAttempted(false); }}>Clear dates</button></div>
          {showError && pricing.error && <p role="status" className="error">{pricing.error}</p>}
        </section>
        <section className="section" id="location"><h2>Where you’ll be</h2><p className="section-subtitle">Tulum Beach Road, Tulum, Quintana Roo, Mexico</p>
          <div className="local-map" role="img" aria-label="Illustrative, non-geographic map showing an approximate beach-road location beside the Caribbean Sea">
            <svg viewBox="0 0 700 340" aria-hidden="true"><path fill="#edf0e4" d="M0 0h700v340H0z" /><path fill="#bce0df" d="M475 0h225v340H400q73-96 53-173T475 0z" /><path fill="#eadbbd" d="M453 0h26q-37 87-6 164t-48 176h-28q76-118 47-185T453 0" /><path stroke="#fff" strokeWidth="13" fill="none" d="M80 0l-5 340M0 96l414-4M0 248l420-16M190 0l48 340M342 0q-24 145 10 340" /><path stroke="#d4bf98" strokeWidth="5" fill="none" d="M410 0q-40 88-2 190t-35 150" /><g fill="#d5dfc7"><rect x="110" y="120" width="69" height="87" rx="13" /><rect x="251" y="114" width="49" height="88" rx="9" /><rect x="267" y="266" width="55" height="57" rx="9" /></g><circle cx="395" cy="162" r="65" fill="#0891b2" opacity=".13" /><circle cx="395" cy="162" r="40" fill="#0891b2" opacity=".15" /><text x="517" y="212" fill="#467e83" fontFamily="sans-serif" fontSize="18" transform="rotate(-7 517 212)">Caribbean Sea</text><text x="102" y="62" fill="#748370" fontFamily="sans-serif" fontSize="15">Tulum · illustrative</text></svg>
            <span className="map-pin"><House size={24} /></span><span className="map-caption"><MapPin size={13} />Approximate area · not a real map</span>
          </div>
          <p>On the quieter southern stretch of Tulum Beach Road, a 10-minute bike ride from hotel-zone restaurants and cenotes. The Sian Ka’an Biosphere Reserve entrance is just five minutes south.</p>
          <div className="nearby">{[["Tulum Beach", "30-second walk"], ["Tulum Ruins", "15-minute bike ride"], ["Gran Cenote", "20-minute drive"], ["Tulum Town", "10-minute drive"], ["Cancún Airport (CUN)", "90-minute drive"]].map(([name, distance]) => <div key={name}><MapPin size={16} /><strong>{name}</strong><span>{distance}</span></div>)}</div>
          <button className="text-button" onClick={() => showInfo("About this location", "This original schematic is not a geographic map. The pin, address, nearby attractions, and travel times are illustrative, not verified directions. No live maps, geolocation, or external map service is used; exact property coordinates do not exist.")}>About the approximate location<ArrowRight size={16} /></button>
        </section>
      </div>
      {bookingOpen && <button className="booking-shade" aria-label="Close booking panel" onClick={() => setBookingOpen(false)} />}
      <aside className={`booking ${bookingOpen ? "mobile-open" : ""}`} id="booking" aria-label="Reservation planner">
        <button className="icon-button close-booking" aria-label="Close reservation planner" onClick={() => setBookingOpen(false)}><X /></button>
        <div className="booking-card"><div className="booking-eyebrow"><span /> BOOK DIRECT. STAY BETTER.</div><div className="price-row"><strong>{format(389)}</strong><span>/ night</span><del>{format(459)}</del><span className="discount">15% off*</span></div>
          <a className="booking-rating" href="#reviews"><Star size={13} fill="currentColor" />4.92 <span>· 127 illustrative reviews</span></a>
          <form onSubmit={event => { event.preventDefault(); setAttempted(true); if (!pricing.error) { setComplete(false); setDialog("reserve"); } }}>
            <div className="date-fields"><label>CHECK-IN<input aria-label="Check-in" type="date" min={DEMO_TODAY} max="2027-04-27" required value={checkIn} onChange={event => { setCheckIn(event.target.value); setAttempted(false); }} /></label><label>CHECK-OUT<input aria-label="Check-out" type="date" min={DEMO_TODAY} max="2027-04-30" required value={checkOut} onChange={event => { setCheckOut(event.target.value); setAttempted(false); }} /></label></div>
            <button className="guest-toggle" type="button" aria-expanded={guestOpen} aria-controls="guest-options" onClick={() => setGuestOpen(!guestOpen)}><span><small>GUESTS</small>{totalGuests} guest{totalGuests === 1 ? "" : "s"}{guests.pets ? " · 1 pet" : ""}</span><Users size={20} /></button>
            {guestOpen && <div id="guest-options" className="guest-options"><p>Max 6 people, including infants. At least 1 adult.</p>{(["adults", "children", "infants", "pets"] as const).map(key => {
              const maximum = key === "pets" ? 1 : guests[key] + 6 - totalGuests;
              const minimum = key === "adults" ? 1 : 0;
              return <div className="guest-row" key={key}><span><strong>{key[0].toUpperCase() + key.slice(1)}</strong><small>{key === "adults" ? "Age 13+" : key === "children" ? "Ages 2–12" : key === "infants" ? "Under 2 · counts toward capacity" : "$50 per night · max 1"}</small></span><div><button type="button" className="icon-button" aria-label={`Remove ${key}`} disabled={guests[key] <= minimum} onClick={() => setGuests({ ...guests, [key]: guests[key] - 1 })}><Minus size={16} /></button><span aria-label={`${key} count`}>{guests[key]}</span><button type="button" className="icon-button" aria-label={`Add ${key}`} disabled={guests[key] >= maximum} onClick={() => setGuests({ ...guests, [key]: guests[key] + 1 })}><Plus size={16} /></button></div></div>;
            })}</div>}
            {showError && pricing.error && <p className="error" role="alert">{pricing.error}</p>}
            <button className="primary reserve" type="submit">Reserve · preview only<ArrowRight size={18} /></button>
          </form>
          <p className="charge-note">You won’t be charged. No booking is created.</p>
          {!pricing.error ? <div className="breakdown" data-testid="price-breakdown"><div><span>{format(389)} × {pricing.nights} nights</span><span>{format(pricing.lodging)}</span></div><div><span>Cleaning fee</span><span>{format(pricing.cleaning)}</span></div>{guests.pets > 0 && <div><span>Pet fee · {pricing.nights} nights</span><span>{format(pricing.pets)}</span></div>}<div><span>Service fee</span><span>{format(0)}</span></div><p><Check size={13} />Direct booking — no platform fees</p><div><span>Taxes · 16% IVA</span><span>{format(pricing.tax)}</span></div><div className="total"><strong>Total <small>({currency})</small></strong><strong data-testid="total-price">{format(pricing.total)}</strong></div></div> : <div className="empty-quote"><CalendarDays size={20} /><span>Choose your dates to see a complete price breakdown.</span></div>}
          <p className="conversion-note">*Rounded illustrative discount. {currency === "USD" ? "IVA applies to accommodation, cleaning, and pet fees." : `Illustrative exchange: 1 USD = ${currency === "EUR" ? "0.92 EUR" : "0.79 GBP"}. Converted totals may round; USD is the authoritative preview.`}</p>
        </div>
        <div className="rare-find"><Diamond size={28} /><div><strong>A little paradise, all to yourself.</strong><p>“Rare find” is an illustrative claim, not live demand or a guarantee.</p></div></div>
        <div className="direct-note"><ShieldCheck size={18} /><span>Your stay. Your host. No middleman.<small>Fictional benefit · no payment protection offered.</small></span></div>
      </aside></div>

      <section className="section reviews-section" id="reviews"><div className="section-heading"><div><div className="eyebrow">THE LITTLE THINGS GUESTS REMEMBER</div><h2><Star size={24} fill="currentColor" />4.92 <span>· 127 illustrative reviews</span></h2></div><span className="pill"><ShieldCheck size={15} />Fictional guest stories</span></div><p className="section-subtitle">Six source-provided sample stories, not real endorsements. The summary is illustrative.</p>
        <div className="rating-grid">{[["Cleanliness", 5], ["Accuracy", 4.9], ["Communication", 5], ["Location", 4.9], ["Check-in", 5], ["Value", 4.8]].map(([label, value]) => <div key={label}><span>{label}</span><div className="rating-track"><i style={{ width: `${Number(value) * 20}%` }} /></div><strong>{Number(value).toFixed(1)}</strong></div>)}</div>
        <div className="reviews-grid">{reviews.map(review => <ReviewCard key={review.name} review={review} />)}</div><button className="outline" onClick={() => { setQuery(""); setDialog("reviews"); }}>Browse the 6 sample reviews<ArrowRight size={16} /></button>
      </section>
      <section className="section host-section" id="host"><div className="host-profile"><span className="avatar big">G<span><ShieldCheck size={17} /></span></span><div><div className="eyebrow">MEET YOUR HOST</div><h2>Hosted by Gabriela</h2><p>Joined in 2020 · 127 illustrative reviews</p><div className="host-badges"><span><Star size={14} />Superhost</span><span><ShieldCheck size={14} />Illustrative identity badge</span></div></div></div>
        <div className="host-content"><p>Born and raised in Mexico City, I fell in love with Tulum ten years ago and built Casa Azul as a dream project. I’m an architect by training — every corner was designed to connect you with the ocean and jungle. I live five minutes away and love helping guests discover the best of Tulum.</p><div><strong>Response rate: 98%</strong><p>Response time: within 1 hour</p><small>Fictional profile · no verified identity or real response guarantee.</small><button className="outline" onClick={() => { setComplete(false); setDialog("contact"); }}><MessageCircle size={18} />Message host</button></div></div>
        <div className="trust-note"><ShieldCheck size={19} /><span>Never transfer money to anyone based on this demo. There is no real host, messaging service, or payment-protection program.</span></div>
      </section>
      <section className="section policies" id="policies"><div className="section-heading"><h2>A few things to know</h2><span className="pill">Illustrative policies</span></div><div className="policy-grid">
        <div><h3><KeyRound size={19} />House rules</h3><ul><li>Check-in: 3:00 PM · smart lock</li><li>Checkout: 11:00 AM</li><li>Maximum 6 guests, including infants</li><li>No smoking inside; outdoor areas OK</li><li>No parties or events</li><li>1 pet allowed · $50/night</li></ul></div>
        <div><h3><CalendarDays size={19} />Cancellation policy</h3><span className="flexible">Flexible</span><ul><li>Full refund: 7+ days before check-in</li><li>50% refund: 3 to fewer than 7 days before</li><li>No refund: fewer than 3 days before</li></ul><button className="text-button" onClick={() => showInfo("Cancellation details", "Illustrative time boundaries: 7 or more full days before the 3 PM check-in receives 100%; 3 to fewer than 7 full days receives 50%; fewer than 3 full days receives 0%. These percentages apply to the total hypothetical stay price. Exactly 7 days is full; exactly 3 is 50%. No real cancellation, reservation, or refund occurs.")}>Read full policy<ArrowRight size={15} /></button></div>
        <div><h3><ShieldCheck size={19} />Safety & property</h3><ul><li>Exterior security cameras only</li><li>Carbon monoxide & smoke detectors</li><li>Pool has no gate or lock — supervise children</li><li>First aid kit & fire extinguisher</li></ul><button className="text-button" onClick={() => showInfo("Safety disclosures", "Fictional exterior cameras would cover the driveway and property entrance only, never indoor or private bathing areas. The pool is unfenced with no gate or lock; children require continuous adult supervision. Illustrative smoke and carbon monoxide detectors, first aid supplies, and a fire extinguisher are not verified amenities or safety guarantees.")}>View disclosures<ArrowRight size={15} /></button></div>
      </div></section>
      <section className="section similar-section" id="similar"><div className="section-heading"><div><div className="eyebrow">A DIFFERENT KIND OF GETAWAY</div><h2>More beachfront stays in Tulum</h2></div><span className="pill">Illustrative collection</span></div><p className="section-subtitle">Fictional alternatives · artwork reused from Casa Azul, not photos of these properties.</p><div className="similar-grid">{similar.map(stay => <article className="similar-card" key={stay.name}><div className="similar-image"><button className="stay-preview" aria-label={`Preview ${stay.name}`} onClick={() => showInfo(stay.name, `${stay.name} is a fictional alternative: ${stay.specs}, ${format(stay.price)} per night, illustrative rating ${stay.rating}. Its artwork is adapted from the Casa Azul illustrations and does not depict a separate real property. Availability and booking are not offered for this alternative.`)}><img src={stay.scene} alt={`Reused architectural illustration for fictional ${stay.name}`} /></button><span>{stay.tag}</span><button className="save-stay icon-button" aria-label={`Save ${stay.name}`} aria-pressed={saved.includes(stay.name)} onClick={() => toggleSave(stay.name)}><Heart size={18} fill={saved.includes(stay.name) ? "currentColor" : "none"} /></button></div><div className="similar-card-body"><button onClick={() => showInfo(stay.name, `${stay.specs} · ${format(stay.price)}/night · fictional rating ${stay.rating}. This alternative is an illustrative card, not a bookable property.`)}><h3>{stay.name}</h3></button><p>{stay.specs}</p><div><strong>{format(stay.price)} <small>/ night</small></strong><span>★ {stay.rating}</span></div></div></article>)}</div></section>
    </main>
    <footer><div className="container"><div className="footer-intro"><a href="#" className="brand"><span className="brand-icon"><House size={22} /></span>Stay<span>Direct</span><i /></a><p>Stay somewhere that stays with you.</p><span>Fictional direct-booking platform · local demo</span></div>
      <div className="footer-grid">{Object.entries({
        Explore: ["Beach Stays", "Mountain Retreats", "City Apartments", "Countryside", "Unique Stays", "New Listings"],
        Hosts: ["List Your Property", "Host Resources", "Pricing Calculator", "Insurance", "Host Community"],
        StayDirect: ["About Us", "How It Works", "Trust & Safety", "Careers", "Press", "Blog"],
        Support: ["Help", "Contact Us", "Cancellation Options", "Accessibility", "Report a Concern"],
      }).map(([heading, links]) => <div key={heading}><h3>{heading}</h3>{links.map(label => <button key={label} onClick={() => label === "Contact Us" ? setDialog("contact") : label === "Report a Concern" ? setDialog("report") : label === "Cancellation Options" ? document.getElementById("policies")?.scrollIntoView() : showInfo(label)}>{label === "Help" ? "Help Center" : label}</button>)}</div>)}</div>
      <div className="footer-bottom"><span>© 2026 StayDirect, Inc. · Fictional demo</span><div>{["Privacy", "Terms", "Sitemap"].map(label => <button key={label} onClick={() => showInfo(label, label === "Sitemap" ? "This page: property gallery, about the villa, bedrooms, amenities, availability, illustrative location, fictional reviews, host profile, house rules, cancellation and safety policies, and alternative stays. Use the main navigation to explore or Book Now to open the local reservation planner." : undefined)}>{label}</button>)}</div><div><button onClick={() => showInfo("Language", "This demonstration is available in English only. Currency controls offer illustrative USD, EUR, and GBP conversions, not live exchange rates.")}><Globe2 size={15} />English</button><select aria-label="Footer currency" value={currency} onChange={event => setCurrency(event.target.value as Currency)}><option>USD</option><option>EUR</option><option>GBP</option></select></div></div>
    </div></footer>
    <div className="mobile-booking-bar"><div><strong>{format(389)} <small>/ night</small></strong><span>{!pricing.error ? `${pricing.nights} nights · ${format(pricing.total)} total` : "3-night minimum · local preview"}</span></div><button className="primary" aria-expanded={bookingOpen} onClick={openBooking}>Reserve<ArrowRight size={16} /></button></div>
    {dialog && <Modal title={title} onClose={closeDialog} wide={dialog === "gallery" || dialog === "reviews"} onKeyDown={event => {
      if (dialog === "gallery") {
        if (event.key === "ArrowRight") setPhoto((photo + 1) % scenes.length);
        if (event.key === "ArrowLeft") setPhoto((photo + scenes.length - 1) % scenes.length);
      }
    }}>
      {dialog === "gallery" && <div className="lightbox"><p className="modal-note">8 illustrated views · 5 original scenes with 3 reused detail studies. Adapted from the 42-photo brief; no actual property photographs.</p>
        <div className="lightbox-image"><img src={scenes[photo].src} alt={scenes[photo].title} /><button className="icon-button light-prev" aria-label="Previous view" onClick={() => setPhoto((photo + scenes.length - 1) % scenes.length)}><ChevronLeft /></button><button className="icon-button light-next" aria-label="Next view" onClick={() => setPhoto((photo + 1) % scenes.length)}><ChevronRight /></button></div>
        <div className="lightbox-caption" aria-live="polite"><div><h3>{scenes[photo].title}</h3><p>{scenes[photo].detail}</p></div><span>{photo + 1} / 8</span></div>
        <div className="thumbnails">{scenes.map((scene, index) => <button key={scene.title} aria-label={`View ${index + 1}: ${scene.title}`} aria-pressed={photo === index} onClick={() => setPhoto(index)}><img src={scene.src} alt="" /></button>)}</div>
      </div>}
      {dialog === "amenities" && <><p className="modal-note">{Object.values(amenities).flat().length} fictional amenities. Private chef is extra; message the host for an illustrative estimate.</p><label className="search-label">Find an amenity<input type="search" value={amenityQuery} onChange={event => setAmenityQuery(event.target.value)} placeholder="Try “shower” or “WiFi”" /></label>{filteredAmenities.length ? filteredAmenities.map(([category, items]) => <section className="amenity-category" key={category}><h3>{category}</h3>{items.map(item => <p key={item}><Check size={16} />{item}</p>)}</section>) : <p role="status" className="empty-state">No amenities match. Try “pool”, “shower”, or clear your search.</p>}</>}
      {dialog === "reviews" && <><p className="modal-note">127 is the fictional listing summary, not a review dataset. Only the six sample stories below are available.</p><label className="search-label">Search sample reviews<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try “pool” or a city" /></label><p role="status">{filteredReviews.length} sample review{filteredReviews.length === 1 ? "" : "s"} found</p>{filteredReviews.length ? filteredReviews.map(review => <ReviewCard key={review.name} review={review} />) : <p className="empty-state">No stories match. Try a different word or clear the search.</p>}</>}
      {dialog === "share" && <><div className="share-preview"><img src="/villa.svg" alt="Illustration of Casa Azul’s infinity pool" /><h3>Casa Azul, Tulum</h3><p>An illustrated beachfront escape.</p></div><label className="search-label">Local demo link<input readOnly aria-label="Share link" value={typeof window !== "undefined" ? `${window.location.origin}/#about` : ""} onFocus={event => event.currentTarget.select()} /></label><button className="primary" onClick={async () => {
        try { await navigator.clipboard.writeText(`${window.location.origin}/#about`); setCopyState("Copied the local demo link. It is only reachable while this local server runs."); }
        catch { setCopyState("Clipboard unavailable. Select the link above and copy it manually."); }
      }}>Copy demo link<Share2 size={16} /></button><p role="status">{copyState}</p><p className="modal-note">No social-network connection or external sharing service.</p></>}
      {(dialog === "reserve" || dialog === "contact" || dialog === "report") && (complete ? <div className="confirmation" role="status"><span><Check size={30} /></span><h3>{dialog === "reserve" ? "Your stay preview is ready" : dialog === "contact" ? "Your message preview is ready" : "Your concern preview is ready"}</h3><p>Thank you, {preview.name}. {dialog === "reserve" ? `Casa Azul · ${checkIn} to ${checkOut} · ${pricing.nights} nights · ${totalGuests} guests${guests.pets ? " · 1 pet" : ""} · ${format(pricing.total)}.` : "This form has been validated locally."}</p>
        <div className="validated-preview"><p>From: {preview.name} · {preview.email}</p>{dialog !== "reserve" && <p>To: {dialog === "contact" ? "Gabriela (fictional host)" : "StayDirect support (fictional)"}</p>}{preview.category && <p>Category: {preview.category}</p>}{preview.message && <blockquote>{preview.message}</blockquote>}</div>
        <strong>Nothing was booked, charged, sent, or saved to a server.</strong><p>Preview only · disappears when this dialog closes. Do not travel or transfer money based on this demo.</p><button className="primary" onClick={closeDialog}>Back to Casa Azul</button></div> : <form className="preview-form" onSubmit={submitPreview}>
        <p className="modal-note"><Mail size={17} />Local-only preview. Use fictional contact details. No email, booking, payment, or message will be sent.</p>
        {dialog === "reserve" && <div className="reservation-summary"><h3>Casa Azul · entire villa</h3><p>{checkIn} → {checkOut} · {pricing.nights} nights</p><p>{totalGuests} guests{guests.pets ? " · 1 pet" : ""}</p><strong>{format(pricing.total)} total</strong><small>{format(pricing.lodging)} accommodation + {format(pricing.cleaning)} cleaning{guests.pets ? ` + ${format(pricing.pets)} pet fee` : ""} + {format(pricing.tax)} IVA · no service fee</small></div>}
        {dialog === "report" && <label>Concern category<select name="category"><option>Misleading listing information</option><option>Safety concern</option><option>Accessibility issue</option><option>Other</option></select></label>}
        <label>Your name<input name="name" required minLength={2} maxLength={80} autoComplete="off" placeholder="Alex Example" /></label>
        <label>Email<input name="email" type="email" required maxLength={120} autoComplete="off" placeholder="alex@example.com" /></label>
        <label>{dialog === "reserve" ? "Note for Gabriela (optional)" : dialog === "report" ? "Describe your concern" : "Your message"}<textarea name="message" required={dialog !== "reserve"} minLength={dialog === "reserve" ? undefined : 10} maxLength={1000} rows={4} placeholder={dialog === "contact" ? "Ask about the chef, pet policy, or a longer stay…" : "Write your local preview here…"} /></label>
        <label className="consent"><input type="checkbox" required />{dialog === "reserve" ? "I understand the fictional house rules, cancellation policy, and unfenced pool disclosure. This is not a booking." : "I understand this is a local preview and will not be sent."}</label>
        {formError && <p className="error" role="alert">{formError}</p>}
        <button className="primary" type="submit">{dialog === "reserve" ? "Create reservation preview" : dialog === "contact" ? "Preview message" : "Preview concern"}<ArrowRight size={17} /></button>
      </form>)}
      {dialog === "info" && <div className="information"><span className="info-icon"><Sparkles size={30} /></span><p>{info.text}</p><button className="outline" onClick={closeDialog}>Back to the listing<ArrowRight size={16} /></button></div>}
    </Modal>}
  </>;
}
